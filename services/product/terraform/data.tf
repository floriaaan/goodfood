data "azurerm_resource_group" "rg-goodfood" {
	name = "rg-${var.project_name}${var.environnment_suffix}"
	location = var.location
}

data "azurerm_storage_account_sas" "sa-goodfood" {
  connection_string = azurerm_storage_account.stac-goodfood-product.primary_connection_string
  https_only        = true
  signed_version    = "2017-07-29"

  resource_types {
    service   = true
    container = false
    object    = false
  }

  services {
    blob  = true
    queue = false
    table = false
    file  = false
  }

  start  = "2023-01-01T000000Z"
  expiry = "2023-12-01T000000Z"

  permissions {
    read    = true
    write   = true
    delete  = false
    list    = true
    add     = false
    create  = true
    update  = false
    process = false
    tag     = false
    filter  = false
  }
}

data "azurerm_key_vault" "kv-goodfood-product" {
	resource_group_name = data.azurerm_resource_group.rg-goodfood.name
	name = "kv-${var.project_name}"
}

data "azurerm_key_vault_secret" "product-db-login" {
	name         = "product-db-login"
	key_vault_id = data.azurerm_key_vault.kv-goodfood-product.id
}

data "azurerm_key_vault_secret" "product-db-password" {
	name         = "product-db-password"
	key_vault_id = data.azurerm_key_vault.kv-goodfood-product.id
}