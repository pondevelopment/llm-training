import { motion } from 'framer-motion';
import { feedFramework, conversionMetrics, commonLimitations } from '../../data/optimizationTips';
import { FEEDCard } from './FEEDCard';
import { MetricsPanel } from './MetricsPanel';
import { LimitationsPanel } from './LimitationsPanel';

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

      {/* Conversion Metrics */}
      <MetricsPanel metrics={conversionMetrics} />

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

      {/* Data Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.7 }}
        className="panel-inset p-4 max-w-3xl mx-auto text-center"
      >
        <p className="text-xs text-muted mb-2">
          <strong>Data Source:</strong> Metrics and insights from ChatGPT Shopping (launched April 2025), 
          Seer Interactive study, Semrush research, and{' '}
          <a 
            href="https://searchengineland.com/chatgpt-shopping-ecommerce-seo-optimization-guide-449583"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline font-medium"
          >
            SearchEngineLand analysis (October 2025)
          </a>.
        </p>
        <p className="text-xs text-muted">
          The agentic search landscape is evolving rapidly — principles remain sound, but specific 
          numbers may change as platforms mature.
        </p>
      </motion.div>
    </div>
  );
}
