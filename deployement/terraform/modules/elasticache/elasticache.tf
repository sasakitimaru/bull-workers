resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "redis-cluster"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis3.2"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids   = ["${var.sg_id}"]
}

resource "aws_elasticache_subnet_group" "default" {
  name       = "default"
  subnet_ids = ["${var.public_a_id}", "${var.public_c_id}"]
}
