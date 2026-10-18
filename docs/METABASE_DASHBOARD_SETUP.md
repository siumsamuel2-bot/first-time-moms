# Metabase Dashboard Setup for Firstweeks Analytics

## Overview
This document describes how to import and configure the Firstweeks Pilot Analytics Dashboard in Metabase, connected to the Athena data source.

## Prerequisites
- Metabase instance running (v0.48+ recommended)
- AWS Athena data source configured in Metabase
- Terraform-deployed Athena tables (`firstweeks_analytics` database)
- Analytics Lambda has run at least once (data in S3, partitions loaded)

## Athena Data Source Configuration in Metabase

### 1. Add Athena Database
1. In Metabase, go to **Admin Settings** → **Databases** → **Add Database**
2. Select **Amazon Athena** as database type
3. Configure connection:
   - **Name**: `Firstweeks Analytics (Athena)`
   - **AWS Region**: `us-east-1` (or your region)
   - **Authentication**: IAM Role / Access Keys
   - **S3 Staging Directory**: `s3://firstweeks-analytics/athena-staging/`
   - **Schema**: `firstweeks_analytics`
4. Save and test connection

### 2. Load Partitions
After the first analytics export runs, execute in Athena console or Metabase SQL editor:
```sql
MSCK REPAIR TABLE firstweeks_analytics.users;
MSCK REPAIR TABLE firstweeks_analytics.checkins;
MSCK REPAIR TABLE firstweeks_analytics.escalations;
MSCK REPAIR TABLE firstweeks_analytics.referrals;
```

## Dashboard Import

### Option 1: Import JSON (Recommended)
1. Go to **Dashboards** → **+ New Dashboard** → **Import Dashboard**
2. Upload the file: `infra/terraform/modules/grafana/dashboards/metabase-pilot-analytics.json`
3. When prompted, map the database to your `Firstweeks Analytics (Athena)` data source
4. Save dashboard

### Option 2: Manual Creation
Use the JSON as reference to manually create cards with the native SQL queries provided.

## Dashboard Cards

| Card | Description | Key Metrics |
|------|-------------|-------------|
| DAU | Daily Active Users | Unique moms checking in per day |
| Retention | D1/D7/D30 retention | Cohort-based return rates |
| Check-in Completion | Avg check-ins per mom by week | Engagement depth |
| Escalation Rate | Per 100 moms by trigger | Safety signal monitoring |
| Escalation Severity | Distribution by severity | Triage workload |
| Referral Funnel | Conversion from escalation → completed | Provider matching effectiveness |
| Mood Trends | Sadness/anxiety/sleep over time | Population mental health |
| Provider Match Quality | Volume & completion by specialty | Network adequacy |
| Cohort Demographics | Delivery type & feeding method | Population characterization |
| Risk Flags | Prevalence of risk factors | High-risk identification |

## Data Freshness
- Analytics Lambda runs **daily at 02:00 UTC** (EventBridge schedule)
- Data exported to S3 partitioned by date: `analytics/YYYY-MM-DD/`
- Athena partition projection auto-loads new partitions
- Dashboard queries use `export_date` partition for incremental refresh

## Troubleshooting

### No Data Visible
1. Verify Lambda ran: Check CloudWatch logs for `${environment}-analytics-export`
2. Verify S3 files exist: `aws s3 ls s3://firstweeks-analytics/analytics/`
3. Run `MSCK REPAIR TABLE` for all four tables
4. Check Metabase database sync: Admin → Databases → Sync now

### Query Errors
- Ensure Athena tables use `org.openx.data.jsonserde.JsonSerDe`
- Verify column names match export schema (case-sensitive)
- Check for malformed JSON: SerDe property `ignore.malformed.json = true`

### Performance
- Partition pruning via `export_date` in WHERE clauses
- Consider materialized views for heavy dashboards
- Limit query scan with `weekPostpartum` filters

## Security Notes
- All data is **de-identified**: user IDs are salted SHA-256 hashes (16 chars)
- Dates generalized to week/month buckets
- Small cell counts (<11) should be suppressed in public views
- Metabase permissions: Restrict dashboard to admin/analytics role

## Maintenance
- Rotate `ANALYTICS_SALT` annually (requires full re-export)
- Monitor Lambda duration/memory (currently 300s / 1024MB)
- Review Athena costs monthly (pay per TB scanned)

---

*Generated from Terraform template: `infra/terraform/modules/grafana/dashboards/metabase-pilot-analytics.json`*
*Last updated: 2026-10-11*