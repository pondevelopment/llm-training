/**
 * Optimization Tips and FEED Framework
 * Based on ChatGPT Shopping insights (Oct 2025)
 * Source: SearchEngineLand - "ChatGPT Shopping is here – and it's changing ecommerce SEO rules"
 */

export interface FEEDPillar {
  id: string;
  letter: 'F' | 'E' | 'D';
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  examples: {
    winner: string[];
    failure: string[];
  };
  implementation: {
    step: string;
    detail: string;
  }[];
}

export const feedFramework: FEEDPillar[] = [
  {
    id: 'full-data',
    letter: 'F',
    title: 'Full Product Data',
    subtitle: 'Complete, consistent structured information',
    icon: '📊',
    description: 'Products with complete metadata, structured feeds, and proper identifiers consistently appear in agent results. Clean data is the foundation of visibility.',
    examples: {
      winner: [
        'Complete schema.org/Product markup (Product, Offer, AggregateRating)',
        'All variants with size, color, material, SKU clearly labeled',
        'GTIN/MPN/EAN identifiers present for product matching',
        'Real-time pricing and stock synchronization across channels',
        'Detailed specifications (dimensions, weight, materials, features)',
        'High-quality images with descriptive alt text'
      ],
      failure: [
        'Missing or incomplete product schema',
        'Ambiguous variant labels ("S" vs "Small" vs "Small (fits 5\'4"-5\'6")")',
        'Stale pricing data showing outdated promotions',
        'Incomplete specifications or missing technical details',
        'Out-of-stock items showing as available',
        'Generic or missing product identifiers'
      ]
    },
    implementation: [
      {
        step: 'Add JSON-LD Schema',
        detail: 'Implement Product, Offer, and AggregateRating schema types. Server-render schema (don\'t add via JavaScript).'
      },
      {
        step: 'Enrich Product Feeds',
        detail: 'Ensure GTIN, brand, model, variant details, and all specifications are complete and consistent.'
      },
      {
        step: 'Sync Inventory Real-Time',
        detail: 'Keep pricing, promotions, and stock levels current across all channels including product feeds.'
      },
      {
        step: 'Standardize Attributes',
        detail: 'Use consistent naming for variants (colors, sizes) and maintain structured attribute hierarchies.'
      }
    ]
  },
  {
    id: 'external-validation',
    letter: 'E',
    title: 'External Validation',
    subtitle: 'Reviews, mentions, and trust signals',
    icon: '⭐',
    description: 'Agents prioritize products with strong external proof: plentiful reviews, off-site mentions, and positive sentiment. Trust signals are crucial for ranking.',
    examples: {
      winner: [
        'High review volume across multiple platforms (Google, Yelp, Trustpilot)',
        'Recent reviews (within last 6 months) showing active engagement',
        'Mentions in credible blogs, forums, and publisher content',
        'Strong aggregate ratings (4.5+ stars) with detailed feedback',
        'User-generated content (photos, videos, testimonials)',
        'Awards, certifications, or recognition from industry sources'
      ],
      failure: [
        'Few or no reviews (thin social proof)',
        'Only reviews on owned channels (no third-party validation)',
        'Old reviews only (no recent engagement)',
        'Low ratings without response or resolution',
        'No mentions outside official website',
        'Fake or incentivized reviews that hurt credibility'
      ]
    },
    implementation: [
      {
        step: 'Encourage Customer Reviews',
        detail: 'Implement post-purchase review requests. Make leaving reviews easy with direct links and mobile-friendly forms.'
      },
      {
        step: 'Aggregate Multi-Platform Reviews',
        detail: 'Collect and display reviews from Google, Yelp, Facebook, industry platforms. Show aggregate ratings prominently.'
      },
      {
        step: 'Build Off-Site Mentions',
        detail: 'Engage with bloggers, industry publications, and forums. Provide review samples and build organic mentions.'
      },
      {
        step: 'Respond to Reviews',
        detail: 'Show active engagement by responding to both positive and negative reviews professionally and promptly.'
      }
    ]
  },
  {
    id: 'engaging-copy',
    letter: 'E',
    title: 'Engaging Copy',
    subtitle: 'Benefit-led, use-case focused descriptions',
    icon: '✍️',
    description: 'Agents echo back benefit-focused copy that explains "who this is for" and "problems solved." Move beyond specs to tell a story.',
    examples: {
      winner: [
        '"Perfect for daily commuters who need to carry a laptop safely"',
        '"Ideal for beginners learning proper form with adjustable resistance"',
        '"Designed for small apartments with folding storage and quiet operation"',
        '"Built for outdoor enthusiasts needing weatherproof durability"',
        '"Great for sensitive skin with hypoallergenic, breathable fabric"',
        'Clear use-case scenarios and customer personas in descriptions'
      ],
      failure: [
        'Specifications-only descriptions ("32GB RAM, 1TB SSD, Intel i7")',
        'Generic marketing jargon without substance',
        'Vague claims without specific benefits ("High quality," "Best value")',
        'Technical specs without explaining what they enable',
        'Missing context for who should buy or why',
        'Copy written for SEO keyword stuffing rather than humans'
      ]
    },
    implementation: [
      {
        step: 'Lead with Benefits',
        detail: 'Start descriptions with customer benefits and use-cases before listing specifications.'
      },
      {
        step: 'Define Target Personas',
        detail: 'Explicitly state "who this is for" (e.g., "perfect for 30-minute commuters," "ideal for small spaces").'
      },
      {
        step: 'Tell Problem-Solution Stories',
        detail: 'Frame products as solutions to specific customer pain points and scenarios.'
      },
      {
        step: 'Use Natural Language',
        detail: 'Write conversationally as if explaining to a friend. Agents will echo this natural phrasing back to users.'
      }
    ]
  },
  {
    id: 'dynamic-monitoring',
    letter: 'D',
    title: 'Dynamic Monitoring',
    subtitle: 'Track visibility, conversions, and adapt',
    icon: '📈',
    description: 'Agent results are volatile and change frequently. Successful products require constant monitoring, measurement, and rapid adaptation.',
    examples: {
      winner: [
        'Daily tracking of ChatGPT referral traffic (utm_source=chatgpt.com)',
        'Monitor appearance rates for key product queries',
        'Track conversion rates and visitor value from LLM sources',
        'A/B test description changes and measure impact on rankings',
        'Alert systems for sudden visibility drops',
        'Compare performance across different product categories'
      ],
      failure: [
        'Relying solely on traditional rank tracking (doesn\'t work for agent results)',
        'No distinction between agent and organic traffic sources',
        'Not tracking which product attributes agents highlight',
        'Missing conversion data specific to AI-driven traffic',
        'Slow to react to volatility (same query shows different products daily)',
        'No competitive monitoring of agent result placements'
      ]
    },
    implementation: [
      {
        step: 'Set Up LLM Traffic Tracking',
        detail: 'Configure GA4 to segment ChatGPT traffic (utm_source=chatgpt.com). Track as distinct channel.'
      },
      {
        step: 'Monitor Appearance Rates',
        detail: 'Regularly test key queries to see if and how your products appear in agent results.'
      },
      {
        step: 'Measure Conversion Quality',
        detail: 'Compare conversion rates, AOV, and customer LTV for LLM-sourced traffic vs other channels.'
      },
      {
        step: 'Build Agile Optimization Loop',
        detail: 'Test, measure, and iterate on product data, descriptions, and schema weekly based on performance data.'
      }
    ]
  }
];

