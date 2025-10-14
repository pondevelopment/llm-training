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
          <h5 className="text-2xl font-bold text-heading text-center mb-8">
            Conversion Rate Comparison
          </h5>

          {/* ChatGPT Bar */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--color-subtle-bg)]">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-heading">{metrics.chatgpt.label}</span>
              <span className="text-2xl font-bold text-[#10b981]">{metrics.chatgpt.rate}%</span>
            </div>
            <div className="h-10 bg-[var(--color-surface)] rounded-lg overflow-hidden border border-[var(--color-border)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${chatgptWidth}%` }}
                transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] flex items-center justify-end pr-4"
              >
                <span className="text-sm font-bold text-white drop-shadow-md">{metrics.chatgpt.rate}%</span>
              </motion.div>
            </div>
            <p className="text-xs text-muted italic">
              <a 
                href="https://www.seerinteractive.com/insights/chatgpt-shopping-conversion-rate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {metrics.chatgpt.source}
              </a>
            </p>
          </div>

          {/* Google Organic Bar */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--color-subtle-bg)]">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-heading">{metrics.organic.label}</span>
              <span className="text-2xl font-bold text-[#6366f1]">{metrics.organic.rate}%</span>
            </div>
            <div className="h-10 bg-[var(--color-surface)] rounded-lg overflow-hidden border border-[var(--color-border)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${organicWidth}%` }}
                transition={{ duration: 1, delay: 1.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] flex items-center justify-end pr-4"
              >
                <span className="text-sm font-bold text-white drop-shadow-md">{metrics.organic.rate}%</span>
              </motion.div>
            </div>
            <p className="text-xs text-muted italic">
              <a 
                href="https://www.seerinteractive.com/insights/chatgpt-shopping-conversion-rate" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {metrics.organic.source}
              </a>
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-10 pt-8 border-t-2 border-[var(--color-border)]">
          {/* Multiplier */}
          <div className="text-center p-4 rounded-lg bg-[var(--color-card)]">
            <div className="text-4xl font-bold text-[#10b981] mb-2">
              {metrics.multiplier}x
            </div>
            <p className="text-sm font-medium text-heading">{metrics.multiplierLabel}</p>
          </div>

          {/* Traffic Share */}
          <div className="text-center p-4 rounded-lg bg-[var(--color-card)]">
            <div className="text-4xl font-bold text-heading mb-2">
              {metrics.trafficShare}
            </div>
            <p className="text-sm font-medium text-body">{metrics.trafficNote}</p>
          </div>

          {/* Future Prediction */}
          <div className="text-center p-4 rounded-lg bg-[var(--color-card)]">
            <div className="text-4xl font-bold text-heading mb-2">
              2028
            </div>
            <p className="text-sm font-medium text-body">{metrics.prediction}</p>
            <p className="text-xs text-muted italic mt-2">{metrics.predictionSource}</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border-l-4 border-[#10b981]">
          <p className="text-base leading-relaxed text-heading">
            <span className="text-2xl mr-2">💡</span>
            <span className="font-bold text-lg">What This Means:</span>
            <span className="block mt-2">
              Users arriving from agentic search are highly qualified because they've already worked through decision criteria with the AI. 
              They click through closer to purchase, resulting in conversion rates nearly 
              <span className="text-[#10b981] font-bold text-lg"> 9x higher</span> than traditional search.
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
