/**
 * Industry-Specific Insights Component
 * Shows vertical patterns for agentic search traffic and conversions
 * Based on ChatGPT Shopping data across different product categories
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verticalPatterns } from '../../data/optimizationTips';

export const IndustryInsights: React.FC = () => {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

  const getPatternColor = (verticalId: string) => {
    switch (verticalId) {
      case 'electronics': return '#6366f1'; // Indigo - highest volume
      case 'fashion': return '#ec4899'; // Pink - highest conversion
      case 'food-grocery': return '#10b981'; // Green - steady/repeat
      default: return '#6366f1';
    }
  };

  const getTrafficBadge = (pattern: string) => {
    if (pattern.includes('Highest')) {
      return { label: 'High Volume', color: '#6366f1', intensity: '100%' };
    } else if (pattern.includes('Moderate')) {
      return { label: 'Moderate Volume', color: '#f59e0b', intensity: '60%' };
    } else {
      return { label: 'Lower Volume', color: '#ef4444', intensity: '30%' };
    }
  };

  const getConversionBadge = (pattern: string) => {
    if (pattern.includes('10-15')) {
      return { label: 'Highest Conversion', color: '#10b981', rate: '10-15%' };
    } else if (pattern.includes('5-8')) {
      return { label: 'Above Average', color: '#6366f1', rate: '5-8%' };
    } else {
      return { label: 'Strong Repeat', color: '#f59e0b', rate: 'Recurring' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h3 className="text-3xl font-bold text-text-primary">
          📊 Industry-Specific Patterns
        </h3>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          Agent search behavior varies by vertical. Understanding your industry's patterns 
          helps prioritize optimization efforts.
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: 'var(--color-surface-elevated)' }}
      >
        <h4 className="text-lg font-bold text-text-primary mb-4">
          Key Findings Across Verticals
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded" style={{ backgroundColor: '#6366f1' + '10' }}>
            <div className="text-2xl mb-2">💻</div>
            <div className="text-sm font-bold text-text-primary mb-1">
              Electronics & Tech
            </div>
            <div className="text-xs text-text-secondary">
              Highest traffic volume. Rising fastest. Strong product data critical.
            </div>
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: '#ec4899' + '10' }}>
            <div className="text-2xl mb-2">👗</div>
            <div className="text-sm font-bold text-text-primary mb-1">
              Fashion & Apparel
            </div>
            <div className="text-xs text-text-secondary">
              Highest conversion (10-15%). Very qualified traffic despite lower volume.
            </div>
          </div>
          <div className="p-4 rounded" style={{ backgroundColor: '#10b981' + '10' }}>
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-sm font-bold text-text-primary mb-1">
              Food & Grocery
            </div>
            <div className="text-xs text-text-secondary">
              Strong repeat behavior. Dietary preferences drive subscription purchases.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vertical Cards */}
      <div className="grid gap-4">
        {verticalPatterns.map((vertical, idx) => {
          const isSelected = selectedVertical === vertical.id;
          const primaryColor = getPatternColor(vertical.id);
          const trafficBadge = getTrafficBadge(vertical.trafficPattern);
          const conversionBadge = getConversionBadge(vertical.conversionPattern);

          return (
            <motion.div
              key={vertical.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="rounded-lg border-2 transition-all overflow-hidden cursor-pointer"
              style={{
                backgroundColor: isSelected 
                  ? `${primaryColor}05`
                  : 'var(--color-surface-elevated)',
                borderColor: isSelected ? primaryColor : 'var(--color-border-subtle)'
              }}
              onClick={() => setSelectedVertical(isSelected ? null : vertical.id)}
            >
              {/* Header */}
              <div 
                className="p-4"
                style={{
                  backgroundColor: isSelected ? `${primaryColor}10` : 'transparent'
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl flex-shrink-0">{vertical.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-text-primary mb-2">
                        {vertical.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <div
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${trafficBadge.color}20`,
                            color: trafficBadge.color
                          }}
                        >
                          📈 {trafficBadge.label}
                        </div>
                        <div
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${conversionBadge.color}20`,
                            color: conversionBadge.color
                          }}
                        >
                          ✅ {conversionBadge.label}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-semibold text-text-primary mb-1">
                            Traffic Pattern
                          </div>
                          <div className="text-text-secondary">
                            {vertical.trafficPattern}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary mb-1">
                            Conversion Pattern
                          </div>
                          <div className="text-text-secondary">
                            {vertical.conversionPattern}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isSelected ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl flex-shrink-0"
                  >
                    ▼
                  </motion.span>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t"
                    style={{ borderColor: 'var(--color-border-subtle)' }}
                  >
                    <div className="p-4 space-y-4">
                      {/* Key Factors */}
                      <div>
                        <div className="font-bold text-text-primary mb-2 flex items-center gap-2">
                          <span style={{ color: primaryColor }}>🎯</span>
                          Key Success Factors
                        </div>
                        <ul className="space-y-2 text-sm text-text-secondary">
                          {vertical.keyFactors.map((factor, factorIdx) => (
                            <li key={factorIdx} className="flex items-start gap-2">
                              <span className="font-bold flex-shrink-0" style={{ color: primaryColor }}>
                                •
                              </span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Example */}
                      <div 
                        className="p-3 rounded"
                        style={{ backgroundColor: `${primaryColor}10` }}
                      >
                        <div className="font-bold text-sm mb-1" style={{ color: primaryColor }}>
                          💡 Real-World Example
                        </div>
                        <p className="text-sm text-text-secondary">
                          {vertical.example}
                        </p>
                      </div>

                      {/* Optimization Priorities */}
                      <div>
                        <div className="font-bold text-text-primary mb-2">
                          ⚡ Optimization Priorities for {vertical.name}
                        </div>
                        {vertical.id === 'electronics' && (
                          <ul className="space-y-1.5 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">1.</span>
                              <span><strong className="text-text-primary">Complete spec sheets:</strong> Include all technical specifications in JSON-LD schema</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">2.</span>
                              <span><strong className="text-text-primary">Model numbers:</strong> Clear product variants with consistent naming</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">3.</span>
                              <span><strong className="text-text-primary">Compatibility data:</strong> "Works with iPhone 15, Android 12+, Windows 11"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">4.</span>
                              <span><strong className="text-text-primary">Review volume:</strong> Aim for 50+ reviews with technical feedback</span>
                            </li>
                          </ul>
                        )}
                        {vertical.id === 'fashion' && (
                          <ul className="space-y-1.5 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">1.</span>
                              <span><strong className="text-text-primary">Sizing guides:</strong> Detailed measurements and fit descriptions (runs small/large, stretch)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">2.</span>
                              <span><strong className="text-text-primary">Use-case context:</strong> "Office-appropriate," "Gym wear," "Casual weekend"</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">3.</span>
                              <span><strong className="text-text-primary">Material details:</strong> Fabric content, care instructions, durability notes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">4.</span>
                              <span><strong className="text-text-primary">Style descriptors:</strong> Help agents convey visual aesthetics through text</span>
                            </li>
                          </ul>
                        )}
                        {vertical.id === 'food-grocery' && (
                          <ul className="space-y-1.5 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">1.</span>
                              <span><strong className="text-text-primary">Dietary tags:</strong> Vegan, gluten-free, organic, keto-friendly (structured data)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">2.</span>
                              <span><strong className="text-text-primary">Ingredient lists:</strong> Complete with allergen warnings prominently displayed</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">3.</span>
                              <span><strong className="text-text-primary">Subscription options:</strong> Clear recurring delivery frequency and pricing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold text-text-primary">4.</span>
                              <span><strong className="text-text-primary">Freshness guarantees:</strong> Delivery windows, shelf life, sourcing transparency</span>
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Cross-Vertical Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-lg"
        style={{ backgroundColor: '#6366f1' + '10' }}
      >
        <h4 className="text-lg font-bold text-text-primary mb-4">
          🔍 Cross-Vertical Insights
        </h4>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="flex items-start gap-2">
            <span className="font-bold text-text-primary">•</span>
            <p>
              <strong className="text-text-primary">Volume ≠ Conversion:</strong> Electronics drives the most traffic but fashion has 2x higher conversion. 
              Lower volume can mean more qualified, purchase-ready traffic.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-text-primary">•</span>
            <p>
              <strong className="text-text-primary">Technical detail matters everywhere:</strong> Even fashion benefits from precise sizing and material info. 
              Agents can't guess—they need complete, structured data.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-text-primary">•</span>
            <p>
              <strong className="text-text-primary">Context is king:</strong> Use-case descriptions ("perfect for office," "ideal for keto diet") help agents 
              match products to user intent better than generic features alone.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-text-primary">•</span>
            <p>
              <strong className="text-text-primary">Repeat behavior patterns:</strong> Food/grocery shows subscription success. Consider recurring delivery 
              options for any product category with consumable or replaceable items.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Vertical Selection Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 rounded-lg border-2"
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          borderColor: '#10b981'
        }}
      >
        <h4 className="text-lg font-bold text-text-primary mb-3">
          📋 Quick Reference: Optimize for Your Vertical
        </h4>
        <div className="space-y-2 text-sm">
          <div className="p-3 rounded" style={{ backgroundColor: '#6366f1' + '10' }}>
            <span className="font-bold" style={{ color: '#6366f1' }}>💻 Electronics:</span>
            <span className="text-text-secondary"> Focus on specs, model numbers, compatibility, reviews</span>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#ec4899' + '10' }}>
            <span className="font-bold" style={{ color: '#ec4899' }}>👗 Fashion:</span>
            <span className="text-text-secondary"> Prioritize sizing guides, use-cases, materials, fit descriptions</span>
          </div>
          <div className="p-3 rounded" style={{ backgroundColor: '#10b981' + '10' }}>
            <span className="font-bold" style={{ color: '#10b981' }}>🛒 Food & Grocery:</span>
            <span className="text-text-secondary"> Emphasize dietary tags, ingredients, subscriptions, freshness</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
