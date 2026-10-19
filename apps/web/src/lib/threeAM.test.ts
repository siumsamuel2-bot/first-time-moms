import { describe, expect, it } from 'vitest';
import {
  type ManualThemeChoice,
  isManualChoiceFresh,
  isThreeAMWindow,
  resolveThemeMode,
  threeAMTokens,
  timeToMinutes,
} from './threeAM';

function at(hour: number, minute = 0): Date {
  return new Date(2026, 0, 5, hour, minute, 0, 0);
}

describe('isThreeAMWindow', () => {
  it('treats 22:00 through 05:59 as the night window', () => {
    expect(isThreeAMWindow(at(22, 0))).toBe(true);
    expect(isThreeAMWindow(at(23, 59))).toBe(true);
    expect(isThreeAMWindow(at(0, 0))).toBe(true);
    expect(isThreeAMWindow(at(3, 12))).toBe(true);
    expect(isThreeAMWindow(at(5, 59))).toBe(true);
  });

  it('treats 06:00 through 21:59 as day', () => {
    expect(isThreeAMWindow(at(6, 0))).toBe(false);
    expect(isThreeAMWindow(at(12, 0))).toBe(false);
    expect(isThreeAMWindow(at(21, 59))).toBe(false);
  });

  it('derives boundaries from the token schedule', () => {
    expect(timeToMinutes(threeAMTokens.schedule.startTime)).toBe(22 * 60);
    expect(timeToMinutes(threeAMTokens.schedule.endTime)).toBe(6 * 60);
  });
});

describe('resolveThemeMode', () => {
  it('enters night mode inside the window when no manual choice exists', () => {
    expect(resolveThemeMode({ now: at(2) })).toBe('night');
  });

  it('stays in day mode outside the window', () => {
    expect(resolveThemeMode({ now: at(14) })).toBe('day');
  });

  it('honors a fresh manual choice, even inside the window', () => {
    const manualChoice: ManualThemeChoice = { mode: 'day', chosenAt: at(22, 30).getTime() };
    expect(resolveThemeMode({ now: at(23), manualChoice })).toBe('day');
  });

  it('ignores a manual choice older than the 12h TTL', () => {
    const stale: ManualThemeChoice = { mode: 'day', chosenAt: at(22, 0).getTime() - 13 * 3600_000 };
    expect(resolveThemeMode({ now: at(23), manualChoice: stale })).toBe('night');
  });

  it('uses the OS dark preference only as a daytime tiebreaker', () => {
    expect(resolveThemeMode({ now: at(14), prefersDark: true })).toBe('night');
    expect(resolveThemeMode({ now: at(2), prefersDark: false })).toBe('night');
    const manual: ManualThemeChoice = { mode: 'day', chosenAt: at(14).getTime() };
    expect(resolveThemeMode({ now: at(14, 30), manualChoice: manual, prefersDark: true })).toBe(
      'day'
    );
  });
});

describe('isManualChoiceFresh', () => {
  it('returns false for missing choices', () => {
    expect(isManualChoiceFresh(null, at(23))).toBe(false);
    expect(isManualChoiceFresh(undefined, at(23))).toBe(false);
  });

  it('is fresh within 12h and stale beyond it', () => {
    const now = at(20);
    const within: ManualThemeChoice = { mode: 'night', chosenAt: now.getTime() - 11 * 3600_000 };
    const beyond: ManualThemeChoice = { mode: 'night', chosenAt: now.getTime() - 13 * 3600_000 };
    expect(isManualChoiceFresh(within, now)).toBe(true);
    expect(isManualChoiceFresh(beyond, now)).toBe(false);
  });
});
