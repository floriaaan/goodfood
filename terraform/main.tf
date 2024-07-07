terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.48.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~>1.5"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}


# Azure Container Regristry
resource "azurerm_container_registry" "acr-goodfood" {
  name                     = "acr${var.project_name_minimized}${var.environnment_suffix}"
  resource_group_name      = data.azurerm_resource_group.rg-goodfood.name
  location                 = data.azurerm_resource_group.rg-goodfood.location
  sku                      = "Standard"
  admin_enabled            = true
}

# App Plan
resource "azurerm_app_service_plan" "asp-goodfood" {
  name                = "asp-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  kind                = "Linux"
  reserved            = true
  sku {
    tier = "Standard"
    size = "S1"
  }
}

# web App
resource "azurerm_app_service" "as-goodfood" {
  name = "appservice-${var.project_name}-${var.environnment_suffix}"
  location = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  app_service_plan_id = azurerm_app_service_plan.asp-goodfood.id
  app_settings = {
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false

    # Settings for private Container Registires
    DOCKER_REGISTRY_SERVER_URL      = "acrgfpafdev.azurecr.io"
    DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr-goodfood.admin_username
    DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr-goodfood.admin_password

    DOCKER_REGISTRY_SERVER_IMAGE = "goodfood-web"

  }
  # Configure Docker Image to load on start
  site_config {
    linux_fx_version = "DOCKER|pierrelbg/goodfood-web:latest"
    always_on        = "true"
  }
  identity {
    type = "SystemAssigned"
  }
  depends_on = [azurerm_container_group.acg-goodfood]
}

resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = <<-EOT
        docker login ${azurerm_container_registry.acr-goodfood.login_server} -u ${azurerm_container_registry.acr-goodfood.admin_username} -p ${azurerm_container_registry.acr-goodfood.admin_password}
        docker pull pierrelbg/goodfood-web:latest
        docker tag pierrelbg/goodfood-web:latest ${azurerm_container_registry.acr-goodfood.login_server}/goodfood-web
        docker push ${azurerm_container_registry.acr-goodfood.login_server}/goodfood-web
      EOT
  }
  depends_on = [azurerm_container_registry.acr-goodfood]
}

resource "azurerm_virtual_network" "vnet-goodfood" {
  name                = "vnet-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  address_space       = ["10.1.0.0/16"]
}

resource "azurerm_subnet" "subnet-goodfood" {
  name                 = "subnet-${var.project_name}-${var.environnment_suffix}"
  resource_group_name  = data.azurerm_resource_group.rg-goodfood.name
  virtual_network_name = azurerm_virtual_network.vnet-goodfood.name
  address_prefixes     = ["10.1.0.0/24"]
  delegation {
    name = "delegation"

    service_delegation {
      name    = "Microsoft.ContainerInstance/containerGroups"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action", "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action"]
    }
  }
}


resource "azurerm_container_group" "acg-goodfood" {
  name                = "acg-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  ip_address_type     = "Private"
  os_type             = "Linux"
  subnet_ids          = [
    azurerm_subnet.subnet-goodfood.id
  ]

  image_registry_credential {
    server = azurerm_container_registry.acr-goodfood.login_server
    username  = azurerm_container_registry.acr-goodfood.admin_username
    password = azurerm_container_registry.acr-goodfood.admin_password
  }

  container {
    name   = "ci-${var.project_name}-${var.environnment_suffix}"
    image  = "${azurerm_container_registry.acr-goodfood.login_server}/goodfood-web:latest"
    cpu    = "1"
    memory = "3"

    ports {
      port     = 80
      protocol = "TCP"
    }

    environment_variables = {
      NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1IjoiZmxvcmlhYWFuIiwiYSI6ImNsbmFlbWRmYTAzOGMycW83cXRmdGtoMmgifQ.fR9xJY9jFcq8NAnpBxVT0g"
      NEXT_PUBLIC_BASE_URL="http://as-gf-paf-dev.azurewebsites.net:3000/"
      NEXT_PUBLIC_API_URL="http://10.0.12.23:50000/"
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51NbLVgDsY1zG7XXZ8VoHcpfp3ljRmgclOrDER2U8a35QHJc86ERQguEJhq8S5mfSq9iQ1yXotizZNTH4cyhyJZhJ00Z1IK0Tc2"
    }
  }
  /*
  container {
    name   = "rabbitmq-${var.project_name}-${var.environnment_suffix}"
    image  = "rabbitmq:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 15672
      protocol = "TCP"
    }
  }
  */

  depends_on = [null_resource.docker_push]
}

resource "random_pet" "ssh_key_name-goodfood" {
  prefix    = "ssh"
  separator = ""
}

resource "azapi_resource" "ssh_public_key-goodfood" {
  type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  name      = random_pet.ssh_key_name-goodfood.id
  location  = "westus3"
  parent_id = data.azurerm_resource_group.rg-goodfood.id
}

resource "azapi_resource_action" "ssh_public_key_gen-goodfood" {
  type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  resource_id = azapi_resource.ssh_public_key-goodfood.id
  action      = "generateKeyPair"
  method      = "POST"

  response_export_values = ["publicKey"]
}

resource "azurerm_kubernetes_cluster" "aks-goodfood" {
  name                = "aks-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  dns_prefix          = "goodfood"

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = 1
  }
  linux_profile {
    admin_username = "ubuntu"

    ssh_key {
      key_data = azapi_resource_action.ssh_public_key_gen-goodfood.output.publicKey
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
}

//Ressources lié aux services


resource "azurerm_key_vault" "kv-goodfood-user" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}user"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-payment" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}payment"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-product" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}product"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-restaurant" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}restau"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-promotions" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}promo"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-order" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}order"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-delivery" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}delivery"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-stock" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}stock"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-log" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}log"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}

resource "azurerm_key_vault" "kv-goodfood-notification" {
  name                       = "keyvault${var.project_name_minimized}${var.environnment_suffix}notif"
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
      "List",
      "Delete",
      "Purge",
      "Recover"
    ]
  }
}


/*
resource "azurerm_postgresql_server" "pgsql-goodfood" {
  name                = "postgres-server-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login              = var.db_username
  administrator_login_password     = var.db_password
  version                          = "9.5"
  ssl_enforcement_enabled          = false
  ssl_minimal_tls_version_enforced = "TLSEnforcementDisabled"
}

resource "azurerm_postgresql_firewall_rule" "pg-fw-goodfood" {
  name                = "firewall-${var.project_name}-${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pgsql-goodfood.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_postgresql_database" "db-goodfood" {
  name                = "postgres-${var.project_name}-${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pgsql-goodfood.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}

resource "azurerm_container_group" "container_group" {
  name                = "container-${var.project_name}-${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  ip_address_type     = "Public"
  dns_name_label      = "container-${var.project_name}-${var.environnment_suffix}"
  os_type             = "Linux"

  container {
    name   = "${var.project_name}-${var.environnment_suffix}"
    image  = "floriaaan/goodfood-delivery:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 50008
      protocol = "TCP"
    }

    environment_variables = {
      "DATABASE_URL" = "postgres://${var.db_username}@${azurerm_postgresql_server.pgsql-goodfood.name}:${var.db_password}@${azurerm_postgresql_server.pgsql-goodfood.fqdn}:5432/${azurerm_postgresql_database.db-goodfood.name}"
      "PORT"         = 50008
    }
  }
}*/
