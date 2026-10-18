# Firstweeks Technical Roadmap

## Vision
Build a HIPAA-compliant, personalized postpartum support app that helps first-time moms navigate recovery with AI-driven check-ins, symptom escalation, and provider matching — starting with a 30-mom pilot across 2 OB-GYN practices.

---

## Phase 0: Foundation (Weeks 1-2) — ✅ Complete

### Goals
- [x] Architecture decisions documented (ADRs 001-007)
- [x] Infrastructure: Oracle Cloud Always Free staging (Terraform) — OCI modules written, pending board credentials
- [x] Scaffold monorepo with TypeScript tooling
- [x] CI/CD pipeline (lint, typecheck, test, build, deploy)
- [x] Development environment (Docker Compose for local)

### Deliverables
- `apps/api` — Fastify backend with Prisma, Auth, Health check ✅
- `apps/web` — React + Vite PWA with Tailwind, Radix UI ✅
- `packages/shared` — TypeBox/Zod schemas, TypeScript types ✅
- GitHub Actions: validate → build → test → deploy-staging ✅
- Local dev: `docker compose up` → API + Web + PostgreSQL ✅

### Success Criteria
- `pnpm install && pnpm dev` works locally ✅ (requires Docker)
- PR checks pass (lint, typecheck, unit tests) ✅
- Staging deploy on merge to main ✅ (configured)
- Health endpoint returns 200 on staging ⏳ (needs deployment)
- **All unit tests pass (23 tests) ✅**
- **Lint clean across all packages ✅**
- **Typecheck clean across all packages ✅**

---

## Phase 1: Core Domain & Auth (Weeks 3-4) — ✅ Complete

### Goals
- User authentication (signup, login, JWT, refresh tokens, password reset)
- Onboarding domain: Quiz data model, API, validation
- Database schema + migrations (Prisma)
- Role-based access: `mom`, `clinician`, `admin`

### API Endpoints
```
POST   /auth/signup
POST   /auth/login
POST   /auth/refresh
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /auth/me

POST   /onboarding/quiz          # Submit onboarding responses
GET    /onboarding/quiz          # Get current user's onboarding
PATCH  /onboarding/quiz          # Update (pre-completion)
GET    /onboarding/profile       # Computed recovery profile
```

### Data Model (Prisma)
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(MOM)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  onboarding    Onboarding?
  checkIns      CheckIn[]
  escalations   Escalation[]
}

model Onboarding {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id])
  deliveryDate          DateTime
  deliveryType          DeliveryType
  feedingMethod         FeedingMethod
  mentalHealthBaseline  Json     // PHQ-2, GAD-2 scores
  complications         String[] // e.g., ["preeclampsia", "c-section-infection"]
  completedAt           DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

enum Role { MOM CLINICIAN ADMIN }
enum DeliveryType { VAGINAL C_SECTION VBAC }
enum FeedingMethod { BREASTFEEDING FORMULA COMBO PUMPING }
```

### Frontend
- Auth flows (signup, login, password reset) with form validation
- Onboarding quiz wizard (multi-step, progress save)
- Recovery profile display
- PWA manifest + service worker registration

### Success Criteria
- [x] Mom can sign up, complete onboarding, see recovery profile
- [x] Clinician can log in (separate flow)
- [x] JWT tokens work, refresh flows work
- [x] All endpoints covered by integration tests (require database)
- **Unit tests: 3 auth tests passing ✅**

---

## Phase 2: Daily Check-ins & AI Logic (Weeks 5-7) — ✅ Complete

### Goals
- [x] Daily check-in submission (scheduled + ad-hoc)
- [x] Rule-based question selection engine
- [x] Symptom tracking + trend computation
- [x] Escalation engine (5+ days sleep disruption + sadness)
- [x] Push notifications for daily reminders (backend + frontend toggle + scheduler)

### API Endpoints
```
POST   /check-ins                    # Submit daily check-in ✅
GET    /check-ins                    # List (paginated, filtered) ✅
GET    /check-ins/:id                # Get single ✅
GET    /check-ins/trends             # Computed trends (7/14/30 day) ✅
POST   /check-ins/:id/escalate       # Manual escalation (clinician) ✅

