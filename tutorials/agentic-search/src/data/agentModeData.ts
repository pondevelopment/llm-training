/**
 * Agent Mode Data
 * Based on October 2025 research: ChatGPT Agent mode behavioral analysis
 * Source: Jes Scholz, "100 conversations with ChatGPT Agent mode" (Oct 8, 2025)
 */

export interface SearchEvolution {
  id: string;
  stage: 'traditional' | 'agentic' | 'agent-mode' | 'agentic-commerce';
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  userAction: string;
  systemAction: string;
  outcome: string;
  example: string;
  limitations: string[];
  autonomy: 'none' | 'partial' | 'full';
}

export const searchEvolutionStages: SearchEvolution[] = [
  {
    id: 'traditional',
    stage: 'traditional',
    title: 'Traditional Search',
    subtitle: 'Human-driven, link-based discovery',
    icon: '🔍',
    description: 'You search, you click, you evaluate, you decide. Every step requires human judgment and action.',
    userAction: 'User searches "best noise-canceling headphones"',
    systemAction: 'Google returns 10 blue links',
    outcome: 'User clicks, reads reviews, compares prices, makes decision',
    example: 'You spend 20 minutes reading reviews across 5 sites, comparing specs, checking prices, then buying from Amazon.',
    limitations: [
      'Time-intensive research required',
      'Scattered information across multiple sources',
      'Comparison fatigue from too many options',
      'Trust uncertainty without external validation'
    ],
    autonomy: 'none'
  },
  {
    id: 'agentic',
    stage: 'agentic',
    title: 'Agentic Search',
    subtitle: 'AI-curated recommendations',
    icon: '🤖',
    description: 'AI does the research, evaluates options, and presents 3-6 curated recommendations. You still click and buy manually.',
    userAction: 'User asks "recommend noise-canceling headphones under $200"',
    systemAction: 'ChatGPT searches Bing API, evaluates products, curates shortlist',
    outcome: 'User clicks product link, visits website, completes purchase manually',
    example: 'ChatGPT recommends 4 headphones with pros/cons. You click Sony link, visit website, add to cart, checkout yourself.',
    limitations: [
      'Still requires manual website navigation',
      'User must complete checkout process',
      'Multiple steps between recommendation and conversion',
      'Agent can\'t verify final price/stock at checkout'
    ],
    autonomy: 'partial'
  },
  {
    id: 'agent-mode',
    stage: 'agent-mode',
    title: 'Agent Mode',
    subtitle: 'Autonomous task completion',
    icon: '⚡',
    description: 'AI handles the entire transaction—search, selection, and purchase—without human intervention beyond initial approval.',
    userAction: 'User says "buy me noise-canceling headphones under $200"',
    systemAction: 'ChatGPT Agent mode searches, evaluates, selects product, navigates site, completes purchase',
    outcome: 'Transaction complete. User receives confirmation without visiting retailer.',
    example: 'ChatGPT Agent mode finds Sony WH-1000XM5 at $199, navigates to site, fills shipping/payment (stored), completes checkout. Done.',
    limitations: [
      '63% bounce rate on sites with accessibility issues',
      'Text-based browser (46% of visits) sees no styling or images',
      'Blocked by CAPTCHAs, bot detection, pop-ups',
      'Only 17% conversion rate when reaching checkout'
    ],
    autonomy: 'full'
  },
  {
    id: 'agentic-commerce',
    stage: 'agentic-commerce',
    title: 'Agentic Commerce (A2A)',
    subtitle: 'Machine-to-Machine Economy',
    icon: '🤝',
    description: 'Agents negotiate with other agents. Your personal agent talks to a travel agent or retail agent to execute complex tasks without you.',
    userAction: 'User says "Book my usual trip to London for next Tuesday"',
    systemAction: 'User Agent negotiates with Airline Agent & Hotel Agent via A2A protocols',
    outcome: 'Trip booked, paid, and calendar updated automatically',
    example: 'Your agent finds a flight, but the Airline Agent offers a discount for a slightly different time. Your agent accepts based on your preferences.',
    limitations: [
      'Requires standardized protocols (A2A, AP2)',
      'Trust/Authorization challenges',
      'Loss of serendipitous discovery'
    ],
    autonomy: 'full'
  }
];

export interface AgentBehaviorStat {
  id: string;
  icon: string;
  value: string;
  label: string;
  description: string;
  impact: 'critical' | 'high' | 'medium';
  source: string;
  sourceUrl: string;
}

