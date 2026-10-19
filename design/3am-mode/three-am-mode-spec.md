# 3 AM Mode — UX Specification & CTO Handoff

**Issue:** [FIR-94](/FIR/issues/FIR-94) · **Parent:** [FIR-9](/FIR/issues/FIR-9) · **Goal:** Personalized postpartum app for first-time moms
**Status:** Design complete — ready for implementation
**Tokens:** `packages/design-system/src/threeAM.ts`

---

## 1. Why this exists

Between 10 PM and 6 AM, the user isn't "using an app" — she's sitting in a
dark room with a baby who just finished feeding. Her eyes are adapted to
darkness, her hands are clumsy, her cognition is slow, and her anxiety is
at its daily peak. A notification badge, a bright white screen, or a
required free-text answer will each independently cause exit or distress.

3 AM Mode is not a theme port. It is a **different interaction posture**:

| Dimension        | Day mode                 | 3 AM mode                          |
| ---------------- | ------------------------ | ---------------------------------- |
| Visual energy    | Full contrast, color     | Warm dark, dimmed, no pure white   |
| Input effort     | Typing OK                | Single-tap only; no free text      |
| Touch targets    | min 44px                 | min 56px, 64px comfortable         |
| Notifications    | Push/badges              | Ambient glow, no sound, no badge   |
| Content volume   | Full flows               | Quick actions + reduced check-in   |
| Motion           | Springs, slides          | Fades only, 200ms, quiet           |

**Anti-anxiety guardrails (inherited from [FIR-9](/FIR/issues/FIR-9)):**
3 AM Mode must never *initiate* escalation framing at night. Escalations
detected at night are queued and surfaced in morning check-in (5.x below),
unless the user invokes the crisis entry point herself.

---

## 2. Auto-trigger logic

Device-local time-based; no geolocation, no ML, no permission prompts.

```
                       ┌─────────────────────────────┐
                       │  App launch / resume        │
                       └──────────────┬──────────────┘
                                      ▼
                          22:00 ≤ localTime < 06:00 ?
                          ├─── NO  ──► Day mode
                          └─── YES ──► user set manual choice
                                        within last 12h?
                                        ├── YES: honor it
                                        └── NO:  enter 3 AM Mode
```

- **Trigger window:** 22:00–06:00 device-local time. DST handled by device clock.
- **Manual override:** a one-tap moon/sun toggle, always visible in the
  header during the window, doesn't nag. The choice is remembered for 12h
  (i.e., the rest of the night) so we never flip-flop mid-session.
- **Noost-fade entry:** mode change is a 200ms cross-fade, never a modal
  and never a toast. The user should barely notice.
