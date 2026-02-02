import { describe, it, expect } from 'vitest';
import { computePosteriors, getPriors, getMostLikelyStates } from './inference';
import { bikeNetwork } from '../data/bayesianNetwork';

describe('computePosteriors', () => {
  it('should return posteriors for all nodes with no evidence', () => {
    const posteriors = computePosteriors({});
    
    // Should have an entry for each node in the network
    const nodeIds = Object.keys(bikeNetwork);
    for (const nodeId of nodeIds) {
      expect(posteriors).toHaveProperty(nodeId);
    }
  });

  it('should return probabilities that sum to 1 for each node', () => {
    const posteriors = computePosteriors({});
    
    for (const [_nodeId, probs] of Object.entries(posteriors)) {
      const sum = Object.values(probs).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    }
  });

  it('should update posteriors when evidence is provided', () => {
    const priorsResult = computePosteriors({});
    const withEvidence = computePosteriors({ TERRAIN: 'OFFROAD' });
    
    // BIKE_TYPE should shift towards MOUNTAIN when terrain is OFFROAD
    expect(withEvidence.BIKE_TYPE.MOUNTAIN).toBeGreaterThan(priorsResult.BIKE_TYPE.MOUNTAIN);
  });

  it('should handle multiple evidence variables', () => {
    const posteriors = computePosteriors({ 
      TERRAIN: 'ROAD', 
      USE_CASE: 'FITNESS',
      PHYSICAL_CONDITION: 'FIT'
    });
    
    // With ROAD terrain, FITNESS use case, and FIT condition, ROAD bike should be likely
    expect(posteriors.BIKE_TYPE.ROAD).toBeGreaterThan(0.3);
  });

  it('should set evidence nodes to 1.0 for observed state', () => {
    const posteriors = computePosteriors({ BUDGET: 'HIGH' });
    
    // The observed state should have probability 1.0
    expect(posteriors.BUDGET.HIGH).toBeCloseTo(1.0, 5);
    expect(posteriors.BUDGET.LOW).toBeCloseTo(0.0, 5);
    expect(posteriors.BUDGET.MEDIUM).toBeCloseTo(0.0, 5);
  });

  it('should increase EBIKE probability when PHYSICAL_CONDITION is LIMITED', () => {
    const priors = computePosteriors({});
    const withLimited = computePosteriors({ PHYSICAL_CONDITION: 'LIMITED' });
    
    expect(withLimited.BIKE_TYPE.EBIKE).toBeGreaterThan(priors.BIKE_TYPE.EBIKE);
  });
});

describe('getPriors', () => {
  it('should return the same result as computePosteriors with empty evidence', () => {
    const priors = getPriors();
    const emptyEvidence = computePosteriors({});
    
    expect(priors).toEqual(emptyEvidence);
  });

  it('should return valid probability distributions', () => {
    const priors = getPriors();
    
    for (const probs of Object.values(priors)) {
      const sum = Object.values(probs).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
      
      // All probabilities should be between 0 and 1
      for (const prob of Object.values(probs)) {
        expect(prob).toBeGreaterThanOrEqual(0);
        expect(prob).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('getMostLikelyStates', () => {
  it('should return the most likely state for each node', () => {
    const posteriors = {
      TEST_NODE: { STATE_A: 0.2, STATE_B: 0.5, STATE_C: 0.3 }
    };
    
    const mostLikely = getMostLikelyStates(posteriors);
    
    expect(mostLikely.TEST_NODE.state).toBe('STATE_B');
    expect(mostLikely.TEST_NODE.probability).toBe(0.5);
  });

  it('should handle uniform distributions', () => {
    const posteriors = {
      TEST_NODE: { STATE_A: 0.333, STATE_B: 0.334, STATE_C: 0.333 }
    };
    
    const mostLikely = getMostLikelyStates(posteriors);
    
    // Should pick STATE_B as it has the highest (even if marginally)
    expect(mostLikely.TEST_NODE.state).toBe('STATE_B');
  });

  it('should work with real network posteriors', () => {
    const posteriors = computePosteriors({ TERRAIN: 'OFFROAD', USE_CASE: 'SPORT' });
    const mostLikely = getMostLikelyStates(posteriors);
    
    // With offroad + sport, MOUNTAIN should be most likely
    expect(mostLikely.BIKE_TYPE.state).toBe('MOUNTAIN');
    expect(mostLikely.BIKE_TYPE.probability).toBeGreaterThan(0.5);
  });

  it('should return probability along with state', () => {
    const posteriors = getPriors();
    const mostLikely = getMostLikelyStates(posteriors);
    
    for (const result of Object.values(mostLikely)) {
      expect(result).toHaveProperty('state');
      expect(result).toHaveProperty('probability');
      expect(typeof result.state).toBe('string');
      expect(typeof result.probability).toBe('number');
    }
  });
});
