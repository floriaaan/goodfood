terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
}

provider "kubernetes" {
  host = data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host

  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)
}

resource "kubernetes_deployment" "kd-goodfood-gateway" {
  metadata {
    name = "goodfood-gateway"
    labels = {
      App = "goodfood-gateway"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        App = "goodfood-gateway"
      }
    }
    template {
      metadata {
        labels = {
          App = "goodfood-gateway"
        }
      }
      spec {
        container {
          name  = "goodfood-gateway"
          image = "floriaaan/goodfood-gateway:latest"

          env {
            name = "GATEWAY_PORT"
            value = "50000"
          }

          env {
            name = "GATEWAY_USER_URL"
            value = "${data.terraform_remote_state.aks-user.outputs.lb_ip}:50001"
          }

          port {
            container_port = 50000
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

resource "kubernetes_service" "ks-goodfood-gateway" {
  metadata {
    name = "goodfood-gateway"
  }
  spec {
    selector = {
      App = kubernetes_deployment.kd-goodfood-gateway.spec.0.template.0.metadata[0].labels.App
    }

    port {
      name        = "http"
      port        = 50000
      target_port = 50000
    }
    external_ips = [
      "10.0.12.23"
    ]
    type = "LoadBalancer"
  }
  timeouts {
    create = "1m"
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "khpa-goodfood-gateway" {
  metadata {
    name = "goodfood-gateway-hpa"
  }

  spec {
    min_replicas = 1
    max_replicas = 10

    scale_target_ref {
      kind = "Deployment"
      name = "goodfood-gateway"
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