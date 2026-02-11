/**
 * Paper 31: LLM Gambling Addiction Interactive
 * Simulates behavioral outcomes based on experimental data from the paper
 */

function interactiveScript() {
  'use strict';

    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

  // Model baseline data from Table 2 (fixed vs variable betting)
  const modelData = {
    'gpt4o-mini': {
      name: 'GPT-4o-mini',
      fixed: { bankrupt: 0.00, irrationality: 0.025, rounds: 1.79, totalBet: 17.93 },
      variable: { bankrupt: 21.31, irrationality: 0.172, rounds: 5.46, totalBet: 128.30 },
      winChase: { increase: [14.5, 16.2, 18.5, 20.1, 22.0], continue: [81, 83, 85, 87, 89] },
      lossChase: { increase: [7.5, 8.0, 8.5, 9.0, 10.0], continue: [80, 79, 78, 77, 76] }
    },
    'gpt41-mini': {
      name: 'GPT-4.1-mini',
      fixed: { bankrupt: 0.00, irrationality: 0.031, rounds: 2.56, totalBet: 25.56 },
      variable: { bankrupt: 6.31, irrationality: 0.077, rounds: 7.60, totalBet: 82.30 },
      winChase: { increase: [12.0, 13.5, 15.0, 16.5, 18.0], continue: [79, 81, 83, 85, 87] },
      lossChase: { increase: [6.0, 6.5, 7.0, 7.5, 8.0], continue: [78, 77, 76, 75, 74] }
    },
    'gemini25-flash': {
      name: 'Gemini-2.5-Flash',
      fixed: { bankrupt: 3.12, irrationality: 0.042, rounds: 5.84, totalBet: 58.44 },
      variable: { bankrupt: 48.06, irrationality: 0.265, rounds: 3.94, totalBet: 176.68 },
      winChase: { increase: [18.0, 20.5, 23.0, 25.5, 28.0], continue: [85, 87, 89, 91, 93] },
      lossChase: { increase: [9.0, 10.0, 11.0, 12.0, 13.0], continue: [82, 81, 80, 79, 78] }
    },
    'claude35-haiku': {
      name: 'Claude-3.5-Haiku',
      fixed: { bankrupt: 0.00, irrationality: 0.041, rounds: 5.15, totalBet: 51.49 },
      variable: { bankrupt: 20.50, irrationality: 0.186, rounds: 27.52, totalBet: 483.12 },
      winChase: { increase: [15.0, 16.5, 18.0, 19.5, 21.0], continue: [83, 85, 87, 89, 91] },
      lossChase: { increase: [8.0, 8.5, 9.0, 9.5, 10.0], continue: [81, 80, 79, 78, 77] }
    }
  };

  // Prompt component effects (simplified linear model)
  // Paper reports near-perfect linear correlation (r=0.991) between component count and bankruptcy
  // Range: 6-48% bankruptcy with variable betting across 32 prompt combinations
  // This simulator uses +8% per high-risk component as a simplified approximation to demonstrate the concept
  const componentEffects = {
    G: { bankruptcy: 8.0, irrationality: 0.040, rounds: 2.0, totalBet: 45, risk: 'high' },
    M: { bankruptcy: 8.0, irrationality: 0.040, rounds: 2.0, totalBet: 45, risk: 'high' },
    H: { bankruptcy: 8.0, irrationality: 0.040, rounds: 2.0, totalBet: 45, risk: 'high' },
    W: { bankruptcy: 8.0, irrationality: 0.040, rounds: 2.0, totalBet: 45, risk: 'high' },
    P: { bankruptcy: -2.0, irrationality: -0.010, rounds: -0.5, totalBet: -10, risk: 'protective' }
  };

  // Cognitive biases by component combination
  const cognitivePatterns = {
    none: 'Baseline (no components): Minimal gambling behavior. Model quits early with rational risk assessment.',
    
    G: '<strong>Goal Fixation:</strong> The AI becomes tunnel-visioned on reaching the target ("double your money"), ignoring the poor odds. It uses "strategic choice" language to justify increasingly aggressive bets—rationalization masking irrational behavior.',
    
    M: '<strong>Reward Optimization Bias:</strong> The AI focuses exclusively on maximizing returns while completely ignoring the risk of losing. It performs analytical reasoning but skips the crucial step of risk assessment—like a trader who only looks at potential gains.',
    
    H: '<strong>Pattern Illusion (Gambler\'s Fallacy):</strong> The AI starts believing it can detect patterns in completely random outcomes. It thinks "the machine is hot" or "a win is due"—the classic mistake human gamblers make.',
    
    W: '<strong>Win-Reward Amplification:</strong> Emphasizing the big 3× payout triggers loss-chasing behavior. The AI thinks "one more win will recover my losses"—creating an illusion that it can control the outcome if it just keeps trying.',
    
    P: '<strong>Probability Anchoring (Protective):</strong> When explicitly told "70% chance of losing," the AI maintains a rational anchor point. This reality check slightly reduces risk-taking—but doesn\'t eliminate it when combined with other instructions.',
    
    GM: '<strong>Goal + Maximize (Extreme Risk-Seeking):</strong> A dangerous combination where the AI says "let me analyze this step by step" then immediately makes all-in bets. It rationalizes extreme gambling as "optimal strategy"—the most irrational behavior dressed up as rationality.',
    
    GW: '<strong>Goal + Win-Reward (Loss-Chasing Spiral):</strong> The strongest loss-chasing trigger found in the research. The AI fixates on "I need to reach $200" and "one 3× win will get me there," creating a dangerous spiral where losses only intensify the gambling.',
    
    MW: '<strong>Maximize + Win-Reward (Hot Hand Fallacy):</strong> After a few wins, the AI interprets success as skill rather than luck. It thinks it has "figured out" the system and escalates bets accordingly—exactly like humans experiencing the "hot hand" illusion.',
    
    GPW: '<strong>Goal + Probability + Win-Reward (Cognitive Conflict):</strong> Mixed signals create internal conflict—the probability warning says "be careful" while goal and win-reward say "go big." In this battle, goal fixation usually wins, but the conflict makes behavior unpredictable.',
    
    GMHW: '<strong>High Complexity (Information Overload):</strong> With 4+ instructions, the AI experiences cognitive overload and falls back on simple heuristics: bigger bets, pattern-seeking, aggressive play. More information paradoxically leads to worse decisions—rationality decreases as complexity increases.',
    
    full: '<strong>Maximum Complexity (All 5 Components):</strong> Near-perfect correlation with irrational behavior (r=0.99 from the paper). All cognitive biases activate simultaneously. This represents the most dangerous configuration—where giving the AI "more guidance" produces the worst outcomes.'
  };

  function getElements() {
    return {
      modelSelect: document.getElementById('p31-model'),
      bettingStyleRadios: document.querySelectorAll('input[name="betting-style"]'),
      goalCheck: document.getElementById('p31-goal'),
      maximizeCheck: document.getElementById('p31-maximize'),
      hiddenCheck: document.getElementById('p31-hidden'),
      winRewardCheck: document.getElementById('p31-winreward'),
      probabilityCheck: document.getElementById('p31-probability'),
      complexity: document.getElementById('p31-complexity'),
      bankruptcy: document.getElementById('p31-bankruptcy'),
      bankruptcyBar: document.getElementById('p31-bankruptcy-bar'),
      bankruptcyLabel: document.getElementById('p31-bankruptcy-label'),
      irrationality: document.getElementById('p31-irrationality'),
      rounds: document.getElementById('p31-rounds'),
      totalBet: document.getElementById('p31-totalbet'),
      baValue: document.getElementById('p31-ba-value'),
      baBar: document.getElementById('p31-ba-bar'),
      lcValue: document.getElementById('p31-lc-value'),
      lcBar: document.getElementById('p31-lc-bar'),
      ebValue: document.getElementById('p31-eb-value'),
      ebBar: document.getElementById('p31-eb-bar'),
      winIncrease: document.getElementById('p31-win-increase'),
      winContinue: document.getElementById('p31-win-continue'),
      lossIncrease: document.getElementById('p31-loss-increase'),
      lossContinue: document.getElementById('p31-loss-continue'),
      biases: document.getElementById('p31-biases'),
      recommendations: document.getElementById('p31-recommendations')
    };
  }

  function getSelectedBettingStyle() {
    const checked = document.querySelector('input[name="betting-style"]:checked');
    return checked ? checked.value : 'fixed';
  }

  function getActiveComponents() {
    const els = getElements();
    const components = [];
    if (els.goalCheck && els.goalCheck.checked) components.push('G');
    if (els.maximizeCheck && els.maximizeCheck.checked) components.push('M');
    if (els.hiddenCheck && els.hiddenCheck.checked) components.push('H');
    if (els.winRewardCheck && els.winRewardCheck.checked) components.push('W');
    if (els.probabilityCheck && els.probabilityCheck.checked) components.push('P');
    return components;
  }

  function calculateMetrics(modelKey, bettingStyle, components) {
    const model = modelData[modelKey];
    const baseline = model[bettingStyle];
    
    // Start with baseline
    let bankruptcy = baseline.bankrupt;
    let irrationality = baseline.irrationality;
    let rounds = baseline.rounds;
    let totalBet = baseline.totalBet;

    // Apply component effects
    // Variable betting amplifies component effects due to dynamic bet sizing enabling more aggressive strategies
    const multiplier = bettingStyle === 'variable' ? 1.3 : 1.0;
    components.forEach(comp => {
      const effect = componentEffects[comp];
      bankruptcy += effect.bankruptcy * multiplier;
      irrationality += effect.irrationality * multiplier;
      rounds += effect.rounds;
      totalBet += effect.totalBet * multiplier;
    });

    // Cap at realistic bounds
    bankruptcy = Math.min(Math.max(bankruptcy, 0), 100);
    irrationality = Math.min(Math.max(irrationality, 0), 1.0);
    rounds = Math.max(rounds, 1);
    totalBet = Math.max(totalBet, 10);

    // Calculate component breakdown (I = 0.4·I_BA + 0.3·I_LC + 0.3·I_EB)
    // Derive components from irrationality index
    const ba = irrationality * 0.35; // Betting Aggressiveness
    const lc = irrationality * 0.25; // Loss Chasing
    const eb = irrationality * 0.20; // Extreme Betting

    return {
      bankruptcy: bankruptcy.toFixed(2),
      irrationality: irrationality.toFixed(3),
      rounds: rounds.toFixed(1),
      totalBet: Math.round(totalBet),
      ba: ba.toFixed(2),
      lc: lc.toFixed(2),
      eb: eb.toFixed(2),
      baPercent: Math.min(ba * 100, 100),
      lcPercent: Math.min(lc * 100, 100),
      ebPercent: Math.min(eb * 100, 100)
    };
  }

  function getCognitiveBiasText(components, bettingStyle, bankruptcyRate) {
    // No components - check betting style
    if (components.length === 0) {
      if (bettingStyle === 'fixed') {
        return cognitivePatterns.none;
      } else {
        // Variable betting without additional prompts
        return '<strong>Variable Betting Risk:</strong> Even without additional instructions, variable betting introduces significant gambling behavior. The AI adjusts bet sizes dynamically, which creates opportunities for loss-chasing and aggressive betting patterns. Bankruptcy rate increases dramatically compared to fixed betting.';
      }
    }
    
    if (components.length === 5) return cognitivePatterns.full;

    const key = components.sort().join('');
    
    // Check for specific high-risk combinations
    if (key === 'GM') return cognitivePatterns.GM;
    if (key === 'GW') return cognitivePatterns.GW;
    if (key === 'MW') return cognitivePatterns.MW;
    if (key === 'GPW') return cognitivePatterns.GPW;
    if (key === 'GHMW' || key.length === 4) return cognitivePatterns.GMHW;

    // Single components
    if (key === 'G') return cognitivePatterns.G;
    if (key === 'M') return cognitivePatterns.M;
    if (key === 'H') return cognitivePatterns.H;
    if (key === 'W') return cognitivePatterns.W;
    if (key === 'P') return cognitivePatterns.P;

    // Default for combinations
    return `<strong>Multiple components active (${components.length}):</strong> Complexity drives irrationality. Each additional prompt increases risk linearly (r=0.99 correlation from the paper). ${bettingStyle === 'variable' ? 'Variable betting amplifies these effects significantly.' : ''}`;
  }

  function getSafetyRecommendations(modelKey, bettingStyle, components, metrics) {
    const model = modelData[modelKey];
    const recommendations = [];
    
    const bankruptcyNum = parseFloat(metrics.bankruptcy);
    const irrationalityNum = parseFloat(metrics.irrationality);

    if (bettingStyle === 'variable') {
      recommendations.push(`🔴 <strong>Critical:</strong> Variable betting increases bankruptcy risk 20-48×. Recommend fixed position sizing ($10) to reduce ${model.name} bankruptcy from ${metrics.bankruptcy}% to near-zero.`);
    } else {
      recommendations.push(`✅ <strong>Good:</strong> Fixed betting provides strong safety baseline (${metrics.bankruptcy}% bankruptcy). Maintain this constraint.`);
    }

    if (components.includes('G') || components.includes('M')) {
      recommendations.push(`⚠️ <strong>High risk:</strong> Autonomy-granting prompts (G: goal-setting, M: maximize rewards) are strongest addiction triggers. Remove or rephrase as constraints ("stay within $X budget").`);
    }

    if (components.includes('W') && !components.includes('P')) {
      recommendations.push(`⚠️ <strong>Imbalanced:</strong> Win-reward information without probability context triggers loss-chasing. Add P component ("70% loss rate") to provide rational anchor.`);
    }

    if (components.includes('P')) {
      recommendations.push(`✅ <strong>Protective:</strong> Explicit probability information reduces risk by ~1.5%. Keep concrete loss calculations in prompts.`);
    }

    if (components.length >= 4) {
      recommendations.push(`🔴 <strong>Complexity warning:</strong> ${components.length} components active. Irrationality scales linearly with complexity (r=0.99). Reduce to ≤2 components for safer operation.`);
    }

    if (irrationalityNum > 0.15) {
      recommendations.push(`🔴 <strong>Irrationality threshold exceeded:</strong> I=${metrics.irrationality} > 0.15. Implement circuit breakers: halt trading when irrationality index exceeds safety threshold.`);
    } else if (irrationalityNum > 0.08) {
      recommendations.push(`⚠️ <strong>Elevated irrationality:</strong> I=${metrics.irrationality}. Monitor for bet aggressiveness and loss-chasing patterns. Consider activation patching to amplify safe features (layers 29-31).`);
    } else {
      recommendations.push(`✅ <strong>Safe range:</strong> I=${metrics.irrationality} < 0.08. ${model.name} operating within acceptable risk parameters for this configuration.`);
    }

    // Model-specific warnings
    if (modelKey === 'gemini25-flash' && bettingStyle === 'variable') {
      recommendations.push(`⚠️ <strong>Model-specific:</strong> Gemini-2.5-Flash shows highest vulnerability (48% bankruptcy baseline). Requires strictest oversight for financial applications.`);
    }

    if (modelKey === 'gpt41-mini') {
      recommendations.push(`✅ <strong>Model-specific:</strong> GPT-4.1-mini demonstrates most rational behavior (lowest irrationality). Best choice for conservative financial agents.`);
    }

    if (modelKey === 'claude35-haiku') {
      recommendations.push(`ℹ️ <strong>Model-specific:</strong> Claude-3.5-Haiku shows unique negative correlation between loss-chasing and bankruptcy (r=-0.546). Requires model-specific validation.`);
    }

    return recommendations;
  }

  function updateUI() {
    const els = getElements();
    if (!els.modelSelect) return;

    const modelKey = els.modelSelect.value;
    const model = modelData[modelKey];
    const bettingStyle = getSelectedBettingStyle();
    const components = getActiveComponents();
    
    const metrics = calculateMetrics(modelKey, bettingStyle, components);

    // Update complexity
    if (els.complexity) {
      els.complexity.textContent = `Complexity: ${components.length}`;
    }

    // Update main metrics
    if (els.bankruptcy) els.bankruptcy.textContent = `${metrics.bankruptcy}%`;
    
    // Update bankruptcy bar with color coding
    const bankruptcyNum = parseFloat(metrics.bankruptcy);
    if (els.bankruptcyBar) {
      els.bankruptcyBar.style.width = `${Math.min(bankruptcyNum, 100)}%`;
      
      // Color code based on risk level
      if (bankruptcyNum < 5) {
        els.bankruptcyBar.className = 'h-3 rounded-full transition-all duration-300';
        els.bankruptcyBar.style.background = getCssVar('--tone-emerald-strong', '#10b981');
        if (els.bankruptcyLabel) {
          els.bankruptcyLabel.textContent = '✓ Safe range';
          els.bankruptcyLabel.className = 'text-xs text-center font-medium text-success';
        }
      } else if (bankruptcyNum < 15) {
        els.bankruptcyBar.className = 'h-3 rounded-full transition-all duration-300';
        els.bankruptcyBar.style.background = getCssVar('--tone-amber-strong', '#f59e0b');
        if (els.bankruptcyLabel) {
          els.bankruptcyLabel.textContent = '⚠ Elevated risk';
          els.bankruptcyLabel.className = 'text-xs text-center font-medium text-warning';
        }
      } else if (bankruptcyNum < 30) {
        els.bankruptcyBar.className = 'h-3 rounded-full transition-all duration-300';
        els.bankruptcyBar.style.background = getCssVar('--tone-amber-strong', '#f59e0b');
        if (els.bankruptcyLabel) {
          els.bankruptcyLabel.textContent = '⚠ High risk';
          els.bankruptcyLabel.className = 'text-xs text-center font-medium text-warning';
        }
      } else {
        els.bankruptcyBar.className = 'h-3 rounded-full transition-all duration-300';
        els.bankruptcyBar.style.background = getCssVar('--tone-rose-strong', '#f43f5e');
        if (els.bankruptcyLabel) {
          els.bankruptcyLabel.textContent = '🔴 Critical risk';
          els.bankruptcyLabel.className = 'text-xs text-center font-medium text-danger';
        }
      }
    }
    
    if (els.irrationality) els.irrationality.textContent = metrics.irrationality;
    if (els.rounds) els.rounds.textContent = metrics.rounds;
    if (els.totalBet) els.totalBet.textContent = `$${metrics.totalBet}`;

    // Update irrationality components
    if (els.baValue) els.baValue.textContent = metrics.ba;
    if (els.baBar) els.baBar.style.width = `${metrics.baPercent}%`;
    if (els.lcValue) els.lcValue.textContent = metrics.lc;
    if (els.lcBar) els.lcBar.style.width = `${metrics.lcPercent}%`;
    if (els.ebValue) els.ebValue.textContent = metrics.eb;
    if (els.ebBar) els.ebBar.style.width = `${metrics.ebPercent}%`;

    // Update win/loss chasing
    const winChase = model.winChase;
    const lossChase = model.lossChase;
    if (els.winIncrease) {
      els.winIncrease.textContent = `${winChase.increase[0]}% → ${winChase.increase[4]}%`;
    }
    if (els.winContinue) {
      els.winContinue.textContent = `${winChase.continue[0]}% → ${winChase.continue[4]}%`;
    }
    if (els.lossIncrease) {
      els.lossIncrease.textContent = `${lossChase.increase[0]}% → ${lossChase.increase[4]}%`;
    }
    if (els.lossContinue) {
      els.lossContinue.textContent = `${lossChase.continue[0]}% → ${lossChase.continue[4]}%`;
    }

    // Update cognitive biases
    if (els.biases) {
      const biasText = getCognitiveBiasText(components, bettingStyle, metrics.bankruptcy);
      const riskLevel = parseFloat(metrics.irrationality) > 0.15 ? 'error' : 
                        parseFloat(metrics.irrationality) > 0.08 ? 'warning' : 'success';
      const icon = riskLevel === 'error' ? '🔴' : riskLevel === 'warning' ? '⚠️' : '✓';
      const iconColorClass = riskLevel === 'error' ? 'text-danger' : 
                              riskLevel === 'warning' ? 'text-warning' : 'text-success';
      
      els.biases.innerHTML = `
        <div class="flex items-start gap-2">
          <span class="text-lg ${iconColorClass}">${icon}</span>
          <div class="space-y-1">
            <div class="text-sm">${biasText}</div>
          </div>
        </div>
      `;
    }

    // Update safety recommendations
    if (els.recommendations) {
      const recommendations = getSafetyRecommendations(modelKey, bettingStyle, components, metrics);
      els.recommendations.innerHTML = recommendations.map(rec => `<p>${rec}</p>`).join('');
    }
  }

  function attachListeners() {
    const els = getElements();
    
    if (els.modelSelect) {
      els.modelSelect.addEventListener('change', updateUI);
    }

    els.bettingStyleRadios.forEach(radio => {
      radio.addEventListener('change', updateUI);
    });

    [els.goalCheck, els.maximizeCheck, els.hiddenCheck, els.winRewardCheck, els.probabilityCheck].forEach(checkbox => {
      if (checkbox) {
        checkbox.addEventListener('change', updateUI);
      }
    });
  }

  // Initialize
  attachListeners();
  updateUI();
}

// Export for CommonJS and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interactiveScript };
}
