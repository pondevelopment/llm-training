import { useState } from 'react';
import { SearchComparison } from './SearchComparison';

export function IntroSection() {
  const [currentView, setCurrentView] = useState<'both' | 'traditional' | 'agentic'>('both');

  return (
    <section id="intro" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
          Traditional vs Agentic Search
        </h2>
        <p className="text-lg text-body leading-relaxed">
          See how agentic search transforms single queries into multi-step, 
          goal-oriented research workflows.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setCurrentView('both')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === 'both'
              ? 'bg-accent text-white'
              : 'bg-card-secondary text-body hover:bg-card-tertiary'
          }`}
        >
          Side by Side
        </button>
        <button
          onClick={() => setCurrentView('traditional')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === 'traditional'
              ? 'bg-accent text-white'
              : 'bg-card-secondary text-body hover:bg-card-tertiary'
          }`}
        >
          Traditional Only
        </button>
        <button
          onClick={() => setCurrentView('agentic')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentView === 'agentic'
              ? 'bg-accent text-white'
              : 'bg-card-secondary text-body hover:bg-card-tertiary'
          }`}
        >
          Agentic Only
        </button>
      </div>

      {/* Comparison Component */}
      <SearchComparison view={currentView} />

      {/* Key Insight */}
      <div className="panel panel-info p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="text-lg font-bold text-heading mb-2">Key Difference</h3>
            <p className="text-body leading-relaxed">
              Traditional search returns <strong>links for you to review</strong>. 
              Agentic search uses AI to <strong>plan, research, and synthesize</strong> an 
              answer tailored to your goal—like having a research assistant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
