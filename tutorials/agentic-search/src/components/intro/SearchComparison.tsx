import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchComparisonProps {
  view: 'both' | 'traditional' | 'agentic';
}

export function SearchComparison({ view }: SearchComparisonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const traditionalSteps = [
    { icon: '🔍', label: 'User Query', desc: 'Enter search terms' },
    { icon: '📋', label: 'List of Links', desc: 'Review 10 blue links' },
    { icon: '👤', label: 'Manual Review', desc: 'You read and synthesize' },
  ];

  const agenticSteps = [
    { icon: '🎯', label: 'Understand Goal', desc: 'Agent interprets intent' },
    { icon: '📝', label: 'Plan Sub-tasks', desc: 'Break down into steps' },
    { icon: '🔧', label: 'Discover Tools', desc: 'Find relevant APIs/data' },
    { icon: '⚡', label: 'Execute & Iterate', desc: 'Call tools, refine results' },
    { icon: '✨', label: 'Synthesize Answer', desc: 'Deliver goal-oriented result' },
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playAnimation();
    }
  };

  const playAnimation = () => {
    const maxSteps = Math.max(traditionalSteps.length, agenticSteps.length);
    let step = currentStep;
    
    const interval = setInterval(() => {
      step++;
      if (step >= maxSteps) {
        step = 0;
        setIsPlaying(false);
        clearInterval(interval);
      }
      setCurrentStep(step);
    }, 1500);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const showTraditional = view === 'both' || view === 'traditional';
  const showAgentic = view === 'both' || view === 'agentic';

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handlePlayPause}
          className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors shadow-sm"
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg bg-card-secondary text-body font-medium hover:bg-card-tertiary transition-colors"
        >
          🔄 Reset
        </button>
      </div>

      {/* Comparison Grid */}
      <div className={`grid gap-6 ${view === 'both' ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
        {/* Traditional Search */}
        <AnimatePresence>
          {showTraditional && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="panel p-6"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                    🔍
                  </div>
                  <h3 className="text-xl font-bold text-heading">Traditional Search</h3>
                </div>
                <p className="text-sm panel-muted">One query → List of links</p>
              </div>

              <div className="space-y-4">
                {traditionalSteps.map((step, index) => (
                  <StepCard
                    key={index}
                    icon={step.icon}
                    label={step.label}
                    description={step.desc}
                    isActive={currentStep === index}
                    isComplete={currentStep > index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agentic Search */}
        <AnimatePresence>
          {showAgentic && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="panel panel-info p-6"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                    🤖
                  </div>
                  <h3 className="text-xl font-bold text-heading">Agentic Search</h3>
                </div>
                <p className="text-sm panel-muted">Multi-step → Goal-oriented result</p>
              </div>

              <div className="space-y-4">
                {agenticSteps.map((step, index) => (
                  <StepCard
                    key={index}
                    icon={step.icon}
                    label={step.label}
                    description={step.desc}
                    isActive={currentStep === index}
                    isComplete={currentStep > index}
                    isAgentic
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface StepCardProps {
  icon: string;
  label: string;
  description: string;
  isActive: boolean;
  isComplete: boolean;
  isAgentic?: boolean;
}

function StepCard({ icon, label, description, isActive, isComplete, isAgentic }: StepCardProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        scale: isActive ? 1.05 : 1,
        opacity: isActive || isComplete ? 1 : 0.5,
      }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        isActive
          ? isAgentic
            ? 'border-accent bg-accent/5'
            : 'border-gray-400 bg-gray-50 dark:bg-gray-800'
          : 'border-divider bg-card-secondary'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-grow">
          <div className="font-semibold text-heading text-sm">{label}</div>
          <div className="text-xs panel-muted">{description}</div>
        </div>
        {isComplete && <div className="text-green-500 text-xl">✓</div>}
      </div>
    </motion.div>
  );
}