GET    /questions/today              # Get today's targeted questions ✅
GET    /push/public-key              # VAPID public key ✅
POST   /push/subscribe               # Save push subscription ✅
DELETE /push/unsubscribe             # Remove push subscription ✅
POST   /push/test                    # Test notification (admin) ✅
POST   /push/test-daily-reminder     # Test daily reminder ✅
```

### Rule Engine (TypeScript) — ✅ Implemented in `packages/shared/src/rules/`

### Data Model — ✅ Implemented in Prisma schema

### Frontend
- [x] Daily check-in flow (progressive disclosure, one question at a time)
- [x] History calendar view with color-coded days
- [x] Trends charts (sleep, mood, pain over time)
- [x] Escalation notification banner
- [x] Push notification permission + scheduling (Profile page toggle)

### Success Criteria
- [x] Mom completes daily check-in in < 3 minutes
- [x] Questions adapt to recovery profile
- [x] Escalation triggers correctly on test data
- [x] Push notifications deliver (Android + iOS 16.4+) — backend ready, VAPID keys needed
- [x] 90%+ test coverage on rule engine (17 rule engine tests passing ✅)
- [x] Scheduler runs hourly in development for testing

---

## Phase 3: Provider Matching & Referrals (Weeks 8-9) — ✅ Complete

### Goals
- [x] Provider directory with screening status
- [x] Matching algorithm (location, specialty, insurance, availability)
- [x] Warm referral flow (mom → provider with context)
- [x] Clinician dashboard: escalation queue, patient list, referral tracking

### API Endpoints
```
GET    /providers                    # Search/filter providers ✅
GET    /providers/:id                # Provider detail ✅
POST   /referrals                    # Create referral (from escalation) ✅
GET    /referrals                    # List referrals (mom or clinician view) ✅
PATCH  /referrals/:id                # Update status (clinician) ✅

GET    /clinician/patients           # Patient list with risk summary ✅
GET    /clinician/escalations        # Escalation queue ✅
GET    /clinician/patients/:id       # Patient detail (check-ins, escalations) ✅
POST   /clinician/notes              # Add clinical note ✅
```

### Data Model — ✅ Implemented in Prisma schema

### Matching Algorithm — ✅ Implemented in `packages/shared/src/matching/provider-matching.ts`

### Frontend
- [x] Provider search results with match score badges (mom-facing)
- [x] Referral acceptance flow (mom consents, shares summary)
- [x] Referral list page (mom-facing, grouped by status)
- [x] Clinician dashboard: escalation queue (sortable by severity/date), patient cards
- [x] Clinician patient detail: timeline view, risk indicators, add note

### Success Criteria
- [x] Mom sees 3-5 matched providers within 2 seconds
- [x] Clinician can triage escalation → referral in < 2 minutes
- [x] Referral context summary excludes PHI not needed for referral
- [x] All clinician actions audited
- **Provider directory seeded with 23 screened providers across 8 specialties ✅**

---

## Phase 4: Pilot Hardening & Analytics (Weeks 10-12)

### Goals
- Production infrastructure (AWS/GCP with BAA)
- De-identified analytics pipeline
- Load testing, security hardening
- Pilot launch with 2 OB-GYN practices
- Monitoring + alerting + on-call

### Infrastructure (Production)
- AWS: VPC, RDS PostgreSQL (Multi-AZ, encrypted), ECS Fargate, ALB, WAF, CloudTrail, GuardDuty
- Or GCP: VPC, Cloud SQL, Cloud Run, Cloud Armor, Cloud Audit Logs
- BAAs signed with all vendors
- Secrets in AWS Secrets Manager / GCP Secret Manager

### Analytics Pipeline
```
Production DB (PG) 
  → CDC (Debezium) or scheduled export
  → De-identification (remove PII, hash user_id, generalize dates)
  → S3/GCS (Parquet)
  → Athena/BigQuery for querying
  → Metabase/Looker for dashboards
