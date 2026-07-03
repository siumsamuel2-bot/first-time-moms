# Firstweeks Outcome Data — Technical Spec & Data Dictionary

**Version:** 1.0  
**Classification:** For institutional buyers under NDA / DUA  
**Status:** Draft (pre-launch — schema subject to change during pilot)

---

## 1. Dataset Overview

| Attribute | Detail |
|-----------|--------|
| **Source** | Daily check-in responses from Firstweeks app users |
| **Coverage** | Days 1–56 postpartum (8-week pilot / ongoing subscription) |
| **Update cadence** | Daily incremental, monthly snapshots |
| **De-identification** | HIPAA Safe Harbor — no PHI at source |
| **Minimum cohort size** | n ≥ 5 per query cell |
| **Delivery format** | CSV, Parquet, or API (JSON) |

---

## 2. Data Dictionary

### 2.1 User Profile (one row per user, static)

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `user_id` | string (hash) | `"a3f8c9..."` | De-identified, salted hash — no cross-dataset linkability |
| `age_range` | string | `"25-29"` | Buckets: <20, 20-24, 25-29, 30-34, 35-39, 40+ |
| `geography` | string | `"Midwest"` | US Census region: Northeast, Midwest, South, West |
| `delivery_type` | string | `"vaginal"` | vaginal, c-section, emergency-c-section |
| `delivery_complications` | string[] | `["preeclampsia", "postpartum-hemorrhage"]` | Patient-reported complications during delivery |
| `feeding_baseline` | string | `"breastfeeding"` | Intended feeding method at onboarding |
| `pilot_practice_type` | string | `"academic-medical-center"` | Type of contributing practice: community, academic, health-system |
| `weeks_postpartum_at_enrollment` | int | `1` | Week postpartum when user started using Firstweeks |
| `parity` | string | `"primiparous"` | primiparous (first child) or multiparous |

### 2.2 Daily Check-in (one row per user per day)

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `user_id` | string (hash) | `"a3f8c9..."` | Matches user profile |
| `day` | int | `14` | Day postpartum (1-56+) |
| `shifted_date` | date | `"2026-07-21"` | Actual date shifted by +/- 72 hours |
| `sleep_hours` | float | `5.5` | Self-reported sleep in last 24h |
| `sleep_baseline_hours` | float | `7.5` | Pre-baby normal sleep (collected at onboarding) |
| `sleep_deficit` | float | `2.0` | baseline - actual (negative if oversleeping) |
| `sleep_deficit_streak` | int | `4` | Consecutive days with deficit ≥ 3h |
| `mood_score` | int (1-10) | `6` | "On a scale of 1-10, how would you rate your mood today?" |
| `mood_low_streak` | int | `3` | Consecutive days with mood ≤ 5 |
| `sadness_escalation` | bool | `false` | Flagged if mood ≤ 5 for 5+ consecutive days |
| `physical_pain_level` | int (0-10) | `3` | Self-reported physical discomfort |
| `pain_location` | string[] | `["pelvic", "incision"]` | Mapped to: pelvic, perineal, incision, back, breasts, headache, other |
| `feeding_method` | string | `"mixed"` | breastfeeding, pumping, formula, mixed, stopped |
| `feeding_difficulty` | bool | `true` | Self-reported feeding difficulty |
| `social_support_score` | int (1-5) | `4` | "Do you have someone to talk to?" (1=never, 5=always) |
| `checkin_duration_seconds` | int | `45` | Time spent on daily check-in |
| `warm_referral_offered` | bool | `false` | Whether escalation protocol triggered a referral offer |
| `warm_referral_accepted` | bool | `null` | null if not offered, true/false if offered |
| `warm_referral_specialty` | string | `null` | perinatal-therapist, lactation-consultant, pelvic-floor-pt |

### 2.3 Escalation Events (one row per escalation trigger)

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `escalation_id` | string | `"esc_001"` | Unique escalation event ID |
| `user_id` | string (hash) | `"a3f8c9..."` | Matches user profile |
| `trigger_day` | int | `17` | Day postpartum when escalation triggered |
| `trigger_type` | string | `"mood"` | sleep, mood, or combo |
| `trigger_value` | string | `"mood_score_5_for_5_days"` | Exact trigger condition met |
| `referral_specialty` | string | `"perinatal-therapist"` | Specialty of warm referral offered |
| `referral_accepted` | bool | `true` | Mother accepted warm referral |
| `referral_completed` | bool | `true` | Mother attended at least 1 appointment |
| `outcome` | string | `"resolved"` | resolved, in-progress, lost-to-follow-up |
| `days_to_resolution` | int | `14` | Days from escalation to resolution (if resolved) |

