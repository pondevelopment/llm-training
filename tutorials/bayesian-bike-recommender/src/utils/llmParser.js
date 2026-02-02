// Simulated LLM parser that extracts structured evidence from natural language
// In a real app, this would call an actual LLM API

const keywordMappings = {
  // Budget keywords
  budget: {
    'cheap': { BUDGET: 'LOW' },
    'affordable': { BUDGET: 'LOW' },
    'budget': { BUDGET: 'LOW' },
    'inexpensive': { BUDGET: 'LOW' },
    'under 500': { BUDGET: 'LOW' },
    'under 800': { BUDGET: 'LOW' },
    'mid-range': { BUDGET: 'MEDIUM' },
    'mid range': { BUDGET: 'MEDIUM' },
    'moderate': { BUDGET: 'MEDIUM' },
    'around 1000': { BUDGET: 'MEDIUM' },
    'around 1500': { BUDGET: 'MEDIUM' },
    'premium': { BUDGET: 'HIGH' },
    'expensive': { BUDGET: 'HIGH' },
    'high-end': { BUDGET: 'HIGH' },
    'high end': { BUDGET: 'HIGH' },
    'money is no object': { BUDGET: 'HIGH' },
    'best': { BUDGET: 'HIGH' },
    'top of the line': { BUDGET: 'HIGH' },
  },

  // Experience keywords
  experience: {
    'beginner': { EXPERIENCE: 'BEGINNER' },
    'new to cycling': { EXPERIENCE: 'BEGINNER' },
    'first bike': { EXPERIENCE: 'BEGINNER' },
    'never ridden': { EXPERIENCE: 'BEGINNER' },
    'starting out': { EXPERIENCE: 'BEGINNER' },
    'learning': { EXPERIENCE: 'BEGINNER' },
    'some experience': { EXPERIENCE: 'INTERMEDIATE' },
    'intermediate': { EXPERIENCE: 'INTERMEDIATE' },
    'casual rider': { EXPERIENCE: 'INTERMEDIATE' },
    'ride occasionally': { EXPERIENCE: 'INTERMEDIATE' },
    'experienced': { EXPERIENCE: 'ADVANCED' },
    'advanced': { EXPERIENCE: 'ADVANCED' },
    'serious cyclist': { EXPERIENCE: 'ADVANCED' },
    'competitive': { EXPERIENCE: 'ADVANCED' },
    'racing': { EXPERIENCE: 'ADVANCED' },
  },

  // Terrain keywords
  terrain: {
    'road': { TERRAIN: 'ROAD' },
    'pavement': { TERRAIN: 'ROAD' },
    'streets': { TERRAIN: 'ROAD' },
    'city': { TERRAIN: 'ROAD' },
    'urban': { TERRAIN: 'ROAD' },
    'smooth surfaces': { TERRAIN: 'ROAD' },
    'mixed': { TERRAIN: 'MIXED' },
    'variety': { TERRAIN: 'MIXED' },
    'everything': { TERRAIN: 'MIXED' },
    'bike paths': { TERRAIN: 'MIXED' },
    'gravel paths': { TERRAIN: 'MIXED' },
    'some trails': { TERRAIN: 'MIXED' },
    'off-road': { TERRAIN: 'OFFROAD' },
    'offroad': { TERRAIN: 'OFFROAD' },
    'trails': { TERRAIN: 'OFFROAD' },
    'mountain': { TERRAIN: 'OFFROAD' },
    'dirt': { TERRAIN: 'OFFROAD' },
    'forest': { TERRAIN: 'OFFROAD' },
    'technical': { TERRAIN: 'OFFROAD' },
  },

  // Use case keywords
  useCase: {
    'commute': { USE_CASE: 'COMMUTE' },
    'commuting': { USE_CASE: 'COMMUTE' },
    'work': { USE_CASE: 'COMMUTE' },
    'daily': { USE_CASE: 'COMMUTE' },
    'transportation': { USE_CASE: 'COMMUTE' },
    'getting around': { USE_CASE: 'COMMUTE' },
    'fitness': { USE_CASE: 'FITNESS' },
    'exercise': { USE_CASE: 'FITNESS' },
    'workout': { USE_CASE: 'FITNESS' },
    'cardio': { USE_CASE: 'FITNESS' },
    'get in shape': { USE_CASE: 'FITNESS' },
    'lose weight': { USE_CASE: 'FITNESS' },
    'recreation': { USE_CASE: 'RECREATION' },
    'fun': { USE_CASE: 'RECREATION' },
    'weekend': { USE_CASE: 'RECREATION' },
    'leisure': { USE_CASE: 'RECREATION' },
    'casual': { USE_CASE: 'RECREATION' },
    'family rides': { USE_CASE: 'RECREATION' },
    'sport': { USE_CASE: 'SPORT' },
    'racing': { USE_CASE: 'SPORT' },
    'competition': { USE_CASE: 'SPORT' },
    'performance': { USE_CASE: 'SPORT' },
    'fast': { USE_CASE: 'SPORT' },
    'speed': { USE_CASE: 'SPORT' },
  },

  // Physical condition keywords
  physical: {
    'bad knees': { PHYSICAL_CONDITION: 'LIMITED' },
    'back problems': { PHYSICAL_CONDITION: 'LIMITED' },
    'back pain': { PHYSICAL_CONDITION: 'LIMITED' },
    'older': { PHYSICAL_CONDITION: 'LIMITED' },
    'senior': { PHYSICAL_CONDITION: 'LIMITED' },
    'limited mobility': { PHYSICAL_CONDITION: 'LIMITED' },
    'health issues': { PHYSICAL_CONDITION: 'LIMITED' },
    'recovering': { PHYSICAL_CONDITION: 'LIMITED' },
    'easy on joints': { PHYSICAL_CONDITION: 'LIMITED' },
    'comfortable position': { PHYSICAL_CONDITION: 'LIMITED' },
    'average': { PHYSICAL_CONDITION: 'AVERAGE' },
    'normal': { PHYSICAL_CONDITION: 'AVERAGE' },
    'okay shape': { PHYSICAL_CONDITION: 'AVERAGE' },
    'decent shape': { PHYSICAL_CONDITION: 'AVERAGE' },
    'fit': { PHYSICAL_CONDITION: 'FIT' },
    'athletic': { PHYSICAL_CONDITION: 'FIT' },
    'strong': { PHYSICAL_CONDITION: 'FIT' },
    'good shape': { PHYSICAL_CONDITION: 'FIT' },
    'active': { PHYSICAL_CONDITION: 'FIT' },
    'sporty': { PHYSICAL_CONDITION: 'FIT' },
  },

  // Location hints that suggest terrain/conditions
  location: {
    'hills': { PHYSICAL_CONDITION: 'LIMITED', TERRAIN: 'MIXED' }, // Hills + limited → e-bike friendly
    'hilly': { TERRAIN: 'MIXED' },
    'flat': { TERRAIN: 'ROAD' },
    'san francisco': { TERRAIN: 'MIXED' }, // Known for hills
    'seattle': { TERRAIN: 'MIXED' }, // Hills and rain
    'amsterdam': { TERRAIN: 'ROAD' }, // Flat, bike-friendly
    'colorado': { TERRAIN: 'OFFROAD' }, // Mountains
  },
};