export interface ConversionMetrics {
  chatgpt: {
    rate: number;
    label: string;
    source: string;
  };
  organic: {
    rate: number;
    label: string;
    source: string;
  };
  multiplier: number;
  multiplierLabel: string;
  trafficShare: string;
  trafficNote: string;
  prediction: string;
  predictionSource: string;
}

export const conversionMetrics: ConversionMetrics = {
  chatgpt: {
    rate: 15.9,
    label: 'ChatGPT Shopping',
    source: 'Seer Interactive, 2025'
  },
  organic: {
    rate: 1.8,
    label: 'Google Organic Search',
    source: 'Seer Interactive, 2025'
  },
  multiplier: 4.4,
  multiplierLabel: 'Average LLM visitor worth vs organic visitor',
  trafficShare: '<1%',
  trafficNote: 'Currently small volume for most retailers, but growing rapidly',
  prediction: 'AI search visitors predicted to surpass traditional search visitors by 2028',
  predictionSource: 'Semrush, 2025'
};

export interface Limitation {
  id: string;
  title: string;
  icon: string;
  problem: string;
  cause: string;
  impact: string;
  mitigation: string;
  severity: 'high' | 'medium' | 'low';
}

export const commonLimitations: Limitation[] = [
  {
    id: 'variant-confusion',
    title: 'Variant Mismatch',
    icon: '🔀',
    problem: 'User asks for "black sneakers" but receives navy blue. "King-size sheets" returns California King.',
    cause: 'Inconsistent color naming across products, vague variant data, or ambiguous size standards.',
    impact: 'Customer frustration, lost trust, product returns, negative reviews, abandoned purchases.',
    mitigation: 'Standardize variant attributes (use hex codes for colors, explicit size measurements). Test common queries to verify accuracy.',
    severity: 'high'
  },
  {
    id: 'price-stock-lag',
    title: 'Price & Stock Lag',
    icon: '💰',
    problem: 'Displayed price misses active promotions. Stock shows "available" but customer finds "out of stock" on click.',
    cause: 'Delayed feed updates, cached pricing data, or disconnect between display and inventory systems.',
    impact: 'Broken customer trust, wasted traffic, lost conversions, damaged brand reputation.',
    mitigation: 'Implement real-time inventory sync. Update product feeds multiple times daily. Use webhooks for instant stock updates.',
    severity: 'high'
  },
  {
    id: 'result-volatility',
    title: 'Result Volatility',
    icon: '📉',
    problem: 'Same query returns completely different product sets hours apart. Your product appears, then disappears without changes.',
    cause: 'Agents continuously learn and adjust rankings. Format changes, new data sources, algorithm updates.',
    impact: 'Unpredictable traffic, unreliable forecasting, difficult to measure optimization effectiveness.',
    mitigation: 'Monitor appearance rates daily, not weekly. Focus on aggregate visibility trends over time rather than instant rankings.',
    severity: 'medium'
  },
  {
    id: 'limited-slots',
    title: 'Limited Result Slots',
    icon: '🎯',
    problem: 'Agents show only 3-6 products per query. Not in shortlist = invisible. No "page 2" of results.',
    cause: 'Agentic search optimizes for concise, curated recommendations rather than long result lists.',
    impact: 'Winner-take-all dynamics. Highly competitive. Small differences have outsized effects on visibility.',
    mitigation: 'Focus on winning position for your core queries. Optimize for niche, specific queries where you can rank #1.',
    severity: 'high'
  }
];

