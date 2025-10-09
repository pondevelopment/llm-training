import { motion } from 'framer-motion';
import { SectionPreviewCard } from './SectionPreviewCard';

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
            Master <span className="text-accent">Agentic Search</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-body leading-relaxed mb-8 max-w-3xl mx-auto">
            Learn how AI agents discover tools, plan multi-step research, and deliver 
            goal-oriented results—transforming search from link lists into intelligent workflows.
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
            <div className="text-4xl">🚴‍♂️</div>
            <div>
              <p className="font-semibold text-heading">Real-World Example</p>
              <p className="text-sm text-muted">Find the best beginner road bike under $1,500</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-semibold text-heading">Traditional Search</p>
                <p className="text-muted">Returns 10 blue links → You do all the work</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="font-semibold text-heading">Agentic Search</p>
                <p className="text-muted">Plans research → Discovers tools → Delivers answer</p>
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
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: '🔄', title: 'Search Comparison', desc: 'Traditional vs Agentic approaches' },
              { icon: '🧰', title: 'Tool Discovery', desc: 'How agents find and use APIs' },
              { icon: '📋', title: 'MCP Protocol', desc: 'Standardized tool manifests' },
              { icon: '⚡', title: 'Live Workflow', desc: 'Step-by-step simulation' },
              { icon: '🎯', title: 'Optimization', desc: 'FEED framework & conversion tactics' }
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
              icon="🔍"
              title="Section 1: Search Comparison"
              description="See the difference between traditional and agentic search side-by-side"
              features={[
                'Independent step-through controls',
                'Real bike search example',
                'Understand the 5-step agentic flow'
              ]}
              delay={0.1}
            />
            
            <SectionPreviewCard
              icon="🧰"
              title="Section 2: Toolbox Explorer"
              description="Explore 8 different tools agents use for research and analysis"
              features={[
                'Interactive tool cards',
                'Detailed capabilities and use cases',
                'Example API calls and outputs'
              ]}
              delay={0.2}
            />
            
            <SectionPreviewCard
              icon="📋"
              title="Section 3: MCP Discovery"
              description="Learn how agents discover and use tools via Model Context Protocol"
              features={[
                'Animated discovery simulator',
                'Interactive manifest explorer',
                'Real pon.bike API example'
              ]}
              delay={0.3}
            />

            <SectionPreviewCard
              icon="🎬"
              title="Section 4: Scenario Player"
              description="Watch an agent plan Q4 content strategy for a bike shop from start to finish"
              features={[
                'Auto-play workflow simulation',
                'See tool calls and reasoning',
                'Trace insights to their sources'
              ]}
              delay={0.4}
            />

            <SectionPreviewCard
              icon="🎓"
              title="Section 5: Takeaways & FAQ"
              description="Recap key concepts and get answers to common questions about agentic search"
              features={[
                '6 essential takeaways',
                '10 frequently asked questions',
                'Action steps for building agent-friendly services'
              ]}
              delay={0.5}
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
                    <li>• Anyone curious about agentic AI</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-semibold text-heading mb-2">📚 Prerequisites:</p>
                  <ul className="space-y-1 text-body">
                    <li>• No coding required!</li>
                    <li>• Basic understanding of web search</li>
                    <li>• Curiosity about AI capabilities</li>
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
            Start the interactive tutorial and experience how agentic search transforms 
            the way we find and synthesize information.
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
    </div>
  );
}
