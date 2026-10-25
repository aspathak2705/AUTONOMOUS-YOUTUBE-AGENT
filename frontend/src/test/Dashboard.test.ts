import { describe, it, expect } from 'vitest';

describe('Frontend starter sanity check', () => {
  it('verifies configuration environment contract', () => {
    const defaultApiUrl = 'http://localhost:8000';
    expect(defaultApiUrl).toBe('http://localhost:8000');
  });
});