export interface VerticalPattern {
  id: string;
  name: string;
  icon: string;
  trafficPattern: string;
  conversionPattern: string;
  keyFactors: string[];
  example: string;
}

export const verticalPatterns: VerticalPattern[] = [
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    icon: '💻',
    trafficPattern: 'Highest volume - rising fastest',
    conversionPattern: 'Above average (5-8%)',
    keyFactors: [
      'Strong product data feeds (specs critical)',
      'Robust review ecosystems',
      'Technical detail matters for agent reasoning',
      'Clear model numbers and compatibility info'
    ],
    example: 'Smart home cameras, laptops, audio equipment perform well with complete spec sheets.'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: '👗',
    trafficPattern: 'Lower volume',
    conversionPattern: 'Highest conversion (10-15%) - very qualified traffic',
    keyFactors: [
      'Visual style harder for agents to convey',
      'Fit and sizing critical (detailed guides help)',
      'Use-case descriptions ("perfect for office wear")',
      'Material and care instructions boost trust'
    ],
    example: 'When agents recommend specific dresses or robes, buyers are very close to purchase decision.'
  },
  {
    id: 'food-grocery',
    name: 'Food & Grocery',
    icon: '🛒',
    trafficPattern: 'Moderate, steady volume',
    conversionPattern: 'Strong repeat behavior',
    keyFactors: [
      'Dietary restrictions and preferences',
      'Subscription and recurring purchase intent',
      'Clear ingredient lists and allergen info',
      'Freshness and delivery guarantees'
    ],
    example: 'Specific dietary searches ("grass-fed beef box," "healthy snack subscription") convert well.'
  }
];
