import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * SelfAssessment Component
 * 
 * Interactive checklist helping users gauge their understanding
 * of agentic search concepts from the tutorial.
 * 
 * Accessibility:
 * - ARIA expanded/controls for screen readers
 * - Keyboard accessible checkboxes
 * - Focus visible styling
 * - Reduced motion support
 * - Progress announced via aria-live
 * 
 * Categories:
 * - Fundamentals (concepts from sections 1-4)
 * - Technical (optimization, accessibility, testing)
 * - Strategy (business implications, next steps)
 */

interface AssessmentItem {
  id: string;
  question: string;
  sectionRef: string;
  category: 'fundamentals' | 'technical' | 'strategy';
}

const assessmentItems: AssessmentItem[] = [
  // Fundamentals
  {
    id: 'f1',
    question: 'I can explain the difference between traditional search and agentic search',
    sectionRef: 'Section 1: Search Comparison',
    category: 'fundamentals',
  },
  {
    id: 'f2',
    question: 'I understand why agents show only 3-6 results (no "page 2")',
    sectionRef: 'Section 1: Search Comparison',
    category: 'fundamentals',
  },
  {
    id: 'f3',
    question: 'I can describe what MCP (Model Context Protocol) does',
    sectionRef: 'Section 3: MCP Discovery',
    category: 'fundamentals',
  },
  {
    id: 'f4',
    question: 'I know what a /.well-known/mcp.json manifest is for',
    sectionRef: 'Section 3: MCP Discovery',
    category: 'fundamentals',
  },
  {
    id: 'f5',
    question: 'I can explain the 4 levels of agent autonomy (from Agentic Search to Agentic Commerce)',
    sectionRef: 'Section 5: Agent Mode',
    category: 'fundamentals',
  },
  
  // Technical
  {
    id: 't1',
    question: 'I understand what JSON-LD is and why it matters for agents',
    sectionRef: 'Section 4: Optimization',
    category: 'technical',
  },
  {
    id: 't2',
    question: 'I can list the 4 pillars of the FEED optimization framework',
    sectionRef: 'Section 4: Optimization',
    category: 'technical',
  },
  {
    id: 't3',
    question: 'I know why Bing API optimization matters for ChatGPT Shopping',
    sectionRef: 'Section 4: Optimization',
    category: 'technical',
  },
  {
    id: 't4',
    question: 'I understand why semantic HTML/ARIA helps agents navigate pages',
    sectionRef: 'Section 6: Accessibility',
    category: 'technical',
  },
  {
    id: 't5',
    question: 'I know how to track agent traffic (server logs vs GA4 limitations)',
    sectionRef: 'Section 4: Optimization',
    category: 'technical',
  },
  
  // Strategy
  {
    id: 's1',
    question: 'I understand why the 15.9% vs 1.8% conversion rate difference matters',
    sectionRef: 'Section 4: Optimization',
    category: 'strategy',
  },
  {
    id: 's2',
    question: 'I can explain McKinsey\'s $3-5T agentic commerce opportunity',
    sectionRef: 'Section 4: Optimization',
    category: 'strategy',
  },
  {
    id: 's3',
    question: 'I know why early optimization matters before paid placements arrive (~2026)',
    sectionRef: 'Section 4: Optimization',
    category: 'strategy',
  },
  {
    id: 's4',
    question: 'I understand the 5 trust dimensions (Competence, Reliability, Intentions, Data Practices, Transparency)',
    sectionRef: 'Section 5: Agent Mode',
    category: 'strategy',
  },
  {
    id: 's5',
    question: 'I have concrete next steps for making my products/services agent-ready',
    sectionRef: 'Takeaways',
    category: 'strategy',
  },
];

const categoryLabels = {
  fundamentals: { label: 'Fundamentals', icon: '📚', description: 'Core concepts' },
  technical: { label: 'Technical', icon: '⚙️', description: 'Implementation' },
  strategy: { label: 'Strategy', icon: '🎯', description: 'Business impact' },
};

