data "azurerm_resource_group" "rg-goodfood" {
  name = "rg-${var.project_name}-${var.environnment_suffix}"
}

data "azurerm_client_config" "current" {}

data "terraform_remote_state" "aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-gf-paf-dev"
    storage_account_name = "sagoodfoodpaf"
    container_name       = "tfstate"
    key                  = "main-dev.tfstate"
  }
}

data "terraform_remote_state" "aks-gateway" {
  backend = "azurerm"

  config = {
    resource_group_name  = "rg-gf-paf-dev"
    storage_account_name = "sagoodfoodpaf"
    container_name       = "tfstate"
    key                  = "gateway-dev.tfstate"
  }
}