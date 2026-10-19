/**
 * 3 AM Mode theme tokens and trigger logic.
 *
 * Ported from the UXDesigner handoff ([FIR-94]) so the app can consume it
 * without depending on the archived `@firstweeks/design-system` package.
 * The CSS custom properties in `src/index.css` mirror these values; this file
 * is the single TypeScript source of truth for the night palette, touch
 * targets, motion, and the 22:00–06:00 auto-trigger window.
 *
 * Design intent (see `design/3am-mode/three-am-mode-spec.md`):
 * - No pure white text and no pure black backgrounds (halation control).
 * - Warm neutrals instead of cool grays (reduce blue-light exposure).
 * - Enlarged touch targets (min 56px) because dexterity/attention degrade.
 * - Night-detected risks are deferred to the morning, never surfaced at night.
 */

export type ThemeMode = 'day' | 'night';

export interface ManualThemeChoice {
  mode: ThemeMode;
  /** Epoch ms when the user made the manual choice. */
  chosenAt: number;
}

/** localStorage key holding the remembered manual override. */
export const MANUAL_THEME_CHOICE_KEY = 'firstweeks.theme.manualChoice';

export const threeAMTokens = {
  colors: {
    surface: {
      canvas: '#1A1714',
      raised: '#22201C',
      overlay: '#2B2824',
      elevated: '#332F29',
    },
    text: {
      primary: '#EDE6DC',
      secondary: '#B8AFA4',
      muted: '#8A8176',
      disabled: '#5C554D',
    },
    border: {
      subtle: '#332F29',
      strong: '#4A443C',
    },
    accent: {
      sage: '#7FA88C',
      amber: '#D9A86A',
      rose: '#C48896',
      lavender: '#9D93C2',
    },
    state: {
      info: '#8FAECC',
      warning: '#CBA25C',
      error: '#C97870',
      success: '#7FA88C',
    },
    glow: {
      calm: 'rgba(217, 168, 106, 0.16)',
      attention: 'rgba(217, 168, 106, 0.32)',
      none: 'transparent',
    },
    scrim: 'rgba(16, 14, 12, 0.64)',
  },

  brightness: {
    full: 1,
    dimmed: 0.85,
    minimal: 0.7,
  },

  typography: {
    // Same family/scale as day mode; the smallest readable night size is sm.
    minimumSize: { size: 14, weight: 400, lineHeight: 20 },
    minimumWeight: 500,
  },

  touchTargets: {
    min: 56,
    comfortable: 64,
    quickAction: 96,
    gap: 16,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 20,
    full: 9999,
  },

  motion: {
    glowBreathCyclesPerMinute: 4,
    transitionMs: 200,
    entryAnimation: 'fade' as const,
  },

  /* Auto-trigger configuration, mirrored by `isThreeAMWindow`. */
  schedule: {
    startTime: '22:00',
    endTime: '06:00',
    allowManualSwitch: true,
    rememberManualChoiceForHours: 12,
  },
} as const;

export type ThreeAMTokens = typeof threeAMTokens;

const MINUTES_PER_HOUR = 60;

/** Parse a `"HH:MM"` 24-hour clock string into minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map((part) => Number.parseInt(part, 10));
  return hours * MINUTES_PER_HOUR + minutes;
}

/**
 * True when device-local time is inside the 22:00–06:00 window.
 * The window wraps midnight, so the comparison is a logical OR there.
 */
export function isThreeAMWindow(now: Date): boolean {
  const start = timeToMinutes(threeAMTokens.schedule.startTime);
  const end = timeToMinutes(threeAMTokens.schedule.endTime);
  const current = now.getHours() * MINUTES_PER_HOUR + now.getMinutes();

  if (start <= end) {
    return current >= start && current < end;
  }
  return current >= start || current < end;
}

/** A manual choice stays authoritative for the rest of the night (12h). */
export function isManualChoiceFresh(
  choice: ManualThemeChoice | null | undefined,
  now: Date
): boolean {
  if (!choice) return false;
  const ttlMs = threeAMTokens.schedule.rememberManualChoiceForHours * 60 * 60 * 1000;
  const age = now.getTime() - choice.chosenAt;
  return age >= 0 && age < ttlMs;
}

export interface ResolveThemeModeInput {
  now: Date;
  manualChoice?: ManualThemeChoice | null;
  /** OS `prefers-color-scheme: dark`; only a tiebreaker, never authoritative. */
  prefersDark?: boolean;
}

/**
 * Decide the active theme.
 *
 * Order of authority:
 * 1. A fresh manual choice (within the last 12h) always wins.
 * 2. Device-local time inside 22:00–06:00 → night.
 * 3. Outside the window, an OS dark preference is honored only for users who
 *    have never made a manual choice.
 */
export function resolveThemeMode({
  now,
  manualChoice = null,
  prefersDark = false,
}: ResolveThemeModeInput): ThemeMode {
  if (isManualChoiceFresh(manualChoice, now)) {
    return (manualChoice as ManualThemeChoice).mode;
  }
  if (isThreeAMWindow(now)) return 'night';
  return prefersDark ? 'night' : 'day';
}

/** Format a time the way it appears on the 3 AM home screen ("3:12 AM"). */
export function formatNightClock(now: Date): string {
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Cross-fade duration in ms for the day<->night transition. */
export const THEME_TRANSITION_MS = threeAMTokens.motion.transitionMs;
