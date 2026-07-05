# Key Vault — holds the Postgres admin password + connection string.
# Replaces Supabase's managed-credential storage. Secrets never land in
# terraform.tfvars or .env; the app reads them from the vault at deploy time.
resource "azurerm_key_vault" "main" {
  name                = "fa-kv-${random_string.suffix.result}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  # RBAC instead of legacy access policies — least privilege, matches
  # homelab's "least privilege IAM throughout" decision.
  rbac_authorization_enabled = true
  purge_protection_enabled   = false

  tags = local.tags
}

# Let the deploying principal write secrets during apply. Requires the
# principal to be Owner/User Access Administrator on the subscription.
resource "azurerm_role_assignment" "kv_secrets_officer" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_key_vault_secret" "pg_admin_password" {
  name         = "postgres-admin-password"
  value        = random_password.pg_admin.result
  key_vault_id = azurerm_key_vault.main.id
  tags         = local.tags

  depends_on = [azurerm_role_assignment.kv_secrets_officer]
}

resource "azurerm_key_vault_secret" "pg_connection_string" {
  name         = "postgres-connection-string"
  value        = "postgresql://${azurerm_postgresql_flexible_server.main.administrator_login}:${random_password.pg_admin.result}@${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.profiles.name}?sslmode=require"
  key_vault_id = azurerm_key_vault.main.id
  tags         = local.tags

  depends_on = [azurerm_role_assignment.kv_secrets_officer]
}
