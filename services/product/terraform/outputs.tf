output "DATABASE_URL"{
  value = nonsensitive("postgresql://${azurerm_postgresql_server.pg-goodfood-product.administrator_login}@${azurerm_postgresql_server.pg-goodfood-product.name}:${azurerm_postgresql_server.pg-goodfood-product.administrator_login_password}@${azurerm_postgresql_server.pg-goodfood-product.name}.postgres.database.azure.com:5432/${azurerm_postgresql_database.db-goodfood-product.name}")
}

output "AZURE_STORAGE_SAS_TOKEN" {
  value = nonsensitive(data.azurerm_storage_account_blob_container_sas.sa-goodfood.sas)
}

output "AZURE_STORAGE_RESOURCE_NAME"{
  value = azurerm_storage_account.stac-goodfood-product.name
}


output "PORT" {
  value = 50004
}

output "AMQP_URL"{
  value = "amqp://guest:guest@localhost"
}