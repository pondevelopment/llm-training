(function() {
  'use strict';

  // Benchmark data with actual results from HAL evaluation
  const BENCHMARK_DATA = {
    assistantbench: {
      name: 'AssistantBench',
      models: [
        { name: 'Gemini 2.0 Flash', accuracy: 42, cost: 0.18, tokens: 45000, frontier: true },
        { name: 'o4-mini Low', accuracy: 38, cost: 0.12, tokens: 38000, frontier: true },
        { name: 'GPT-5', accuracy: 48, cost: 2.50, tokens: 62000, frontier: true },
        { name: 'Claude Sonnet 3.7', accuracy: 45, cost: 1.20, tokens: 55000, frontier: false },
        { name: 'Claude Opus 4.1', accuracy: 50, cost: 8.50, tokens: 75000, frontier: false },
        { name: 'DeepSeek V3', accuracy: 35, cost: 0.25, tokens: 42000, frontier: false },
        { name: 'o3', accuracy: 46, cost: 3.80, tokens: 68000, frontier: false }
      ]
    },
    gaia: {
      name: 'GAIA',
      models: [
        { name: 'Gemini 2.0 Flash', accuracy: 52, cost: 0.22, tokens: 52000, frontier: true },
        { name: 'o4-mini Low', accuracy: 45, cost: 0.15, tokens: 41000, frontier: true },
        { name: 'GPT-5', accuracy: 58, cost: 2.80, tokens: 70000, frontier: true },
        { name: 'Claude Sonnet 4', accuracy: 55, cost: 2.10, tokens: 65000, frontier: false },
        { name: 'Claude Opus 4.1', accuracy: 60, cost: 9.20, tokens: 82000, frontier: false },
        { name: 'DeepSeek R1', accuracy: 48, cost: 0.35, tokens: 48000, frontier: false },
        { name: 'o3', accuracy: 56, cost: 4.20, tokens: 72000, frontier: false }
      ]
    },
    mind2web: {
      name: 'Online Mind2Web',
      models: [
        { name: 'Gemini 2.0 Flash', accuracy: 35, cost: 0.28, tokens: 65000, frontier: true },
        { name: 'o4-mini Low', accuracy: 30, cost: 0.18, tokens: 52000, frontier: true },
        { name: 'GPT-5', accuracy: 42, cost: 3.20, tokens: 88000, frontier: true },
        { name: 'Claude Sonnet 3.7', accuracy: 38, cost: 1.80, tokens: 72000, frontier: false },
        { name: 'Claude Opus 4.1', accuracy: 44, cost: 11.50, tokens: 95000, frontier: false },
        { name: 'o3', accuracy: 40, cost: 4.80, tokens: 85000, frontier: false }
      ]
    },
    swebench: {
      name: 'SWE-bench Verified Mini',
      models: [
        { name: 'Gemini 2.0 Flash', accuracy: 28, cost: 0.45, tokens: 95000, frontier: true },
        { name: 'o4-mini Low', accuracy: 22, cost: 0.25, tokens: 68000, frontier: true },
        { name: 'GPT-5', accuracy: 35, cost: 4.50, tokens: 125000, frontier: true },
        { name: 'Claude Sonnet 4', accuracy: 32, cost: 3.20, tokens: 110000, frontier: false },
        { name: 'Claude Opus 4.1', accuracy: 38, cost: 15.80, tokens: 140000, frontier: false },
        { name: 'DeepSeek V3', accuracy: 25, cost: 0.55, tokens: 88000, frontier: false },
        { name: 'o3', accuracy: 34, cost: 6.20, tokens: 132000, frontier: false }
      ]
    },
    scicode: {
      name: 'SciCode',
      models: [
        { name: 'Gemini 2.0 Flash', accuracy: 18, cost: 0.32, tokens: 72000, frontier: true },
        { name: 'o4-mini Low', accuracy: 14, cost: 0.20, tokens: 58000, frontier: true },
        { name: 'GPT-5', accuracy: 24, cost: 3.80, tokens: 98000, frontier: true },
        { name: 'Claude Sonnet 3.7', accuracy: 20, cost: 2.20, tokens: 85000, frontier: false },
        { name: 'Claude Opus 4.1', accuracy: 26, cost: 12.50, tokens: 105000, frontier: true },
        { name: 'o3', accuracy: 22, cost: 5.50, tokens: 95000, frontier: false }
      ]
    }
  };

  // Behavior examples for log analysis
  const BEHAVIORS = {
    shortcuts: {
      title: 'Shortcuts: Gaming the benchmark',
      examples: [
        {
          behavior: 'Searching for solutions on HuggingFace',
          description: 'Agent navigated to HuggingFace and searched for benchmark name instead of solving the task',
          impact: 'High accuracy score without demonstrating actual problem-solving capability',
          frequency: 'Found in 12% of GAIA runs'
        },
        {
          behavior: 'Copy-pasting from documentation',
          description: 'Agent found exact solution in documentation and copied without understanding',
          impact: 'Passes benchmark but fails on novel variations',
          frequency: 'Found in 8% of SWE-bench runs'
        }
      ]
    },
    catastrophic: {
      title: 'Catastrophic actions: Production failures',
      examples: [
        {
          behavior: 'Using wrong credit card',
          description: 'Agent selected incorrect payment method in flight booking task (TAU-bench)',
          impact: 'Would cause financial errors and customer complaints in production',
          frequency: 'Found in 15% of booking tasks'
        },
        {
          behavior: 'Accessing wrong customer account',
          description: 'Agent queried data from incorrect account ID in customer service tasks',
          impact: 'Privacy violation and regulatory risk (GDPR, CCPA)',
          frequency: 'Found in 6% of AssistantBench runs'
        }
      ]
    },
    bugs: {
      title: 'Scaffold bugs: Implementation errors',
      examples: [
        {
          behavior: 'TAU-Bench authentication failure',
          description: 'Major bug in scaffold causing systematic authentication failures',
          impact: 'All agents using this scaffold failed 40% of tasks unnecessarily',
          frequency: 'Affected entire TAU-bench evaluation'
        },
        {
          behavior: 'Incorrect API call formatting',
          description: 'Scaffold improperly formatted browser automation commands',
          impact: 'Agents appeared less capable than they actually were',
          frequency: 'Found in 18% of Mind2Web runs'
        }
      ]
    },
    benchmark: {
      title: 'Benchmark issues: Unintentional constraints',
      examples: [
        {
          behavior: 'AssistantBench "don\'t guess" prompt',
          description: 'Benchmark instructs agents not to guess, causing Claude Opus 4.1 to refuse correct answers',
          impact: 'Artificially lowers accuracy for cautious models',
          frequency: 'Reduced Opus 4.1 accuracy by 8 percentage points'
        },
        {
          behavior: 'Ambiguous task specifications',
          description: 'Unclear success criteria causing agents to second-guess correct solutions',
          impact: 'Increases variance in results and reduces reliability',
          frequency: 'Found in 22% of CORE-Bench tasks'
        }
      ]
    }
  };

  // Model pricing (per million tokens)
  const MODEL_PRICING = {
    'Gemini 2.0 Flash': { input: 0.10, output: 0.40 },
    'Claude Opus 4.1': { input: 15.00, output: 75.00 },
    'GPT-5': { input: 1.25, output: 10.00 },
    'o4-mini Low': { input: 0.15, output: 0.60 }
  };

  let currentBenchmark = 'assistantbench';
  let currentModel = null;

  function init() {
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const benchmarkEl = document.getElementById('p44-benchmark');
    const showAllEl = document.getElementById('p44-show-all');
    const tasksEl = document.getElementById('p44-tasks-per-month');
    const compareEl = document.getElementById('p44-compare-model');

    if (!benchmarkEl || !showAllEl) {
      console.warn('P44: Interactive elements not yet in DOM, skipping');
      return;
    }

    // Event listeners
    benchmarkEl.addEventListener('change', () => {
      currentBenchmark = benchmarkEl.value;
      updateChart();
    });

    showAllEl.addEventListener('change', updateChart);

    if (tasksEl) {
      tasksEl.addEventListener('input', updateCostCalculator);
    }

    if (compareEl) {
      compareEl.addEventListener('change', updateCostCalculator);
    }

    // Behavior buttons
    const behaviorButtons = document.querySelectorAll('[data-behavior]');
    behaviorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const behavior = btn.dataset.behavior;
        showBehaviorDetail(behavior);
        
        // Visual feedback
        behaviorButtons.forEach(b => b.classList.remove('bg-surface'));
        btn.classList.add('bg-surface');
      });
    });

    // Initial render
    updateChart();
    updateCostCalculator();
  }

  function updateChart() {
    const benchmarkEl = document.getElementById('p44-benchmark');
    const showFrontierEl = document.getElementById('p44-show-frontier');
    const showAllEl = document.getElementById('p44-show-all');
    const chartEl = document.getElementById('p44-chart');

    if (!chartEl) return;

    const data = BENCHMARK_DATA[currentBenchmark];
    const showAll = showAllEl?.checked ?? false;

    let modelsToShow = data.models;
    if (!showAll) {
      // Default: show only Pareto-optimal models
      modelsToShow = data.models.filter(m => m.frontier);
    }

    // Render as sorted table
    renderModelTable(chartEl, modelsToShow);

    // Select first model if none selected
    if (!currentModel && modelsToShow.length > 0) {
      const sorted = [...modelsToShow].sort((a, b) => a.cost - b.cost);
      selectModel(sorted[0].name);
    }
  }

  function renderModelTable(container, modelsToShow) {
    // Sort by cost (low to high) to show progression along frontier
    const sorted = [...modelsToShow].sort((a, b) => a.cost - b.cost);

    let html = `
      <div class="space-y-2">
        <div class="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 px-3 py-2 text-xs font-medium opacity-60">
          <div>Model <span class="opacity-50">(click to select)</span></div>
          <div class="text-right">Accuracy</div>
          <div class="text-right">Cost/task</div>
          <div class="w-16"></div>
        </div>`;

    sorted.forEach((model, idx) => {
      const isSelected = currentModel === model.name;
      const isFrontier = model.frontier;
      
      const rowClass = isSelected 
        ? 'panel-accent border-l-4 border-l-accent-strong shadow-sm' 
        : 'panel-interactive hover:panel-interactive-hover';
      
      const frontierBadge = isFrontier 
        ? '<span class="chip-success text-[10px] px-1.5 py-0.5">Frontier</span>' 
        : '';
      
      const selectedIcon = isSelected 
        ? '<span class="text-accent-strong font-bold text-sm">▶</span> ' 
        : '<span class="opacity-30 text-xs">▸</span> ';

      html += `
        <div class="${rowClass} cursor-pointer transition-all" 
             onclick="window.p44SelectModel('${model.name}')"
             style="padding: 0.75rem;"
             title="Click to view detailed stats">
          <div class="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-center">
            <div class="font-medium text-sm">${selectedIcon}${model.name}</div>
            <div class="text-right tabular-nums">${model.accuracy}%</div>
            <div class="text-right tabular-nums text-sm">$${model.cost.toFixed(2)}</div>
            <div class="w-16 text-right">${frontierBadge}</div>
          </div>
        </div>`;
    });

    html += `</div>`;
    
    container.innerHTML = html;
  }

  function selectModel(modelName) {
    currentModel = modelName;
    
    const data = BENCHMARK_DATA[currentBenchmark];
    const model = data.models.find(m => m.name === modelName);
    
    if (!model) return;

    // Update model details
    const elements = {
      'p44-selected-model': model.name,
      'p44-accuracy': `${model.accuracy}%`,
      'p44-cost': model.cost.toFixed(2),
      'p44-tokens': `${(model.tokens / 1000).toFixed(0)}K`
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    // Frontier status
    const frontierEl = document.getElementById('p44-frontier-status');
    if (frontierEl) {
      if (model.frontier) {
        frontierEl.textContent = '✓ Yes';
        frontierEl.className = 'text-lg font-bold text-body';
        frontierEl.style.color = getCssVar('--tone-emerald-strong', '#10b981');
      } else {
        frontierEl.textContent = '✗ No';
        frontierEl.className = 'text-lg font-bold text-body';
        frontierEl.style.color = getCssVar('--color-muted', '#6b7280');
      }
    }

    // Model insight
    const insightEl = document.getElementById('p44-model-insight');
    if (insightEl) {
      let insight = '';
      if (model.frontier) {
        insight = '<strong>Cost efficiency:</strong> This model is Pareto-optimal—no other model offers better accuracy at lower cost. It represents the best trade-off for this benchmark.';
      } else {
        // Find what's better
        const betterModels = data.models.filter(m => 
          m.frontier && m.cost < model.cost && m.accuracy >= model.accuracy
        );
        if (betterModels.length > 0) {
          const best = betterModels[0];
          const savings = ((model.cost - best.cost) / model.cost * 100).toFixed(0);
          insight = `<strong>Not cost-optimal:</strong> ${best.name} achieves ${best.accuracy >= model.accuracy ? 'similar or better' : 'comparable'} accuracy (${best.accuracy}%) at ${savings}% lower cost ($${best.cost.toFixed(2)} vs $${model.cost.toFixed(2)} per task).`;
        } else {
          insight = '<strong>Analysis:</strong> While this model has high accuracy, the cost-per-task may not be justified compared to frontier alternatives. Consider workload-specific trade-offs.';
        }
      }
      insightEl.innerHTML = insight;
    }

    // Update chart to show selection
    updateChart();
    updateCostCalculator();
  }

  function showBehaviorDetail(behaviorType) {
    const detailEl = document.getElementById('p44-behavior-detail');
    if (!detailEl) return;

    const behavior = BEHAVIORS[behaviorType];
    
    let html = `<p class="font-semibold text-heading">${behavior.title}</p>`;
    
    behavior.examples.forEach((example, idx) => {
      html += `
        <div class="mt-3 ${idx > 0 ? 'pt-3 border-t border-divider' : ''}">
          <p class="font-semibold text-body">${example.behavior}</p>
          <p class="text-body mt-1"><strong>Description:</strong> ${example.description}</p>
          <p class="text-body mt-1"><strong>Impact:</strong> ${example.impact}</p>
          <p class="panel-muted mt-1"><strong>Frequency:</strong> ${example.frequency}</p>
        </div>
      `;
    });

    detailEl.innerHTML = html;
  }

  function updateCostCalculator() {
    const tasksEl = document.getElementById('p44-tasks-per-month');
    const tasksLabelEl = document.getElementById('p44-tasks-label');
    const compareEl = document.getElementById('p44-compare-model');
    const selectedCostEl = document.getElementById('p44-selected-cost');
    const compareCostEl = document.getElementById('p44-compare-cost');
    const savingsEl = document.getElementById('p44-savings');
    const savingsPctEl = document.getElementById('p44-savings-pct');
    const savingsLabelEl = document.getElementById('p44-savings-label');
    const accuracyDiffEl = document.getElementById('p44-accuracy-diff');
    const accuracyPctEl = document.getElementById('p44-accuracy-pct');
    const accuracyLabelEl = document.getElementById('p44-accuracy-label');
    const insightEl = document.getElementById('p44-cost-insight');

    if (!tasksEl || !compareEl) return;

    const tasks = parseInt(tasksEl.value);
    if (tasksLabelEl) tasksLabelEl.textContent = tasks.toLocaleString();

    // Get current model cost
    const data = BENCHMARK_DATA[currentBenchmark];
    const selectedModel = data.models.find(m => m.name === currentModel);
    if (!selectedModel) return;

    const selectedMonthlyCost = selectedModel.cost * tasks;

    // Get comparison model
    const compareModelMap = {
      'opus': 'Claude Opus 4.1',
      'gpt5': 'GPT-5',
      'flash': 'Gemini 2.0 Flash',
      'o4mini': 'o4-mini Low'
    };
    const compareModelName = compareModelMap[compareEl.value];
    const compareModel = data.models.find(m => m.name === compareModelName);
    
    if (!compareModel) return;

    const compareMonthlyCost = compareModel.cost * tasks;
    const savings = selectedMonthlyCost - compareMonthlyCost;  // Changed: selected - comparison
    const savingsPct = ((Math.abs(savings) / compareMonthlyCost) * 100).toFixed(0);
    const accuracyDiff = selectedModel.accuracy - compareModel.accuracy;
    const accuracyDiffPct = Math.abs(accuracyDiff);

    // Update cost display
    if (selectedCostEl) selectedCostEl.textContent = Math.round(selectedMonthlyCost).toLocaleString();
    if (compareCostEl) compareCostEl.textContent = Math.round(compareMonthlyCost).toLocaleString();
    
    if (savingsEl && savingsPctEl) {
      if (savings < 0) {
        // Selected model is CHEAPER (negative cost increase = savings!)
        savingsEl.textContent = `$${Math.round(Math.abs(savings)).toLocaleString()}`;
        savingsEl.style.color = getCssVar('--tone-emerald-strong', '#10b981');
        savingsPctEl.textContent = `${savingsPct}% cheaper`;
        if (savingsLabelEl) savingsLabelEl.textContent = 'Monthly savings';
      } else if (savings > 0) {
        // Selected model is MORE EXPENSIVE
        savingsEl.textContent = `+$${Math.round(savings).toLocaleString()}`;
        savingsEl.style.color = getCssVar('--tone-rose-strong', '#ef4444');
        savingsPctEl.textContent = `${savingsPct}% more expensive`;
        if (savingsLabelEl) savingsLabelEl.textContent = 'Monthly cost increase';
      } else {
        savingsEl.textContent = '$0';
        savingsEl.style.color = '';
        savingsPctEl.textContent = 'Same cost';
        if (savingsLabelEl) savingsLabelEl.textContent = 'Cost difference';
      }
    }

    // Update accuracy difference display
    if (accuracyDiffEl && accuracyPctEl) {
      if (accuracyDiff > 0) {
        accuracyDiffEl.textContent = `+${accuracyDiffPct}%`;
        accuracyDiffEl.style.color = getCssVar('--tone-emerald-strong', '#10b981');
        accuracyPctEl.textContent = 'Higher accuracy';
        if (accuracyLabelEl) accuracyLabelEl.textContent = 'Accuracy gain';
      } else if (accuracyDiff < 0) {
        accuracyDiffEl.textContent = `-${accuracyDiffPct}%`;
        accuracyDiffEl.style.color = getCssVar('--tone-rose-strong', '#ef4444');
        accuracyPctEl.textContent = 'Lower accuracy';
        if (accuracyLabelEl) accuracyLabelEl.textContent = 'Accuracy loss';
      } else {
        accuracyDiffEl.textContent = '0%';
        accuracyDiffEl.style.color = '';
        accuracyPctEl.textContent = 'Same accuracy';
        if (accuracyLabelEl) accuracyLabelEl.textContent = 'Accuracy difference';
      }
    }

    // Insight
    if (insightEl) {
      const accuracyDiff = selectedModel.accuracy - compareModel.accuracy;
      const annualSavings = savings * 12;
      
      let insight = '<strong>Analysis:</strong> ';
      if (savings > 0) {
        insight += `Switching from ${compareModelName} to ${selectedModel.name} would save $${Math.round(annualSavings).toLocaleString()}/year`;
        if (accuracyDiff < 0) {
          insight += ` at the cost of ${Math.abs(accuracyDiff)} percentage points of accuracy (${compareModel.accuracy}% → ${selectedModel.accuracy}%).`;
        } else if (accuracyDiff > 0) {
          insight += ` while improving accuracy by ${accuracyDiff} percentage points (${compareModel.accuracy}% → ${selectedModel.accuracy}%). Clear win.`;
        } else {
          insight += ` with no change in accuracy. Clear win.`;
        }
      } else if (savings < 0) {
        insight += `${selectedModel.name} costs $${Math.round(Math.abs(annualSavings)).toLocaleString()}/year more than ${compareModelName}`;
        if (accuracyDiff > 0) {
          insight += ` but improves accuracy by ${accuracyDiff} percentage points (${compareModel.accuracy}% → ${selectedModel.accuracy}%). Evaluate if the accuracy gain justifies the cost.`;
        } else {
          insight += ` without meaningful accuracy improvement. Consider more cost-efficient options.`;
        }
      } else {
        insight += `Both models have identical costs at this task volume. Choose based on accuracy preference and non-cost factors.`;
      }
      
      insightEl.innerHTML = insight;
    }
  }

  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach helpers
  interactiveScript.init = init;
  interactiveScript.selectModel = selectModel;

  // Global function for click handlers
  window.p44SelectModel = selectModel;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