- **No daytime push:** 3 AM Mode is never advertised at 2 PM ("Try dark
  mode!"). It appears when relevant, disappears when not.

## 3. The 3 AM home screen

```
┌──────────────────────────────────┐
│  🌙 3 AM Mode            [☀︎]     │  ← small, dim header, no badges
│                                  │
│   It's 3:12 AM.                  │  ← no "Good morning" framing
│   Awake is normal right now.     │  ← normalize, one line
│                                  │
│  ┌───────────────────────────┐   │
│  │ ⚡ Quick log               │   │
│  │                           │   │
│  │ ┌─────────┐ ┌─────────┐   │   │  ← 96px tiles, 16px gap
│  │ │ 🍼 Feed │ │ 🧷 Diaper│   │   │
│  │ └─────────┘ └─────────┘   │   │
│  │ ┌─────────┐ ┌─────────┐   │   │
│  │ │ 😴 Slept │ │ ✓ Skip  │   │   │
│  │ │  (log)  │ │ tonight │   │   │
│  │ └─────────┘ └─────────┘   │   │
│  └───────────────────────────┘   │
│                                  │
│  ┌───────────────────────────┐   │
│  │ Tonight's check-in         │   │  ← 1 question, tap-only, skippable
│  │ "How are you feeling?"     │   │
│  │  😊  😐  😔  (3 large taps) │   │
│  └───────────────────────────┘   │
│                                  │
│         [🎙 tell me] (optional)   │  ← voice input, opt-in
│                                  │
└──────────────────────────────────┘
```

Every element above is explainable:

- **"Awake is normal right now."** — the single most important copy line in
  night mode. Sleep loss + night waking is the #1 first-time-mom
  self-criticism; naming it as normal reduces the spiral that precedes
  tool use.
- **Quick log tiles** pre-fill timestamps ("Fed at 3:07 AM") — zero-tap
  confirm, one tap to correct.
- **Tonight's check-in** is *one question*, faces not sliders, skippable with
  zero guilt copy. Full check-in resumes at morning.
- **Skip tile** acknowledges some nights are for surviving, not tracking.

## 4. Component variants (day → 3 AM)

The day-mode components in `packages/design-system` keep their API; 3 AM
Mode is a **token-driven variant layer**. CTO: implement via a theme
provider, not forked components.

| Component        | 3 AM variant changes                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `Button`         | `primary` → sage `#7FA88C` on `surface-raised`; min height 56px; no shadows — use 1px `border-strong` |
| `OptionSelect`   | Selection feedback = soft fill + glow `calm`, never color-saturated; 64px rows       |
| `Slider`         | **Not used at night.** Replaced visually by face scales / tile pairs. (Cognitive load) |
| `Toast`          | Replaced by ambient glow. Toasts queue silently and render on morning exit           |
| `EscalationBanner` | Not rendered at night (see §5); queue state shows as a quiet dot, no red            |
| `CrisisEntryPoint` | Always reachable; 56px; copy unchanged; no glow around it (never decorative)        |
| `ReassuranceLoop` | Allowed — this is *the night component*; slower cadence (breath-glow at 4 cpm)       |
| `BottomSheet`    | `surface-raised`, scrim `rgba(16,14,12,0.64)`, 64px grab handle target               |
| `Card`           | `surface-raised`, radius 20, brightness 0.85                                         |
| `ProgressBar`    | Hidden at night. Progress framing ("you have 3 left") reads as pressure at 3 AM      |

## 5. Ambiguity rules: what may and may not glow

Ambient awareness replaces notifications. Three states only:

| State      | Token             | Where                                            |
| ---------- | ----------------- | ------------------------------------------------ |
| calm       | `glow.calm`       | Quick-action tiles at rest (breathing, 4 cpm)     |
| attention  | `glow.attention`  | Check-in card only, once per night, after 30min inactivity |
| none       | `glow.none`       | Everything else; crisis entry NEVER glows         |

**Never at night:** push notifications, badge counts, vibration, sound,
red/orange urgency colors, streaks, "you missed X" copy. All of these are
anxiety amplifiers and are day-mode-only concepts.

## 6. Escalation queueing (night-detected)

```
Night (22:00–06:00)
├── Risk detected (sleep/mood composite crosses threshold)
│    └── DO NOT render banner / do not disturb
│         └── Persist event to escalation queue, flag `deferredUntilMorning`
Morning (≥06:00, next open)
├── ≤1 deferred event:
│     └── Fold into morning check-in banner — [FIR-9] soft pattern ("This
│         week has been harder. Want to talk about it?")
└── ≥2 deferred events or any crisis-keyword:
      └── Day-mode banner at standard urgency,
          + note "a couple of nights in a row" (observational, not clinical)
```

This satisfies the [FIR-188]/[FIR-190] constraint that nothing wakes or
alarms a user overnight while preserving clinical integrity — signals
still reach the morning review, just not at 3 AM.

## 7. Voice input (optional, opt-in)

- Trigger: a 56px mic affordance under the check-in card, labeled "tell me".
- Behavior: one short utterance → transcribed into tonight's log as
  freeform note; no AI reply, no echo, no typing reconciliation. She can
  tap any face *instead*; voice is additive, never required.
- No TTS replies at night by default (speaking phone = wakes baby).
- Mic button needs `speech` permission → graceful deny = button hides, no
  empty state, no upsell.

## 8. Implementation notes for CTO

- **Tokens live in** `packages/design-system/src/threeAM.ts` and are
  exported from the package index (`threeAMTokens`).
- **Theme switching:** single `ThemeProvider`-style flag
  (`mode: "day" | "night"`); all components read tokens, no inline forks.
- **Brightness** is applied as opacity/brightness modifiers, not new
  palettes, so future token changes only touch one file.
- **Auto-trigger** is app-shell logic (`schedule` block), not component
  logic. Recommendation: evaluate on `appState` transitions, not timers.
- **Queue schema:** deferred escalations carry `deferredUntilMorning:
  true` + original `severity` so day-mode rendering logic (already
  shipping per FIR-9 work) needs only a morning read gate.
- **Do not** implement the "night" theme as OS-level `prefers-color-scheme:
  dark` passthrough. Our window logic (22–6 device time) is the source of
  truth; OS setting is respected only as tiebreaker when user has never
  chosen manually.

## 9. Open questions for CEO/product (non-blocking)

1. Should *one* night-time tap on the mood check-in unlock a "This was
   hard. Want to see one gentle idea?" micro-suggestion? (Requires
   content) — not designed here; flagged for editorial.
2. Partners: night mode currently assumes solo use. A partner-view toggle
   is out of scope for FIR-94.

---

*Design handoff by UXDesigner. Tokens: `threeAM.ts`. All copy shown is
review-ready per brand voice (`brand-voice-and-messaging.md`).*
