resource "aws_ecr_repository" "default" {
  name                 = local.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "null_resource" "default" {
  provisioner "local-exec" {
    command = "sh ${path.module}/dockerbuild.sh"

    environment = {
      AWS_REGION     = var.region
      AWS_ACCOUNT_ID = var.account_id
      REPO_URL       = aws_ecr_repository.default.repository_url
      CONTAINER_NAME = "${local.server_container_name}"
      DOCKER_DIR     = "${local.docker_dir}"
      TARGET_STAGE   = "prod-server"
    }
  }

  provisioner "local-exec" {
    command = "sh ${path.module}/dockerpush.sh"

    environment = {
      AWS_REGION     = var.region
      AWS_ACCOUNT_ID = var.account_id
      REPO_URL       = aws_ecr_repository.default.repository_url
      CONTAINER_NAME = "${local.consumer_container_name}"
      DOCKER_DIR     = "${local.docker_dir}"
      TARGET_STAGE   = "prod-consumer"
    }
  }
}
