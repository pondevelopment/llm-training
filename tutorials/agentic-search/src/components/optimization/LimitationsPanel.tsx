import { motion } from 'framer-motion';
import type { Limitation } from '../../data/optimizationTips';

interface LimitationsPanelProps {
  limitations: Limitation[];
}

export function LimitationsPanel({ limitations }: LimitationsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-500/5';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low':
        return 'border-l-blue-500 bg-blue-500/5';
      default:
        return 'border-l-text-secondary bg-surface-secondary';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="chip-error px-2 py-1 text-xs">High Impact</span>;
      case 'medium':
        return <span className="chip-warning px-2 py-1 text-xs">Medium Impact</span>;
      case 'low':
        return <span className="chip-info px-2 py-1 text-xs">Low Impact</span>;
      default:
        return null;
    }
  };

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="text-center"
      >
        <h4 className="text-2xl font-bold text-text-primary mb-2">
          ⚠️ Known Limitations & Challenges
        </h4>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Agentic search is powerful but imperfect. Understanding what breaks helps you 
          optimize realistically and set proper expectations.
        </p>
      </motion.div>

      <div className="grid gap-4 max-w-4xl mx-auto">
        {limitations.map((limitation, index) => (
          <motion.div
            key={limitation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
            className={`panel-surface p-6 border-l-4 ${getSeverityColor(limitation.severity)}`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{limitation.icon}</span>
                <div>
                  <h5 className="text-lg font-bold text-text-primary">{limitation.title}</h5>
                  {getSeverityBadge(limitation.severity)}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {/* Problem */}
              <div>
                <p className="font-semibold text-text-primary mb-1">⚡ Problem:</p>
                <p className="text-text-secondary leading-relaxed">{limitation.problem}</p>
              </div>

              {/* Cause */}
              <div>
                <p className="font-semibold text-text-primary mb-1">🔍 Root Cause:</p>
                <p className="text-text-secondary leading-relaxed">{limitation.cause}</p>
              </div>

              {/* Impact */}
              <div>
                <p className="font-semibold text-text-primary mb-1">💥 Impact:</p>
                <p className="text-text-secondary leading-relaxed">{limitation.impact}</p>
              </div>

              {/* Mitigation */}
              <div className="bg-surface-secondary rounded-lg p-3 mt-3">
                <p className="font-semibold text-text-primary mb-1">✅ Mitigation:</p>
                <p className="text-text-secondary leading-relaxed">{limitation.mitigation}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.9 }}
        className="panel-inset p-6 max-w-3xl mx-auto"
      >
        <p className="text-text-primary font-medium leading-relaxed">
          <span className="font-bold">Important Context:</span> These limitations aren't reasons to avoid 
          agentic search optimization — they're reasons to start <span className="text-accent-primary font-semibold">early</span>. 
          The platforms are evolving rapidly, and early adopters are establishing best practices while 
          competition is still low. By the time these issues are fully resolved, the market will be more crowded.
        </p>
      </motion.div>
    </section>
  );
}
