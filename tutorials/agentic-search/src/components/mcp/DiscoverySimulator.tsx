import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryStep {
  id: number;
  icon: string;
  title: string;
  description: string;
  code?: string;
  result?: string;
}

const discoverySteps: DiscoveryStep[] = [
  {
    id: 1,
    icon: '🎯',
    title: 'Agent Receives Task',
    description: 'User asks for road bike recommendations. Agent needs bike inventory data.',
    code: 'User: "Find me the best road bikes under $1500"',
    result: '🤔 Agent thinks: I need bike product data...'
  },
  {
    id: 2,
    icon: '🔍',
    title: 'Check for MCP Server',
    description: 'Agent looks for standardized tool manifest at .well-known endpoint',
    code: 'GET https://pon.bike/.well-known/mcp.json',
    result: '✅ 200 OK - MCP server found!'
  },
  {
    id: 3,
    icon: '📋',
    title: 'Parse Manifest',
    description: 'Agent discovers available tools, their capabilities, and how to call them',
    code: '{\n  "tools": [\n    "searchProducts",\n    "getInventory",\n    "compareModels"\n  ]\n}',
    result: '🔧 3 tools registered and ready to use'
  },
  {
    id: 4,
    icon: '🚀',
    title: 'Execute Research',
    description: 'Agent now knows how to query bike data programmatically',
    code: 'searchProducts({\n  category: "road-bikes",\n  maxPrice: 1500,\n  sortBy: "rating"\n})',
    result: '✅ Found 12 matching bikes with full specs'
  }
];

export function DiscoverySimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < discoverySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Auto-advance through steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= discoverySteps.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentStep(step);
      }
    }, 2500);
  };

  const currentStepData = discoverySteps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || isPlaying}
            className="px-4 py-2 rounded-lg bg-card-secondary text-body text-sm font-medium hover:bg-card-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-6 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPlaying ? '▶ Playing...' : '▶ Play Auto'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-card-secondary text-body text-sm font-medium hover:bg-card-tertiary transition-colors"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep >= discoverySteps.length - 1 || isPlaying}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
        <p className="text-xs text-muted">
          Step {currentStep + 1} of {discoverySteps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-card-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / discoverySteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="panel panel-info p-6"
        >
          {/* Step Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{currentStepData.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-heading mb-1">
                {currentStepData.title}
              </h3>
              <p className="text-body text-sm">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Code/Request */}
          {currentStepData.code && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-heading mb-2">
                {currentStep === 0 ? '💬 User Request:' : currentStep === 2 ? '📄 Manifest Response:' : '🔧 Request:'}
              </p>
              <div className="bg-[var(--color-code-bg)] rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-[var(--color-text)] whitespace-pre-wrap">
                  {currentStepData.code}
                </pre>
              </div>
            </div>
          )}

          {/* Result */}
          {currentStepData.result && (
            <div className="panel p-3 bg-card-secondary">
              <p className="text-sm text-body font-medium">
                {currentStepData.result}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step Timeline */}
      <div className="flex justify-between items-center">
        {discoverySteps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <button
              onClick={() => !isPlaying && setCurrentStep(index)}
              disabled={isPlaying}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                index === currentStep
                  ? 'bg-accent text-white scale-110 shadow-lg'
                  : index < currentStep
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-card-secondary text-muted'
              } ${!isPlaying ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
            >
              {index < currentStep ? '✓' : step.icon}
            </button>
            <p className="text-xs text-center text-muted max-w-[80px] leading-tight">
              {step.title.split(' ').slice(0, 2).join(' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
