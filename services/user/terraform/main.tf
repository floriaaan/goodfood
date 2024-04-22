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

provider "postgresql" {
  host            = "${azurerm_postgresql_server.pg-goodfood-user.name}.postgres.database.azure.com"
  port            = 5432
  database        = "${azurerm_postgresql_database.db-goodfood-user.name}"
  username        = "${azurerm_postgresql_server.pg-goodfood-user.administrator_login}@${azurerm_postgresql_server.pg-goodfood-user.name}"
  password        = "${data.azurerm_key_vault_secret.db-password.value}"
  sslmode         = "require"
  connect_timeout = 15
}

resource "azurerm_postgresql_server" "pg-goodfood-user" {
  name                = "pg-${var.project_name}${var.environnment_suffix}-user"
  location            = data.azurerm_resource_group.rg-gf-paf.location
  resource_group_name = data.azurerm_resource_group.rg-gf-paf.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = data.azurerm_key_vault_secret.db-login.value
  administrator_login_password = data.azurerm_key_vault_secret.db-password.value
  version                      = "11"

  ssl_enforcement_enabled          = true
  ssl_minimal_tls_version_enforced = "TLS1_2" 

}

resource "azurerm_postgresql_database" "db-goodfood-user" {
  name                = "db-${var.project_name}${var.environnment_suffix}-user"
  resource_group_name = data.azurerm_resource_group.rg-gf-paf.name
  server_name         = azurerm_postgresql_server.pg-goodfood-user.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}

resource "azurerm_postgresql_firewall_rule" "pgfw-goodfood-user" {
  name                = "allow-azure-resources"
  resource_group_name = data.azurerm_resource_group.rg-gf-paf.name
  server_name         = azurerm_postgresql_server.pg-goodfood-user.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "255.255.255.255"
}

resource "postgresql_extension" "pgext-goodfood-user" {
  name = "pgcrypto"
  database = azurerm_postgresql_database.db-goodfood-user.name
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
            value = "postgresql://${azurerm_postgresql_server.pg-goodfood-user.administrator_login}@${azurerm_postgresql_server.pg-goodfood-user.name}:${data.azurerm_key_vault_secret.db-password.value}@${azurerm_postgresql_server.pg-goodfood-user.name}.postgres.database.azure.com:5432/${azurerm_postgresql_database.db-goodfood-user.name}"
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