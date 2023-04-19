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

resource "azurerm_key_vault" "kv-goodfood" {
  name                       = "kv-goodfood-delivery"
  location                   = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name        = data.azurerm_resource_group.rg-goodfood.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
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
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.agent_count
  }
  linux_profile {
    admin_username = "ubuntu"

    ssh_key {
      key_data = file(var.ssh_public_key)
    }
  }

  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }

  service_principal {
    client_id     = var.aks_service_principal_app_id
    client_secret = var.aks_service_principal_client_secret
  }
}