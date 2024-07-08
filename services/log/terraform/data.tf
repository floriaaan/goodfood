data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood-log" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "kv-${var.project_name}"
}

data "azurerm_key_vault_secret" "log-db-login" {
  name         = "log-db-login"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-log.id
}
data "azurerm_key_vault_secret" "log-db-password" {
  name         = "log-db-password"
  key_vault_id = data.azurerm_key_vault.kv-goodfood-log.id
}