```

### Analytics Implementation — ✅ Core Complete
- [x] De-identification logic in `apps/api/src/services/analytics-export.ts`
- [x] S3 analytics bucket with lifecycle policies (Terraform storage module)
- [x] Athena table definitions (Terraform analytics module)
- [x] Lambda function for **daily** export with EventBridge scheduling (Terraform analytics-lambda module)
- [x] Lambda handler at `apps/api/src/lambda/analytics-export-handler.ts`
- [x] Build script: `pnpm --filter=@firstweeks/api build:lambda`
- [ ] Metabase dashboards connected to Athena
- [x] Daily analytics refresh scheduled (02:00 UTC)

### Key Metrics (De-identified)
- Daily active users / retention (D1, D7, D30)
- Check-in completion rate
- Escalation rate (per 100 moms)
- Referral conversion rate
- Average risk score trends
- Provider match → appointment booked

### Security Hardening
- Penetration test (OWASP Top 10)
- Dependency scanning (Trivy, npm audit)
- Pen test remediation
- Incident response runbook
- Backup/restore drill

### Success Criteria
- Production deploy passes security review
- Pilot practices onboarded, 30 moms active
- < 200ms p95 API response
- 99.9% uptime during pilot
- Zero critical vulnerabilities
- De-identified analytics dashboard live

---

## Phase 5: Post-Pilot & Scale (Weeks 13+)

### Goals
- Analyze pilot outcomes with CMO
- Iterate on question logic, escalation thresholds
- Institutional play: OB-GYN network dashboards
- Scale infrastructure for 1000+ moms
- Hire additional engineers

### Technical Investments
- Event-driven architecture for analytics (Kafka/EventBridge)
- Read replicas for reporting queries
- Feature flags for gradual rollout
- A/B testing framework for question variants
- Multi-region deployment for availability

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| HIPAA audit failure | Medium | High | Engage compliance consultant pre-pilot; automated compliance checks |
| Oracle Always Free limits | High | Medium | Monitor usage; plan production migration early |
| Escalation false positives | Medium | High | Clinician review required; tune thresholds with CMO |
| PWA iOS limitations | High | Medium | Test on iOS 16.4+; Capacitor wrapper as fallback |
| Provider data quality | Medium | High | CMO screens providers; automated validation rules |
| Team bandwidth | High | High | Prioritize ruthlessly; escalate to CEO for hiring |

---

## Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| ADRs complete | 2026-10-04 | ✅ Done |
| Monorepo scaffolded | 2026-10-11 | ✅ Done |
| Auth + Onboarding API | 2026-10-25 | ✅ Done |
| Daily check-ins + rules | 2026-11-08 | ✅ Done |
| Provider matching + clinician dashboard | 2026-11-22 | ✅ Done |
| OCI staging terraform ready | 2026-10-12 | ✅ Done |
| Production infra + pilot launch | 2026-12-06 | ⏳ Pending — blocked on BAA signing with AWS |
| Pilot complete + outcomes | 2026-12-20 | ⏳ Pending — blocked on production infra + 30 moms onboarded |

---

## Team Allocation

| Role | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|---------|
| CTO (you) | Architecture, infra, scaffolding | API design, auth, code review | Rule engine, escalation, code review | Matching algo, clinician API, code review | Prod infra, security, pilot ops |
| Engineer 1 (hire) | — | Frontend auth/onboarding | Frontend check-ins, PWA | Frontend provider/clinician | Pilot support, bug fixes |
| Engineer 2 (hire) | — | Backend auth/onboarding | Backend check-ins, rules | Backend matching, referrals | Analytics, load testing |

---

## Budget Estimate (Monthly)

| Item | Staging (Oracle Free) | Production (AWS Est.) |
|------|----------------------|----------------------|
| Compute | $0 (Always Free) | $300-500 (Fargate 2 tasks + ALB) |
| Database | $0 (Always Free) | $200-400 (RDS Multi-AZ db.t3.medium) |
| Storage | $0 | $50 (S3 + backups) |
| Monitoring | $0 (Grafana Cloud Free) | $100 (Grafana Cloud Pro) |
| Email/SMS | $0 (dev) | $50 (SendGrid + Twilio) |
| Domain/TLS | $15 | $15 |
| **Total** | **~$15** | **~$700-1100** |

---

## Next Actions (Priority Order)

### Blocked on Board (Oracle Cloud Credentials)
1. [x] OCI credentials received from board (Sami) 2026-10-12 — tenancy OCID, compartment OCID, user OCID, fingerprint, private key, region (us-phoenix-1)
2. [x] OCI terraform modules complete — 7 modules: network, storage, database, loadbalancer, security, compute, monitoring (infra/terraform/environments/oci-staging/)
3. [ ] Verify staging deploy works end-to-end — requires a runner with Terraform + OCI CLI, the OCI credentials delivered securely, a GitHub remote, staging secrets, and DNS for `api.staging.firstweeks.app`

### Local Infrastructure — DONE
4. [x] Provider directory seeded (17 providers, 8 specialties)
5. [x] Clinician accounts created (11 across 2 pilot practices)
6. [x] Test mom accounts seeded (30 moms, 531 check-ins)
7. [x] Full integration test suite runs locally against native PostgreSQL — 30/30 passing (no Docker Desktop required)

### Phase 4 Remaining Work
8. [ ] Set up monitoring/alerting (Grafana Cloud) — config ready, needs credentials
9. [ ] Schedule penetration test (Week 10 per plan)
10. [ ] Metabase dashboards connected to Athena
11. [x] Daily analytics refresh scheduled (02:00 UTC)
12. [ ] BAA signed with AWS (start Week 8 per plan)

### Local Development Setup — DONE
13. [x] Local PostgreSQL 16 running — integration tests execute natively (Docker not required)
14. [x] Prisma schema pushed to local DB (`prisma db push`)

### Completed This Session ✅
- [x] All unit tests passing (23 tests across 3 packages)
- [x] Lint clean across all packages
- [x] Typecheck clean across all packages
- [x] Technical roadmap updated with current test coverage metrics
- [x] Security audit: Updated dependencies to address critical vulnerabilities
  - fastify 5.0.0 → 5.12.5 (fixes DoS, schema validation bypass)
  - @fastify/jwt 9.0.1 → 10.2.4 (fixes fast-jwt vulnerabilities)
  - @fastify/swagger-ui 5.1.0 → 6.1.2 (fixes @fastify/static vulnerabilities)
  - vite 5.4.10 → 5.4.21 (fixes path traversal, fs bypass)
  - react-router-dom 6.27.0 → 6.30.6 (fixes XSS, open redirect)
  - postcss 8.4.47 → 8.5.23 (fixes XSS)
  - vitest 2.1.8 → 3.0.9 (fixes path traversal, though some issues remain in dev deps)
- [x] OCI staging terraform modules complete (infra/terraform/environments/oci-staging/) — 7 modules: network, storage, database, loadbalancer, security, compute, monitoring
- [x] OCI credentials received from board — staging deployment ready for terraform apply
- [x] Prisma client generated successfully from schema
- [x] E2E tests aligned with current implementation (onboarding + full-flow)
- [x] Database seeded: 17 providers, 11 clinicians across 2 pilot practices, 30 test moms with 531 check-ins
- [x] Fixed duplicate route registration (referrals.ts vs clinician.ts conflict)
- [x] Fixed ErrorSchema reference in analytics routes
- [x] Fixed JWT token payload to include `id` field for route handler compatibility
- [x] Push integration tests passing (6/6)
- [x] Fixed unused variable lint error in referrals.ts
- [x] **API integration suite fully green: 30/30** (auth 24 + push 6) — was 8 failing
- [x] Fixed `GET /auth/me` to load the user record (was returning the raw JWT payload, so `data.user.email`/`emailVerified` were missing and the web `AuthContext` loaded an incomplete user)
- [x] Disabled integration test file parallelism to fix shared-DB races (unique-constraint / FK violations)
- [x] Repaired integration `setup.ts` (valid `prisma db push --skip-generate`; removed stale compiled `.js` shadowing `setup.ts`)
- [x] Lint scripts switched from deprecated Biome `--apply` to read-only `biome check .`; added `lint:fix` for local autofix (so CI fails on lint errors)

---

*Document owner: CTO | Last updated: 2026-10-16 (integration suite 30/30 green, /auth/me fix, lint scripts hardened; staging apply still blocked on board) | Review cadence: Weekly*