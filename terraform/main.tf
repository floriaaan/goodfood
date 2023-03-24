terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.48.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_service_plan" "sp-goodfood" {
  name                = "sp-${var.project_name}${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "S1"
}

resource "azurerm_linux_web_app" "web-goodfood" {
  name                = "web-${var.project_name}${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.sp-goodfood.id

  site_config {
    application_stack {
      node_version = "16-lts"
    }
  }

  app_settings = {
    // env
  }
}

resource "azurerm_kubernetes_cluster" "aks-goodfood" {
  name                = "aks-${var.project_name}${var.environnment_suffix}"
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  dns_prefix          = "aks-${var.project_name}${var.environnment_suffix}"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
}