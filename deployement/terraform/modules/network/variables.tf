# Global
variable "region" {}
variable "name_prefix" {}

# Internet Gateway
locals {
  vpc_cidr = "10.0.0.0/16"
}
