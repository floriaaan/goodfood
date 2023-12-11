terraform {
  required_providers {
    azapi = {
      source  = "azure/azapi"
      version = "~>1.5"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.9.1"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_redis_enterprise_cluster" "redis-goodfood-basket" {
  name                = "rec-${var.project_name}-${var.environnment_suffix}-${var.service-name}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  sku_name = "EnterpriseFlash_F300-3"
}

resource "azurerm_redis_enterprise_database" "db-goodfood-basket" {
  name                = "rec-${var.project_name}-${var.environnment_suffix}-${var.service-name}"

  cluster_id        = azurerm_redis_enterprise_cluster.redis-goodfood-basket.id
  client_protocol   = "Encrypted"
  clustering_policy = "EnterpriseCluster"
  eviction_policy   = "NoEviction"
  port              = 10000

  linked_database_id = [
    "${azurerm_redis_enterprise_cluster.redis-goodfood-basket.id}/databases/default"
  ]

  linked_database_group_nickname = "tftestGeoGroup"
}

resource "azurerm_postgresql_firewall_rule" "pgfw-goodfood-product" {
  name                = "allow-azure-resources"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pg-goodfood-product.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

resource "azurerm_storage_account" "stac-goodfood-product" {
  name                     = "stacgoodfoodproductdev"
  resource_group_name      = data.azurerm_resource_group.rg-goodfood.name
  location                 = data.azurerm_resource_group.rg-goodfood.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  blob_properties{
    cors_rule{
        allowed_headers = ["*"]
        allowed_methods = ["GET","HEAD","POST","PUT", "DELETE", "MERGE", "OPTIONS"]
        allowed_origins = ["*"]
        exposed_headers = ["*"]
        max_age_in_seconds = 86400
        }
    }
}
resource "azurerm_storage_container" "sc-goodfood-product" {
  name                  = "image"
  storage_account_name  = azurerm_storage_account.stac-goodfood-product.name
  container_access_type = "private"
}

resource "azurerm_role_assignment" "rlas-goodfood-product" {
  scope                = azurerm_storage_account.stac-goodfood-product.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.product-client-conf.object_id
}

resource "random_pet" "ssh_key_name-goodfood-product" {
  prefix    = "ssh"
  separator = ""
}

resource "azapi_resource" "ssh_public_key-goodfood-product" {
  type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  name      = random_pet.ssh_key_name-goodfood-product.id
  location  = "westus3"
  parent_id = data.azurerm_resource_group.rg-goodfood.id
}

resource "azapi_resource_action" "ssh_public_key_gen-goodfood-product" {
  type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  resource_id = azapi_resource.ssh_public_key-goodfood-product.id
  action      = "generateKeyPair"
  method      = "POST"

  response_export_values = ["publicKey"]
}

provider "kubernetes" {
  host = data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host

  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)
}

resource "kubernetes_deployment" "kd-goodfood-product" {
  metadata {
    name = "goodfood-product"
    labels = {
      App = "goodfood-product"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "goodfood-product"
      }
    }
    template {
      metadata {
        labels = {
          App = "goodfood-product"
        }
      }
      spec {
        container {
          name  = "goodfood-product"
          image = "pierrelbg/goodfood-product:latest"

          env {
            name = "PORT"
            value = "50004"
          }
          env {
            name = "DATABASE_URL"
            value = "postgresql://${azurerm_postgresql_server.pg-goodfood-product.administrator_login}@${azurerm_postgresql_server.pg-goodfood-product.name}:${azurerm_postgresql_server.pg-goodfood-product.administrator_login_password}@${azurerm_postgresql_server.pg-goodfood-product.name}.postgres.database.azure.com:5432/${azurerm_postgresql_database.db-goodfood-product.name}"
          }
          env {
            name = "AZURE_STORAGE_SAS_TOKEN"
            value = data.azurerm_storage_account_blob_container_sas.sa-goodfood.sas
          }
          env {
            name = "AZURE_STORAGE_RESOURCE_NAME"
            value = azurerm_storage_account.stac-goodfood-product.name
          }
          env {
            name = "AMQP_URL"
            value = "TODO"
          }

          port {
            container_port = 50004
          }

          resources {
            limits = {
              cpu    = "200m"
              memory = "128Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "ks-goodfood-product" {
  metadata {
    name = "goodfood-product"
  }
  spec {
    selector = {
      App = kubernetes_deployment.kd-goodfood-product.spec.0.template.0.metadata[0].labels.App
    }
    port {
      name        = "grpc"
      port        = 50004
      target_port = 50004
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "khpa-goodfood-product" {
  metadata {
    name = "goodfood-product-hpa"
  }

  spec {
    min_replicas = 1
    max_replicas = 3

    scale_target_ref {
      kind = "Deployment"
      name = "goodfood-product"
    }

    metric {
      type = "Resource"
      resource{
        name = "cpu"
        target {
          type = "Utilization"
          average_utilization = 50
        }
      }
    }
  }
}