// Extract evidence from natural language input
export function parseUserInput(text) {
  const lowerText = text.toLowerCase();
  const evidence = {};
  const matched = [];

  // Check all keyword categories
  for (const [category, keywords] of Object.entries(keywordMappings)) {
    for (const [keyword, mapping] of Object.entries(keywords)) {
      if (lowerText.includes(keyword)) {
        Object.assign(evidence, mapping);
        matched.push({ category, keyword, mapping });
      }
    }
  }

  return { evidence, matched };
}

// Generate a natural language response explaining the interpretation
export function generateResponse(evidence, matched) {
  if (matched.length === 0) {
    return {
      text: "I understand you're looking for a bike. Could you tell me more about how you plan to use it? For example: commuting, fitness, trails, or recreation?",
      understood: [],
    };
  }

  const understood = [];
  
  if (evidence.BUDGET) {
    const budgetText = {
      LOW: 'a budget-friendly option',
      MEDIUM: 'a mid-range option',
      HIGH: 'a premium option',
    }[evidence.BUDGET];
    understood.push(`you're looking for ${budgetText}`);
  }

  if (evidence.TERRAIN) {
    const terrainText = {
      ROAD: 'primarily on paved roads',
      MIXED: 'on mixed terrain',
      OFFROAD: 'on trails and off-road',
    }[evidence.TERRAIN];
    understood.push(`you'll be riding ${terrainText}`);
  }

  if (evidence.USE_CASE) {
    const useText = {
      COMMUTE: 'for commuting',
      FITNESS: 'for fitness',
      RECREATION: 'for recreational riding',
      SPORT: 'for sport/performance',
    }[evidence.USE_CASE];
    understood.push(`the bike is ${useText}`);
  }

  if (evidence.PHYSICAL_CONDITION) {
    const physText = {
      LIMITED: 'comfort and ease are important',
      AVERAGE: 'you have average fitness',
      FIT: 'you\'re in good physical shape',
    }[evidence.PHYSICAL_CONDITION];
    understood.push(physText);
  }

  if (evidence.EXPERIENCE) {
    const expText = {
      BEGINNER: 'you\'re new to cycling',
      INTERMEDIATE: 'you have some cycling experience',
      ADVANCED: 'you\'re an experienced cyclist',
    }[evidence.EXPERIENCE];
    understood.push(expText);
  }

  const text = `Got it! I understand that ${understood.join(', ')}. Let me update the recommendations based on this.`;

  return { text, understood };
}

