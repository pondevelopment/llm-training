import { motion } from 'framer-motion';

type ViewType = 'landing' | 'methods' | 'slms' | 'forgetting' | 'pricing';

interface LandingPageProps {
  onNavigate: (view: ViewType) => void;
}

const sections = [
  {
    id: 'methods' as ViewType,
    icon: '🔧',
    title: 'Fine-Tuning Methods',
    description: 'Explore SFT, LoRA, QLoRA, and DPO with interactive parameter simulators',
    features: ['LoRA rank slider with VRAM impact', 'Method comparison cards', 'Memory vs quality trade-offs'],
    color: 'info',
  },
  {
    id: 'slms' as ViewType,
    icon: '🧠',
    title: 'Small Language Models',
    description: 'Compare SLMs and see when smaller beats bigger',
    features: ['Model size comparator', 'Domain specialization examples', 'Cost-efficiency analysis'],
    color: 'success',
  },
  {
    id: 'forgetting' as ViewType,
    icon: '📉',
    title: 'Catastrophic Forgetting',
    description: 'Visualize how models forget and how to prevent it',
    features: ['Interactive forgetting curve', 'Mitigation technique toggle', 'Phase-by-phase breakdown'],
    color: 'warning',
  },
  {
    id: 'pricing' as ViewType,
    icon: '💰',
    title: 'Pricing Calculator',
    description: 'Calculate fine-tuning costs across providers',
    features: ['Multi-provider comparison', 'Token vs hourly pricing', 'Cloud vs buy break-even'],
    color: 'neutral',
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
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
            Master <span className="text-accent">LLM Fine-Tuning</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-body leading-relaxed mb-8 max-w-3xl mx-auto">
            Learn how to adapt pre-trained language models to your specific tasks,
            domains, and data — making them better at what you need.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { label: '4 Sections', icon: '📚' },
              { label: 'Interactive Simulators', icon: '🎛️' },
              { label: '~20 min', icon: '⏱️' },
            ].map((stat, i) => (
              <div key={i} className="panel panel-neutral-soft px-4 py-2 flex items-center gap-2">
                <span>{stat.icon}</span>
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What is Fine-Tuning? Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 panel panel-neutral p-6 sm:p-8 text-left max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>🤔</span> What is Fine-Tuning?
          </h2>
          
          <p className="text-body mb-6">
            Large Language Models (LLMs) like GPT-4, Llama, or Mistral are trained on massive amounts of general text. 
            <strong> Fine-tuning</strong> is the process of taking a pre-trained model and training it further on your 
            specific data to make it better at your particular use case.
          </p>

          {/* Visual: Before/After */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="panel panel-neutral-soft p-4">
              <p className="text-sm font-semibold text-muted mb-2">📥 Before Fine-Tuning</p>
              <p className="text-sm text-body">Generic model trained on internet text</p>
              <p className="text-xs text-muted mt-2 italic">"Knows a little about everything"</p>
            </div>
            <div className="panel panel-success p-4">
              <p className="text-sm font-semibold text-muted mb-2">📤 After Fine-Tuning</p>
              <p className="text-sm text-body">Specialized for your domain/task</p>
              <p className="text-xs text-muted mt-2 italic">"Expert in your specific area"</p>
            </div>
          </div>

          {/* Example Use Cases */}
          <div className="text-sm">
            <p className="font-semibold text-heading mb-2">Example use cases:</p>
            <ul className="space-y-1 text-body">
              <li>• <strong>Legal AI:</strong> Train on case law → accurate legal research assistant</li>
              <li>• <strong>Customer support:</strong> Train on your docs → on-brand responses</li>
              <li>• <strong>Code assistant:</strong> Train on your codebase → understands your patterns</li>
              <li>• <strong>Medical:</strong> Train on clinical data → domain-specific accuracy</li>
            </ul>
          </div>
        </motion.div>

        {/* The Problem: Traditional Fine-Tuning is Expensive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 panel panel-warning p-6 sm:p-8 text-left max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>💸</span> The Problem: Traditional Fine-Tuning Was Expensive
          </h2>
          
          <p className="text-body mb-4">
            Until recently, fine-tuning meant updating <strong>every single parameter</strong> in the model. 
            A 7 billion parameter model has 7,000,000,000 numbers to adjust — requiring massive GPU memory 
            and compute power that only big tech companies could afford.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="panel panel-neutral-soft p-3">
              <p className="text-2xl font-bold text-heading">28 GB</p>
              <p className="text-xs text-muted">VRAM needed for 7B model</p>
            </div>
            <div className="panel panel-neutral-soft p-3">
              <p className="text-2xl font-bold text-heading">$10K+</p>
              <p className="text-xs text-muted">GPU cluster rental</p>
            </div>
            <div className="panel panel-neutral-soft p-3">
              <p className="text-2xl font-bold text-heading">Days</p>
              <p className="text-xs text-muted">Training time</p>
            </div>
          </div>
        </motion.div>

        {/* The Solution: LoRA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 panel panel-success p-6 sm:p-8 text-left max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>✨</span> The Breakthrough: LoRA (Low-Rank Adaptation)
          </h2>
          
          <p className="text-body mb-4">
            <strong>LoRA</strong> is a clever technique that <em>freezes</em> the original model weights and only trains 
            small "adapter" layers that sit alongside them. Instead of updating 7 billion parameters, 
            you only train <strong>0.1-1%</strong> of them.
          </p>

          {/* Visual explanation */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="panel panel-neutral-soft p-4">
              <p className="text-sm font-semibold text-muted mb-2">❌ Full Fine-Tuning</p>
              <div className="space-y-1 text-sm">
                <p className="text-body">Update all 7B parameters</p>
                <p className="text-body">Needs 28GB+ VRAM</p>
                <p className="text-body">Creates 14GB checkpoint file</p>
              </div>
            </div>
            <div className="panel panel-success p-4 border-2 border-green-500/30">
              <p className="text-sm font-semibold text-muted mb-2">✅ LoRA</p>
              <div className="space-y-1 text-sm">
                <p className="text-body">Update only ~70M parameters</p>
                <p className="text-body">Needs 6-10GB VRAM</p>
                <p className="text-body">Creates ~100MB adapter file</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted italic">
            Think of it like this: instead of rewriting an entire book, you're adding sticky notes with corrections. 
            The original book stays intact, and the notes customize it for your needs.
          </p>
        </motion.div>

        {/* Why Now? */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 panel panel-info p-6 sm:p-8 text-left max-w-3xl mx-auto"
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>🚀</span> Why 2026 is the Year of Fine-Tuning
          </h2>
          
          <p className="text-body mb-4">
            LoRA was just the start. Three trends have converged to make fine-tuning accessible to everyone:
          </p>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-xl">💾</span>
              <div>
                <p className="text-body"><strong>QLoRA adds 4-bit quantization</strong> — fine-tune a 70B model on a single consumer GPU (24GB)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-body"><strong>Small models beat giants in domains</strong> — a fine-tuned 7B model often outperforms GPT-4 on specialized tasks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">☁️</span>
              <div>
                <p className="text-body"><strong>Serverless GPUs from $0.40/hr</strong> — Modal, RunPod, and Together AI handle all infrastructure</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-body flex items-start gap-2">
              <span>⚠️</span>
              <span><strong>One catch:</strong> Fine-tuning can make your model "forget" general knowledge. We'll cover how to prevent that, along with choosing the right method and understanding the costs.</span>
            </p>
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
              { icon: '🔧', title: 'LoRA & QLoRA', desc: 'Parameter-efficient fine-tuning' },
              { icon: '⚖️', title: 'DPO Alignment', desc: 'Preference optimization without reward models' },
              { icon: '🧠', title: 'SLMs', desc: 'When smaller is better' },
              { icon: '📉', title: 'Forgetting', desc: 'Mitigation techniques' },
              { icon: '💰', title: 'Economics', desc: 'Token vs hourly pricing' },
              { icon: '☁️', title: 'Infrastructure', desc: 'Cloud vs buy decisions' }
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

      {/* Section Cards */}
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
            Each section includes interactive simulators to build intuition
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className={`panel panel-${section.color} p-6 text-left interactive-card hover:shadow-lg transition-all w-full`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{section.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-heading mb-2">{section.title}</h3>
                    <p className="text-body text-sm mb-4">{section.description}</p>
                    <ul className="space-y-1">
                      {section.features.map((feature, i) => (
                        <li key={i} className="text-xs text-muted flex items-center gap-2">
                          <span className="text-accent">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-accent text-2xl">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-muted text-sm mb-4">Ready to start?</p>
          <motion.button
            onClick={() => onNavigate('methods')}
            className="btn-primary text-xl px-10 py-5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start with Fine-Tuning Methods →
          </motion.button>
        </motion.div>
      </section>

      {/* Sources Note */}
      <section className="max-w-2xl mx-auto text-center">
        <p className="text-xs text-muted">
          Data sourced from Together AI, Oxen.ai, Modal, RunPod, Anyscale, and research papers (NeurIPS 2025, EMNLP 2025).
          <br />
          Pricing and benchmarks as of February 2026. Verify current rates with providers.
        </p>
      </section>
    </div>
  );
}
