data "template_file" "server" {
  template = file("${local.task_definitions_filepath}")
  vars = {
    SERVICE_NAME    = "${local.server_service_name}"
    ECR_IMAGE       = "${var.ecr_repository_uri}server:latest"
    LOGS_GROUP_NAME = "${var.logs_group_name}"
    LOG_DRIVER      = "${local.task_log_driver}"
    REGION          = "${var.region}"
  }
}

data "template_file" "consumer" {
  template = file("${local.task_definitions_filepath}")
  vars = {
    SERVICE_NAME    = "${local.consumer_service_name}"
    ECR_IMAGE       = "${var.ecr_repository_uri}consumer:latest"
    LOGS_GROUP_NAME = "${var.logs_group_name}"
    LOG_DRIVER      = "${local.task_log_driver}"
    REGION          = "${var.region}"
  }
}

resource "aws_ecs_server_task_definition" "server" {
  container_definitions    = data.template_file.server.rendered
  family                   = local.server_task_definitions_name
  cpu                      = local.task_cpu
  memory                   = local.task_memory
  network_mode             = local.task_network_mode
  requires_compatibilities = ["${local.task_requires_compatibilities}"]
  execution_role_arn       = var.execution_role_arn
}

resource "aws_ecs_consumer_task_definition" "consumer" {
  container_definitions    = data.template_file.consumer.rendered
  family                   = local.consumer_task_definitions_name
  cpu                      = local.task_cpu
  memory                   = local.task_memory
  network_mode             = local.task_network_mode
  requires_compatibilities = ["${local.task_requires_compatibilities}"]
  execution_role_arn       = var.execution_role_arn
}
