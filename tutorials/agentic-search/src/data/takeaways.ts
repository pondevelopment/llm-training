export interface Takeaway {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const takeaways: Takeaway[] = [
  {
    id: 1,
    icon: '🔄',
    title: 'Agentic Search is Goal-Oriented',
    description: 'Unlike traditional search that returns documents, agentic search actively works toward a goal—planning steps, discovering tools, and synthesizing answers.'
  },
  {
    id: 2,
    icon: '🧰',
    title: 'Agents Extend Themselves via Tools',
    description: 'Agents aren\'t limited to their training data. They discover and use external APIs, databases, and services to access real-time information and specialized capabilities.'
  },
  {
    id: 3,
    icon: '📋',
    title: 'MCP Enables Tool Discovery',
    description: 'The Model Context Protocol provides a standardized way for agents to discover what tools exist and how to use them—like a universal API directory.'
  },
  {
    id: 4,
    icon: '🎯',
    title: 'Planning is Core to Agentic Behavior',
    description: 'Agents break complex goals into sub-tasks, decide which tools to use, execute workflows, and iterate based on results—just like a human researcher would.'
  },
  {
    id: 5,
    icon: '🔗',
    title: 'Traceability Builds Trust',
    description: 'Good agentic systems show their work—revealing which tools were called, what data was retrieved, and how conclusions were reached. This transparency is crucial for trust.'
  },
  {
    id: 6,
    icon: '🚀',
    title: 'Agent-Friendly Design Matters',
    description: 'Services that publish MCP manifests, structure data clearly, and provide good documentation will be more discoverable and useful to agents—opening new distribution channels.'
  },
  {
    id: 7,
    icon: '🎯',
    title: 'Optimize Early for 4-9× Returns',
    description: 'Agentic search delivers 15.9% conversion rates vs 1.8% for traditional search. Use the FEED framework (Full data, External validation, Engaging copy, Dynamic monitoring) to capture this opportunity before markets mature.'
  }
];
