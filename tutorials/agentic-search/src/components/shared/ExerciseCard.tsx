import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ExerciseCard Component
 * 
 * Provides interactive exercises within tutorial sections.
 * Users can expand the card to see the exercise and optionally
 * record their thoughts/answers.
 */

interface ExerciseCardProps {
  /** Unique identifier */
  id: string;
  /** Exercise title */
  title: string;
  /** Exercise instructions */
  prompt: string;
  /** Icon emoji */
  icon?: string;
  /** Optional hint text */
  hint?: string;
  /** Whether to show a text input area */
  showInput?: boolean;
  /** Placeholder text for input */
  placeholder?: string;
}

export function ExerciseCard({
  title,
  prompt,
  icon = '✏️',
  hint,
  showInput = false,
  placeholder = 'Type your thoughts here...',
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border-2 overflow-hidden ${
        completed 
          ? 'border-success/40 bg-success/5' 
          : 'border-accent/30 bg-accent/5'
      }`}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/10 transition-colors"
      >
        <span className="text-2xl">{completed ? '✅' : icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Exercise
            </span>
            {completed && (
              <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full">
                Completed
              </span>
            )}
          </div>
          <h5 className="font-bold text-heading">{title}</h5>
        </div>
        <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Prompt */}
              <p className="text-body leading-relaxed">{prompt}</p>

              {/* Hint */}
              {hint && (
                <div className="p-3 bg-card-secondary rounded-lg">
                  <span className="text-sm text-muted">
                    💡 <strong>Hint:</strong> {hint}
                  </span>
                </div>
              )}

              {/* Optional Input */}
              {showInput && (
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full p-3 bg-card-secondary border border-divider rounded-lg text-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                  rows={3}
                />
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setExpanded(false)}
                  className="px-4 py-2 text-sm text-muted hover:text-body transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  {showInput && userInput.trim() ? 'Save & Complete' : 'Mark Complete'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Pre-defined exercises for each section
 */
export const sectionExercises = {
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
