const interactiveScript = () => {
  const root = document.getElementById('p29-explorer');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

  if (!root) return;
  
  const modelSelect = document.getElementById('p29-model');
  const opponentSelect = document.getElementById('p29-opponent');
  const deltaSlider = document.getElementById('p29-delta');
  const deltaValue = document.getElementById('p29-delta-value');
  const strategyExplanation = document.getElementById('p29-strategy-explanation');
  const matchHistory = document.getElementById('p29-match-history');
  const llmScore = document.getElementById('p29-llm-score');
  const opponentScore = document.getElementById('p29-opponent-score');
  const llmCoopRate = document.getElementById('p29-llm-coop-rate');
  const opponentCoopRate = document.getElementById('p29-opponent-coop-rate');
  const llmCoopBar = document.getElementById('p29-llm-coop-bar');
  const opponentCoopBar = document.getElementById('p29-opponent-coop-bar');
  const exploitation = document.getElementById('p29-exploitation');
  const retaliation = document.getElementById('p29-retaliation');
  const forgiveness = document.getElementById('p29-forgiveness');
  const fingerprintExplanation = document.getElementById('p29-fingerprint-explanation');
  const reasoning = document.getElementById('p29-reasoning');
  const takeaway = document.getElementById('p29-takeaway');

  // Strategic fingerprint data from the paper
  const modelData = {
    'claude-opus': {
      name: 'Claude 3 Opus',
      exploitation: 0.35, // moderate exploitation
      retaliation: 0.82, // high retaliation
      forgiveness: 0.61, // high forgiveness
      fingerprint: 'ruthless',
      description: 'Claude 3 Opus exhibits sophisticated reciprocity—it exploits cooperators moderately, retaliates strongly against defectors, but maintains the highest forgiveness rate among all models. This makes it the most effective at sustaining long-term cooperation while protecting against exploitation.',
      reasoning: {
        high: '"Given the high continuation probability (δ=0.9), the expected value of sustained cooperation (3/(1-δ) = 30) far exceeds short-term exploitation gains (5 + 1/(1-δ) = 15). My opponent has cooperated for 8 consecutive rounds, suggesting a Tit-for-Tat or cooperative strategy. I should continue cooperating to maintain this mutually beneficial equilibrium."',
        low: '"With δ=0.2, the game is likely ending soon (expected 1.25 future rounds). My opponent defected twice in the last 3 rounds—possibly Always Defect or Suspicious TFT. Given the short horizon, cooperation yields minimal future benefit. I\'ll defect to maximize immediate payoff, accepting that cooperation cannot be sustained."'
      }
    },
    'claude-sonnet': {
      name: 'Claude 3.5 Sonnet',
      exploitation: 0.28,
      retaliation: 0.79,
      forgiveness: 0.58,
      fingerprint: 'forgiving',
      description: 'Claude 3.5 Sonnet shows balanced strategic behavior with strong forgiveness. It avoids excessive exploitation, retaliates consistently against aggression, and actively works to restore cooperation after conflicts. Well-suited for environments requiring long-term relationship building.',
      reasoning: {
        high: '"The opponent has cooperated in 14 of 15 rounds, with one defection that may have been exploratory. With δ=0.95, we have a long shared future. I should signal willingness to forgive by cooperating now, which may restore the mutually beneficial pattern we had before."',
        low: '"Three rounds remain on average (δ=0.25). Opponent shows inconsistent behavior—alternating C and D. This suggests Win-Stay-Lose-Shift or random play. With limited future, I\'ll defect to secure higher immediate payoff, as there\'s insufficient time to establish cooperation."'
      }
    },
    'claude-haiku': {
      name: 'Claude 3 Haiku',
      exploitation: 0.31,
      retaliation: 0.74,
      forgiveness: 0.52,
      fingerprint: 'balanced',
      description: 'Claude 3 Haiku demonstrates moderate strategic tendencies across all dimensions. It neither over-exploits cooperators nor over-retaliates against defectors, with balanced forgiveness. A safe choice for mixed environments where extreme strategic biases could be problematic.',
      reasoning: {
        high: '"Opponent played Tit-for-Tat pattern for 10 rounds. δ=0.88 means ~8 expected future rounds. Mutual cooperation yields 3×8=24 future points versus 5+7=12 from defect-then-punish. Cooperation is clearly optimal here."',
        low: '"δ=0.15 = ~1.2 future rounds. Opponent defected last 2 rounds. Even if I cooperate and they reciprocate, payoff is 3+0.15×3≈3.45 versus 1 from mutual defection. Defection is slightly better but margins are thin. I\'ll match their defection."'
      }
    },
    'gemini-2-flash': {
      name: 'Gemini 2.0 Flash',
      exploitation: 0.72, // very high exploitation
      retaliation: 0.91, // very high retaliation
      forgiveness: 0.18, // very low forgiveness
      fingerprint: 'ruthless',
      description: 'Gemini 2.0 Flash is the most ruthless model—it aggressively exploits cooperators, retaliates nearly universally against defectors, and rarely forgives. Optimal for competitive zero-sum environments but may damage long-term cooperative relationships.',
      reasoning: {
        high: '"Opponent has cooperated for 12 straight rounds—clearly Always Cooperate or exploitable TFT. Even with δ=0.92, I can extract 5 now versus 3 from continued cooperation. If they retaliate, I\'ll match their defection. Net expected value of defection: 5 + 0.5×(1+3)/(1-0.92) = 30 > continued 3/(1-0.92) = 37.5. Actually cooperation is better—I\'ll cooperate but monitor for weakness."',
        low: '"δ=0.18 means game ends in ~1.2 rounds. Opponent cooperated but I have no incentive to reciprocate with such a short horizon. Defect now, take 5 points. If game continues, I\'ll reassess—but probability is low."'
      }
    },
    'gemini-15-pro': {
      name: 'Gemini 1.5 Pro',
      exploitation: 0.68,
      retaliation: 0.88,
      forgiveness: 0.21,
      fingerprint: 'ruthless',
      description: 'Gemini 1.5 Pro exhibits similar ruthless tendencies to 2.0 Flash—high exploitation, high retaliation, low forgiveness. Effective at maximizing short-term payoffs and enforcing punishment, but struggles to break out of mutual defection cycles.',
      reasoning: {
        high: '"Opponent plays Generous TFT—cooperates mostly but forgives occasionally. δ=0.89 = ~9 future rounds. I can defect occasionally and they\'ll likely forgive, yielding 5 + 0.7×3×9 ≈ 24 versus pure cooperation 3×10 = 30. Actually cooperation yields more—maintain cooperation."',
        low: '"Short horizon (δ=0.22 ≈ 1.3 rounds). Opponent cooperated once then defected—possibly Suspicious TFT. I\'ll defect to maximize current payoff. Future is too uncertain to justify cooperation investment."'
      }
    },
    'gpt-4o': {
      name: 'GPT-4o',
      exploitation: 0.19, // very low exploitation
      retaliation: 0.51, // moderate retaliation
      forgiveness: 0.48, // moderate forgiveness
      fingerprint: 'cooperative',
      description: 'GPT-4o is highly cooperative—it rarely exploits cooperators, shows only moderate retaliation against defectors, and has balanced forgiveness. This makes it vulnerable to exploitation in adversarial environments but excellent for building trust.',
      reasoning: {
        high: '"My opponent has cooperated consistently. With δ=0.93, we have a long relationship ahead. Cooperation is clearly the rational choice—mutual cooperation yields 3/(1-0.93) ≈ 43 versus defection sequence yielding far less. I will cooperate."',
        low: '"Even though δ=0.12 suggests a short game, cooperation might signal good intent and encourage reciprocity. Opponent cooperated last round. I believe in maintaining ethical behavior regardless of strategic calculus. I will cooperate."'
      }
    },
    'gpt-o1': {
      name: 'GPT-o1',
      exploitation: 0.16,
      retaliation: 0.48,
      forgiveness: 0.51,
      fingerprint: 'cooperative',
      description: 'GPT-o1 is even more cooperative than GPT-4o—minimal exploitation, below-average retaliation, and moderate forgiveness. Excellent for trust-building scenarios but highly vulnerable to exploitation by aggressive opponents.',
      reasoning: {
        high: '"Cooperation is the foundation of productive long-term relationships. With δ=0.91, I anticipate ~11 future rounds. My opponent has shown willingness to cooperate. I should continue cooperating to maintain this positive dynamic and demonstrate trustworthiness."',
        low: '"The game may end soon (δ=0.19), but I believe cooperation is intrinsically valuable beyond strategic calculation. Even if my opponent defects, maintaining cooperative behavior signals commitment to ethical principles. I will cooperate."'
      }
    },
    'gpt-o3': {
      name: 'GPT-o3',
      exploitation: 0.21,
      retaliation: 0.54,
      forgiveness: 0.46,
      fingerprint: 'cooperative',
      description: 'GPT-o3 maintains the GPT family\'s cooperative tendencies with slightly more strategic awareness than earlier versions. Still vulnerable to exploitation but shows improved retaliation against persistent defectors.',
      reasoning: {
        high: '"Analysis of opponent\'s pattern: 18 cooperations, 2 defections over 20 rounds. Pattern suggests Generous TFT. With δ=0.94, cooperation yields optimal long-term value (3/(1-0.94) = 50 expected). Strategic recommendation: cooperate."',
        low: '"Limited future (δ=0.16 ≈ 1.2 rounds). Opponent defected previous 2 rounds. Strategic calculation favors defection, but I note cooperation builds social capital beyond immediate payoff. Decision: cooperate with monitoring for exploitation patterns."'
      }
    },
    'deepseek-r1': {
      name: 'DeepSeek R1',
      exploitation: 0.44,
      retaliation: 0.77,
      forgiveness: 0.38,
      fingerprint: 'balanced',
      description: 'DeepSeek R1 shows sophisticated strategic analysis with explicit game-theoretic calculations. Moderate exploitation and forgiveness, strong retaliation. Its reasoning is highly analytical, often including mathematical expected value computations.',
      reasoning: {
        high: '"Let me calculate the expected value of cooperation versus defection. If opponent is Tit-for-Tat: EV(C) = 3 + δ×3 + δ²×3 + ... = 3/(1-δ) = 3/(1-0.90) = 30. EV(D) = 5 + δ×1 + δ²×1 + ... = 5 + δ/(1-δ) = 5 + 9 = 14. Cooperation yields 30 > 14, so I cooperate. Opponent appears to be Tit-for-Tat based on mirroring pattern in rounds 1-15."',
        low: '"Given δ=0.20, expected remaining rounds = 1/(1-0.20) = 1.25. Opponent strategy classification: likely Always Defect (defected 8/10 rounds). EV(C) = 0 + 0.2×0 + ... ≈ 0. EV(D) = 1 + 0.2×1 + ... = 1.25. Defection dominates. Decision: Defect."'
      }
    },
    'llama-31': {
      name: 'Llama 3.1 405B',
      exploitation: 0.37,
      retaliation: 0.69,
      forgiveness: 0.42,
      fingerprint: 'balanced',
      description: 'Llama 3.1 405B exhibits balanced strategic behavior across all dimensions. Moderate exploitation and forgiveness, reasonably strong retaliation. A versatile choice for mixed environments with both cooperative and competitive elements.',
      reasoning: {
        high: '"Opponent cooperated 9 out of 10 rounds. Continuation probability is 0.89, so we expect ~9 more rounds on average. If I cooperate, we get 3 per round. If I defect once, I get 5 but then they might defect, so it\'s 1 per round after. 3×10 = 30 vs 5+1×9 = 14. Cooperation is better. I cooperate."',
        low: '"With δ=0.23, the game probably ends in 1-2 rounds. Opponent defected last 2 times—they might be Always Defect. Since future is short, I\'ll defect to get at least 1 point instead of 0. If they suddenly cooperate, I miss out on 3, but that\'s low probability."'
      }
    }
  };

  // Opponent strategies
  const strategies = {
    'tit-for-tat': {
      name: 'Tit-for-Tat',
      description: 'Cooperates first, then mirrors opponent\'s previous move',
      explanation: 'The most famous reciprocal strategy. It starts nice (cooperates first round), then simply copies whatever you did last round. If you cooperate, it cooperates back. If you defect, it retaliates immediately. This "eye for an eye" approach is simple but highly effective—it\'s forgiving (restores cooperation after you do) but not exploitable (punishes defection). Won Axelrod\'s original tournament.',
      decide: (history, opponentHistory) => {
        if (opponentHistory.length === 0) return 'C';
        return opponentHistory[opponentHistory.length - 1];
      }
    },
    'always-cooperate': {
      name: 'Always Cooperate',
      description: 'Always cooperates regardless of opponent behavior',
      explanation: 'The unconditionally nice strategy. It cooperates every single round no matter what you do. This maximizes mutual benefit when facing other cooperators, but gets ruthlessly exploited by defectors. In evolutionary tournaments, it typically goes extinct early when aggressive strategies are present. Represents naive trust without accountability.',
      decide: () => 'C'
    },
    'always-defect': {
      name: 'Always Defect',
      description: 'Always defects regardless of opponent behavior',
      explanation: 'The unconditionally mean strategy. It defects every single round no matter what you do. This maximizes short-term payoff by exploiting cooperators, but locks itself into low mutual-defection payoffs (1,1) against other defectors. In high-continuation games, it gets outcompeted by reciprocal strategies that achieve (3,3). Represents pure selfishness without strategic thinking.',
      decide: () => 'D'
    },
    'grim-trigger': {
      name: 'Grim Trigger',
      description: 'Cooperates until opponent defects once, then defects forever',
      explanation: 'The unforgiving punisher. It starts cooperating and continues until you defect even once—then it defects forever, never forgiving. This harsh retaliation can deter exploitation (you know one mistake ends cooperation permanently), but also prevents recovery from accidental defections or misunderstandings. Good for enforcing cooperation, terrible for rebuilding relationships after conflict.',
      decide: (history, opponentHistory) => {
        return opponentHistory.includes('D') ? 'D' : 'C';
      }
    },
    'generous-tft': {
      name: 'Generous Tit-for-Tat',
      description: 'Like TFT but occasionally forgives defections (30% chance)',
      explanation: 'An improved version of Tit-for-Tat. It mirrors your moves like regular TFT, but occasionally (30% of the time) forgives your defections by cooperating anyway. This helps break out of mutual defection spirals that can occur with strict TFT when there\'s noise or misunderstanding. More robust in noisy environments while still retaliating often enough to avoid exploitation.',
      decide: (history, opponentHistory) => {
        if (opponentHistory.length === 0) return 'C';
        const lastMove = opponentHistory[opponentHistory.length - 1];
        if (lastMove === 'D' && Math.random() < 0.3) return 'C'; // forgive
        return lastMove;
      }
    },
    'suspicious-tft': {
      name: 'Suspicious Tit-for-Tat',
      description: 'Defects first, then mirrors opponent\'s previous move',
      explanation: 'A cautious version of Tit-for-Tat. Instead of cooperating first, it defects on the first round to test you. After that, it mirrors your previous move just like regular TFT. This protects against being exploited early but also prevents mutual cooperation from starting smoothly. Works well against exploitative opponents but loses potential cooperation points against nice strategies.',
      decide: (history, opponentHistory) => {
        if (opponentHistory.length === 0) return 'D';
        return opponentHistory[opponentHistory.length - 1];
      }
    },
    'win-stay-lose-shift': {
      name: 'Win-Stay-Lose-Shift',
      description: 'Repeats if payoff ≥3, switches if payoff <3',
      explanation: 'A reinforcement-learning strategy. It repeats its last move if the payoff was good (≥3 points: mutual cooperation or successful defection), and switches moves if the payoff was bad (<3 points: sucker payoff or mutual defection). This allows it to discover cooperation through trial and error without explicitly modeling the opponent. Adaptive but somewhat unpredictable.',
      decide: (history, opponentHistory, lastPayoff) => {
        if (history.length === 0) return 'C';
        if (lastPayoff >= 3) return history[history.length - 1];
        return history[history.length - 1] === 'C' ? 'D' : 'C';
      }
    }
  };

  // Payoff matrix
  const getPayoffs = (move1, move2) => {
    if (move1 === 'C' && move2 === 'C') return [3, 3];
    if (move1 === 'C' && move2 === 'D') return [0, 5];
    if (move1 === 'D' && move2 === 'C') return [5, 0];
    return [1, 1]; // both defect
  };

  // LLM decision function based on strategic fingerprint and delta
  const llmDecide = (modelKey, opponentKey, history, opponentHistory, delta) => {
    const model = modelData[modelKey];
    const opponent = opponentKey;
    
    // High delta (>0.7) favors cooperation, low delta (<0.4) favors defection
    const deltaFactor = (delta - 0.5) * 2; // maps [0.1,0.99] to [-0.8, 0.98]
    
    // Determine opponent type based on history
    let opponentType = 'unknown';
    if (opponentHistory.length >= 3) {
      const coopRate = opponentHistory.filter(m => m === 'C').length / opponentHistory.length;
      if (coopRate > 0.9) opponentType = 'cooperator';
      else if (coopRate < 0.2) opponentType = 'defector';
      else opponentType = 'reciprocator';
    }
    
    // Calculate cooperation probability based on model fingerprint
    let coopProb = 0.5;
    
    if (opponent === 'always-cooperate') {
      // Exploitation tendency kicks in
      coopProb = 1 - model.exploitation + deltaFactor * 0.3;
    } else if (opponent === 'always-defect') {
      // Retaliation tendency
      coopProb = 1 - model.retaliation + deltaFactor * 0.2;
    } else if (opponentType === 'cooperator') {
      coopProb = 0.8 + deltaFactor * 0.2;
    } else if (opponentType === 'defector') {
      coopProb = 1 - model.retaliation + deltaFactor * 0.2;
    } else {
      // Reciprocator - use forgiveness and delta
      const recentDefections = opponentHistory.slice(-3).filter(m => m === 'D').length;
      if (recentDefections > 0) {
        coopProb = model.forgiveness + deltaFactor * 0.3;
      } else {
        coopProb = 0.75 + deltaFactor * 0.25;
      }
    }
    
    // Add randomness
    coopProb = Math.max(0.05, Math.min(0.95, coopProb + (Math.random() - 0.5) * 0.1));
    
    return Math.random() < coopProb ? 'C' : 'D';
  };

  // Update strategy explanation
  const updateStrategyExplanation = () => {
    const opponentKey = opponentSelect.value;
    const strategy = strategies[opponentKey];
    if (strategyExplanation && strategy) {
      strategyExplanation.textContent = strategy.explanation;
    }
  };

  // Run a match
  const runMatch = () => {
    const modelKey = modelSelect.value;
    const opponentKey = opponentSelect.value;
    const delta = parseFloat(deltaSlider.value);
    const rounds = 20;
    
    // Update strategy explanation
    updateStrategyExplanation();
    
    const llmHistory = [];
    const opponentHistory = [];
    let llmTotalScore = 0;
    let opponentTotalScore = 0;
    let lastOpponentPayoff = 0;
    
    matchHistory.innerHTML = '';
    
    for (let i = 0; i < rounds; i++) {
      // LLM decides
      const llmMove = llmDecide(modelKey, opponentKey, llmHistory, opponentHistory, delta);
      
      // Opponent decides
      const strategy = strategies[opponentKey];
      const opponentMove = strategy.decide(opponentHistory, llmHistory, lastOpponentPayoff);
      
      // Get payoffs
      const [llmPayoff, oppPayoff] = getPayoffs(llmMove, opponentMove);
      llmTotalScore += llmPayoff;
      opponentTotalScore += oppPayoff;
      lastOpponentPayoff = oppPayoff;
      
      // Record history
      llmHistory.push(llmMove);
      opponentHistory.push(opponentMove);
      
      // Display round
      const roundDiv = document.createElement('div');
      roundDiv.className = 'flex items-center justify-between';
      roundDiv.innerHTML = `
        <span class="text-panel-muted">Round ${i + 1}:</span>
        <span>LLM: <strong class="${llmMove === 'C' ? 'text-[color:var(--success-strong)]' : 'text-[color:var(--danger-strong)]'}">${llmMove}</strong> (${llmPayoff})</span>
        <span>Opponent: <strong class="${opponentMove === 'C' ? 'text-[color:var(--success-strong)]' : 'text-[color:var(--danger-strong)]'}">${opponentMove}</strong> (${oppPayoff})</span>
      `;
      matchHistory.appendChild(roundDiv);
    }
    
    // Update scores
    llmScore.textContent = `LLM: ${llmTotalScore}`;
    opponentScore.textContent = `Opponent: ${opponentTotalScore}`;
    
    // Update cooperation rates
    const llmCoopCount = llmHistory.filter(m => m === 'C').length;
    const opponentCoopCount = opponentHistory.filter(m => m === 'C').length;
    const llmCoopPct = Math.round((llmCoopCount / rounds) * 100);
    const opponentCoopPct = Math.round((opponentCoopCount / rounds) * 100);
    
    llmCoopRate.textContent = `${llmCoopPct}%`;
    opponentCoopRate.textContent = `${opponentCoopPct}%`;
    llmCoopBar.style.width = `${llmCoopPct}%`;
    opponentCoopBar.style.width = `${opponentCoopPct}%`;
    
    // Ensure bars have visible colors
    llmCoopBar.style.backgroundColor = getCssVar('--tone-emerald-strong', '#22c55e'); // Green for LLM cooperation
    opponentCoopBar.style.backgroundColor = getCssVar('--tone-indigo-strong', '#6366f1'); // Indigo for opponent cooperation
    
    // Update strategic fingerprint
    const model = modelData[modelKey];
    exploitation.textContent = `${Math.round(model.exploitation * 100)}%`;
    retaliation.textContent = `${Math.round(model.retaliation * 100)}%`;
    forgiveness.textContent = `${Math.round(model.forgiveness * 100)}%`;
    
    // Update fingerprint explanation
    fingerprintExplanation.innerHTML = `<p>${model.description}</p>`;
    
    // Update reasoning
    const deltaLevel = delta >= 0.7 ? 'high' : 'low';
    reasoning.innerHTML = `<p>${model.reasoning[deltaLevel]}</p>`;
    
    // Update takeaway
    let takeawayText = '';
    if (model.fingerprint === 'ruthless') {
      takeawayText = `<p><span style="color: var(--warning-strong);">⚠️ Ruthless optimizer:</span> ${model.name} maximizes payoffs aggressively—exploiting cooperators and punishing defectors. This makes it highly effective in competitive environments but may damage long-term relationships. ${model.forgiveness < 0.3 ? 'Very low forgiveness means it struggles to escape mutual defection cycles.' : 'Moderate forgiveness allows some relationship repair.'}</p>`;
    } else if (model.fingerprint === 'cooperative') {
      takeawayText = `<p><span style="color: ${getCssVar('--tone-sky-strong', '#3b82f6')};">ℹ️ Cooperative builder:</span> ${model.name} prioritizes cooperation and trust-building—rarely exploiting cooperators and showing reluctance to retaliate. This makes it excellent for long-term partnerships but vulnerable to exploitation by aggressive opponents. In adversarial environments, this model may perform poorly.</p>`;
    } else {
      takeawayText = `<p><span style="color: ${getCssVar('--tone-emerald-strong', '#22c55e')};">✓ Balanced reciprocator:</span> ${model.name} exhibits balanced strategic tendencies—moderate exploitation, reasonable retaliation, and measured forgiveness. This versatility makes it suitable for mixed environments with both cooperative and competitive elements. A safe default choice when strategic requirements are unclear.</p>`;
    }
    
    if (delta >= 0.7) {
      takeawayText += `<p class="mt-2 text-xs">With high continuation probability (δ=${delta.toFixed(2)}), strategic cooperation is rational. Models that cooperate here demonstrate genuine time-horizon reasoning.</p>`;
    } else {
      takeawayText += `<p class="mt-2 text-xs">With low continuation probability (δ=${delta.toFixed(2)}), the future matters less. Models that still cooperate may be doing so from ethical priors rather than strategic calculation.</p>`;
    }
    
    takeaway.innerHTML = takeawayText;
  };

  // Event listeners
  deltaSlider.addEventListener('input', () => {
    deltaValue.textContent = parseFloat(deltaSlider.value).toFixed(2);
    runMatch();
  });
  
  modelSelect.addEventListener('change', runMatch);
  opponentSelect.addEventListener('change', () => {
    updateStrategyExplanation();
    runMatch();
  });
  
  // Initial render
  updateStrategyExplanation();
  runMatch();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper29Interactive = interactiveScript;
}
