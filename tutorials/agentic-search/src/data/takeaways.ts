export interface Takeaway {
  id: number;
  icon: string;
  title: string;
  description: string;
  category?: 'fundamentals' | 'protocols' | 'business' | 'trust';
  sectionRef?: number; // Maps to tutorial section (1-9)
  source?: string;
  sourceUrl?: string;
}

// Category display info
export const categoryInfo = {
  fundamentals: { icon: '🔄', title: 'Fundamentals', description: 'Core concepts of agentic search' },
  protocols: { icon: '📋', title: 'Protocols', description: 'Standards enabling agent interoperability' },
  business: { icon: '💼', title: 'Business Impact', description: 'Opportunities and strategies' },
  trust: { icon: '🛡️', title: 'Trust & Safety', description: 'Building reliable agent systems' }
};

// McKinsey report URL for citations
export const MCKINSEY_REPORT_URL = 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants';

export const takeaways: Takeaway[] = [
  // === FUNDAMENTALS (Sections 1-2) ===
  {
    id: 1,
    icon: '🔄',
    title: 'Agentic Search is Goal-Oriented',
    description: 'Unlike traditional search that returns documents, agentic search actively works toward a goal—planning steps, discovering tools, and synthesizing answers.',
    category: 'fundamentals',
    sectionRef: 1
  },
  {
    id: 2,
    icon: '🧰',
    title: 'Agents Extend Themselves via Tools',
    description: 'Agents aren\'t limited to their training data. They discover and use external APIs, databases, and services to access real-time information and specialized capabilities.',
    category: 'fundamentals',
    sectionRef: 3
  },
  {
    id: 3,
    icon: '🎯',
    title: 'Planning is Core to Agentic Behavior',
    description: 'Agents break complex goals into sub-tasks, decide which tools to use, execute workflows, and iterate based on results—just like a human researcher would.',
    category: 'fundamentals',
    sectionRef: 2
  },
  
  // === PROTOCOLS (Sections 3-4) ===
  {
    id: 4,
    icon: '📋',
    title: 'MCP Enables Tool Discovery',
    description: 'The Model Context Protocol provides a standardized way for agents to discover what tools exist and how to use them—like a universal API directory.',
    category: 'protocols',
    sectionRef: 4
  },
  {
    id: 5,
    icon: '🤝',
    title: 'A2A: When Agents Talk to Agents',
    description: 'The Agent-to-Agent Protocol enables autonomous AI agents to coordinate, negotiate, and complete tasks directly with each other—your shopping agent negotiating with a retailer\'s agent for bundle discounts.',
    category: 'protocols',
    sectionRef: 3
  },
  {
    id: 6,
    icon: '💳',
    title: 'AP2: Verifiable Agent Payments',
    description: 'Google\'s Agent Payments Protocol uses cryptographically-signed mandates to link intent, cart, and payment—creating an audit trail that ensures transparent, accountable autonomous transactions.',
    category: 'protocols',
    sectionRef: 3
  },
  {
    id: 7,
    icon: '🛒',
    title: 'ACP: In-Chat Commerce',
    description: 'OpenAI\'s Agentic Commerce Protocol (with Stripe) enables purchases within ChatGPT without leaving the chat. Combined with Shopify integration, this creates seamless agent-mediated checkout.',
    category: 'protocols',
    sectionRef: 3
  },
  
  // === BUSINESS (Sections 5-6) ===
  {
    id: 8,
    icon: '🚀',
    title: 'Agent-Friendly Design Matters',
    description: 'Services that publish MCP manifests, structure data clearly, and provide good documentation will be more discoverable and useful to agents—opening new distribution channels.',
    category: 'business',
    sectionRef: 6
  },
  {
    id: 9,
    icon: '📈',
    title: 'Optimize Early for 4-9× Returns',
    description: 'Agentic search delivers 15.9% conversion rates vs 1.8% for traditional search. Use the FEED framework (Full data, External validation, Engaging copy, Dynamic monitoring) to capture this opportunity before markets mature.',
    category: 'business',
    sectionRef: 6,
    source: 'Seer Interactive, 2025'
  },
  {
    id: 10,
    icon: '💰',
    title: 'The $3-5 Trillion Global Opportunity',
    description: 'By 2030, McKinsey projects $1T in US retail and $3-5T globally will be orchestrated through agentic commerce. This isn\'t just e-commerce evolution—it\'s a paradigm shift where agents become the primary gatekeepers of consumer intent.',
    category: 'business',
    sectionRef: 5,
    source: 'McKinsey, October 2025',
    sourceUrl: MCKINSEY_REPORT_URL
  },
  {
    id: 11,
    icon: '🔀',
    title: 'Three Paths to Purchase',
    description: 'Agentic commerce operates via: (1) Agent-to-Site (agent navigates merchant platform), (2) Agent-to-Agent (your agent negotiates with retailer agent), (3) Brokered (intermediary coordinates multiple vendors). Each requires different optimization strategies.',
    category: 'business',
    sectionRef: 5,
    source: 'McKinsey, October 2025',
    sourceUrl: MCKINSEY_REPORT_URL
  },
  {
    id: 12,
    icon: '💡',
    title: 'New Monetization Models Emerging',
    description: 'Beyond traditional ads: multibrand bundle revenue sharing, real-time negotiation fees, premium agent skills subscriptions, anonymized behavioral data sales, and interagent protocol fees. First-movers define the pricing.',
    category: 'business',
    sectionRef: 5,
    source: 'McKinsey, October 2025',
    sourceUrl: MCKINSEY_REPORT_URL
  },
  
  // === TRUST (Sections 5, 7-8) ===
  {
    id: 13,
    icon: '🔗',
    title: 'Traceability Builds Trust',
    description: 'Good agentic systems show their work—revealing which tools were called, what data was retrieved, and how conclusions were reached. This transparency is crucial for trust.',
    category: 'trust',
    sectionRef: 2
  },
  {
    id: 14,
    icon: '🛡️',
    title: 'Five Dimensions of Agent Trust',
    description: 'McKinsey\'s trust framework: (1) Know Your Agent (KYA) verification, (2) Human-centered design with override controls, (3) Transparent decision trails, (4) Secure data handling, (5) Responsible governance. All five must be addressed.',
    category: 'trust',
    sectionRef: 5,
    source: 'McKinsey, October 2025',
    sourceUrl: MCKINSEY_REPORT_URL
  },
  {
    id: 15,
    icon: '⚠️',
    title: 'The Risk Landscape',
    description: 'Systemic risk (one bad prompt cascades across systems), accountability gray zones (who\'s liable when an agent errs?), and data sovereignty (cross-border GDPR/AI Act compliance). Trust is infrastructure, not afterthought.',
    category: 'trust',
    sectionRef: 5,
    source: 'McKinsey, October 2025',
    sourceUrl: MCKINSEY_REPORT_URL
  }
];
