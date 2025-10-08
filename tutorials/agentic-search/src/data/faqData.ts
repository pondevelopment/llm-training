export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What exactly is agentic search?',
    answer: 'Agentic search is a paradigm where AI agents actively plan, discover tools, execute multi-step research workflows, and synthesize results—rather than just returning a list of links. Instead of "here are 10 relevant documents," agentic search delivers "here\'s the answer, and here\'s how I found it by calling these APIs and analyzing this data."'
  },
  {
    id: 2,
    question: 'How is this different from ChatGPT or traditional search engines?',
    answer: 'Traditional search engines return ranked documents. ChatGPT (without plugins/tools) generates answers from training data. Agentic search combines both: it uses LLMs for reasoning and planning, but actively discovers and calls external tools (APIs, databases, search engines) to get fresh, real-time data. It\'s less about "what the model knows" and more about "what the agent can orchestrate."'
  },
  {
    id: 3,
    question: 'What is the Model Context Protocol (MCP)?',
    answer: 'MCP is an open standard that allows AI agents to discover and interact with tools in a standardized way. Instead of hard-coding integrations for every API, agents can query a .well-known/mcp.json manifest to learn what tools are available, what parameters they accept, and how to call them. Think of it as a "menu" that agents can read to discover new capabilities.'
  },
  {
    id: 4,
    question: 'Do I need to build my own agent to use agentic search?',
    answer: 'Not necessarily! Many platforms (like Perplexity, SearchGPT, and emerging agent frameworks) already provide agentic search capabilities. However, if you\'re building a product or service, understanding these concepts helps you design "agent-friendly" APIs—making your tools discoverable via MCP manifests and structuring data for easy agent consumption.'
  },
  {
    id: 5,
    question: 'How can I make my API or service agent-friendly?',
    answer: 'Three key steps: (1) Publish a .well-known/mcp.json manifest describing your API endpoints, parameters, and capabilities. (2) Structure your API responses in clean, parseable formats (JSON is ideal). (3) Provide clear documentation with examples—agents learn from context just like humans do. The easier you make it for agents to discover and use your service, the more traffic and integrations you\'ll attract.'
  },
  {
    id: 6,
    question: 'What tools do agents typically use?',
    answer: 'Common tool categories include: (1) Search engines for general queries, (2) Specialized databases (product catalogs, research papers), (3) APIs for real-time data (weather, stock prices, trends), (4) Analysis tools (sentiment analysis, summarization), (5) Code execution environments, and (6) Domain-specific services (e.g., bike specs, recipe databases). The toolbox grows as more services become agent-accessible.'
  },
  {
    id: 7,
    question: 'How do agents decide which tools to use?',
    answer: 'Agents use a combination of planning, reasoning, and tool discovery. First, they break down the user\'s goal into sub-tasks. Then, they search for available tools (via MCP manifests or built-in registries) that match those sub-tasks. They evaluate tool descriptions, required parameters, and past success rates to choose the best fit. Finally, they execute calls, analyze results, and iterate if needed.'
  },
  {
    id: 8,
    question: 'Is agentic search only for technical users?',
    answer: 'Not at all! Agentic search is designed to make complex research accessible to everyone. Users interact with natural language—the agent handles the technical complexity of planning workflows, calling APIs, and synthesizing data. The goal is to democratize access to powerful research capabilities without requiring coding or API knowledge.'
  },
  {
    id: 9,
    question: 'What are the limitations of agentic search?',
    answer: 'Key limitations include: (1) Cost—multiple LLM calls and API requests add up. (2) Latency—multi-step workflows take longer than single queries. (3) Reliability—agents can make mistakes in planning or tool selection. (4) Tool availability—if the right tools aren\'t discoverable, results suffer. (5) Context limits—agents have finite memory and may lose track in very complex workflows. These challenges are actively being addressed as the field matures.'
  },
  {
    id: 10,
    question: 'Where can I learn more or try building an agent?',
    answer: 'Great resources include: (1) Anthropic\'s Claude with tools documentation, (2) OpenAI\'s function calling guides, (3) LangChain and LlamaIndex frameworks for agent orchestration, (4) The Model Context Protocol spec at modelcontextprotocol.io, (5) Open-source agent projects on GitHub (AutoGPT, BabyAGI), and (6) Community forums like r/LocalLLaMA and agent-focused Discord servers. Start small—build an agent that uses 2-3 tools to solve a specific problem, then expand from there.'
  }
];
