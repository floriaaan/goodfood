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

resource "azurerm_postgresql_server" "pgsql-goodfood" {
  name                = "postgres-server-${var.project_name}${var.environnment_suffix}"
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
  name                = "firewall-${var.project_name}${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pgsql-goodfood.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_postgresql_database" "db-goodfood" {
  name                = "postgres-${var.project_name}${var.environnment_suffix}"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pgsql-goodfood.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}

resource "azurerm_container_group" "container_group" {
  name                = "container-${var.project_name}${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  ip_address_type     = "Public"
  dns_name_label      = "container-${var.project_name}${var.environnment_suffix}"
  os_type             = "Linux"

  container {
    name   = "${var.project_name}${var.environnment_suffix}"
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
}
