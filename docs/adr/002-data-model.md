# ADR-002: Data Model for Recovery Profiles, Check-Ins, and Escalations

## Status
Accepted

## Context
The app must store flexible recovery profiles (delivery type, complications, feeding method, mental health baseline), daily check-in responses, and an escalation pipeline with clinician review.

## Decision
Use PostgreSQL with JSONB for flexible profile/questionnaire data and relational tables for escalation state machine.

### Tables
- **recovery_profiles**: id (uuid), user_id (uuid), delivery_date, delivery_type (enum), feeding_method (enum), mental_health_baseline (jsonb), complications (text[]), created_at, updated_at
- **daily_check_ins**: id, profile_id (FK), check_in_date, responses (jsonb), escalation_score (int), created_at — unique per profile+date
- **escalations**: id, profile_id (FK), triggered_at, severity (enum: low/medium/high/critical), symptoms (text[]), triage_result (jsonb), clinician_reviewed_at, resolved_at
- **providers**: id, name, specialty, location (PostGIS point), accepting_new_patients, contract_status
- **audit_log**: id, user_id, action, resource_type, resource_id, details (jsonb), ip_address, created_at

## Consequences
- JSONB gives schema flexibility for evolving questionnaires without migrations.
- Row-level security on patient data is straightforward with user_id FK.
- Audit log table satisfies HIPAA access logging requirements.