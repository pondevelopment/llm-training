import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ExerciseCard Component
 * 
 * Provides interactive exercises within tutorial sections.
 * Users can expand the card to see the exercise and optionally
 * record their thoughts/answers.
 * 
 * Accessibility:
 * - ARIA expanded state for screen readers
 * - Keyboard accessible (Enter/Space to toggle)
 * - Focus visible styling
 * - Reduced motion support
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
  const prefersReducedMotion = useReducedMotion();
  
  // Generate unique IDs for ARIA
  const contentId = useId();
  const headerId = useId();

  const handleComplete = () => {
    setCompleted(true);
    setExpanded(false);
  };

  // Reduced motion-aware animation props
  const animationProps = prefersReducedMotion 
    ? { initial: {}, animate: {}, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

  const expandAnimationProps = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {}, transition: { duration: 0 } }
    : { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 } };

  return (
    <motion.div
      {...animationProps}
      className={`rounded-lg border-2 overflow-hidden ${
        completed 
          ? 'border-success/40 bg-success/5' 
          : 'border-accent/30 bg-accent/5'
      }`}
      role="region"
      aria-labelledby={headerId}
    >
      {/* Header - Always Visible */}
      <button
        id={headerId}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <span className="text-2xl" aria-hidden="true">{completed ? '✅' : icon}</span>
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
        <span 
          className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={contentId}
            {...expandAnimationProps}
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
