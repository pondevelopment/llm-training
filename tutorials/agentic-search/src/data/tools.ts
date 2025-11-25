export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  detailedDescription?: string;  // New: longer explanation
  useCases?: string[];           // New: practical use cases
  capabilities: string[];
  exampleOutput: string;
  manifestSnippet?: {
    name: string;
    version: string;
    functions: Array<{
      name: string;
      description: string;
      params: Record<string, string>;
      returns: string;
    }>;
  };
}

export const tools: Tool[] = [
  {
    id: 'product-search',
    name: 'Product Search API',
    icon: '🛍️',
    description: 'Searches e-commerce sites and product databases with advanced filtering',
    detailedDescription: 'The Product Search API connects to multiple e-commerce platforms (Amazon, specialized retailers, manufacturer sites) and aggregates product data. Agents can filter by specifications, price ranges, user ratings, availability, and even niche criteria like "women\'s geometry bikes" or "Linux-compatible laptops." Unlike browsing shopping sites manually, agents retrieve structured product data with all specs, reviews, and pricing in one call.',
    useCases: [
      'Find bikes with specific frame geometry and size ranges',
      'Compare laptops by CPU benchmarks and display specs',
      'Filter products by real customer reviews (4+ stars)',
      'Check stock availability across multiple retailers',
      'Identify products matching budget and feature requirements'
    ],
    capabilities: [
      'Multi-site product search',
      'Filter by detailed specs',
      'Price comparison',
      'Review aggregation',
      'Stock checking',
      'Specification extraction'
    ],
    exampleOutput: 'Structured product list with specs, prices, ratings, and availability',
    manifestSnippet: {
      name: 'ProductSearchAPI',
      version: '1.0',
      functions: [
        {
          name: 'searchProducts',
          description: 'Search products across e-commerce sites',
          params: { 
            query: 'string', 
            category: 'string',
            filters: 'object (price, rating, specs)',
            limit: 'number'
          },
          returns: 'Product[]'
        },
        {
          name: 'getProductDetails',
          description: 'Get full specifications and reviews for a product',
          params: { productId: 'string' },
          returns: 'ProductDetail'
        },
        {
          name: 'compareProducts',
          description: 'Side-by-side comparison of product specifications',
          params: { productIds: 'string[]' },
          returns: 'ComparisonMatrix'
        }
      ]
    }
  },
  {
    id: 'search-api',
    name: 'Search API',
    icon: '🔍',
    description: 'Performs web searches and retrieves relevant content',
    detailedDescription: 'The Search API allows agents to query search engines programmatically, retrieving structured results instead of HTML pages. Unlike traditional search where users click links, agents can directly access titles, snippets, URLs, and metadata. This enables them to quickly scan hundreds of results, filter by relevance or date, and extract key information without rendering pages.',
    useCases: [
      'Research product reviews across multiple sites',
      'Find recent news articles on specific topics',
      'Discover competitor content and backlinks',
      'Gather data for content gap analysis'
    ],
    capabilities: [
      'Search across web',
      'Filter by date/relevance',
      'Extract snippets',
      'Get page metadata'
    ],
    exampleOutput: 'Top 10 search results with titles, URLs, and snippets',
    manifestSnippet: {
      name: 'SearchAPI',
      version: '1.0',
      functions: [
        {
          name: 'search',
          description: 'Perform a web search',
          params: { query: 'string', limit: 'number' },
          returns: 'SearchResult[]'
        }
      ]
    }
  },
  {
    id: 'keyword-tool',
    name: 'Keyword Tool',
    icon: '🎯',
    description: 'Analyzes search keywords and trends',
    detailedDescription: 'The Keyword Tool provides search volume data, competition metrics, and related keyword suggestions. Agents use this to identify high-potential keywords for SEO and content strategy. Instead of manually researching keywords in separate tools, agents can analyze thousands of terms programmatically, filtering by volume, difficulty, and relevance to find the best opportunities.',
    useCases: [
      'Identify low-competition keywords for new content',
      'Find seasonal trends to plan content calendar',
      'Discover long-tail variations of target keywords',
      'Analyze keyword gaps vs competitors'
    ],
    capabilities: [
      'Get top keywords',
      'Search volume data',
      'Keyword difficulty',
      'Related terms'
    ],
    exampleOutput: 'List of keywords with volume and competition metrics',
    manifestSnippet: {
      name: 'KeywordTool',
      version: '1.0',
      functions: [
        {
          name: 'getTopKeywords',
          description: 'Return top search keywords for a topic',
          params: { topic: 'string', region: 'string' },
          returns: 'Keyword[]'
        }
      ]
    }
  },
  {
    id: 'trends-api',
    name: 'Trends API',
    icon: '📈',
    description: 'Tracks trending topics and momentum',
    detailedDescription: 'The Trends API monitors what topics are gaining traction in real-time across search engines and social platforms. Agents use this to spot emerging opportunities before they become saturated. By tracking momentum (how fast interest is growing), regional variations, and historical patterns, agents can recommend optimal timing for content creation and campaigns.',
    useCases: [
      'Spot emerging topics for timely content creation',
      'Plan seasonal campaigns based on historical trends',
      'Identify regional variations in interest',
      'Predict which topics will spike next quarter'
    ],
    capabilities: [
      'Current trends',
      'Trend momentum',
      'Regional trends',
      'Historical data'
    ],
    exampleOutput: 'Trending topics with momentum indicators and timestamps',
    manifestSnippet: {
      name: 'TrendsAPI',
      version: '1.0',
      functions: [
        {
          name: 'getTrends',
          description: 'Get current trending topics',
          params: { region: 'string', category: 'string' },
          returns: 'Trend[]'
        }
      ]
    }
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Provides website and content analytics',
    detailedDescription: 'The Analytics tool provides access to your website and content performance data. Agents can query user behavior, traffic sources, conversion funnels, and engagement metrics to identify what\'s working and what needs improvement. Instead of manually browsing dashboards, agents can programmatically analyze patterns across thousands of pages and time periods.',
    useCases: [
      'Identify top-performing content to replicate success',
      'Find pages with high bounce rates needing optimization',
      'Analyze traffic sources to optimize marketing spend',
      'Track conversion paths to improve funnel performance'
    ],
    capabilities: [
      'Page views',
      'User behavior',
      'Traffic sources',
      'Conversion data'
    ],
    exampleOutput: 'Analytics dashboard with metrics and visualizations'
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: '👥',
    description: 'Access customer relationship data',
    detailedDescription: 'The CRM tool gives agents access to customer profiles, interaction history, and behavioral data. Agents can segment audiences, score leads, and identify patterns in customer journeys. This enables personalized recommendations and targeted campaigns based on actual customer behavior rather than assumptions.',
    useCases: [
      'Segment customers by engagement level for targeted campaigns',
      'Identify high-value leads based on behavior patterns',
      'Analyze customer journey to optimize touchpoints',
      'Find customers likely to churn for retention campaigns'
    ],
    capabilities: [
      'Customer profiles',
      'Interaction history',
      'Segmentation',
      'Lead scoring'
    ],
    exampleOutput: 'Customer segments and engagement metrics'
  },
  {
    id: 'social-monitor',
    name: 'Social Monitor',
    icon: '💬',
    description: 'Monitors social media activity',
    detailedDescription: 'The Social Monitor tracks brand mentions, engagement, and sentiment across social platforms. Agents can identify trending conversations, measure sentiment shifts, and spot potential issues or opportunities. This provides real-time social intelligence without manually monitoring multiple platforms.',
    useCases: [
      'Track brand mentions to respond to customer feedback',
      'Identify trending conversations to join relevant discussions',
      'Monitor sentiment to catch potential PR issues early',
      'Find influencers engaging with your industry topics'
    ],
    capabilities: [
      'Social mentions',
      'Engagement metrics',
      'Sentiment analysis',
      'Influencer tracking'
    ],
    exampleOutput: 'Social media metrics and trending conversations'
  },
  {
    id: 'competitor-lens',
    name: 'Competitor Lens',
    icon: '🔭',
    description: 'Analyzes competitor activity',
    detailedDescription: 'The Competitor Lens monitors your competitors\' content, campaigns, and positioning. Agents can track what topics competitors are covering, which content performs best, and identify gaps in your own strategy. This provides competitive intelligence without manual research across multiple competitor sites.',
    useCases: [
      'Identify content gaps where competitors aren\'t covering topics',
      'Analyze competitor campaigns to inform your strategy',
      'Track share of voice across different topics',
      'Spot new competitors entering your market space'
    ],
    capabilities: [
      'Competitor content',
      'Market positioning',
      'Share of voice',
      'Strategy insights'
    ],
    exampleOutput: 'Competitor analysis with content themes and performance',
    manifestSnippet: {
      name: 'CompetitorLens',
      version: '1.0',
      functions: [
        {
          name: 'getCompetitorContent',
          description: 'Fetch recent content from competitors',
          params: { competitors: 'string[]', timeframe: 'string' },
          returns: 'CompetitorPost[]'
        }
      ]
    }
  },
  {
    id: 'content-optimizer',
    name: 'Content Optimizer',
    icon: '✏️',
    description: 'Optimizes content for SEO and engagement',
    detailedDescription: 'The Content Optimizer analyzes your content and provides actionable recommendations to improve SEO rankings and user engagement. Agents can check keyword density, readability scores, meta tags, and structure to ensure content meets best practices. This automates the tedious work of manual content audits.',
    useCases: [
      'Audit existing content for SEO improvements',
      'Optimize new content before publishing',
      'Improve readability for better engagement',
      'Generate optimized meta descriptions and titles'
    ],
    capabilities: [
      'SEO recommendations',
      'Readability analysis',
      'Keyword placement',
      'Meta tag suggestions'
    ],
    exampleOutput: 'Content optimization report with actionable recommendations'
  },
  
  // === AGENTIC COMMERCE PROTOCOLS ===
  {
    id: 'mcp-protocol',
    name: 'Model Context Protocol (MCP)',
    icon: '📋',
    description: 'Standardized context sharing between AI agents and tools',
    detailedDescription: 'MCP is an interoperability standard developed by Anthropic that enables AI agents to share context, intent, and state across models and tools. Unlike static prompts or isolated API calls, MCP enables persistent, structured communication—allowing agents to retain memory, reasoning, and objectives across environments. It standardizes how developers connect LLM-based applications to tools and function calls.',
    useCases: [
      'Enable AI agents to discover and use external APIs dynamically',
      'Maintain context across multi-step workflows',
      'Allow agents to share state with other agents or tools',
      'Provide persistent memory across conversation sessions',
      'Connect LLMs to databases, services, and real-time data'
    ],
    capabilities: [
      'Tool discovery via manifests',
      'Structured context passing',
      'Cross-model interoperability',
      'Persistent agent memory',
      'Function call standardization'
    ],
    exampleOutput: 'Agent discovers available tools, calls them with structured params, maintains context across calls',
    manifestSnippet: {
      name: 'ModelContextProtocol',
      version: '1.0',
      functions: [
        {
          name: 'discoverTools',
          description: 'List available tools and their capabilities',
          params: { category: 'string' },
          returns: 'ToolManifest[]'
        },
        {
          name: 'callTool',
          description: 'Execute a tool with context',
          params: { toolId: 'string', params: 'object', context: 'Context' },
          returns: 'ToolResponse'
        }
      ]
    }
  },
  {
    id: 'a2a-protocol',
    name: 'Agent-to-Agent Protocol (A2A)',
    icon: '🤝',
    description: 'Communication protocol for autonomous agent coordination',
    detailedDescription: 'A2A is a communication protocol that empowers autonomous AI agents to coordinate, negotiate, and complete tasks directly with one another—minimizing human intervention. Built for interoperability, A2A enables agents regardless of vendor, architecture, or environment to securely exchange capabilities, status, and context through standardized protocols like JSON-RPC and HTTP.',
    useCases: [
      'Your shopping agent negotiates bundle discounts with retailer agents',
      'Travel agent coordinates with airline and hotel agents simultaneously',
      'Supply chain agents autonomously manage inventory across vendors',
      'Customer service agents escalate to specialized agents',
      'Real-time dynamic pricing negotiations between buyer/seller agents'
    ],
    capabilities: [
      'Cross-agent negotiation',
      'Dynamic capability discovery',
      'Long-running task coordination',
      'Multimodal collaboration (text, audio, visual)',
      'Secure inter-agent messaging'
    ],
    exampleOutput: 'User Agent negotiates with Retailer Agent: "Can we bundle these 3 items for 15% off?" → "Counter-offer: 12% off with free shipping"',
    manifestSnippet: {
      name: 'AgentToAgentProtocol',
      version: '1.0',
      functions: [
        {
          name: 'discoverAgents',
          description: 'Find agents with specific capabilities',
          params: { capability: 'string', trust_level: 'string' },
          returns: 'AgentProfile[]'
        },
        {
          name: 'negotiate',
          description: 'Initiate negotiation with another agent',
          params: { agentId: 'string', proposal: 'Proposal', constraints: 'Constraints' },
          returns: 'NegotiationResult'
        }
      ]
    }
  },
  {
    id: 'ap2-protocol',
    name: 'Agent Payments Protocol (AP2)',
    icon: '💳',
    description: 'Google\'s open protocol for verifiable autonomous transactions',
    detailedDescription: 'AP2 is Google\'s groundbreaking open, payment-agnostic protocol for autonomous and semi-autonomous AI agent purchases. It uses cryptographically-signed mandates that link intent, cart, and payment across users, merchants, and payment networks. This creates an audit trail that ensures transparency and accountability for every agent transaction.',
    useCases: [
      'Autonomous recurring purchases (subscriptions, replenishment)',
      'Verifiable proof that user authorized the purchase',
      'Multi-party settlement across different payment providers',
      'Fraud reduction via cryptographic intent verification',
      'Standing intents: "Buy coffee when price drops below $12"'
    ],
    capabilities: [
      'Cryptographic purchase mandates',
      'Intent-cart-payment linking',
      'Audit trail generation',
      'Cross-network settlement',
      'Standing intent automation'
    ],
    exampleOutput: 'Mandate: {user: "alice@email.com", intent: "buy_headphones", max_price: "$200", payment: "visa_****1234", signature: "0x7f3a..."}',
    manifestSnippet: {
      name: 'AgentPaymentsProtocol',
      version: '2.0',
      functions: [
        {
          name: 'createMandate',
          description: 'Create a cryptographically-signed purchase mandate',
          params: { intent: 'Intent', constraints: 'PriceConstraints', payment_method: 'PaymentMethod' },
          returns: 'SignedMandate'
        },
        {
          name: 'executeTransaction',
          description: 'Execute purchase using verified mandate',
          params: { mandate: 'SignedMandate', cart: 'Cart' },
          returns: 'TransactionReceipt'
        }
      ]
    }
  },
  {
    id: 'acp-protocol',
    name: 'Agentic Commerce Protocol (ACP)',
    icon: '🛒',
    description: 'OpenAI + Stripe protocol for in-chat purchases',
    detailedDescription: 'ACP is a protocol co-developed by OpenAI and Stripe that enables users to complete purchases within ChatGPT without leaving the chat. Combined with Shopify integration, it creates seamless agent-mediated checkout experiences. Users can browse, compare, select, and pay—all within a single conversation.',
    useCases: [
      'Complete purchases without leaving ChatGPT',
      'Agent browses Shopify catalog, builds cart, processes payment',
      'Cross-merchant cart assembly from multiple retailers',
      'Instant checkout with stored payment methods',
      'Post-purchase tracking and support in same conversation'
    ],
    capabilities: [
      'In-chat product browsing',
      'Multi-merchant cart building',
      'Stripe payment integration',
      'Shopify catalog access',
      'Order tracking & support'
    ],
    exampleOutput: 'ChatGPT: "I found 3 headphones matching your needs. The Sony WH-1000XM5 is $299 at Best Buy. Ready to checkout?" → [Pay Now button]',
    manifestSnippet: {
      name: 'AgenticCommerceProtocol',
      version: '1.0',
      functions: [
        {
          name: 'searchCatalog',
          description: 'Search products across integrated merchants',
          params: { query: 'string', filters: 'ProductFilters' },
          returns: 'Product[]'
        },
        {
          name: 'buildCart',
          description: 'Add products to agent-managed cart',
          params: { products: 'Product[]', preferences: 'UserPreferences' },
          returns: 'Cart'
        },
        {
          name: 'checkout',
          description: 'Process payment via Stripe integration',
          params: { cart: 'Cart', payment_method: 'StripePaymentMethod' },
          returns: 'Order'
        }
      ]
    }
  }
];