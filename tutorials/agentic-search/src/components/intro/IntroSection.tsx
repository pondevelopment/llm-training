import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchComparison } from './SearchComparison';
import { searchScenarios, defaultScenario, defaultPersona, getDefaultPersona, type SearchScenario, type SearchPersona } from '../../data/searchScenarios';

export function IntroSection() {
  const [currentView, setCurrentView] = useState<'both' | 'traditional' | 'agentic'>('both');
  const [selectedScenario, setSelectedScenario] = useState<SearchScenario>(defaultScenario);
  const [selectedPersona, setSelectedPersona] = useState<SearchPersona>(defaultPersona);

  // When scenario changes, reset to first persona
  const handleScenarioChange = (scenarioId: string) => {
    const scenario = searchScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setSelectedPersona(getDefaultPersona(scenario));
    }
  };

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

      {/* Terminology Guide */}
      <div className="panel p-4 max-w-3xl mx-auto bg-[var(--color-subtle-bg)]">
        <p className="text-sm text-muted mb-2"><strong className="text-heading">📚 Terminology used in this tutorial:</strong></p>
        <div className="grid gap-2 sm:grid-cols-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="font-bold text-body">Traditional Search:</span>
            <span className="text-muted">Returns links, you do the work</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-body">Agentic Search:</span>
            <span className="text-muted">AI recommends, you click/buy</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-body">Agent Mode:</span>
            <span className="text-muted">AI completes transactions for you</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-body">Agentic Commerce:</span>
            <span className="text-muted">Agents negotiate with agents (A2A)</span>
          </div>
        </div>
      </div>

      {/* Scenario & Persona Selectors */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="panel p-4 space-y-4">
          <div>
            <label htmlFor="scenario-select" className="block text-sm font-bold text-heading mb-2">
              📋 Choose a Scenario to Compare:
            </label>
            <select
              id="scenario-select"
              value={selectedScenario.id}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-surface-secondary text-text-primary border-2 border-border-primary hover:border-accent-primary focus:border-accent-primary focus:outline-none transition-colors font-medium"
            >
              {searchScenarios.map(scenario => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.icon} {scenario.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="persona-select" className="block text-sm font-bold text-heading mb-2">
              👤 Choose Your Searcher Profile:
            </label>
            <select
              id="persona-select"
              value={selectedPersona.id}
              onChange={(e) => {
                const persona = selectedScenario.personas.find(p => p.id === e.target.value);
                if (persona) setSelectedPersona(persona);
              }}
              className="w-full px-4 py-3 rounded-lg bg-surface-secondary text-text-primary border-2 border-border-primary hover:border-accent-primary focus:border-accent-primary focus:outline-none transition-colors font-medium"
            >
              {selectedScenario.personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.icon} {persona.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Persona Context - Animated */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedScenario.id}-${selectedPersona.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="panel panel-warning p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{selectedPersona.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-heading mb-2">Your Search Context</h3>
                <p className="text-body leading-relaxed mb-3">
                  {selectedPersona.description}
                </p>
                <div className="text-sm panel-muted space-y-1">
                  <p><strong>Your goal:</strong> {selectedPersona.userGoal}</p>
                  <p><strong>Exercise:</strong> Use the view toggle below and click "Next" to step through how each approach handles this search</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
      <SearchComparison view={currentView} persona={selectedPersona} />
    </section>
  );
}
