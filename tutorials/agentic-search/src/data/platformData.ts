/**
 * Platform-specific data for AI search assistants
 * 
 * Defines which search APIs, feeds, and optimization strategies
 * are needed for each major AI chat platform.
 */

export interface SearchPlatform {
  id: string;
  name: string;
  provider: string;
  icon: string;
  color: string; // Hex color for branding
  marketShare: string;
  status: 'active' | 'beta' | 'planned' | 'limited';
  
  // Search backend
  searchAPI: string;
  searchProvider: string;
  apiUsageRate?: string; // e.g., "92%" for ChatGPT→Bing
  
  // Shopping capabilities
  shoppingEnabled: boolean;
  agentMode: boolean; // Can it autonomously complete transactions?
  
  // Feed requirements
  productFeed: {
    name: string; // "Bing Shopping", "Google Merchant Center", etc.
    required: boolean;
    url: string;
    submitUrl: string;
  };
  
  // Optimization priorities
  rankingFactors: string[];
  
  // Testing
  testingURL: string; // Base URL for the platform
  utmSource: string; // For tracking (e.g., "chatgpt.com")
  
  // Documentation
  docsUrl: string;
  webmasterTools?: string;
}

export const searchPlatforms: SearchPlatform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    icon: '🤖',
    color: '#10a37f',
    marketShare: '~75%',
    status: 'active',
    
    searchAPI: 'Bing Search API',
    searchProvider: 'Microsoft Bing',
    apiUsageRate: '92%',
    
    shoppingEnabled: true,
    agentMode: true,
    
    productFeed: {
      name: 'Bing Shopping',
      required: true,
      url: 'https://www.bing.com/webmasters/shopping',
      submitUrl: 'https://www.bing.com/webmasters/shopping'
    },
    
    rankingFactors: [
      'First position dominance (63% select #1 result)',
      'Structured product data (JSON-LD schema)',
      'Clear variant labeling',
      'Real-time pricing and stock',
      'Bing Shopping feed presence',
      'Accessibility (no CAPTCHA, no bot blocks)'
    ],
    
    testingURL: 'https://chatgpt.com',
    utmSource: 'chatgpt.com',
    
    docsUrl: 'https://help.openai.com/en/articles/9774015-how-to-search-using-chatgpt',
    webmasterTools: 'https://www.bing.com/webmasters'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    provider: 'Google',
    icon: '✨',
    color: '#4285f4',
    marketShare: '~15%',
    status: 'active',
    
    searchAPI: 'Google Search',
    searchProvider: 'Google',
    
    shoppingEnabled: true,
    agentMode: false, // No autonomous checkout yet
    
    productFeed: {
      name: 'Google Merchant Center',
      required: true,
      url: 'https://merchants.google.com',
      submitUrl: 'https://merchants.google.com/mc/products/feeds'
    },
    
    rankingFactors: [
      'Google Shopping feed quality',
      'Product structured data (schema.org)',
      'Google Search ranking signals',
      'Reviews and ratings (Google Reviews)',
      'Mobile optimization',
      'Core Web Vitals',
      'E-E-A-T signals'
    ],
    
    testingURL: 'https://gemini.google.com',
    utmSource: 'gemini.google.com',
    
    docsUrl: 'https://support.google.com/gemini',
    webmasterTools: 'https://search.google.com/search-console'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    icon: '🔮',
    color: '#20808d',
    marketShare: '~5%',
    status: 'active',
    
    searchAPI: 'Multiple APIs',
    searchProvider: 'Bing, Google, others',
    
    shoppingEnabled: true,
    agentMode: false,
    
    productFeed: {
      name: 'Multiple feeds',
      required: false,
      url: 'https://www.perplexity.ai',
      submitUrl: 'N/A'
    },
    
    rankingFactors: [
      'Both Bing and Google optimization',
      'Citation-friendly content structure',
      'Recent content (favors fresh data)',
      'Direct answers in structured format',
      'Academic and authoritative sources'
    ],
    
    testingURL: 'https://www.perplexity.ai',
    utmSource: 'perplexity.ai',
    
    docsUrl: 'https://www.perplexity.ai/hub/faq'
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    icon: '🧠',
    color: '#d97757',
    marketShare: '~3%',
    status: 'limited',
    
    searchAPI: 'None (currently)',
    searchProvider: 'No web search',
    
    shoppingEnabled: false,
    agentMode: false,
    
    productFeed: {
      name: 'N/A',
      required: false,
      url: 'https://claude.ai',
      submitUrl: 'N/A'
    },
    
    rankingFactors: [
      'No product search capabilities yet',
      'May integrate search in future updates'
    ],
    
    testingURL: 'https://claude.ai',
    utmSource: 'claude.ai',
    
    docsUrl: 'https://support.anthropic.com'
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    provider: 'Microsoft',
    icon: '🪟',
    color: '#0078d4',
    marketShare: '~2%',
    status: 'active',
    
    searchAPI: 'Bing Search API',
    searchProvider: 'Microsoft Bing',
    
    shoppingEnabled: true,
    agentMode: false,
    
    productFeed: {
      name: 'Bing Shopping',
      required: true,
      url: 'https://www.bing.com/webmasters/shopping',
      submitUrl: 'https://www.bing.com/webmasters/shopping'
    },
    
    rankingFactors: [
      'Same as Bing/ChatGPT (shared backend)',
      'Bing Shopping feed critical',
      'Structured data via JSON-LD',
      'Microsoft 365 integration advantages'
    ],
    
    testingURL: 'https://copilot.microsoft.com',
    utmSource: 'copilot.microsoft.com',
    
    docsUrl: 'https://support.microsoft.com/copilot',
    webmasterTools: 'https://www.bing.com/webmasters'
  }
];

