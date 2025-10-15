import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universalPrinciples, searchPlatforms } from '../../data/platformData';

export function UniversalPrinciples() {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);

  const togglePrinciple = (id: string) => {
    setExpandedPrinciple(expandedPrinciple === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-6 border border-indigo-500/30">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🌟</span>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-text-primary mb-3">
              Universal Optimization Principles
            </h4>
            <p className="text-text-secondary leading-relaxed mb-3">
              These <strong className="text-text-primary">core strategies work across all AI platforms</strong>—whether 
              ChatGPT, Gemini, Perplexity, or future competitors. Master these fundamentals before diving into 
              platform-specific tactics.
            </p>
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded p-3">
              <p className="text-sm text-text-secondary">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">🎯 Smart Strategy:</span> Implement 
                universal principles first (80% of value), then layer platform-specific optimizations (final 20% edge). 
                This approach scales better and future-proofs your work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Principles List */}
      <div className="space-y-4">
        {universalPrinciples.map((principle) => (
          <div
            key={principle.id}
            className="bg-surface-primary rounded-lg border border-border-color overflow-hidden"
          >
            {/* Principle Header (Always Visible) */}
            <button
              onClick={() => togglePrinciple(principle.id)}
              className="w-full p-5 text-left hover:bg-surface-secondary transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <span className="text-3xl">{principle.icon}</span>
                <div className="flex-1 min-w-0">
                  <h5 className="text-lg font-bold text-text-primary mb-2">
                    {principle.principle}
                  </h5>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
              <motion.svg
                animate={{ rotate: expandedPrinciple === principle.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6 text-text-muted flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedPrinciple === principle.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-5 border-t border-border-color pt-5">
                    {/* Why It Matters */}
                    <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-4">
                      <h6 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        <span>Why This Matters</span>
                      </h6>
                      <p className="text-sm text-text-secondary">
                        {principle.whyItMatters}
                      </p>
                    </div>

                    {/* Implementation Steps */}
                    {principle.implementations.map((impl, idx) => {
                      const platform = searchPlatforms.find(p => p.id === impl.platform);
                      const isUniversal = impl.platform === 'all';

                      return (
                        <div key={idx} className="space-y-3">
                          <div className="flex items-center gap-2">
                            {isUniversal ? (
                              <>
                                <span className="text-2xl">🌐</span>
                                <h6 className="font-bold text-text-primary">
                                  Universal Implementation (All Platforms)
                                </h6>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl">{platform?.icon}</span>
                                <h6 className="font-bold text-text-primary">
                                  {platform?.name} Specific
                                </h6>
                                {platform && (
                                  <span 
                                    className="px-2 py-0.5 rounded text-xs font-semibold"
                                    style={{ 
                                      backgroundColor: `${platform.color}20`, 
                                      color: platform.color 
                                    }}
                                  >
                                    {platform.provider}
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          <ol className="space-y-2 ml-10">
                            {impl.steps.map((step, stepIdx) => (
                              <li key={stepIdx} className="flex items-start gap-3">
                                <span className="font-bold text-accent-primary flex-shrink-0">
                                  {stepIdx + 1}.
                                </span>
                                <span className="text-sm text-text-secondary">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      );
                    })}

                    {/* Quick Action */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                        ✅ Quick Win
                      </p>
                      <p className="text-sm text-text-secondary">
                        Start with the first 2-3 steps. These typically deliver 70% of the benefit with 30% of the effort. 
                        You can always refine and expand later.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-l-4 border-amber-500 rounded p-5">
        <h6 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span>Implementation Priority</span>
        </h6>
        <ol className="space-y-2">
          <li className="flex items-start gap-3">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">1.</span>
            <div>
              <strong className="text-text-primary">Structured Data</strong>
              <span className="text-text-secondary text-sm block">Foundation for all platforms. Without it, agents can't understand your products.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">2.</span>
            <div>
              <strong className="text-text-primary">Agent Accessibility</strong>
              <span className="text-text-secondary text-sm block">Remove barriers. If agents can't reach checkout, nothing else matters.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">3.</span>
            <div>
              <strong className="text-text-primary">Product Feed Quality</strong>
              <span className="text-text-secondary text-sm block">Submit to Bing and Google. Feeds are the primary data source for agents.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">4.</span>
            <div>
              <strong className="text-text-primary">Conversion Friction</strong>
              <span className="text-text-secondary text-sm block">Simplify checkout. Agents abandon easily—every extra step hurts.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex-shrink-0">5.</span>
            <div>
              <strong className="text-text-primary">Tracking & Attribution</strong>
              <span className="text-text-secondary text-sm block">Measure agent traffic. Can't optimize what you can't see.</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
