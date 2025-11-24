import { motion } from 'framer-motion';
import { searchEvolutionStages, agentBehaviorStats, agentModeInsights } from '../../data/agentModeData';

/**
 * AgentModeSection
 * 
 * Explains the evolution from traditional search to autonomous agent mode.
 * Based on October 2025 research from Jes Scholz's analysis.
 * 
 * Structure:
 * 1. Introduction - Agent mode vs agentic search
 * 2. Evolution Stages - Traditional → Agentic → Agent Mode
 * 3. Behavior Stats - 46% text browser, 63% bounce, 17% conversion, 92% Bing API
 * 4. Key Insights - Autonomous transactions, text-first design, conversion fragility
 * 5. Testing Prompt - Template for users to test their sites
 */
export function AgentModeSection() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">⚡</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Beyond Recommendations: Agent Mode
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              You've learned about agentic search—where AI curates product recommendations. But there's a 
              <span className="font-semibold text-text-primary"> new frontier</span>: <strong className="text-accent-primary">Agent 
              mode</strong>, where AI doesn't just recommend—it <span className="font-bold text-text-primary">completes 
              transactions autonomously</span>.
            </p>
            <p className="text-text-secondary leading-relaxed">
              This changes everything. Your site must now be navigable and convertible for <em>bots</em>, not just humans. 
              Traditional UX assumptions—visual cues, mouse hovers, dynamic JavaScript—break down when 46% of agent visits 
              use text-only browsers.
            </p>
          </div>
        </div>

        {/* Key Distinction Callout */}
        <div className="mt-6 panel-inset p-6 border-l-4 border-[#6366f1]">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h4 className="font-bold text-text-primary">Agentic Search</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Recommendation only.</strong> AI researches and curates 3-6 
                products. User clicks link, visits site, completes purchase manually.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h4 className="font-bold text-text-primary">Agent Mode</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                <strong className="text-text-primary">Autonomous action.</strong> AI searches, selects, navigates 
                site, fills forms, and completes checkout—all without human intervention beyond initial approval.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Evolution Stages */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h4 className="text-2xl font-bold text-text-primary mb-2">
            📈 The Evolution of Search
          </h4>
          <p className="text-text-secondary max-w-3xl mx-auto">
            From link-based discovery to autonomous transactions—see how user behavior and expectations have transformed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {searchEvolutionStages.map((stage, index) => {
            const getStageColor = (s: string) => {
              switch (s) {
                case 'traditional': return 'border-[#6b7280]';
                case 'agentic': return 'border-[#f59e0b]';
                case 'agent-mode': return 'border-[#10b981]';
                case 'agentic-commerce': return 'border-[#6366f1]'; // Indigo for the future
                default: return 'border-[var(--color-border)]';
              }
            };

            const getAutonomyBadge = (autonomy: string) => {
              switch (autonomy) {
                case 'none': return <span className="chip-error px-2 py-1 text-xs">No Autonomy</span>;
                case 'partial': return <span className="chip-warning px-2 py-1 text-xs">Partial Autonomy</span>;
                case 'full': return <span className="chip-success px-2 py-1 text-xs">Full Autonomy</span>;
                default: return null;
              }
            };

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`panel-surface p-6 border-l-4 ${getStageColor(stage.stage)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{stage.icon}</span>
                    <div>
                      <h5 className="text-lg font-bold text-text-primary">{stage.title}</h5>
                      <p className="text-xs text-text-muted">{stage.subtitle}</p>
                    </div>
                  </div>
                  {getAutonomyBadge(stage.autonomy)}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {stage.description}
                </p>

                {/* Flow */}
                <div className="space-y-2 mb-4 p-4 bg-[var(--color-subtle-bg)] rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-text-primary font-bold text-xs">👤</span>
                    <p className="text-xs text-text-secondary">{stage.userAction}</p>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <span className="text-text-muted">↓</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-text-primary font-bold text-xs">🖥️</span>
                    <p className="text-xs text-text-secondary">{stage.systemAction}</p>
                  </div>
                  <div className="flex items-center gap-2 pl-4">
                    <span className="text-text-muted">↓</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-text-primary font-bold text-xs">✅</span>
                    <p className="text-xs text-text-secondary">{stage.outcome}</p>
                  </div>
                </div>

                {/* Example */}
                <div className="mb-4 p-3 bg-[var(--color-card)] rounded border border-[var(--color-border)]">
                  <p className="text-xs font-semibold text-text-primary mb-1">💡 Example:</p>
                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    {stage.example}
                  </p>
                </div>

                {/* Limitations */}
                {stage.limitations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-primary mb-2">⚠️ Limitations:</p>
                    <ul className="space-y-1">
                      {stage.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-text-muted text-xs">•</span>
                          <span className="text-xs text-text-secondary leading-tight">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Behavior Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="panel-surface p-8"
      >
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-text-primary mb-2">
            📊 Agent Mode by the Numbers
          </h4>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Recent analysis of 100+ agent conversations reveals critical behavior patterns and conversion barriers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {agentBehaviorStats.map((stat, index) => {
            const getImpactColor = (impact: string) => {
              switch (impact) {
                case 'critical': return 'border-[#ef4444] bg-[#ef4444]/5';
                case 'high': return 'border-[#f59e0b] bg-[#f59e0b]/5';
                case 'medium': return 'border-[#6366f1] bg-[#6366f1]/5';
                default: return 'border-[var(--color-border)]';
              }
            };

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className={`panel-inset p-6 border-l-4 ${getImpactColor(stat.impact)}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{stat.icon}</span>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                  </div>
                </div>
                <h5 className="text-sm font-bold text-text-primary mb-2">{stat.label}</h5>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {stat.description}
                </p>
                <p className="text-xs text-text-muted italic">
                  Source: <a 
                    href={stat.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#6366f1] hover:text-[#4f46e5] underline hover:no-underline transition-colors"
                  >
                    {stat.source}
                  </a>
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Insights */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h4 className="text-2xl font-bold text-text-primary mb-2">
            💡 What This Means for Your Site
          </h4>
          <p className="text-text-secondary">
            Four critical insights from agent mode research—and what you should do about them.
          </p>
        </motion.div>

        <div className="space-y-4">
          {agentModeInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
              className="panel-surface p-6"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{insight.icon}</div>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-text-primary mb-3">{insight.title}</h5>
                  <div className="space-y-3 text-sm">
                    <div className="bg-[var(--color-subtle-bg)] rounded-lg p-4">
                      <p className="font-semibold text-text-primary mb-1">🔍 Insight:</p>
                      <p className="text-text-secondary leading-relaxed">{insight.insight}</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#f59e0b]/10 to-[#ef4444]/10 rounded-lg p-4 border-l-4 border-[#f59e0b]">
                      <p className="font-semibold text-text-primary mb-1">⚠️ Implication:</p>
                      <p className="text-text-secondary leading-relaxed">{insight.implication}</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 rounded-lg p-4 border-l-4 border-[#10b981]">
                      <p className="font-semibold text-text-primary mb-1">✅ Action:</p>
                      <p className="text-text-secondary leading-relaxed">{insight.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testing Prompt Template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.7 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-[#6366f1]/10 via-[#8b5cf6]/10 to-[#6366f1]/10 border-2 border-[#6366f1] rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🧪</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-text-primary mb-4">
                Test Your Site with Agent Mode
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                Want to see how agents interact with your site? Use this prompt template with your AI assistant 
                (ChatGPT, Gemini, Perplexity, etc.) to identify conversion barriers, accessibility issues, and optimization opportunities.
              </p>

              {/* Prompt Template */}
              <div className="bg-[#1e1e1e] text-[#d4d4d4] p-6 rounded-lg font-mono text-sm leading-relaxed mb-4 border border-[var(--color-border)]">
                <p className="text-[#9cdcfe] mb-2">// Copy this prompt to your AI assistant (agent/browsing mode required)</p>
                <p className="mb-4">
                  Visit <span className="text-[#ce9178]">[your-website.com]</span> and{' '}
                  <span className="text-[#ce9178]">[complete desired action]</span>.
                </p>
                <p className="mb-4">
                  Desired action examples:<br />
                  <span className="text-[#6a9955]">  • "Add the most popular product to cart and proceed to checkout"</span><br />
                  <span className="text-[#6a9955]">  • "Submit the contact form with inquiry about pricing"</span><br />
                  <span className="text-[#6a9955]">  • "Book an appointment for next Tuesday at 2pm"</span><br />
                  <span className="text-[#6a9955]">  • "Find and download the product specifications PDF"</span>
                </p>
                <p>
                  Report any obstacles encountered: forms that failed, buttons that didn't work, 
                  CAPTCHAs, unclear navigation, or points where you got stuck.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[var(--color-card)] rounded-lg border border-[var(--color-border)]">
                <span className="text-xl">💡</span>
                <div className="flex-1 text-xs text-text-secondary">
                  <p className="font-semibold text-text-primary mb-1">Pro Tips:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Test multiple conversion paths (product purchase, form submission, account creation)</li>
                    <li>Note where the agent gets "stuck" or abandons—these are your optimization priorities</li>
                    <li>Compare text-based browser view (Chrome DevTools → Rendering → Disable CSS) to agent experience</li>
                    <li>Track improvements: test monthly, measure bounce rate and conversion rate changes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.9 }}
        className="panel-surface p-8 border-l-4 border-[#10b981] max-w-4xl mx-auto"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-3">
              Agent Mode Optimization: Start Today
            </h4>
            <p className="text-text-secondary leading-relaxed mb-4">
              Agent mode is <strong className="text-text-primary">live now</strong> with Etsy and Shopify integrations 
              in beta. By 2026, ads and sponsored placements will arrive. Those who optimize for agent convertibility 
              today will dominate tomorrow's autonomous shopping landscape.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">1.</span>
                <span className="text-text-secondary"><strong className="text-text-primary">Test with agents:</strong> Use the prompt template above to identify barriers</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">2.</span>
                <span className="text-text-secondary"><strong className="text-text-primary">Fix accessibility:</strong> Remove CAPTCHAs, bot blocks, registration walls</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">3.</span>
                <span className="text-text-primary"><strong className="text-text-primary">Simplify conversion:</strong> Semantic HTML, clear labels, guest checkout</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#10b981] font-bold">4.</span>
                <span className="text-text-secondary"><strong className="text-text-primary">Monitor trends:</strong> Track agent traffic (desktop Chrome spikes), measure conversion paths</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
