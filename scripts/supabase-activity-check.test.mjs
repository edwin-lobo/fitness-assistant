import assert from 'node:assert/strict';
import test from 'node:test';
import { buildActivityCheckRequest, getSupabaseConfig, runActivityCheck } from './supabase-activity-check.mjs';

test('builds the public profile smoke-check request', () => {
  const request = buildActivityCheckRequest({
    url: 'https://project-ref.supabase.co',
    anonKey: 'sb_publishable_test',
  });

  assert.equal(request.url, 'https://project-ref.supabase.co/rest/v1/public_profiles?select=id&limit=1');
  assert.equal(request.options.method, 'GET');
  assert.equal(request.options.headers.apikey, 'sb_publishable_test');
  assert.equal(request.options.headers.Authorization, 'Bearer sb_publishable_test');
});

test('normalizes Supabase URL and supports non-Vite env aliases', () => {
  const config = getSupabaseConfig({
    SUPABASE_URL: 'https://project-ref.supabase.co/',
    SUPABASE_ANON_KEY: 'anon-key',
  });

  assert.deepEqual(config, {
    url: 'https://project-ref.supabase.co',
    anonKey: 'anon-key',
  });
});

test('requires Supabase URL and anon key', () => {
  assert.throws(() => getSupabaseConfig({}), /Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY/);
});

test('runActivityCheck resolves on a successful response', async () => {
  const result = await runActivityCheck({
    env: {
      VITE_SUPABASE_URL: 'https://project-ref.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'anon-key',
    },
    fetchImpl: async () => ({
      ok: true,
      status: 200,
    }),
  });

  assert.deepEqual(result, {
    ok: true,
    status: 200,
  });
});

test('runActivityCheck rejects on a failed response', async () => {
  await assert.rejects(
    runActivityCheck({
      env: {
        VITE_SUPABASE_URL: 'https://project-ref.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon-key',
      },
      fetchImpl: async () => ({
        ok: false,
        status: 401,
        text: async () => 'Invalid API key',
      }),
    }),
    /Supabase activity check failed with 401. Invalid API key/,
  );
});
