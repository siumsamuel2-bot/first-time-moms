output "analytics_lambda_arn" {
  description = "Analytics export Lambda ARN"
  value       = aws_lambda_function.analytics_export.arn
}

output "analytics_lambda_name" {
  description = "Analytics export Lambda function name"
  value       = aws_lambda_function.analytics_export.function_name
}

output "eventbridge_rule_arn" {
  description = "EventBridge rule ARN for weekly analytics export"
  value       = aws_eventbridge_rule.weekly_analytics_export.arn
}

output "analytics_lambda_role_arn" {
  description = "Analytics Lambda IAM role ARN"
  value       = aws_iam_role.analytics_lambda.arn
}