output "Kubernetes-deployment-id"{
  value = kubernetes_deployment.kd-goodfood-user.id
}

output "Postgres-server-id" {
  value = azurerm_postgresql_server.pg-goodfood-user.id
}

output "lb_ip" {
  value = kubernetes_service.ks-goodfood-user.status.0.load_balancer.0.ingress.0.ip
}