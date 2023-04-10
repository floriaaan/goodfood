data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-delivery" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "kv-${var.project_name}"
}

data "azurerm_key_vault_secret" "delivery-db-login" {
  name         = "delivery-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-delivery.id
}
data "azurerm_key_vault_secret" "delivery-db-password" {
  name         = "delivery-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-delivery.id
}