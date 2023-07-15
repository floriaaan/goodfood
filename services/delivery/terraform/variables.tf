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
  default     = "goodfood"
}