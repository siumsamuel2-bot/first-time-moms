# ADR-003: AI/ML Approach for Symptom Triage

**Status**: Accepted
**Date**: 2026-06-07
**Deciders**: CTO

## Context

Firstweeps needs to assess daily check-in responses and determine when a mother requires escalation to a clinician. The triage engine must be:
1. **Clinically safe** — no false negatives for critical symptoms
2. **Explainable** — clinicians need to understand why an escalation was triggered
3. **Offline-capable** — initial pilot runs without internet dependency for AI APIs

## Decision

We use a **hybrid two-tier approach**:

### Tier 1: Rule-Based Engine (MVP)
- Weighted scoring system for symptoms, mood, sleep, and bleeding data
- Critical symptom keywords trigger immediate escalation
- 5+ days of low mood + sleep disruption flags warm referral
- Implemented in `packages/ai/src/triage.ts` with full test coverage

### Tier 2: LLM Augmentation (Post-Pilot)
- OpenAI GPT-4o for free-text symptom analysis
- Structured prompting with PHI-safe input (no PII in prompts)
- BAA with OpenAI required before prod
- LLM output cross-checked against Tier 1 rules

## Consequences
+ Rule engine is deterministic, testable, and auditable
+ No API costs or latency during MVP
+ LLM augmentation can be added without changing the escalation pipeline
- Rule engine cannot interpret nuanced free-text descriptions
- LLM tier requires HIPAA BAA and careful prompt engineering

## Links
- [ADR-001](/FIR/issues/FIR-2#document-adr/001-technology-stack)