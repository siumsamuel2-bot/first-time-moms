# Institutional Sales Pipeline: De-Identified Outcome Data Licensing

## Product Overview

Firstweeks collects structured postpartum recovery data that hospitals and research networks would otherwise spend years and millions assembling. Each mother's profile includes delivery type, complication timeline, daily symptom tracking, mental health scores, feeding method transitions, and escalation outcomes.

### Data Asset
- Daily check-in responses (profile-adapted questions)
- Delivery type + complication timeline (vaginal, C-section, emergency C-section)
- Mental health baselines and longitudinal scores (PHQ-2/4 adapted)
- Feeding method tracking (breast, bottle, both) + transitions
- Escalation events and outcomes
- Recovery milestone timing (mobility, wound healing, sleep normalization)
- De-identified demographics (age range, geography, delivery hospital type)

### De-Identification Approach
- No PHI collected at source (no names, DOBs, SSNs, addresses)
- All timestamps shifted by +/- 72 hours
- Geographic data at state/super-region level only
- Minimum cell size of 5 for all cohort queries
- Annual third-party de-identification audit
- HIPAA Safe Harbor compliance

## Target Buyers

### Tier 1: Research Hospitals & Academic Medical Centers
- **Buyer**: Director of Women's Health Research, Chief of OB-GYN
- **Need**: Real-world postpartum outcome data for research grants, publications
- **Budget**: $12,000-$48,000/year for data access
- **Target**: 10 institutions

### Tier 2: OB-GYN Networks & Practice Groups
- **Buyer**: Chief Medical Officer, Practice Administrator
- **Need**: Benchmarking recovery outcomes against peers, quality reporting
- **Budget**: $6,000-$18,000/year
- **Target**: 20 networks

### Tier 3: Pharmaceutical (Postpartum Therapeutics)
- **Buyer**: Clinical Trial Feasibility, Real-World Evidence team
- **Need**: Patient journey data for trial design, site selection
- **Budget**: $24,000-$60,000/year (custom agreements)
- **Target**: 5 pharma companies

## Pricing Tiers

| Tier | Access Level | Price | Target Buyer |
|------|-------------|-------|-------------|
| Basic | Aggregate dashboard + quarterly reports | $6,000/yr | Small practices |
| Professional | Cohort builder + raw exports + monthly updates | $24,000/yr | Research hospitals |
| Enterprise | Custom queries + data append + API access + annual on-site | $60,000/yr | Pharma/RWE |

### Institutional Revenue Projection
- Year 1 (post-pilot): 3-5 contracts, $30K-$72K ARR
- Year 2 (500+ profiles): 15-20 contracts, $150K-$360K ARR
- Year 3 (2,000+ profiles): 40+ contracts, $500K-$1M ARR

## Target List: 20 OB-GYN Networks

### Priority Tier 1 (Research-Oriented, High Fit)
1. **Mayo Clinic** - Women's Health Research Center, Rochester, MN
2. **Cleveland Clinic** - OB-GYN & Women's Health Institute, Cleveland, OH
3. **Johns Hopkins Medicine** - Dept of Gynecology & Obstetrics, Baltimore, MD
4. **Brigham and Women's Hospital** - Dept of OB-GYN, Boston, MA
5. **Northwestern Medicine** - Prentice Women's Hospital, Chicago, IL
6. **UCSF Health** - Dept of OB-GYN & Reproductive Sciences, San Francisco, CA
7. **NYU Langone Health** - Dept of OB-GYN, New York, NY
8. **Duke University Health System** - Dept of OB-GYN, Durham, NC
9. **University of Michigan Health** - Von Voigtlander Women's Hospital, Ann Arbor, MI
10. **Stanford Medicine** - Dept of OB-GYN, Stanford, CA

### Priority Tier 2 (Large OB-GYN Networks)
11. **Women's Health USA** - National network, 80+ locations
12. **Axia Women's Health** - 200+ providers, NJ/PA/OH/DE
13. **Pediatrix Medical Group** - National obstetrics services
14. **Ob Hospitalist Group** - 150+ hospital partners nationally
15. **US Women's Health Alliance** - 70+ practices, 400+ providers

### Priority Tier 3 (Pharma-Relevant)
16. **Johnson & Johnson** - Women's Health R&D, New Brunswick, NJ
17. **Organon** - Women's health spin-off, Jersey City, NJ
18. **Pfizer** - Maternal health research, New York, NY
19. **Bayer Pharma** - Women's healthcare, Berlin/Whippany, NJ
20. **Hologic** - Women's health diagnostics, Marlborough, MA

## Outreach Sequence

### Phase 1: Research & Prep (Week 5-6)
- Compile decision-maker contacts (LinkedIn, hospital directories)
- Research each network's published research in postpartum care
- Note specific relevance angles (e.g., "Your 2023 study on postpartum hemorrhage aligns with our escalation data")
- Prepare personalized value prop per tier

### Phase 2: Initial Outreach (Week 6-8)
- **Day 1**: LinkedIn connection request + personalized note
- **Day 3**: Email with data product brief (see: institutional-sales-onepager.md attached to FIR-26)
- **Day 10**: Follow-up email with sample aggregate report excerpt
- **Day 21**: Phone call request / Calendly link

### Phase 3: Nurture & Close (Week 8-12)
- Schedule discovery call to understand research priorities
- Send custom data preview tailored to their research area
- Provide pilot data access (first 100 profiles at no cost)
- Negotiate contract terms and data use agreement
- Close first 3 contracts

## Pipeline Tracking

Track in `outreach/obgyn-pilot/pipeline-tracker.md` (existing format, extended with institutional column).

## Dependencies & Coordination

- **CTO**: Data pipeline architecture, de-identification implementation, API access layer
- **CEO**: Contract negotiation authority, pricing approval, introductions to hospital system executives
- **Legal**: Data use agreement template, HIPAA business associate agreement
- **Timeline**: Begin outreach Week 6 (post-pilot launch), first contracts target by Month 4

---

*Created: June 16, 2026 | CMO, Firstweeks*
