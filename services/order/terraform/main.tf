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
  features {
    key_vault {
      purge_soft_deleted_secrets_on_destroy = true
      recover_soft_deleted_secrets          = true
    }
  }
}

resource "azurerm_key_vault" "kv-goodfood-order" {
  name                       = "kv-goodfood-order"
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

data "azurerm_cosmosdb_account" "cosmosacc-goodfood-order" {
  name                = "cacc-goodfood-order"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  kind                      = "MongoDB"
  enable_automatic_failover = true

  capabilities {
    name = "EnableMongo"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 400
    max_staleness_prefix    = 200000
  }

  geo_location {
    location = var.location
  }
}

resource "azurerm_cosmosdb_mongo_database" "cosmosdb-goodfood-order" {
  name                = "cosmosdb-goodfood-order"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  account_name        = data.azurerm_cosmosdb_account.cosmosacc-goodfood-order.name
  throughput          = 400
}

resource "azurerm_cosmosdb_mongo_collection" "mongocollection-goodfood-order" {
  name                = "mongocollection-goodfood-order"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  account_name        = data.azurerm_cosmosdb_account.cosmosacc-goodfood-order.name
  database_name       = azurerm_cosmosdb_mongo_database.cosmosdb-goodfood-order.name

  default_ttl_seconds = "777"
  shard_key           = "uniqueKey"
  throughput          = 400

  lifecycle {
    ignore_changes = [index]
  }

  depends_on = [
    azurerm_cosmosdb_mongo_database.cosmosdb-goodfood-order
  ]


}
