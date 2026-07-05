output "resource_group_name" {
  description = "Resource group holding the whole stack."
  value       = azurerm_resource_group.main.name
}

output "postgres_server_fqdn" {
  description = "Postgres host — the DB half of the old Supabase project."
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_database_name" {
  description = "Database that holds the profiles schema."
  value       = azurerm_postgresql_flexible_server_database.profiles.name
}

output "postgres_admin_username" {
  description = "Postgres admin login."
  value       = azurerm_postgresql_flexible_server.main.administrator_login
}

output "key_vault_uri" {
  description = "Key Vault URI. Postgres password + connection string live here."
  value       = azurerm_key_vault.main.vault_uri
}

output "postgres_connection_string_secret" {
  description = "Key Vault secret name for the full connection string."
  value       = azurerm_key_vault_secret.pg_connection_string.name
}

output "databricks_workspace_url" {
  description = "Databricks workspace URL for nutrition/wellness pipelines."
  value       = azurerm_databricks_workspace.main.workspace_url
}

output "b2c_tenant_domain" {
  description = "Azure AD B2C domain — replaces Supabase Auth. Configure user flows + app registration here."
  value       = azurerm_aadb2c_directory.auth.domain_name
}

output "b2c_tenant_id" {
  description = "Azure AD B2C tenant ID."
  value       = azurerm_aadb2c_directory.auth.tenant_id
}
