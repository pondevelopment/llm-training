import { describe, it, expect } from 'vitest';
import { parseUserInput, generateResponse, getLLMOnlyResponse } from './llmParser';

describe('parseUserInput', () => {
  describe('budget keywords', () => {
    it('should extract LOW budget from "cheap" keyword', () => {
      const result = parseUserInput('I need a cheap bike');
      expect(result.evidence.BUDGET).toBe('LOW');
    });

    it('should extract LOW budget from "budget" keyword', () => {
      const result = parseUserInput('I\'m on a budget');
      expect(result.evidence.BUDGET).toBe('LOW');
    });

    it('should extract HIGH budget from "premium" keyword', () => {
      const result = parseUserInput('I want a premium bike');
      expect(result.evidence.BUDGET).toBe('HIGH');
    });

    it('should extract MEDIUM budget from "mid-range" keyword', () => {
      const result = parseUserInput('Looking for something mid-range');
      expect(result.evidence.BUDGET).toBe('MEDIUM');
    });
  });

  describe('terrain keywords', () => {
    it('should extract ROAD terrain from "city" keyword', () => {
      const result = parseUserInput('I ride in the city');
      expect(result.evidence.TERRAIN).toBe('ROAD');
    });

    it('should extract OFFROAD terrain from "trails" keyword', () => {
      const result = parseUserInput('I like riding trails');
      expect(result.evidence.TERRAIN).toBe('OFFROAD');
    });

    it('should extract MIXED terrain from "bike paths" keyword', () => {
      const result = parseUserInput('Mostly bike paths');
      expect(result.evidence.TERRAIN).toBe('MIXED');
    });
  });

  describe('physical condition keywords', () => {
    it('should extract LIMITED from "bad knees" keyword', () => {
      const result = parseUserInput('I have bad knees');
      expect(result.evidence.PHYSICAL_CONDITION).toBe('LIMITED');
    });

    it('should extract LIMITED from "back problems" keyword', () => {
      const result = parseUserInput('I have back problems');
      expect(result.evidence.PHYSICAL_CONDITION).toBe('LIMITED');
    });

    it('should extract FIT from "athletic" keyword', () => {
      const result = parseUserInput('I\'m pretty athletic');
      expect(result.evidence.PHYSICAL_CONDITION).toBe('FIT');
    });
  });

  describe('experience keywords', () => {
    it('should extract BEGINNER from "first bike" keyword', () => {
      const result = parseUserInput('This is my first bike');
      expect(result.evidence.EXPERIENCE).toBe('BEGINNER');
    });

    it('should extract ADVANCED from "racing" keyword', () => {
      const result = parseUserInput('I do racing');
      expect(result.evidence.EXPERIENCE).toBe('ADVANCED');
    });
  });

  describe('use case keywords', () => {
    it('should extract COMMUTE from "commute" keyword', () => {
      const result = parseUserInput('I need to commute to work');
      expect(result.evidence.USE_CASE).toBe('COMMUTE');
    });

    it('should extract FITNESS from "exercise" keyword', () => {
      const result = parseUserInput('I want to exercise');
      expect(result.evidence.USE_CASE).toBe('FITNESS');
    });

    it('should extract RECREATION from "fun" keyword', () => {
      const result = parseUserInput('Just for fun');
      expect(result.evidence.USE_CASE).toBe('RECREATION');
    });
  });

  describe('case insensitivity', () => {
    it('should match keywords regardless of case', () => {
      const result = parseUserInput('I am a BEGINNER cyclist');
      expect(result.evidence.EXPERIENCE).toBe('BEGINNER');
    });

    it('should match mixed case input', () => {
      const result = parseUserInput('Looking for a PREMIUM bike for TRAILS');
      expect(result.evidence.BUDGET).toBe('HIGH');
      expect(result.evidence.TERRAIN).toBe('OFFROAD');
    });
  });

  describe('multiple keywords', () => {
    it('should extract multiple evidence from a single input', () => {
      const result = parseUserInput('I\'m a beginner with bad knees looking for a cheap bike for commuting');
      
      expect(result.evidence.EXPERIENCE).toBe('BEGINNER');
      expect(result.evidence.PHYSICAL_CONDITION).toBe('LIMITED');
      expect(result.evidence.BUDGET).toBe('LOW');
      expect(result.evidence.USE_CASE).toBe('COMMUTE');
    });

    it('should return matched keywords in the result', () => {
      const result = parseUserInput('cheap mountain bike for trails');
      
      expect(result.matched.length).toBeGreaterThan(0);
      expect(result.matched.some(m => m.keyword === 'cheap')).toBe(true);
      expect(result.matched.some(m => m.keyword === 'trails')).toBe(true);
    });
  });

  describe('no matches', () => {
    it('should return empty evidence when no keywords match', () => {
      const result = parseUserInput('hello there');
      expect(Object.keys(result.evidence)).toHaveLength(0);
      expect(result.matched).toHaveLength(0);
    });
  });
});

