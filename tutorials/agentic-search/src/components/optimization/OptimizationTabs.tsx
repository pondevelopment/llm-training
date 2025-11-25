import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type OptimizationTab = 'fundamentals' | 'technical' | 'analytics' | 'strategy';

interface OptimizationTabsProps {
  activeTab: OptimizationTab;
  onTabChange: (tab: OptimizationTab) => void;
}

const tabs: { id: OptimizationTab; label: string; icon: string; description: string }[] = [
  { 
    id: 'fundamentals', 
    label: 'Fundamentals', 
    icon: '📚',
    description: 'FEED Framework & McKinsey insights'
  },
  { 
    id: 'technical', 
    label: 'Technical', 
    icon: '⚙️',
    description: 'JSON-LD, platforms & integrations'
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: '📊',
    description: 'Metrics, tracking & readiness'
  },
  { 
    id: 'strategy', 
    label: 'Strategy', 
    icon: '🎯',
    description: 'Industry insights & monetization'
  },
];

export function OptimizationTabs({ activeTab, onTabChange }: OptimizationTabsProps) {
  return (
    <div className="mb-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-lg scale-105'
                : 'bg-card-secondary text-body hover:bg-card-tertiary'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
            
            {/* Tooltip on hover for mobile */}
            <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${
              activeTab === tab.id ? 'bg-accent/90' : 'bg-card text-body border border-divider'
            }`}>
              {tab.description}
            </div>
          </button>
        ))}
      </div>

      {/* Active Tab Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="text-center text-sm text-muted mt-4"
        >
          {tabs.find(t => t.id === activeTab)?.description}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// Hook for managing tab state
export function useOptimizationTabs() {
  const [activeTab, setActiveTab] = useState<OptimizationTab>('fundamentals');
  return { activeTab, setActiveTab };
}
