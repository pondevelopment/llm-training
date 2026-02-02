import { describe, it, expect } from 'vitest';
import { bikes, scoreBike, getRecommendations } from './bikes';

describe('bikes catalog', () => {
  it('should have at least 10 bikes', () => {
    expect(bikes.length).toBeGreaterThanOrEqual(10);
  });

  it('should have all required properties on each bike', () => {
    const requiredProps = ['id', 'name', 'type', 'price', 'priceRange', 'suspension', 'comfort', 'description'];
    
    for (const bike of bikes) {
      for (const prop of requiredProps) {
        expect(bike).toHaveProperty(prop);
      }
    }
  });

  it('should have valid bike types matching network states', () => {
    const validTypes = ['ROAD', 'HYBRID', 'MOUNTAIN', 'EBIKE', 'GRAVEL'];
    
    for (const bike of bikes) {
      expect(validTypes).toContain(bike.type);
    }
  });

  it('should have valid price ranges matching network states', () => {
    const validRanges = ['BUDGET', 'MIDRANGE', 'PREMIUM'];
    
    for (const bike of bikes) {
      expect(validRanges).toContain(bike.priceRange);
    }
  });

  it('should have valid suspension types matching network states', () => {
    const validSuspension = ['NONE', 'FRONT', 'FULL'];
    
    for (const bike of bikes) {
      expect(validSuspension).toContain(bike.suspension);
    }
  });

  it('should have valid comfort levels matching network states', () => {
    const validComfort = ['BASIC', 'COMFORTABLE', 'PREMIUM_COMFORT'];
    
    for (const bike of bikes) {
      expect(validComfort).toContain(bike.comfort);
    }
  });

  it('should have unique IDs', () => {
    const ids = bikes.map(b => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('scoreBike', () => {
  const mockPosteriors = {
    BIKE_TYPE: { ROAD: 0.5, HYBRID: 0.2, MOUNTAIN: 0.15, EBIKE: 0.1, GRAVEL: 0.05 },
    SUSPENSION: { NONE: 0.6, FRONT: 0.3, FULL: 0.1 },
    PRICE_RANGE: { BUDGET: 0.3, MIDRANGE: 0.5, PREMIUM: 0.2 },
    COMFORT_LEVEL: { BASIC: 0.4, COMFORTABLE: 0.4, PREMIUM_COMFORT: 0.2 }
  };

  it('should return a score between 0 and 100', () => {
    const bike = bikes[0];
    const score = scoreBike(bike, mockPosteriors);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should score higher for bikes matching high probability states', () => {
    const roadBike = bikes.find(b => b.type === 'ROAD' && b.suspension === 'NONE');
    const mountainBike = bikes.find(b => b.type === 'MOUNTAIN' && b.suspension === 'FULL');
    
    // With posteriors favoring ROAD type and NONE suspension
    const roadScore = scoreBike(roadBike, mockPosteriors);
    const mountainScore = scoreBike(mountainBike, mockPosteriors);
    
    expect(roadScore).toBeGreaterThan(mountainScore);
  });

  it('should apply correct weights (40% type, 25% price, 20% suspension, 15% comfort)', () => {
    // Perfect match for all attributes
    const perfectPosteriors = {
      BIKE_TYPE: { ROAD: 1.0, HYBRID: 0, MOUNTAIN: 0, EBIKE: 0, GRAVEL: 0 },
      SUSPENSION: { NONE: 1.0, FRONT: 0, FULL: 0 },
      PRICE_RANGE: { BUDGET: 1.0, MIDRANGE: 0, PREMIUM: 0 },
      COMFORT_LEVEL: { BASIC: 1.0, COMFORTABLE: 0, PREMIUM_COMFORT: 0 }
    };
    
    // Bike that matches perfectly
    const bike = { type: 'ROAD', suspension: 'NONE', priceRange: 'BUDGET', comfort: 'BASIC' };
    const score = scoreBike(bike, perfectPosteriors);
    
    expect(score).toBe(100);
  });

  it('should return 50 when posteriors are empty', () => {
    const bike = bikes[0];
    const score = scoreBike(bike, {});
    
    expect(score).toBe(50);
  });

  it('should handle missing bike attributes gracefully', () => {
    const partialBike = { type: 'ROAD' };
    const score = scoreBike(partialBike, mockPosteriors);
    
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should handle partial posteriors', () => {
    const partialPosteriors = {
      BIKE_TYPE: { ROAD: 0.8, HYBRID: 0.1, MOUNTAIN: 0.05, EBIKE: 0.03, GRAVEL: 0.02 }
    };
    
    const bike = bikes.find(b => b.type === 'ROAD');
    const score = scoreBike(bike, partialPosteriors);
    
    expect(score).toBeGreaterThan(0);
    expect(typeof score).toBe('number');
  });
});

describe('getRecommendations', () => {
  const mockPosteriors = {
    BIKE_TYPE: { ROAD: 0.1, HYBRID: 0.15, MOUNTAIN: 0.6, EBIKE: 0.1, GRAVEL: 0.05 },
    SUSPENSION: { NONE: 0.1, FRONT: 0.4, FULL: 0.5 },
    PRICE_RANGE: { BUDGET: 0.2, MIDRANGE: 0.5, PREMIUM: 0.3 },
    COMFORT_LEVEL: { BASIC: 0.3, COMFORTABLE: 0.5, PREMIUM_COMFORT: 0.2 }
  };

  it('should return the specified number of recommendations', () => {
    const recs = getRecommendations(mockPosteriors, 3);
    expect(recs).toHaveLength(3);
  });

  it('should default to 5 recommendations', () => {
    const recs = getRecommendations(mockPosteriors);
    expect(recs).toHaveLength(5);
  });

  it('should return bikes sorted by score in descending order', () => {
    const recs = getRecommendations(mockPosteriors, 5);
    
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].score).toBeGreaterThanOrEqual(recs[i].score);
    }
  });

  it('should include score property on each recommendation', () => {
    const recs = getRecommendations(mockPosteriors, 3);
    
    for (const rec of recs) {
      expect(rec).toHaveProperty('score');
      expect(typeof rec.score).toBe('number');
    }
  });

  it('should favor mountain bikes when MOUNTAIN type has highest probability', () => {
    const recs = getRecommendations(mockPosteriors, 3);
    
    // At least one of top 3 should be a mountain bike
    const hasMountain = recs.some(r => r.type === 'MOUNTAIN');
    expect(hasMountain).toBe(true);
  });

  it('should return all bikes if count exceeds catalog size', () => {
    const recs = getRecommendations(mockPosteriors, 100);
    expect(recs.length).toBe(bikes.length);
  });

  it('should work with empty posteriors', () => {
    const recs = getRecommendations({}, 5);
    
    expect(recs).toHaveLength(5);
    // All scores should be 50 (default)
    for (const rec of recs) {
      expect(rec.score).toBe(50);
    }
  });
});
