import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allScenarios } from '../../data/scenarioSteps';
import { StepCard } from './StepCard';
import { TraceToggle } from './TraceToggle';

/**
 * ScenarioPlayer
 * 
 * Interactive player for the Q4 content planning scenario.
 * Allows step-by-step manual navigation through the agent's workflow.
 * User has full control over pacing and can move forward/backward freely.
 * 
 * Features:
 * - Prev/Next step controls
 * - Progress indicator
 * - Reset button
 * - Traceability toggle (shows on final step)
 */
export function ScenarioPlayer() {
  const [selectedScenario, setSelectedScenario] = useState(allScenarios[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTrace, setShowTrace] = useState(false);

  const activeScenario = allScenarios.find(s => s.id === selectedScenario) || allScenarios[0];
  const steps = activeScenario.steps;
  const totalSteps = steps.length;
  const isFinalStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (!isFinalStep) {
      setCurrentStep((prev) => prev + 1);
      setShowTrace(false);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      setShowTrace(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setShowTrace(false);
  };

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentStep(0);
    setShowTrace(false);
  };

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="panel-surface p-6 space-y-6"
    >
      {/* Scenario Selector */}
      <div className="panel-inset p-4">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Select Workflow Scenario:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`p-3 rounded-lg text-left transition-all border-2 ${
                selectedScenario === scenario.id
                  ? 'border-accent-primary bg-accent-primary/10'
                  : 'border-transparent bg-surface-secondary hover:bg-surface-tertiary'
              }`}
            >
              <div className="font-medium text-sm text-text-primary mb-1">
                {scenario.name}
              </div>
              <div className="text-xs text-text-tertiary leading-snug">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Header with Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h4 className="text-xl font-bold text-text-primary">
            {activeScenario.name}
          </h4>
          <div className="chip-accent px-3 py-1 text-sm font-medium">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isFinalStep}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
          <button
            onClick={handleReset}
            disabled={isFirstStep}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-surface-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-primary to-accent-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step Card */}
      <AnimatePresence mode="wait">
        <StepCard
          key={`${selectedScenario}-${currentStep}`}
          step={steps[currentStep]}
          showTrace={showTrace && isFinalStep}
          traceMap={activeScenario.traceMap}
        />
      </AnimatePresence>

      {/* Traceability Toggle (only on final step) */}
      {isFinalStep && (
        <div className="flex items-center justify-center pt-4 border-t border-border-primary">
          <TraceToggle enabled={showTrace} onToggle={() => setShowTrace(!showTrace)} />
        </div>
      )}
    </motion.div>
  );
}
