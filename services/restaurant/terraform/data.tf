data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault_secret" "restaurant-db-login" {
  name         = "restaurant-db-login"
  key_vault_id = azurerm_key_vault.kv-goodfood-restaurant.id
}
data "azurerm_key_vault_secret" "restaurant-db-password" {
  name         = "restaurant-db-password"
  key_vault_id = azurerm_key_vault.kv-goodfood-restaurant.id
}
data "azurerm_client_config" "current" {}
