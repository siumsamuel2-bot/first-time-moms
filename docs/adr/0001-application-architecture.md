# ADR-001: Use Modular Monolith Architecture

## Status
Accepted

## Context
Firstweeks is a postpartum support app with the following requirements:
- Mobile-first web app (PWA) for first-time moms
- Onboarding quiz collecting delivery details, feeding method, mental health baseline
- Daily check-ins with AI-driven targeted questions shaped by recovery profile
- Symptom escalation: 5+ days of sleep disruption + sadness triggers warm referral
- Provider matching with screened providers
- Clinician dashboard for reviewing flagged escalations
- Pilot with 2 OB-GYN practices, 30 first-time mothers
- Institutional play: de-identified outcome data for OB-GYN networks

Constraints:
- Small team (CTO + 1-2 engineers initially)
- HIPAA compliance required for production
- Need rapid iteration for pilot feedback
- Budget-conscious (Oracle Cloud Always Free for staging)
- Timeline: MVP for pilot in 8-12 weeks

## Decision
Use a **Modular Monolith** architecture deployed as a single containerized application with:
- Clear module boundaries (domains: onboarding, check-ins, escalation, providers, clinician-dashboard, analytics)
- Shared PostgreSQL database with schema-per-module
- Internal module communication via direct function calls (not HTTP)
- Single deployment unit (Docker container)
- API layer exposing REST endpoints for frontend

## Consequences

### Positive
- Simple deployment and operations (single container)
- Low operational overhead for small team
- Easy debugging and tracing (no distributed system complexity)
- Module boundaries enforce domain separation for future extraction
- Can extract services later when team/domain complexity grows
- Cost-effective for staging/production (single compute instance)
- Fast iteration cycle

### Negative
- Single point of failure (mitigated by health checks + auto-restart)
- Technology lock-in within modules (acceptable for v1)
- Scaling is all-or-nothing (acceptable for pilot scale)
- Module discipline required to prevent coupling

### Neutral
- Team must maintain module boundaries via code review and linting
- Database schema changes require coordination

## Alternatives Considered

**Microservices**
- Rejected: Operational complexity too high for team of 2-3, pilot scale doesn't justify it
- Considered: Better fault isolation, independent scaling

**Serverless (Functions + API Gateway)**
- Rejected: Cold starts affect UX for daily check-ins, vendor lock-in, debugging harder
- Considered: Auto-scaling, pay-per-use

**Full Monolith (no module boundaries)**
- Rejected: Technical debt risk, harder to extract services later
- Considered: Simplest initial implementation

## References
- Architecture Patterns Reference: Modular Monolith pattern
- Team size: 2-3 engineers
- Target scale: 30 pilot users, < 1000 RPS