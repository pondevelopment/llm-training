import { motion } from 'framer-motion';
import { takeaways } from '../../data/takeaways';
import { faqData } from '../../data/faqData';
import { TakeawayCard } from './TakeawayCard';
import { FAQItemComponent } from './FAQItem';

/**
 * SummarySection (Phase 5)
 * 
 * Final section that recaps key learnings and answers common questions.
 * 
 * Structure:
 * 1. Introduction with celebration
 * 2. Key Takeaways (6 cards)
 * 3. FAQ (10 collapsible items)
 * 4. Call-to-action for building agent-friendly services
 * 
 * Features:
 * - Staggered animation for takeaway cards
 * - Expandable FAQ items
 * - Clean, scannable layout
 */
export function SummarySection() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="text-6xl mb-4">🎓</div>
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          What You've Learned
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed">
          You've completed the agentic search tutorial! You now understand how AI agents 
          plan research, discover tools, and deliver goal-oriented results. Let's recap 
          the key concepts and answer common questions.
        </p>
      </motion.div>

      {/* Key Takeaways */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            💡 Key Takeaways
          </h3>
          <p className="text-text-secondary">
            Six essential concepts that define agentic search
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {takeaways.map((takeaway, index) => (
            <TakeawayCard key={takeaway.id} takeaway={takeaway} index={index} />
          ))}
        </div>
      </section>

      {/* Call to Action for Builders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="panel-inset p-8 border-l-4 border-accent-primary"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🛠️</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-3">
              Make Your Service Agent-Friendly
            </h4>
            <p className="text-text-secondary mb-4 leading-relaxed">
              If you're building an API or service, consider making it discoverable to AI agents. 
              Publish a <code className="px-2 py-1 bg-surface-secondary rounded text-accent-primary font-mono text-sm">/.well-known/mcp.json</code> manifest, 
              structure your responses in clean JSON, and provide clear documentation. 
              As agentic search grows, agent-friendly services will gain a significant distribution advantage.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="chip-accent px-3 py-1 text-sm">More discoverability</span>
              <span className="chip-accent px-3 py-1 text-sm">Higher API usage</span>
              <span className="chip-accent px-3 py-1 text-sm">Future-proof integration</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            ❓ Frequently Asked Questions
          </h3>
          <p className="text-text-secondary">
            Common questions about agentic search, tools, and implementation
          </p>
        </motion.div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {faqData.map((item, index) => (
            <FAQItemComponent key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Final Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="panel-surface p-8 text-center max-w-2xl mx-auto"
      >
        <div className="text-5xl mb-4">🚀</div>
        <h4 className="text-2xl font-bold text-text-primary mb-3">
          Ready to Build?
        </h4>
        <p className="text-text-secondary leading-relaxed">
          You now have the foundation to understand, design, and build with agentic search. 
          Whether you're creating agent-powered products, making your APIs discoverable, or 
          just exploring this exciting space—you're equipped with the core concepts that will 
          shape the next generation of search and research tools.
        </p>
      </motion.div>
    </div>
  );
}
