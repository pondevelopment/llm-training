import { motion } from 'framer-motion';
import { Panel } from './shared/Panel';

interface CompletionSectionProps {
  onRestart: () => void;
  onGoToTutorials: () => void;
}

export function CompletionSection({ onRestart, onGoToTutorials }: CompletionSectionProps) {
  const learnings = [
    {
      icon: '🔧',
      title: 'Fine-Tuning Methods',
      points: [
        'LoRA trains <1% of parameters, reducing GPU needs by 10x',
        'QLoRA adds 4-bit quantization for 70B models on consumer GPUs',
        'Full fine-tuning still wins for maximum performance',
        'DPO aligns models to human preferences without reward models',
      ],
    },
    {
      icon: '📱',
      title: 'Small Language Models',
      points: [
        'SLMs (1-7B) can match GPT-4 quality on specialized tasks',
        'Fine-tuned SLMs run on-device for privacy and latency',
        'Cost savings of 10-100x vs API calls at scale',
        'Models like Qwen 2.5 and Phi-3 lead the efficiency frontier',
      ],
    },
    {
      icon: '🧠',
      title: 'Catastrophic Forgetting',
      points: [
        'Models lose general knowledge when learning new tasks',
        'EWC, replay buffers, and LoRA help preserve base capabilities',
        'Forgetting hits task-specific, linguistic, and factual knowledge',
        'Testing before/after on benchmark suites is essential',
      ],
    },
    {
      icon: '💰',
      title: 'Pricing & Providers',
      points: [
        'Token-based pricing (Together AI) simplifies cost estimation',
        'Hourly GPU rental (Modal, RunPod) gives more control',
        'LoRA fine-tuning of 7B models costs <$10 for small datasets',
        'Enterprise 70B+DPO jobs can run $3,000+ for large corpora',
      ],
    },
  ];

  const nextSteps = [
    {
      icon: '📚',
      title: 'Prepare Your Data',
      description: 'Collect and format training examples in JSONL format with instruction/response pairs.',
      link: null,
    },
    {
      icon: '🧪',
      title: 'Run a Pilot',
      description: 'Start with 100-500 examples on a 7B model. Validate quality before scaling.',
      link: null,
    },
    {
      icon: '📊',
      title: 'Build Eval Suite',
      description: 'Create task-specific benchmarks plus general capability tests to detect forgetting.',
      link: null,
    },
    {
      icon: '🚀',
      title: 'Deploy & Monitor',
      description: 'Use vLLM or TGI for inference. Track latency, quality, and cost per request.',
      link: null,
    },
  ];

  const relatedTutorials = [
    {
      title: 'Agentic Search',
      description: 'Build AI agents that search, reason, and synthesize information',
      href: '../agentic-search/dist/index.html',
    },
    {
      title: 'Multi-Agent Frameworks',
      description: 'Orchestrate multiple AI agents for complex workflows',
      href: '../multi-agent-frameworks/dist/index.html',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Celebration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
          Tutorial Complete!
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">
          You've mastered the fundamentals of LLM fine-tuning. Here's what you learned and where to go next.
        </p>
      </motion.div>

      {/* What You Learned */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <span>📝</span> What You Learned
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {learnings.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Panel variant="neutral-soft" className="p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="font-bold text-heading">{section.title}</h3>
                </div>
                <ul className="space-y-2 text-sm text-body">
                  {section.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-success shrink-0">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <span>🚀</span> Next Steps
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nextSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <Panel variant="info" className="p-4 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{step.icon}</span>
                  <span className="text-xs text-muted font-mono">Step {i + 1}</span>
                </div>
                <h3 className="font-bold text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Related Tutorials */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <span>📖</span> Continue Learning
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {relatedTutorials.map((tutorial) => (
            <a
              key={tutorial.title}
              href={tutorial.href}
              className="block transition-all hover:scale-[1.02]"
            >
              <Panel variant="success" className="p-4 h-full">
                <h3 className="font-bold text-heading mb-2">{tutorial.title}</h3>
                <p className="text-sm text-body mb-3">{tutorial.description}</p>
                <span className="text-accent text-sm font-semibold">Start Tutorial →</span>
              </Panel>
            </a>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-lg border border-divider text-heading hover:bg-card-secondary transition-colors"
        >
          ↺ Review Tutorial
        </button>
        <button
          onClick={onGoToTutorials}
          className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent-strong transition-colors"
        >
          Browse All Tutorials →
        </button>
      </div>

      {/* Share */}
      <div className="text-center text-sm text-muted pt-4 border-t border-divider">
        <p>Found this useful? Share with your team or bookmark for reference.</p>
      </div>
    </div>
  );
}
