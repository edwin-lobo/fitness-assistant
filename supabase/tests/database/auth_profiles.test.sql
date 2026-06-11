begin;

select plan(7);

select has_type('public', 'app_role', 'app_role enum exists');
select has_table('public', 'profiles', 'profiles table exists');
select has_view('public', 'public_profiles', 'public profiles view exists');
select has_function('public', 'handle_new_user', 'new user trigger function exists');

select is(public.is_managed_role('admin'::public.app_role), true, 'admin is a managed role');
select is(public.is_managed_role('provider'::public.app_role), false, 'provider is a public signup role');

insert into auth.users (id, email, raw_user_meta_data)
values (
  '11111111-1111-4111-8111-111111111111',
  'provider@example.test',
  '{"full_name":"Provider Example","public_signup_role":"provider"}'::jsonb
);

select results_eq(
  $$ select full_name, role::text from public.profiles where id = '11111111-1111-4111-8111-111111111111'::uuid $$,
  $$ values ('Provider Example'::text, 'provider'::text) $$,
  'auth trigger creates provider profile from public signup metadata'
);

select * from finish();

rollback;
