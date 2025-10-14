import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchPersona } from '../../data/searchScenarios';

interface SearchComparisonProps {
  view: 'both' | 'traditional' | 'agentic';
  persona: SearchPersona;
}

export function SearchComparison({ view, persona }: SearchComparisonProps) {
  const [traditionalStep, setTraditionalStep] = useState(0);
  const [agenticStep, setAgenticStep] = useState(0);

  // Reset steps when persona changes
  useEffect(() => {
    setTraditionalStep(0);
    setAgenticStep(0);
  }, [persona.id]);

  // Map persona steps to component format
  const traditionalSteps = persona.traditionalSteps.map(step => ({
    icon: getStepIcon(step.step, 'traditional'),
    label: step.label,
    desc: '',
    example: step.description
  }));

  const agenticSteps = persona.agenticSteps.map(step => ({
    icon: getStepIcon(step.step, 'agentic'),
    label: step.label,
    desc: '',
    example: step.description
  }));

  // Helper to get appropriate icon for each step
  function getStepIcon(stepNumber: number, type: 'traditional' | 'agentic'): string {
    if (type === 'traditional') {
      const icons = ['🔍', '📋', '👤', '🔄', '✅'];
      return icons[stepNumber - 1] || '📄';
    } else {
      const icons = ['🎯', '🔧', '⚡', '🔍', '✨'];
      return icons[stepNumber - 1] || '🤖';
    }
  }

  // Traditional search controls
  const handleTraditionalNext = () => {
    if (traditionalStep < traditionalSteps.length - 1) {
      setTraditionalStep(traditionalStep + 1);
    }
  };

  const handleTraditionalPrevious = () => {
    if (traditionalStep > 0) {
      setTraditionalStep(traditionalStep - 1);
    }
  };

  const handleTraditionalReset = () => {
    setTraditionalStep(0);
  };

  // Agentic search controls
  const handleAgenticNext = () => {
    if (agenticStep < agenticSteps.length - 1) {
      setAgenticStep(agenticStep + 1);
    }
  };

  const handleAgenticPrevious = () => {
    if (agenticStep > 0) {
      setAgenticStep(agenticStep - 1);
    }
  };

  const handleAgenticReset = () => {
    setAgenticStep(0);
  };

  const showTraditional = view === 'both' || view === 'traditional';
  const showAgentic = view === 'both' || view === 'agentic';

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center text-sm text-muted">
        💡 Use the controls below each column to step through at your own pace
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
                    example={step.example}
                    isActive={traditionalStep === index}
                    isComplete={traditionalStep > index}
                  />
                ))}
              </div>

              {/* Traditional Controls */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleTraditionalPrevious}
                      disabled={traditionalStep === 0}
                      className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={handleTraditionalReset}
                      className="btn-secondary"
                    >
                      🔄 Reset
                    </button>
                    <button
                      onClick={handleTraditionalNext}
                      disabled={traditionalStep >= traditionalSteps.length - 1}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    Step {traditionalStep + 1} of {traditionalSteps.length}
                  </p>
                </div>
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
                    example={step.example}
                    isActive={agenticStep === index}
                    isComplete={agenticStep > index}
                    isAgentic
                  />
                ))}
              </div>

              {/* Agentic Controls */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAgenticPrevious}
                      disabled={agenticStep === 0}
                      className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={handleAgenticReset}
                      className="btn-secondary"
                    >
                      🔄 Reset
                    </button>
                    <button
                      onClick={handleAgenticNext}
                      disabled={agenticStep >= agenticSteps.length - 1}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    Step {agenticStep + 1} of {agenticSteps.length}
                  </p>
                </div>
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
  example?: string;
  isActive: boolean;
  isComplete: boolean;
  isAgentic?: boolean;
}

function StepCard({ icon, label, description, example, isActive, isComplete, isAgentic }: StepCardProps) {
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
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="flex-grow">
          <div className="font-semibold text-heading text-sm">{label}</div>
          <div className="text-xs panel-muted">{description}</div>
        </div>
        {isComplete && <div className="text-green-500 text-xl">✓</div>}
      </div>
      
      {isActive && example && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-divider"
        >
          <div className="text-xs font-semibold text-heading mb-1">Example:</div>
          <div className="text-xs panel-muted whitespace-pre-line leading-relaxed">
            {example}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
