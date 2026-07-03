import { describe, it, expect } from 'vitest';
import { createInitialState, advanceStep, getAvailableSteps, validateStep, canTransition } from './onboarding';

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
    state = advanceStep(state, { dataConsent: true });
    expect(state.step).toBe('complete');
  });

  it('provides available steps', () => {
    expect(getAvailableSteps()).toHaveLength(6);
  });

  it('advances from feeding to data_consent', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    expect(state.step).toBe('data_consent');
  });

  it('stores data consent decision on profile', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    state = advanceStep(state, { dataConsent: true });
    expect(state.step).toBe('complete');
    expect(state.profile?.dataConsent).toBe(true);
    expect(state.profile?.dataConsentVersion).toBe('1.0');
    expect(state.profile?.dataConsentGrantedAt).toBeDefined();
  });

  it('handles consent declined', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    state = advanceStep(state, { dataConsent: false });
    expect(state.step).toBe('complete');
    expect(state.profile?.dataConsent).toBe(false);
    expect(state.profile?.dataConsentGrantedAt).toBeUndefined();
  });

  it('requires mental health baseline at mental_health step', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    const result = advanceStep(state, {});
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Mental health baseline is required');
  });

  it('advances from mental_health to feeding when baseline provided', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    expect(state.step).toBe('feeding');
    expect(state.profile?.mentalHealthBaseline).toEqual({ moodScore: 7, anxietyLevel: 5, sleepQuality: 4 });
  });

  it('requires explicit data consent decision at data_consent step', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    const result = advanceStep(state, {});
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Data consent decision is required');
  });

  it('rejects non-boolean data consent value', () => {
    let state = createInitialState();
    state = advanceStep(state, {});
    state = advanceStep(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    state = advanceStep(state, { mentalHealthBaseline: { moodScore: 7, anxietyLevel: 5, sleepQuality: 4 } });
    state = advanceStep(state, { feedingMethod: 'both' });
    const result = advanceStep(state, { dataConsent: 'yes' });
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Data consent decision is required');
  });

  it('validateStep returns errors for invalid step data', () => {
    const state = advanceStep(createInitialState(), {});
    const errors = validateStep(state, {});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('canTransition returns false when validation fails', () => {
    const state = advanceStep(createInitialState(), {});
    const can = canTransition(state, {});
    expect(can).toBe(false);
  });

  it('canTransition returns true when validation passes', () => {
    const state = advanceStep(createInitialState(), {});
    const can = canTransition(state, { deliveryDate: '2026-05-01', deliveryType: 'vaginal' });
    expect(can).toBe(true);
  });
});