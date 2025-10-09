import { motion } from 'framer-motion';
import type { ScenarioStep } from '../../data/scenarioSteps';

interface StepCardProps {
  step: ScenarioStep;
  showTrace: boolean;
  traceMap?: Record<string, number[]>;
}

/**
 * StepCard
 * 
 * Displays a single step in the scenario workflow with:
 * - Icon and title
 * - Description
 * - Tool used (if any) with icon
 * - Agent reasoning
 * - Data returned (animated list)
 * - Insights generated
 * - Duration badge
 * - Traceability highlights (when showTrace is true on final step)
 */
export function StepCard({ step, showTrace, traceMap = {} }: StepCardProps) {
  const hasInsights = step.insights && step.insights.length > 0;
  const hasTool = !!step.toolUsed;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="panel-inset p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{step.icon}</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-text-primary mb-2">
              {step.title}
            </h4>
            <p className="text-text-secondary text-lg">
              {step.description}
            </p>
          </div>
        </div>
        {step.duration && (
          <div className="chip-secondary px-3 py-1 text-sm font-medium whitespace-nowrap">
            ⏱️ {step.duration}
          </div>
        )}
      </div>

      {/* Tool Used (if any) */}
      {hasTool && (
        <div className="panel-surface p-4 rounded-lg border border-accent-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{step.toolIcon}</span>
            <span className="text-sm font-bold text-accent-primary uppercase tracking-wide">
              Tool Called
            </span>
          </div>
          <p className="text-text-primary font-medium">
            {step.toolUsed}
          </p>
        </div>
      )}

      {/* Agent Reasoning */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">💭</span>
          <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Agent Reasoning
          </span>
        </div>
        <p className="text-text-secondary italic pl-7">
          "{step.reasoning}"
        </p>
      </div>

      {/* Data Returned */}
      {step.dataReturned && step.dataReturned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Data Returned
            </span>
          </div>
          <div className="panel-surface p-4 rounded-lg font-mono text-sm">
            {step.dataReturned.map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${
                  line.startsWith('🔥') || line.startsWith('🔑') || 
                  line.startsWith('🏆') || line.startsWith('✨') || 
                  line.startsWith('📅') || line.startsWith('💡') || 
                  line.startsWith('🗓️') || line.startsWith('  →') || line.startsWith('•') || line.startsWith('📋')
                    ? 'text-text-primary'
                    : 'text-text-secondary'
                } ${line === '' ? 'h-2' : ''}`}
              >
                {line || '\u00A0'}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Generated */}
      {hasInsights && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <span className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Insights Generated
            </span>
          </div>
          <div className="space-y-2">
            {step.insights!.map((insight, idx) => {
              // Check if this insight should be highlighted (traceability)
              const shouldHighlight = showTrace && traceMap && insight in traceMap;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className={`px-4 py-3 rounded-lg flex items-start gap-3 ${
                    shouldHighlight
                      ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border-l-4 border-accent-primary'
                      : 'panel-surface'
                  }`}
                >
                  <span className="text-lg shrink-0">
                    {shouldHighlight ? '🔗' : '✓'}
                  </span>
                  <span className="text-text-primary font-medium flex-1">
                    {insight}
                  </span>
                  {shouldHighlight && (
                    <span className="text-xs text-accent-primary font-bold whitespace-nowrap">
                      TRACED
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
