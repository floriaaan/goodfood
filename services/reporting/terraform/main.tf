terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.48.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_deleted_secrets_on_destroy = true
      recover_soft_deleted_secrets          = true
    }
  }
}

resource "azurerm_key_vault" "kv-goodfood-reporting" {
  name                       = "kv-goodfood-reporting"
  location                   = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name        = data.azurerm_resource_group.rg-goodfood.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_postgresql_server" "pg-goodfood-reporting" {
  name                = "pg-goodfood-reporting${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_reportingin          = data.azurerm_key_vault_secret.reporting-db-reportingin.value
  administrator_reportingin_password = data.azurerm_key_vault_secret.reporting-db-password.value
  version                      = "11"

  ssl_enforcement_enabled          = false
  ssl_minimal_tls_version_enforced = "TLSEnforcementDisabled" // TODO: change to TLS1_2

}

resource "azurerm_postgresql_firewall_rule" "pgfw-goodfood-reporting" {
  name                = "allow-azure-resources"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pg-goodfood-reporting.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}