export const agentBehaviorStats: AgentBehaviorStat[] = [
  {
    id: 'text-browser',
    icon: '📄',
    value: '46%',
    label: 'Text-Based Browser Usage',
    description: 'Nearly half of agent visits use text-only browsers where CSS, JavaScript, images, and schema markup are invisible.',
    impact: 'critical',
    source: 'Jes Scholz, Oct 2025',
    sourceUrl: 'https://searchengineland.com/chatgpt-agent-mode-analysis-100-conversations-450123'
  },
  {
    id: 'bounce-rate',
    icon: '🚪',
    value: '63%',
    label: 'Agent Bounce Rate',
    description: 'Agents abandon sites immediately when encountering accessibility barriers: CAPTCHAs, bot blocks, complex forms.',
    impact: 'critical',
    source: 'Jes Scholz, Oct 2025',
    sourceUrl: 'https://searchengineland.com/chatgpt-agent-mode-analysis-100-conversations-450123'
  },
  {
    id: 'conversion-rate',
    icon: '✅',
    value: '17%',
    label: 'Agent Conversion Rate',
    description: 'When agents successfully reach checkout, only 17% complete the transaction—failure points are registration walls and form validation.',
    impact: 'high',
    source: 'Jes Scholz, Oct 2025',
    sourceUrl: 'https://searchengineland.com/chatgpt-agent-mode-analysis-100-conversations-450123'
  },
  {
    id: 'bing-api',
    icon: '🔗',
    value: '92%',
    label: 'Bing API Dependency',
    description: 'Most agent queries rely on Bing Search API for product data—not visual search results. Bing Shopping feed presence is critical.',
    impact: 'critical',
    source: 'Jes Scholz, Oct 2025',
    sourceUrl: 'https://searchengineland.com/chatgpt-agent-mode-analysis-100-conversations-450123'
  }
];

export interface AgentReadinessBarrier {
  id: string;
  category: 'accessibility' | 'usability' | 'convertibility';
  title: string;
  icon: string;
  problem: string;
  agentImpact: string;
  humanImpact: string;
  solution: string;
  priority: 'critical' | 'high' | 'medium';
}

export const agentReadinessBarriers: AgentReadinessBarrier[] = [
  {
    id: 'captcha',
    category: 'accessibility',
    title: 'CAPTCHA Challenges',
    icon: '🔒',
    problem: 'CAPTCHA blocks on login, checkout, or form submission prevent agents from proceeding.',
    agentImpact: 'Immediate abandonment. 100% bounce rate.',
    humanImpact: 'Minor friction. Most humans pass CAPTCHAs.',
    solution: 'Use invisible CAPTCHA (hCaptcha, reCAPTCHA v3) that doesn\'t block bots outright. Monitor bot traffic patterns instead of blocking.',
    priority: 'critical'
  },
  {
    id: 'bot-detection',
    category: 'accessibility',
    title: 'Aggressive Bot Detection',
    icon: '🛡️',
    problem: 'Web application firewalls (WAF) or bot management tools block agent user-agents.',
    agentImpact: '4XX errors. No access to product pages or checkout.',
    humanImpact: 'No impact—humans not blocked.',
    solution: 'Whitelist ChatGPT user-agents. Allow desktop Chrome bot traffic with rate limits rather than blocking.',
    priority: 'critical'
  },
  {
    id: 'registration-wall',
    category: 'convertibility',
    title: 'Registration Before Purchase',
    icon: '📝',
    problem: 'Requiring account creation before allowing checkout adds multiple form steps agents often fail.',
    agentImpact: 'High abandonment. Registration forms often have validation issues or CAPTCHAs.',
    humanImpact: 'Friction but tolerable for returning customers.',
    solution: 'Enable guest checkout. Defer registration until AFTER purchase completion.',
    priority: 'high'
  },
  {
    id: 'complex-forms',
    category: 'convertibility',
    title: 'Complex Form Validation',
    icon: '📋',
    problem: 'Multi-step forms with unclear validation, dynamic field requirements, or JavaScript-dependent logic confuse agents.',
    agentImpact: 'Validation errors, stuck progress, abandonment.',
    humanImpact: 'Frustration but humans can adapt.',
    solution: 'Use semantic HTML forms with clear labels, server-side validation, and error messages that agents can read.',
    priority: 'high'
  },
  {
    id: 'popup-interference',
    category: 'usability',
    title: 'Pop-ups & Overlays',
    icon: '⚠️',
    problem: 'Cookie banners, newsletter pop-ups, chat widgets, or promo overlays cover CTAs and block agent navigation.',
    agentImpact: 'Agents can\'t click through overlays. Stuck or abandon.',
    humanImpact: 'Annoying but humans dismiss quickly.',
    solution: 'Delay pop-ups until after key actions. Ensure overlays are dismissible with keyboard ESC or simple clicks.',
    priority: 'medium'
  },
  {
    id: 'mailto-links',
    category: 'convertibility',
    title: 'mailto: Buttons',
    icon: '📧',
    problem: 'Contact forms using mailto: links instead of proper <form> elements fail because agents can\'t send email.',
    agentImpact: 'Dead end. No way to submit inquiry or request.',
    humanImpact: 'Opens email client—works fine.',
    solution: 'Replace mailto: with web forms using <form> tags and POST actions.',
    priority: 'medium'
  }
];

