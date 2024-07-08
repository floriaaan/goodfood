output "Kubernetes-deployment-id"{
  value = kubernetes_deployment.kd-goodfood-gateway.id
}
output "lb_ip" {
  value = kubernetes_service.ks-goodfood-gateway.status.0.load_balancer.0.ingress.0.ip
}