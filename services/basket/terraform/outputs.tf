output "Kubernetes-deployment-id"{
  value = kubernetes_deployment.kd-goodfood-product.id
}

output "Postgres-server-id" {
  value = azurerm_postgresql_server.pg-goodfood-product.id
}

output "Storage_account-id"{
  value = azurerm_storage_account.stac-goodfood-product.id
}