import { describe, it, expect } from 'vitest';
import { deidentifyRecord } from './de-identify';

describe('de-identify', () => {
  it('removes names and identifiers', () => {
    const record = {
      name: 'Alice',
      userId: 'u1',
      deliveryDate: '2026-01-15',
      deliveryType: 'vaginal',
      mentalHealthBaseline: { moodScore: 5 },
    };
    const result = deidentifyRecord(record);
    expect(result).not.toHaveProperty('name');
    expect(result).not.toHaveProperty('userId');
    expect(result).toHaveProperty('deliveryDate');
    expect(result.deliveryDate).toBe('2026');
    expect(result).toHaveProperty('deliveryType');
    expect(result).toHaveProperty('mentalHealthBaseline');
  });

  it('generalizes zip codes', () => {
    const record = { zip: '90210' };
    const result = deidentifyRecord(record);
    expect(result.zip).toBe('902xx');
  });

  it('keeps year for dates', () => {
    const record = { createdAt: '2026-07-03T12:00:00Z' };
    const result = deidentifyRecord(record);
    expect(result.createdAt).toBe('2026');
  });
});
