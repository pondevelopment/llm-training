const interactiveScript = () => {
  const $ = (id) => document.getElementById(id);

  const logitsSelect = $("q53-logits");
  const temp = $("q53-temp");
  const topk = $("q53-topk");
  const topp = $("q53-topp");
  const typical = $("q53-typical");
  const table = $("q53-table");
  const resultBox = $("q53-result");
  const explain = $("q53-explain");
  const contextText = $("q53-context-text");
  const contextTokens = $("q53-context-tokens");
  const contextNote = $("q53-context-note");

  if (!logitsSelect || !temp || !topk || !topp || !typical || !table || !resultBox || !explain) {
    return;
  }

  const scenarios = [
    {
      id: 'moderate',
      label: 'Moderately peaked',
      logits: [3.2, 2.8, 1.4, 0.2, -1.0],
      context: 'The chef seasoned the soup with a touch of ___.',
      completion: 'The chef seasoned the soup with a touch of {token}.',
      tokens: ['salt', 'pepper', 'herbs', 'sugar', 'source code'],
      note: 'High-probability tokens are ingredients; tail tokens drift off-topic.'
    },
    {
      id: 'near-tie',
      label: 'Near tie triple',
      logits: [2.5, 2.4, 2.3, 0.1, -0.5],
      context: 'She booked a weekend ___ near the lake.',
      completion: 'She booked a weekend {token} near the lake.',
      tokens: ['cabin', 'cottage', 'hotel', 'spaceship', 'refund'],
      note: 'Several plausible holiday nouns compete closely before tailing off.'
    },
    {
      id: 'single-winner',
      label: 'Strong single winner',
      logits: [5.0, 1.2, 0.5, -0.3, -1.0],
      context: 'The athlete broke the ___ record.',
      completion: 'The athlete broke the {token} record.',
      tokens: ['world', 'school', 'personal', 'paper', 'index'],
      note: 'One clear best answer with sharp drop-off to the rest.'
    },
    {
      id: 'almost-flat',
      label: 'Almost flat',
      logits: [0.3, 0.2, 0.1, 0.0, -0.1],
      context: 'Brainstorming the agenda produced several ___.',
      completion: 'Brainstorming the agenda produced several {token}.',
      tokens: ['ideas', 'topics', 'options', 'notes', 'paths'],
      note: 'Nearly uniform probabilities — any of the tokens might appear.'
    },
    {
      id: 'contrast',
      label: 'High contrast spread',
      logits: [4.0, 0.0, -1.0, -3.0, -6.0],
      context: 'For dessert they served a slice of ___.',
      completion: 'For dessert they served a slice of {token}.',
      tokens: ['cake', 'bread', 'cheese', 'asphalt', 'null'],
      note: 'Distribution collapses quickly after the first choice.'
    },
    {
      id: 'linear',
      label: 'Linear decay',
      logits: [2.0, 1.0, 0.0, -1.0, -2.0],
      context: 'Battery life readings dropped to ___.',
      completion: 'Battery life readings dropped to {token}.',
      tokens: ['50%', '40%', '30%', '20%', '10%'],
      note: 'Gradual decline — each lower token still plausible but less likely.'
    },
    {
      id: 'tie-pair',
      label: 'Exact tie pair',
      logits: [1.5, 1.5, -0.2, -0.8, -1.2],
      context: 'Should we brew ___ to stay warm?',
      completion: 'Should we brew {token} to stay warm?',
      tokens: ['tea', 'coffee', 'water', 'juice', 'broccoli'],
      note: 'Top two tokens tie; sampling will break the tie stochastically.'
    },
    {
      id: 'extreme-outlier',
      label: 'Extreme outlier',
      logits: [7.0, 1.0, 0.8, 0.2, -2.0],
      context: 'The answer to 2 + 2 is ___.',
      completion: 'The answer to 2 + 2 is {token}.',
      tokens: ['4', '5', '3', '22', '0'],
      note: 'One dominant token with several clearly incorrect distractors.'
    }
  ];

  const scenarioMap = new Map(scenarios.map((scenario) => [scenario.id, scenario]));

  if (logitsSelect.options.length !== scenarios.length) {
    logitsSelect.innerHTML = scenarios
      .map((scenario) => `<option value="${scenario.id}">${scenario.label}</option>`)
      .join('');
  }

  if (!scenarioMap.has(logitsSelect.value)) {
    logitsSelect.value = scenarios[0]?.id ?? '';
  }

  const tempVal = $("q53-temp-val");
  const topkVal = $("q53-topk-val");
  const toppVal = $("q53-topp-val");
  const typicalVal = $("q53-typical-val");
  const modeInputs = Array.from(document.querySelectorAll('input[name="q53-mode"]'));

  const getScenario = () => scenarioMap.get(logitsSelect.value) ?? scenarios[0];

  const renderContextTokens = (scenario, highlightSet = new Set()) => {
    if (!contextTokens) return;
    if (!scenario || !Array.isArray(scenario.tokens)) {
      contextTokens.innerHTML = '';
      return;
    }
    const chips = scenario.tokens.map((token, index) => {
      const activeClass = highlightSet.has(index) ? ' q53-tokenchip--active' : '';
      return `<span class="q53-tokenchip${activeClass}" data-index="${index}">${token}</span>`;
    });
    contextTokens.innerHTML = chips.join('');
  };

  const parseLogits = () => {
    const scenario = getScenario();
    return { scenario, logits: Array.isArray(scenario?.logits) ? scenario.logits : [] };
  };

  const softmax = (arr, temperature) => {
    const maxVal = Math.max(...arr);
    const exps = arr.map((logit) => Math.exp((logit - maxVal) / temperature));
    const denom = exps.reduce((sum, value) => sum + value, 0);
    return exps.map((value) => value / denom);
  };

  const entropy = (distribution) =>
    -distribution.reduce((sum, value) => sum + (value > 0 ? value * Math.log(value) : 0), 0);

  const choose = (distribution) => {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < distribution.length; i += 1) {
      cumulative += distribution[i];
      if (r <= cumulative) return i;
    }
    return distribution.length - 1;
  };

  const fmt = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(3)}`;
  const pct = (value) => `${(value * 100).toFixed(1)}%`;

  const renderTable = (scenario, raw, probs, highlight = []) => {
    const maxProb = Math.max(...probs, Number.EPSILON);
    const highlightSet = new Set(highlight);

    const rows = raw
      .map((logit, index) => {
        const probability = probs[index] ?? 0;
        const width = Math.max(0, Math.round((probability / maxProb) * 100));
        const probabilityLabel = pct(probability);
        const isActive = highlightSet.has(index);
        const rowClass = isActive ? ' q53-keyrow--active' : '';
        const valueClass = isActive ? ' q53-keyvalue--active' : '';
        const tokenLabel = scenario?.tokens?.[index] ?? `Token ${index}`;

        return `
          <div class="q53-keyrow${rowClass}" role="listitem">
            <div class="q53-keyrow-head">
              <div class="q53-keylabel">
                <span class="q53-keytoken">${tokenLabel}</span>
                <span class="q53-keymeta">token ${index} · logit <span class="q53-keylogit">${fmt(logit)}</span></span>
              </div>
              <div class="q53-keyvalue${valueClass}">
                <span class="q53-keyprob">${probabilityLabel}</span>
                <span class="q53-keycaption">Probability</span>
              </div>
            </div>
            <div class="q53-bar" style="--q53-bar:${width}%" role="img" aria-label="Token ${index} probability ${probabilityLabel}">
              <div class="q53-bar-fill${isActive ? ' q53-bar-fill--active' : ''}" aria-hidden="true"></div>
            </div>
          </div>
        `;
      })
      .join('');

    renderContextTokens(scenario, highlightSet);

    table.innerHTML = `
      <div class="q53-keylist" role="list" aria-label="Token probabilities">
        ${rows}
      </div>
      <p class="small-caption text-muted mt-3">
        Bars scale to the highest probability; highlighted rows show the candidate pool for the current sampler.
      </p>
    `;
  };

  const compute = () => {
    tempVal.textContent = Number(temp.value).toFixed(1);
    topkVal.textContent = topk.value;
    toppVal.textContent = Number(topp.value).toFixed(2);
    typicalVal.textContent = Number(typical.value).toFixed(1);

    const { scenario, logits } = parseLogits();

    if (contextText) {
      contextText.textContent = scenario?.context ?? '';
    }
    if (contextNote) {
      contextNote.textContent = scenario?.note ?? '';
    }
    if (scenario) {
      renderContextTokens(scenario, new Set());
    }

    if (!logits.length) {
      table.innerHTML = '<div class="text-sm text-warning">Enter at least one numeric logit.</div>';
      return { scenario, raw: logits, probs: [] };
    }

    const probs = softmax(logits, Number(temp.value));
    renderTable(scenario, logits, probs, []);
    return { scenario, raw: logits, probs };
  };

  const strategyExplain = (mode, meta) => {
    switch (mode) {
      case 'greedy':
        return 'Greedy picks the argmax token — deterministic, fastest, but least diverse.';
      case 'topk':
        return `Top-k keeps the ${meta?.k ?? ''} highest probability tokens then samples — truncates the tail.`;
      case 'topp':
        return `Nucleus keeps the smallest prefix whose cumulative probability ≥ ${(meta?.p ?? 0).toFixed(2)} — adaptive set size.`;
      case 'typical':
        return `Typical sampling keeps tokens with information content near entropy H ≈ ${(meta?.H ?? 0).toFixed(3)} — removes both very predictable and extremely rare tokens.`;
      default:
        return '';
    }
  };

  const applyStrategy = (mode, raw, probs) => {
    if (!probs.length) return undefined;

    if (mode === 'greedy') {
      const maxIndex = probs.indexOf(Math.max(...probs));
      return { candidateIdx: [maxIndex], sampled: maxIndex, meta: {} };
    }

    if (mode === 'topk') {
      const k = Math.min(Number(topk.value), probs.length);
      const sorted = probs
        .map((value, index) => [value, index])
        .sort((a, b) => b[0] - a[0])
        .slice(0, k);
      const candidateIdx = sorted.map(([, index]) => index);
      const restricted = candidateIdx.map((index) => probs[index]);
      const total = restricted.reduce((sum, value) => sum + value, 0);
      const normalised = restricted.map((value) => value / total);
      const sampled = candidateIdx[choose(normalised)];
      return { candidateIdx, sampled, meta: { k } };
    }

    if (mode === 'topp') {
      const target = Number(topp.value);
      const sorted = probs
        .map((value, index) => [value, index])
        .sort((a, b) => b[0] - a[0]);
      const candidateIdx = [];
      let cumulative = 0;
      for (const [value, index] of sorted) {
        candidateIdx.push(index);
        cumulative += value;
        if (cumulative >= target) break;
      }
      const restricted = candidateIdx.map((index) => probs[index]);
      const total = restricted.reduce((sum, value) => sum + value, 0);
      const normalised = restricted.map((value) => value / total);
      const sampled = candidateIdx[choose(normalised)];
      return { candidateIdx, sampled, meta: { p: target } };
    }

    if (mode === 'typical') {
      const tau = Number(typical.value);
      const H = entropy(probs);
      const info = probs.map((prob) => Math.abs(-Math.log(prob) - H));
      const ordered = info.map((value, index) => [value, index]).sort((a, b) => a[0] - b[0]);
      const candidateIdx = [];
      let mass = 0;
      for (const [, index] of ordered) {
        candidateIdx.push(index);
        mass += probs[index];
        if (mass >= tau) break;
      }
      const restricted = candidateIdx.map((index) => probs[index]);
      const total = restricted.reduce((sum, value) => sum + value, 0);
      const normalised = restricted.map((value) => value / total);
      const sampled = candidateIdx[choose(normalised)];
      return { candidateIdx, sampled, meta: { H } };
    }

    return { candidateIdx: [], sampled: null, meta: {} };
  };

  const run = () => {
    const { scenario, raw, probs } = compute();
    const mode = modeInputs.find((input) => input.checked)?.value ?? 'greedy';
    const outcome = applyStrategy(mode, raw, probs) ?? { candidateIdx: [], sampled: null, meta: {} };

    renderTable(scenario, raw, probs, outcome.candidateIdx);

    if (outcome.sampled != null) {
      const chosenToken = scenario?.tokens?.[outcome.sampled] ?? `token ${outcome.sampled}`;
      const completionLine = scenario?.completion?.replace('{token}', chosenToken) ?? '';
      resultBox.innerHTML = `
        <div class="q53-result-tokenline">
          <span class="q53-result-label">Chosen token</span>
          <span class="q53-result-token">${chosenToken}</span>
          <span class="q53-result-index">(#${outcome.sampled})</span>
        </div>
        ${completionLine ? `<p class="q53-result-sentence">${completionLine}</p>` : ''}
      `;
    } else {
      resultBox.textContent = '—';
    }

    explain.textContent = strategyExplain(mode, {
      ...outcome.meta,
      k: Number(topk.value),
      p: Number(topp.value),
    });
  };

  [logitsSelect, temp, topk, topp, typical].forEach((element) => {
    element.addEventListener('input', () => run());
  });

  modeInputs.forEach((input) => {
    input.addEventListener('change', () => run());
  });

  $("q53-sample")?.addEventListener('click', (event) => {
    event.preventDefault();
    run();
  });

  $("q53-reset")?.addEventListener('click', () => {
    logitsSelect.selectedIndex = 0;
    temp.value = '1.0';
    topk.value = '3';
    topp.value = '0.9';
    typical.value = '1.0';
    run();
  });

  run();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question53Interactive = interactiveScript;
}
