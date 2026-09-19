variable "aws_region" {
  description = "AWS deployment region (Tokyo default for YCC)"
  type        = string
  default     = "ap-northeast-1"
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  default     = "ardor_user"
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
  default     = "ardor_secure_pass"
}
