output "ecs_cluster_id" {
  description = "ECS Cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = aws_ecs_cluster.main.name
}

output "api_task_definition_arn" {
  description = "API task definition ARN"
  value       = aws_ecs_task_definition.api.arn
}

output "web_task_definition_arn" {
  description = "Web task definition ARN"
  value       = aws_ecs_task_definition.web.arn
}

output "api_service_name" {
  description = "API service name"
  value       = aws_ecs_service.api.name
}

output "web_service_name" {
  description = "Web service name"
  value       = aws_ecs_service.web.name
}

output "api_service_arn" {
  description = "API service ARN"
  value       = aws_ecs_service.api.arn
}

output "web_service_arn" {
  description = "Web service ARN"
  value       = aws_ecs_service.web.arn
}