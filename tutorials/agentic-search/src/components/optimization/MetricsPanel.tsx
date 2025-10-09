import { motion } from 'framer-motion';
import type { ConversionMetrics } from '../../data/optimizationTips';

interface MetricsPanelProps {
  metrics: ConversionMetrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  // Calculate bar widths for visual comparison
  const chatgptWidth = (metrics.chatgpt.rate / Math.max(metrics.chatgpt.rate, metrics.organic.rate)) * 100;
  const organicWidth = (metrics.organic.rate / Math.max(metrics.chatgpt.rate, metrics.organic.rate)) * 100;

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center"
      >
        <h4 className="text-2xl font-bold text-text-primary mb-2">
          📊 Real Conversion Data
        </h4>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Traffic from agentic search converts significantly better than traditional search. 
          Here's the data from early adopters.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="panel-surface p-8 max-w-4xl mx-auto"
      >
        {/* Conversion Rate Comparison */}
        <div className="space-y-6">
          <h5 className="text-lg font-bold text-text-primary text-center">
            Conversion Rate Comparison
          </h5>

          {/* ChatGPT Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-text-primary">{metrics.chatgpt.label}</span>
              <span className="font-bold text-accent-primary">{metrics.chatgpt.rate}%</span>
            </div>
            <div className="h-8 bg-surface-secondary rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${chatgptWidth}%` }}
                transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent-primary to-accent-primary/80 flex items-center justify-end pr-3"
              >
                <span className="text-xs font-bold text-white">{metrics.chatgpt.rate}%</span>
              </motion.div>
            </div>
            <p className="text-xs text-muted">{metrics.chatgpt.source}</p>
          </div>

          {/* Google Organic Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-text-primary">{metrics.organic.label}</span>
              <span className="font-bold text-text-secondary">{metrics.organic.rate}%</span>
            </div>
            <div className="h-8 bg-surface-secondary rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${organicWidth}%` }}
                transition={{ duration: 1, delay: 1.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-text-secondary/60 to-text-secondary/40 flex items-center justify-end pr-3"
              >
                <span className="text-xs font-bold text-white">{metrics.organic.rate}%</span>
              </motion.div>
            </div>
            <p className="text-xs text-muted">{metrics.organic.source}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border-primary">
          {/* Multiplier */}
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-primary mb-1">
              {metrics.multiplier}x
            </div>
            <p className="text-sm text-text-secondary">{metrics.multiplierLabel}</p>
          </div>

          {/* Traffic Share */}
          <div className="text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              {metrics.trafficShare}
            </div>
            <p className="text-sm text-text-secondary">{metrics.trafficNote}</p>
          </div>

          {/* Future Prediction */}
          <div className="text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">
              2028
            </div>
            <p className="text-sm text-text-secondary">{metrics.prediction}</p>
            <p className="text-xs text-muted mt-1">{metrics.predictionSource}</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-6 panel-inset p-4 border-l-4 border-accent-primary">
          <p className="text-text-primary font-medium text-sm">
            💡 <span className="font-bold">What This Means:</span> Users arriving from agentic search 
            are highly qualified because they've already worked through decision criteria with the AI. 
            They click through closer to purchase, resulting in conversion rates nearly 
            <span className="text-accent-primary font-bold"> 9x higher</span> than traditional search.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
