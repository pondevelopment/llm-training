// Bayesian Network for Bike Selection
// This network models the relationships between rider preferences and bike attributes

export const bikeNetwork = {
  // RIDER INPUTS (observable evidence)
  BUDGET: {
    id: 'BUDGET',
    states: ['LOW', 'MEDIUM', 'HIGH'],
    parents: [],
    cpt: { LOW: 0.4, MEDIUM: 0.4, HIGH: 0.2 }
  },

  EXPERIENCE: {
    id: 'EXPERIENCE',
    states: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    parents: [],
    cpt: { BEGINNER: 0.5, INTERMEDIATE: 0.35, ADVANCED: 0.15 }
  },

  TERRAIN: {
    id: 'TERRAIN',
    states: ['ROAD', 'MIXED', 'OFFROAD'],
    parents: [],
    cpt: { ROAD: 0.4, MIXED: 0.4, OFFROAD: 0.2 }
  },

  USE_CASE: {
    id: 'USE_CASE',
    states: ['COMMUTE', 'FITNESS', 'RECREATION', 'SPORT'],
    parents: [],
    cpt: { COMMUTE: 0.35, FITNESS: 0.3, RECREATION: 0.25, SPORT: 0.1 }
  },

  PHYSICAL_CONDITION: {
    id: 'PHYSICAL_CONDITION',
    states: ['LIMITED', 'AVERAGE', 'FIT'],
    parents: [],
    cpt: { LIMITED: 0.25, AVERAGE: 0.5, FIT: 0.25 }
  },

  // INFERRED PREFERENCES (hidden nodes)
  BIKE_TYPE: {
    id: 'BIKE_TYPE',
    states: ['ROAD', 'HYBRID', 'MOUNTAIN', 'EBIKE', 'GRAVEL'],
    parents: ['TERRAIN', 'USE_CASE', 'PHYSICAL_CONDITION'],
    cpt: [
      // TERRAIN=ROAD
      { when: { TERRAIN: 'ROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.15, HYBRID: 0.35, MOUNTAIN: 0.02, EBIKE: 0.45, GRAVEL: 0.03 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.25, HYBRID: 0.45, MOUNTAIN: 0.02, EBIKE: 0.20, GRAVEL: 0.08 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.40, HYBRID: 0.35, MOUNTAIN: 0.02, EBIKE: 0.08, GRAVEL: 0.15 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.20, HYBRID: 0.30, MOUNTAIN: 0.02, EBIKE: 0.45, GRAVEL: 0.03 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.50, HYBRID: 0.25, MOUNTAIN: 0.02, EBIKE: 0.13, GRAVEL: 0.10 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.65, HYBRID: 0.12, MOUNTAIN: 0.02, EBIKE: 0.06, GRAVEL: 0.15 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.10, HYBRID: 0.40, MOUNTAIN: 0.02, EBIKE: 0.45, GRAVEL: 0.03 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.25, HYBRID: 0.50, MOUNTAIN: 0.03, EBIKE: 0.15, GRAVEL: 0.07 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.35, HYBRID: 0.40, MOUNTAIN: 0.03, EBIKE: 0.07, GRAVEL: 0.15 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.30, HYBRID: 0.15, MOUNTAIN: 0.02, EBIKE: 0.45, GRAVEL: 0.08 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.65, HYBRID: 0.10, MOUNTAIN: 0.02, EBIKE: 0.10, GRAVEL: 0.13 } },
      { when: { TERRAIN: 'ROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.78, HYBRID: 0.05, MOUNTAIN: 0.02, EBIKE: 0.03, GRAVEL: 0.12 } },
      
      // TERRAIN=MIXED
      { when: { TERRAIN: 'MIXED', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.05, HYBRID: 0.35, MOUNTAIN: 0.08, EBIKE: 0.42, GRAVEL: 0.10 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.08, HYBRID: 0.45, MOUNTAIN: 0.10, EBIKE: 0.17, GRAVEL: 0.20 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.10, HYBRID: 0.35, MOUNTAIN: 0.12, EBIKE: 0.08, GRAVEL: 0.35 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.08, HYBRID: 0.30, MOUNTAIN: 0.10, EBIKE: 0.40, GRAVEL: 0.12 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.15, HYBRID: 0.30, MOUNTAIN: 0.15, EBIKE: 0.12, GRAVEL: 0.28 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.18, HYBRID: 0.20, MOUNTAIN: 0.18, EBIKE: 0.06, GRAVEL: 0.38 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.05, HYBRID: 0.40, MOUNTAIN: 0.10, EBIKE: 0.38, GRAVEL: 0.07 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.08, HYBRID: 0.48, MOUNTAIN: 0.15, EBIKE: 0.14, GRAVEL: 0.15 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.10, HYBRID: 0.40, MOUNTAIN: 0.20, EBIKE: 0.07, GRAVEL: 0.23 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.10, HYBRID: 0.15, MOUNTAIN: 0.20, EBIKE: 0.35, GRAVEL: 0.20 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.15, HYBRID: 0.12, MOUNTAIN: 0.30, EBIKE: 0.10, GRAVEL: 0.33 } },
      { when: { TERRAIN: 'MIXED', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.15, HYBRID: 0.08, MOUNTAIN: 0.35, EBIKE: 0.05, GRAVEL: 0.37 } },
      
      // TERRAIN=OFFROAD
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.01, HYBRID: 0.15, MOUNTAIN: 0.35, EBIKE: 0.42, GRAVEL: 0.07 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.02, HYBRID: 0.18, MOUNTAIN: 0.48, EBIKE: 0.20, GRAVEL: 0.12 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'COMMUTE', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.02, HYBRID: 0.15, MOUNTAIN: 0.58, EBIKE: 0.10, GRAVEL: 0.15 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.01, HYBRID: 0.10, MOUNTAIN: 0.40, EBIKE: 0.42, GRAVEL: 0.07 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.02, HYBRID: 0.10, MOUNTAIN: 0.60, EBIKE: 0.15, GRAVEL: 0.13 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'FITNESS', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.02, HYBRID: 0.08, MOUNTAIN: 0.70, EBIKE: 0.07, GRAVEL: 0.13 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.01, HYBRID: 0.15, MOUNTAIN: 0.38, EBIKE: 0.40, GRAVEL: 0.06 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.02, HYBRID: 0.18, MOUNTAIN: 0.55, EBIKE: 0.17, GRAVEL: 0.08 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'RECREATION', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.02, HYBRID: 0.15, MOUNTAIN: 0.63, EBIKE: 0.10, GRAVEL: 0.10 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'LIMITED' }, then: { ROAD: 0.01, HYBRID: 0.05, MOUNTAIN: 0.50, EBIKE: 0.38, GRAVEL: 0.06 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'AVERAGE' }, then: { ROAD: 0.01, HYBRID: 0.04, MOUNTAIN: 0.75, EBIKE: 0.12, GRAVEL: 0.08 } },
      { when: { TERRAIN: 'OFFROAD', USE_CASE: 'SPORT', PHYSICAL_CONDITION: 'FIT' }, then: { ROAD: 0.01, HYBRID: 0.03, MOUNTAIN: 0.82, EBIKE: 0.05, GRAVEL: 0.09 } },
    ]
  },

  SUSPENSION: {
    id: 'SUSPENSION',
    states: ['NONE', 'FRONT', 'FULL'],
    parents: ['BIKE_TYPE', 'TERRAIN'],
    cpt: [
      // ROAD bikes
      { when: { BIKE_TYPE: 'ROAD', TERRAIN: 'ROAD' }, then: { NONE: 0.95, FRONT: 0.04, FULL: 0.01 } },
      { when: { BIKE_TYPE: 'ROAD', TERRAIN: 'MIXED' }, then: { NONE: 0.90, FRONT: 0.08, FULL: 0.02 } },
      { when: { BIKE_TYPE: 'ROAD', TERRAIN: 'OFFROAD' }, then: { NONE: 0.70, FRONT: 0.25, FULL: 0.05 } },
      // HYBRID bikes
      { when: { BIKE_TYPE: 'HYBRID', TERRAIN: 'ROAD' }, then: { NONE: 0.70, FRONT: 0.28, FULL: 0.02 } },
      { when: { BIKE_TYPE: 'HYBRID', TERRAIN: 'MIXED' }, then: { NONE: 0.45, FRONT: 0.50, FULL: 0.05 } },
      { when: { BIKE_TYPE: 'HYBRID', TERRAIN: 'OFFROAD' }, then: { NONE: 0.20, FRONT: 0.65, FULL: 0.15 } },
      // MOUNTAIN bikes
      { when: { BIKE_TYPE: 'MOUNTAIN', TERRAIN: 'ROAD' }, then: { NONE: 0.10, FRONT: 0.70, FULL: 0.20 } },
      { when: { BIKE_TYPE: 'MOUNTAIN', TERRAIN: 'MIXED' }, then: { NONE: 0.05, FRONT: 0.55, FULL: 0.40 } },
      { when: { BIKE_TYPE: 'MOUNTAIN', TERRAIN: 'OFFROAD' }, then: { NONE: 0.02, FRONT: 0.38, FULL: 0.60 } },
      // EBIKE
      { when: { BIKE_TYPE: 'EBIKE', TERRAIN: 'ROAD' }, then: { NONE: 0.50, FRONT: 0.45, FULL: 0.05 } },
      { when: { BIKE_TYPE: 'EBIKE', TERRAIN: 'MIXED' }, then: { NONE: 0.30, FRONT: 0.55, FULL: 0.15 } },
      { when: { BIKE_TYPE: 'EBIKE', TERRAIN: 'OFFROAD' }, then: { NONE: 0.10, FRONT: 0.50, FULL: 0.40 } },
      // GRAVEL bikes
      { when: { BIKE_TYPE: 'GRAVEL', TERRAIN: 'ROAD' }, then: { NONE: 0.85, FRONT: 0.13, FULL: 0.02 } },
      { when: { BIKE_TYPE: 'GRAVEL', TERRAIN: 'MIXED' }, then: { NONE: 0.70, FRONT: 0.27, FULL: 0.03 } },
      { when: { BIKE_TYPE: 'GRAVEL', TERRAIN: 'OFFROAD' }, then: { NONE: 0.50, FRONT: 0.42, FULL: 0.08 } },
    ]
  },

  PRICE_RANGE: {
    id: 'PRICE_RANGE',
    states: ['BUDGET', 'MIDRANGE', 'PREMIUM'],
    parents: ['BUDGET', 'BIKE_TYPE'],
    cpt: [
      // LOW budget
      { when: { BUDGET: 'LOW', BIKE_TYPE: 'ROAD' }, then: { BUDGET: 0.85, MIDRANGE: 0.14, PREMIUM: 0.01 } },
      { when: { BUDGET: 'LOW', BIKE_TYPE: 'HYBRID' }, then: { BUDGET: 0.90, MIDRANGE: 0.09, PREMIUM: 0.01 } },
      { when: { BUDGET: 'LOW', BIKE_TYPE: 'MOUNTAIN' }, then: { BUDGET: 0.88, MIDRANGE: 0.11, PREMIUM: 0.01 } },
      { when: { BUDGET: 'LOW', BIKE_TYPE: 'EBIKE' }, then: { BUDGET: 0.75, MIDRANGE: 0.23, PREMIUM: 0.02 } },
      { when: { BUDGET: 'LOW', BIKE_TYPE: 'GRAVEL' }, then: { BUDGET: 0.80, MIDRANGE: 0.18, PREMIUM: 0.02 } },
      // MEDIUM budget
      { when: { BUDGET: 'MEDIUM', BIKE_TYPE: 'ROAD' }, then: { BUDGET: 0.25, MIDRANGE: 0.65, PREMIUM: 0.10 } },
      { when: { BUDGET: 'MEDIUM', BIKE_TYPE: 'HYBRID' }, then: { BUDGET: 0.30, MIDRANGE: 0.62, PREMIUM: 0.08 } },
      { when: { BUDGET: 'MEDIUM', BIKE_TYPE: 'MOUNTAIN' }, then: { BUDGET: 0.28, MIDRANGE: 0.60, PREMIUM: 0.12 } },
      { when: { BUDGET: 'MEDIUM', BIKE_TYPE: 'EBIKE' }, then: { BUDGET: 0.20, MIDRANGE: 0.60, PREMIUM: 0.20 } },
      { when: { BUDGET: 'MEDIUM', BIKE_TYPE: 'GRAVEL' }, then: { BUDGET: 0.22, MIDRANGE: 0.63, PREMIUM: 0.15 } },
      // HIGH budget
      { when: { BUDGET: 'HIGH', BIKE_TYPE: 'ROAD' }, then: { BUDGET: 0.05, MIDRANGE: 0.30, PREMIUM: 0.65 } },
      { when: { BUDGET: 'HIGH', BIKE_TYPE: 'HYBRID' }, then: { BUDGET: 0.08, MIDRANGE: 0.42, PREMIUM: 0.50 } },
      { when: { BUDGET: 'HIGH', BIKE_TYPE: 'MOUNTAIN' }, then: { BUDGET: 0.05, MIDRANGE: 0.30, PREMIUM: 0.65 } },
      { when: { BUDGET: 'HIGH', BIKE_TYPE: 'EBIKE' }, then: { BUDGET: 0.05, MIDRANGE: 0.25, PREMIUM: 0.70 } },
      { when: { BUDGET: 'HIGH', BIKE_TYPE: 'GRAVEL' }, then: { BUDGET: 0.06, MIDRANGE: 0.34, PREMIUM: 0.60 } },
    ]
  },

  COMFORT_LEVEL: {
    id: 'COMFORT_LEVEL',
    states: ['BASIC', 'COMFORTABLE', 'PREMIUM_COMFORT'],
    parents: ['PHYSICAL_CONDITION', 'USE_CASE'],
    cpt: [
      // LIMITED physical condition
      { when: { PHYSICAL_CONDITION: 'LIMITED', USE_CASE: 'COMMUTE' }, then: { BASIC: 0.10, COMFORTABLE: 0.50, PREMIUM_COMFORT: 0.40 } },
      { when: { PHYSICAL_CONDITION: 'LIMITED', USE_CASE: 'FITNESS' }, then: { BASIC: 0.15, COMFORTABLE: 0.50, PREMIUM_COMFORT: 0.35 } },
      { when: { PHYSICAL_CONDITION: 'LIMITED', USE_CASE: 'RECREATION' }, then: { BASIC: 0.08, COMFORTABLE: 0.45, PREMIUM_COMFORT: 0.47 } },
      { when: { PHYSICAL_CONDITION: 'LIMITED', USE_CASE: 'SPORT' }, then: { BASIC: 0.20, COMFORTABLE: 0.50, PREMIUM_COMFORT: 0.30 } },
      // AVERAGE physical condition
      { when: { PHYSICAL_CONDITION: 'AVERAGE', USE_CASE: 'COMMUTE' }, then: { BASIC: 0.25, COMFORTABLE: 0.55, PREMIUM_COMFORT: 0.20 } },
      { when: { PHYSICAL_CONDITION: 'AVERAGE', USE_CASE: 'FITNESS' }, then: { BASIC: 0.35, COMFORTABLE: 0.50, PREMIUM_COMFORT: 0.15 } },
      { when: { PHYSICAL_CONDITION: 'AVERAGE', USE_CASE: 'RECREATION' }, then: { BASIC: 0.20, COMFORTABLE: 0.55, PREMIUM_COMFORT: 0.25 } },
      { when: { PHYSICAL_CONDITION: 'AVERAGE', USE_CASE: 'SPORT' }, then: { BASIC: 0.45, COMFORTABLE: 0.42, PREMIUM_COMFORT: 0.13 } },
      // FIT physical condition
      { when: { PHYSICAL_CONDITION: 'FIT', USE_CASE: 'COMMUTE' }, then: { BASIC: 0.40, COMFORTABLE: 0.48, PREMIUM_COMFORT: 0.12 } },
      { when: { PHYSICAL_CONDITION: 'FIT', USE_CASE: 'FITNESS' }, then: { BASIC: 0.55, COMFORTABLE: 0.38, PREMIUM_COMFORT: 0.07 } },
      { when: { PHYSICAL_CONDITION: 'FIT', USE_CASE: 'RECREATION' }, then: { BASIC: 0.35, COMFORTABLE: 0.50, PREMIUM_COMFORT: 0.15 } },
      { when: { PHYSICAL_CONDITION: 'FIT', USE_CASE: 'SPORT' }, then: { BASIC: 0.65, COMFORTABLE: 0.30, PREMIUM_COMFORT: 0.05 } },
    ]
  },
};

// Network structure for visualization
export const networkNodes = [
  { id: 'BUDGET', label: 'Budget', group: 'input', x: 50, y: 100 },
  { id: 'EXPERIENCE', label: 'Experience', group: 'input', x: 50, y: 200 },
  { id: 'TERRAIN', label: 'Terrain', group: 'input', x: 50, y: 300 },
  { id: 'USE_CASE', label: 'Use Case', group: 'input', x: 50, y: 400 },
  { id: 'PHYSICAL_CONDITION', label: 'Physical\nCondition', group: 'input', x: 50, y: 500 },
  { id: 'BIKE_TYPE', label: 'Bike Type', group: 'inferred', x: 250, y: 350 },
  { id: 'SUSPENSION', label: 'Suspension', group: 'output', x: 450, y: 250 },
  { id: 'PRICE_RANGE', label: 'Price Range', group: 'output', x: 450, y: 350 },
  { id: 'COMFORT_LEVEL', label: 'Comfort', group: 'output', x: 450, y: 450 },
];

export const networkEdges = [
  { source: 'TERRAIN', target: 'BIKE_TYPE' },
  { source: 'USE_CASE', target: 'BIKE_TYPE' },
  { source: 'PHYSICAL_CONDITION', target: 'BIKE_TYPE' },
  { source: 'BIKE_TYPE', target: 'SUSPENSION' },
  { source: 'TERRAIN', target: 'SUSPENSION' },
  { source: 'BUDGET', target: 'PRICE_RANGE' },
  { source: 'BIKE_TYPE', target: 'PRICE_RANGE' },
  { source: 'PHYSICAL_CONDITION', target: 'COMFORT_LEVEL' },
  { source: 'USE_CASE', target: 'COMFORT_LEVEL' },
];

// Human-readable labels
export const stateLabels = {
  BUDGET: { LOW: '< $800', MEDIUM: '$800-2000', HIGH: '> $2000' },
  EXPERIENCE: { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' },
  TERRAIN: { ROAD: 'Paved roads', MIXED: 'Mixed terrain', OFFROAD: 'Off-road/trails' },
  USE_CASE: { COMMUTE: 'Commuting', FITNESS: 'Fitness', RECREATION: 'Recreation', SPORT: 'Sport/Racing' },
  PHYSICAL_CONDITION: { LIMITED: 'Some limitations', AVERAGE: 'Average', FIT: 'Very fit' },
  BIKE_TYPE: { ROAD: 'Road Bike', HYBRID: 'Hybrid', MOUNTAIN: 'Mountain', EBIKE: 'E-Bike', GRAVEL: 'Gravel' },
  SUSPENSION: { NONE: 'Rigid', FRONT: 'Front only', FULL: 'Full suspension' },
  PRICE_RANGE: { BUDGET: 'Budget', MIDRANGE: 'Mid-range', PREMIUM: 'Premium' },
  COMFORT_LEVEL: { BASIC: 'Sport/Basic', COMFORTABLE: 'Comfortable', PREMIUM_COMFORT: 'Premium comfort' },
};
