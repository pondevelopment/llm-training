/**
 * Merchant Readiness Data for Agentic Commerce
 * 
 * Based on McKinsey "The Agentic Commerce Opportunity" (October 2025)
 * Defines the 6 key domains merchants must address to be agent-ready
 * 
 * Framework: Innovation (build new) vs Renovation (upgrade existing)
 */

export interface MerchantDomain {
  id: string;
  title: string;
  icon: string;
  category: 'innovation' | 'renovation';
  shortDescription: string;
  fullDescription: string;
  
  // Use cases by interaction model
  agentToSite: string;
  agentToAgent: string;
  brokerAgent: string;
  
  // Implementation guidance
  currentState: string;
  targetState: string;
  keyActions: string[];
  apiRequirements: string[];
  
  // Maturity assessment
  maturityLevels: {
    level: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
  
  // Risk if not addressed
  riskIfIgnored: string;
}

export const merchantDomains: MerchantDomain[] = [
  {
    id: 'discovery',
    title: 'Customer Engagement & Product Discovery',
    icon: '🔍',
    category: 'innovation',
    shortDescription: 'Help agents find and recommend your products',
    fullDescription: 'Agents must understand your catalog to recommend products. This requires semantic metadata, structured data, and agent-authenticated interfaces that go beyond traditional SEO.',
    
    agentToSite: 'Agent identifies user intent and requests tailored product sets from brand or commerce platforms',
    agentToAgent: 'Agent communicates preferences to your brand agent to refine and retrieve options',
    brokerAgent: 'Broker compares your products, availability, and terms across multiple retailers and presents top picks',
    
    currentState: 'Product data optimized for human browsing and traditional search engines',
    targetState: 'Semantic and behavioral metadata embedded in catalog; agent-authenticated interfaces for autonomous discovery',
    
    keyActions: [
      'Embed semantic metadata in product catalogs (beyond basic JSON-LD)',
      'Build agent-authenticated interfaces for autonomous product discovery',
      'Verify intent and identity in real-time for secure, efficient transactions',
      'Implement MCP manifests for tool discovery',
      'Create structured product comparison endpoints'
    ],
    
    apiRequirements: [
      'Product search API with semantic filtering',
      'Real-time inventory and pricing endpoints',
      'Agent authentication/authorization',
      'Structured product comparison responses',
      'Intent classification endpoints'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Basic product pages, no structured data' },
      { level: 2, description: 'JSON-LD schema, Bing Shopping feed' },
      { level: 3, description: 'Product APIs, semantic search' },
      { level: 4, description: 'Agent authentication, MCP manifests' },
      { level: 5, description: 'Full A2A negotiation, real-time personalization' }
    ],
    
    riskIfIgnored: 'Agents can\'t find or recommend your products. Invisible to the $3-5T agentic commerce opportunity.'
  },
  {
    id: 'loyalty',
    title: 'Clienteling & Loyalty',
    icon: '💎',
    category: 'innovation',
    shortDescription: 'Personalize agent interactions with loyalty data',
    fullDescription: 'Agents should know customer history, preferences, and loyalty status to deliver hyperpersonalized experiences. This requires persistent customer-context layers accessible by agents.',
    
    agentToSite: 'Agent tracks past purchases, preferences, and upcoming events to prompt timely re-engagements',
    agentToAgent: 'Agent negotiates perks, previews, or loyalty upgrades based on behavioral signals and tier eligibility',
    brokerAgent: 'Broker aggregates loyalty status across brands and reallocates points or perks to match shopper goals',
    
    currentState: 'Loyalty programs siloed in brand apps; no external API access',
    targetState: 'Persistent customer-context layers accessible by agents; loyalty services exposed via APIs',
    
    keyActions: [
      'Build persistent customer-context layers accessible by agents',
      'Expose loyalty services and eligibility engines via APIs',
      'Enable hyperpersonalized offers triggered by inferred intent',
      'Implement cross-brand loyalty aggregation protocols',
      'Create agent-specific loyalty tier benefits'
    ],
    
    apiRequirements: [
      'Customer profile API (preferences, history)',
      'Loyalty points balance and redemption',
      'Tier eligibility checking',
      'Personalized offer generation',
      'Cross-brand loyalty federation'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Basic loyalty program, no API access' },
      { level: 2, description: 'Customer portal with purchase history' },
      { level: 3, description: 'API access to loyalty status and points' },
      { level: 4, description: 'Agent-accessible context and preferences' },
      { level: 5, description: 'Cross-brand federation, predictive personalization' }
    ],
    
    riskIfIgnored: 'Competitors with agent-ready loyalty capture repeat customers. Your loyalty program becomes invisible to agents.'
  },
  {
    id: 'payments',
    title: 'Payments & Fraud Detection',
    icon: '💳',
    category: 'innovation',
    shortDescription: 'Enable secure autonomous transactions',
    fullDescription: 'Agents need to authenticate, authorize, and execute payments on behalf of users. This requires cryptographic verification, real-time fraud scoring, and support for emerging protocols like AP2.',
    
    agentToSite: 'Agent authenticates and authorizes payments, integrating with merchant payment flows while enforcing delegated consent and spend limits',
    agentToAgent: 'Agent verifies other agent identity and intent through cryptographic attestation or identity tokens; enables real-time fraud scoring',
    brokerAgent: 'Broker manages multiparty settlement and risk mitigation across ecosystems using policy-based authorization',
    
    currentState: 'Human-centered payment flows with manual authentication',
    targetState: 'Agent-authenticated payment with cryptographic verification, spend limits, and audit trails',
    
    keyActions: [
      'Implement AP2 or similar agent payment protocols',
      'Build cryptographic mandate verification',
      'Create spend limit and consent management',
      'Enable real-time fraud scoring for agent transactions',
      'Integrate with agent identity registries'
    ],
    
    apiRequirements: [
      'Agent payment mandate verification',
      'Spend limit enforcement API',
      'Real-time fraud scoring',
      'Multi-party settlement',
      'Transaction audit trails'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Human-only payment flows' },
      { level: 2, description: 'Stored payment methods, guest checkout' },
      { level: 3, description: 'API-accessible payments' },
      { level: 4, description: 'AP2/ACP protocol support' },
      { level: 5, description: 'Full autonomous transactions with fraud protection' }
    ],
    
    riskIfIgnored: 'Agents can\'t complete purchases on your site. 100% abandonment at checkout for agent traffic.'
  },
  {
    id: 'commerce',
    title: 'Core Commerce Platforms',
    icon: '🏪',
    category: 'renovation',
    shortDescription: 'Upgrade platforms for agent-executable transactions',
    fullDescription: 'Legacy commerce platforms must be revamped to enable agents to execute structured transactions with minimal human input. This includes AI capabilities like dynamic pricing and inventory-aware recommendations.',
    
    agentToSite: 'Agent searches, filters, and transacts autonomously when retail systems provide APIs',
    agentToAgent: 'Agent receives structured requests from customer agents, validates parameters, and executes purchases without manual input',
    brokerAgent: 'Broker routes requests across multiple commerce systems, optimizing for availability, delivery time, and cost',
    
    currentState: 'E-commerce optimized for human browsing; limited API access',
    targetState: 'Agent-executable transactions via structured APIs with dynamic pricing and real-time inventory',
    
    keyActions: [
      'Expose commerce functions via structured APIs',
      'Implement dynamic pricing accessible to agents',
      'Build inventory-aware recommendation engines',
      'Enable agent-to-agent transaction protocols',
      'Remove human-only friction (CAPTCHA, complex forms)'
    ],
    
    apiRequirements: [
      'Product catalog API',
      'Cart management API',
      'Dynamic pricing endpoints',
      'Inventory availability',
      'Order execution API'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Website-only, no APIs' },
      { level: 2, description: 'Basic product APIs' },
      { level: 3, description: 'Full commerce APIs (cart, checkout)' },
      { level: 4, description: 'A2A protocol support' },
      { level: 5, description: 'Dynamic pricing, autonomous negotiation' }
    ],
    
    riskIfIgnored: 'Agents bypass your platform for competitors with better API access. Lose market share to agent-ready retailers.'
  },
  {
    id: 'instore',
    title: 'In-Store Point of Service',
    icon: '🏬',
    category: 'renovation',
    shortDescription: 'Bridge digital agents with physical retail',
    fullDescription: 'In-store systems must synchronize digital and physical journeys by sharing context with store associates, accessing digitized store maps, and integrating spatial computing for navigation.',
    
    agentToSite: 'Agent provides real-time in-store navigation based on goals, promotions, and prior behavior',
    agentToAgent: 'Agent exchanges context (intent, loyalty tier) with store agents to personalize service',
    brokerAgent: 'Broker ensures continuity across channels—reserving items, syncing carts, managing handoffs',
    
    currentState: 'In-store POS disconnected from digital commerce; no agent integration',
    targetState: 'Unified digital-physical journey with agent-accessible store context and inventory',
    
    keyActions: [
      'Digitize store maps and inventory locations',
      'Share context between digital agents and store associates',
      'Implement spatial computing for in-store navigation',
      'Enable cart synchronization across channels',
      'Build store-pickup and reservation APIs'
    ],
    
    apiRequirements: [
      'Store inventory by location',
      'In-store navigation/wayfinding',
      'Associate notification API',
      'Cart sync across channels',
      'Store pickup scheduling'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Separate in-store and online systems' },
      { level: 2, description: 'Unified inventory visibility' },
      { level: 3, description: 'Store pickup APIs' },
      { level: 4, description: 'Agent-accessible store context' },
      { level: 5, description: 'Spatial computing, seamless omnichannel' }
    ],
    
    riskIfIgnored: 'Missed omnichannel opportunity. Agents route users to pure-play online competitors.'
  },
  {
    id: 'fulfillment',
    title: 'Fulfillment & Returns',
    icon: '📦',
    category: 'renovation',
    shortDescription: 'Automate post-purchase agent interactions',
    fullDescription: 'Agents should handle fulfillment decisions, return logic, and post-purchase actions autonomously. This requires agent-ready fulfillment APIs and integration with multi-carrier logistics.',
    
    agentToSite: 'Agent selects fulfillment options aligned with urgency, sustainability, or bundling preferences',
    agentToAgent: 'Agent requests returns, refunds, exchanges, or resale pathways based on context and policy',
    brokerAgent: 'Broker balances speed, cost, and environmental impact across multiple providers to manage post-purchase flows',
    
    currentState: 'Manual fulfillment selection; returns require human customer service',
    targetState: 'Autonomous fulfillment optimization; agent-initiated returns and exchanges',
    
    keyActions: [
      'Build agent-ready fulfillment orchestration APIs',
      'Integrate with multi-carrier and last-mile brokers',
      'Implement automated return logic and policy enforcement',
      'Enable sustainability-aware fulfillment selection',
      'Create post-purchase tracking APIs for agents'
    ],
    
    apiRequirements: [
      'Fulfillment option selection API',
      'Shipping carrier integration',
      'Return initiation and tracking',
      'Refund processing',
      'Post-purchase status updates'
    ],
    
    maturityLevels: [
      { level: 1, description: 'Manual fulfillment, email support for returns' },
      { level: 2, description: 'Self-service returns portal' },
      { level: 3, description: 'Fulfillment and returns APIs' },
      { level: 4, description: 'Agent-initiated returns/exchanges' },
      { level: 5, description: 'Autonomous fulfillment optimization' }
    ],
    
    riskIfIgnored: 'Post-purchase friction damages brand perception. Agents learn to avoid recommending your products.'
  }
];

// === MATURITY ASSESSMENT TOOL ===
export interface MaturityAssessment {
  domain: string;
  currentLevel: 1 | 2 | 3 | 4 | 5;
  targetLevel: 1 | 2 | 3 | 4 | 5;
  gap: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function calculateReadinessScore(assessments: MaturityAssessment[]): number {
  const totalPossible = assessments.length * 5;
  const currentScore = assessments.reduce((sum, a) => sum + a.currentLevel, 0);
  return Math.round((currentScore / totalPossible) * 100);
}

export function getPriorityActions(assessments: MaturityAssessment[]): string[] {
  const criticalDomains = assessments
    .filter(a => a.gap >= 2)
    .sort((a, b) => b.gap - a.gap);
  
  return criticalDomains.map(a => {
    const domain = merchantDomains.find(d => d.id === a.domain);
    return domain ? domain.keyActions[0] : '';
  }).filter(Boolean);
}

// === QUICK ASSESSMENT QUESTIONS ===
export interface AssessmentQuestion {
  id: string;
  domain: string;
  question: string;
  options: {
    level: 1 | 2 | 3 | 4 | 5;
    answer: string;
  }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'discovery-q1',
    domain: 'discovery',
    question: 'How do AI agents currently find your products?',
    options: [
      { level: 1, answer: 'They can\'t—we have no structured data' },
      { level: 2, answer: 'Basic JSON-LD schema and shopping feeds' },
      { level: 3, answer: 'Product APIs with semantic search' },
      { level: 4, answer: 'Agent authentication + MCP manifests' },
      { level: 5, answer: 'Full A2A negotiation capabilities' }
    ]
  },
  {
    id: 'loyalty-q1',
    domain: 'loyalty',
    question: 'Can agents access customer loyalty information?',
    options: [
      { level: 1, answer: 'No API access to loyalty data' },
      { level: 2, answer: 'Customers can see their own status online' },
      { level: 3, answer: 'API access to loyalty points/tiers' },
      { level: 4, answer: 'Agents can access full customer context' },
      { level: 5, answer: 'Cross-brand loyalty federation' }
    ]
  },
  {
    id: 'payments-q1',
    domain: 'payments',
    question: 'How do agents complete purchases on your platform?',
    options: [
      { level: 1, answer: 'They can\'t—human-only checkout' },
      { level: 2, answer: 'Guest checkout with stored payments' },
      { level: 3, answer: 'API-accessible payment flows' },
      { level: 4, answer: 'AP2/ACP protocol support' },
      { level: 5, answer: 'Full autonomous transactions with fraud protection' }
    ]
  },
  {
    id: 'commerce-q1',
    domain: 'commerce',
    question: 'Can agents execute transactions on your platform?',
    options: [
      { level: 1, answer: 'Website only—no APIs' },
      { level: 2, answer: 'Basic product catalog APIs' },
      { level: 3, answer: 'Full commerce APIs (cart, checkout)' },
      { level: 4, answer: 'A2A protocol support' },
      { level: 5, answer: 'Dynamic pricing + autonomous negotiation' }
    ]
  },
  {
    id: 'instore-q1',
    domain: 'instore',
    question: 'Are your in-store systems connected to digital agents?',
    options: [
      { level: 1, answer: 'Completely separate systems' },
      { level: 2, answer: 'Unified inventory visibility' },
      { level: 3, answer: 'Store pickup APIs available' },
      { level: 4, answer: 'Agents can access store context' },
      { level: 5, answer: 'Full spatial computing + omnichannel' }
    ]
  },
  {
    id: 'fulfillment-q1',
    domain: 'fulfillment',
    question: 'Can agents handle returns and post-purchase issues?',
    options: [
      { level: 1, answer: 'Manual processes, email/phone only' },
      { level: 2, answer: 'Self-service returns portal' },
      { level: 3, answer: 'Returns and fulfillment APIs' },
      { level: 4, answer: 'Agent-initiated returns/exchanges' },
      { level: 5, answer: 'Fully autonomous fulfillment optimization' }
    ]
  }
];

// === MARKET OPPORTUNITY DATA ===
export interface MarketOpportunity {
  region: string;
  projectedValue: string;
  timeframe: string;
  growthDrivers: string[];
  source: string;
}

export const marketOpportunities: MarketOpportunity[] = [
  {
    region: 'United States',
    projectedValue: '$1 trillion',
    timeframe: 'By 2030',
    growthDrivers: [
      'High AI adoption rates',
      'Strong e-commerce infrastructure',
      'Early protocol standardization'
    ],
    source: 'McKinsey, October 2025'
  },
  {
    region: 'Global',
    projectedValue: '$3-5 trillion',
    timeframe: 'By 2030',
    growthDrivers: [
      '5.6 billion internet users',
      'Rapid AI platform adoption',
      'Lower integration barriers than mobile/web transitions'
    ],
    source: 'McKinsey, October 2025'
  }
];

export const adoptionStats = {
  aiSearchPreference: {
    value: '44%',
    description: 'Users who have tried AI-powered search say it\'s their primary and preferred source',
    vsTraditional: '31% prefer traditional search',
    source: 'McKinsey AI Discovery Survey, 2025'
  },
  agentTaskHorizon: {
    current: '59 minutes (Claude 3.7 Sonnet)',
    extended: '30+ hours (Claude 4.5)',
    trend: 'Doubling every 7 months since 2019',
    source: 'METR, March 2025'
  }
};
