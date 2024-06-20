data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-payment" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "keyvault-${var.project_name}"
}

data "azurerm_key_vault_secret" "payment-db-login" {
  name         = "payment-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-payment.id
}
data "azurerm_key_vault_secret" "payment-db-password" {
  name         = "payment-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-payment.id
}