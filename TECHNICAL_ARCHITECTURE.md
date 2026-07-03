# Technical Architecture Plan — Firstweeks

## Stack Decisions

- **Runtime/Backend**: Node.js with TypeScript — strong ecosystem for healthcare-adjacent apps, excellent async I/O for real-time check-in scheduling.
- **Web Framework**: Next.js 14 (App Router) — server components for data-heavy profile pages, API routes for check-in endpoints, built-in edge caching.
- **Database**: PostgreSQL — JSONB for flexible recovery profiles, strong ACID for escalation state machine.
- **ORM**: Drizzle — type-safe, lightweight ORM for PostgreSQL.
- **AI Layer**: Rule-based triage engine with planned integration of OpenAI GPT-4 for enhanced symptom analysis.
- **Auth**: NextAuth.js v5 — OAuth for consumer sign-in.
- **Infrastructure**: Docker Compose for local dev; planned migration to AWS ECS Fargate for staging/prod; Terraform for IaC.
- **CI/CD**: GitHub Actions — lint → typecheck → test → build → deploy per environment.
- **Testing**: Vitest for unit/integration.

## HIPAA Considerations

- Data-at-rest encryption (AES-256) and in-transit (TLS 1.3).
- Row-level security in PostgreSQL scoped by patient + provider.
- Audit log for every PHI access event.
- Signed BAA with OpenAI/cloud provider before prod.
- No PHI in logs, error reporting, or AI training data.

## Data Model (Implemented)

### RecoveryProfile
- id, userId, deliveryDate, deliveryType (vaginal/c_section/emergency_c_section), feedingMethod (breast/bottle/both, nullable), mentalHealthBaseline (jsonb), complications (text[]), dataConsent (text), dataConsentVersion (text), dataConsentGrantedAt (timestamp), createdAt, updatedAt

### DailyCheckIn
- id, profileId, checkInDate, questionResponses (jsonb), escalationScore, createdAt

### Escalation
- id, profileId, triggeredAt, severity (low/medium/high/critical), symptoms (text[]), triageResult, clinicianReviewedAt, resolvedAt

### Provider
- id, name, specialty, acceptingNewPatients (bool), contractStatus

### AuditLog
- id, userId, action, resourceType, resourceId, details, createdAt

## Onboarding Quiz Engine

- Adaptive branching based on delivery type + responses.
- State machine: Welcome → Delivery Details → Mental Health Baseline → Feeding → Data Consent → Profile Created.
- Each step validates before advancing; partial saves via debounced API.
- API routes: POST /api/onboarding (step progression), GET /api/onboarding (profile retrieval)

## Daily Check-In Engine

- Scheduler-based check-in windows based on delivery date.
- Questions are dynamically selected from a pool tagged by recovery profile attributes.
- Push notification → in-app response → severity scoring → escalation if threshold crossed.

## Escalation Pipeline

- Symptom responses scored via weighted rule engine.
- Threshold: >= medium severity for 3 consecutive days, or any critical flag → auto-escalate.
- Escalation generates: warm provider referral, clinician dashboard alert, SMS follow-up.

## Quality Assurance Status (Updated)

- **Type Checking**: Passes across all workspaces (@firstweeks/web, @firstweeks/ai, @firstweeks/db, @firstweeks/design-system, @firstweeks/shared)
- **Linting**: Passes with zero warnings across all packages
- **Unit Tests**: 14 passing tests (6 triage, 8 onboarding)
- **Build**: All packages compile successfully
- **CI/CD**: GitHub Actions pipeline validated (lint → typecheck → test → build)