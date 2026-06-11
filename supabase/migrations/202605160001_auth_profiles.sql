do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'app_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.app_role as enum ('provider', 'client', 'admin', 'mod');
  end if;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'client',
  public_profile boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.public_profiles as
select id, full_name, role, public_profile, created_at
from public.profiles
where public_profile = true
  and role in ('provider', 'client');

alter table public.profiles enable row level security;

create index if not exists profiles_role_public_profile_idx on public.profiles (role, public_profile)
where public_profile = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.is_managed_role(next_role public.app_role)
returns boolean
language sql
immutable
as $$
  select next_role in ('admin', 'mod');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.app_role;
begin
  requested_role := case
    when new.raw_user_meta_data->>'public_signup_role' = 'provider' then 'provider'::public.app_role
    else 'client'::public.app_role
  end;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), split_part(new.email, '@', 1)),
    requested_role
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

drop policy if exists "Users can read their own profile" on public.profiles;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their public profile fields" on public.profiles;

create policy "Users can update their public profile fields"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and not public.is_managed_role(role)
);

drop policy if exists "Public can read published provider and client profiles" on public.profiles;

create policy "Public can read published provider and client profiles"
on public.profiles
for select
to anon, authenticated
using (
  public_profile = true
  and role in ('provider', 'client')
);

grant select on public.public_profiles to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (full_name, public_profile) on public.profiles to authenticated;
