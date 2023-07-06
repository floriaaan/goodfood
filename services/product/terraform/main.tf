terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.48.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_postgresql_server" "pg-goodfood-product" {
  name                = "pg-goodfood-product-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = data.azurerm_key_vault_secret.product-db-login.value
  administrator_login_password = data.azurerm_key_vault_secret.product-db-password.value
  version                      = "11"

  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2" 

}

resource "azurerm_postgresql_database" "db-goodfood-product" {
  name                = "db-goodfood-product-${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pg-goodfood-product.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}

resource "azurerm_postgresql_firewall_rule" "pgfw-goodfood-product" {
  name                = "allow-azure-resources"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pg-goodfood-product.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

resource "azurerm_storage_account" "stac-goodfood-product" {
  name                     = "stacgoodfoodproduct${var.environnment_suffix}"
  resource_group_name      = data.azurerm_resource_group.rg-goodfood.name
  location                 = data.azurerm_resource_group.rg-goodfood.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  blob_properties{
    cors_rule{
        allowed_headers = ["*"]
        allowed_methods = ["GET","HEAD","POST","PUT", "DELETE", "MERGE", "OPTIONS"]
        allowed_origins = ["*"]
        exposed_headers = ["*"]
        max_age_in_seconds = 86400
        }
    }
}
resource "azurerm_storage_container" "sc-goodfood-product" {
  name                  = "image"
  storage_account_name  = azurerm_storage_account.stac-goodfood-product.name
  container_access_type = "private"
}

resource "azurerm_role_assignment" "rlas-goodfood-product" {
  scope                = azurerm_storage_account.stac-goodfood-product.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.product-client-conf.object_id
}