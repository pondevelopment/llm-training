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
  }
];
