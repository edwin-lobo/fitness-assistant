# Supabase Activity Check

Supabase Free Plan projects can be paused after low activity. For production guarantees, upgrade to Pro. For an active MVP, a lightweight scheduled smoke check can also confirm that the hosted API is reachable without running CI against the hosted database.

Use the public `public_profiles` view because it is read-only, allows anonymous reads through RLS, and returns `200` even when there are no published profiles.

## Endpoint

```text
${VITE_SUPABASE_URL}/rest/v1/public_profiles?select=id&limit=1
```

Required headers:

```text
apikey: ${VITE_SUPABASE_ANON_KEY}
Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}
```

The anon key is a browser-safe public key, but still keep it in managed configuration rather than pasting it into public logs.

## Local Cron

The repo includes a dependency-free Node smoke-check script:

```bash
npm run supabase:activity-check
```

Add this to a local crontab if the machine is reliably online:

```cron
0 9 * * * cd /Users/edwinlobo/fitness-assistant && /usr/bin/env npm run supabase:activity-check >/dev/null
```

This depends on `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` being available in the cron environment. On macOS, it is usually more reliable to wrap the command in a small shell script that exports those values first.

## GCP Cloud Scheduler

Cloud Scheduler can call Supabase directly, so you do not need Cloud Run for this basic check.

```bash
gcloud scheduler jobs create http fitness-assistant-supabase-ping \
  --location=us-east1 \
  --schedule="0 9 * * *" \
  --time-zone="America/New_York" \
  --uri="${VITE_SUPABASE_URL}/rest/v1/public_profiles?select=id&limit=1" \
  --http-method=GET \
  --headers="apikey=${VITE_SUPABASE_ANON_KEY},Authorization=Bearer ${VITE_SUPABASE_ANON_KEY}"
```

If the `Authorization` header is awkward to configure in the CLI because of the space in `Bearer ...`, create the job in the Google Cloud Console and add the two headers in the UI.

Recommended schedule: once daily. Avoid frequent pings; this is a health check, not a load generator.

## When to Upgrade Instead

Upgrade the Supabase project before treating the app as production, especially if:

- users depend on the app daily
- auth emails need reliable delivery
- project pause would create support burden
- you need backups, higher resource limits, or support guarantees
