# Technical Architecture Plan — Firstweeks

## Stack Decisions

- **Runtime/Backend**: Node.js with TypeScript — strong ecosystem for healthcare-adjacent apps, excellent async I/O for real-time check-in scheduling.
- **Web Framework**: Next.js 14 (App Router) — server components for data-heavy profile pages, API routes for check-in endpoints, built-in edge caching.
- **Database**: PostgreSQL (via Supabase or RDS) — JSONB for flexible recovery profiles, strong ACID for escalation state machine, pgvector for symptom similarity queries.
- **ORM**: Drizzle — type-safe, lightweight, native PostGIS support for provider geolocation.
- **AI Layer**: OpenAI GPT-4 + custom fine-tuned classifier for triage — HIPAA-compatible via BAA; local fallback with Llama 3 for offline-capable clinics.
- **Auth**: NextAuth.js v5 — OAuth for consumer sign-in, provider-scoped JWT for clinician dashboard.
- **Mobile**: React Native (Expo) — shared TypeScript types with the web layer; daily check-in UX needs native push notifications.
- **Infrastructure**: Docker Compose for local dev; AWS ECS Fargate for staging/prod; Terraform for IaC.
- **CI/CD**: GitHub Actions — lint → typecheck → test → build → deploy per environment.
- **Testing**: Vitest for unit/integration, Playwright for E2E, k6 for load testing escalation pipeline.

## HIPAA Considerations

- Data-at-rest encryption (AES-256) and in-transit (TLS 1.3).
- Row-level security in PostgreSQL scoped by patient + provider.
- Audit log for every PHI access event.
- Signed BAA with OpenAI/cloud provider before prod.
- No PHI in logs, error reporting, or AI training data.

## Data Model (Initial)

### RecoveryProfile
- id, userId, deliveryDate, deliveryType (vaginal/c-section/emergency-c-section), feedingMethod (breast/bottle/both), mentalHealthBaseline, complications (text[]), createdAt, updatedAt

### DailyCheckIn
- id, profileId, checkInDate, questionResponses (jsonb), escalationScore, createdAt

### Escalation
- id, profileId, triggeredAt, severity (low/medium/high/critical), symptoms (text[]), triageResult, clinicianReviewedAt, resolvedAt

### Provider
- id, name, specialty, location (PostGIS point), acceptingNewPatients (bool), contractStatus

## Onboarding Quiz Engine

- Adaptive branching based on delivery type + responses.
- State machine: Welcome → Delivery Details → Mental Health Baseline → Feeding Plan → Profile Created.
- Each step validates before advancing; partial saves via debounced API.

## Daily Check-In Engine

- Cron trigger (or AWS EventBridge) schedules per-profile check-in windows based on delivery date.
- Questions are dynamically selected from a pool tagged by recovery profile attributes.
- Push notification → in-app response → severity scoring → escalation if threshold crossed.

## Escalation Pipeline

- Symptom responses scored via weighted rule engine + classifier ensemble.
- Threshold: >= medium severity for 3 consecutive days, or any critical flag → auto-escalate.
- Escalation generates: warm provider referral, clinician dashboard alert, SMS follow-up.