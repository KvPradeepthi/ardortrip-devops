variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "ap-northeast-1"
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  default     = "ardor_user"
}

variable "db_password" {
  description = "Database administrator password (pass via TF_VAR_db_password or tfvars)"
  type        = string
  sensitive   = true
  default     = null
}
