import { describe, expect, it } from 'vitest';
import {
  calculateWeeksPostpartum,
  generalizeDateToMonth,
  generalizeDateToWeek,
  hashId,
} from './analytics-export.js';

describe('hashId (de-identification)', () => {
  it('produces a 16-char lowercase hex digest', () => {
    expect(hashId('user_abc123', 'salt')).toMatch(/^[0-9a-f]{16}$/);
  });

  it('is deterministic for the same id and salt', () => {
    expect(hashId('user_abc123', 'salt')).toBe(hashId('user_abc123', 'salt'));
  });

  it('changes when the salt changes', () => {
    expect(hashId('user_abc123', 'salt-a')).not.toBe(hashId('user_abc123', 'salt-b'));
  });

  it('changes when the id changes', () => {
    expect(hashId('user_a', 'salt')).not.toBe(hashId('user_b', 'salt'));
  });

  it('does not leak the raw identifier', () => {
    const id = 'sensitive-patient-id-42';
    const hashed = hashId(id, 'salt');
    expect(hashed.includes(id)).toBe(false);
    expect(hashed.includes('sensitive')).toBe(false);
  });
});

describe('generalizeDateToMonth', () => {
  it('returns YYYY-MM', () => {
    expect(generalizeDateToMonth(new Date(2026, 2, 15, 14, 30))).toBe('2026-03');
  });

  it('collapses all days of the month to one value (no day leakage)', () => {
    const first = generalizeDateToMonth(new Date(2026, 2, 1, 0, 0));
    const last = generalizeDateToMonth(new Date(2026, 2, 31, 23, 59));
    expect(first).toBe(last);
  });

  it('distinguishes different months', () => {
    expect(generalizeDateToMonth(new Date(2026, 2, 1))).not.toBe(
      generalizeDateToMonth(new Date(2026, 3, 1))
    );
  });
});

describe('generalizeDateToWeek', () => {
  it('returns YYYY-Www', () => {
    expect(generalizeDateToWeek(new Date(2026, 0, 1, 12))).toMatch(/^\d{4}-W\d{2}$/);
  });

  it('collapses dates within the same week to one value', () => {
    const a = generalizeDateToWeek(new Date(2026, 0, 5, 8, 0));
    const b = generalizeDateToWeek(new Date(2026, 0, 7, 20, 0));
    expect(a).toBe(b);
  });

  it('differs across weeks', () => {
    expect(generalizeDateToWeek(new Date(2026, 0, 5, 8, 0))).not.toBe(
      generalizeDateToWeek(new Date(2026, 0, 19, 8, 0))
    );
  });

  it('is stable regardless of time of day', () => {
    const morning = generalizeDateToWeek(new Date(2026, 5, 17, 1, 0));
    const night = generalizeDateToWeek(new Date(2026, 5, 17, 23, 0));
    expect(morning).toBe(night);
  });
});

describe('calculateWeeksPostpartum', () => {
  it('returns 0 on the delivery day', () => {
    expect(calculateWeeksPostpartum(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(0);
  });

  it('returns whole weeks elapsed', () => {
    expect(calculateWeeksPostpartum(new Date(2026, 0, 1), new Date(2026, 0, 8))).toBe(1);
    expect(calculateWeeksPostpartum(new Date(2026, 0, 1), new Date(2026, 0, 15))).toBe(2);
  });

  it('floors partial weeks', () => {
    expect(calculateWeeksPostpartum(new Date(2026, 0, 1), new Date(2026, 0, 7))).toBe(0);
  });

  it('is negative for a reference date before delivery', () => {
    expect(calculateWeeksPostpartum(new Date(2026, 0, 10), new Date(2026, 0, 1))).toBeLessThan(0);
  });
});
