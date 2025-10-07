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

      {/* What You'll Learn */}
      <div className="panel p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-heading mb-3">What You'll Learn in This Tutorial</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className="text-lg">🔍</span>
            <div>
              <p className="font-semibold text-heading text-sm">Traditional Search</p>
              <p className="text-xs text-muted">Returns links—you do the work</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="font-semibold text-heading text-sm">Agentic Search</p>
              <p className="text-xs text-muted">AI plans, researches, synthesizes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">🧰</span>
            <div>
              <p className="font-semibold text-heading text-sm">Tool Discovery</p>
              <p className="text-xs text-muted">How agents find APIs via MCP</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <p className="font-semibold text-heading text-sm">Live Workflow</p>
              <p className="text-xs text-muted">Step-by-step simulation</p>
            </div>
          </div>
        </div>
      </div>

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

      {/* Scenario Setup */}
      <div className="panel panel-warning p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🚴‍♂️</div>
          <div>
            <h3 className="text-lg font-bold text-heading mb-2">The Scenario</h3>
            <p className="text-body leading-relaxed mb-3">
              You're a <strong>beginner cyclist</strong> looking to buy your first road bike. 
              Your budget is <strong>$1,500</strong> and you want the best value for money.
            </p>
            <div className="text-sm panel-muted space-y-1">
              <p><strong>Your goal:</strong> Find the top 3 road bikes that match your needs</p>
              <p><strong>What to compare:</strong> Frame material, weight, components, reviews, and availability</p>
              <p><strong>Exercise:</strong> Click "Next" to step through how each approach handles this search</p>
            </div>
          </div>
        </div>
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
    </section>
  );
}
