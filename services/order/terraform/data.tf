data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-order" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "kv-${var.project_name}"
}

data "azurerm_key_vault_secret" "order-db-login" {
  name         = "order-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-order.id
}
data "azurerm_key_vault_secret" "order-db-password" {
  name         = "order-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-order.id
}