export interface AgentModeInsight {
  id: string;
  title: string;
  icon: string;
  insight: string;
  implication: string;
  action: string;
}

export const agentModeInsights: AgentModeInsight[] = [
  {
    id: 'autonomous-transactions',
    title: 'Agents Act, Don\'t Just Recommend',
    icon: '⚡',
    insight: 'Agent mode completes full purchase flows—browsing, selecting, checkout—without human involvement beyond initial approval.',
    implication: 'Your site must be navigable and convertible for bots, not just humans. Traditional UX assumptions break.',
    action: 'Test your conversion funnel with an agent. Identify where bots get stuck (registration, CAPTCHA, validation).'
  },
  {
    id: 'text-first-design',
    title: 'Text-Based Browsers Are the New Mobile',
    icon: '📄',
    insight: '46% of agent visits use text-only browsers. No CSS, no images, no JavaScript execution—just semantic HTML.',
    implication: 'Your site\'s structure, labels, and semantic HTML are now first-class citizens. Visual design is secondary.',
    action: 'View your site with a text browser (Lynx, w3m, or browser dev tools with CSS disabled). Fix broken flows.'
  },
  {
    id: 'conversion-fragility',
    title: 'High Intent, Low Completion',
    icon: '🎯',
    insight: 'Agents have purchase intent (they\'re acting on user requests) but only 17% complete checkout. Friction points kill conversions.',
    implication: 'Every unnecessary step, unclear field, or ambiguous button is an agent abandonment point.',
    action: 'Simplify checkout: guest checkout, clear labels, semantic form elements, server-side validation.'
  },
  {
    id: 'instant-checkout-future',
    title: 'Instant Checkout Is Here (Beta)',
    icon: '🚀',
    insight: 'Etsy, Shopify partners now test in-chat purchases. Users buy without leaving ChatGPT. Commission-based revenue model.',
    implication: 'Agent-readiness isn\'t just about SEO visibility—it\'s about capturing autonomous transactions.',
    action: 'Optimize for agent convertibility NOW. When Instant Checkout expands, you\'ll be ready to integrate.'
  }
];

// === TRUST DIMENSIONS (McKinsey Framework) ===
export interface TrustDimension {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  questions: string[];
  implementations: string[];
  risks: string[];
}

