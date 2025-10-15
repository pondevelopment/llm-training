/**
 * Agent Mode Data
 * Based on October 2025 research: ChatGPT Agent mode behavioral analysis
 * Source: Jes Scholz, "100 conversations with ChatGPT Agent mode" (Oct 8, 2025)
 */

export interface SearchEvolution {
  id: string;
  stage: 'traditional' | 'agentic' | 'agent-mode';
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
