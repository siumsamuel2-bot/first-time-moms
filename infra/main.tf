terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "staging"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_ecs_cluster" "firstweeks" {
  name = "firstweeks-${var.environment}"
}

resource "aws_ecs_service" "web" {
  name            = "web-${var.environment}"
  cluster         = aws_ecs_cluster.firstweeks.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = var.environment == "production" ? 3 : 1
}

resource "aws_ecs_task_definition" "web" {
  family                   = "firstweeks-web-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"

  container_definitions = jsonencode([
    {
      name  = "web"
      image = "${aws_ecr_repository.web.repository_url}:latest"
      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "DATABASE_URL", value = "postgres://firstweeks:${var.db_password}@${aws_db_instance.default.endpoint}/firstweeks" },
      ]
      portMappings = [{ containerPort = 3000 }]
    },
  ])
}

resource "aws_ecr_repository" "web" {
  name = "firstweeks-web-${var.environment}"
}

resource "aws_db_instance" "default" {
  identifier     = "firstweeks-${var.environment}"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.environment == "production" ? "db.t4g.medium" : "db.t4g.micro"
  db_name        = "firstweeks"
  username       = "firstweeks"
  password       = var.db_password
  skip_final_snapshot = var.environment != "production"
  storage_encrypted   = true
}

resource "aws_security_group" "web" {
  name_prefix = "firstweeks-web-${var.environment}-"
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}