export const trustDimensions: TrustDimension[] = [
  {
    id: 'kya',
    title: 'Know Your Agent (KYA)',
    icon: '🔍',
    shortDescription: 'Verify agent identity and intent in real-time',
    fullDescription: 'When an AI agent arrives at your platform, how do you know it\'s legitimate? KYA encompasses agent authentication, capability verification, and trust scoring—ensuring you\'re interacting with authorized agents acting on real user behalf.',
    questions: [
      'Is this agent who it claims to be?',
      'Is it acting on behalf of a real user with valid consent?',
      'What are its permission boundaries?'
    ],
    implementations: [
      'Agent registries with cryptographic verification',
      'OAuth-style agent authorization flows',
      'Tiered trust levels (anonymous, verified, premium)',
      'Real-time capability attestation'
    ],
    risks: [
      'Malicious bots impersonating legitimate agents',
      'Agents exceeding granted permissions',
      'Forged user consent'
    ]
  },
  {
    id: 'human-centered',
    title: 'Human-Centered Design',
    icon: '👤',
    shortDescription: 'Keep humans in control with override capabilities',
    fullDescription: 'Trust is contextual—what feels intuitive in one market may be unthinkable in another. Human-centered agentic design means users can always understand, question, and override agent decisions. Consent isn\'t a checkbox; it\'s a living, flexible agreement.',
    questions: [
      'Can users easily understand what the agent is doing?',
      'Can they pause, reverse, or cancel agent actions?',
      'Are consent boundaries clearly communicated?'
    ],
    implementations: [
      'Intuitive preference controls ("never spend more than $X")',
      'Action confirmation for high-stakes decisions',
      'Easy kill switches and undo mechanisms',
      'Progressive disclosure of agent reasoning'
    ],
    risks: [
      'Users feel loss of control',
      'Unexpected purchases without clear approval',
      'Cultural mismatches in automation comfort levels'
    ]
  },
  {
    id: 'transparency',
    title: 'Transparent Decision Trails',
    icon: '🔗',
    shortDescription: 'Show how conclusions were reached',
    fullDescription: 'Users should be able to ask: How is my data being used? What does this choice mean for me? Explainability is likely to become a consumer right, and auditable logs may soon be a regulatory requirement.',
    questions: [
      'Which tools did the agent call?',
      'What data influenced the decision?',
      'Why was this option chosen over alternatives?'
    ],
    implementations: [
      'Auditable action logs',
      'Natural language decision explanations',
      'Tool call visibility ("I searched 5 sites...")',
      'Confidence levels for recommendations'
    ],
    risks: [
      'Black-box decisions erode trust',
      'Unable to debug agent failures',
      'Regulatory non-compliance (EU AI Act)'
    ]
  },
  {
    id: 'data-security',
    title: 'Secure Data Handling',
    icon: '🔒',
    shortDescription: 'Protect user data across agent interactions',
    fullDescription: 'Agents operate on data, making data sovereignty increasingly geopolitical. If an agent processes EU citizen data via a US-based API, is it compliant? Data protection isn\'t just technical—it\'s political.',
    questions: [
      'Where is user data processed and stored?',
      'Is cross-border data transfer compliant?',
      'How long is data retained by agents?'
    ],
    implementations: [
      'Data localization for regional compliance',
      'Ephemeral processing (delete after use)',
      'End-to-end encryption for agent communications',
      'User data access and deletion controls'
    ],
    risks: [
      'GDPR/AI Act violations',
      'Data breaches from compromised agents',
      'Unauthorized data sharing between agents'
    ]
  },
  {
    id: 'governance',
    title: 'Responsible Governance',
    icon: '⚖️',
    shortDescription: 'Clear accountability and compliance frameworks',
    fullDescription: 'When an AI agent makes a poor decision, determining accountability is complex. Who is to blame? The platform that developed the model? The brand that deployed the agent? The user who approved it? Until clearer frameworks emerge, overdisclosure and caution may be the safest approach.',
    questions: [
      'Who is liable when an agent errs?',
      'What recourse do users have for agent mistakes?',
      'How do we handle cross-border legal jurisdictions?'
    ],
    implementations: [
      'Clear terms of service for agent-mediated transactions',
      'Liability allocation agreements between platforms',
      'Dispute resolution mechanisms',
      'Regular governance audits'
    ],
    risks: [
      'Legal gray zones in agent liability',
      'Regulatory fragmentation (EU vs US vs Asia)',
      'Brand reputation damage from agent failures'
    ]
  }
];

// === INTERACTION MODELS (McKinsey Framework) ===
export interface InteractionModel {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  example: string;
  flow: string[];
  merchantRequirements: string[];
  protocols: string[];
  advantages: string[];
  challenges: string[];
}

