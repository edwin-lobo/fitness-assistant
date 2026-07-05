# Azure Databricks workspace — the homelab-mandated key service for
# fitness-assistant (see homelab crews/azure.md: "Databricks for data
# processing and ML pipelines, not just storage"). This is the nutrition
# and wellness data pipeline layer; jobs/notebooks/Delta tables are added
# by the Data role once the workspace is provisioned.
resource "azurerm_databricks_workspace" "main" {
  name                = "${local.name_prefix}-dbx"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.databricks_sku

  # Databricks creates a locked, managed resource group for its own
  # compute/networking; name it explicitly so it's identifiable.
  managed_resource_group_name = "${local.name_prefix}-dbx-managed"

  tags = local.tags
}

variable "databricks_sku" {
  description = "Databricks pricing tier: standard, premium, or trial. premium is required for RBAC/Unity Catalog."
  type        = string
  default     = "premium"
}
