# IRB Strategy Memo — De-Identified Outcome Data Licensing

**To:** CEO, CTO  
**From:** CMO  
**Date:** June 18, 2026  
**Subject:** IRB pathway for institutional data licensing

---

## Executive Summary

Per CEO's strategic decision of Jun 14, de-identified outcome data licensing requires separate IRB review. This memo outlines the pathway, timeline, and resource requirements to obtain IRB coverage for institutional sales.

The recommended approach is **Exempt Determination via Commercial IRB** — fastest path, lowest cost, and sufficient for de-identified data that qualifies under 45 CFR 46.104(d)(4).

---

## Background

Firstweeks collects postpartum recovery data via daily check-ins. Users opt in to de-identified data use during onboarding. The data is fully de-identified per HIPAA Safe Harbor (no 18 identifiers). However, institutional buyers (research hospitals, pharma) typically require IRB review or a determination that the data product does not constitute human subjects research.

---

## IRB Pathway Options

| Option | Timeline | Cost | Best For | Risk |
|--------|----------|------|----------|------|
| **A. Exempt Determination (Recommended)** | 2-4 weeks | $2,000-$4,000 | Research hospitals, academic buyers | Low — de-identified data typically qualifies as exempt |
| **B. Expedited Review** | 4-8 weeks | $5,000-$10,000 | Pharma buyers requiring formal approval | Medium — adds time but satisfies pharma compliance |
| **C. Full Board Review** | 8-12 weeks | $10,000-$20,000 | If data includes any identifiable information | High — only needed if de-identification is challenged |
| **D. Institutional Reliance (IRB Authorization Agreement)** | 4-6 weeks | $1,000-$3,000 | When buyer's institution wants their own IRB to review | Medium — depends on buyer institution's IRB workload |

---

## Recommended Path: Option A — Exempt Determination

### Why Exempt Determination Works
Under 45 CFR 46.104(d)(4):
- Research involving **existing data** that is **publicly available** or **recorded in a de-identified manner** qualifies for exemption
- Firstweeks data is de-identified at source (no PHI collected)
- Users consent to de-identified data use at onboarding
- No interaction with subjects for research purposes

### Process
1. **Engage commercial IRB** (e.g., WCG, Advarra, Sterling) — 1 week
2. **Submit protocol** describing data collection, de-identification method, and proposed use — 1 week
3. **Receive exempt determination letter** — 1-2 weeks review
4. **Share determination letter** with institutional buyers as part of Data Use Agreement

### Recommended IRBs
| IRB | Specialty | Typical Cost | Est. Timeline | Notes |
|-----|-----------|-------------|--------------|-------|
| **WCG IRB** | Digital health, device, multi-site | $3,000 | 2-3 weeks | Industry standard for health tech |
| **Advarra** | Academic medical centers | $3,500 | 2-4 weeks | Strong in multi-institutional settings |
| **Quorum (WIRB)** | Pharma, device trials | $3,000 | 2-3 weeks | Pharma-friendly |

---

## What IRB Will Need

### From CTO
- [ ] Complete data schema (fields, collection methods, de-identification)
- [ ] Technical description of de-identification pipeline (Safe Harbor attestation)
- [x] Opt-in consent language from onboarding flow
- [ ] BAA with contributing practices

### From CMO
- [ ] Description of buyer segments and use cases
- [ ] Data Use Agreement draft (defines access restrictions)
- [ ] Institutional sales one-pager (context for IRB)

### From Legal (if available)
- [ ] Review of opt-in consent language
- [ ] DUA template alignment with HIPAA requirements

---

## Timeline

| Phase | Action | Owner | Due |
|-------|--------|-------|-----|
| **Prep** | Finalize data schema and de-identification documentation | CTO | Jun 25 |
| **Prep** | Draft IRB protocol (template provided by IRB) | CMO + CTO | Jun 28 |
| **Prep** | Review user consent language for data use | CMO | Jun 18 ✅ |
| **Engage** | Select and engage commercial IRB | CMO | Jul 1 |
| **Submit** | Submit protocol for exempt determination | CMO + CTO | Jul 5 |
| **Review** | IRB review (1-2 weeks) | IRB | Jul 19 |
| **Result** | Receive exempt determination letter | CMO | Jul 19 |
| **Go** | Begin institutional outreach with letter | CMO | Jul 21 |

---

## Cost Estimate

| Item | Estimated Cost |
|------|---------------|
| Commercial IRB exempt determination | $3,000 - $4,000 |
| Legal review (if outsourced) | $2,000 - $5,000 |
| **Total** | **$5,000 - $9,000** |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| IRB determines additional review needed | Low | Medium | Pre-submit data dictionary and de-identification approach for informal feedback |
| Buyer institution requires own IRB review | Medium | Medium | Have IRB Authorization Agreement (IAA) template ready; budget $2K per institution |
| State-specific regulations (e.g., CA, NY) | Low | Low | WCG/Advarra handle multi-state submissions |
| Consent language insufficient for data use | Low | High | Review during prep phase; amend onboarding if needed |

---

## Next Steps

1. **CMO**: Select commercial IRB (WCG recommended) and initiate engagement by Jul 1
2. **CTO**: Complete data schema documentation and de-identification pipeline description
3. **CMO**: Prepare IRB protocol draft by Jun 28 for CTO review
4. **CMO**: Update institutional sales one-pager with IRB status (post-determination)

---

## Budget Request

Requesting **$5,000** for IRB exempt determination and legal review (contingent on CEO approval).

---

*Prepared by CMO, Firstweeks — June 2026*
