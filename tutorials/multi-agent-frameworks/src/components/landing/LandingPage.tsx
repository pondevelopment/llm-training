import { motion } from 'framer-motion';
import { SectionPreviewCard } from './SectionPreviewCard';
import { GOOGLE_BLOG_SOURCE_URL } from '../../data/sources';

interface LandingPageProps {
  onStartTutorial: () => void;
}

export function LandingPage({ onStartTutorial }: LandingPageProps) {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <span className="chip chip-info text-sm">Interactive Tutorial</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-heading mb-6 leading-tight">
            Master <span className="text-accent">Multi-Agent Frameworks</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-body leading-relaxed mb-8 max-w-3xl mx-auto">
            Learn production-grade patterns for building multi-agent systems that stay fast, reliable,
            and debuggable by treating context as an engineered system (not a giant prompt).
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={onStartTutorial}
            className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Interactive Tutorial →
          </motion.button>

          <p className="text-sm text-muted mt-4">
            ⏱️ Estimated time: 15-20 minutes • 📱 Works on all devices
          </p>
        </motion.div>

        {/* Animated Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 panel p-8 text-left max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🏗️</div>
            <div>
              <p className="font-semibold text-heading">Real-World Example</p>
              <p className="text-sm text-muted">A multi-agent workflow that runs for hours</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧾</span>
              <div>
                <p className="font-semibold text-heading">Naive Context Strategy</p>
                <p className="text-muted">Append everything → costs grow, signal degrades</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-semibold text-heading">Context Engineering</p>
                <p className="text-muted">Store state → compile a scoped view per call</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What You'll Learn */}
      <section className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-heading text-center mb-8">
            What You'll Learn
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { icon: '📉', title: 'Scaling Bottleneck', desc: 'Why giant prompts fail in prod' },
              { icon: '🗂️', title: 'Tiered Context', desc: 'Working context vs session vs memory' },
              { icon: '🧩', title: 'Processors', desc: 'A pipeline that compiles context' },
              { icon: '🎯', title: 'Relevance', desc: 'Artifacts + memory on demand' },
              { icon: '🤝', title: 'Multi-Agent Handoffs', desc: 'Scope what sub-agents see' },
              { icon: '🧪', title: 'Debuggability', desc: 'Structured events + observability' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="panel panel-info p-4 text-center"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="font-semibold text-heading text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section Previews */}
      <section className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-heading text-center mb-4">
            Tutorial Sections
          </h2>
          <p className="text-center text-body mb-12 max-w-2xl mx-auto">
            Each section builds on the last, taking you from basic concepts to hands-on exploration
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SectionPreviewCard
              icon="📉"
              title="Section 1: Scaling Bottleneck"
              description="Understand why 'just add more tokens' breaks down"
              features={[
                'Cost and latency growth',
                'Signal degradation (lost in the middle)',
                'Why fixed windows still overflow'
              ]}
              delay={0.1}
            />
            
            <SectionPreviewCard
              icon="🗂️"
              title="Section 2: Tiered Context"
              description="Learn the layer model used by production agent frameworks"
              features={[
                'Working context vs session vs memory vs artifacts',
                'Storage vs presentation separation',
                'Why this unlocks scaling'
              ]}
              delay={0.2}
            />
            
            <SectionPreviewCard
              icon="🧩"
              title="Section 3: Flows & Processors"
              description="Treat context building like a compiler pipeline"
              features={[
                'Ordered processing passes',
                'Insertion points for filtering/compaction',
                'Make transformations observable'
              ]}
              delay={0.3}
            />

            <SectionPreviewCard
              icon="🎯"
              title="Section 4: Relevance"
              description="Keep the model focused on what matters now"
              features={[
                'Artifacts: handle pattern for large data',
                'Memory: searchable long-term knowledge',
                'Agent-directed retrieval'
              ]}
              delay={0.4}
            />

            <SectionPreviewCard
              icon="🤝"
              title="Section 5: Multi-Agent Context"
              description="Avoid context explosion in multi-agent systems"
              features={[
                'Agents-as-tools vs agent transfer',
                'Scoped handoffs by default',
                'Conversation translation to prevent confusion'
              ]}
              delay={0.5}
            />

            <SectionPreviewCard
              icon="🎓"
              title="Section 6: Takeaways"
              description="A practical checklist you can apply to your own framework"
              features={[
                'Context as a compiled view',
                'Structure + relevance + scoped handoffs',
                'Design for caching and observability'
              ]}
              delay={0.6}
            />
          </div>
        </motion.div>
      </section>

      {/* Who Is This For */}
      <section className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="panel panel-info p-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">👥</div>
            <div>
              <h3 className="text-2xl font-bold text-heading mb-4">
                Who Is This Tutorial For?
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="font-semibold text-heading mb-2">✅ Perfect for:</p>
                  <ul className="space-y-1 text-body">
                    <li>• Product managers exploring AI features</li>
                    <li>• Engineers building agent systems</li>
                    <li>• Business leaders evaluating AI tools</li>
                    <li>• Anyone shipping multi-step AI workflows</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-heading mb-2">📚 Prerequisites:</p>
                  <ul className="space-y-1 text-body">
                    <li>• No coding required!</li>
                    <li>• Familiarity with chat-based AI (helpful)</li>
                    <li>• Curiosity about production reliability</li>
                    <li>• 15-20 minutes of focused time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="text-center max-w-3xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="panel panel-warning p-8"
        >
          <h3 className="text-2xl font-bold text-heading mb-4">
            Ready to Dive In?
          </h3>
          <p className="text-body mb-6 leading-relaxed">
            Start the interactive tutorial and learn practical patterns for keeping multi-agent systems
            fast, scoped, and debuggable.
          </p>
          
          <motion.button
            onClick={onStartTutorial}
            className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Tutorial →
          </motion.button>
        </motion.div>
      </section>

      {/* Sources */}
      <section className="max-w-4xl mx-auto">
        <div className="panel p-6 space-y-3">
          <h3 className="text-xl font-bold text-heading">📝 Source</h3>
          <p className="text-body">
            This tutorial is an educational, framework-agnostic walkthrough inspired by:
          </p>
          <p className="text-sm text-muted">
            <a
              className="link-primary hover:underline"
              href={GOOGLE_BLOG_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Architecting efficient context-aware multi-agent framework for production ↗
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
