import { motion } from 'framer-motion';

interface TraceToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

/**
 * TraceToggle
 * 
 * Toggle control for traceability feature on final step.
 * When enabled, highlights insights in the final step and
 * shows which earlier steps contributed to each insight.
 * 
 * This demonstrates how agentic systems maintain provenance
 * and allow users to understand how conclusions were reached.
 */
export function TraceToggle({ enabled, onToggle }: TraceToggleProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onToggle}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
        ${
          enabled
            ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg'
            : 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary'
        }
      `}
    >
      <span className="text-lg">🔗</span>
      <span>{enabled ? 'Hide' : 'Show'} Traceability</span>
    </motion.button>
  );
}
