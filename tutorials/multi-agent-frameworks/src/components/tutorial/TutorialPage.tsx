import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel } from '../shared/Panel';
import { IntroSection } from '../intro/IntroSection';
import { StructureSection } from '../structure/StructureSection';
import { PipelineSection } from '../pipeline/PipelineSection';
import { RelevanceSection } from '../relevance/RelevanceSection';
import { MultiAgentSection } from '../multiAgent/MultiAgentSection';
import { SummarySection } from '../summary/SummarySection';

interface TutorialPageProps {
  onBackToOverview: () => void;
}

const sections = [
  { id: 1, title: 'Scaling Bottleneck', icon: '📉', component: IntroSection },
  { id: 2, title: 'Tiered Context', icon: '🗂️', component: StructureSection },
  { id: 3, title: 'Flows & Processors', icon: '🧩', component: PipelineSection },
  { id: 4, title: 'Relevance', icon: '🎯', component: RelevanceSection },
  { id: 5, title: 'Multi-Agent Context', icon: '🤝', component: MultiAgentSection },
  { id: 6, title: 'Takeaways', icon: '🎓', component: SummarySection },
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
          {CurrentSectionComponent && <CurrentSectionComponent />}
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
                  You’ve learned the core patterns used in production multi-agent frameworks: 
                  treating context as an engineered system with structure, relevance, and scoped handoffs.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Scaling Bottleneck</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Tiered Context</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Flows & Processors</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Relevance</span>
                  </div>
                  <div className="chip chip-success flex items-center gap-2">
                    <span>✓</span>
                    <span>Multi-Agent Context</span>
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