export function SelfAssessment() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  const toggleItem = (id: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setChecked(newChecked);
  };

  const getProgress = (category?: 'fundamentals' | 'technical' | 'strategy') => {
    const items = category 
      ? assessmentItems.filter(i => i.category === category)
      : assessmentItems;
    const checkedCount = items.filter(i => checked.has(i.id)).length;
    return { checked: checkedCount, total: items.length, percent: Math.round((checkedCount / items.length) * 100) };
  };

  const overallProgress = getProgress();

  // Determine completion message
  const getCompletionMessage = () => {
    if (overallProgress.percent === 100) {
      return { emoji: '🏆', message: 'Excellent! You\'ve mastered the material!' };
    } else if (overallProgress.percent >= 80) {
      return { emoji: '🌟', message: 'Great progress! Just a few more concepts to solidify.' };
    } else if (overallProgress.percent >= 50) {
      return { emoji: '📈', message: 'Good start! Review the unchecked items above.' };
    } else {
      return { emoji: '🚀', message: 'Check off concepts as you understand them!' };
    }
  };

  const completion = getCompletionMessage();
  const prefersReducedMotion = useReducedMotion();
  
  // Generate unique IDs for ARIA
  const contentId = useId();
  const headerId = useId();

  // Reduced motion-aware animation props
  const animationProps = prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const expandAnimationProps = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 } };

  return (
    <motion.div
      {...animationProps}
      className="panel-surface p-6 max-w-4xl mx-auto"
      role="region"
      aria-labelledby={headerId}
    >
      {/* Header */}
      <button
        id={headerId}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full flex items-center justify-between text-left mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg p-2 -m-2"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">📋</span>
          <div>
            <h4 className="text-xl font-bold text-heading">Self-Assessment Checklist</h4>
            <p className="text-sm text-muted">Gauge your understanding of the material</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          <div className="text-right" aria-live="polite">
            <span className="text-2xl font-bold text-accent">{overallProgress.percent}%</span>
            <span className="text-xs text-muted block">{overallProgress.checked}/{overallProgress.total}</span>
          </div>
          <span 
            className={`transform transition-transform text-lg ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id={contentId}
            {...expandAnimationProps}
            className="overflow-hidden"
          >
            {/* Progress Bars by Category */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {(['fundamentals', 'technical', 'strategy'] as const).map((cat) => {
                const progress = getProgress(cat);
                return (
                  <div key={cat} className="bg-card-secondary rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{categoryLabels[cat].icon}</span>
                      <span className="font-medium text-sm text-heading">{categoryLabels[cat].label}</span>
                      <span className="text-xs text-muted ml-auto">{progress.checked}/{progress.total}</span>
                    </div>
                    <div className="h-2 bg-divider rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percent}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          progress.percent === 100 ? 'bg-success' :
                          progress.percent >= 50 ? 'bg-accent' : 'bg-warning'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checklist Items */}
            <div className="space-y-6">
              {(['fundamentals', 'technical', 'strategy'] as const).map((category) => (
                <div key={category}>
                  <h5 className="font-bold text-heading mb-3 flex items-center gap-2">
                    <span>{categoryLabels[category].icon}</span>
                    {categoryLabels[category].label}
                    <span className="text-xs font-normal text-muted">— {categoryLabels[category].description}</span>
                  </h5>
                  <div className="space-y-2">
                    {assessmentItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            checked.has(item.id)
                              ? 'bg-success/10 border border-success/30'
                              : 'bg-card-secondary hover:bg-card-tertiary border border-transparent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="mt-1 w-4 h-4 accent-success"
                          />
                          <div className="flex-1">
                            <span className={`text-sm ${checked.has(item.id) ? 'text-heading' : 'text-body'}`}>
                              {item.question}
                            </span>
                            <span className="block text-xs text-muted mt-1">
                              📍 {item.sectionRef}
                            </span>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Completion Message */}
            <div className="mt-6 p-4 bg-card-secondary rounded-lg text-center">
              <span className="text-3xl mb-2 block">{completion.emoji}</span>
              <p className="text-body font-medium">{completion.message}</p>
              {overallProgress.percent < 100 && (
                <p className="text-xs text-muted mt-2">
                  Tip: Scroll up to review sections for unchecked items
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
