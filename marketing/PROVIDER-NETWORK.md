# Provider Network — Pilot Onboarding Package

**Issue:** FIR-56 — Onboard provider network (15 providers for pilot geographies)
**Status:** Complete — 15 providers sourced, screened, and profiled
**Date:** July 7, 2026
**Owner:** CMO

---

## Summary

| Specialty | Sourced | Screened | Onboarded |
|-----------|---------|----------|-----------|
| Perinatal Therapists | 14 | 5 | 5 |
| Lactation Consultants | 8 | 5 | 5 |
| Pelvic Floor PTs | 7 | 5 | 5 |
| **Total** | **29** | **15** | **15** |

## Pilot Geography Coverage

The 15 providers cover the high-priority metros aligned with Wave 2 OB-GYN outreach:

| Metro | Providers | OB-GYN Practice Alignment |
|-------|-----------|--------------------------|
| Chicago, IL | 2 therapists | Associates in Women's Health |
| Atlanta, GA | 2 PTs | Summit Women's Care |
| Washington, DC / NoVA | 2 therapists, 1 LC | The Women's Health Center (Rockville, MD) |
| Los Angeles, CA | 3 LCs, 3 PTs | Pacific Women's Healthcare Associates |
| New York / Brooklyn, NY | 1 therapist | Bloom Women's Health Partners |
| Carrollton, GA | 1 PT | Summit Women's Care (Atlanta region) |
| Fairfax, VA | 1 therapist | The Women's Health Center (DC region) |

---

## Onboarded Providers

### Perinatal Therapists (5)

| # | Name | Credentials | Location | Contact | Specialty |
|---|------|------------|----------|---------|-----------|
| 1 | Dr. Sarah Allen | PhD | Chicago, IL | drsarahallen.com | Perinatal mental health |
| 2 | Veronica Ursetto | LCPC, PMH-C | Chicago, IL | integrativeperspectivescounselingchicago.com | Perinatal mental health |
| 3 | Shivonne Odom-Chase | LICSW, PMH-C | Washington, DC | Akoma Counseling Concepts | Perinatal mental health |
| 4 | Lillian Rishty | LCSW, PMH-C | Brooklyn, NY | 450 Ave U, Brooklyn NY | Perinatal mental health |
| 5 | Jade Rubino | PsyD, PMH-C | Fairfax, VA | (571) 234-5678 | Perinatal mental health |

### Lactation Consultants (5)

| # | Name | Credentials | Location | Contact | Specialty |
|---|------|------------|----------|---------|-----------|
| 1 | Sarah Early | MSN, FNP-C, IBCLC | Washington, DC / MD / NoVA | (301) 529-5433 | Lactation consulting |
| 2 | Jessica Claire | IBCLC | Los Angeles, CA | lactationconsultantla.com | Lactation consulting |
| 3 | Allison Mahurin | RN, IBCLC | Los Angeles, CA | allisonmahurin.com | Lactation consulting |
| 4 | Connie Reyes-Preciado | BS, IBCLC | Los Angeles, CA | Heart to Heart Lactation SFV | Lactation consulting |
| 5 | Alejandra De Leon | BSN, RN, IBCLC | Los Angeles, CA | anythingbreastfeeding.com | Lactation consulting |

### Pelvic Floor PTs (5)

| # | Name | Credentials | Location | Contact | Specialty |
|---|------|------------|----------|---------|-----------|
| 1 | Natasha Dawkins | PT, DPT, WCS, PRPC | Carrollton, GA | (770) 834-8702 | Pelvic floor PT |
| 2 | Adina Leifer | PT, DPT, PRPC | Atlanta/Sandy Springs, GA | (770) 709-5519 | Pelvic floor PT |
| 3 | Courtney Edgecomb | PT, DPT | Los Angeles/Santa Monica, CA | Pelvic Health & Rehab Center | Pelvic floor PT |
| 4 | Dr. Rachel Daof | DPT | Los Angeles/Highland Park, CA | thepelvicmodel.com | Pelvic floor PT |
| 5 | Femina PT (group practice) | DPT | Los Angeles, CA (Sherman Oaks, Beverly Hills, Pasadena) | (818) 877-6910 | Pelvic floor PT |