export const interactionModels: InteractionModel[] = [
  {
    id: 'agent-to-site',
    name: 'Agent to Site',
    icon: '🖥️',
    shortDescription: 'Agents interact directly with merchant platforms',
    fullDescription: 'The simplest model: your personal agent navigates to a merchant\'s website, browses products, and completes transactions just like a human would—but faster and without fatigue.',
    example: 'A travel agent scans multiple hotel websites, highlighting those that fit your preferences and confirming your interest before booking the room.',
    flow: [
      'User gives intent to personal agent',
      'Agent navigates to merchant website',
      'Agent browses, filters, selects products',
      'Agent completes checkout (if capable)',
      'Transaction confirmed to user'
    ],
    merchantRequirements: [
      'Agent-friendly accessibility (no CAPTCHAs blocking)',
      'Semantic HTML structure',
      'Clear product schema (JSON-LD)',
      'Streamlined checkout flow',
      'Guest checkout option'
    ],
    protocols: ['MCP (for tool discovery)', 'Standard HTTP'],
    advantages: [
      'Works with existing e-commerce infrastructure',
      'No special API integration required',
      'Gradual adoption path for merchants'
    ],
    challenges: [
      '63% bounce rate due to accessibility barriers',
      'Only 17% conversion when reaching checkout',
      'Limited negotiation or personalization'
    ]
  },
  {
    id: 'agent-to-agent',
    name: 'Agent to Agent (A2A)',
    icon: '🤝',
    shortDescription: 'Agents transact autonomously with other agents',
    fullDescription: 'Your personal-shopping agent communicates directly with a retailer\'s in-house AI commerce agent. They negotiate, bundle, and transact without human involvement.',
    example: 'Your agent talks to an Airline Agent & Hotel Agent via A2A protocols. The Airline Agent offers a discount for a slightly different flight time. Your agent accepts based on your stored preferences.',
    flow: [
      'User gives complex intent ("Book usual London trip")',
      'Personal agent discovers relevant vendor agents',
      'Agents negotiate terms, prices, bundles',
      'Vendor agent confirms availability and price',
      'Transaction executed via AP2 payment protocol',
      'User receives confirmation and itinerary'
    ],
    merchantRequirements: [
      'A2A protocol implementation',
      'Agent capability manifests',
      'Negotiation logic and boundaries',
      'Real-time inventory APIs',
      'Payment protocol integration (AP2)'
    ],
    protocols: ['A2A Protocol', 'AP2 (payments)', 'MCP'],
    advantages: [
      'Personalized deals via negotiation',
      'Bundle discounts across departments',
      'Faster transactions (no UI rendering)',
      'Dynamic pricing optimization'
    ],
    challenges: [
      'Requires standardized protocols (still emerging)',
      'Trust/authorization between agents',
      'Complex implementation for merchants'
    ]
  },
  {
    id: 'brokered-agent',
    name: 'Brokered Agent to Site',
    icon: '🔀',
    shortDescription: 'Intermediary systems coordinate multi-agent interactions',
    fullDescription: 'A broker agent (like OpenTable or a travel aggregator) coordinates between your personal agent and multiple merchant agents, orchestrating complex multi-vendor transactions.',
    example: 'A restaurant-booking agent contacts the broker agent of a platform like OpenTable, which finds you a table and applies loyalty discounts based on your profile across participating restaurants.',
    flow: [
      'User gives multi-vendor intent ("Plan anniversary dinner + show")',
      'Personal agent contacts broker agent',
      'Broker discovers relevant vendors',
      'Broker negotiates with multiple vendor agents',
      'Broker assembles multi-vendor package',
      'User approves consolidated offer',
      'Broker orchestrates parallel transactions'
    ],
    merchantRequirements: [
      'Integration with broker platforms',
      'Loyalty/discount API endpoints',
      'Real-time availability feeds',
      'Multi-party settlement support'
    ],
    protocols: ['ACP (Agentic Commerce Protocol)', 'A2A', 'AP2'],
    advantages: [
      'Cross-vendor optimization',
      'Unified loyalty programs',
      'Complex itinerary assembly',
      'Better user experience for multi-step purchases'
    ],
    challenges: [
      'Broker takes commission cut',
      'Merchants lose direct customer relationship',
      'Data sharing with intermediaries'
    ]
  }
];

// === MONETIZATION MODELS (McKinsey Research) ===
export interface MonetizationModel {
  id: string;
  title: string;
  icon: string;
  description: string;
  example: string;
  whoPayes: string;
  revenue: 'transaction' | 'subscription' | 'data' | 'commission';
  maturity: 'emerging' | 'testing' | 'established';
}

