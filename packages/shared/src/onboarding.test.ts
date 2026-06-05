import { describe, it, expect } from 'vitest';
import { createInitialState, advanceStep, getAvailableSteps } from './onboarding';

describe('onboarding state machine', () => {
  it('starts at welcome step', () => {
    const state = createInitialState();
    expect(state.step).toBe('welcome');
  });

  it('advances from welcome to delivery_details', () => {
    const state = advanceStep(createInitialState(), {});
    expect(state.step).toBe('delivery_details');
  });

  it('requires delivery date and type at delivery_details step', () => {
    const state = advanceStep(createInitialState(), {});
    const result = advanceStep(state, {});
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('advances through full flow', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    expect(state.step).toBe('complete');
  });

  it('provides available steps', () => {
    expect(getAvailableSteps()).toHaveLength(5);
  });
});