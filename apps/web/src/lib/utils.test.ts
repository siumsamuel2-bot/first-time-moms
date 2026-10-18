import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('utility functions', () => {
  it('combines class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', false && 'bar')).toBe('foo');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('handles empty arguments', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
  });
});
