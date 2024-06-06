# Global
variable "region" {}
variable "name_prefix" {}

# ECR
variable "account_id" {}

locals {
  repository_name         = "${var.name_prefix}-repository"
  server_container_name   = "${var.name_prefix}-server-container"
  consumer_container_name = "${var.name_prefix}-consumer-container"
  docker_dir              = "/web/app/docker-compose.yml"
}
