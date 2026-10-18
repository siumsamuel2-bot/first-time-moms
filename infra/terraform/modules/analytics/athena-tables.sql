-- Athena Table Definitions for Firstweeks De-identified Analytics
-- Run in AWS Athena console or via Terraform
-- Data source: S3 bucket with JSONL files partitioned by date (analytics/YYYY-MM-DD/)

-- Database
CREATE DATABASE IF NOT EXISTS firstweeks_analytics
COMMENT 'Firstweeks de-identified analytics data'
LOCATION 's3://firstweeks-analytics/';

-- Users Table
CREATE EXTERNAL TABLE IF NOT EXISTS firstweeks_analytics.users (
  userIdHash STRING COMMENT 'Salted SHA-256 hash of user ID (16 chars)',
  weeksPostpartum INT COMMENT 'Weeks since delivery at time of export',
  deliveryType STRING COMMENT 'VAGINAL, C_SECTION, or VBAC',
  feedingMethod STRING COMMENT 'BREASTFEEDING, FORMULA, COMBO, or PUMPING',
  mentalHealthBaseline STRUCT<
    phq2Score: INT,
    gad2Score: INT,
    epdsScore: INT
  > COMMENT 'Baseline mental health screening scores',
  riskFlags ARRAY<STRING> COMMENT 'Array of risk flags (phq2_elevated, gad2_elevated, epds_elevated, delivery_complications)',
  createdAtMonth STRING COMMENT 'User creation month (YYYY-MM)'
)
PARTITIONED BY (export_date STRING COMMENT 'Export date (YYYY-MM-DD)')
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES ('ignore.malformed.json' = 'true')
LOCATION 's3://firstweeks-analytics/analytics/'
TBLPROPERTIES (
  'projection.enabled' = 'true',
  'projection.export_date.type' = 'date',
  'projection.export_date.format' = 'YYYY-MM-DD',
  'projection.export_date.interval' = '1',
  'projection.export_date.interval.unit' = 'DAYS',
  'storage.location.template' = 's3://firstweeks-analytics/analytics/${export_date}/'
);

-- Check-ins Table
CREATE EXTERNAL TABLE IF NOT EXISTS firstweeks_analytics.checkins (
  userIdHash STRING COMMENT 'Salted SHA-256 hash of user ID (16 chars)',
  checkInIdHash STRING COMMENT 'Salted SHA-256 hash of check-in ID (16 chars)',
  weekPostpartum INT COMMENT 'Week postpartum at time of check-in',
  sleepHours DOUBLE COMMENT 'Hours of sleep (0-24)',
  sleepDisruption INT COMMENT 'Sleep disruption score (1-5)',
  sadness INT COMMENT 'Sadness score (1-5)',
  anxiety INT COMMENT 'Anxiety score (1-5)',
  painLevel INT COMMENT 'Pain level (1-10)',
  bleeding STRING COMMENT 'Bleeding level (NONE, SPOTTING, LIGHT, MODERATE, HEAVY)',
  feedingIssues BOOLEAN COMMENT 'Whether feeding issues were reported',
  createdAtWeek STRING COMMENT 'Check-in week (YYYY-WWW)'
)
PARTITIONED BY (export_date STRING COMMENT 'Export date (YYYY-MM-DD)')
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES ('ignore.malformed.json' = 'true')
LOCATION 's3://firstweeks-analytics/analytics/'
TBLPROPERTIES (
  'projection.enabled' = 'true',
  'projection.export_date.type' = 'date',
  'projection.export_date.format' = 'YYYY-MM-DD',
  'projection.export_date.interval' = '1',
  'projection.export_date.interval.unit' = 'DAYS',
  'storage.location.template' = 's3://firstweeks-analytics/analytics/${export_date}/'
);

-- Escalations Table
CREATE EXTERNAL TABLE IF NOT EXISTS firstweeks_analytics.escalations (
  userIdHash STRING COMMENT 'Salted SHA-256 hash of user ID (16 chars)',
  escalationIdHash STRING COMMENT 'Salted SHA-256 hash of escalation ID (16 chars)',
  trigger STRING COMMENT 'Escalation trigger type',
  severity STRING COMMENT 'LOW, MEDIUM, HIGH, or CRITICAL',
  weekPostpartum INT COMMENT 'Week postpartum at time of escalation',
  resolved BOOLEAN COMMENT 'Whether escalation was resolved',
  createdAtWeek STRING COMMENT 'Escalation week (YYYY-WWW)'
)
PARTITIONED BY (export_date STRING COMMENT 'Export date (YYYY-MM-DD)')
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES ('ignore.malformed.json' = 'true')
LOCATION 's3://firstweeks-analytics/analytics/'
TBLPROPERTIES (
  'projection.enabled' = 'true',
  'projection.export_date.type' = 'date',
  'projection.export_date.format' = 'YYYY-MM-DD',
  'projection.export_date.interval' = '1',
  'projection.export_date.interval.unit' = 'DAYS',
  'storage.location.template' = 's3://firstweeks-analytics/analytics/${export_date}/'
);

