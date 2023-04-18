data "azurerm_resource_group" "rg-goodfood" {
	name = "rg-${var.project_name}${var.environnment_suffix}"
	location = var.location
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