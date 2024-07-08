data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-reporting" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "keyvault-${var.project_name}"
}

data "azurerm_key_vault_secret" "reporting-db-login" {
  name         = "reporting-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-reporting.id
}
data "azurerm_key_vault_secret" "reporting-db-password" {
  name         = "reporting-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-reporting.id
}
