import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { q4ContentScenario } from '../../data/scenarioSteps';
import { StepCard } from './StepCard';
import { TraceToggle } from './TraceToggle';

/**
 * ScenarioPlayer
 * 
 * Interactive player for the Q4 content planning scenario.
 * Allows step-by-step navigation (manual or auto-play) through
 * the agent's workflow with animations and timing.
 * 
 * Features:
 * - Play/Pause auto-play mode
 * - Prev/Next step controls
 * - Progress indicator
 * - Reset button
 * - Traceability toggle (shows on final step)
 */
export function ScenarioPlayer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const totalSteps = q4ContentScenario.length;
  const isFinalStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || isFinalStep) {
      return;
    }

    const currentStepData = q4ContentScenario[currentStep];
    const delayMs = parseInt(currentStepData.duration || '3s') * 1000;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentStep, isFinalStep]);

  // Stop auto-play when reaching final step
  useEffect(() => {
    if (isFinalStep) {
      setIsAutoPlaying(false);
    }
  }, [isFinalStep]);

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
    setIsAutoPlaying(false);
    setShowTrace(false);
  };

  const handleToggleAutoPlay = () => {
    if (isFinalStep) {
      // If on final step, reset to beginning and start auto-play
      setCurrentStep(0);
      setIsAutoPlaying(true);
      setShowTrace(false);
    } else {
      setIsAutoPlaying(!isAutoPlaying);
    }
  };

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="panel-surface p-6 space-y-6"
    >
      {/* Header with Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h4 className="text-xl font-bold text-text-primary">
            Q4 Content Planning Workflow
          </h4>
          <div className="chip-accent px-3 py-1 text-sm font-medium">
            Step {currentStep + 1} of {totalSteps}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAutoPlay}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isAutoPlaying
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-accent-primary text-white hover:bg-accent-secondary'
            }`}
          >
            {isAutoPlaying ? '⏸️ Pause' : isFinalStep ? '🔄 Replay' : '▶️ Auto-Play'}
          </button>
          <button
            onClick={handleReset}
            disabled={isFirstStep && !isAutoPlaying}
            className="px-4 py-2 rounded-lg font-medium bg-surface-secondary text-text-primary hover:bg-surface-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ↺ Reset
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
          key={currentStep}
          step={q4ContentScenario[currentStep]}
          showTrace={showTrace && isFinalStep}
        />
      </AnimatePresence>

      {/* Navigation and Traceability */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-primary">
        {/* Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="px-4 py-2 rounded-lg font-medium bg-surface-secondary text-text-primary hover:bg-surface-tertiary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isFinalStep}
            className="px-4 py-2 rounded-lg font-medium bg-accent-primary text-white hover:bg-accent-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>

        {/* Traceability Toggle (only on final step) */}
        {isFinalStep && (
          <TraceToggle enabled={showTrace} onToggle={() => setShowTrace(!showTrace)} />
        )}
      </div>

      {/* Auto-play Indicator */}
      {isAutoPlaying && !isFinalStep && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center justify-center gap-2 text-sm text-text-tertiary"
        >
          <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse" />
          <span>Auto-playing... (next step in {q4ContentScenario[currentStep].duration})</span>
        </motion.div>
      )}
    </motion.div>
  );
}
