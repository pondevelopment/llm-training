/**
 * Paper 37 Interactive: Human-AI Synergy Calculator
 * Implements Bayesian IRT framework with dual-ability decomposition
 */

(function() {
  'use strict';

  // Baseline metrics from paper (667 users, 2,072 observations)
  const BASE_METRICS = {
    humanSolo: 0.555,        // 55.5% accuracy alone
    gpt4oSolo: 0.71,         // 71% GPT-4o alone
    llamaSolo: 0.39,         // 39% Llama-3.1-8B alone
    gpt4oBoost: 0.29,        // +29pp with GPT-4o
    llamaBoost: 0.23,        // +23pp with Llama-3.1-8B
    thetaKappaCorr: 0.67,    // ρs correlation between θ and κ
    tomEffect: 0.003         // ~3pp per 10-point ToM increase
  };

  // Ability modifiers based on user profile
  const ABILITY_MODIFIERS = {
    low: { theta: -0.15, kappa: -0.12 },      // Lower ability users
    medium: { theta: 0, kappa: 0 },           // Average users (baseline)
    high: { theta: 0.15, kappa: 0.10 }        // Higher ability users (ceiling effects)
  };

  // Theory of Mind effects on collaborative ability specifically
  const TOM_EFFECTS = {
    low: -0.08,      // Poor perspective-taking limits collaboration
    medium: 0,       // Average ToM
    high: 0.08       // Strong ToM enhances AI interaction
  };

  // Task difficulty modifiers (harder tasks show more AI benefit)
  const TASK_DIFFICULTY = {
    easy: { beta: -0.12, aiBoost: 0.85 },      // Less room for AI to help
    medium: { beta: 0, aiBoost: 1.0 },         // Baseline difficulty
    hard: { beta: 0.15, aiBoost: 1.20 }        // AI provides most value here
  };

  // Domain-specific adjustments (from paper's task analysis)
  const DOMAIN_EFFECTS = {
    math: { difficulty: 0.05, aiEffectiveness: 1.05 },
    physics: { difficulty: 0.08, aiEffectiveness: 0.98 },
    moral: { difficulty: 0.02, aiEffectiveness: 0.95 }
  };

  /**
   * Calculate individual ability (θ) estimate
   * @param {string} abilityLevel - 'low', 'medium', 'high'
   * @param {string} difficulty - 'easy', 'medium', 'hard'
   * @param {string} domain - 'math', 'physics', 'moral'
   * @returns {number} θ estimate (0-1 scale)
   */
  function calculateIndividualAbility(abilityLevel, difficulty, domain) {
    const baseAbility = BASE_METRICS.humanSolo;
    const abilityMod = ABILITY_MODIFIERS[abilityLevel].theta;
    const difficultyMod = TASK_DIFFICULTY[difficulty].beta;
    const domainMod = DOMAIN_EFFECTS[domain].difficulty;
    
    // IRT formula: P(correct) = logistic(θ - β)
    // Simplified linear approximation for UI
    let theta = baseAbility + abilityMod - difficultyMod - domainMod;
    
    // Clamp to [0.2, 0.95] (realistic bounds)
    return Math.max(0.20, Math.min(0.95, theta));
  }

  /**
   * Calculate collaborative ability (κ) estimate
   * @param {string} abilityLevel - User ability level
   * @param {string} tomLevel - Theory of Mind level
   * @param {string} model - 'gpt4o', 'llama', or 'both'
   * @param {string} difficulty - Task difficulty
   * @param {string} domain - Task domain
   * @param {number} theta - Pre-calculated individual ability
   * @returns {object} {kappa, gpt4oKappa, llamaKappa}
   */
  function calculateCollaborativeAbility(abilityLevel, tomLevel, model, difficulty, domain, theta) {
    // Apply modifiers
    const abilityMod = ABILITY_MODIFIERS[abilityLevel].kappa;
    const tomMod = TOM_EFFECTS[tomLevel];
    const difficultyBoost = TASK_DIFFICULTY[difficulty].aiBoost;
    const domainEffect = DOMAIN_EFFECTS[domain].aiEffectiveness;
    
    // GPT-4o collaborative ability
    // Start from theta, add AI boost, modify by collaboration style (ToM) and ability ceiling effects
    const gpt4oBoost = BASE_METRICS.gpt4oBoost * difficultyBoost * domainEffect;
    const gpt4oKappa = Math.max(0.25, Math.min(0.98, 
      theta + gpt4oBoost + abilityMod + tomMod
    ));
    
    // Llama collaborative ability
    const llamaBoost = BASE_METRICS.llamaBoost * difficultyBoost * domainEffect;
    const llamaKappa = Math.max(0.25, Math.min(0.98,
      theta + llamaBoost + abilityMod + tomMod
    ));
    
    // Return appropriate values based on model selection
    if (model === 'gpt4o') {
      return { kappa: gpt4oKappa, gpt4oKappa, llamaKappa: null };
    } else if (model === 'llama') {
      return { kappa: llamaKappa, gpt4oKappa: null, llamaKappa };
    } else {
      // Both models - return both
      return { kappa: gpt4oKappa, gpt4oKappa, llamaKappa };
    }
  }

  /**
   * Calculate synergy boost with confidence intervals
   * @param {number} theta - Individual ability
   * @param {number} kappa - Collaborative ability
   * @param {number} numTasks - Sample size
   * @returns {object} {boost, ciLower, ciUpper}
   */
  function calculateSynergy(theta, kappa, numTasks) {
    const boost = kappa - theta;
    
    // Bayesian credible interval width depends on sample size
    // Larger n → narrower CIs (more certainty)
    const baseSE = 0.025; // From paper (SE ≈ 2.5pp at n=20)
    const adjustedSE = baseSE * Math.sqrt(20 / numTasks);
    
    // 95% CI ≈ ±1.96 * SE
    const margin = 1.96 * adjustedSE;
    
    return {
      boost: boost,
      ciLower: Math.max(0, boost - margin),
      ciUpper: Math.min(0.50, boost + margin)
    };
  }

  /**
   * Generate contextual insights based on user configuration
   * @param {object} metrics - All calculated metrics
   * @returns {Array<string>} Array of insight strings
   */
  function generateInsights(metrics) {
    const insights = [];
    const { theta, kappa, boost, abilityLevel, tomLevel, difficulty, model, gpt4oKappa, llamaKappa } = metrics;
    
    // Insight 1: Ability level context
    if (abilityLevel === 'high') {
      insights.push('<strong>You\'re already skilled:</strong> Your solo accuracy is ' + 
        (theta * 100).toFixed(0) + '%, and with AI you reach ' + (kappa * 100).toFixed(0) + '%. ' +
        'Experts like you still benefit from AI, especially on harder problems where there\'s more room to improve.');
    } else if (abilityLevel === 'low') {
      insights.push('<strong>AI levels the playing field:</strong> Beginners gain the most from AI assistance—your ' +
        (boost * 100).toFixed(0) + 'pp boost means AI helps close the skill gap. ' +
        'You\'ll improve faster by learning to work <em>with</em> AI rather than mastering everything solo first.');
    } else {
      insights.push('<strong>Average skill, big gains:</strong> Your ' + (boost * 100).toFixed(0) + 'pp boost is typical. ' +
        'Most users see 20-30pp improvements when they learn to collaborate effectively with AI.');
    }
    
    // Insight 2: Theory of Mind effect
    if (tomLevel === 'high') {
      insights.push('<strong>You "get" AI:</strong> Your intuitive collaboration style means you naturally understand what AI can and can\'t do. ' +
        'You probably write better prompts, catch AI mistakes faster, and know when to push back on suggestions.');
    } else if (tomLevel === 'low') {
      insights.push('<strong>Opportunity to improve:</strong> A more literal collaboration style might mean you take AI outputs at face value. ' +
        'Try this: Before asking AI anything, think "What information does it need? What might it misunderstand?" This builds better collaboration habits.');
    }
    
    // Insight 3: Task difficulty dynamics
    if (difficulty === 'hard') {
      insights.push('<strong>Hard problems = biggest AI wins:</strong> The research shows AI helps most on difficult tasks—the kind where you\'d normally get stuck. ' +
        'Don\'t waste AI on easy stuff. Save it for the hard problems where it provides the most value.');
    } else if (difficulty === 'easy') {
      insights.push('<strong>Easy tasks don\'t need much AI:</strong> You\'re already at ' + (theta * 100).toFixed(0) + '% accuracy on easy problems. ' +
        'AI can\'t help much more—you\'re near the ceiling. Focus AI assistance on harder challenges.');
    }
    
    // Insight 4: Model comparison (if both selected)
    if (model === 'both' && gpt4oKappa && llamaKappa) {
      const gpt4oBenefit = (gpt4oKappa - llamaKappa) * 100;
      insights.push('<strong>Premium vs budget:</strong> GPT-4o gives you ' + gpt4oBenefit.toFixed(0) + 'pp more improvement than Llama. ' +
        'If you need maximum accuracy, GPT-4o is worth the cost. For everyday tasks where "good enough" works, Llama saves money.');
    } else if (model === 'gpt4o') {
      insights.push('<strong>Using the premium model:</strong> GPT-4o gets you to ' + (kappa * 100).toFixed(0) + '% accuracy. ' +
        'It\'s the stronger model (71% solo) and provides the biggest boost. Best for high-stakes work where mistakes are expensive.');
    } else if (model === 'llama') {
      insights.push('<strong>Using the budget model:</strong> Llama still boosts you by ' + (boost * 100).toFixed(0) + 'pp despite being weaker (39% solo). ' +
        'Good cost-performance trade-off for routine tasks where you don\'t need perfection.');
    }
    
    return insights;
  }

  /**
   * Generate ability decomposition visualization data
   * @param {number} theta - Individual ability
   * @param {number} kappa - Collaborative ability
   * @returns {object} Decomposition metrics
   */
  function generateAbilityDecomposition(theta, kappa) {
    const gap = kappa - theta;
    return {
      solo: (theta * 100).toFixed(1) + '%',
      collab: (kappa * 100).toFixed(1) + '%',
      gapLabel: 'κ effect',
      gapValue: '+' + (gap * 100).toFixed(1) + 'pp'
    };
  }

  /**
   * Convert slider value (0-100) to ability level descriptor
   */
  function sliderToLevel(value) {
    if (value < 33) return 'low';
    if (value < 67) return 'medium';
    return 'high';
  }

  /**
   * Convert slider value to display text
   */
  function sliderToDisplay(value, type) {
    // Return empty string - users understand from slider position
    return '';
  }

  /**
   * Update all UI elements based on current configuration
   */
  function updateUI() {
    console.log('updateUI called');
    
    // Check if elements exist (defensive coding for timing issues)
    const abilityEl = document.getElementById('p37-ability');
    if (!abilityEl) {
      console.warn('Interactive elements not yet in DOM, skipping updateUI');
      return;
    }
    
    // Get current values
    const abilityValue = parseInt(abilityEl.value);
    const tomValue = parseInt(document.getElementById('p37-tom').value);
    const difficultyValue = parseInt(document.getElementById('p37-difficulty').value);
    const numTasks = parseInt(document.getElementById('p37-num-tasks').value);
    const model = document.getElementById('p37-model').value;
    const domain = document.getElementById('p37-domain').value;
    
    // Convert to levels
    const abilityLevel = sliderToLevel(abilityValue);
    const tomLevel = sliderToLevel(tomValue);
    const difficulty = sliderToLevel(difficultyValue);
    
    // Update display labels
    document.getElementById('p37-ability-display').textContent = sliderToDisplay(abilityValue, 'ability');
    document.getElementById('p37-tom-display').textContent = sliderToDisplay(tomValue, 'tom');
    document.getElementById('p37-difficulty-display').textContent = sliderToDisplay(difficultyValue, 'difficulty');
    
    // Calculate abilities
    const theta = calculateIndividualAbility(abilityLevel, difficulty, domain);
    const kappaResults = calculateCollaborativeAbility(abilityLevel, tomLevel, model, difficulty, domain, theta);
    const { kappa, gpt4oKappa, llamaKappa } = kappaResults;
    
    // Calculate synergy
    const synergy = calculateSynergy(theta, kappa, numTasks);
    
    // Update model indicator
    const modelIndicator = document.getElementById('p37-model-indicator');
    if (model === 'both') {
      modelIndicator.textContent = 'Comparing both models';
    } else if (model === 'gpt4o') {
      modelIndicator.textContent = 'Using GPT-4o';
    } else {
      modelIndicator.textContent = 'Using Llama-3.1-8B';
    }
    
    // Update ability bars
    const thetaPercent = (theta * 100).toFixed(1);
    const kappaPercent = (kappa * 100).toFixed(1);
    
    document.getElementById('p37-theta-bar').style.width = thetaPercent + '%';
    document.getElementById('p37-theta-bar').setAttribute('aria-valuenow', thetaPercent);
    document.getElementById('p37-theta-value').textContent = thetaPercent + '%';
    
    document.getElementById('p37-kappa-bar').style.width = kappaPercent + '%';
    document.getElementById('p37-kappa-bar').setAttribute('aria-valuenow', kappaPercent);
    document.getElementById('p37-kappa-value').textContent = kappaPercent + '%';
    
    // Update synergy boost
    const boostPP = (synergy.boost * 100).toFixed(1);
    const ciLowerPP = (synergy.ciLower * 100).toFixed(0);
    const ciUpperPP = (synergy.ciUpper * 100).toFixed(0);
    
    document.getElementById('p37-boost-value').textContent = '+' + boostPP + 'pp';
    document.getElementById('p37-boost-description').textContent = 
      `AI improves your accuracy by ${boostPP} percentage points`;
    
    // Handle model comparison display
    const comparisonDiv = document.getElementById('p37-model-comparison');
    if (model === 'both' && gpt4oKappa && llamaKappa) {
      comparisonDiv.classList.remove('hidden');
      
      const gpt4oBoost = gpt4oKappa - theta;
      const llamaBoost = llamaKappa - theta;
      
      document.getElementById('p37-gpt4o-result').textContent = '+' + (gpt4oBoost * 100).toFixed(0) + 'pp';
      document.getElementById('p37-gpt4o-final').textContent = (gpt4oKappa * 100).toFixed(1) + '%';
      
      document.getElementById('p37-llama-result').textContent = '+' + (llamaBoost * 100).toFixed(0) + 'pp';
      document.getElementById('p37-llama-final').textContent = (llamaKappa * 100).toFixed(1) + '%';
    } else {
      comparisonDiv.classList.add('hidden');
    }
    
    // Update decomposition visualization
    const decomp = generateAbilityDecomposition(theta, kappa);
    document.getElementById('p37-decomp-solo').textContent = decomp.solo;
    document.getElementById('p37-decomp-collab').textContent = decomp.collab;
    document.getElementById('p37-decomp-gap').textContent = decomp.gapValue;
    
    // Generate and display insights
    const metrics = {
      theta,
      kappa,
      boost: synergy.boost,
      abilityLevel,
      tomLevel,
      difficulty,
      model,
      domain,
      numTasks,
      gpt4oKappa,
      llamaKappa
    };
    
    const insights = generateInsights(metrics);
    const insightsList = document.getElementById('p37-insights-list');
    insightsList.innerHTML = insights.map(insight => 
      `<p class="leading-relaxed">${insight}</p>`
    ).join('');
  }

  /**
   * Initialize interactive controls
   */
  function init() {
    console.log('Paper 37 interactive initializing...');
    
    // Attach event listeners to all controls
    const controls = [
      'p37-ability',
      'p37-tom',
      'p37-difficulty',
      'p37-num-tasks',
      'p37-model',
      'p37-domain'
    ];
    
    controls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`Attaching listeners to ${id}`);
        element.addEventListener('input', updateUI);
        element.addEventListener('change', updateUI);
      } else {
        console.warn(`Element not found: ${id}`);
      }
    });
    
    // Initial render
    console.log('Running initial updateUI...');
    updateUI();
  }

  // Create the initialization function to be called by paperLoader
  function interactiveScript() {
    // Wait a tick for DOM to be fully ready
    setTimeout(() => {
      init();
    }, 0);
  }

  // Export helper functions for testing and external access
  interactiveScript.init = init;
  interactiveScript.calculateIndividualAbility = calculateIndividualAbility;
  interactiveScript.calculateCollaborativeAbility = calculateCollaborativeAbility;
  interactiveScript.calculateSynergy = calculateSynergy;
  interactiveScript.generateInsights = generateInsights;
  interactiveScript.BASE_METRICS = BASE_METRICS;

  // Export to window and module
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }

})();
