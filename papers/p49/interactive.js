(function() {
  'use strict';

  // Experimental data from Dell'Acqua et al. (2025)
  const CONDITIONS = {
    'individual-without': {
      name: 'Individual without AI (Control)',
      description: 'Working alone using only human knowledge and skills. This is the baseline against which all other conditions are compared.',
      qualitySD: 0.00,
      qualityLabel: 'Baseline',
      timeChange: 0,
      lengthChange: 'Baseline solution length',
      expertiseBalance: 'strong-silo', // Commercial or R&D dominated
      expertiseDescription: 'Solutions align strongly with professional background—Commercial professionals propose commercial ideas, R&D professionals propose technical ideas',
      taskExpertise: 'Non-core-job employees perform poorly; core-job employees perform moderately',
      positiveEmotionSD: 0.00,
      negativeEmotionSD: 0.00,
      emotionInterpretation: 'Baseline emotional response—lower positive emotions than teamwork, moderate negative emotions'
    },
    'team-without': {
      name: 'Two-Person Team without AI',
      description: 'Cross-functional collaboration (1 Commercial + 1 R&D) without AI assistance. Traditional teamwork benefits.',
      qualitySD: 0.24,
      qualityLabel: 'Moderate improvement (p < 0.05)',
      timeChange: 0,
      lengthChange: 'Slightly longer than individual baseline',
      expertiseBalance: 'moderate-balance',
      expertiseDescription: 'Solutions show better balance through cross-functional collaboration, but bimodal distribution suggests one member often dominates (either technical or commercial pole)',
      taskExpertise: 'Non-core-job employees show modest improvement; core-job employees maintain advantage',
      positiveEmotionSD: 0.20, // Approximate from traditional team benefits
      negativeEmotionSD: -0.10,
      emotionInterpretation: 'Positive emotional benefit from human collaboration—higher enthusiasm and energy than solo work'
    },
    'individual-with': {
      name: 'Individual with AI',
      description: 'Working alone with GPT-4 assistance after one-hour training. AI acts as a "cybernetic teammate" providing expertise and support.',
      qualitySD: 0.37,
      qualityLabel: 'Strong improvement (p < 0.01) — matches team performance',
      timeChange: -16.4,
      lengthChange: 'Significantly longer—more comprehensive and detailed',
      expertiseBalance: 'balanced',
      expertiseDescription: 'Functional silos disappear—both Commercial and R&D professionals produce similarly balanced solutions. AI enables boundary-spanning thinking.',
      taskExpertise: 'Non-core-job employees with AI match teams with core-job experts—AI democratizes task expertise',
      positiveEmotionSD: 0.457,
      negativeEmotionSD: -0.233,
      emotionInterpretation: 'AI replicates emotional benefits of teamwork—significantly higher excitement, energy, and enthusiasm; lower anxiety and frustration'
    },
    'team-with': {
      name: 'Two-Person Team with AI',
      description: 'Cross-functional team augmented with AI. Combines human collaboration with AI support.',
      qualitySD: 0.39,
      qualityLabel: 'Strong improvement (p < 0.01) — not significantly different from individual+AI',
      timeChange: -12.7,
      lengthChange: 'Significantly longer—most comprehensive solutions',
      expertiseBalance: 'balanced-uniform',
      expertiseDescription: 'Most balanced solutions with uniform distribution—AI reduces dominance effects and ensures both perspectives contribute equally',
      taskExpertise: 'All team members contribute effectively regardless of task familiarity—AI levels the playing field',
      positiveEmotionSD: 0.635,
      negativeEmotionSD: -0.235,
      emotionInterpretation: 'Strongest emotional benefits—combines AI support with human social interaction for maximum excitement and lowest frustration',
      topTierBonus: true // 9.2 percentage point increase in top 10% solutions
    }
  };

  function getConditionKey(workMode, aiMode) {
    return workMode + '-' + aiMode;
  }

  function updateDisplay() {
    const workModeEl = document.querySelector('input[name="workMode"]:checked');
    const aiModeEl = document.querySelector('input[name="aiMode"]:checked');
    const backgroundEl = document.getElementById('professionalBackground');
    const backgroundSelectorEl = document.getElementById('backgroundSelector');

    if (!workModeEl || !aiModeEl) {
      console.warn('Required input elements not found');
      return;
    }

    const workMode = workModeEl.value;
    const aiMode = aiModeEl.value;
    const background = backgroundEl ? backgroundEl.value : 'commercial';

    // Show/hide background selector based on work mode
    if (backgroundSelectorEl) {
      if (workMode === 'individual') {
        backgroundSelectorEl.classList.remove('hidden');
      } else {
        backgroundSelectorEl.classList.add('hidden');
      }
    }

    const conditionKey = getConditionKey(workMode, aiMode);
    const condition = CONDITIONS[conditionKey];

    if (!condition) {
      console.warn('Condition not found:', conditionKey);
      return;
    }

    // Update quality display
    updateElement('qualityScore', (condition.qualitySD >= 0 ? '+' : '') + condition.qualitySD.toFixed(2) + ' SD');
    updateElement('qualityComparison', condition.qualityLabel);
    
    // Time efficiency
    let timeText = 'Baseline completion time';
    if (condition.timeChange !== 0) {
      timeText = Math.abs(condition.timeChange).toFixed(1) + '% ' + (condition.timeChange < 0 ? 'faster' : 'slower');
    }
    updateElement('timeEfficiency', timeText);
    updateElement('comprehensiveness', condition.lengthChange);

    // Add top-tier bonus note if applicable
    let qualityComparisonText = condition.qualityLabel;
    if (condition.topTierBonus) {
      qualityComparisonText += ' ⭐ 3× more likely to produce top 10% solutions';
    }
    updateElement('qualityComparison', qualityComparisonText);

    // Update expertise display
    updateExpertiseDisplay(condition, workMode, background);

    // Update emotion display
    updateEmotionDisplay(condition);

    // Update condition summary
    updateElement('conditionName', condition.name);
    updateElement('conditionDescription', condition.description);
  }

  function updateExpertiseDisplay(condition, workMode, background) {
    const indicatorEl = document.getElementById('expertiseIndicator');
    
    // Position indicator based on expertise balance
    let position = 50; // Center = balanced
    if (condition.expertiseBalance === 'strong-silo') {
      // Individual without AI: position depends on background
      position = (workMode === 'individual' && background === 'commercial') ? 80 : 20;
    } else if (condition.expertiseBalance === 'moderate-balance') {
      position = 50; // Team without AI: centered but bimodal
    } else if (condition.expertiseBalance === 'balanced' || condition.expertiseBalance === 'balanced-uniform') {
      position = 50; // AI enables true balance
    }

    if (indicatorEl) {
      indicatorEl.style.left = position + '%';
    }

    updateElement('expertiseDescription', condition.expertiseDescription);
    updateElement('taskExpertise', condition.taskExpertise);
  }

  function updateEmotionDisplay(condition) {
    // Positive emotions (scale 0 to +0.7 SD for visual display)
    const positivePercent = Math.min(100, (condition.positiveEmotionSD / 0.7) * 100);
    updateElement('positiveEmotionScore', (condition.positiveEmotionSD >= 0 ? '+' : '') + condition.positiveEmotionSD.toFixed(2) + ' SD');
    const positiveBarEl = document.getElementById('positiveEmotionBar');
    if (positiveBarEl) {
      positiveBarEl.style.width = Math.max(0, positivePercent) + '%';
    }

    // Negative emotions (scale -0.3 to 0 SD for visual display, but show as reduction)
    const negativePercent = Math.min(100, Math.abs(condition.negativeEmotionSD / 0.3) * 100);
    updateElement('negativeEmotionScore', (condition.negativeEmotionSD >= 0 ? '+' : '') + condition.negativeEmotionSD.toFixed(2) + ' SD');
    const negativeBarEl = document.getElementById('negativeEmotionBar');
    if (negativeBarEl) {
      // For negative emotions, reduction is good—show inverse
      negativeBarEl.style.width = (condition.negativeEmotionSD === 0 ? 50 : Math.max(0, negativePercent)) + '%';
    }

    updateElement('emotionInterpretation', condition.emotionInterpretation);
  }

  function updateElement(id, content) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = content;
    }
  }

  function init() {
    // Check if elements exist
    const workModeInputs = document.querySelectorAll('input[name="workMode"]');
    const aiModeInputs = document.querySelectorAll('input[name="aiMode"]');
    
    if (workModeInputs.length === 0 || aiModeInputs.length === 0) {
      console.warn('Interactive controls not yet in DOM, skipping initialization');
      return;
    }

    // Attach event listeners
    workModeInputs.forEach(function(input) {
      input.addEventListener('change', updateDisplay);
    });

    aiModeInputs.forEach(function(input) {
      input.addEventListener('change', updateDisplay);
    });

    const backgroundEl = document.getElementById('professionalBackground');
    if (backgroundEl) {
      backgroundEl.addEventListener('change', updateDisplay);
    }

    // Initial display
    updateDisplay();
  }

  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(function() {
      init();
    }, 0); // Wait a tick for DOM
  }

  // Attach helper functions for testing
  interactiveScript.init = init;
  interactiveScript.updateDisplay = updateDisplay;

  // Export to window for paperLoader
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }

  // Support CommonJS for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
