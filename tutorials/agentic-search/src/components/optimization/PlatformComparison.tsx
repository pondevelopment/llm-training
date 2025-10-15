import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  searchPlatforms, 
  platformComparisons, 
  getActiveShoppingPlatforms
} from '../../data/platformData';

export function PlatformComparison() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('chatgpt');
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  
  const activePlatforms = getActiveShoppingPlatforms();
  const displayPlatforms = showAllPlatforms ? searchPlatforms : activePlatforms;
  const selected = searchPlatforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-lg p-6 border border-accent-primary/20">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">🌐</span>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-2">
              Multi-Platform Reality
            </h4>
            <p className="text-text-secondary leading-relaxed">
              Different AI assistants use <strong className="text-text-primary">different search backends</strong>. 
              ChatGPT queries Bing, Gemini uses Google Shopping, Perplexity searches multiple sources. Each 
              platform requires tailored optimization strategies.
            </p>
          </div>
        </div>
        
        <div className="bg-accent-primary/5 rounded border border-accent-primary/20 p-4">
          <p className="text-sm text-text-secondary">
            <span className="font-bold text-accent-primary">✨ Universal Principles:</span> While platforms 
            differ, core optimization strategies (structured data, feed quality, accessibility, conversion 
            optimization) apply everywhere. Master the fundamentals first, then customize per platform.
          </p>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="space-y-3">
        <h5 className="text-lg font-bold text-text-primary">Select Platform to Explore:</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {displayPlatforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPlatform === platform.id
                  ? 'border-accent-primary bg-accent-primary/10 shadow-md'
                  : 'border-border-color bg-surface-primary hover:border-accent-primary/50'
              }`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <div className="text-sm font-bold text-text-primary mb-1">{platform.name}</div>
              <div className="text-xs text-text-muted">{platform.provider}</div>
              {platform.status !== 'active' && (
                <div className="text-xs mt-1 px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
                  {platform.status}
                </div>
              )}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowAllPlatforms(!showAllPlatforms)}
          className="text-sm text-accent-primary hover:underline"
        >
          {showAllPlatforms ? '← Show active platforms only' : 'Show all platforms (including limited/planned) →'}
        </button>
      </div>

      {/* Selected Platform Details */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-primary rounded-lg border border-border-color p-6 space-y-6"
          >
            {/* Platform Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-border-color">
              <span className="text-5xl">{selected.icon}</span>
              <div className="flex-1">
                <h5 className="text-2xl font-bold text-text-primary mb-1">
                  {selected.name}
                </h5>
                <p className="text-sm text-text-muted">
                  {selected.provider} • Market Share: {selected.marketShare}
                </p>
              </div>
              {selected.status === 'active' ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                  ✓ Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold">
                  {selected.status}
                </span>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔍</span>
                  <span className="font-bold text-text-primary">Search Backend</span>
                </div>
                <p className="text-text-secondary text-sm mb-1">
                  <strong className="text-text-primary">{selected.searchAPI}</strong>
                </p>
                <p className="text-text-muted text-xs">
                  Provider: {selected.searchProvider}
                  {selected.apiUsageRate && ` (${selected.apiUsageRate} usage rate)`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🛒</span>
                  <span className="font-bold text-text-primary">Shopping Features</span>
                </div>
                <p className="text-text-secondary text-sm mb-1">
                  <strong className={selected.shoppingEnabled ? 'text-green-600 dark:text-green-400' : 'text-text-muted'}>
                    {selected.shoppingEnabled ? '✅ Shopping enabled' : '❌ No shopping yet'}
                  </strong>
                </p>
                <p className="text-text-muted text-xs">
                  {selected.agentMode ? '🤖 Autonomous agent mode available' : 'Manual recommendation only'}
                </p>
              </div>
            </div>

            {/* Product Feed Requirements */}
            {selected.shoppingEnabled && (
              <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <h6 className="font-bold text-text-primary mb-1">Required Product Feed</h6>
                    <p className="text-sm text-text-secondary">
                      <strong className="text-accent-primary">{selected.productFeed.name}</strong>
                      {selected.productFeed.required && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-red-500/20 text-red-700 dark:text-red-300 rounded">
                          Required
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href={selected.productFeed.submitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:underline"
                  >
                    <span>Submit your feed →</span>
                  </a>
                  {selected.webmasterTools && (
                    <a
                      href={selected.webmasterTools}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent-primary hover:underline ml-4"
                    >
                      <span>Webmaster Tools →</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Ranking Factors */}
            <div>
              <h6 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>Optimization Priorities</span>
              </h6>
              <ul className="space-y-2">
                {selected.rankingFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent-primary font-bold flex-shrink-0">•</span>
                    <span className="text-sm text-text-secondary">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testing Info */}
            <div className="bg-surface-secondary rounded-lg p-4 border border-border-color">
              <h6 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                <span className="text-xl">🧪</span>
                <span>Testing Your Site</span>
              </h6>
              <p className="text-sm text-text-secondary mb-3">
                Test URL: <code className="px-2 py-0.5 bg-surface-primary rounded text-xs font-mono">
                  {selected.testingURL}
                </code>
              </p>
              <p className="text-sm text-text-secondary">
                UTM tracking: <code className="px-2 py-0.5 bg-surface-primary rounded text-xs font-mono">
                  utm_source={selected.utmSource}
                </code>
              </p>
            </div>

            {/* Documentation Link */}
            <div className="pt-4 border-t border-border-color">
              <a
                href={selected.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors text-sm font-semibold"
              >
                <span>View {selected.name} Documentation</span>
                <span>↗</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Table */}
      <div className="bg-surface-primary rounded-lg border border-border-color overflow-hidden">
        <div className="p-4 bg-surface-secondary border-b border-border-color">
          <h5 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span>Platform Comparison Matrix</span>
          </h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-secondary border-b border-border-color">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-text-primary">Metric</th>
                {['chatgpt', 'gemini', 'perplexity', 'copilot', 'claude'].map(platformId => {
                  const platform = searchPlatforms.find(p => p.id === platformId);
                  return (
                    <th key={platformId} className="px-4 py-3 text-center font-bold text-text-primary">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{platform?.icon}</span>
                        <span className="text-xs">{platform?.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {platformComparisons.map((comparison, idx) => (
                <tr key={idx} className="border-b border-border-color hover:bg-surface-secondary/50">
                  <td className="px-4 py-3 font-semibold text-text-primary">{comparison.metric}</td>
                  <td className="px-4 py-3 text-center text-text-secondary text-xs">{comparison.chatgpt}</td>
                  <td className="px-4 py-3 text-center text-text-secondary text-xs">{comparison.gemini}</td>
                  <td className="px-4 py-3 text-center text-text-secondary text-xs">{comparison.perplexity}</td>
                  <td className="px-4 py-3 text-center text-text-secondary text-xs">{comparison.copilot}</td>
                  <td className="px-4 py-3 text-center text-text-secondary text-xs">{comparison.claude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-l-4 border-green-500 rounded p-5">
        <h6 className="font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span>
          <span>Strategic Approach</span>
        </h6>
        <p className="text-sm text-text-secondary mb-3">
          <strong className="text-text-primary">Start with ChatGPT</strong> (75% market share, most mature agent mode). 
          Then expand to <strong className="text-text-primary">Gemini</strong> (15%, growing fast with Google's reach). 
          Cover 90% of agent traffic with these two platforms.
        </p>
        <p className="text-sm text-text-secondary">
          <strong className="text-text-primary">Universal principles</strong> (structured data, feed quality, accessibility) 
          work across all platforms—invest there first, then add platform-specific optimizations.
        </p>
      </div>
    </div>
  );
}
