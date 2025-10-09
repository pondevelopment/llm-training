import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FEEDPillar } from '../../data/optimizationTips';

interface FEEDCardProps {
  pillar: FEEDPillar;
  index: number;
}

export function FEEDCard({ pillar, index }: FEEDCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
      className="panel-surface"
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-surface-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-inset rounded-lg"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-4">
          {/* Letter Badge */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-accent-primary">{pillar.letter}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{pillar.icon}</span>
              <h5 className="text-lg font-bold text-text-primary">{pillar.title}</h5>
            </div>
            <p className="text-sm text-muted mb-2">{pillar.subtitle}</p>
            <p className="text-text-secondary text-sm leading-relaxed">{pillar.description}</p>
          </div>

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 text-accent-primary"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Winner Examples */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">✅</span>
                  <h6 className="font-semibold text-text-primary">What Works</h6>
                </div>
                <ul className="space-y-2">
                  {pillar.examples.winner.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-accent-primary mt-1 flex-shrink-0">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failure Examples */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">❌</span>
                  <h6 className="font-semibold text-text-primary">What Fails</h6>
                </div>
                <ul className="space-y-2">
                  {pillar.examples.failure.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-muted mt-1 flex-shrink-0">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Implementation Steps */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🛠️</span>
                  <h6 className="font-semibold text-text-primary">How to Implement</h6>
                </div>
                <div className="space-y-3">
                  {pillar.implementation.map((step, i) => (
                    <div key={i} className="bg-surface-secondary rounded-lg p-3">
                      <p className="font-medium text-text-primary text-sm mb-1">
                        {i + 1}. {step.step}
                      </p>
                      <p className="text-xs text-text-secondary">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
