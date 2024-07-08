 variable "environnment_suffix" {
  type        = string
  description = "The suffix to append to the environment name"
}

variable "location" {
  type        = string
  description = "The location/region where all resources in this environment should be created"
  default     = "West Europe"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
  default     = "gf-paf"
}

variable "project_name_minimized" {
 type        = string
 description = "The name of the project"
 default     = "gfpaf"
}

variable "agent_count" {
  default = 3
}

variable "aks_service_principal_app_id" {
  default = ""
}

variable "aks_service_principal_client_secret" {
  default = ""
}

variable "ssh_public_key" {
  default = "~/.ssh/id_rsa.pub"
}

variable "db_password" {
  type = string
}

variable "db_username" {
  type = string
}