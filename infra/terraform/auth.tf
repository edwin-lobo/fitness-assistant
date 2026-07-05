# Azure AD B2C directory — replaces Supabase Auth (auth.users + JWT issuance).
# This provisions the CIAM tenant. The user flows (sign-up/sign-in) and the
# SPA app registration are configured against this tenant after it exists —
# see README, "Post-apply: auth wiring". The app_role model (provider/client
# public, admin/mod managed) maps to B2C custom attributes / app roles there.
resource "azurerm_aadb2c_directory" "auth" {
  resource_group_name     = azurerm_resource_group.main.name
  country_code            = var.b2c_country_code
  data_residency_location = var.b2c_data_residency
  display_name            = "Fitness Assistant Auth"
  domain_name             = "fitnessassistant${random_string.suffix.result}.onmicrosoft.com"
  sku_name                = "PremiumP1"

  tags = local.tags
}

variable "b2c_country_code" {
  description = "ISO country code for the B2C tenant (e.g. US)."
  type        = string
  default     = "US"
}

variable "b2c_data_residency" {
  description = "B2C data residency location: United States, Europe, Asia Pacific, or Australia."
  type        = string
  default     = "United States"
}