describe('generateResponse', () => {
  it('should generate a response object when evidence is extracted', () => {
    const evidence = { TERRAIN: 'OFFROAD', BUDGET: 'HIGH' };
    const matched = [
      { category: 'terrain', keyword: 'trails', mapping: { TERRAIN: 'OFFROAD' } },
      { category: 'budget', keyword: 'premium', mapping: { BUDGET: 'HIGH' } }
    ];
    
    const response = generateResponse(evidence, matched);
    
    expect(response).toHaveProperty('text');
    expect(response).toHaveProperty('understood');
    expect(typeof response.text).toBe('string');
    expect(Array.isArray(response.understood)).toBe(true);
  });

  it('should mention understood preferences in the text', () => {
    const evidence = { TERRAIN: 'ROAD' };
    const matched = [{ category: 'terrain', keyword: 'road', mapping: { TERRAIN: 'ROAD' } }];
    
    const response = generateResponse(evidence, matched);
    
    // Should mention something about roads
    expect(response.text.toLowerCase()).toContain('paved roads');
  });

  it('should handle empty matches gracefully', () => {
    const response = generateResponse({}, []);
    
    expect(response).toHaveProperty('text');
    expect(typeof response.text).toBe('string');
    expect(response.text.length).toBeGreaterThan(0);
  });

  it('should include budget understanding', () => {
    const evidence = { BUDGET: 'LOW' };
    const matched = [{ category: 'budget', keyword: 'cheap', mapping: { BUDGET: 'LOW' } }];
    
    const response = generateResponse(evidence, matched);
    
    expect(response.understood.length).toBeGreaterThan(0);
    expect(response.understood.some(u => u.includes('budget'))).toBe(true);
  });
});

describe('getLLMOnlyResponse', () => {
  it('should return a response object', () => {
    const response = getLLMOnlyResponse('I am a beginner');
    
    expect(response).toHaveProperty('response');
    expect(response).toHaveProperty('issue');
  });

  it('should return recommendations as a string', () => {
    const response = getLLMOnlyResponse('I need a bike for commuting');
    
    expect(typeof response.response).toBe('string');
    expect(response.response.length).toBeGreaterThan(0);
  });

  it('should identify issues with LLM-only approach', () => {
    const response = getLLMOnlyResponse('I have bad knees');
    
    expect(typeof response.issue).toBe('string');
    expect(response.issue.length).toBeGreaterThan(0);
  });

  it('should match trigger words', () => {
    const beginnerResponse = getLLMOnlyResponse('This is my first bike');
    const commuteResponse = getLLMOnlyResponse('I need to commute to work');
    
    // Different triggers should give different responses
    expect(beginnerResponse.response).not.toBe(commuteResponse.response);
  });

  it('should return fallback for unmatched input', () => {
    const response = getLLMOnlyResponse('xyzzy nonsense input');
    
    expect(response).toHaveProperty('response');
    expect(response).toHaveProperty('issue');
    expect(response.response).toContain('hybrid bike');
  });
});
