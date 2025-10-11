function interactiveScript() {
  'use strict';

  // Problem type definitions with meta-approach affinities
  const problemTypes = {
    novelty: {
      name: 'Novel edge cases (sparse training data)',
      description: 'Problems with limited training examples where generalization is critical',
      metaApproachScores: {
        scale: 20, // Scale-maxing fails on sparse data by definition
        simp: 60,  // Simplicity helps generalization
        w: 95      // Weak constraints maximize generalization
      },
      bottlenecks: [
        'Scale-maxing structurally fails—novelty means sparse data, and more compute doesn\'t create training examples',
        'Sample efficiency is paramount: w-maxing (110-500% better generalization) outperforms simp-maxing',
        'Energy costs remain high if not addressing efficiency directly'
      ],
      tools: [
        { name: 'Neuro-symbolic hybrids', why: 'Ground search in learned representations for transfer learning' },
        { name: 'Few-shot learning methods', why: 'Optimize for sample efficiency explicitly' },
        { name: 'Causal reasoning (NARS, AERA)', why: 'Infer structure from limited observations' }
      ]
    },
    precision: {
      name: 'High-stakes precision (verification required)',
      description: 'Tasks requiring verifiable correctness and interpretability',
      metaApproachScores: {
        scale: 40, // Approximation is imprecise
        simp: 75,  // Simpler models are more interpretable
        w: 60      // Weak constraints can be verified
      },
      bottlenecks: [
        'Pure approximation (neural nets) is inherently imprecise—no verification guarantees',
        'Search provides proof but is computationally expensive for large state spaces',
        'Hybrid approaches needed to balance precision and scalability'
      ],
      tools: [
        { name: 'Search algorithms (A*, theorem provers)', why: 'Verifiable correctness through symbolic reasoning' },
        { name: 'Formal verification tools', why: 'Mathematical proof of properties' },
        { name: 'AlphaGeometry-style hybrids', why: 'Neural generation + symbolic verification' }
      ]
    },
    scale: {
      name: 'Large-scale coverage (massive data available)',
      description: 'Problems with abundant training data and compute resources',
      metaApproachScores: {
        scale: 95, // Scale-maxing shines here
        simp: 50,  // Simplicity less critical with abundant data
        w: 40      // Efficiency less urgent
      },
      bottlenecks: [
        'Energy costs become prohibitive at scale (The Embiggening\'s primary limit)',
        'Diminishing returns—performance gains flatten despite increased resources',
        'Sample inefficiency remains even with abundant data (edge cases still fail)'
      ],
      tools: [
        { name: 'Transformers (GPT-4, Claude)', why: 'Parallelizable approximation scales on GPUs' },
        { name: 'Distributed training', why: 'Leverage available compute efficiently' },
        { name: 'Knowledge distillation', why: 'Compress large models after training for deployment' }
      ]
    },
    efficiency: {
      name: 'Resource-constrained deployment (energy/cost limits)',
      description: 'Scenarios where sample and energy efficiency determine viability',
      metaApproachScores: {
        scale: 10, // Scale-maxing is antithetical to efficiency
        simp: 70,  // Compression helps but doesn\'t optimize hardware
        w: 100     // W-maxing optimizes both sample and energy efficiency
      },
      bottlenecks: [
        'Scale-maxing approach unsustainable—energy costs limit deployment',
        'Compression (simp-maxing) helps form but doesn\'t optimize functional efficiency',
        'Hardware-level optimization required: w-maxing delegates control to lower abstractions'
      ],
      tools: [
        { name: 'Model quantization/pruning', why: 'Reduce inference cost via compression' },
        { name: 'Hardware delegation (FPGAs)', why: 'Optimize at lower abstraction levels like C vs Python' },
        { name: 'Biological-inspired self-organization', why: 'Biology adapts efficiently by distributing control' }
      ]
    },
    autonomous: {
      name: 'Autonomous experimentation (planning + learning)',
      description: 'Building artificial scientists that can independently experiment and learn',
      metaApproachScores: {
        scale: 50, // Approximation handles perception
        simp: 60,  // Simplicity aids interpretability
        w: 90      // Weak constraints enable autonomy
      },
      bottlenecks: [
        'Monolithic LLMs lack planning, causal reasoning, and autonomous goal-setting',
        'Requires modular integration: perception, memory, reasoning, experimentation',
        'Sample efficiency critical for learning from self-generated experiments'
      ],
      tools: [
        { name: 'NARS (Non-Axiomatic Reasoning)', why: 'Incremental learning under uncertainty (AIKR)' },
        { name: 'AERA (Autocatalytic Endogenous Reflective)', why: 'Self-programming + analogy + causal models' },
        { name: 'Hyperon', why: 'Modular distributed AGI: logic + neural + metagraph' }
      ]
    },
    realtime: {
      name: 'Real-time adaptation (dynamic environments)',
      description: 'Environments requiring continuous learning and rapid response',
      metaApproachScores: {
        scale: 30, // Large models too slow
        simp: 65,  // Simple models adapt faster
        w: 85      // Weak constraints enable flexibility
      },
      bottlenecks: [
        'Scale-maxed models have high inference latency—unsuitable for real-time',
        'Search can be sequential—parallelization improvements needed',
        'Balance speed with adaptability: hybrids that cache and reuse'
      ],
      tools: [
        { name: 'Reinforcement learning', why: 'Learn from interaction in dynamic settings' },
        { name: 'Structured RL (convolutional autoencoders)', why: 'Compress high-D sensory data to symbols for fast planning' },
        { name: 'Parallel search algorithms', why: 'Leverage GPU parallelization for search' }
      ]
    }
  };

  // Meta-approach definitions
  const metaApproaches = {
    scale: {
      name: 'Scale-maxing',
      icon: '⚡',
      shortDesc: 'Bitter Lesson: maximize compute, data, and model size',
      fullDesc: 'Throw unlimited resources at the problem. GPT-3 (175B params, 45TB text), AlphaFold (data center protein folding). Pros: Brute-force coverage, works when resources available. Cons: Diminishing returns, energy costs, sample inefficiency—fails on genuine novelty.',
      examples: ['GPT-3/GPT-4 (LLMs)', 'AlphaFold 2 (protein folding)', 'DALL-E (image generation)']
    },
    simp: {
      name: 'Simp-maxing',
      icon: '🪶',
      shortDesc: 'Ockham\'s Razor: maximize simplicity of form via compression',
      fullDesc: 'Optimize for simplest model that fits data. Based on Kolmogorov complexity—shorter programs are more general. Includes regularization, pruning, MDL, AIXI. Pros: Better generalization, interpretability. Cons: Complexity is interpreter-dependent (computational dualism), doesn\'t guarantee functional efficiency.',
      examples: ['AIXI (universal intelligence)', 'Model pruning/quantization', 'MDL (Minimum Description Length)']
    },
    w: {
      name: 'W-maxing',
      icon: '🌊',
      shortDesc: 'Bennett\'s Razor: maximize weakness of functional constraints',
      fullDesc: 'Optimize for weakest (most general) constraints while satisfying requirements. Delegate control to lower abstraction levels (hardware). Yields 110-500% better generalization than simplicity alone. Pros: Optimizes sample AND energy efficiency, enables autonomy. Cons: Requires search over infinite embodiment space.',
      examples: ['Biological self-organization', 'Hardware delegation (FPGAs)', 'Stack Theory (enactivism)']
    }
  };

  function getElements() {
    return {
      problemType: document.getElementById('p33-problem-type'),
      computeSlider: document.getElementById('p33-compute'),
      dataSlider: document.getElementById('p33-data'),
      interpSlider: document.getElementById('p33-interp'),
      computeVal: document.getElementById('p33-compute-val'),
      dataVal: document.getElementById('p33-data-val'),
      interpVal: document.getElementById('p33-interp-val'),
      tools: document.getElementById('p33-tools'),
      bottlenecks: document.getElementById('p33-bottlenecks')
    };
  }

  function getSliderLabel(value) {
    if (value <= 3) return 'Low';
    if (value <= 7) return 'Medium';
    return 'High';
  }

  function updateSliderLabels(els) {
    els.computeVal.textContent = getSliderLabel(parseInt(els.computeSlider.value));
    els.dataVal.textContent = getSliderLabel(parseInt(els.dataSlider.value));
    els.interpVal.textContent = getSliderLabel(parseInt(els.interpSlider.value));
  }

  function calculateScores(problemType, compute, data, interp) {
    const problem = problemTypes[problemType];
    const scores = { ...problem.metaApproachScores };

    // Adjust scores based on constraints
    // High compute favors scale-maxing
    scores.scale += (compute - 5) * 5;
    // High data favors scale-maxing
    scores.scale += (data - 5) * 4;
    // High interpretability favors search/simp-maxing
    scores.simp += (interp - 5) * 3;
    // Low compute/data favors w-maxing (efficiency)
    scores.w += (10 - compute) * 2;
    scores.w += (10 - data) * 2;

    // Clamp scores to 0-100
    Object.keys(scores).forEach(k => {
      scores[k] = Math.max(0, Math.min(100, scores[k]));
    });

    return scores;
  }

  function updateRecommendation(els) {
    const problemType = els.problemType.value;
    const compute = parseInt(els.computeSlider.value);
    const data = parseInt(els.dataSlider.value);
    const interp = parseInt(els.interpSlider.value);

    const scores = calculateScores(problemType, compute, data, interp);
    const problem = problemTypes[problemType];

    // Update meta-approach cards
    const scaleScore = Math.round(scores.scale);
    const simpScore = Math.round(scores.simp);
    const wScore = Math.round(scores.w);

    // Update scale-maxing card
    document.getElementById('p33-scale-score').textContent = `${scaleScore}/100`;
    document.getElementById('p33-scale-bar').style.width = `${scaleScore}%`;
    document.getElementById('p33-scale-best').textContent = compute >= 7 && data >= 7 
      ? 'Your situation (lots of resources)' 
      : 'You have unlimited budget and data';
    document.getElementById('p33-scale-limit').textContent = data <= 3 
      ? 'Not enough data to learn patterns' 
      : 'Gets expensive fast, energy costs pile up';

    // Update simp-maxing card
    document.getElementById('p33-simp-score').textContent = `${simpScore}/100`;
    document.getElementById('p33-simp-bar').style.width = `${simpScore}%`;
    document.getElementById('p33-simp-best').textContent = interp >= 7 
      ? 'Your situation (need explanations)' 
      : 'You need to understand how it works';
    document.getElementById('p33-simp-limit').textContent = interp >= 7 
      ? 'Hard to define "simple" precisely' 
      : 'Can be too rigid for messy real-world problems';

    // Update w-maxing card
    document.getElementById('p33-w-score').textContent = `${wScore}/100`;
    document.getElementById('p33-w-bar').style.width = `${wScore}%`;
    document.getElementById('p33-w-best').textContent = (compute <= 3 || data <= 3) 
      ? 'Your situation (limited resources)' 
      : 'Unexpected situations, not much data';
    document.getElementById('p33-w-limit').textContent = wScore >= 80 
      ? 'Still experimental, fewer tools available' 
      : 'Research is still figuring this out';

    // Update insight text based on best approach
    const sorted = [
      { key: 'scale', score: scaleScore },
      { key: 'simp', score: simpScore },
      { key: 'w', score: wScore }
    ].sort((a, b) => b.score - a.score);

    let insight = '';
    const labels = {
      scale: 'throwing resources at it',
      simp: 'keeping it simple',
      w: 'better adaptation'
    };
    
    if (sorted[0].score - sorted[1].score < 15) {
      insight = `Your situation calls for mixing strategies—no single approach is clearly best. The best AI systems (like AlphaGo) already do this: they combine ${labels[sorted[0].key]} with ${labels[sorted[1].key]} to get capabilities that neither delivers alone.`;
    } else if (sorted[0].key === 'scale') {
      insight = `<strong>Throwing more resources at it</strong> fits your situation, but watch out for diminishing returns. GPT-4 style scaling gets expensive fast and still struggles with unusual cases. Consider mixing in simpler designs or adaptation tricks to make deployment cheaper.`;
    } else if (sorted[0].key === 'simp') {
      insight = `<strong>Simpler designs</strong> match your need for explanations. Just remember: what counts as "simple" depends on perspective. Combining simple rule-based systems with pattern recognition often gives you both accuracy and explainability.`;
    } else {
      insight = `<strong>Better adaptation</strong> fits your constraints perfectly. Research shows systems designed to adapt well can generalize 2-5x better than just making things simpler. Think about how living organisms handle surprises—that's the model here.`;
    }

    document.getElementById('p33-insight').innerHTML = `💡 ${insight}`;

    // Update tools
    els.tools.innerHTML = problem.tools.map((tool, i) => `
      <div class="flex gap-2">
        <span class="text-xs font-semibold panel-muted flex-shrink-0">${i + 1}.</span>
        <div class="flex-1">
          <p class="text-xs font-semibold text-heading">${tool.name}</p>
          <p class="text-xs panel-muted">${tool.why}</p>
        </div>
      </div>
    `).join('');

    // Update bottlenecks
    els.bottlenecks.innerHTML = problem.bottlenecks.map(bottleneck => `
      <div class="flex gap-2">
        <span class="text-xs" aria-hidden="true">⚠️</span>
        <p class="text-xs text-body">${bottleneck}</p>
      </div>
    `).join('');
  }

  function attachListeners(els) {
    els.problemType.addEventListener('change', () => updateRecommendation(els));
    els.computeSlider.addEventListener('input', () => {
      updateSliderLabels(els);
      updateRecommendation(els);
    });
    els.dataSlider.addEventListener('input', () => {
      updateSliderLabels(els);
      updateRecommendation(els);
    });
    els.interpSlider.addEventListener('input', () => {
      updateSliderLabels(els);
      updateRecommendation(els);
    });
  }

  function init() {
    const els = getElements();
    if (!els.problemType) return;

    updateSliderLabels(els);
    updateRecommendation(els);
    attachListeners(els);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { init };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interactiveScript };
}

// Auto-initialize
if (typeof window !== 'undefined') {
  interactiveScript();
}
