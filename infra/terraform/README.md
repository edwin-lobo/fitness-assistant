# Azure Claude Stack (Terraform)

Infrastructure that replaces the hosted **Supabase** dependency with an
Azure-native stack, provisioned with Terraform. Aligns with the homelab spec
(`../homelab/crews/azure.md`): fitness-assistant is the **Azure** project and
**Databricks** is its key service.

## What this replaces

| Supabase piece | Azure resource | File |
|---|---|---|
| Auth (`auth.users`, JWT) | Azure AD B2C directory | `auth.tf` |
| Postgres `profiles` table + `app_role` + RLS | PostgreSQL Flexible Server | `postgres.tf` |
| Managed credentials | Key Vault (password + connection string) | `keyvault.tf` |
| — *(spec-mandated addition)* | Azure Databricks workspace | `databricks.tf` |

The frontend stays on **GitHub Pages** — Azure hosting is out of scope per the
homelab spec. This stack is the backend only.

## Layout

```
infra/terraform/
├── main.tf                    # providers, backend, vars, resource group, tags
├── postgres.tf                # Flexible Server + fitness_assistant DB + firewall
├── keyvault.tf                # Key Vault + secrets + RBAC role assignment
├── auth.tf                    # Azure AD B2C directory
├── databricks.tf              # Databricks workspace
├── outputs.tf                 # fqdn, vault uri, workspace url, b2c domain
├── .gitignore                 # never commit tfvars / state
└── terraform.tfvars.example   # copy → terraform.tfvars
```

## Prerequisites

- Terraform >= 1.6
- Azure CLI, logged in: `az login`
- The signed-in principal is **Owner** (or Contributor + User Access
  Administrator) on the subscription — needed to self-assign the Key Vault
  Secrets Officer role in `keyvault.tf`.

## Apply

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # then edit
terraform init
terraform plan
terraform apply
```

## Post-apply: load the profiles schema

The schema in `../../supabase/migrations/` is portable Postgres (the
`../../database/bootstrap/` shims prove it runs on vanilla PG), so it applies to
the new server unchanged. Set `admin_ip_address` first so the firewall lets you in:

```bash
PGPASSWORD=$(az keyvault secret show \
  --vault-name "$(terraform output -raw key_vault_uri | sed 's|https://||;s|/||g;s|.vault.azure.net||')" \
  --name postgres-admin-password --query value -o tsv)

psql "host=$(terraform output -raw postgres_server_fqdn) \
  user=$(terraform output -raw postgres_admin_username) \
  dbname=$(terraform output -raw postgres_database_name) sslmode=require" \
  -f ../../database/bootstrap/000_supabase_compat.sql \
  -f ../../supabase/migrations/202605160001_auth_profiles.sql
```

## Post-apply: auth wiring

Azure AD B2C needs its user flows and SPA app registration configured against
the tenant after it exists (not fully Terraformable pre-tenant). In the B2C
tenant (`terraform output b2c_tenant_domain`):

1. Create a **Sign up and sign in** user flow.
2. Register the SPA app; add the GitHub Pages URL as a redirect URI.
3. Add a `role` custom attribute mapping the `app_role` values
   (`provider`/`client` public, `admin`/`mod` managed).

## Follow-up (not in this stack)

Rewiring `src/lib/supabase.ts` from `@supabase/supabase-js` to the Azure SDKs
(MSAL for B2C auth, `pg`/PostgREST for the profiles data) is a separate change.
Until then the app runs unauthenticated — `isSupabaseConfigured` already gates
all Supabase usage, so nothing breaks.
