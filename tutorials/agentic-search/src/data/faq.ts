export interface FAQItem {
  question: string;
  answer: string;
}

export const faq: FAQItem[] = [
  {
    question: 'How can my brand be more agent-friendly?',
    answer: 'Provide structured content and, if you offer APIs, publish an MCP manifest under /.well-known so agents can discover your capabilities. Make your data machine-readable with clear schemas and documentation.'
  },
  {
    question: 'Do I need to know how to code to use agentic search?',
    answer: 'No—this tutorial focuses on concepts. Agents and manifests help hide technical details behind simple capabilities. You just need to understand what agents can do and how to guide them toward your goals.'
  },
  {
    question: 'What is MCP and why does it matter?',
    answer: 'Model Context Protocol (MCP) is a standard that describes how tools tell agents what they can do. It makes tool discovery automatic and reduces integration friction, similar to how RSS made content syndication simple.'
  },
  {
    question: 'How is agentic search different from traditional search?',
    answer: 'Traditional search returns links that you must review and synthesize yourself. Agentic search uses AI agents to plan multi-step research, call multiple tools, iterate on findings, and deliver a synthesized answer tailored to your goal.'
  },
  {
    question: 'Can agents really plan and make decisions?',
    answer: 'Modern AI agents can break down goals, select appropriate tools, and adapt their approach based on results. They work more like a research assistant than a simple search engine, though they still require clear instructions and oversight.'
  },
  {
    question: 'What are .well-known manifests?',
    answer: '.well-known is a standard path convention (like .well-known/robots.txt) where tools publish manifests describing their capabilities. Agents check this location to auto-discover what a tool can do without manual configuration.'
  },
  {
    question: 'Is this technology available today?',
    answer: 'Yes! Many AI systems already use agent-like workflows internally. MCP and standardized manifests are emerging standards that will make these capabilities more accessible and interoperable across platforms.'
  },
  {
    question: 'How do I get started with agentic search?',
    answer: 'Start by understanding how agents think (plan → discover → execute → synthesize). Then explore platforms that offer agentic capabilities, and consider how your own data and services could be made more agent-friendly.'
  },
  {
    question: 'How do I optimize for agentic search?',
    answer: 'Focus on the FEED framework: Full product data (complete specs, GTINs, variants), External validation (reviews, ratings, trust signals), Engaging copy (benefit-led descriptions), and Dynamic monitoring (track conversions and adapt). Agentic search converts 4-9× higher than traditional search, but requires structured, comprehensive data.'
  }
];

export interface Takeaway {
  icon: string;
  title: string;
  description: string;
}

export const takeaways: Takeaway[] = [
  {
    icon: '🤖',
    title: 'Agents Are Assistants',
    description: 'AI agents work like research assistants: they plan, discover tools, execute tasks, and synthesize findings into goal-oriented answers.'
  },
  {
    icon: '🔧',
    title: 'Tools Extend Capabilities',
    description: 'Agents become powerful by connecting to external tools and APIs. Each tool adds new capabilities the agent can leverage.'
  },
  {
    icon: '📋',
    title: 'MCP Enables Discovery',
    description: 'Model Context Protocol (MCP) standardizes how tools describe their capabilities, making automatic discovery possible.'
  },
  {
    icon: '🗺️',
    title: '.well-known Makes It Easy',
    description: 'Publishing manifests at .well-known/mcp/manifest.json lets agents auto-discover your tool\'s capabilities without manual configuration.'
  },
  {
    icon: '🔄',
    title: 'Iteration Improves Results',
    description: 'Agents can refine their approach based on intermediate results, making multi-step workflows more effective than one-shot queries.'
  },
  {
    icon: '🎯',
    title: 'Make Your Services Agent-Friendly',
    description: 'To participate in the agentic ecosystem, provide structured data, clear APIs, and publish MCP manifests for your capabilities.'
  }
];
