import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '../shared/Panel';
// First section loads eagerly for fast initial paint
import { IntroSection } from '../intro/IntroSection';
// Remaining sections load lazily on demand
const ScenarioSection = lazy(() => import('../scenario/ScenarioSection').then(m => ({ default: m.ScenarioSection })));
const ToolboxSection = lazy(() => import('../toolbox/ToolboxSection').then(m => ({ default: m.ToolboxSection })));
const MCPSection = lazy(() => import('../mcp/MCPSection').then(m => ({ default: m.MCPSection })));
const AgentModeSection = lazy(() => import('../agent/AgentModeSection').then(m => ({ default: m.AgentModeSection })));
const OptimizationSection = lazy(() => import('../optimization/OptimizationSection').then(m => ({ default: m.OptimizationSection })));
const AccessibilitySection = lazy(() => import('../sections/AccessibilitySection').then(m => ({ default: m.AccessibilitySection })));
const AgentTestingSection = lazy(() => import('../sections/AgentTestingSection').then(m => ({ default: m.AgentTestingSection })));
const SummarySection = lazy(() => import('../summary/SummarySection').then(m => ({ default: m.SummarySection })));

interface TutorialPageProps {
  onBackToOverview: () => void;
}

// Loading skeleton shown while lazy-loaded sections are fetching
function SectionLoadingFallback() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading section content">
      <div className="h-10 w-3/4 bg-card-secondary rounded-lg" />
      <div className="h-4 w-full bg-card-secondary rounded" />
      <div className="h-4 w-5/6 bg-card-secondary rounded" />
      <div className="h-64 w-full bg-card-secondary rounded-xl" />
      <div className="h-4 w-2/3 bg-card-secondary rounded" />
    </div>
  );
}

const sections = [
  { id: 1, title: 'Search Comparison', icon: '🔍', component: IntroSection },
  { id: 2, title: 'Scenario Player', icon: '🎬', component: ScenarioSection },
  { id: 3, title: 'Toolbox Explorer', icon: '🧰', component: ToolboxSection },
  { id: 4, title: 'MCP Discovery', icon: '📋', component: MCPSection },
  { id: 5, title: 'Agent Mode', icon: '⚡', component: AgentModeSection },
  { id: 6, title: 'Optimization', icon: '🎯', component: OptimizationSection },
  { id: 7, title: 'Accessibility', icon: '♿', component: AccessibilitySection },
  { id: 8, title: 'Agent Testing', icon: '🧪', component: AgentTestingSection },
  { id: 9, title: 'Takeaways', icon: '🎓', component: SummarySection },
];

export function TutorialPage({ onBackToOverview }: TutorialPageProps) {
  const [currentSection, setCurrentSection] = useState(1);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleNextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const CurrentSectionComponent = sections.find(s => s.id === currentSection)?.component;

  return (
    <div className="space-y-8">
      {/* Back to Overview Link */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBackToOverview}
          className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center gap-2"
        >
          ← Back to Overview
        </button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-heading">
            Section {currentSection} of {sections.length}
          </p>
          <p className="text-xs text-muted">
            {currentSection === sections.length 
              ? '✓ Complete' 
              : `${sections.find(s => s.id === currentSection)?.icon} ${sections.find(s => s.id === currentSection)?.title}`
            }
          </p>
        </div>
        <div className="w-full h-2 bg-card-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentSection / sections.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-2 justify-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                currentSection === section.id
                  ? 'bg-accent text-white shadow-lg scale-105'
                  : section.id < currentSection
                  ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30'
                  : 'bg-card-secondary text-body hover:bg-card-tertiary'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-xs hidden lg:inline">{section.title}</span>
              {section.id < currentSection && (
                <span className="text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <Suspense fallback={<SectionLoadingFallback />}>
            {CurrentSectionComponent && <CurrentSectionComponent />}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevSection}
            disabled={currentSection === 1}
            className="px-6 py-3 rounded-lg bg-card-secondary text-body font-medium hover:bg-card-tertiary transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ← Previous Section
          </button>

          {currentSection === sections.length ? (
            <button
              onClick={onBackToOverview}
              className="btn-secondary px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              ← Back to Overview
            </button>
          ) : (
            <button
              onClick={handleNextSection}
              className="px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors shadow-sm flex items-center gap-2"
            >
              Next Section →
            </button>
          )}
        </div>
      </div>

      {/* Completion Message and Coming Soon (only show on last section) */}
      {currentSection === sections.length && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Completion Celebration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Panel variant="success" className="p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl">🎉</div>
                <h3 className="text-3xl font-bold text-heading">
                  All Sections Complete!
                </h3>
                <p className="text-body text-lg leading-relaxed max-w-2xl mx-auto">
                  You've mastered the fundamentals of agentic search! You now understand 
                  how AI agents discover tools, plan research, and deliver goal-oriented results.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Search Comparison</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Toolbox Explorer</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>MCP Discovery</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Scenario Player</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Optimization</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Agent Mode</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Agent Testing</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Accessibility</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Takeaways</span>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        </div>
      )}
    </div>
  );
}
