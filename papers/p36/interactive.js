// Paper 36: ReasoningBank - Memory-Driven Agent Self-Evolution
// Interactive simulator for memory architectures and test-time scaling

(function() {
  'use strict';

  // Base performance metrics from paper (WebArena results with Gemini-2.5-flash)
  const BASE_METRICS = {
    none: { successRate: 40.5, steps: 9.7, memoryKB: 0, retrievalMs: 0 },
    trajectory: { successRate: 42.1, steps: 9.2, memoryKB: 850, retrievalMs: 120 }, // Synapse
    workflow: { successRate: 44.1, steps: 9.0, memoryKB: 180, retrievalMs: 35 }, // AWM
    reasoning: { successRate: 48.8, steps: 8.3, memoryKB: 245, retrievalMs: 45 } // ReasoningBank
  };

  // Task complexity modifiers
  const COMPLEXITY_MODIFIERS = {
    simple: { successMult: 1.15, stepsMult: 0.90, learningRate: 0.12 },
    moderate: { successMult: 1.0, stepsMult: 1.0, learningRate: 0.08 },
    complex: { successMult: 0.85, stepsMult: 1.20, learningRate: 0.05 }
  };

  // MaTTS scaling effects (based on Figure 4 - WebArena Shopping, k=1 baseline ~49.7%)
  // successLift values are percentage points (pp), not relative percentages
  const MATTS_EFFECTS = {
    none: { successLift: 0, computeMult: 1.0, memoryQuality: 'baseline' },
    parallel: {
      1: { successLift: 0, computeMult: 1.0, memoryQuality: 'baseline' },
      2: { successLift: 3.2, computeMult: 2.0, memoryQuality: 'good' },        // ~52.9% in paper
      3: { successLift: 2.7, computeMult: 3.0, memoryQuality: 'high' },        // 52.4% in paper
      4: { successLift: 4.2, computeMult: 4.0, memoryQuality: 'high' },        // ~54.0% estimated
      5: { successLift: 5.4, computeMult: 5.0, memoryQuality: 'very high' }    // 55.1% in paper
    },
    sequential: {
      1: { successLift: 0, computeMult: 1.0, memoryQuality: 'baseline' },
      2: { successLift: 2.7, computeMult: 2.0, memoryQuality: 'good' },        // ~52.4% estimated
      3: { successLift: 4.0, computeMult: 3.0, memoryQuality: 'high' },        // ~53.5% in paper
      4: { successLift: 4.5, computeMult: 4.0, memoryQuality: 'high' },        // ~54.0% in paper
      5: { successLift: 4.8, computeMult: 5.0, memoryQuality: 'very high' }    // 54.5% in paper
    }
  };

  function calculateMetrics() {
    const memoryType = document.getElementById('memoryType')?.value || 'reasoning';
    const numTasks = parseInt(document.getElementById('numTasks')?.value || 50);
    const taskComplexity = document.getElementById('taskComplexity')?.value || 'moderate';
    const failureRate = parseInt(document.getElementById('failureRate')?.value || 30) / 100;
    const scalingMode = document.getElementById('scalingMode')?.value || 'none';
    const scalingFactor = parseInt(document.getElementById('scalingFactor')?.value || 1);
    const learningMode = document.getElementById('learningMode')?.value || 'both';

    // Get base metrics for selected memory type
    const base = BASE_METRICS[memoryType];
    const complexity = COMPLEXITY_MODIFIERS[taskComplexity];

    // Apply complexity modifiers
    let successRate = base.successRate * complexity.successMult;
    let avgSteps = base.steps * complexity.stepsMult;

    // Calculate failure rate impact on learning
    // Higher failure rate = more learning signal (but lower starting point)
    const failureLearningBoost = memoryType !== 'none' ? 1 + (failureRate - 0.3) * 0.3 : 1;
    const failureStartPenalty = 1 - (failureRate - 0.3) * 0.4;

    // Calculate learning curve data with failure rate effects
    const learningCurve = generateLearningCurve(
      base.successRate * complexity.successMult * failureStartPenalty,
      complexity.learningRate * failureLearningBoost,
      numTasks,
      memoryType
    );

    // Final success rate from learning curve (last batch)
    successRate = learningCurve[learningCurve.length - 1].rate;

    // Memory composition for success/failure learning
    const memoryComposition = calculateMemoryComposition(memoryType, learningMode);

    // MaTTS effects
    const matts = calculateMaTTS(scalingMode, scalingFactor, successRate);

    return {
      successRate: Math.min(95, successRate),
      avgSteps: avgSteps,
      memoryKB: base.memoryKB * (numTasks / 50),
      retrievalMs: base.retrievalMs,
      learningCurve: learningCurve,
      memoryComposition: memoryComposition,
      matts: matts,
      memoryType: memoryType,
      numTasks: numTasks,
      taskComplexity: taskComplexity,
      scalingMode: scalingMode,
      scalingFactor: scalingFactor,
      learningMode: learningMode
    };
  }

  function generateLearningCurve(baseRate, learningRate, numTasks, memoryType) {
    const batches = Math.ceil(numTasks / 10);
    const curve = [];
    
    for (let i = 0; i < batches; i++) {
      let rate;
      if (memoryType === 'none') {
        // No learning - flat line with small noise
        rate = baseRate * (0.98 + Math.random() * 0.04);
      } else {
        // Memory-enabled learning curve (logarithmic improvement)
        const improvement = learningRate * Math.log(i + 2) * 10;
        rate = baseRate + improvement;
      }
      
      curve.push({
        batch: i + 1,
        rate: Math.min(95, rate),
        tasks: (i + 1) * 10
      });
    }
    
    return curve;
  }

  function calculateMemoryComposition(memoryType, learningMode) {
    if (memoryType === 'none') {
      return {
        successStrategies: 0,
        failureGuardrails: 0,
        rawTrajectories: 0,
        positiveTactics: 0,
        preventativeTactics: 0
      };
    }

    if (memoryType === 'trajectory') {
      return {
        successStrategies: 0,
        failureGuardrails: 0,
        rawTrajectories: 100,
        positiveTactics: 60,
        preventativeTactics: 10
      };
    }

    if (memoryType === 'workflow') {
      return {
        successStrategies: 100,
        failureGuardrails: 0,
        rawTrajectories: 0,
        positiveTactics: 100,
        preventativeTactics: 0
      };
    }

    // ReasoningBank with both success and failure
    if (learningMode === 'both') {
      return {
        successStrategies: 65,
        failureGuardrails: 35,
        rawTrajectories: 0,
        positiveTactics: 85,
        preventativeTactics: 45
      };
    } else {
      // Success-only mode
      return {
        successStrategies: 100,
        failureGuardrails: 0,
        rawTrajectories: 0,
        positiveTactics: 100,
        preventativeTactics: 5
      };
    }
  }

  function calculateMaTTS(scalingMode, scalingFactor, baseSuccessRate) {
    if (scalingMode === 'none' || scalingFactor === 1) {
      return {
        successLift: 0,
        computeCost: 1.0,
        memoryQuality: 'baseline',
        newSuccessRate: baseSuccessRate
      };
    }

    const effects = MATTS_EFFECTS[scalingMode][scalingFactor];
    const successLift = effects.successLift * 100;
    const newSuccessRate = Math.min(95, baseSuccessRate * (1 + effects.successLift));

    return {
      successLift: successLift,
      computeCost: effects.computeMult,
      memoryQuality: effects.memoryQuality,
      newSuccessRate: newSuccessRate
    };
  }

  function generateInsights(metrics) {
    const insights = [];

    // Memory type insights
    if (metrics.memoryType === 'none') {
      insights.push('⚠️ <strong>No memory baseline:</strong> Agent treats each task independently. Success rate remains flat across tasks—no learning occurs. This is typical for stateless deployments but misses compound efficiency gains from experience reuse.');
    } else if (metrics.memoryType === 'trajectory') {
      insights.push('📝 <strong>Trajectory memory limitations:</strong> Storing raw interaction histories provides comprehensive records but suffers from noise and poor transferability. Retrieval costs are 2.7x higher than ReasoningBank due to longer sequences, and generalization to unseen tasks is weak.');
    } else if (metrics.memoryType === 'workflow') {
      insights.push('✅ <strong>Workflow memory trade-offs:</strong> Success-only procedures are compact and fast to retrieve, but you\'re blind to failure modes. When tasks deviate from learned workflows (cross-domain scenarios), performance degrades because no preventative guardrails exist.');
    } else if (metrics.memoryType === 'reasoning') {
      insights.push('🎯 <strong>ReasoningBank advantage:</strong> Distilled strategies abstract away implementation details while preserving transferable reasoning. Memory items are ~3.5x smaller than raw trajectories but ~1.4x larger than workflows—the sweet spot for quality/cost balance.');
    }

    // Learning mode insights
    if (metrics.learningMode === 'both' && metrics.memoryType === 'reasoning') {
      insights.push('💡 <strong>Failure learning enabled:</strong> 35% of your memory consists of preventative guardrails extracted from failed attempts. This coverage is critical for robustness—agents develop "don\'t try this" knowledge alongside "do this" tactics, reducing repeat errors by ~40%.');
    } else if (metrics.learningMode === 'success-only' && metrics.memoryType === 'reasoning') {
      insights.push('⚠️ <strong>Missing failure signal:</strong> Success-only extraction leaves valuable counterfactual lessons on the table. Without guardrails from failed experiences, agents are prone to repeating mistakes in edge cases—expect 15-20% higher failure rates on novel task variations.');
    }

    // Complexity insights
    if (metrics.taskComplexity === 'complex') {
      insights.push('🌐 <strong>Cross-domain challenge:</strong> Complex generalization amplifies memory quality differences. ReasoningBank\'s abstracted strategies transfer better than domain-specific workflows (+4.6% on WebArena Multi subset), but learning rate slows due to higher task diversity.');
    } else if (metrics.taskComplexity === 'simple') {
      insights.push('⚡ <strong>Single-domain optimization:</strong> Simple tasks show fastest learning curves—agents quickly saturate common patterns. Memory overhead may not justify ROI for narrow use cases; consider memory-free baseline if task distribution is highly homogeneous.');
    }

    // MaTTS insights
    if (metrics.scalingMode === 'parallel' && metrics.scalingFactor >= 3) {
      insights.push(`🔀 <strong>Parallel scaling synergy:</strong> Generating ${metrics.scalingFactor} trajectories with self-contrast produces ${metrics.matts.memoryQuality} quality memory (${metrics.matts.successLift.toFixed(1)}% success lift). Compute cost is ${metrics.scalingFactor}x but pays dividends through better strategy extraction—contrastive signal identifies robust patterns vs spurious solutions.`);
    } else if (metrics.scalingMode === 'sequential' && metrics.scalingFactor >= 2) {
      insights.push(`🔄 <strong>Sequential refinement value:</strong> ${metrics.scalingFactor} refinement iterations capture intermediate reasoning and self-corrections (${metrics.matts.successLift.toFixed(1)}% lift). This is more compute-efficient than parallel for tasks with clear feedback signals, but requires stronger base reasoning to avoid amplifying early mistakes.`);
    } else if (metrics.scalingMode !== 'none' && metrics.scalingFactor === 1) {
      insights.push('💭 <strong>Scaling disabled:</strong> Scaling factor of 1x means no test-time scaling applied. Increase to 3-5x to see MaTTS benefits—parallel mode for exploration, sequential for refinement. Cost-benefit analysis depends on task stakes and memory reuse frequency.');
    }

    // Learning curve insights
    const curveGrowth = metrics.learningCurve[metrics.learningCurve.length - 1].rate - metrics.learningCurve[0].rate;
    if (curveGrowth > 8) {
      insights.push(`📈 <strong>Strong learning trajectory:</strong> Success rate improved ${curveGrowth.toFixed(1)}% over ${metrics.numTasks} tasks. This slope indicates high memory reuse and good task similarity. Expect continued gains with larger task volumes—memory becomes more valuable as agent encounters related problems.`);
    } else if (curveGrowth < 3 && metrics.memoryType !== 'none') {
      insights.push('📉 <strong>Weak learning signal:</strong> Minimal improvement suggests low task overlap or poor memory retrieval. Audit your embedding model and retrieval strategy—consider increasing top-k, adding task metadata, or clustering memory items by domain.');
    }

    return insights;
  }

  function renderLearningCurve(curve) {
    const container = document.getElementById('learningCurve');
    if (!container) return;

    const width = container.offsetWidth || 800;
    const height = 200;
    const padding = { top: 10, right: 10, bottom: 30, left: 50 };
    
    const minRate = Math.min(...curve.map(d => d.rate));
    const maxRate = Math.max(...curve.map(d => d.rate));
    const rateRange = maxRate - minRate;
    
    // Calculate axis bounds with some padding (zoomed to show improvement detail)
    const yMin = Math.max(0, minRate - rateRange * 0.2);
    const yMax = Math.min(100, maxRate + rateRange * 0.1);
    
    // Generate SVG
    const points = curve.map((point, i) => {
      const x = padding.left + (i / (curve.length - 1)) * (width - padding.left - padding.right);
      const y = padding.top + (1 - (point.rate - yMin) / (yMax - yMin)) * (height - padding.top - padding.bottom);
      return { x, y, rate: point.rate, batch: point.batch, tasks: point.tasks };
    });
    
    // Create line path
    const linePath = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    // Create area fill path
    const areaPath = `M ${padding.left} ${height - padding.bottom} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${width - padding.right} ${height - padding.bottom} Z`;
    
    // Generate Y-axis labels (4-5 ticks)
    const yTicks = [];
    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const value = yMin + (yMax - yMin) * (i / tickCount);
      const y = padding.top + (1 - i / tickCount) * (height - padding.top - padding.bottom);
      yTicks.push({ value: value.toFixed(1), y });
    }
    
    const html = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" style="display: block;">
        <!-- Grid lines -->
        ${yTicks.map(tick => `
          <line x1="${padding.left}" y1="${tick.y}" x2="${width - padding.right}" y2="${tick.y}" 
                stroke=getCssVar('--color-border', '#e5e7eb') stroke-width="1" stroke-dasharray="3,3" />
        `).join('')}
        
        <!-- Area fill -->
        <path d="${areaPath}" fill=getCssVar('--tone-indigo-strong', '#6366f1') fill-opacity="0.1" />
        
        <!-- Line -->
        <path d="${linePath}" fill="none" stroke=getCssVar('--tone-indigo-strong', '#6366f1') stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Data points -->
        ${points.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="${i === 0 ? getCssVar('--color-muted', '#94a3b8') : (i === points.length - 1 ? getCssVar('--tone-indigo-strong', '#4f46e5') : getCssVar('--tone-indigo-strong', '#6366f1'))}" stroke="#fff" stroke-width="2">
            <title>Batch ${p.batch}: ${p.rate.toFixed(1)}%</title>
          </circle>
        `).join('')}
        
        <!-- Y-axis -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" 
              stroke=getCssVar('--color-muted', '#9ca3af') stroke-width="1.5" />
        
        <!-- Y-axis labels -->
        ${yTicks.map(tick => `
          <text x="${padding.left - 8}" y="${tick.y}" text-anchor="end" dominant-baseline="middle" 
                fill=getCssVar('--color-muted', '#6b7280') font-size="11" font-family="system-ui, sans-serif">${tick.value}%</text>
        `).join('')}
        
        <!-- X-axis -->
        <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" 
              stroke=getCssVar('--color-muted', '#9ca3af') stroke-width="1.5" />
        
        <!-- X-axis labels (show every other or every third batch if too many) -->
        ${points.filter((_, i) => curve.length <= 10 ? true : i % Math.ceil(curve.length / 8) === 0 || i === points.length - 1).map(p => `
          <text x="${p.x}" y="${height - padding.bottom + 18}" text-anchor="middle" 
                fill=getCssVar('--color-muted', '#6b7280') font-size="11" font-family="system-ui, sans-serif">${p.tasks}</text>
        `).join('')}
        
        <!-- Axis label -->
        <text x="${width / 2}" y="${height - 3}" text-anchor="middle" 
              fill=getCssVar('--color-muted', '#9ca3af') font-size="10" font-family="system-ui, sans-serif">Tasks Completed</text>
      </svg>
    `;

    container.innerHTML = html;
  }

  function renderMemoryComposition(composition) {
    const container = document.getElementById('memoryComposition');
    if (!container) return;

    const items = [];
    
    if (composition.rawTrajectories > 0) {
      items.push({ label: 'Raw trajectories', value: composition.rawTrajectories, color: getCssVar('--color-muted', '#94a3b8') });
    }
    if (composition.successStrategies > 0) {
      items.push({ label: 'Success strategies', value: composition.successStrategies, color: getCssVar('--tone-emerald-strong', '#10b981') });
    }
    if (composition.failureGuardrails > 0) {
      items.push({ label: 'Failure guardrails', value: composition.failureGuardrails, color: getCssVar('--tone-amber-strong', '#f59e0b') });
    }

    if (items.length === 0) {
      container.innerHTML = '<p class="text-xs text-muted">No memory stored</p>';
      return;
    }

    const html = items.map(item => `
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="text-body">${item.label}</span>
          <span class="font-bold text-heading">${item.value}%</span>
        </div>
        <div class="w-full bg-surface rounded-full h-2 overflow-hidden border border-divider">
          <div class="h-full" style="width: ${item.value}%; background: ${item.color};"></div>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  function updateUI() {
    const metrics = calculateMetrics();

    // Update main metrics
    const successRateEl = document.getElementById('successRate');
    const successBarEl = document.getElementById('successBar');
    if (successRateEl) successRateEl.textContent = `${metrics.successRate.toFixed(1)}%`;
    if (successBarEl) successBarEl.style.width = `${metrics.successRate}%`;

    const avgStepsEl = document.getElementById('avgSteps');
    const stepsBarEl = document.getElementById('stepsBar');
    if (avgStepsEl) avgStepsEl.textContent = metrics.avgSteps.toFixed(1);
    if (stepsBarEl) {
      const stepsPercent = Math.max(20, 100 - (metrics.avgSteps / 10) * 100);
      stepsBarEl.style.width = `${stepsPercent}%`;
    }

    const memorySizeEl = document.getElementById('memorySize');
    if (memorySizeEl) {
      if (metrics.memoryKB === 0) {
        memorySizeEl.textContent = '0 KB';
      } else if (metrics.memoryKB < 1024) {
        memorySizeEl.textContent = `${Math.round(metrics.memoryKB)} KB`;
      } else {
        memorySizeEl.textContent = `${(metrics.memoryKB / 1024).toFixed(1)} MB`;
      }
    }

    const retrievalTimeEl = document.getElementById('retrievalTime');
    if (retrievalTimeEl) retrievalTimeEl.textContent = `${metrics.retrievalMs} ms`;

    // Update labels
    const numTasksLabelEl = document.getElementById('numTasksLabel');
    if (numTasksLabelEl) numTasksLabelEl.textContent = metrics.numTasks;

    const failureRateLabelEl = document.getElementById('failureRateLabel');
    const failureRateEl = document.getElementById('failureRate');
    if (failureRateLabelEl && failureRateEl) {
      failureRateLabelEl.textContent = `${failureRateEl.value}%`;
    }

    const scalingFactorLabelEl = document.getElementById('scalingFactorLabel');
    if (scalingFactorLabelEl) scalingFactorLabelEl.textContent = metrics.scalingFactor;

    // Render learning curve
    renderLearningCurve(metrics.learningCurve);

    // Render memory composition
    renderMemoryComposition(metrics.memoryComposition);

    // Update tactics bars
    const positiveTacticsEl = document.getElementById('positiveTactics');
    const positiveTacticsBarEl = document.getElementById('positiveTacticsBar');
    if (positiveTacticsEl) positiveTacticsEl.textContent = `${metrics.memoryComposition.positiveTactics}%`;
    if (positiveTacticsBarEl) positiveTacticsBarEl.style.width = `${metrics.memoryComposition.positiveTactics}%`;

    const preventativeTacticsEl = document.getElementById('preventativeTactics');
    const preventativeTacticsBarEl = document.getElementById('preventativeTacticsBar');
    if (preventativeTacticsEl) preventativeTacticsEl.textContent = `${metrics.memoryComposition.preventativeTactics}%`;
    if (preventativeTacticsBarEl) preventativeTacticsBarEl.style.width = `${metrics.memoryComposition.preventativeTactics}%`;

    // Update MaTTS metrics
    const mattsNewSuccessRateEl = document.getElementById('mattsNewSuccessRate');
    if (mattsNewSuccessRateEl) {
      mattsNewSuccessRateEl.textContent = `${metrics.matts.newSuccessRate.toFixed(1)}%`;
    }
    
    const mattsSuccessLiftEl = document.getElementById('mattsSuccessLift');
    if (mattsSuccessLiftEl) {
      if (metrics.matts.successLift === 0) {
        mattsSuccessLiftEl.textContent = '—';
      } else {
        mattsSuccessLiftEl.textContent = `+${metrics.matts.successLift.toFixed(1)}%`;
      }
    }

    const mattsComputeCostEl = document.getElementById('mattsComputeCost');
    if (mattsComputeCostEl) mattsComputeCostEl.textContent = `${metrics.matts.computeCost.toFixed(1)}x`;

    const mattsMemoryQualityEl = document.getElementById('mattsMemoryQuality');
    if (mattsMemoryQualityEl) {
      const quality = metrics.matts.memoryQuality.charAt(0).toUpperCase() + metrics.matts.memoryQuality.slice(1);
      mattsMemoryQualityEl.textContent = quality;
    }

    // Generate and display insights
    const insights = generateInsights(metrics);
    const insightsEl = document.getElementById('insights');
    if (insightsEl) {
      insightsEl.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
    }
  }

  function init() {
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    // Attach event listeners
    const controls = [
      'memoryType',
      'numTasks',
      'taskComplexity',
      'failureRate',
      'scalingMode',
      'scalingFactor',
      'learningMode'
    ];

    controls.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', updateUI);
        el.addEventListener('input', updateUI);
      }
    });

    // Initial render
    updateUI();
  }

  // Export for browser global access
  if (typeof window !== 'undefined') {
    window.interactiveScript = init;
  }

  // CommonJS export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { interactiveScript: init };
  }
})();
