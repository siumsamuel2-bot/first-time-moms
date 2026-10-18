# ADR-004: Mobile-First PWA (Progressive Web App) over Native Mobile

## Status
Accepted

## Context
Firstweeks targets first-time moms postpartum (0-12 weeks):
- Primary use case: Daily check-ins (2-3 min), reading educational content, viewing provider matches
- Secondary: Onboarding quiz (once), clinician dashboard (providers only)
- User constraints: Sleep-deprived, one-handed phone use, limited attention span
- Distribution: Pilot with 2 OB-GYN practices (30 moms), then scale
- Team: 1-2 frontend engineers, no iOS/Android native experience
- Timeline: MVP in 8-12 weeks
- HIPAA: No PHI stored on device (token-based auth, short-lived sessions)

## Decision
Build a **Mobile-First Progressive Web App (PWA)** using React + TypeScript + Vite, with:
- Installable to home screen (Web App Manifest)
- Offline-capable for core flows (Service Worker + IndexedDB)
- Push notifications for daily check-in reminders (Web Push API)
- Responsive design, touch-optimized, large tap targets
- Single codebase for web + mobile
- Capacitor wrapper as future option for app store distribution

## Consequences

### Positive
- Single codebase, single team, faster iteration
- No app store review delays for pilot updates
- Instant updates (no user action needed)
- Lower development and maintenance cost
- Works on any device with browser
- Easy sharing via link (onboarding from SMS/email)
- Service Worker enables offline check-in completion

### Negative
- Limited background execution (mitigated by push notifications)
- No access to some native APIs (HealthKit, camera for document upload — use file input)
- iOS PWA limitations (no push on iOS < 16.4, limited background sync)
- Perceived credibility vs native app (mitigated by OB-GYN endorsement)

### Neutral
- Use Capacitor if app store distribution needed later
- Biometric auth via WebAuthn (future)
- IndexedDB for offline draft persistence

## Alternatives Considered

**React Native / Expo**
- Rejected: Team lacks native expertise, double the platform complexity, app store friction for pilot
- Considered: Better native feel, access to all APIs

**Flutter**
- Rejected: Team unfamiliar, larger bundle, same app store friction
- Considered: Single codebase, good performance

**Native iOS (Swift) + Android (Kotlin)**
- Rejected: 2-3x development effort, separate teams, app store delays
- Considered: Best UX, full platform access

**Hybrid: PWA + Capacitor from Start**
- Rejected: Premature optimization, Capacitor adds build complexity
- Considered: Smoother transition if app store needed

## References
- PWA Checklist: https://web.dev/pwa-checklist/
- iOS 16.4+ Web Push support
- Capacitor: https://capacitorjs.com/
- Target: 30 pilot users, iOS Safari + Android Chrome