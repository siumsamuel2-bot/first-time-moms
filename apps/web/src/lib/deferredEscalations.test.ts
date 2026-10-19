import { describe, expect, it } from 'vitest';
import {
  DeferredEscalationQueue,
  deferEscalation,
  drainDeferredUntilMorning,
  summarizeMorningDeferrals,
} from './deferredEscalations';

describe('deferEscalation', () => {
  it('marks the event for morning review and normalizes the timestamp', () => {
    const event = deferEscalation({
      id: 'e1',
      severity: 'high',
      detectedAt: new Date('2026-01-05T03:12:00.000Z'),
    });
    expect(event.deferredUntilMorning).toBe(true);
    expect(event.detectedAt).toBe('2026-01-05T03:12:00.000Z');
    expect(event.crisisKeyword).toBe(false);
  });
});

describe('summarizeMorningDeferrals', () => {
  it('surfaces nothing when the queue is empty', () => {
    const summary = summarizeMorningDeferrals([]);
    expect(summary.surface).toBe('none');
    expect(summary.count).toBe(0);
    expect(summary.message).toBe('');
  });

  it('folds a single night into the soft morning banner', () => {
    const summary = summarizeMorningDeferrals([
      deferEscalation({ id: 'e1', severity: 'moderate', detectedAt: '2026-01-05T03:00:00.000Z' }),
    ]);
    expect(summary.surface).toBe('soft');
    expect(summary.message).toMatch(/harder/i);
  });

  it('escalates to the standard banner for two or more nights', () => {
    const summary = summarizeMorningDeferrals([
      deferEscalation({ id: 'e1', severity: 'moderate', detectedAt: '2026-01-04T03:00:00.000Z' }),
      deferEscalation({ id: 'e2', severity: 'high', detectedAt: '2026-01-05T03:00:00.000Z' }),
    ]);
    expect(summary.surface).toBe('standard');
    expect(summary.message).toMatch(/couple of nights/i);
  });

  it('escalates immediately on a crisis keyword', () => {
    const summary = summarizeMorningDeferrals([
      deferEscalation({
        id: 'e1',
        severity: 'crisis',
        detectedAt: '2026-01-05T03:00:00.000Z',
        crisisKeyword: true,
      }),
    ]);
    expect(summary.surface).toBe('standard');
    expect(summary.includesCrisisKeyword).toBe(true);
  });
});

describe('drainDeferredUntilMorning', () => {
  it('consumes due events and keeps newer ones queued', () => {
    const events = [
      deferEscalation({ id: 'past', severity: 'moderate', detectedAt: '2026-01-05T03:00:00.000Z' }),
      deferEscalation({
        id: 'future',
        severity: 'moderate',
        detectedAt: '2026-01-06T03:00:00.000Z',
      }),
    ];
    const { summary, remaining } = drainDeferredUntilMorning(
      events,
      new Date('2026-01-05T07:00:00.000Z')
    );
    expect(summary.count).toBe(1);
    expect(remaining.map((event) => event.id)).toEqual(['future']);
  });
});

describe('DeferredEscalationQueue', () => {
  it('queues overnight events and reports them on the morning drain', () => {
    const queue = new DeferredEscalationQueue();
    queue.enqueue({ id: 'n1', severity: 'moderate', detectedAt: '2026-01-05T02:00:00.000Z' });
    queue.enqueue({ id: 'n2', severity: 'moderate', detectedAt: '2026-01-05T04:00:00.000Z' });
    expect(queue.pending()).toHaveLength(2);

    const summary = queue.drainForMorning(new Date('2026-01-05T06:30:00.000Z'));
    expect(summary.surface).toBe('standard');
    expect(queue.pending()).toHaveLength(0);
  });
});
