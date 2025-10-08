export interface ScenarioStep {
  id: number;
  title: string;
  icon: string;
  description: string;
  toolUsed?: string;
  toolIcon?: string;
  reasoning: string;
  dataReturned: string[];
  insights?: string[];
  duration: string;
}

export const q4ContentScenario: ScenarioStep[] = [
  {
    id: 1,
    title: 'Understand Goal & Plan',
    icon: '🎯',
    description: 'Agent analyzes the user request and breaks it into research sub-tasks',
    reasoning: 'User asked: "Help me plan Q4 content strategy for our bike shop." Agent identifies this requires trend analysis, keyword research, and competitive intelligence.',
    dataReturned: [
      '📋 Sub-tasks identified:',
      '1. Find trending Q4 bike topics',
      '2. Identify high-value keywords',
      '3. Analyze competitor content gaps',
      '4. Generate content calendar'
    ],
    duration: '2s'
  },
  {
    id: 2,
    title: 'Discover Trending Topics',
    icon: '📈',
    toolUsed: 'Trends API',
    toolIcon: '📈',
    description: 'Agent calls Trends API to find what bike topics are gaining momentum',
    reasoning: 'Need current trends to ensure content is timely and relevant. Trends API can show seasonal patterns and emerging interests.',
    dataReturned: [
      '🔥 Trending topics (Oct-Dec):',
      '• "Winter bike maintenance" (+127% searches)',
      '• "Indoor cycling setups" (+89% searches)',
      '• "Holiday bike gift guides" (+201% searches)',
      '• "E-bike winter riding tips" (+64% searches)'
    ],
    insights: ['Winter maintenance content', 'Holiday gift guides', 'Indoor training content'],
    duration: '3s'
  },
  {
    id: 3,
    title: 'Research Keywords',
    icon: '🎯',
    toolUsed: 'Keyword Tool',
    toolIcon: '🎯',
    description: 'Agent queries Keyword Tool for search volume and competition data',
    reasoning: 'Found trending topics, now need to identify specific keywords with good search volume but manageable competition.',
    dataReturned: [
      '🔑 High-opportunity keywords:',
      '• "best winter bike lights" (2.4k/mo, Low comp)',
      '• "indoor bike trainer setup" (3.1k/mo, Medium comp)',
      '• "bike gifts under $100" (5.8k/mo, High comp)',
      '• "e-bike cold weather tips" (890/mo, Low comp)'
    ],
    insights: ['Target "winter bike lights"', 'Focus on "indoor trainer" content', 'E-bike winter niche opportunity'],
    duration: '4s'
  },
  {
    id: 4,
    title: 'Analyze Competitors',
    icon: '🔍',
    toolUsed: 'Competitor Lens',
    toolIcon: '🔍',
    description: 'Agent checks what competitors are publishing and finds content gaps',
    reasoning: 'Before creating content, need to see what competitors are doing and identify underserved topics.',
    dataReturned: [
      '🏆 Competitor analysis:',
      '• BikeShopX: Strong holiday gift coverage',
      '• CycleHub: Lacks winter maintenance guides',
      '• PedalPro: No indoor trainer comparisons',
      '• Gap found: "Winter commuter bike setup checklist"'
    ],
    insights: ['Winter maintenance guide opportunity', 'Indoor trainer comparison gap', 'Commuter-focused content missing'],
    duration: '5s'
  },
  {
    id: 5,
    title: 'Refine & Iterate',
    icon: '🔄',
    description: 'Agent cross-references data to identify best opportunities',
    reasoning: 'Combine trend data, keyword volume, and competitor gaps to prioritize content ideas that have the highest potential.',
    dataReturned: [
      '✨ Top content opportunities:',
      '1. "Complete Winter Bike Maintenance Guide" (High trend + Low comp)',
      '2. "Indoor Trainer Buying Guide 2024" (Good volume + Gap)',
      '3. "E-Bike Winter Riding: Essential Tips" (Emerging trend + No comp)',
      '4. "Holiday Bike Gift Guide Under $150" (Huge volume + Can differentiate)'
    ],
    insights: ['Winter maintenance is #1 priority', 'Indoor trainer guide fills gap', 'E-bike winter content is blue ocean', 'Gift guide needs unique angle'],
    duration: '3s'
  },
  {
    id: 6,
    title: 'Synthesize Plan',
    icon: '✨',
    description: 'Agent delivers a complete Q4 content calendar with rationale',
    reasoning: 'Package all insights into an actionable content plan with timeline, topics, and expected impact.',
    dataReturned: [
      '📅 Q4 Content Calendar:',
      '',
      '🗓️ October:',
      '• "Complete Winter Bike Maintenance Guide" (Oct 15)',
      '  → Target: 2.4k monthly searches, low competition',
      '  → Gap: Competitors lack comprehensive guides',
      '',
      '🗓️ November:',
      '• "Indoor Trainer Buying Guide 2024" (Nov 1)',
      '  → Target: 3.1k monthly searches',
      '  → Gap: No recent comparison content from competitors',
      '• "E-Bike Winter Riding: 7 Essential Tips" (Nov 20)',
      '  → Target: 890 monthly searches, emerging trend (+64%)',
      '  → Gap: Completely underserved niche',
      '',
      '🗓️ December:',
      '• "Ultimate Bike Gift Guide: Unique Finds Under $150" (Dec 1)',
      '  → Target: 5.8k monthly searches',
      '  → Angle: Focus on unique/local items vs generic lists',
      '',
      '💡 Expected Results:',
      '• Estimated 11k+ monthly organic visits',
      '• 4 high-quality content pieces',
      '• Competitive advantage in 3 underserved topics'
    ],
    duration: '2s'
  }
];

// For traceability feature - maps final insights to steps
export const insightTraceMap = {
  'Winter maintenance is #1 priority': [2, 3, 4],
  'Indoor trainer guide fills gap': [2, 3, 4],
  'E-bike winter content is blue ocean': [2, 3, 4],
  'Gift guide needs unique angle': [2, 4]
};
