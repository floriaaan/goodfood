data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-stock" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "kv-${var.project_name}"
}

data "azurerm_key_vault_secret" "stock-db-login" {
  name         = "stock-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-stock.id
}
data "azurerm_key_vault_secret" "stock-db-password" {
  name         = "stock-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-stock.id
}