output "kms_key_arn" {
  description = "KMS key ARN"
  value       = aws_kms_key.main.arn
}

output "github_actions_role_arn" {
  description = "GitHub Actions role ARN"
  value       = aws_iam_role.github_actions.arn
}

output "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_arn" {
  description = "ECS task role ARN"
  value       = aws_iam_role.ecs_task.arn
}

output "jwt_secret_arn" {
  description = "JWT secret ARN"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "push_vapid_public_key_arn" {
  description = "VAPID public key ARN"
  value       = aws_secretsmanager_secret.push_vapid_public_key.arn
}

output "push_vapid_private_key_arn" {
  description = "VAPID private key ARN"
  value       = aws_secretsmanager_secret.push_vapid_private_key.arn
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = aws_guardduty_detector.main.id
}