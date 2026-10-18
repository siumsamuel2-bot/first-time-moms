# Backup and Restore Procedures

## Overview
This document defines the backup strategy, retention policies, and restore procedures for the Firstweeks production environment to meet RPO < 1 hour and RTO < 4 hours requirements.

## Backup Strategy Summary

| Component | Method | Frequency | Retention | RPO | RTO |
|-----------|--------|-----------|-----------|-----|-----|
| RDS PostgreSQL | Automated snapshots + Point-in-time recovery | Continuous (PITR) + Daily snapshot | 35 days | < 5 min | < 30 min |
| S3 Analytics/Backup | Versioning + Cross-region replication | On write | 7 years (analytics), 7 years (backup) | 0 | < 15 min |
| Secrets Manager | Automatic rotation | Per policy | N/A | N/A | < 5 min |
| ECS Task Definitions | GitHub (source) + ECR (images) | Per deploy | Indefinite | 0 | < 10 min |
| Terraform State | S3 + DynamoDB locking | Per apply | Indefinite | 0 | < 5 min |

## RDS PostgreSQL Backup

### Automated Backups (AWS Managed)
- **Point-in-Time Recovery (PITR)**: Enabled, 35-day retention
- **Automated Snapshots**: Daily at 03:00-04:00 UTC, 35-day retention
- **Final Snapshot**: Created on instance deletion
- **Encryption**: All backups encrypted with KMS key

### Manual Snapshots
```bash
# Create manual snapshot before major changes
aws rds create-db-snapshot \
  --db-instance-identifier production-firstweeks-db \
  --db-snapshot-identifier production-firstweeks-db-pre-migration-$(date +%Y%m%d-%H%M%S)
```

### Cross-Region Replication (Optional for DR)
```bash
# Copy snapshot to DR region
aws rds copy-db-snapshot \
  --source-db-snapshot-identifier arn:aws:rds:us-east-1:123456789:snapshot:production-firstweeks-db-20261007 \
  --target-db-snapshot-identifier production-firstweeks-db-dr-copy \
  --source-region us-east-1 \
  --region us-west-2
```

## Restore Procedures

### Restore from Point-in-Time (Preferred for Data Corruption)
```bash
# Restore to new instance at specific time
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier production-firstweeks-db \
  --target-db-instance-identifier production-firstweeks-db-restored \
  --restore-time 2026-10-07T14:30:00.000Z \
  --db-instance-class db.t3.medium \
  --db-subnet-group-name production-db-subnet-group \
  --vpc-security-group-ids sg-xxxxxxxx \
  --multi-az \
  --storage-encrypted \
  --kms-key-id arn:aws:kms:us-east-1:123456789:key/xxxxxxxx \
  --tags Key=Environment,Value=production Key=RestoredFrom,Value=pitr
```

### Restore from Snapshot (Preferred for Full Instance Recovery)
```bash
# List available snapshots
aws rds describe-db-snapshots \
  --db-instance-identifier production-firstweeks-db \
  --snapshot-type automated \
  --include-shared false \
  --query 'DBSnapshots[*].[DBSnapshotIdentifier,SnapshotCreateTime,Status]' \
  --output table

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier production-firstweeks-db-restored \
  --db-snapshot-identifier production-firstweeks-db-2026-10-07-03-00 \
  --db-instance-class db.t3.medium \
  --db-subnet-group-name production-db-subnet-group \
  --vpc-security-group-ids sg-xxxxxxxx \
  --multi-az \
  --storage-encrypted \
  --kms-key-id arn:aws:kms:us-east-1:123456789:key/xxxxxxxx \
  --tags Key=Environment,Value=production Key=RestoredFrom,Value=snapshot
```

### Post-Restore Steps
1. **Verify restored instance** is available and healthy
2. **Update application configuration** to point to new endpoint
   - Update Secrets Manager secret `production/database-url`
   - Force new ECS deployment
3. **Run smoke tests** against restored database
4. **Verify data integrity** with row counts and sample queries
5. **Decommission old instance** after verification (if replacing)

## S3 Backup and Restore

### Analytics Bucket (`firstweeks-analytics`)
- **Versioning**: Enabled
- **Lifecycle**: Transition to IA (30d), Glacier (90d), Expire old versions (365d)
- **Cross-region replication**: Configured to us-west-2 (optional)

### Restore from S3
```bash
# List versions of an object
aws s3api list-object-versions \
  --bucket firstweeks-analytics \
  --prefix analytics/2026-10-07/users.parquet

# Restore specific version
aws s3api copy-object \
  --bucket firstweeks-analytics \
  --copy-source firstweeks-analytics/analytics/2026-10-07/users.parquet?versionId=xxx \
  --key analytics/2026-10-07/users.parquet.restored

# Or restore from Glacier
aws s3api restore-object \
  --bucket firstweeks-analytics \
  --key analytics/2026-01-15/users.parquet \
  --restore-request '{"Days":7,"GlacierJobParameters":{"Tier":"Standard"}}'
```

### Assets Bucket (`firstweeks-assets`)
- **Versioning**: Enabled
- **CloudFront**: Origin Access Control configured
- **Restore**: Same as analytics bucket

### ALB Logs Bucket (`firstweeks-alb-logs`)
- **Encryption**: AES256
- **Lifecycle**: 1 year retention
- **Access**: Write-only for ALB, read for analytics

## Secrets Manager Backup

