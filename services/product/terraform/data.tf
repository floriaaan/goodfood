data "azurerm_client_config" "product-client-conf" {
}

data "azurerm_resource_group" "rg-goodfood" {
  name     = "rg-${var.project_name}-${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-product" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name                = "kv-${var.project_name}-product"
}

data "azurerm_key_vault_secret" "product-db-login" {
  name         = "product-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-product.id
}

data "azurerm_key_vault_secret" "product-db-password" {
  name         = "product-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-product.id
}

data "azurerm_storage_account_blob_container_sas" "sa-goodfood" {
  connection_string = azurerm_storage_account.stac-goodfood-product.primary_connection_string
  container_name    = azurerm_storage_container.sc-goodfood-product.name
  https_only        = true


  start  = timeadd(timestamp(), "0h")
  expiry = timeadd(timestamp(), "72h")


  permissions {
    read   = true
    add    = true
    create = true
    write  = true
    delete = true
    list   = true
  }
}