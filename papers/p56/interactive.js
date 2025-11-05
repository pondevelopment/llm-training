(function() {
  'use strict';

  // Model horizons at 50% success rate (in minutes), based on paper data
  // Source: Figure 1, Section 4.1
  const MODEL_HORIZONS = {
    'gpt2': { horizon50: 0.5, horizon80: 0.1, releaseDate: '2019-02', displayName: 'GPT-2' },
    'gpt3': { horizon50: 1, horizon80: 0.2, releaseDate: '2021-11', displayName: 'GPT-3 davinci-002' },
    'gpt35': { horizon50: 3, horizon80: 0.6, releaseDate: '2022-11', displayName: 'GPT-3.5 Turbo' },
    'gpt4-0314': { horizon50: 8, horizon80: 1.5, releaseDate: '2023-03', displayName: 'GPT-4 0314' },
    'gpt4-1106': { horizon50: 18, horizon80: 3.5, releaseDate: '2023-11', displayName: 'GPT-4 1106' },
    'claude3-opus': { horizon50: 22, horizon80: 4.5, releaseDate: '2024-03', displayName: 'Claude 3 Opus' },
    'gpt4o': { horizon50: 28, horizon80: 6, releaseDate: '2024-05', displayName: 'GPT-4o' },
    'claude35-old': { horizon50: 32, horizon80: 7, releaseDate: '2024-06', displayName: 'Claude 3.5 Sonnet' },
    'o1-preview': { horizon50: 35, horizon80: 10, releaseDate: '2024-09', displayName: 'o1-preview' },
    'claude35-new': { horizon50: 42, horizon80: 12, releaseDate: '2024-10', displayName: 'Claude 3.5 Sonnet (New)' },
    'o1': { horizon50: 39, horizon80: 11, releaseDate: '2024-12', displayName: 'o1' },
    'claude37': { horizon50: 59, horizon80: 15, releaseDate: '2025-02', displayName: 'Claude 3.7 Sonnet' }
  };

  // Doubling time in days (212 days = ~7 months)
  // Source: Section 4.1, Figure 1
  const DOUBLING_TIME_DAYS = 212;
  const BASE_YEAR = 2019;
  const BASE_MONTH = 2; // February
  const BASE_HORIZON_50 = 0.5; // GPT-2's baseline in minutes
  const BASE_HORIZON_80 = 0.1;
  const BASE_HORIZON_90 = 0.05;

  // Task examples mapped to time ranges (human completion time)
  const TASK_EXAMPLES = {
    ranges: [
      { max: 1, tasks: ['Look up a Wikipedia fact', 'Answer a single-sentence question', 'Format a JSON string'] },
      { max: 5, tasks: ['Write a simple function', 'Summarize a short article', 'Debug a syntax error'] },
      { max: 15, tasks: ['Refactor a class', 'Write documentation for a module', 'Analyze a stack trace'] },
      { max: 30, tasks: ['Implement a small feature', 'Debug a logic error across files', 'Review and comment on a PR'] },
      { max: 60, tasks: ['Implement a feature with unit tests', 'Debug a multi-file issue with log analysis', 'Write a research summary with citations'] },
      { max: 120, tasks: ['Research and prototype a solution', 'Refactor a subsystem with tests', 'Write a design doc with alternatives'] },
      { max: 240, tasks: ['Implement a complex feature end-to-end', 'Conduct a literature review', 'Debug a distributed systems issue'] },
      { max: 480, tasks: ['Design and implement a new module', 'Perform a security audit', 'Write a comprehensive technical spec'] },
      { max: 1440, tasks: ['Design a system architecture', 'Conduct a multi-day investigation', 'Implement a major refactor'] },
      { max: 10080, tasks: ['Complete a multi-week research project', 'Build a new service from scratch', 'Lead a major system migration'] }
    ]
  };

  function init() {
    // DOM elements
    const modeSelect = document.getElementById('p56-mode');
    const modelControl = document.getElementById('p56-model-control');
    const yearControl = document.getElementById('p56-year-control');
    const modelSelect = document.getElementById('p56-model');
    const yearSlider = document.getElementById('p56-year');
    const yearLabel = document.getElementById('p56-year-label');
    const successRateSlider = document.getElementById('p56-success-rate');
    const successLabel = document.getElementById('p56-success-label');
    const horizonValue = document.getElementById('p56-horizon-value');
    const horizonDesc = document.getElementById('p56-horizon-desc');
    const taskExamples = document.getElementById('p56-task-examples');
    const trendContext = document.getElementById('p56-trend-context');

    if (!modeSelect || !modelControl || !yearControl || !modelSelect || !yearSlider || 
        !successRateSlider || !horizonValue || !horizonDesc || !taskExamples || !trendContext) {
      console.warn('P56 interactive elements not found in DOM');
      return;
    }

    // Helper: Calculate horizon for a given year and success rate
    function calculateHorizon(year, successRate) {
      const baseDate = new Date(BASE_YEAR, BASE_MONTH - 1, 1);
      const targetDate = new Date(Math.floor(year), Math.round((year % 1) * 12), 1);
      const daysDiff = (targetDate - baseDate) / (1000 * 60 * 60 * 24);
      const doublings = daysDiff / DOUBLING_TIME_DAYS;
      
      let baseHorizon;
      if (successRate >= 90) {
        baseHorizon = BASE_HORIZON_90;
      } else if (successRate >= 80) {
        baseHorizon = BASE_HORIZON_80;
      } else {
        baseHorizon = BASE_HORIZON_50;
      }
      
      const horizon = baseHorizon * Math.pow(2, doublings);
      return horizon;
    }

    // Helper: Get task examples for a given horizon in minutes
    function getTaskExamples(minutes) {
      for (const range of TASK_EXAMPLES.ranges) {
        if (minutes <= range.max) {
          return range.tasks;
        }
      }
      return TASK_EXAMPLES.ranges[TASK_EXAMPLES.ranges.length - 1].tasks;
    }

    // Helper: Format time duration
    function formatDuration(minutes) {
      if (minutes < 1) {
        return `${Math.round(minutes * 60)} seconds`;
      } else if (minutes < 60) {
        return `${Math.round(minutes)} minutes`;
      } else if (minutes < 1440) {
        const hours = Math.round(minutes / 60 * 10) / 10;
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else if (minutes < 10080) {
        const days = Math.round(minutes / 1440 * 10) / 10;
        return `${days} day${days !== 1 ? 's' : ''}`;
      } else {
        const weeks = Math.round(minutes / 10080 * 10) / 10;
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      }
    }

    // Helper: Calculate doublings from base
    function calculateDoublings(horizon, successRate) {
      let baseHorizon;
      if (successRate >= 90) {
        baseHorizon = BASE_HORIZON_90;
      } else if (successRate >= 80) {
        baseHorizon = BASE_HORIZON_80;
      } else {
        baseHorizon = BASE_HORIZON_50;
      }
      return Math.log2(horizon / baseHorizon);
    }

    // Update UI based on current settings
    function updateUI() {
      const mode = modeSelect.value;
      const successRate = parseInt(successRateSlider.value);
      
      // Show/hide controls based on mode
      if (mode === 'model') {
        modelControl.classList.remove('hidden');
        yearControl.classList.add('hidden');
      } else {
        modelControl.classList.add('hidden');
        yearControl.classList.remove('hidden');
      }

      // Update success rate label
      successLabel.textContent = `${successRate}%`;

      let horizon, modelName, releaseInfo;

      if (mode === 'model') {
        // Model-based calculation
        const selectedModel = modelSelect.value;
        const modelData = MODEL_HORIZONS[selectedModel];
        
        // Adjust horizon based on success rate
        if (successRate >= 90) {
          horizon = modelData.horizon80 * 0.3; // Approximate 90% as ~30% of 80%
        } else if (successRate >= 80) {
          horizon = modelData.horizon80;
        } else {
          horizon = modelData.horizon50;
        }
        
        modelName = modelData.displayName;
        releaseInfo = modelData.releaseDate;
      } else {
        // Year-based extrapolation
        const year = parseFloat(yearSlider.value);
        yearLabel.textContent = year.toFixed(2);
        horizon = calculateHorizon(year, successRate);
        modelName = `Extrapolated (${year.toFixed(2)})`;
        releaseInfo = year >= 2025 ? 'forecast' : 'historical';
      }

      // Update horizon display
      horizonValue.textContent = formatDuration(horizon);
      
      // Apply color coding based on horizon length
      horizonValue.classList.remove('text-success', 'text-warning', 'text-error');
      if (horizon < 15) {
        horizonValue.classList.add('text-success');
      } else if (horizon < 120) {
        horizonValue.classList.add('text-warning');
      } else {
        horizonValue.classList.add('text-error');
      }

      // Update description
      if (mode === 'model') {
        horizonDesc.textContent = `${modelName} completes tasks taking humans ~${formatDuration(horizon)} with ${successRate}% reliability.`;
      } else {
        const year = parseFloat(yearSlider.value);
        if (year <= 2025) {
          horizonDesc.textContent = `Models from ${year.toFixed(0)} complete tasks taking humans ~${formatDuration(horizon)} with ${successRate}% reliability.`;
        } else {
          horizonDesc.textContent = `Extrapolated ${successRate}% horizon for ${year.toFixed(0)}: ~${formatDuration(horizon)}. Assumes 7-month doubling continues.`;
        }
      }

      // Update task examples
      const examples = getTaskExamples(horizon);
      taskExamples.innerHTML = '';
      examples.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        taskExamples.appendChild(li);
      });

      // Update trend context
      const doublings = calculateDoublings(horizon, successRate);
      const yearsFromBase = doublings * (DOUBLING_TIME_DAYS / 365.25);
      
      if (mode === 'model') {
        trendContext.innerHTML = `At the 7-month doubling rate, this represents approximately <strong>${Math.round(doublings * 10) / 10} doublings</strong> since GPT-2 (Feb 2019). That's ${Math.round(yearsFromBase * 10) / 10} years of exponential growth.`;
      } else {
        const year = parseFloat(yearSlider.value);
        if (year <= 2025) {
          trendContext.innerHTML = `At the 7-month doubling rate, this represents approximately <strong>${Math.round(doublings * 10) / 10} doublings</strong> since GPT-2. Progress through ${year.toFixed(0)}: ${Math.round(yearsFromBase * 10) / 10} years.`;
        } else {
          const remainingDoublings = doublings - calculateDoublings(MODEL_HORIZONS.claude37.horizon50, 50);
          const remainingYears = remainingDoublings * (DOUBLING_TIME_DAYS / 365.25);
          trendContext.innerHTML = `Reaching this horizon requires <strong>${Math.round(remainingDoublings * 10) / 10} more doublings</strong> beyond Claude 3.7 Sonnet (Feb 2025). Estimated arrival: ${Math.round(remainingYears * 10) / 10} years from now, assuming trend continues.`;
        }
      }
    }

    // Event listeners
    modeSelect.addEventListener('change', updateUI);
    modelSelect.addEventListener('change', updateUI);
    yearSlider.addEventListener('input', updateUI);
    successRateSlider.addEventListener('input', updateUI);

    // Initial render
    updateUI();
  }

  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
