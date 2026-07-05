# Azure Database for PostgreSQL Flexible Server — replaces the Supabase
# Postgres that hosts the `profiles` table + `app_role` enum + RLS policies.
# The existing schema in supabase/migrations/ is portable Postgres (the
# database/bootstrap/ shims already prove it runs on vanilla PG), so it
# applies here unchanged after provisioning. See README for the load step.

resource "random_password" "pg_admin" {
  length           = 24
  special          = true
  override_special = "!#$%*-_"
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                = "${local.name_prefix}-pg-${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  version                = "15" # match supabase/config.toml major_version
  administrator_login    = "fitnessadmin"
  administrator_password = random_password.pg_admin.result

  sku_name   = "B_Standard_B1ms" # burstable, smallest tier — right-size later
  storage_mb = 32768
  zone       = "1"

  # Public endpoint gated by firewall rules below. Switch to a delegated
  # subnet / private endpoint when the app moves off GitHub Pages.
  public_network_access_enabled = true

  tags = local.tags

  lifecycle {
    # Zone can be reassigned by Azure on some operations; ignore drift.
    ignore_changes = [zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "profiles" {
  name      = "fitness_assistant"
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"
}

# Allow other Azure services (e.g. Databricks) to reach the server.
resource "azurerm_postgresql_flexible_server_firewall_rule" "azure_services" {
  name             = "allow-azure-services"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Optional: allow a single operator IP to apply the schema / debug.
# Leave admin_ip_address empty to skip this rule.
resource "azurerm_postgresql_flexible_server_firewall_rule" "operator" {
  count            = var.admin_ip_address == "" ? 0 : 1
  name             = "allow-operator"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = var.admin_ip_address
  end_ip_address   = var.admin_ip_address
}

variable "admin_ip_address" {
  description = "Your public IP, to open a firewall rule for schema loading / psql. `curl -s ifconfig.me`. Empty = no operator rule."
  type        = string
  default     = ""
}
