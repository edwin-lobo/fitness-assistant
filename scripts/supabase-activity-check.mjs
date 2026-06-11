const DEFAULT_SELECT = 'id';
const DEFAULT_LIMIT = '1';

export function getSupabaseConfig(env = process.env) {
  const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  return {
    url: url.replace(/\/+$/, ''),
    anonKey,
  };
}

export function buildActivityCheckRequest(config) {
  const endpoint = new URL(`${config.url}/rest/v1/public_profiles`);
  endpoint.searchParams.set('select', DEFAULT_SELECT);
  endpoint.searchParams.set('limit', DEFAULT_LIMIT);

  return {
    url: endpoint.toString(),
    options: {
      method: 'GET',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    },
  };
}

export async function runActivityCheck({ env = process.env, fetchImpl = fetch } = {}) {
  const config = getSupabaseConfig(env);
  const request = buildActivityCheckRequest(config);
  const response = await fetchImpl(request.url, request.options);

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase activity check failed with ${response.status}. ${detail}`.trim());
  }

  return {
    ok: true,
    status: response.status,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runActivityCheck()
    .then((result) => {
      console.log(`Supabase activity check passed with HTTP ${result.status}.`);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
