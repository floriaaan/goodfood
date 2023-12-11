data "azurerm_client_config" "gateway-client-conf" {
}

data "azurerm_resource_group" "rg-goodfood" {
  name     = "rg-${var.project_name}${var.environnment_suffix}"
}

data "terraform_remote_state" "aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-gf-paf-dev"
    storage_account_name = "sagoodfood"
    container_name       = "tfstate"
    key                  = "main-dev.tfstate"
  }
}

data "terraform_remote_state" "aks-user" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-gf-paf-dev"
    storage_account_name = "sagoodfood"
    container_name       = "tfstate"
    key                  = "user-dev.tfstate"
  }
}

data "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = data.terraform_remote_state.aks.outputs.kubernetes_cluster_name
  resource_group_name = data.terraform_remote_state.aks.outputs.resource_group_name
}