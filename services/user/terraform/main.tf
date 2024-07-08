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
    postgresql = {
      source = "cyrilgdn/postgresql"
      version = "1.22.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

resource "azurerm_postgresql_flexible_server" "pg-goodfood-user" {
  name                   = "pg-${var.project_name}${var.environnment_suffix}-product"
  resource_group_name    = data.azurerm_resource_group.rg-gf-paf.name
  location               = data.azurerm_resource_group.rg-gf-paf.location
  version                = "16"
  administrator_login    = data.azurerm_key_vault_secret.db-login.value
  administrator_password = data.azurerm_key_vault_secret.db-password.value
  storage_mb             = 32768
  sku_name               = "GP_Standard_D4s_v3"
}

resource "azurerm_postgresql_flexible_server_database" "db-goodfood-user" {
  name      = "db-${var.project_name}${var.environnment_suffix}-product"
  server_id = azurerm_postgresql_flexible_server.pg-goodfood-user.id
  collation = "en_US.utf8"
  charset   = "utf8"

}

resource "azurerm_postgresql_flexible_server_firewall_rule" "pgfw-goodfood-user" {
  name                = "allow-azure-resources"
  server_id         = azurerm_postgresql_flexible_server.pg-goodfood-user.id
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

provider "kubernetes" {
  host = data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host

  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)
}

resource "kubernetes_deployment" "kd-goodfood-user" {
  metadata {
    name = "goodfood-user"
    labels = {
      App = "goodfood-user"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "goodfood-user"
      }
    }
    template {
      metadata {
        labels = {
          App = "goodfood-user"
        }
      }
      spec {
        container {
          name  = "goodfood-user"
          image = "floriaaan/goodfood-user:latest"

          env {
            name = "PORT"
            value = "50001"
          }
          env {
            name = "DB_URL"
            value = "postgresql://${azurerm_postgresql_flexible_server.pg-goodfood-user.administrator_login}@${azurerm_postgresql_flexible_server.pg-goodfood-user.name}:${data.azurerm_key_vault_secret.db-password.value}@${azurerm_postgresql_flexible_server.pg-goodfood-user.name}.postgres.database.azure.com:5432/${azurerm_postgresql_flexible_server_database.db-goodfood-user.name}"
          }
          env {
            name = "DEFAULT_USER_EMAIL"
            value = "super.admin@mail.com"
          }
          env {
              name = "DEFAULT_USER_PASSWORD"
              value = "password"
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
              cpu    = "400m"
              memory = "480Mi"
            }
          }
        }
      }
    }
  }
  timeouts {
    create = "1m"
  }
}

resource "kubernetes_service" "ks-goodfood-user" {
  metadata {
    name = "goodfood-user"
  }
  spec {
    selector = {
      App = kubernetes_deployment.kd-goodfood-user.spec.0.template.0.metadata[0].labels.App
    }
    port {
      name        = "grpc"
      port        = 50001
      target_port = 50001
    }
    type = "LoadBalancer"
  }
  timeouts {
    create = "1m"
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "khpa-goodfood-user" {
  metadata {
    name = "goodfood-user-hpa"
  }

  spec {
    min_replicas = 1
    max_replicas = 3

    scale_target_ref {
      kind = "Deployment"
      name = "goodfood-user"
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