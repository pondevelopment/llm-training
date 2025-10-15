/**
 * Agent Readiness Checker
 * Interactive component for testing site compatibility with AI agents
 * Based on October 2025 research: ChatGPT Agent mode behavioral analysis
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { agentReadinessBarriers, type AgentReadinessBarrier } from '../../data/agentModeData';
import { searchPlatforms, getActiveShoppingPlatforms } from '../../data/platformData';

interface TestCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  barriers: AgentReadinessBarrier[];
}

export const AgentReadinessChecker: React.FC = () => {
  const [checkedBarriers, setCheckedBarriers] = useState<Record<string, boolean>>({});
  const [siteUrl, setSiteUrl] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('chatgpt');

  const activePlatforms = getActiveShoppingPlatforms();
  const currentPlatform = searchPlatforms.find(p => p.id === selectedPlatform);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agent-readiness-checks');
    if (saved) {
      try {
        setCheckedBarriers(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load saved checks:', e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (Object.keys(checkedBarriers).length > 0) {
      localStorage.setItem('agent-readiness-checks', JSON.stringify(checkedBarriers));
    }
  }, [checkedBarriers]);

  // Organize barriers by category
  const testCategories: TestCategory[] = [
    {
      id: 'accessibility',
      title: 'Accessibility Tests',
      icon: '🔓',
      description: 'Can agents access your site at all? These barriers cause immediate abandonment.',
      barriers: agentReadinessBarriers.filter(b => b.category === 'accessibility')
    },
    {
      id: 'usability',
      title: 'Usability Tests',
      icon: '🧭',
      description: 'Can agents navigate your site effectively? These issues cause confusion and stalled progress.',
      barriers: agentReadinessBarriers.filter(b => b.category === 'usability')
    },
    {
      id: 'convertibility',
      title: 'Convertibility Tests',
      icon: '✅',
      description: 'Can agents complete purchases? These friction points kill conversions despite high intent.',
      barriers: agentReadinessBarriers.filter(b => b.category === 'convertibility')
    }
  ];

  const toggleBarrier = (barrierId: string) => {
    setCheckedBarriers(prev => ({
      ...prev,
      [barrierId]: !prev[barrierId]
    }));
  };

  const clearAll = () => {
    setCheckedBarriers({});
    localStorage.removeItem('agent-readiness-checks');
  };

  // Calculate stats
  const totalBarriers = agentReadinessBarriers.length;
  const checkedCount = Object.values(checkedBarriers).filter(Boolean).length;
  const criticalIssues = agentReadinessBarriers.filter(
    b => b.priority === 'critical' && checkedBarriers[b.id]
  ).length;
  const highIssues = agentReadinessBarriers.filter(
    b => b.priority === 'high' && checkedBarriers[b.id]
  ).length;

  const getReadinessScore = () => {
    if (checkedCount === 0) return null;
    const score = ((totalBarriers - checkedCount) / totalBarriers) * 100;
    return Math.round(score);
  };

  const getReadinessLevel = (score: number | null) => {
    if (score === null) return null;
    if (score >= 90) return { label: 'Excellent', color: '#10b981', bg: '#10b981' };
    if (score >= 70) return { label: 'Good', color: '#f59e0b', bg: '#f59e0b' };
    if (score >= 50) return { label: 'Fair', color: '#f97316', bg: '#f97316' };
    return { label: 'Critical Issues', color: '#ef4444', bg: '#ef4444' };
  };

  const generateTestPrompt = () => {
    if (!currentPlatform) return '';
    
    const url = siteUrl || 'https://example.com';
    const trackingUrl = siteUrl 
      ? `${url}${url.includes('?') ? '&' : '?'}utm_source=${currentPlatform.utmSource}`
      : `https://example.com?utm_source=${currentPlatform.utmSource}`;
    
    const issuesList = agentReadinessBarriers
      .filter(b => checkedBarriers[b.id])
      .map(b => `- ${b.title}: ${b.problem}`)
      .join('\n');

    const agentModeNote = currentPlatform.agentMode 
      ? 'using Agent mode (autonomous browsing)' 
      : 'by searching and browsing normally';

    return `Test this website for AI agent compatibility on ${currentPlatform.name}:

Website: ${trackingUrl}

Please attempt the following tasks ${agentModeNote}:
1. Navigate to the homepage and find the main product category
2. Search for a specific product (choose any relevant item)
3. Add the product to cart
4. Proceed to checkout (stop before final payment)

Known issues to watch for:
${issuesList || 'None identified yet—please report any barriers you encounter'}

Report back:
- Which steps succeeded?
- Where did you get stuck or abandon?
- What error messages or barriers appeared?
- Did you encounter any CAPTCHAs, bot blocks, or validation issues?

Platform: ${currentPlatform.name} (${currentPlatform.provider})
${currentPlatform.agentMode ? '✓ Supports autonomous agent mode' : '⚠️ Manual interaction required'}
Tracking: utm_source=${currentPlatform.utmSource}`;
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(generateTestPrompt());
    setShowPrompt(false);
    // Could add toast notification here
  };

  const score = getReadinessScore();
  const readiness = getReadinessLevel(score);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h3 className="text-3xl font-bold text-text-primary">
          🤖 Agent Readiness Checker
        </h3>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          Test your site for AI agent compatibility. Check the barriers present on your site, 
          then use the generated prompt to test with ChatGPT Agent mode.
        </p>
      </motion.div>

      {/* Score Card - Always visible to prevent layout shift */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-lg border-2 shadow-lg"
        style={{
          borderColor: score !== null ? (readiness?.color || '#6366f1') : 'var(--color-border-subtle)',
          backgroundColor: 'var(--color-surface-elevated)'
        }}
      >
        {score !== null ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold mb-2" style={{ color: readiness?.color }}>
                {score}%
              </div>
              <div className="text-xl font-semibold text-text-primary mb-1">
                {readiness?.label}
              </div>
              <div className="text-sm text-text-secondary">
                {checkedCount} of {totalBarriers} barriers identified
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              {criticalIssues > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: '#ef4444' + '20' }}>
                  <span className="font-bold" style={{ color: '#ef4444' }}>⚠️ {criticalIssues}</span>
                  <span className="text-text-secondary">Critical issues</span>
                </div>
              )}
              {highIssues > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ backgroundColor: '#f59e0b' + '20' }}>
                  <span className="font-bold" style={{ color: '#f59e0b' }}>⚡ {highIssues}</span>
                  <span className="text-text-secondary">High priority issues</span>
                </div>
              )}
            </div>

            <button
              onClick={clearAll}
              className="px-4 py-2 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)'
              }}
            >
              Clear All
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-xl font-semibold text-text-primary mb-1">
              Not Yet Assessed
            </div>
            <div className="text-sm text-text-secondary">
              Check the barriers present on your site to calculate your readiness score
            </div>
          </div>
        )}
      </motion.div>

      {/* Test Categories */}
      <div className="space-y-8">
        {testCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-text-primary mb-1">
                  {category.title}
                </h4>
                <p className="text-text-secondary">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {category.barriers.map(barrier => {
                const isChecked = checkedBarriers[barrier.id] || false;
                const priorityColor = 
                  barrier.priority === 'critical' ? '#ef4444' :
                  barrier.priority === 'high' ? '#f59e0b' : '#6366f1';

                return (
                  <motion.div
                    key={barrier.id}
                    layout
                    className="p-4 rounded-lg border transition-all cursor-pointer"
                    style={{
                      backgroundColor: isChecked 
                        ? priorityColor + '10'
                        : 'var(--color-surface-elevated)',
                      borderColor: isChecked 
                        ? priorityColor 
                        : 'var(--color-border-subtle)',
                      borderWidth: isChecked ? '2px' : '1px'
                    }}
                    onClick={() => toggleBarrier(barrier.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleBarrier(barrier.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-5 h-5 cursor-pointer"
                        style={{ accentColor: priorityColor }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{barrier.icon}</span>
                          <h5 className="font-bold text-text-primary">
                            {barrier.title}
                          </h5>
                          <span
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: priorityColor + '20',
                              color: priorityColor
                            }}
                          >
                            {barrier.priority.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-semibold text-text-primary">Problem: </span>
                            <span className="text-text-secondary">{barrier.problem}</span>
                          </div>
                          <div>
                            <span className="font-semibold" style={{ color: '#ef4444' }}>
                              Agent Impact: 
                            </span>
                            <span className="text-text-secondary"> {barrier.agentImpact}</span>
                          </div>
                          {isChecked && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 border-t"
                              style={{ borderColor: 'var(--color-border-subtle)' }}
                            >
                              <div className="mb-2">
                                <span className="font-semibold" style={{ color: '#10b981' }}>
                                  ✓ Solution: 
                                </span>
                                <span className="text-text-secondary"> {barrier.solution}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-text-primary">
                                  Human Impact: 
                                </span>
                                <span className="text-text-secondary">{barrier.humanImpact}</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testing Prompt Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-lg border-2 space-y-4"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#6366f1'
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">🧪</span>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-text-primary mb-2">
              Test Your Site with AI Agents
            </h4>
            <p className="text-text-secondary mb-4">
              Generate a testing prompt for AI agents. The prompt will ask the agent 
              to navigate your site and report barriers encountered.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select AI Platform to Test
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {activePlatforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-3 rounded border-2 transition-all text-left ${
                        selectedPlatform === platform.id
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-color bg-surface-primary hover:border-accent-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{platform.icon}</span>
                        <span className="text-sm font-bold text-text-primary">{platform.name}</span>
                      </div>
                      {platform.agentMode && (
                        <span className="text-xs text-accent-primary">✓ Agent Mode</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Your Website URL (optional)
                </label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 rounded border text-text-primary"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border-subtle)'
                  }}
                />
                {currentPlatform && (
                  <p className="text-xs text-text-muted mt-1">
                    Will add tracking: utm_source={currentPlatform.utmSource}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="px-6 py-3 rounded font-medium transition-all"
                  style={{
                    backgroundColor: '#6366f1',
                    color: 'white'
                  }}
                >
                  {showPrompt ? 'Hide Prompt' : 'Generate Test Prompt'}
                </button>
                {showPrompt && (
                  <button
                    onClick={copyPromptToClipboard}
                    className="px-6 py-3 rounded font-medium transition-all border"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderColor: '#6366f1',
                      color: '#6366f1'
                    }}
                  >
                    📋 Copy to Clipboard
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showPrompt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded border font-mono text-sm whitespace-pre-wrap"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border-subtle)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {generateTestPrompt()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#6366f1' + '10' }}>
              <p className="text-sm text-text-secondary">
                <strong style={{ color: '#6366f1' }}>💡 Tip:</strong> Add{' '}
                <code className="px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-surface)' }}>
                  ?utm_source=chatgpt.com
                </code>{' '}
                to your URL to track agent visits in Google Analytics 4. Only ~54% of agents 
                support GA4 (visual browsers), but this helps measure what you can.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