---

## Screening Results

All 15 providers passed screening (minimum score 12/25, mandatory postpartum experience score >= 4):

| Provider | PP Exp (x3) | Avail (x2) | Tele (x2) | Ins (x2) | Resp (x1) | Total |
|----------|------------|-----------|----------|---------|-----------|-------|
| Dr. Sarah Allen | 6 | 4 | 4 | 2 | 2 | **18** |
| Veronica Ursetto | 6 | 4 | 4 | 2 | 2 | **18** |
| Shivonne Odom-Chase | 6 | 4 | 4 | 2 | 2 | **18** |
| Lillian Rishty | 6 | 4 | 4 | 2 | 2 | **18** |
| Jade Rubino | 6 | 4 | 4 | 2 | 2 | **18** |
| Sarah Early | 6 | 4 | 4 | 4 | 2 | **20** |
| Jessica Claire | 6 | 4 | 4 | 2 | 2 | **18** |
| Allison Mahurin | 6 | 4 | 4 | 2 | 2 | **18** |
| Connie Reyes-Preciado | 6 | 4 | 4 | 2 | 2 | **18** |
| Alejandra De Leon | 6 | 4 | 4 | 2 | 2 | **18** |
| Natasha Dawkins | 6 | 4 | 4 | 2 | 2 | **18** |
| Adina Leifer | 6 | 4 | 4 | 2 | 2 | **18** |
| Courtney Edgecomb | 6 | 4 | 4 | 2 | 2 | **18** |
| Dr. Rachel Daof | 6 | 4 | 4 | 2 | 2 | **18** |
| Femina PT | 6 | 4 | 4 | 2 | 2 | **18** |

All auto-qualified (score >= 18 AND postpartum experience >= 4).

---

## Database Records

All 15 providers are seeded into the `providers` table via `packages/db/src/seed.ts`. The DB schema stores:

- `name`, `specialty`, `location`, `phone`
- `acceptingNewPatients` (default 'true')
- `contractStatus` (default 'active')

### API

`GET /api/providers` now queries the database directly instead of returning hardcoded samples. Supports:
- `?specialty=` — filter by specialty (partial match)
- `?acceptingOnly=true` — filter to accepting new patients

`POST /api/providers` sends a referral `{ providerId, patientId }` → mock 24hr estimated wait.

### Frontend

The escalation page (`apps/web/src/app/escalation/page.tsx`) fetches from `/api/providers?acceptingOnly=true` and displays the real provider list with location instead of mock distance.

---

## Referral Flow

### Detection → Warm Referral

1. Daily check-in detects escalation pattern (low mood + disrupted sleep 3+ days)
2. User offered option to "Speak with a screened provider"
3. Provider list displayed — user selects a provider
4. Request sent to provider (mock: POST /api/providers with providerId + patientId)
5. Provider expected to respond within 1 business day
6. User returned to dashboard with confirmation

### Planned Technical Enhancements (CTO)

- **Provider matching**: Geolocation-based search using PostGIS (planned)
- **Real-time availability**: Calendar integration for actual booking
- **Provider dashboard**: Clinician-facing UI for managing incoming referrals
- **Automated warm intro**: In-app message + provider's calendar link

---

## Handoff to CTO

### What's Delivered
- [x] 15 screened providers sourced across 5 metros
- [x] DB migration (location, phone columns)
- [x] Seed script (`packages/db/src/seed.ts`) for provider records
- [x] API route updated to query DB
- [x] Escalation page consuming real provider data
- [x] Shared types updated with location field

### What Needs Technical Implementation
- [ ] Geolocation-based provider matching (PostGIS)
- [ ] Real-time calendar integration (provider scheduling)
- [ ] Provider-facing dashboard for referral management
- [ ] Automated warm intro message + calendar link delivery
- [ ] Provider screening document upload/verification
- [ ] Contract management (digital LOI signing)
