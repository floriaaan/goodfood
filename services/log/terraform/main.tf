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

resource "azurerm_postgresql_server" "pg-goodfood-log" {
  name                = "pg-goodfood-log${var.environnment_suffix}"
  location            = data.azurerm_resource_group.rg-goodfood.location
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = data.azurerm_key_vault_secret.db-login.value
  administrator_login_password = data.azurerm_key_vault_secret.db-password.value
  version                      = "11"

  ssl_enforcement_enabled          = false
  ssl_minimal_tls_version_enforced = "TLSEnforcementDisabled" // TODO: change to TLS1_2

}

resource "azurerm_postgresql_firewall_rule" "pgfw-goodfood-log" {
  name                = "allow-azure-resources"
  resource_group_name = data.azurerm_resource_group.rg-goodfood.name
  server_name         = azurerm_postgresql_server.pg-goodfood-log.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

provider "kubernetes" {
  host = data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host

  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)
}

resource "kubernetes_deployment" "kd-goodfood-log" {
  metadata {
    name = "goodfood-log"
    labels = {
      App = "goodfood-log"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "goodfood-log"
      }
    }
    template {
      metadata {
        labels = {
          App = "goodfood-log"
        }
      }
      spec {
        container {
          name  = "goodfood-log"
          image = "floriaaan/goodfood-log:latest"

          env {
            name = "PORT"
            value = "50001"
          }
          env {
            name = "DATABASE_URL"
            value = "postgresql://${data.azurerm_key_vault_secret.db-login.value}@${azurerm_postgresql_server.pg-goodfood-log.name}:${data.azurerm_key_vault_secret.db-password.value}@${azurerm_postgresql_server.pg-goodfood-log.name}.postgres.database.azure.com:5432/${azurerm_postgresql_server.pg-goodfood-log.name}"
          }
          env {
            name = "AMQP_URL"
            value = "TODO"
          }

          port {
            container_port = 50001
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

resource "kubernetes_service" "ks-goodfood-log" {
  metadata {
    name = "goodfood-product"
  }
  spec {
    selector = {
      App = kubernetes_deployment.kd-goodfood-log.spec.0.template.0.metadata[0].labels.App
    }
    port {
      name        = "grpc"
      port        = 50001
      target_port = 50001
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "khpa-goodfood-log" {
  metadata {
    name = "goodfood-log-hpa"
  }

  spec {
    min_replicas = 1
    max_replicas = 3

    scale_target_ref {
      kind = "Deployment"
      name = "goodfood-log"
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