/**
 * Universal optimization principles that work across all platforms
 */
export interface UniversalPrinciple {
  id: string;
  principle: string;
  icon: string;
  description: string;
  whyItMatters: string;
  implementations: {
    platform: string; // 'all' or specific platform id
    steps: string[];
  }[];
}

export const universalPrinciples: UniversalPrinciple[] = [
  {
    id: 'structured-data',
    principle: 'Structured Product Data',
    icon: '📊',
    description: 'All AI platforms rely on machine-readable product information. Structured data (JSON-LD, schema.org) helps agents extract accurate specs, pricing, and availability.',
    whyItMatters: 'Agents can\'t interpret visual layouts—they need explicit data structures to understand products.',
    implementations: [
      {
        platform: 'all',
        steps: [
          'Add Product schema with @type: "Product"',
          'Include name, description, brand, sku, gtin',
          'Embed Offer with price, priceCurrency, availability',
          'Add AggregateRating if you have reviews',
          'Validate with schema.org validator'
        ]
      }
    ]
  },
  {
    id: 'feed-optimization',
    principle: 'Product Feed Quality',
    icon: '📋',
    description: 'Whether Bing Shopping or Google Merchant Center, feed quality determines visibility. Complete, accurate feeds with rich attributes rank higher.',
    whyItMatters: 'Incomplete feeds get filtered out. Agents query feed APIs directly—not your website HTML.',
    implementations: [
      {
        platform: 'chatgpt',
        steps: [
          'Submit to Bing Merchant Center',
          'Ensure GTIN, brand, price, stock accuracy',
          'Use clear variant attributes (size: "Large" not "L")',
          'Update feed daily (pricing, stock changes)',
          'Monitor Bing Webmaster Tools for errors'
        ]
      },
      {
        platform: 'gemini',
        steps: [
          'Submit to Google Merchant Center',
          'Complete all required attributes (GTIN, MPN, condition)',
          'Optimize titles: Brand + Type + Key Feature',
          'Add rich product images (multiple angles)',
          'Monitor Merchant Center diagnostics'
        ]
      }
    ]
  },
  {
    id: 'accessibility',
    principle: 'Agent Accessibility',
    icon: '🔓',
    description: 'Remove barriers that block autonomous agents: CAPTCHAs, aggressive bot detection, mandatory registration, complex JavaScript-dependent flows.',
    whyItMatters: 'Agents browse in text-only mode. If they can\'t reach checkout, they can\'t recommend your products.',
    implementations: [
      {
        platform: 'all',
        steps: [
          'Allow text-based browser agents (check User-Agent whitelisting)',
          'Offer guest checkout (no forced registration)',
          'Make product pages accessible without JavaScript',
          'Disable CAPTCHA on product/checkout pages',
          'Use semantic HTML for forms (proper labels, validation)'
        ]
      }
    ]
  },
  {
    id: 'conversion-friction',
    principle: 'Minimal Conversion Friction',
    icon: '✅',
    description: 'Agents have high abandonment rates. Every extra step, pop-up, or form field reduces conversion probability.',
    whyItMatters: '17% agent conversion vs 1.8% organic means agents are 9x better at intent—but fragile at execution.',
    implementations: [
      {
        platform: 'all',
        steps: [
          'Simplify checkout: minimize form fields',
          'Delay pop-ups (10+ seconds after page load)',
          'Make pop-ups keyboard dismissible (ESC key)',
          'Extend session timeouts (30+ minutes)',
          'Use autofill-friendly input names (autocomplete attributes)'
        ]
      }
    ]
  },
  {
    id: 'tracking',
    principle: 'Agent Traffic Attribution',
    icon: '📈',
    description: 'Traditional analytics miss agent traffic. Use server-side tracking, UTM parameters, and bot log analysis to measure agent visits.',
    whyItMatters: 'Can\'t optimize what you can\'t measure. Agent traffic often appears as "direct" with no attribution.',
    implementations: [
      {
        platform: 'all',
        steps: [
          'Use server-side analytics (bypasses JS blockers)',
          'Add UTM parameters: utm_source=chatgpt.com (or gemini, etc.)',
          'Monitor bot logs for agent User-Agent patterns',
          'Track conversion paths (product view → cart → checkout)',
          'Set up GA4 custom events for agent funnel stages'
        ]
      }
    ]
  }
];

