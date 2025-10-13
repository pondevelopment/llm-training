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
    // Collaborative ability correlates with individual (ρ = 0.67) but is distinct
    const baseKappa = theta * BASE_METRICS.thetaKappaCorr;
    
    // Apply modifiers
    const abilityMod = ABILITY_MODIFIERS[abilityLevel].kappa;
    const tomMod = TOM_EFFECTS[tomLevel];
    const difficultyBoost = TASK_DIFFICULTY[difficulty].aiBoost;
    const domainEffect = DOMAIN_EFFECTS[domain].aiEffectiveness;
    
    // GPT-4o collaborative ability
    const gpt4oBoost = BASE_METRICS.gpt4oBoost * difficultyBoost * domainEffect;
    const gpt4oKappa = Math.max(0.25, Math.min(0.98, 
      theta + baseKappa + abilityMod + tomMod + gpt4oBoost
    ));
    
    // Llama collaborative ability
    const llamaBoost = BASE_METRICS.llamaBoost * difficultyBoost * domainEffect;
    const llamaKappa = Math.max(0.25, Math.min(0.98,
      theta + baseKappa + abilityMod + tomMod + llamaBoost
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
      insights.push('<strong>High-ability complementarity:</strong> You perform best overall with AI (' + 
        (kappa * 100).toFixed(1) + '%), but your relative gain is smaller due to ceiling effects. ' +
        'You gain more from AI on difficult tasks where your solo performance dips.');
    } else if (abilityLevel === 'low') {
      insights.push('<strong>Equalizing effect:</strong> Lower-ability users see the largest <em>relative</em> gains from AI (' +
        ((boost / theta) * 100).toFixed(0) + '% improvement). AI democratizes access to problem-solving, ' +
        'narrowing the performance gap between users.');
    } else {
      insights.push('<strong>Typical synergy profile:</strong> Your ' + (boost * 100).toFixed(1) + 'pp boost is close to the population average. ' +
        'Both high and low-ability users exist at the extremes, each with different collaboration dynamics.');
    }
    
    // Insight 2: Theory of Mind effect
    if (tomLevel === 'high') {
      insights.push('<strong>ToM advantage:</strong> Your strong perspective-taking ability (high ToM) predicts superior AI collaboration. ' +
        'You likely formulate better prompts, anticipate AI misinterpretations, and evaluate responses more critically—skills that boost κ without improving θ.');
    } else if (tomLevel === 'low') {
      insights.push('<strong>ToM training opportunity:</strong> Low Theory of Mind may limit your collaborative ability. ' +
        'Consider practicing: inferring what information AI has/lacks, recognizing when to repair communication breakdowns, ' +
        'and scaffolding requests to match AI\'s capabilities. Even small ToM gains predict meaningful κ improvements.');
    }
    
    // Insight 3: Task difficulty dynamics
    if (difficulty === 'hard') {
      insights.push('<strong>Complementarity on hard tasks:</strong> AI provides the highest boost on difficult problems (ρ = -0.91 correlation). ' +
        'On tasks where you struggle most, AI fills knowledge gaps and offers alternative solution paths—prioritize AI use here for maximum ROI.');
    } else if (difficulty === 'easy') {
      insights.push('<strong>Limited gains on easy tasks:</strong> When tasks are routine, there\'s less room for AI to add value. ' +
        'Your solo performance already approaches ceiling (' + (theta * 100).toFixed(1) + '%), so AI boost is muted. ' +
        'Reserve AI for complex problems where synergy is highest.');
    }
    
    // Insight 4: Model comparison (if both selected)
    if (model === 'both' && gpt4oKappa && llamaKappa) {
      const gpt4oBenefit = gpt4oKappa - llamaKappa;
      insights.push('<strong>Model selection trade-off:</strong> GPT-4o provides ' + (gpt4oBenefit * 100).toFixed(1) + 'pp more lift than Llama-3.1-8B (' +
        (gpt4oKappa * 100).toFixed(1) + '% vs ' + (llamaKappa * 100).toFixed(1) + '%). ' +
        'This difference justifies cost premium when task complexity and stakes are high. For routine work, Llama may suffice.');
    } else if (model === 'gpt4o') {
      insights.push('<strong>GPT-4o justification:</strong> At ' + (kappa * 100).toFixed(1) + '% accuracy with AI, you\'re ' +
        (((kappa - BASE_METRICS.humanSolo) / BASE_METRICS.humanSolo) * 100).toFixed(0) + '% better than the solo baseline. ' +
        'GPT-4o\'s 71% solo performance combines with your θ to produce strong collaborative outcomes—especially valuable when errors are costly.');
    } else if (model === 'llama') {
      insights.push('<strong>Llama-3.1-8B viability:</strong> Despite lower solo accuracy (39%), Llama still delivers a ' + (boost * 100).toFixed(1) + 'pp boost. ' +
        'For cost-sensitive deployments or when marginal accuracy gains aren\'t critical, Llama offers substantial synergy at lower operational cost.');
    }
    
    // Insight 5: θ ≠ κ reminder
    if (Math.abs(BASE_METRICS.thetaKappaCorr - 1.0) > 0.2) {
      insights.push('<strong>Dual-ability training:</strong> Since θ and κ correlate at only ρ = 0.67, improving your solo skills won\'t automatically improve AI collaboration. ' +
        'Invest in prompt engineering, delegation judgment, and response evaluation as <em>separate competencies</em> from domain expertise.');
    }
    
    // Insight 6: Sample size note
    if (metrics.numTasks < 15) {
      insights.push('<strong>Estimation uncertainty:</strong> With only ' + metrics.numTasks + ' tasks, your ability estimates have wide confidence intervals. ' +
        'Increase sample size to ≥20 for more reliable θ and κ measurements (smaller standard errors).');
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
    const level = sliderToLevel(value);
    const percentile = value;
    
    if (type === 'ability') {
      if (level === 'low') return `Low (${percentile}%ile) • Below average problem-solving`;
      if (level === 'medium') return `Medium (${percentile}%ile) • Average problem-solving`;
      return `High (${percentile}%ile) • Above average problem-solving`;
    } else if (type === 'tom') {
      if (level === 'low') return `Low (${percentile}%ile) • Limited perspective-taking`;
      if (level === 'medium') return `Medium (${percentile}%ile) • Average perspective-taking`;
      return `High (${percentile}%ile) • Strong perspective-taking`;
    } else if (type === 'difficulty') {
      if (level === 'low') return 'Easy difficulty • Routine problems';
      if (level === 'medium') return 'Medium difficulty • Typical problems';
      return 'Hard difficulty • Complex problems';
    }
  }

  /**
   * Update all UI elements based on current configuration
   */
  function updateUI() {
    // Get current values
    const abilityValue = parseInt(document.getElementById('p37-ability').value);
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
      `AI collaboration improves your performance by ${boostPP} percentage points (95% CI: [${ciLowerPP}, ${ciUpperPP}])`;
    
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
    
    // Update statistical details
    const statsDetail = document.getElementById('p37-stats-detail');
    const modelName = model === 'gpt4o' ? 'GPT-4o' : (model === 'llama' ? 'Llama-3.1-8B' : 'both models');
    statsDetail.innerHTML = `
      <strong>Current configuration:</strong> ${modelName}, ${difficulty} difficulty ${domain} tasks, 
      n=${numTasks} observations. Individual ability θ = ${thetaPercent}%, collaborative ability κ = ${kappaPercent}%, 
      synergy boost = ${boostPP}pp with 95% CI [${ciLowerPP}, ${ciUpperPP}]. 
      Estimates stabilize with larger sample sizes (narrower CIs).
    `;
  }

  /**
   * Initialize interactive controls
   */
  function init() {
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
        element.addEventListener('input', updateUI);
        element.addEventListener('change', updateUI);
      }
    });
    
    // Initial render
    updateUI();
  }

  // Export for testing and external access
  const interactiveScript = {
    init,
    calculateIndividualAbility,
    calculateCollaborativeAbility,
    calculateSynergy,
    generateInsights,
    BASE_METRICS
  };

  // Auto-initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export to window and module
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }

})();