### Automatic Rotation
- JWT secrets: 90-day rotation
- Database password: 30-day rotation (managed by RDS)
- VAPID keys: Manual rotation

### Export for DR (Encrypted)
```bash
# Export all secrets for DR (run in secure environment)
aws secretsmanager list-secrets \
  --filters Key="name",Values="production/" \
  --query 'SecretList[*].Name' \
  --output text | while read secret; do
  aws secretsmanager get-secret-value --secret-id "$secret" --query 'SecretString' --output text
done > secrets-backup-$(date +%Y%m%d).json.enc
```

## ECS/ECR Backup

### Task Definitions (Source of Truth: GitHub)
```bash
# Export current task definitions
aws ecs describe-task-definition \
  --task-definition production-firstweeks-api \
  --query 'taskDefinition' \
  --output json > task-def-api-$(date +%Y%m%d).json

aws ecs describe-task-definition \
  --task-definition production-firstweeks-web \
  --query 'taskDefinition' \
  --output json > task-def-web-$(date +%Y%m%d).json
```

### Container Images (ECR)
- Images tagged with Git SHA and `latest`
- Lifecycle policy: Keep last 50 images, expire untagged after 7 days
- Cross-region replication to us-west-2 (optional)

## Terraform State Backup

### State File (S3 Backend)
- **Bucket**: `firstweeks-terraform-state`
- **Key**: `production/terraform.tfstate` or `staging/terraform.tfstate`
- **Versioning**: Enabled on bucket
- **Locking**: DynamoDB table `terraform-locks`

### State Recovery
```bash
# List state versions
aws s3api list-object-versions \
  --bucket firstweeks-terraform-state \
  --prefix production/terraform.tfstate

# Restore specific version
aws s3api copy-object \
  --bucket firstweeks-terraform-state \
  --copy-source firstweeks-terraform-state/production/terraform.tfstate?versionId=xxx \
  --key production/terraform.tfstate
```

## Disaster Recovery Scenarios

### Scenario 1: Single AZ Failure (RDS Multi-AZ)
- **Detection**: RDS failover automatic
- **RTO**: < 2 minutes (automatic)
- **Action**: Verify application reconnects, check CloudWatch alarms

### Scenario 2: Region-Wide Outage (us-east-1)
- **Detection**: Multiple service alarms, AWS Health Dashboard
- **RTO**: < 4 hours (manual failover to us-west-2)
- **Action**:
  1. Promote DR RDS read replica in us-west-2
  2. Update Route 53 to DR ALB
  3. Scale ECS services in DR region
  4. Update Secrets Manager in DR region

### Scenario 3: Data Corruption / Accidental Deletion
- **Detection**: Application errors, data integrity checks
- **RPO**: < 5 minutes (PITR)
- **Action**: Restore to new instance at point before corruption, redirect application

### Scenario 4: Ransomware / Malicious Deletion
- **Detection**: Unusual delete activity, GuardDuty findings
- **Action**:
  1. Revoke all credentials immediately
  2. Enable MFA Delete on S3 buckets
  3. Restore from latest clean snapshot
  4. Rotate all secrets
  4. Investigate via CloudTrail

## Backup Verification Schedule

| Check | Frequency | Method |
|-------|-----------|--------|
| RDS automated backups | Daily | AWS Console / `describe-db-snapshots` |
| RDS PITR capability | Weekly | Test restore to new instance |
| S3 versioning | Monthly | Attempt version restore |
| Secrets rotation | Per rotation | Verify new secret works |
| Terraform state | Per apply | `terraform plan` succeeds |
| Full DR drill | Quarterly | Documented exercise |

## Restore Testing Procedure (Quarterly DR Drill)

### Pre-Drill
1. Schedule 4-hour maintenance window
2. Notify stakeholders (CEO, CMO, practices if needed)
3. Prepare runbook for specific scenario

### Drill Execution
1. **Simulate incident**: Create test scenario
2. **Execute restore**: Follow documented procedures
3. **Validate**: Run smoke tests, data integrity checks
4. **Measure**: Actual RTO vs target
5. **Document**: Results, issues, improvements

### Post-Drill
1. Update runbooks based on findings
2. Share results with team
3. Create action items for gaps
4. Update RTO/RPO targets if needed

## Monitoring Backup Health

### CloudWatch Alarms
- `RDS BackupFailed` alarm
- `S3 ReplicationFailed` alarm (if cross-region)
- `ECR ImageScanFailed` alarm

### Custom Metrics
```bash
# Publish backup success metric (run after backup verification)
aws cloudwatch put-metric-data \
  --namespace Firstweeks/Backup \
  --metric-data MetricName=BackupSuccess,Value=1,Unit=Count,Dimensions=Component=RDS
```

## Compliance and Audit

### HIPAA Requirements
- Encrypted backups at rest (AES-256)
- Encrypted in transit (TLS 1.2+)
- Access logging (CloudTrail)
- 6-year retention for PHI-related data
- Business Associate Agreement with AWS

### Audit Trail
- All backup/restore operations logged in CloudTrail
- S3 access logs in `firstweeks-alb-logs` bucket
- RDS audit logs in CloudWatch (`postgresql`, `upgrade` log groups)

## Contact Information
| Role | Contact |
|------|---------|
| Primary (CTO) | [Slack/Phone] |
| Secondary (Engineer) | [Slack/Phone] |
| AWS Support | Business Support Case |
| Compliance Officer | [CMO Contact] |

## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-10-07 | CTO | Initial version |