### 2.4 Onboarding & Engagement (one row per user, computed at cohort milestones)

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `user_id` | string (hash) | `"a3f8c9..."` | Matches user profile |
| `onboarding_completed` | bool | `true` | Completed 5-step onboarding |
| `onboarding_duration_minutes` | float | `4.2` | Time to complete onboarding |
| `day_7_active` | bool | `true` | Completed check-in on Day 7 |
| `day_30_active` | bool | `true` | Completed check-in on Day 30 |
| `day_56_active` | bool | `false` | Completed check-in on Day 56 |
| `checkin_streak_max` | int | `21` | Longest consecutive check-in streak |
| `total_checkins` | int | `42` | Total check-ins completed (out of 56 max) |
| `adherence_rate` | float | `0.75` | total_checkins / days_since_enrollment |
| `subscription_tier` | string | `"premium"` | free, trial, premium, mamma-sync-plus |
| `trial_converted` | bool | `true` | Converted from trial to paid |
| `current_mrr_cents` | int | `1000` | Current monthly recurring revenue in cents |

---

## 3. Sample Aggregate Report (Mock)

### 3.1 Cohort Overview (Q3 2026 Snapshot)

```
Total profiles: 60
Coverage period: Jul 7 – Aug 29 (8-week pilot)
Geographies: 2 (Mid-Atlantic, Midwest)
Delivery mix: 58% vaginal, 27% c-section, 15% emergency c-section
Feeding at enrollment: 62% breastfeeding, 21% mixed, 17% formula
```

### 3.2 Sleep Trends

| Week Postpartum | Mean Sleep (hrs) | Mean Deficit (hrs) | % with ≥3h deficit |
|-----------------|-----------------|-------------------|--------------------|
| Week 1 | 4.8 | 3.2 | 68% |
| Week 2 | 5.1 | 2.9 | 55% |
| Week 3 | 5.3 | 2.7 | 48% |
| Week 4 | 5.6 | 2.4 | 41% |
| Week 5 | 5.7 | 2.3 | 38% |
| Week 6 | 5.9 | 2.1 | 32% |
| Week 7 | 6.1 | 1.9 | 28% |
| Week 8 | 6.2 | 1.8 | 25% |

### 3.3 Mood Trajectory

| Week Postpartum | Mean Mood (1-10) | % with mood ≤ 5 | Escalation rate |
|-----------------|-----------------|-----------------|-----------------|
| Week 1 | 6.2 | 22% | — |
| Week 2 | 5.8 | 28% | — |
| Week 3 | 5.5 | 32% | 3% |
| Week 4 | 5.7 | 30% | 2% |
| Week 5 | 5.9 | 26% | 1% |
| Week 6 | 6.1 | 23% | 1% |
| Week 7 | 6.3 | 20% | 0.5% |
| Week 8 | 6.4 | 18% | 0.5% |

### 3.4 Feeding Method Transitions

| Method | Week 1 | Week 4 | Week 8 |
|--------|--------|--------|--------|
| Exclusive breastfeeding | 62% | 48% | 42% |
| Mixed (breast + formula) | 21% | 32% | 35% |
| Exclusive formula | 17% | 20% | 23% |

### 3.5 Escalation Outcomes

| Metric | Value |
|--------|-------|
| Total escalations triggered | 12 (20% of cohort) |
| — Sleep-related | 5 (42%) |
| — Mood-related | 7 (58%) |
| Warm referral acceptance rate | 67% |
| Referral-to-appointment completion | 75% |
| Average days to resolution | 12 days |

---

## 4. Delivery & Access

### API Specification (Enterprise Tier)
- **Endpoint**: `https://api.firstweeks.io/v1/institutional/data`
- **Authentication**: API key (per-contract, rate-limited)
- **Available dimensions**: geography, delivery_type, age_range, week_postpartum
- **Available metrics**: all fields in Sections 2.2–2.4
- **Query constraints**: minimum n=5; max date range = 12 months
- **Response format**: JSON or Parquet

### File Export (Professional Tier)
- **Format**: CSV or Parquet
- **Frequency**: Monthly (1st of month for prior month)
- **Delivery**: Secure S3 presigned URL (expires 72h)
- **Schema**: As defined in Section 2

---

## 5. Compliance & Privacy

| Requirement | Status |
|-------------|--------|
| HIPAA Safe Harbor de-identification | Compliant (no 18 identifiers) |
| Annual third-party de-identification audit | Year 1 audit scheduled Q4 2026 |
| IRB review (research access) | Required — see IRB strategy memo |
| BAA with data-contributing practices | In place |
| Data Use Agreement required per buyer | Required — see DUA template |
| Minimum cell size (n≥5) | Enforced at query layer |
| Timestamp shifting (+/- 72h) | Applied at export |
| Geographic aggregation (region-level) | Applied at export |

---

*Prepared by CMO, Firstweeks — June 2026*
