/**
 * Pre-defined exercises for each section
 * Separated from ExerciseCard.tsx to preserve React Fast Refresh
 */

export interface ExerciseData {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  hint?: string;
  showInput?: boolean;
  placeholder?: string;
}

export const sectionExercises: Record<string, ExerciseData> = {
  intro: {
    id: 'ex-intro',
    title: 'Apply to Your Use Case',
    prompt: 'Think of a search task you do regularly. How would it differ if an AI agent handled it for you? What would you want it to accomplish autonomously?',
    icon: '🔍',
    hint: 'Consider tasks like product research, travel planning, or competitive analysis.',
    showInput: true,
    placeholder: 'Example: When I research competitors, I want an agent to...',
  },
  scenario: {
    id: 'ex-scenario',
    title: 'Identify Your Best Scenario',
    prompt: 'Which of the 6 scenarios is most relevant to your business or work? List 2-3 ways agentic search could improve that workflow.',
    icon: '🎯',
    hint: 'Think about where you currently spend the most time on manual research.',
    showInput: true,
    placeholder: 'The most relevant scenario for me is...',
  },
  toolbox: {
    id: 'ex-toolbox',
    title: 'Design Your Agent Toolbox',
    prompt: 'If you could give an AI agent 3 tools to help with your work, what would they be? What data would each tool access?',
    icon: '🧰',
    hint: 'Think about APIs, databases, or services you wish you could query automatically.',
    showInput: true,
    placeholder: 'Tool 1: [Name] - Accesses [data type]\nTool 2: ...',
  },
  mcp: {
    id: 'ex-mcp',
    title: 'Check Your Site',
    prompt: 'Does your company website have a /.well-known/ directory? Visit your site and check. If you\'re building an API, consider what you\'d include in an MCP manifest.',
    icon: '🔎',
    hint: 'Try: https://yoursite.com/.well-known/',
    showInput: false,
  },
  optimization: {
    id: 'ex-optimization',
    title: 'FEED Self-Score',
    prompt: 'Score your product/service on the FEED framework (1-5 each):\n• Full Data: How complete is your structured data?\n• External Validation: How many quality reviews/mentions?\n• Engaging Copy: How benefit-focused is your content?\n• Dynamic Monitoring: Do you track agent traffic?',
    icon: '📊',
    hint: 'Be honest—this helps identify your biggest optimization opportunity.',
    showInput: true,
    placeholder: 'Full Data: _/5\nExternal Validation: _/5\nEngaging Copy: _/5\nDynamic Monitoring: _/5\n\nMy biggest gap is...',
  },
  accessibility: {
    id: 'ex-accessibility',
    title: 'Quick Accessibility Audit',
    prompt: 'Run a quick check on your key product/service page: Does it have semantic HTML (header, main, nav)? Are images described? Could a text-only browser extract the key info?',
    icon: '♿',
    hint: 'Try using your browser\'s Reader Mode or a screen reader simulator.',
    showInput: false,
  },
};
