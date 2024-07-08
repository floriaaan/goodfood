output "main-rg-name" {
  value = data.azurerm_resource_group.rg-goodfood.name
}

output "main-rg-id" {
  value = data.azurerm_resource_group.rg-goodfood.id
}

output "resource_group_name" {
  value = data.azurerm_resource_group.rg-goodfood.name
}

output "kubernetes_cluster_name"{
  value = azurerm_kubernetes_cluster.aks-goodfood.name
}