// Simulated "hallucination" responses for LLM-only mode comparison
export const llmOnlyResponses = [
  {
    trigger: ['beginner', 'first bike', 'starting'],
    response: "For beginners, I'd recommend the **Trek FX 2** - it's a great all-around hybrid bike that's easy to handle. Perfect for someone just starting out!",
    issue: "Recommends specific model that may not be in stock or best match for actual needs",
  },
  {
    trigger: ['commute', 'work', 'city'],
    response: "For city commuting, the **Specialized Sirrus 3.0** is excellent! It has a comfortable upright position and comes with fenders and a rack. Around $1,100.",
    issue: "Assumes price range, doesn't consider terrain or physical condition",
  },
  {
    trigger: ['cheap', 'budget', 'affordable'],
    response: "I'd suggest checking out the **Giant Escape 3** at $450 or the **Schwinn Discover Hybrid** at $350. Both are solid budget choices!",
    issue: "May recommend bikes that don't match user's actual use case",
  },
  {
    trigger: ['hills', 'hilly'],
    response: "For hilly terrain, you'll want something with a wide gear range. The **Cannondale Quick 4** has excellent climbing gears!",
    issue: "Doesn't consider if user might benefit from e-bike based on their fitness",
  },
  {
    trigger: ['back', 'knee', 'comfort'],
    response: "If comfort is key, look for bikes with an upright position like the **Electra Townie**. They're very easy on the back and joints!",
    issue: "Generic recommendation without considering budget or intended use",
  },
];

export function getLLMOnlyResponse(text) {
  const lowerText = text.toLowerCase();
  
  for (const item of llmOnlyResponses) {
    if (item.trigger.some(t => lowerText.includes(t))) {
      return item;
    }
  }

  return {
    response: "Based on what you've described, I'd recommend a good hybrid bike like the **Giant Escape** series. They're versatile and work well for most riders!",
    issue: "Generic response that doesn't account for individual preferences",
  };
}
