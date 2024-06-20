data "azurerm_client_config" "product-client-conf" {
}

data "azurerm_resource_group" "rg-gf-paf" {
  name     = "rg-gf-paf-dev"
}

data "azurerm_key_vault" "kv-gf-paf-user" {
  resource_group_name = data.azurerm_resource_group.rg-gf-paf.name
  name                = "keyvaultgfpaf${var.environnment_suffix}user"
}

data "azurerm_key_vault_secret" "db-login" {
  name         = "db-login"
  key_vault_id = data.azurerm_key_vault.kv-gf-paf-user.id
}

data "azurerm_key_vault_secret" "db-password" {
  name         = "db-password"
  key_vault_id = data.azurerm_key_vault.kv-gf-paf-user.id
}

data "terraform_remote_state" "aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-gf-paf-dev"
    storage_account_name = "sagoodfoodpaf"
    container_name       = "tfstate"
    key                  = "main-dev.tfstate"
  }
}

data "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = data.terraform_remote_state.aks.outputs.kubernetes_cluster_name
  resource_group_name = data.terraform_remote_state.aks.outputs.resource_group_name
}