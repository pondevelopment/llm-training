const interactiveScript = () => {
  const root = document.getElementById('p21-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p21-scenario');
  const analysisInput = document.getElementById('p21-analysis');
  const analysisDisplay = document.getElementById('p21-analysis-display');
  const promptInput = document.getElementById('p21-prompt');
  const promptLabel = document.getElementById('p21-prompt-label');
  const crossToggle = document.getElementById('p21-cross');
  const proofToggle = document.getElementById('p21-proofcheck');
  const casToggle = document.getElementById('p21-cas');

  const readinessMetric = document.getElementById('p21-readiness');
  const reviewMetric = document.getElementById('p21-review');
  const riskMetric = document.getElementById('p21-risk');
  const problemsContainer = document.getElementById('p21-problems');
  const narrativeEl = document.getElementById('p21-narrative');
  const actionsEl = document.getElementById('p21-actions');

  if (
    !scenarioSelect ||
    !analysisInput ||
    !analysisDisplay ||
    !promptInput ||
    !promptLabel ||
    !crossToggle ||
    !proofToggle ||
    !casToggle ||
    !readinessMetric ||
    !reviewMetric ||
    !riskMetric ||
    !problemsContainer ||
    !narrativeEl ||
    !actionsEl
  ) {
    return;
  }

  const promptLevels = ['None', 'Light', 'Structured', 'Checklist'];

  const presets = {
    baseline: { analysis: 1200, prompt: 1, cross: false, proof: false, cas: false },
    prompting: { analysis: 1800, prompt: 2, cross: true, proof: false, cas: false },
    toolchain: { analysis: 2600, prompt: 3, cross: true, proof: true, cas: true }
  };

  const problems = [
    {
      key: 'p1',
      title: 'Problem 1 • Monotone + non-monotone DR-submodular mix',
      base: 0.6,
      weights: { tokens: 0.18, prompt: 0.12, cas: 0.08, proof: 0.02 },
      notes: {
        pass: 'Frank-Wolfe variant stays intact; only light human polishing needed.',
        partial: 'The outline appears but the non-monotone term still needs manual bounding.',
        fail: 'Model cannot keep the monotone and non-monotone arguments aligned without guidance.'
      }
    },
    {
      key: 'p2',
      title: 'Problem 2 • Weak-submodular curvature guarantee',
      base: 0.68,
      weights: { tokens: 0.15, prompt: 0.2, cas: 0.08 },
      notes: {
        pass: 'Likely to recreate or sharpen the approximation bound, mirroring the paper result.',
        partial: 'Gets close but still misstates constants; reviewers must audit the guarantee.',
        fail: 'Falls back to restating the conjecture without a working bound.'
      }
    },
    {
      key: 'p3',
      title: 'Problem 3 • Multilinear relaxation rounding tweak',
      base: 0.55,
      weights: { tokens: 0.25, prompt: 0.15, cas: 0.08 },
      notes: {
        pass: 'Proof sketch covers the rounding argument cleanly.',
        partial: 'Outline is right but key inequalities are still hand-wavy.',
        fail: 'Proof misses the relaxation coupling and diverges from the intended approach.'
      }
    },
    {
      key: 'p4',
      title: 'Problem 4 • Cross-paper synthesis (matroid + DR mix)',
      base: 0.25,
      weights: { tokens: 0.2, prompt: 0.1, cas: 0.05, cross: 0.35 },
      crossPenalty: 0.25,
      notes: {
        pass: 'With cross-paper retrieval plus careful human checks, the model can stitch lemmas correctly.',
        partial: 'Captures components from both sources but misapplies one key dependency.',
        fail: 'Still collapses - proof reuses lemmas without checking new assumptions.'
      }
    },
    {
      key: 'p5',
      title: 'Problem 5 • Harder weak-submodular matroid intersection',
      base: 0.32,
      weights: { tokens: 0.2, prompt: 0.07, cas: 0.18, proof: 0.18, cross: 0.05 },
      crossPenalty: 0.05,
      notes: {
        pass: 'Sustained analysis plus tooling yields a defensible guarantee.',
        partial: 'Algorithm is right but the analysis still leaks; expect heavy human fixes.',
        fail: "Model repeats the authors' experience: polished narrative, no valid bound."
      }
    }
  ];

  const statusStyles = {
    pass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    partial: 'border-amber-200 bg-amber-50 text-amber-800',
    fail: 'border-rose-200 bg-rose-50 text-rose-800'
  };

  const formatStatus = score => {
    if (score >= 0.75) return 'pass';
    if (score >= 0.45) return 'partial';
    return 'fail';
  };

  const applyPreset = key => {
    const preset = presets[key] || presets.baseline;
    analysisInput.value = preset.analysis;
    promptInput.value = preset.prompt;
    crossToggle.checked = preset.cross;
    proofToggle.checked = preset.proof;
    casToggle.checked = preset.cas;
    render();
  };

  const clamp01 = value => Math.min(Math.max(value, 0), 1);

  const render = () => {
    const analysisTokens = Number(analysisInput.value);
    const promptLevel = Number(promptInput.value);
    const cross = crossToggle.checked;
    const proof = proofToggle.checked;
    const cas = casToggle.checked;

    const tokenScale = clamp01((analysisTokens - 500) / 3500);
    const promptScale = clamp01(promptLevel / 3);

    analysisDisplay.textContent = analysisTokens.toString();
    promptLabel.textContent = promptLevels[promptLevel] || promptLevels[0];

    const scores = problems.map(problem => {
      let score = problem.base;
      score += (problem.weights.tokens || 0) * tokenScale;
      score += (problem.weights.prompt || 0) * promptScale;
      score += (problem.weights.cross || 0) * (cross ? 1 : 0);
      score += (problem.weights.cas || 0) * (cas ? 1 : 0);
      score += (problem.weights.proof || 0) * (proof ? 1 : 0);
      if (!cross && problem.crossPenalty) {
        score -= problem.crossPenalty;
      }
      return clamp01(score);
    });

    const statuses = scores.map(formatStatus);

    const readiness = clamp01(scores.reduce((sum, value) => sum + value, 0) / problems.length);
    const passCount = statuses.filter(status => status === 'pass').length;
    const partialCount = statuses.filter(status => status === 'partial').length;
    const failCount = problems.length - passCount - partialCount;

    readinessMetric.textContent = Math.round(readiness * 100) + '%';

    if (failCount) {
      reviewMetric.textContent = failCount + '/5 proofs need full human reconstruction';
    } else if (partialCount) {
      reviewMetric.textContent = partialCount + '/5 proofs need targeted edits';
    } else {
      reviewMetric.textContent = 'Spot-check only';
    }

    let riskLabel;
    if (!proof && (partialCount + failCount) >= 2) {
      riskLabel = 'High (no automated checks)';
    } else if (!proof && passCount >= 3) {
      riskLabel = 'Elevated (looks correct, still unchecked)';
    } else if (proof && (partialCount || failCount)) {
      riskLabel = 'Managed (tool flags remaining gaps)';
    } else {
      riskLabel = proof ? 'Low (proof checker engaged)' : 'Moderate';
    }
    riskMetric.textContent = riskLabel;

    const problemCards = problems.map((problem, index) => {
      const status = statuses[index];
      const style = statusStyles[status] || statusStyles.partial;
      const note = problem.notes[status];
      const scoreLabel = Math.round(scores[index] * 100) + '%';
      return [
        '<article class="border rounded-lg p-3 space-y-2 ' + style + '">',
        '  <header class="space-y-1">',
        '    <div class="flex items-center justify-between gap-2">',
        '      <h4 class="text-sm font-semibold">' + problem.title + '</h4>',
        '      <span class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full bg-white/70 text-current">' + status.toUpperCase() + '</span>',
        '    </div>',
        '    <p class="text-xs opacity-80">Confidence: ' + scoreLabel + '</p>',
        '  </header>',
        '  <p class="text-sm leading-snug">' + note + '</p>',
        '</article>'
      ].join('');
    });
    problemsContainer.innerHTML = problemCards.join('');

    const narrative = [];
    const promptDescriptor = promptLevels[promptLevel] || promptLevels[0];
    narrative.push('At ' + analysisTokens + ' reasoning tokens with ' + promptDescriptor + ' prompt support, GPT-5 is projected to deliver ' + passCount + '/5 dependable proofs.');
    if (!proof) {
      narrative.push('Without an automated checker, false confidence risk stays elevated - manual reviewers must parse every inequality.');
    } else {
      narrative.push('Proof checking trims the review load to the few residual gaps where the tool still raises alarms.');
    }
    if (cross) {
      narrative.push('Cross-paper retrieval narrows the Problem 4 gap but still leaves dependencies that humans must validate.');
    } else {
      narrative.push('Problem 4 remains blocked because cross-paper lemmas never combine; expect a polished but wrong argument.');
    }
    if (cas) {
      narrative.push("Symbolic tooling resolves fragile algebra in Problems 1-3, echoing the authors' observation that most gaps were computational.");
    } else {
      narrative.push("Keeping symbolic math disabled replicates the paper's setup: expect to hand-verify algebraic simplifications.");
    }
    narrativeEl.innerHTML = narrative.map(sentence => '<p>' + sentence + '</p>').join('');

    const actions = [];
    if (!cross) {
      actions.push('Wire up retrieval or citation planners so the model can cite both source papers mid-proof.');
    }
    if (!proof) {
      actions.push('Integrate a proof checker (Lean, Coq, Holstep, or algebraic verifiers) before accepting outputs.');
    }
    if (!cas && partialCount + failCount >= 2) {
      actions.push('Expose CAS or symbolic simplification helpers to stabilise delicate inequalities.');
    }
    if (analysisTokens < 1600 && failCount) {
      actions.push('Increase the analysis budget or split prompts so the model can finish longer derivations.');
    }
    if (!actions.length) {
      actions.push('Maintain the Godel Test regression suite and log each run to watch for regressions.');
    }
    actionsEl.innerHTML = actions.map(item => '<li>' + item + '</li>').join('');
  };

  scenarioSelect.addEventListener('change', event => applyPreset(event.target.value));
  analysisInput.addEventListener('input', render);
  promptInput.addEventListener('input', render);
  crossToggle.addEventListener('change', render);
  proofToggle.addEventListener('change', render);
  casToggle.addEventListener('change', render);

  applyPreset(scenarioSelect.value || 'baseline');
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}
