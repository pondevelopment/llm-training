import { motion } from 'framer-motion';
import { feedFramework, conversionMetrics, commonLimitations } from '../../data/optimizationTips';
import { FEEDCard } from './FEEDCard';
import { MetricsPanel } from './MetricsPanel';
import { LimitationsPanel } from './LimitationsPanel';
import { AgentReadinessChecker } from './AgentReadinessChecker';
import { ConversionOptimization } from './ConversionOptimization';

/**
 * OptimizationSection (Phase 5.5)
 * 
 * Teaches practical optimization strategies for agentic search.
 * Based on ChatGPT Shopping insights (Oct 2025).
 * 
 * Structure:
 * 1. Introduction - Why optimization matters
 * 2. FEED Framework - 4 interactive pillar cards
 * 3. Metrics Panel - Real conversion data
 * 4. Limitations Panel - What breaks and why
 * 5. Call-to-Action - Start optimizing
 * 
 * Features:
 * - Expandable FEED cards with examples
 * - Visual metrics comparison
 * - Clear limitation explanations
 * - Actionable implementation steps
 */
export function OptimizationSection() {
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
          <div className="text-5xl">🎯</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Making Your Services Agent-Ready
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              You've seen how agentic search works. Now learn what makes products and services 
              <span className="font-semibold text-text-primary"> visible and successful</span> when 
              agents are doing the searching.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Based on real-world data from ChatGPT Shopping (launched April 2025), we'll explore 
              the <span className="font-semibold text-text-primary">FEED framework</span> — a practical 
              methodology for optimization, backed by conversion metrics and insights from early adopters.
            </p>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-6 panel-inset p-4 border-l-4 border-accent-primary">
          <p className="text-text-primary font-medium">
            💡 <span className="font-bold">The Stakes:</span> Agentic search shows only 3-6 products 
            per query. There's no "page 2" — if you're not in the shortlist, you're invisible. 
            Small optimizations have <span className="text-accent-primary font-semibold">outsized 
            impact</span> on visibility and conversions.
          </p>
        </div>
      </motion.div>

      {/* FEED Framework */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h4 className="text-2xl font-bold text-text-primary mb-2">
            🌟 The FEED Optimization Framework
          </h4>
          <p className="text-text-secondary max-w-3xl mx-auto">
            Four pillars that determine visibility and success in agentic search. 
            Click each card to see examples and implementation steps.
          </p>
        </motion.div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {feedFramework.map((pillar, index) => (
            <FEEDCard key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>

        {/* Framework Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="panel-inset p-6 max-w-3xl mx-auto"
        >
          <p className="text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">Remember:</span> These pillars work together. 
            Full data without engaging copy gets ignored. Great copy without external validation lacks trust. 
            Focus on all four for maximum impact.
          </p>
        </motion.div>

        {/* JSON-LD Critical Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#6366f1]/10 via-[#8b5cf6]/10 to-[#6366f1]/10 border-2 border-[#6366f1] rounded-lg p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">🔑</div>
              <div className="flex-1">
                <h5 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                  The One Thing You Must Do First
                  <span className="text-xs font-normal px-2 py-1 bg-[#6366f1] text-white rounded-full">Required</span>
                </h5>
                <div className="space-y-3 text-body">
                  <p className="leading-relaxed">
                    When humans visit your website, they see beautiful images, text, and layouts. But AI agents? 
                    <strong className="text-heading"> They can't "see" like we do.</strong> They need a special label on your products—like a nutrition 
                    facts label, but for machines—that tells them exactly what you're selling, the price, reviews, and availability. 
                    Without this label, agents might completely miss your products when customers ask them for recommendations.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-heading">The technical term is JSON-LD</strong> (don't worry about the name), and it's simply 
                    <span className="font-semibold text-[#6366f1]"> a behind-the-scenes product information card</span> that agents can read instantly. 
                    Think of it as translating your product page into a format agents understand perfectly—clean, structured data they can extract 
                    without guessing or parsing through your website's design.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚡</span>
                        <span className="font-bold text-heading text-sm">Agent Parsing Efficiency</span>
                      </div>
                      <p className="text-sm text-body">
                        Agents extract JSON-LD directly—no HTML parsing, no guesswork. 
                        Microdata and RDFa require parsing markup structure, which is slower and error-prone.
                      </p>
                    </div>
                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🎯</span>
                        <span className="font-bold text-heading text-sm">Visibility Impact</span>
                      </div>
                      <p className="text-sm text-body">
                        Products with complete JSON-LD schema appear <span className="font-semibold text-[#6366f1]">3-5x more often</span> in 
                        agent recommendations. Without it, agents may miss your product entirely.
                      </p>
                    </div>
                  </div>
                  
                  {/* JSON-LD Example */}
                  <div className="mt-4 p-5 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">📝</span>
                      <span className="font-bold text-heading text-sm">What JSON-LD Looks Like</span>
                    </div>
                    <p className="text-xs text-muted mb-3">
                      Here's a simple example. Don't worry about understanding every detail—just notice how it clearly labels 
                      product information that agents can read:
                    </p>
                    <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed border border-[var(--color-border)]">
{`<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Wireless Headphones Pro",       ← Product name
  "image": "headphones.jpg",
  "description": "Premium noise-canceling", ← What it is
  "brand": {
    "@type": "Brand",
    "name": "AudioTech"                     ← Who makes it
  },
  "offers": {
    "@type": "Offer",
    "price": "199.99",                      ← How much
    "priceCurrency": "USD",
    "availability": "InStock"               ← Can buy now
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",                   ← Star rating
    "reviewCount": "247"                    ← How many reviews
  }
}
</script>`}
                    </pre>
                    <p className="text-xs text-muted mt-3">
                      <strong className="text-heading">For agents, this is perfect:</strong> Clear labels, structured format, instant understanding. 
                      For humans visiting your page, they never see this—it works behind the scenes.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-[var(--color-subtle-bg)] rounded-lg border-l-4 border-[#6366f1]">
                    <p className="text-sm text-body">
                      <strong className="text-heading">Implementation priority:</strong> Add JSON-LD <em>before</em> other optimizations. 
                      Use <code className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-xs font-mono border border-[var(--color-border)]">
                        &lt;script type="application/ld+json"&gt;
                      </code> tags with schema.org types (Product, Offer, AggregateRating, Review). 
                      Server-render—never add via JavaScript so agents see it immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bing API & Search Behavior Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">🔍</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-text-primary mb-4">
              How Agents Actually Choose Products
            </h4>
            <p className="text-text-secondary leading-relaxed mb-4">
              Understanding <span className="font-semibold text-text-primary">where agents look</span> is 
              crucial for visibility. Recent research reveals a surprising finding: <strong className="text-accent-primary">92% 
              of ChatGPT Shopping queries use Bing's Search API</strong>, not visual search results.
            </p>
            
            <div className="panel-inset p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-text-primary mb-2">The Bing API Connection</h5>
                  <p className="text-text-secondary leading-relaxed mb-3">
                    When you ask ChatGPT to find products, it doesn't search like you do. Instead of browsing 
                    Google-style results, it calls <strong className="text-text-primary">Bing's Search API</strong> and 
                    receives structured product data—essentially a feed of products matching your query.
                  </p>
                  <div className="bg-gradient-to-r from-[#0078d4]/10 to-[#106ebe]/10 border-l-4 border-[#0078d4] rounded p-4">
                    <p className="text-sm text-text-secondary mb-2">
                      <strong className="text-text-primary">Example Query Path:</strong>
                    </p>
                    <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                      <li>User: <em>"Find me noise-canceling headphones under $200"</em></li>
                      <li>ChatGPT → Bing Search API: <code className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-xs font-mono">query="noise-canceling headphones price:0-200"</code></li>
                      <li>Bing API returns 10-20 structured product results</li>
                      <li>ChatGPT selects 3-6 products and presents them</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🥇</span>
                    <span className="font-bold text-text-primary">First Position Dominance</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    <strong className="text-accent-primary text-lg">63%</strong> of agents select the 
                    <strong className="text-text-primary"> first result</strong> from Bing's API. Position matters 
                    enormously—there's no scrolling or "page 2" behavior.
                  </p>
                </div>
                <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <span className="font-bold text-text-primary">Bing Shopping Feed</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Products in <strong className="text-text-primary">Bing Shopping feeds</strong> appear in API 
                    results. If you're not in Bing's index with proper product data, agents won't find you—even 
                    with perfect SEO elsewhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border-l-4 border-[#10b981] rounded-lg p-5">
              <h5 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                <span>✅</span>
                <span>Action Steps: Optimize for Bing</span>
              </h5>
              <ol className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">1.</span>
                  <div>
                    <strong className="text-text-primary">Submit to Bing Shopping:</strong> Create a merchant 
                    account at <a 
                      href="https://www.bing.com/webmasters/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent-primary hover:underline font-medium"
                    >Bing Webmaster Tools</a> and submit your product feed (same format as Google Merchant Center).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">2.</span>
                  <div>
                    <strong className="text-text-primary">Monitor Bing Rankings:</strong> Track how your products 
                    rank in Bing Shopping searches. First-position products get <span className="text-accent-primary font-semibold">9-10x 
                    more agent selections</span> than position 5+.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">3.</span>
                  <div>
                    <strong className="text-primary">Use Bing-Friendly Platforms:</strong> Shopify users benefit 
                    from native Bing Shopping integrations. Ensure your platform can submit clean product feeds to Bing.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">4.</span>
                  <div>
                    <strong className="text-text-primary">Optimize Product Titles:</strong> Bing API results prioritize 
                    clear, keyword-rich titles. Format: <code className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-xs font-mono">Brand + Product Type + Key Features</code> 
                    <span className="text-text-muted text-xs block mt-1">Example: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones - Black"</span>
                  </div>
                </li>
              </ol>
            </div>

            <p className="text-text-secondary text-sm italic mt-4">
              💡 <strong className="text-text-primary">Pro tip:</strong> While Google visibility still matters for 
              traditional search, <span className="font-semibold">Bing is your gateway to agent traffic</span>. Many 
              businesses ignore Bing—this is your competitive advantage.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Conversion Metrics */}
      <MetricsPanel metrics={conversionMetrics} />

      {/* Analytics & Measurement Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">📊</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-text-primary mb-4">
              Tracking Agent Traffic: What Works & What Doesn't
            </h4>
            <p className="text-text-secondary leading-relaxed mb-6">
              Measuring agentic search performance requires <span className="font-semibold text-text-primary">new 
              methods</span>. Traditional analytics often miss agent visits, and rank tracking tools don't capture 
              agent result placements.
            </p>

            {/* What You CAN Track */}
            <div className="panel-inset p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">✅</span>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-text-primary mb-3">What You CAN Track</h5>
                  
                  <div className="space-y-4">
                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <h6 className="font-bold text-text-primary text-sm mb-2">🔗 Desktop Chrome Traffic Spikes</h6>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        ChatGPT agents primarily use <strong className="text-text-primary">desktop Chrome user-agents</strong>. 
                        Watch for unusual desktop traffic increases—these are often agent visits.
                      </p>
                      <p className="text-xs text-text-muted italic">
                        Filter GA4 reports by "Desktop + Chrome" to isolate agent-likely traffic.
                      </p>
                    </div>

                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <h6 className="font-bold text-text-primary text-sm mb-2">🖥️ Server-Side Analytics</h6>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        <strong className="text-text-primary">Critical for text-based browsers:</strong> Server logs, 
                        Cloudflare Analytics, and CDN metrics capture agent traffic even when JavaScript is blocked.
                      </p>
                      <ul className="text-sm text-text-secondary space-y-1 ml-4 list-disc">
                        <li><strong className="text-text-primary">Web server logs:</strong> Apache/Nginx logs show all requests with user-agents, IPs, paths</li>
                        <li><strong className="text-text-primary">Cloudflare Analytics:</strong> Tracks requests, bandwidth, bot traffic before it hits your server</li>
                        <li><strong className="text-text-primary">CDN analytics:</strong> Fastly, Akamai, CloudFront capture agent requests globally</li>
                        <li><strong className="text-text-primary">Request patterns:</strong> Agents batch requests within seconds—look for rapid sequential page views</li>
                      </ul>
                    </div>

                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <h6 className="font-bold text-text-primary text-sm mb-2">🤖 Bot Log Analysis</h6>
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">
                        Parse server logs to identify agent behavior patterns:
                      </p>
                      <ul className="text-sm text-text-secondary space-y-1 ml-4 list-disc">
                        <li><strong className="text-text-primary">User-agent filtering:</strong> Look for "ChatGPT", "GPTBot", desktop Chrome signatures</li>
                        <li><strong className="text-text-primary">Conversion paths:</strong> Which pages agents visit before checkout</li>
                        <li><strong className="text-text-primary">Abandonment points:</strong> Where agents bounce (often broken forms, CAPTCHAs)</li>
                        <li><strong className="text-text-primary">Session reconstruction:</strong> Track full journeys from landing to conversion or exit</li>
                      </ul>
                    </div>

                    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
                      <h6 className="font-bold text-text-primary text-sm mb-2">📈 Client-Side Analytics (When Available)</h6>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        <strong className="text-text-primary">GA4 works for visual browsers:</strong> Use <code className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-xs font-mono">utm_source=chatgpt.com</code> where 
                        possible. Track conversion rates and paths separately from traditional organic traffic. Note: Only captures ~54% of agent visits (those using visual browsers).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You CAN'T Track */}
            <div className="panel-inset p-6 mb-6 bg-gradient-to-r from-[#ef4444]/5 to-[#dc2626]/5 border-l-4 border-[#ef4444]">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-text-primary mb-3">What You CAN'T Track (Yet)</h5>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-text-primary font-bold flex-shrink-0">❌</span>
                        <p className="text-text-secondary">
                          <strong className="text-text-primary">Client-side analytics for text browsers:</strong> 46% of agent visits 
                          use text-only browsers that block JavaScript—GA4/client-side scripts don't run.
                        </p>
                      </div>
                      <div className="ml-6 p-3 bg-[#10b981]/10 rounded border-l-2 border-[#10b981]">
                        <p className="text-sm text-text-secondary">
                          <span className="font-bold text-[#10b981]">✓ Solution:</span> Use server logs, Cloudflare Analytics, or CDN metrics instead—they capture 100% of traffic.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-text-primary font-bold flex-shrink-0">❌</span>
                      <p>
                        <strong className="text-text-primary">Bing API query data:</strong> ChatGPT queries to Bing 
                        API aren't visible in Bing Webmaster Tools—you can't see what queries triggered your products.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-text-primary font-bold flex-shrink-0">❌</span>
                      <p>
                        <strong className="text-text-primary">Reliable rank tracking:</strong> Agent results fluctuate 
                        hour-by-hour. Traditional "position 3 on query X" snapshots are meaningless.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border-l-4 border-[#6366f1] rounded-lg p-5">
              <h5 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Analytics Best Practices</span>
              </h5>
              <ol className="space-y-3 text-text-secondary text-sm">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">1.</span>
                  <div>
                    <strong className="text-text-primary">Focus on conversions, not vanity metrics.</strong> Request 
                    count ≠ visits. Measure actual checkout completions, not page views.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">2.</span>
                  <div>
                    <strong className="text-text-primary">Track trends over time, not snapshots.</strong> Compare 
                    week-over-week agent traffic growth, not hour-by-hour fluctuations.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">3.</span>
                  <div>
                    <strong className="text-text-primary">Use server-side analytics as source of truth.</strong> Server 
                    logs, Cloudflare Analytics, and CDN metrics capture 100% of agent traffic—even text-based browsers. 
                    Client-side tools (GA4) only see ~54% of visits.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-text-primary flex-shrink-0">4.</span>
                  <div>
                    <strong className="text-text-primary">Monitor abandonment patterns.</strong> If agents consistently 
                    bounce on your checkout page, you have a convertibility problem (captchas, complex forms).
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Agent Readiness Checker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="panel-surface p-8"
      >
        <AgentReadinessChecker />
      </motion.div>

      {/* Conversion Optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.45 }}
        className="panel-surface p-8"
      >
        <ConversionOptimization />
      </motion.div>

      {/* Monetization Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">🚀</div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-text-primary mb-4">
              What's Next: The Agent Search Timeline
            </h4>
            <p className="text-text-secondary leading-relaxed mb-6">
              Agent search is evolving <span className="font-semibold text-text-primary">rapidly</span>. Understanding 
              the roadmap helps you prepare for what's coming.
            </p>

            {/* Timeline */}
            <div className="space-y-4">
              {/* Now (Oct 2025) */}
              <div className="panel-inset p-5 border-l-4 border-[#10b981]">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold">
                      NOW
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-text-primary mb-2">October 2025</h5>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      <strong className="text-[#10b981]">ChatGPT Shopping (Organic)</strong> — Free product recommendations. 
                      No ads or paid placements. Agent mode now <strong className="text-text-primary">completes autonomous 
                      transactions</strong> without human approval.
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      <strong className="text-[#10b981]">Instant Checkout Beta</strong> — Etsy, Shopify partners testing 
                      in-chat purchasing. Users buy without leaving ChatGPT.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2026 */}
              <div className="panel-inset p-5 border-l-4 border-[#f59e0b]">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold text-sm">
                      2026
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-text-primary mb-2">2026 (Expected)</h5>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      <strong className="text-[#f59e0b]">Ads & Sponsored Placements</strong> — OpenAI monetization begins. 
                      Expect auction-based sponsored product slots, similar to Google Shopping ads.
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      <strong className="text-[#f59e0b]">Shopify Full Integration</strong> — Major e-commerce platforms 
                      enable native agent checkout flows. Commission-based partnerships expand.
                    </p>
                    <p className="text-text-secondary text-sm italic">
                      💡 <strong className="text-text-primary">Strategy:</strong> Establish organic presence NOW before 
                      ad auction competition drives costs up.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2028 */}
              <div className="panel-inset p-5 border-l-4 border-[#6366f1]">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#6366f1] text-white flex items-center justify-center font-bold text-sm">
                      2028
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-text-primary mb-2">2028 Prediction</h5>
                    <p className="text-text-secondary text-sm leading-relaxed mb-2">
                      <strong className="text-[#6366f1]">AI Search Surpasses Traditional Search</strong> — Semrush predicts 
                      <span className="font-bold text-text-primary"> agentic search visitors will exceed traditional search engine 
                      visitors</span> by 2028.
                    </p>
                    <p className="text-text-secondary text-sm italic">
                      This is the tipping point—agent optimization becomes mainstream, not experimental.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preparing for Paid Placements Callout */}
            <div className="mt-6 bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border-l-4 border-[#ef4444] rounded-lg p-5">
              <h5 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                <span>⚠️</span>
                <span>Preparing for Paid Placements</span>
              </h5>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">
                While results are <strong className="text-text-primary">organic today</strong>, monetization is coming. 
                History repeats itself:
              </p>
              <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)] mb-3">
                <p className="text-sm text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Google Shopping parallel:</strong> Started as free product 
                  listings (2002-2012), then shifted to paid-only model. Early adopters built brand presence before 
                  auction competition heated up.
                </p>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                <strong className="text-text-primary">Your advantage:</strong> Build brand salience and agent familiarity 
                <span className="font-semibold text-[#ef4444]"> while competition is low</span>. When ads launch, you'll have 
                established trust and visibility that new entrants must pay to acquire.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Known Limitations */}
      <LimitationsPanel limitations={commonLimitations} />

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="panel-surface p-8 border-l-4 border-accent-primary"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚀</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-3">
              Start Optimizing Today
            </h4>
            <p className="text-text-secondary mb-4 leading-relaxed">
              These principles apply whether you're selling products, offering services, or building APIs. 
              The shift to agentic search is happening now — early optimizers will establish dominance 
              before the space becomes crowded.
            </p>
            <div className="space-y-2 text-text-secondary">
              <p className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span><strong>Products:</strong> Implement structured schema, enrich feeds, gather reviews</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span><strong>Services:</strong> Document capabilities clearly, build case studies, maintain presence</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span><strong>APIs:</strong> Publish MCP manifests, provide clear documentation, track agent usage</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Sources & Further Reading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.7 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Data Sources */}
        <div className="panel-inset p-6">
          <h5 className="text-lg font-bold text-text-primary mb-4 text-center">📚 Data Sources</h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <p className="font-bold text-text-primary mb-2">
                <a 
                  href="https://searchengineland.com/chatgpt-shopping-ecommerce-seo-optimization-guide-449583"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  Wasim Kagzi (Oct 2, 2025)
                </a>
              </p>
              <p className="text-text-secondary text-xs">
                "ChatGPT Shopping is here — and it's changing ecommerce SEO rules"
                <span className="block mt-1 italic">Source: SearchEngineLand. FEED framework, conversion metrics, optimization guidance.</span>
              </p>
            </div>

            <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <p className="font-bold text-text-primary mb-2">
                <a 
                  href="https://searchengineland.com/chatgpt-agent-mode-analysis-100-conversations-450123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  Jes Scholz (Oct 8, 2025)
                </a>
              </p>
              <p className="text-text-secondary text-xs">
                "100 conversations with ChatGPT Agent mode"
                <span className="block mt-1 italic">Source: SearchEngineLand. Agent behavior analysis, Bing API usage (92%), first result dominance (63%).</span>
              </p>
            </div>

            <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <p className="font-bold text-text-primary mb-2">
                <a 
                  href="https://www.seerinteractive.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  Seer Interactive (2025)
                </a>
              </p>
              <p className="text-text-secondary text-xs">
                Conversion rate research
                <span className="block mt-1 italic">ChatGPT Shopping: 15.9% conversion rate vs Google Organic: 1.8%.</span>
              </p>
            </div>

            <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <p className="font-bold text-text-primary mb-2">
                <a 
                  href="https://www.semrush.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  Semrush (2025)
                </a>
              </p>
              <p className="text-text-secondary text-xs">
                LLM visitor value study
                <span className="block mt-1 italic">4.4x average LLM visitor worth vs organic. Prediction: AI search surpasses traditional search by 2028.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Further Reading */}
        <div className="panel-inset p-6 bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 border-l-4 border-[#6366f1]">
          <h5 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <span>📖</span>
            <span>Further Reading & Resources</span>
          </h5>
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <p className="mb-2">
                <strong className="text-text-primary">Stay Current:</strong> The agentic search landscape evolves rapidly. 
                Follow these resources for ongoing insights:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary font-bold">→</span>
                  <div>
                    <a 
                      href="https://searchengineland.com/category/ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-primary hover:underline font-medium"
                    >
                      Search Engine Land - AI & Search Section
                    </a>
                    <span className="block text-xs text-text-muted">Industry-leading coverage of AI search developments, case studies, and optimization tactics.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary font-bold">→</span>
                  <div>
                    <span className="text-text-primary font-medium">GEO (Generative Engine Optimization)</span>
                    <span className="block text-xs text-text-muted">Emerging discipline focused on optimizing for AI-generated answers. Watch for academic research and practitioner guides.</span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-primary font-bold">→</span>
                  <div>
                    <a 
                      href="https://www.bing.com/webmasters/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-primary hover:underline font-medium"
                    >
                      Bing Webmaster Tools
                    </a>
                    <span className="block text-xs text-text-muted">Essential for product feed submission and Bing Shopping optimization (gateway to ChatGPT agent traffic).</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)]">
              <p className="text-xs italic">
                <strong className="text-text-primary">Note:</strong> The agentic search landscape is evolving rapidly. 
                While core principles (FEED framework, Bing API dominance, variant standardization) remain sound, specific 
                metrics and platform features may change as ChatGPT Shopping, Agent mode, and competing platforms mature.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