/**
 * Platform comparison metrics for quick reference
 */
export interface PlatformComparison {
  metric: string;
  chatgpt: string;
  gemini: string;
  perplexity: string;
  copilot: string;
  claude: string;
}

export const platformComparisons: PlatformComparison[] = [
  {
    metric: 'Shopping Enabled',
    chatgpt: '✅ Yes',
    gemini: '✅ Yes',
    perplexity: '✅ Yes',
    copilot: '✅ Yes',
    claude: '❌ No'
  },
  {
    metric: 'Agent Mode (Autonomous)',
    chatgpt: '✅ Yes',
    gemini: '❌ No',
    perplexity: '❌ No',
    copilot: '❌ No',
    claude: '❌ No'
  },
  {
    metric: 'Search Backend',
    chatgpt: 'Bing API',
    gemini: 'Google Search',
    perplexity: 'Multiple',
    copilot: 'Bing API',
    claude: 'None'
  },
  {
    metric: 'Required Feed',
    chatgpt: 'Bing Shopping',
    gemini: 'Google Merchant',
    perplexity: 'Multiple',
    copilot: 'Bing Shopping',
    claude: 'N/A'
  },
  {
    metric: 'Market Share',
    chatgpt: '~75%',
    gemini: '~15%',
    perplexity: '~5%',
    copilot: '~2%',
    claude: '~3%'
  },
  {
    metric: 'Webmaster Tools',
    chatgpt: 'Bing Webmaster',
    gemini: 'Search Console',
    perplexity: 'Both',
    copilot: 'Bing Webmaster',
    claude: 'N/A'
  }
];

/**
 * Get platform by ID
 */
export function getPlatform(id: string): SearchPlatform | undefined {
  return searchPlatforms.find(p => p.id === id);
}

/**
 * Get active shopping platforms
 */
export function getActiveShoppingPlatforms(): SearchPlatform[] {
  return searchPlatforms.filter(p => p.shoppingEnabled && p.status === 'active');
}

/**
 * Get platforms using specific search provider
 */
export function getPlatformsBySearchProvider(provider: string): SearchPlatform[] {
  return searchPlatforms.filter(p => 
    p.searchProvider.toLowerCase().includes(provider.toLowerCase())
  );
}
