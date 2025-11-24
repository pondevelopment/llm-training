import { motion } from 'framer-motion';
import { agenticStrategies } from '../../data/optimizationTips';

export function AgenticStrategiesPanel() {
  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h4 className="text-2xl font-bold text-text-primary mb-2">
          🚀 The $1 Trillion Opportunity
        </h4>
        <p className="text-text-secondary max-w-3xl mx-auto">
          McKinsey projects agentic commerce will drive significant market value by 2030. 
          Here are the strategic shifts required to capture it.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agenticStrategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="panel-surface p-6 flex flex-col h-full"
          >
            <div className="text-4xl mb-4">{strategy.icon}</div>
            <h5 className="text-lg font-bold text-text-primary mb-2">
              {strategy.title}
            </h5>
            <p className="text-text-secondary text-sm mb-4 flex-grow">
              {strategy.description}
            </p>
            <div className="mt-auto pt-4 border-t border-border-subtle">
              <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider mb-1">
                Action Required
              </p>
              <p className="text-sm text-text-primary font-medium">
                {strategy.action}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
