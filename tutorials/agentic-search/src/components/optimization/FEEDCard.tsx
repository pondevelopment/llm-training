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
            className="overflow-hidden border-t border-border"
          >
            <div className="p-6 bg-surface-secondary/30">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Winner Examples - Left Column */}
                <div className="bg-surface rounded-lg p-5 border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-lg">✅</span>
                    </div>
                    <h6 className="font-bold text-text-primary text-base">What Works</h6>
                  </div>
                  <ul className="space-y-3">
                    {pillar.examples.winner.map((example, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-500/20 transition-colors">
                          <span className="text-green-500 text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-text-secondary text-sm leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Failure Examples - Right Column */}
                <div className="bg-surface rounded-lg p-5 border-l-4 border-red-500/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-lg">❌</span>
                    </div>
                    <h6 className="font-bold text-text-primary text-base">What Fails</h6>
                  </div>
                  <ul className="space-y-3">
                    {pillar.examples.failure.map((example, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-red-500/20 transition-colors">
                          <span className="text-red-500/70 text-xs font-bold">{i + 1}</span>
                        </div>
                        <span className="text-text-secondary text-sm leading-relaxed opacity-80">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Implementation Steps - Full Width */}
              <div className="bg-surface rounded-lg p-5 border-l-4 border-accent-primary">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <span className="text-lg">🛠️</span>
                  </div>
                  <h6 className="font-bold text-text-primary text-base">How to Implement</h6>
                </div>
                <div className="grid gap-3">
                  {pillar.implementation.map((step, i) => (
                    <div 
                      key={i} 
                      className="group relative bg-surface-secondary hover:bg-surface-secondary/70 rounded-lg p-4 transition-all hover:shadow-md hover:scale-[1.01]"
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 rounded-full bg-accent-primary text-white flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary text-sm mb-1.5">
                            {step.step}
                          </p>
                          <p className="text-xs text-text-secondary leading-relaxed">{step.detail}</p>
                        </div>
                      </div>
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
