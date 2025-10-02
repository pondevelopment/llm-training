export interface ScenarioStep {
  id: number;
  title: string;
  description: string;
  toolUsed?: string;
  reasoning: string;
  dataReturned?: {
    type: string;
    items: Array<{ label: string; value: string | number; }>;
  };
  notes?: string[];
}

export const scenarioSteps: ScenarioStep[] = [
  {
    id: 1,
    title: 'Agent Plans Sub-Tasks',
    description: 'The agent breaks down "Plan Q4 content strategy" into manageable sub-tasks',
    reasoning: 'Complex goals need to be decomposed into actionable steps',
    notes: [
      'Identify trending topics',
      'Find high-value keywords',
      'Analyze competitor content',
      'Create content outline'
    ]
  },
  {
    id: 2,
    title: 'Discover & Call TrendsAPI',
    description: 'Agent discovers TrendsAPI via .well-known manifest and calls getTrends()',
    toolUsed: 'trends-api',
    reasoning: 'Need current market trends to ensure content relevance',
    dataReturned: {
      type: 'Trends',
      items: [
        { label: 'Short-form video content', value: '↑ High momentum' },
        { label: 'AI-powered workflows', value: '↑ Growing' },
        { label: 'Sustainability marketing', value: '→ Stable' }
      ]
    }
  },
  {
    id: 3,
    title: 'Discover & Call KeywordTool',
    description: 'Agent discovers KeywordTool and calls getTopKeywords() for identified trends',
    toolUsed: 'keyword-tool',
    reasoning: 'Need keyword data to optimize content for search',
    dataReturned: {
      type: 'Keywords',
      items: [
        { label: '"how to create short videos"', value: '5,400 searches/mo' },
        { label: '"AI marketing automation"', value: '3,200 searches/mo' },
        { label: '"green marketing strategies"', value: '2,100 searches/mo' }
      ]
    }
  },
  {
    id: 4,
    title: 'Analyze Competitors',
    description: 'Agent uses CompetitorLens to see what competitors are publishing',
    toolUsed: 'competitor-lens',
    reasoning: 'Understanding competitor content helps identify gaps and opportunities',
    dataReturned: {
      type: 'Competitor Content',
      items: [
        { label: 'Competitor A', value: '3 posts on short-form video' },
        { label: 'Competitor B', value: '2 posts on AI workflows' },
        { label: 'Competitor C', value: '1 post on sustainability' }
      ]
    }
  },
  {
    id: 5,
    title: 'Refine & Iterate',
    description: 'Agent refines strategy based on data, adjusting focus and parameters',
    reasoning: 'Initial data suggests adjustments needed for better targeting',
    notes: [
      'Focus on European market (less competition)',
      'Emphasize B2B angle for AI workflows',
      'Combine video + sustainability themes',
      'Target decision-makers in tech sector'
    ]
  },
  {
    id: 6,
    title: 'Synthesize Content Plan',
    description: 'Agent combines all insights into actionable Q4 content plan',
    reasoning: 'All sub-tasks complete; ready to deliver comprehensive strategy',
    dataReturned: {
      type: 'Content Plan',
      items: [
        { label: 'Topics', value: '3 pillar topics identified' },
        { label: 'Channels', value: 'Blog, LinkedIn, YouTube' },
        { label: 'Cadence', value: '2 posts/week' },
        { label: 'Target Keywords', value: '12 primary + 24 secondary' }
      ]
    }
  }
];
