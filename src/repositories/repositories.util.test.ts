import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { calculateWeightedScore } from './repositories.util';

describe('calculateWeightedScore', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should calculate score with default weights', () => {
    const repo = {
      stars: 100,
      forks: 50,
      daysSinceUpdate: 10,
    };

    const score = calculateWeightedScore(repo);

    expect(score).toBeGreaterThan(0);
  });

  it('should calculate score with custom weights', () => {
    process.env.STARS_WEIGHT = '2';
    process.env.FORKS_WEIGHT = '3';
    process.env.RECENCY_WEIGHT = '10';
    process.env.HALF_LIFE_DAYS = '15';
    const repo = {
      stars: 100,
      forks: 50,
      daysSinceUpdate: 10,
    };

    const score = calculateWeightedScore(repo);

    expect(score).toBeGreaterThan(0);
  });

  it('should handle zero values', () => {
    const repo = {
      stars: 0,
      forks: 0,
      daysSinceUpdate: 0,
    };

    const score = calculateWeightedScore(repo);

    expect(score).toBeGreaterThanOrEqual(0);
  });
});
