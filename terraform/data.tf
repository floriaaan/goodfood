data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}${var.environnment_suffix}"
}

data "azurerm_key_vault" "kv-goodfood" {
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  name = "kv-${var.project_name}"
}

