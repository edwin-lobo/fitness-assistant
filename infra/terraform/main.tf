terraform {
  required_version = ">= 1.6"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3"
    }
  }

  # Uncomment to store state in Azure Blob Storage after the backend
  # storage account + container exist (create them once, out of band):
  #   az group create -n tfstate-rg -l eastus
  #   az storage account create -n <globally-unique> -g tfstate-rg --sku Standard_LRS
  #   az storage container create -n tfstate --account-name <globally-unique>
  # backend "azurerm" {
  #   resource_group_name  = "tfstate-rg"
  #   storage_account_name = "faclaudetfstate"
  #   container_name       = "tfstate"
  #   key                  = "fitness-assistant.tfstate"
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

data "azurerm_client_config" "current" {}

variable "subscription_id" {
  description = "Azure subscription ID — not secret, safe to commit. `az account show --query id -o tsv`"
  type        = string
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "eastus"
}

variable "project" {
  description = "Project slug — used as the base for every resource name."
  type        = string
  default     = "fitness-assistant"
}

variable "environment" {
  description = "Deployment environment (prod, staging, dev)."
  type        = string
  default     = "prod"
}

variable "extra_tags" {
  description = "Additional tags merged onto every resource."
  type        = map(string)
  default     = {}
}

# Short random suffix so globally-unique names (Postgres, Key Vault, B2C domain)
# don't collide across environments or re-creates.
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  name_prefix = "${var.project}-${var.environment}"

  tags = merge({
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
    stack       = "azure-claude-stack"
    replaces    = "supabase"
  }, var.extra_tags)
}

resource "azurerm_resource_group" "main" {
  name     = "${local.name_prefix}-rg"
  location = var.location
  tags     = local.tags
}