export const monetizationModels: MonetizationModel[] = [
  {
    id: 'bundle-revenue',
    title: 'Multibrand Bundling & Revenue Sharing',
    icon: '📦',
    description: 'AI agents coordinate purchases across multiple brands, bundling them into seamless experiences. Each provider receives a share of the total package fee.',
    example: 'Honeymoon package: agent compiles flights, hotels, excursions, dining from different providers. Each gets revenue share, agent platform takes coordination fee.',
    whoPayes: 'Consumer pays bundle price; revenue shared among providers + platform fee',
    revenue: 'commission',
    maturity: 'testing'
  },
  {
    id: 'negotiation-fees',
    title: 'Real-Time Negotiation Fees',
    icon: '🤝',
    description: 'Agents negotiate in real-time on behalf of users (upgrades, loyalty redemptions). Platforms charge success fees per negotiation.',
    example: 'Agent secures hotel room upgrade worth $200. Platform charges merchant $20 success fee.',
    whoPayes: 'Merchant pays on successful negotiation',
    revenue: 'transaction',
    maturity: 'emerging'
  },
  {
    id: 'premium-skills',
    title: 'Premium Skills & Subscriptions',
    icon: '⭐',
    description: 'Specialized vertical agents (fashion stylists, trip planners) offered through subscription plans or tiered access to advanced features.',
    example: 'Premium travel agent: $9.99/month for personalized trip planning, loyalty optimization, and real-time rebooking.',
    whoPayes: 'Consumer subscription',
    revenue: 'subscription',
    maturity: 'testing'
  },
  {
    id: 'data-insights',
    title: 'Data Insights & Analytics Sales',
    icon: '📊',
    description: 'Brands pay for anonymized, agent-filtered consumer behavior analytics: product consideration, price sensitivities, competitor comparisons.',
    example: 'Brand learns 34% of agents rejected their product due to shipping time. Data helps optimize fulfillment strategy.',
    whoPayes: 'Brands/merchants pay for insights',
    revenue: 'data',
    maturity: 'emerging'
  },
  {
    id: 'conversational-marketplace',
    title: 'Conversational Marketplaces',
    icon: '💬',
    description: 'AI agents evolve into full conversational marketplaces where purchase decisions occur through dialogue. Monetization via listing fees, commissions, and payment protection.',
    example: 'ChatGPT becomes the "Amazon of agents"—brands pay to list products, take commission on sales, charge for payment protection.',
    whoPayes: 'Merchants pay listing + commission; consumers pay for protection',
    revenue: 'commission',
    maturity: 'emerging'
  },
  {
    id: 'interagent-fees',
    title: 'Interagent Protocol Fees',
    icon: '🔗',
    description: 'When AI agents from different platforms interact, monetization happens through protocol-level fees for interoperability or commission sharing.',
    example: 'Your personal agent (ChatGPT) talks to Expedia\'s agent. Protocol fee: $0.10 per transaction.',
    whoPayes: 'Platform-to-platform fees passed to merchants or consumers',
    revenue: 'transaction',
    maturity: 'emerging'
  }
];

// === RISK CATEGORIES (McKinsey Research) ===
export interface RiskCategory {
  id: string;
  title: string;
  icon: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
  examples: string[];
  mitigations: string[];
}

export const riskCategories: RiskCategory[] = [
  {
    id: 'systemic',
    title: 'Systemic Risk: The Snowball Effect',
    icon: '🌊',
    severity: 'critical',
    description: 'When agents are interconnected across multiple systems, minor errors can have exponential impact. A single faulty prompt can trigger a cascade of unintended consequences.',
    examples: [
      'Incorrect flight booking triggers wrong hotel dates, wrong car rental, wrong event tickets',
      'Inventory overordering due to one agent misreading demand signals',
      'Purchase without consent propagating through payment systems'
    ],
    mitigations: [
      'Design agents to fail gracefully with rollback capabilities',
      'Implement circuit breakers for cascading failures',
      'Require human confirmation for high-value decisions',
      'Build resilience testing into agent deployment'
    ]
  },
  {
    id: 'accountability',
    title: 'Accountability: The Legal Gray Zone',
    icon: '⚖️',
    severity: 'high',
    description: 'When an AI agent makes a poor decision, determining accountability is complex. The platform? The brand? The user? No global consensus exists on responsibility.',
    examples: [
      'Agent books trip that gets canceled—who refunds?',
      'Agent accepts terms user wouldn\'t have agreed to',
      'Third-party plugin causes transaction failure'
    ],
    mitigations: [
      'Clear terms of service allocating liability',
      'Explainability requirements for agent decisions',
      'Auditable logs as regulatory requirement',
      'TRiSM stack (Trust, Risk, Security Management)'
    ]
  },
  {
    id: 'data-sovereignty',
    title: 'Data Sovereignty: A Geopolitical Challenge',
    icon: '🌍',
    severity: 'high',
    description: 'AI agents operate on data, making data sovereignty increasingly geopolitical. Data localization, cross-border compliance, and regional AI regulations create a complex landscape.',
    examples: [
      'Agent processes EU citizen data via US-based API—GDPR compliant?',
      'Agent trained on global data but acting locally—lawful?',
      'India/France data localization requirements blocking agent functionality'
    ],
    mitigations: [
      'Regional data processing infrastructure',
      'Localized behavior and ethics customization',
      'Compliance with GDPR, AI Act, regional frameworks',
      'OpenAI "for countries" model for localized compliance'
    ]
  }
];
