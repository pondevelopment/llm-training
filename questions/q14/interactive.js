const interactiveScript = () => {
  const scenarios = [
    {
      name: "Medical Text Analysis",
      description: "Fine-tuning from general language to medical domain",
      domainShift: "high",
      basePerformance: { naive: 45, rehearsal: 65, ewc: 72, lora: 85 },
      newTaskPerformance: { naive: 88, rehearsal: 85, ewc: 82, lora: 87 }
    },
    {
      name: "Code Generation",
      description: "Adapting from text understanding to programming",
      domainShift: "very-high",
      basePerformance: { naive: 35, rehearsal: 55, ewc: 68, lora: 82 },
      newTaskPerformance: { naive: 92, rehearsal: 87, ewc: 84, lora: 89 }
    },
    {
      name: "Legal Document Processing",
      description: "Specialising from general NLP to legal domain",
      domainShift: "high",
      basePerformance: { naive: 50, rehearsal: 70, ewc: 78, lora: 88 },
      newTaskPerformance: { naive: 85, rehearsal: 82, ewc: 80, lora: 86 }
    },
    {
      name: "Creative Writing",
      description: "Shifting from technical to creative writing",
      domainShift: "medium",
      basePerformance: { naive: 60, rehearsal: 75, ewc: 80, lora: 90 },
      newTaskPerformance: { naive: 83, rehearsal: 81, ewc: 78, lora: 84 }
    },
    {
      name: "Customer Support",
      description: "Adapting from academic to conversational text",
      domainShift: "medium",
      basePerformance: { naive: 55, rehearsal: 72, ewc: 76, lora: 87 },
      newTaskPerformance: { naive: 86, rehearsal: 84, ewc: 81, lora: 85 }
    },
    {
      name: "Translation",
      description: "Adding translation to a monolingual model",
      domainShift: "very-high",
      basePerformance: { naive: 30, rehearsal: 50, ewc: 62, lora: 78 },
      newTaskPerformance: { naive: 90, rehearsal: 86, ewc: 83, lora: 88 }
    }
  ];

  const strategyConfig = {
    naive: {
      name: "Naive fine-tuning",
      toneVar: "--panel-warning-strong",
      borderVar: "--panel-warning-border-strong",
      fallbackStrong: getCssVar('--tone-amber-strong', '#f59e0b'),
      fallbackBorder: getCssVar('--tone-amber-border', '#fbbf24'),
      indicatorClass: "chip chip-warning text-xs",
      efficiency: 95,
      explanation: "No protection against forgetting. The model rapidly adapts to new data but loses previous knowledge. Fast and simple but catastrophic for knowledge retention."
    },
    rehearsal: {
      name: "Rehearsal",
      toneVar: "--panel-info-strong",
      borderVar: "--panel-info-border-strong",
      fallbackStrong: getCssVar('--tone-indigo-text', '#4338ca'),
      fallbackBorder: getCssVar('--tone-indigo-strong', '#6366f1'),
      indicatorClass: "chip chip-info text-xs",
      efficiency: 45,
      explanation: "Mixes old and new data during training. Helps retain knowledge but requires storing old data and significantly increases training time and memory usage."
    },
    ewc: {
      name: "Elastic Weight Consolidation",
      toneVar: "--panel-accent-strong",
      borderVar: "--panel-accent-border-strong",
      fallbackStrong: getCssVar('--tone-purple-strong', '#a855f7'),
      fallbackBorder: getCssVar('--tone-purple-border', '#c084fc'),
      indicatorClass: "chip chip-accent text-xs",
      efficiency: 60,
      explanation: "Uses Fisher Information Matrix to identify important weights and prevent large changes. Smart approach but requires computing importance scores and additional regularisation computations."
    },
    lora: {
      name: "LoRA (modular)",
      toneVar: "--panel-success-strong",
      borderVar: "--panel-success-border-strong",
      fallbackStrong: getCssVar('--tone-emerald-strong', '#22c55e'),
      fallbackBorder: getCssVar('--tone-emerald-border', '#34d399'),
      indicatorClass: "chip chip-success text-xs",
      efficiency: 85,
      explanation: "Adds small trainable modules while keeping the base model frozen. Excellent retention with good efficiency since only a small portion of parameters are trained. Not sure what LoRA is? Jump to Question 4 for a short comparison of LoRA vs QLoRA and practical guidance."
    }
  };

  const scenarioSelect = document.getElementById('q14-scenario-select');
  const strategyRadios = document.querySelectorAll('input[name="q14-strategy"]');
  const strategyFrames = Array.from(document.querySelectorAll('.q14-strategy'));
  const strategyIndicator = document.getElementById('q14-strategy-indicator');
  const learningRate = document.getElementById('q14-learning-rate');
  const rehearsalRatio = document.getElementById('q14-rehearsal-ratio');
  const ratioGroup = document.getElementById('q14-ratio-group');
  const lrDisplay = document.getElementById('q14-lr-display');
  const ratioDisplay = document.getElementById('q14-ratio-display');
  const rehearsalLabel = document.getElementById('q14-rehearsal-label');
  const newTaskElement = document.getElementById('q14-new-task');
  const retentionElement = document.getElementById('q14-retention');
  const efficiencyElement = document.getElementById('q14-efficiency');
  const newTaskBar = document.getElementById('q14-new-task-bar');
  const retentionBar = document.getElementById('q14-retention-bar');
  const efficiencyBar = document.getElementById('q14-efficiency-bar');
  const explanation = document.getElementById('q14-explanation');
  const STEP_IDS = ['q14-step1', 'q14-step2', 'q14-step3', 'q14-step4', 'q14-step5', 'q14-step6', 'q14-step7', 'q14-step8', 'q14-final'];

  const getCssVar = (name, fallback) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  };

  const mixColor = (tone, percentage, base) => {
    const pct = Math.max(0, Math.min(100, percentage));
    const remainder = Math.max(0, 100 - pct);
    const safeBase = base || getCssVar('--color-card', '#f1f5f9');
    return `color-mix(in srgb, ${tone} ${pct}%, ${safeBase} ${remainder}%)`;
  };

  const resetStrategyFrame = (frame) => {
    if (!frame) return;
    frame.classList.remove('q14-strategy-active');
    frame.style.background = '';
    frame.style.borderColor = '';
    frame.style.color = '';
    frame.style.boxShadow = '';
  };

  const applyStrategyFrame = (frame, config) => {
    if (!frame || !config) return;
    const darkMode = document.documentElement.classList.contains('dark');
    const cardColor = getCssVar('--color-card', '#f1f5f9');
    const borderBase = getCssVar('--color-border-subtle', '#e2e8f0');
    const heading = getCssVar('--color-heading', '#0f172a');
    const toneStrong = getCssVar(config.toneVar, config.fallbackStrong);
    const toneBorder = getCssVar(config.borderVar, config.fallbackBorder);
    const bgMix = mixColor(toneStrong, darkMode ? 34 : 18, cardColor);
    const borderMix = mixColor(toneBorder, darkMode ? 48 : 26, borderBase);
    const textMix = mixColor(toneStrong, darkMode ? 70 : 40, heading);

    frame.classList.add('q14-strategy-active');
    frame.style.background = bgMix;
    frame.style.borderColor = borderMix;
    frame.style.color = textMix;
    frame.style.boxShadow = darkMode
      ? '0 26px 60px -38px rgba(15, 23, 42, 0.72)'
      : '0 24px 52px -36px rgba(15, 23, 42, 0.24)';
  };

  const syncStrategyFrames = (activeStrategy) => {
    strategyFrames.forEach((frame) => {
      const input = frame.querySelector('input[type="radio"]');
      const value = input?.value;
      resetStrategyFrame(frame);
      if (value && value === activeStrategy) {
        applyStrategyFrame(frame, strategyConfig[value]);
      }
    });
  };

  const getCurrentScenario = () => {
    const index = Number(scenarioSelect?.value ?? 0);
    return scenarios[index] ?? scenarios[0];
  };

  const getCurrentStrategy = () => {
    const checked = Array.from(strategyRadios).find((radio) => radio.checked);
    return checked ? checked.value : 'naive';
  };

  const updateParameterDisplays = () => {
    if (learningRate && lrDisplay) {
      const lr = parseInt(learningRate.value, 10);
      lrDisplay.textContent = `${lr}e-5`;
    }
    if (rehearsalRatio && ratioDisplay) {
      const ratio = parseInt(rehearsalRatio.value, 10);
      ratioDisplay.textContent = `${ratio}%`;
    }
  };

  const setRehearsalRatioEnabled = (enabled) => {
    if (!rehearsalRatio) return;
    rehearsalRatio.disabled = !enabled;
    if (ratioGroup) {
      ratioGroup.classList.toggle('q14-disabled', !enabled);
    }
    if (rehearsalLabel) {
      rehearsalLabel.textContent = enabled
        ? 'Old data ratio (%)'
        : 'Old data ratio (%) — rehearsal only';
      rehearsalLabel.title = enabled ? '' : 'This control only affects the Rehearsal strategy.';
    }
  };

  const setMeter = (bar, value, color) => {
    if (!bar) return;
    const width = Math.max(0, Math.min(100, value));
    bar.style.setProperty('--q14-meter-width', `${width}%`);
    if (color) {
      bar.style.setProperty('--q14-meter-color', color);
    }
  };

  const getRetentionColor = (value) => {
    const darkMode = document.documentElement.classList.contains('dark');
    const card = getCssVar('--color-card', '#f1f5f9');
    let toneVar = '--panel-success-strong';
    let fallback = getCssVar('--tone-emerald-strong', '#22c55e');

    if (value < 40) {
      toneVar = '--color-path-scaling-strong';
      fallback = getCssVar('--tone-rose-strong', '#f43f5e');
    } else if (value < 60) {
      toneVar = '--panel-accent-strong';
      fallback = getCssVar('--tone-purple-strong', '#a855f7');
    } else if (value < 80) {
      toneVar = '--panel-warning-strong';
      fallback = getCssVar('--tone-amber-strong', '#f59e0b');
    }

    const tone = getCssVar(toneVar, fallback);
    return mixColor(tone, darkMode ? 52 : 28, card);
  };

  const getEfficiencyColor = (value) => {
    const darkMode = document.documentElement.classList.contains('dark');
    const card = getCssVar('--color-card', '#f1f5f9');

    if (value >= 75) {
      const tone = getCssVar('--panel-success-strong', '#22c55e');
      return mixColor(tone, darkMode ? 48 : 26, card);
    }
    if (value >= 50) {
      const tone = getCssVar('--panel-warning-strong', '#f59e0b');
      return mixColor(tone, darkMode ? 46 : 24, card);
    }
    const tone = getCssVar('--color-path-scaling-strong', '#f43f5e');
    return mixColor(tone, darkMode ? 50 : 28, card);
  };

  const updateForgettingVisualization = (strategy, scenario, ratio) => {
    let forgettingRate = 0.08;
    switch (strategy) {
      case 'rehearsal':
        forgettingRate = 0.04;
        break;
      case 'ewc':
        forgettingRate = 0.03;
        break;
      case 'lora':
        forgettingRate = 0.01;
        break;
      default:
        forgettingRate = 0.08;
    }

    if (strategy === 'rehearsal' && typeof ratio === 'number') {
      forgettingRate = Math.max(0.005, forgettingRate - ratio * 0.0005);
    }

    const domainMultiplier = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      'very-high': 2.0
    };
    const multiplier = domainMultiplier[scenario.domainShift] ?? 1;
    forgettingRate *= multiplier;

    STEP_IDS.forEach((stepId, index) => {
      const element = document.getElementById(stepId);
      if (!element) return;
      const retention = Math.max(20, 100 - forgettingRate * 100 * (index + 1));
      element.style.setProperty('--q14-trend-height', `${retention}%`);
      element.style.setProperty('--q14-trend-color', getRetentionColor(retention));
      element.title = `Step ${index + 1}: ${retention.toFixed(0)}% retention`;
    });
  };

  const updateDisplay = () => {
    const scenario = getCurrentScenario();
    const strategy = getCurrentStrategy();
    const config = strategyConfig[strategy] ?? strategyConfig.naive;
    const lr = learningRate ? parseInt(learningRate.value, 10) : 5;
    const ratio = rehearsalRatio ? parseInt(rehearsalRatio.value, 10) : 30;

    if (strategyIndicator && config) {
      strategyIndicator.textContent = config.name;
      strategyIndicator.className = config.indicatorClass;
    }

    syncStrategyFrames(strategy);
    setRehearsalRatioEnabled(strategy === 'rehearsal');

    let baseRetention = scenario.basePerformance[strategy] ?? 40;
    let newTaskPerf = scenario.newTaskPerformance[strategy] ?? 80;

    if (strategy === 'rehearsal') {
      baseRetention += Math.floor(ratio * 0.5);
      newTaskPerf -= Math.floor(ratio * 0.3);
    }

    if (lr > 7) {
      baseRetention -= 5;
      newTaskPerf += 2;
    } else if (lr < 3) {
      baseRetention += 3;
      newTaskPerf -= 3;
    }

    baseRetention = Math.max(15, Math.min(95, baseRetention));
    newTaskPerf = Math.max(60, Math.min(95, newTaskPerf));

    if (newTaskElement) newTaskElement.textContent = `${newTaskPerf}%`;
    if (retentionElement) retentionElement.textContent = `${baseRetention}%`;

    let efficiency = config.efficiency;
    if (strategy === 'rehearsal') {
      efficiency = Math.max(25, config.efficiency - Math.floor(ratio * 0.8));
    }

    if (efficiencyElement) {
      efficiencyElement.textContent = efficiency >= 75 ? 'High' : efficiency >= 50 ? 'Medium' : 'Low';
    }

    setMeter(newTaskBar, newTaskPerf, mixColor(getCssVar('--tone-sky-strong', '#0ea5e9'), document.documentElement.classList.contains('dark') ? 46 : 24, getCssVar('--color-card', '#f1f5f9')));
    setMeter(retentionBar, baseRetention, getRetentionColor(baseRetention));
    setMeter(efficiencyBar, efficiency, getEfficiencyColor(efficiency));

    updateForgettingVisualization(strategy, scenario, ratio);

    if (explanation) {
      const recommendation = strategy === 'naive'
        ? 'Switch to a forgetting prevention method for better retention.'
        : strategy === 'rehearsal'
          ? 'Consider increasing the old data ratio or trying EWC/LoRA for stronger retention.'
          : strategy === 'ewc'
            ? 'Great balance; fine-tune the regularisation strength to fit your domain.'
            : 'Excellent choice! LoRA keeps retention high without heavy compute.';

      const retentionMessage = baseRetention >= 80
        ? 'Excellent knowledge preservation!'
        : baseRetention >= 60
          ? 'Good balance of learning and retention.'
          : baseRetention >= 40
            ? 'Moderate forgetting — consider stronger protection.'
            : 'Significant catastrophic forgetting detected!';

      explanation.innerHTML = `
        <p><strong>${config.name} for ${scenario.name}:</strong></p>
        <p class="mt-2">${config.explanation}</p>
        <p class="mt-2"><strong>Results:</strong> ${newTaskPerf}% new task performance, ${baseRetention}% knowledge retention. ${retentionMessage}</p>
        <p class="mt-2"><strong>Recommendation:</strong> ${recommendation}</p>
      `;
    }
  };

  scenarioSelect?.addEventListener('change', updateDisplay);
  strategyRadios.forEach((radio) => {
    radio.addEventListener('change', updateDisplay);
  });
  learningRate?.addEventListener('input', () => {
    updateParameterDisplays();
    updateDisplay();
  });
  rehearsalRatio?.addEventListener('input', () => {
    updateParameterDisplays();
    updateDisplay();
  });

  const themeObserver = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.type === 'attributes')) {
      syncStrategyFrames(getCurrentStrategy());
      updateDisplay();
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  updateParameterDisplays();
  updateDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question14Interactive = interactiveScript;
}
