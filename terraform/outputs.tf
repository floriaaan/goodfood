output "main-rg-name" {
  value = data.azurerm_resource_group.rg-goodfood.name
}
output "main-rg-id" {
  value = data.azurerm_resource_group.rg-goodfood.id
}

output "client_certificate" {
  value     = azurerm_kubernetes_cluster.aks-goodfood.kube_config.0.client_certificate
  sensitive = true
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.aks-goodfood.kube_config_raw
  sensitive = true
}