export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
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
    id: 'search-api',
    name: 'Search API',
    icon: '🔍',
    description: 'Performs web searches and retrieves relevant content',
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
    capabilities: [
      'SEO recommendations',
      'Readability analysis',
      'Keyword placement',
      'Meta tag suggestions'
    ],
    exampleOutput: 'Content optimization report with actionable recommendations'
  }
];