-- Referrals Table
CREATE EXTERNAL TABLE IF NOT EXISTS firstweeks_analytics.referrals (
  userIdHash STRING COMMENT 'Salted SHA-256 hash of user ID (16 chars)',
  referralIdHash STRING COMMENT 'Salted SHA-256 hash of referral ID (16 chars)',
  providerSpecialty ARRAY<STRING> COMMENT 'Provider specialties',
  status STRING COMMENT 'Referral status (PENDING, MOM_CONSENTED, PROVIDER_NOTIFIED, APPOINTMENT_SCHEDULED, COMPLETED, DECLINED, EXPIRED)',
  weekPostpartum INT COMMENT 'Week postpartum at time of referral',
  createdAtWeek STRING COMMENT 'Referral week (YYYY-WWW)'
)
PARTITIONED BY (export_date STRING COMMENT 'Export date (YYYY-MM-DD)')
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES ('ignore.malformed.json' = 'true')
LOCATION 's3://firstweeks-analytics/analytics/'
TBLPROPERTIES (
  'projection.enabled' = 'true',
  'projection.export_date.type' = 'date',
  'projection.export_date.format' = 'YYYY-MM-DD',
  'projection.export_date.interval' = '1',
  'projection.export_date.interval.unit' = 'DAYS',
  'storage.location.template' = 's3://firstweeks-analytics/analytics/${export_date}/'
);

-- After creating tables, run MSCK REPAIR TABLE to load partitions:
-- MSCK REPAIR TABLE firstweeks_analytics.users;
-- MSCK REPAIR TABLE firstweeks_analytics.checkins;
-- MSCK REPAIR TABLE firstweeks_analytics.escalations;
-- MSCK REPAIR TABLE firstweeks_analytics.referrals;

-- Example Queries for Metabase Dashboards

-- 1. Daily Active Users (DAU) by week postpartum
-- SELECT weekPostpartum, COUNT(DISTINCT userIdHash) as dau_count, export_date
-- FROM firstweeks_analytics.checkins
-- GROUP BY weekPostpartum, export_date
-- ORDER BY export_date, weekPostpartum;

-- 2. Check-in completion rate by week postpartum
-- SELECT 
--   c.weekPostpartum,
--   COUNT(DISTINCT c.userIdHash) as active_users,
--   COUNT(*) as total_checkins,
--   COUNT(*) * 1.0 / COUNT(DISTINCT c.userIdHash) as avg_checkins_per_user
-- FROM firstweeks_analytics.checkins c
-- GROUP BY c.weekPostpartum
-- ORDER BY c.weekPostpartum;

-- 3. Escalation rate per 100 moms by trigger type
-- SELECT 
--   e.trigger,
--   COUNT(DISTINCT e.userIdHash) as escalated_moms,
--   COUNT(*) as total_escalations,
--   COUNT(DISTINCT e.userIdHash) * 100.0 / (SELECT COUNT(DISTINCT userIdHash) FROM firstweeks_analytics.users) as rate_per_100
-- FROM firstweeks_analytics.escalations e
-- GROUP BY e.trigger
-- ORDER BY rate_per_100 DESC;

-- 4. Referral conversion funnel
-- SELECT 
--   r.status,
--   COUNT(DISTINCT r.userIdHash) as moms_count,
--   COUNT(*) as referrals_count
-- FROM firstweeks_analytics.referrals r
-- GROUP BY r.status
-- ORDER BY 
--   CASE r.status 
--     WHEN 'PENDING' THEN 1
--     WHEN 'MOM_CONSENTED' THEN 2
--     WHEN 'PROVIDER_NOTIFIED' THEN 3
--     WHEN 'APPOINTMENT_SCHEDULED' THEN 4
--     WHEN 'COMPLETED' THEN 5
--     WHEN 'DECLINED' THEN 6
--     WHEN 'EXPIRED' THEN 7
--     ELSE 8
--   END;

-- 5. Average risk score trends by week postpartum
-- SELECT 
--   c.weekPostpartum,
--   AVG(c.sleepDisruption) as avg_sleep_disruption,
--   AVG(c.sadness) as avg_sadness,
--   AVG(c.anxiety) as avg_anxiety,
--   AVG(c.painLevel) as avg_pain
-- FROM firstweeks_analytics.checkins c
-- WHERE c.weekPostpartum BETWEEN 0 AND 12
-- GROUP BY c.weekPostpartum
-- ORDER BY c.weekPostpartum;

-- 6. Provider match quality by specialty
-- SELECT 
--   r.providerSpecialty[1] as primary_specialty,
--   COUNT(*) as referral_count,
--   COUNT(CASE WHEN r.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
-- FROM firstweeks_analytics.referrals r
-- WHERE r.providerSpecialty IS NOT NULL AND CARDINALITY(r.providerSpecialty) > 0
-- GROUP BY r.providerSpecialty[1]
-- ORDER BY referral_count DESC;