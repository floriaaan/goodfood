data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault_secret" "delivery-db-login" {
  name         = "delivery-db-login"
  key_vault_id = azurerm_key_vault.kv-goodfood-delivery.id
}
data "azurerm_key_vault_secret" "delivery-db-password" {
  name         = "delivery-db-password"
  key_vault_id = azurerm_key_vault.kv-goodfood-delivery.id
}
data "azurerm_client_config" "current" {}
