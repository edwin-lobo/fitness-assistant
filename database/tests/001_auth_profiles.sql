do $$
declare
  provider_id uuid := '11111111-1111-4111-8111-111111111111';
  forged_admin_id uuid := '22222222-2222-4222-8222-222222222222';
  role_update_failed boolean := false;
  visible_profile_count integer;
begin
  if not exists (select 1 from pg_type where typname = 'app_role' and typnamespace = 'public'::regnamespace) then
    raise exception 'app_role enum is missing';
  end if;

  if not exists (select 1 from pg_enum where enumlabel = 'provider' and enumtypid = 'public.app_role'::regtype) then
    raise exception 'provider role is missing from app_role';
  end if;

  if not public.is_managed_role('admin'::public.app_role) then
    raise exception 'admin should be a managed role';
  end if;

  if public.is_managed_role('provider'::public.app_role) then
    raise exception 'provider should be a public signup role';
  end if;

  insert into auth.users (id, email, raw_user_meta_data)
  values (
    provider_id,
    'provider@example.test',
    '{"full_name":"Provider Example","public_signup_role":"provider"}'::jsonb
  );

  if not exists (
    select 1
    from public.profiles
    where id = provider_id
      and full_name = 'Provider Example'
      and role = 'provider'
  ) then
    raise exception 'provider signup did not create expected profile';
  end if;

  insert into auth.users (id, email, raw_user_meta_data)
  values (
    forged_admin_id,
    'forged-admin@example.test',
    '{"full_name":"Forged Admin","public_signup_role":"admin"}'::jsonb
  );

  if not exists (
    select 1
    from public.profiles
    where id = forged_admin_id
      and role = 'client'
  ) then
    raise exception 'forged managed role signup should fall back to client';
  end if;

  update public.profiles set public_profile = true where id in (provider_id, forged_admin_id);

  insert into public.profiles (id, full_name, role, public_profile)
  values ('33333333-3333-4333-8333-333333333333', 'Admin Example', 'admin', true);

  select count(*) into visible_profile_count
  from public.public_profiles
  where id in (provider_id, forged_admin_id, '33333333-3333-4333-8333-333333333333'::uuid);

  if visible_profile_count <> 2 then
    raise exception 'public_profiles should expose only provider/client rows, got %', visible_profile_count;
  end if;

  begin
    execute 'set local role authenticated';
    perform set_config('request.jwt.claim.sub', provider_id::text, true);
    update public.profiles set role = 'client' where id = provider_id;
  exception
    when insufficient_privilege then
      role_update_failed := true;
  end;

  if not role_update_failed then
    raise exception 'authenticated users should not be able to update profile role';
  end if;
end;
$$;
