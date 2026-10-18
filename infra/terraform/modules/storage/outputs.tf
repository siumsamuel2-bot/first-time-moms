output "analytics_bucket_id" {
  description = "Analytics S3 bucket ID"
  value       = aws_s3_bucket.analytics.id
}

output "analytics_bucket_arn" {
  description = "Analytics S3 bucket ARN"
  value       = aws_s3_bucket.analytics.arn
}

output "assets_bucket_id" {
  description = "Assets S3 bucket ID"
  value       = aws_s3_bucket.assets.id
}

output "assets_bucket_arn" {
  description = "Assets S3 bucket ARN"
  value       = aws_s3_bucket.assets.arn
}

output "alb_logs_bucket_id" {
  description = "ALB logs S3 bucket ID"
  value       = aws_s3_bucket.alb_logs.id
}

output "backup_bucket_id" {
  description = "Backup S3 bucket ID"
  value       = aws_s3_bucket.backup.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.assets.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.assets.domain_name
}