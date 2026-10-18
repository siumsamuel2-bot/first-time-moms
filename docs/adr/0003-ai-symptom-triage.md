# ADR-003: AI-Driven Symptom Triage with Rule-Based Engine + LLM Enhancement

## Status
Accepted

## Context
Firstweeks needs AI-driven daily check-ins with:
- Targeted questions shaped by recovery profile (delivery type, feeding method, mental health baseline)
- Symptom escalation logic: 5+ days of sleep disruption + sadness triggers warm referral
- Provider matching based on location, specialty, insurance
- Clinician dashboard with risk scoring

Constraints:
- HIPAA: No PHI sent to external LLM APIs without BAA
- Pilot scale: 30 users, low latency requirements
- Team has no ML engineering expertise
- Need explainable decisions for clinician trust
- Rapid iteration on question logic based on pilot feedback

## Decision
Use a **hybrid approach**:

1. **Rule-Based Engine (Core)** — Deterministic, explainable logic for:
   - Escalation triggers (5+ days sleep disruption + sadness = escalate)
   - Question selection based on recovery profile flags
   - Risk scoring (0-100) based on PHQ-2/GAD-2 scores, sleep, pain, bleeding
   - Implemented in application code (TypeScript/Python), version-controlled, testable

2. **LLM Enhancement (Optional, Opt-in)** — For:
   - Natural language question phrasing (personalized tone)
   - Summarizing check-in trends for clinician dashboard
   - Generating patient-friendly educational content
   - Only with explicit user consent, PHI stripped, using HIPAA-BAA-covered provider (Azure OpenAI, AWS Bedrock) or local model

3. **Provider Matching** — Deterministic scoring:
   - Geographic proximity (PostGIS)
   - Specialty match (perinatal mental health, lactation, pelvic floor)
   - Insurance acceptance
   - Availability (next 7 days)
   - Screening status (vetted by CMO)

## Consequences

### Positive
- Fully explainable and auditable escalation decisions
- No PHI leaves infrastructure for core logic
- Fast iteration on rules without retraining
- Clinician trust via transparent logic
- Low latency (< 50ms for rule evaluation)
- No ML ops overhead

### Negative
- Rule maintenance burden as complexity grows
- Less "intelligent" than pure ML for nuanced patterns
- LLM enhancement adds complexity (optional, can defer)

### Neutral
- Rules encoded as TypeScript functions with unit tests
- Risk score algorithm documented in `docs/clinical/risk-scoring.md`
- LLM integration behind feature flag, off by default

## Alternatives Considered

**Pure ML Model (trained on postpartum data)**
- Rejected: No training data yet, no ML expertise, explainability concerns, HIPAA complexity
- Considered: Better pattern detection long-term

**External LLM API for All Logic**
- Rejected: PHI concerns, latency, cost, non-deterministic, hard to audit
- Considered: Natural language flexibility

**Clinical Decision Support Rules Engine (e.g., OpenCDS)**
- Rejected: Overhead, healthcare-specific, team unfamiliar
- Considered: Standards-compliant

## References
- Clinical risk scoring: PHQ-2, GAD-2, Edinburgh Postnatal Depression Scale
- HIPAA BAA requirements for AI vendors
- PostGIS for geographic provider matching