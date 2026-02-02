import { describe, it, expect } from 'vitest';
import { bikeNetwork, networkNodes, networkEdges, stateLabels } from './bayesianNetwork';

describe('bikeNetwork structure', () => {
  it('should have all required nodes', () => {
    const expectedNodes = [
      'BUDGET', 'EXPERIENCE', 'TERRAIN', 'USE_CASE', 'PHYSICAL_CONDITION',
      'BIKE_TYPE', 'SUSPENSION', 'PRICE_RANGE', 'COMFORT_LEVEL'
    ];
    
    for (const nodeId of expectedNodes) {
      expect(bikeNetwork).toHaveProperty(nodeId);
    }
  });

  it('should have required properties on each node', () => {
    for (const [nodeId, node] of Object.entries(bikeNetwork)) {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('states');
      expect(node).toHaveProperty('parents');
      expect(node).toHaveProperty('cpt');
      
      expect(node.id).toBe(nodeId);
      expect(Array.isArray(node.states)).toBe(true);
      expect(Array.isArray(node.parents)).toBe(true);
    }
  });
});

describe('CPT probability validation', () => {
  describe('root nodes (no parents)', () => {
    const rootNodes = ['BUDGET', 'EXPERIENCE', 'TERRAIN', 'USE_CASE', 'PHYSICAL_CONDITION'];
    
    it.each(rootNodes)('%s CPT should sum to 1.0', (nodeId) => {
      const node = bikeNetwork[nodeId];
      const sum = Object.values(node.cpt).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });

    it.each(rootNodes)('%s should have no parents', (nodeId) => {
      const node = bikeNetwork[nodeId];
      expect(node.parents).toHaveLength(0);
    });
  });

  describe('child nodes (with parents)', () => {
    it('BIKE_TYPE CPT entries should all sum to 1.0', () => {
      const node = bikeNetwork.BIKE_TYPE;
      
      for (const entry of node.cpt) {
        const sum = Object.values(entry.then).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 5);
      }
    });

    it('SUSPENSION CPT entries should all sum to 1.0', () => {
      const node = bikeNetwork.SUSPENSION;
      
      for (const entry of node.cpt) {
        const sum = Object.values(entry.then).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 5);
      }
    });

    it('PRICE_RANGE CPT entries should all sum to 1.0', () => {
      const node = bikeNetwork.PRICE_RANGE;
      
      for (const entry of node.cpt) {
        const sum = Object.values(entry.then).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 5);
      }
    });

    it('COMFORT_LEVEL CPT entries should all sum to 1.0', () => {
      const node = bikeNetwork.COMFORT_LEVEL;
      
      for (const entry of node.cpt) {
        const sum = Object.values(entry.then).reduce((a, b) => a + b, 0);
        expect(sum).toBeCloseTo(1.0, 5);
      }
    });
  });

  describe('CPT coverage', () => {
    it('BIKE_TYPE should have CPT entry for all parent combinations', () => {
      const node = bikeNetwork.BIKE_TYPE;
      const terrainStates = bikeNetwork.TERRAIN.states;
      const useCaseStates = bikeNetwork.USE_CASE.states;
      const physicalStates = bikeNetwork.PHYSICAL_CONDITION.states;
      
      const expectedCombinations = terrainStates.length * useCaseStates.length * physicalStates.length;
      expect(node.cpt.length).toBe(expectedCombinations);
    });

    it('SUSPENSION should have CPT entry for all parent combinations', () => {
      const node = bikeNetwork.SUSPENSION;
      const bikeTypeStates = bikeNetwork.BIKE_TYPE.states;
      const terrainStates = bikeNetwork.TERRAIN.states;
      
      const expectedCombinations = bikeTypeStates.length * terrainStates.length;
      expect(node.cpt.length).toBe(expectedCombinations);
    });

    it('PRICE_RANGE should have CPT entry for all parent combinations', () => {
      const node = bikeNetwork.PRICE_RANGE;
      const budgetStates = bikeNetwork.BUDGET.states;
      const bikeTypeStates = bikeNetwork.BIKE_TYPE.states;
      
      const expectedCombinations = budgetStates.length * bikeTypeStates.length;
      expect(node.cpt.length).toBe(expectedCombinations);
    });
  });
});

describe('networkNodes', () => {
  it('should have a node definition for each network node', () => {
    const networkNodeIds = Object.keys(bikeNetwork);
    const visualNodeIds = networkNodes.map(n => n.id);
    
    for (const nodeId of networkNodeIds) {
      expect(visualNodeIds).toContain(nodeId);
    }
  });

  it('should have required properties on each visual node', () => {
    for (const node of networkNodes) {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('label');
      expect(node).toHaveProperty('group');
      expect(node).toHaveProperty('x');
      expect(node).toHaveProperty('y');
    }
  });

  it('should have valid group types', () => {
    const validGroups = ['input', 'inferred', 'output'];
    
    for (const node of networkNodes) {
      expect(validGroups).toContain(node.group);
    }
  });

  it('should have input nodes for observable variables', () => {
    const inputNodes = networkNodes.filter(n => n.group === 'input');
    const inputIds = inputNodes.map(n => n.id);
    
    expect(inputIds).toContain('BUDGET');
    expect(inputIds).toContain('EXPERIENCE');
    expect(inputIds).toContain('TERRAIN');
    expect(inputIds).toContain('USE_CASE');
    expect(inputIds).toContain('PHYSICAL_CONDITION');
  });
});

describe('networkEdges', () => {
  it('should have all edges referencing valid nodes', () => {
    const nodeIds = Object.keys(bikeNetwork);
    
    for (const edge of networkEdges) {
      expect(nodeIds).toContain(edge.source);
      expect(nodeIds).toContain(edge.target);
    }
  });

  it('should match parent-child relationships in the network', () => {
    for (const [nodeId, node] of Object.entries(bikeNetwork)) {
      for (const parentId of node.parents) {
        const hasEdge = networkEdges.some(
          e => e.source === parentId && e.target === nodeId
        );
        expect(hasEdge).toBe(true);
      }
    }
  });

  it('should have required properties on each edge', () => {
    for (const edge of networkEdges) {
      expect(edge).toHaveProperty('source');
      expect(edge).toHaveProperty('target');
    }
  });
});

describe('stateLabels', () => {
  it('should have labels for all nodes', () => {
    const nodeIds = Object.keys(bikeNetwork);
    
    for (const nodeId of nodeIds) {
      expect(stateLabels).toHaveProperty(nodeId);
    }
  });

  it('should have labels for all states of each node', () => {
    for (const [nodeId, node] of Object.entries(bikeNetwork)) {
      const nodeLabels = stateLabels[nodeId];
      
      for (const state of node.states) {
        expect(nodeLabels).toHaveProperty(state);
        expect(typeof nodeLabels[state]).toBe('string');
      }
    }
  });
});
