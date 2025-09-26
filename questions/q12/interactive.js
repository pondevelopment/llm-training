const interactiveScript = () => {
  const contexts = [
    "The mysterious door opened to reveal",
    "The cat sat on the",
    "In the future, artificial intelligence will",
    "The scientist made a groundbreaking",
    "Once upon a time, in a distant",
    "The weather forecast predicted"
  ];

  const vocabularyDatabase = {
    0: [
      { token: "a", probability: 0.25 },
      { token: "an", probability: 0.15 },
      { token: "the", probability: 0.12 },
      { token: "nothing", probability: 0.08 },
      { token: "something", probability: 0.07 },
      { token: "darkness", probability: 0.06 },
      { token: "light", probability: 0.05 },
      { token: "treasure", probability: 0.04 },
      { token: "secrets", probability: 0.03 },
      { token: "ancient", probability: 0.03 },
      { token: "hidden", probability: 0.025 },
      { token: "magical", probability: 0.025 },
      { token: "forbidden", probability: 0.02 },
      { token: "golden", probability: 0.02 },
      { token: "mysterious", probability: 0.015 },
      { token: "strange", probability: 0.015 },
      { token: "beautiful", probability: 0.01 },
      { token: "terrible", probability: 0.01 },
      { token: "wonderful", probability: 0.008 },
      { token: "frightening", probability: 0.008 }
    ],
    1: [
      { token: "mat", probability: 0.35 },
      { token: "chair", probability: 0.2 },
      { token: "table", probability: 0.15 },
      { token: "floor", probability: 0.1 },
      { token: "bed", probability: 0.08 },
      { token: "couch", probability: 0.05 },
      { token: "windowsill", probability: 0.03 },
      { token: "keyboard", probability: 0.02 },
      { token: "roof", probability: 0.015 },
      { token: "fence", probability: 0.005 }
    ],
    2: [
      { token: "revolutionize", probability: 0.18 },
      { token: "transform", probability: 0.15 },
      { token: "help", probability: 0.12 },
      { token: "assist", probability: 0.1 },
      { token: "change", probability: 0.08 },
      { token: "improve", probability: 0.07 },
      { token: "enhance", probability: 0.06 },
      { token: "replace", probability: 0.05 },
      { token: "automate", probability: 0.04 },
      { token: "solve", probability: 0.04 },
      { token: "create", probability: 0.03 },
      { token: "enable", probability: 0.03 },
      { token: "optimize", probability: 0.025 },
      { token: "accelerate", probability: 0.02 },
      { token: "dominate", probability: 0.015 },
      { token: "eliminate", probability: 0.01 }
    ],
    3: [
      { token: "discovery", probability: 0.4 },
      { token: "breakthrough", probability: 0.25 },
      { token: "finding", probability: 0.15 },
      { token: "invention", probability: 0.1 },
      { token: "observation", probability: 0.05 },
      { token: "theory", probability: 0.03 },
      { token: "hypothesis", probability: 0.015 },
      { token: "experiment", probability: 0.005 }
    ],
    4: [
      { token: "land", probability: 0.3 },
      { token: "kingdom", probability: 0.25 },
      { token: "galaxy", probability: 0.15 },
      { token: "world", probability: 0.12 },
      { token: "planet", probability: 0.08 },
      { token: "place", probability: 0.05 },
      { token: "realm", probability: 0.025 },
      { token: "universe", probability: 0.02 },
      { token: "dimension", probability: 0.015 },
      { token: "future", probability: 0.01 }
    ],
    5: [
      { token: "rain", probability: 0.35 },
      { token: "snow", probability: 0.2 },
      { token: "storms", probability: 0.15 },
      { token: "sunshine", probability: 0.12 },
      { token: "clouds", probability: 0.08 },
      { token: "wind", probability: 0.05 },
      { token: "fog", probability: 0.03 },
      { token: "hail", probability: 0.015 },
      { token: "thunder", probability: 0.005 }
    ]
  };

  const configData = {
    topk: {
      name: "Top-k Sampling",
      description: "Selects from the k most probable tokens, providing controlled diversity",
      chipClass: "chip-success",
      tone: "emerald"
    },
    topp: {
      name: "Top-p Sampling (Nucleus)",
      description: "Dynamic selection based on cumulative probability mass",
      chipClass: "chip-accent",
      tone: "purple"
    },
    greedy: {
      name: "Greedy Decoding",
      description: "Always selects the most probable token for deterministic output",
      chipClass: "chip-warning",
      tone: "amber"
    }
  };

  const contextInput = document.getElementById("q12-context-input");
  const output = document.getElementById("q12-output");
  const strategyRadios = document.querySelectorAll("input[name='q12-strategy']");
  const strategyIndicator = document.getElementById("q12-strategy-indicator");
  const legend = document.getElementById("q12-legend");
  const explanation = document.getElementById("q12-explanation");
  const kValue = document.getElementById("q12-k-value");
  const pValue = document.getElementById("q12-p-value");
  const kDisplay = document.getElementById("q12-k-display");
  const pDisplay = document.getElementById("q12-p-display");
  const tempValue = document.getElementById("q12-temp-value");
  const tempDisplay = document.getElementById("q12-temp-display");
  const topkControls = document.getElementById("q12-topk-controls");
  const toppControls = document.getElementById("q12-topp-controls");

  if (!contextInput || !output) {
    console.error("Required DOM elements not found for Question 12");
    return;
  }

  const getCurrentStrategy = () => {
    const selectedRadio = document.querySelector("input[name='q12-strategy']:checked");
    return selectedRadio ? selectedRadio.value : "topk";
  };

  const getVocabularyForContext = (context) => {
    const contextIndex = contexts.indexOf(context);
    if (contextIndex !== -1) {
      return vocabularyDatabase[contextIndex] || [];
    }
    return vocabularyDatabase[0];
  };

  const applySampling = (vocabulary, strategy, k, p, tau) => {
    const safe = vocabulary.map((t) => ({ token: t.token, probability: Math.max(t.probability, 1e-12) }));
    const power = !tau || Math.abs(tau - 1.0) < 1e-6 ? 1.0 : 1.0 / tau;
    const powered = safe.map((t) => ({ token: t.token, probability: t.probability ** power }));
    const normalizer = powered.reduce((sum, t) => sum + t.probability, 0) || 1;
    const adjusted = powered.map((t) => ({ token: t.token, probability: t.probability / normalizer }));
    const sorted = adjusted.sort((a, b) => b.probability - a.probability);

    if (strategy === "topk") {
      return sorted.slice(0, Math.max(1, k));
    }

    if (strategy === "topp") {
      const result = [];
      let cumulative = 0;
      for (const token of sorted) {
        cumulative += token.probability;
        result.push(token);
        if (cumulative >= p) break;
      }
      return result;
    }

    return sorted.length ? [sorted[0]] : [];
  };

  const updateControlsVisibility = () => {
    const strategy = getCurrentStrategy();
    if (topkControls) {
      topkControls.style.display = strategy === "topk" ? "block" : "none";
      topkControls.setAttribute("aria-hidden", strategy === "topk" ? "false" : "true");
    }
    if (toppControls) {
      toppControls.style.display = strategy === "topp" ? "block" : "none";
      toppControls.setAttribute("aria-hidden", strategy === "topp" ? "false" : "true");
    }
  };

  const updateParameterDisplays = () => {
    if (kDisplay && kValue) kDisplay.textContent = kValue.value;
    if (pDisplay && pValue) pDisplay.textContent = parseFloat(pValue.value).toFixed(2);
    if (tempDisplay && tempValue) tempDisplay.textContent = parseFloat(tempValue.value).toFixed(1);
  };

  const setStrategyIndicator = (strategy) => {
    if (!strategyIndicator) return;
    const config = configData[strategy] || configData.topk;
    strategyIndicator.className = `chip ${config.chipClass} text-xs`;
    strategyIndicator.textContent = config.name;
  };

  const updateStrategyVisuals = () => {
    const current = getCurrentStrategy();
    document.querySelectorAll(".q12-card").forEach((card) => {
      const label = card.closest("label");
      const radio = label ? label.querySelector("input[name='q12-strategy']") : null;
      const isActive = radio && radio.value === current;
      if (isActive) {
        card.setAttribute("data-active", "true");
      } else {
        card.removeAttribute("data-active");
      }
    });
  };

  const updateExplanation = (strategy, tokens, k, p) => {
    if (!explanation) return;
    if (!tokens || tokens.length === 0) {
      explanation.innerHTML = "Choose a sampling strategy above to see how it affects token selection and text generation quality.";
      return;
    }

    const percentages = tokens.map((t) => t.probability * 100);
    const maxProb = Math.max(...percentages);
    const minProb = Math.min(...percentages);
    const totalMass = percentages.reduce((sum, value) => sum + value, 0);

    const explanations = {
      topk: `
        <strong>Top-k Sampling (k=${k}):</strong> Selects exactly ${k} most probable tokens for random sampling.
        <br>• <strong>Consistent diversity:</strong> always considers the same number of options
        <br>• <strong>Simple implementation:</strong> sort tokens by probability, take top ${k}
        <br>• <strong>Risk:</strong> may include very low-probability tokens when k is large
        <br>• <strong>Current selection:</strong> ${tokens.length} tokens spanning ${minProb.toFixed(1)}%–${maxProb.toFixed(1)}%
      `,
      topp: `
        <strong>Top-p Sampling (p=${p.toFixed(2)}):</strong> Dynamically selects tokens until ${(totalMass).toFixed(1)}% cumulative probability is reached.
        <br>• <strong>Context-adaptive:</strong> more tokens for uncertain contexts, fewer for confident ones
        <br>• <strong>Quality focus:</strong> automatically excludes very low-probability tokens
        <br>• <strong>Flexibility:</strong> vocabulary size adapts to the probability distribution
        <br>• <strong>Current selection:</strong> ${tokens.length} tokens covering ${(totalMass).toFixed(1)}% probability mass
      `,
      greedy: `
        <strong>Greedy Decoding:</strong> Always selects the single most probable token.
        <br>• <strong>Deterministic:</strong> same input always produces the same output
        <br>• <strong>Fast:</strong> no random sampling computation needed
        <br>• <strong>Limitation:</strong> can produce repetitive or overly predictable text
        <br>• <strong>Current selection:</strong> "${tokens[0]?.token}" at ${percentages[0].toFixed(1)}% probability
      `
    };

    explanation.innerHTML = explanations[strategy] || "";
  };

  const processAndDisplay = () => {
    const selectedOption = contextInput.options[contextInput.selectedIndex];
    const context = selectedOption ? selectedOption.text : "";
    const strategy = getCurrentStrategy();
    const k = kValue ? parseInt(kValue.value, 10) : 0;
    const p = pValue ? parseFloat(pValue.value) : 0;
    const tau = tempValue ? parseFloat(tempValue.value || "1.0") : 1.0;

    setStrategyIndicator(strategy);
    updateControlsVisibility();

    if (!context) {
      if (legend) legend.innerHTML = "";
      output.innerHTML = '<div class="q12-output-empty text-sm text-muted text-center py-8">Enter a context above to see how each strategy filters the token pool.</div>';
      updateExplanation(strategy, [], k, p);
      return;
    }

    const fullVocabulary = getVocabularyForContext(context);
    const sampledTokens = applySampling(fullVocabulary, strategy, k, p, tau);

    output.innerHTML = "";

    const contextEl = document.createElement("div");
    contextEl.className = "q12-context panel panel-info panel-emphasis p-3 space-y-1";
    contextEl.innerHTML = `
      <span class="small-caption text-muted-soft uppercase tracking-wider">Context</span>
      <div class="text-sm font-medium text-heading">"${context}"</div>
    `;
    output.appendChild(contextEl);

    const tokenNote = document.createElement("p");
    tokenNote.className = "small-caption panel-muted italic";
    tokenNote.innerHTML = "Note: In production LLMs a <strong>token</strong> is usually a subword piece. One word can map to multiple tokens. This demo shows whole words for clarity.";
    output.appendChild(tokenNote);

    const tokensContainer = document.createElement("div");
    tokensContainer.className = "space-y-3";

    let headerText = "";
    if (strategy === "topk") {
      headerText = `Top-${k} tokens selected for sampling (τ=${tau.toFixed(1)}):`;
    } else if (strategy === "topp") {
      const totalProb = sampledTokens.reduce((sum, token) => sum + token.probability, 0);
      headerText = `Tokens covering ${(totalProb * 100).toFixed(1)}% probability mass (p=${p.toFixed(2)}, τ=${tau.toFixed(1)}):`;
    } else {
      headerText = `Most probable token selected (τ=${tau.toFixed(1)}):`;
    }

    const headerEl = document.createElement("div");
    headerEl.className = "q12-token-header flex flex-wrap items-center justify-between gap-2 text-sm text-heading";
    headerEl.innerHTML = `
      <span>${headerText}</span>
      <span class="chip chip-neutral text-xs">${sampledTokens.length} token${sampledTokens.length !== 1 ? "s" : ""}</span>
    `;
    tokensContainer.appendChild(headerEl);

    const tokensGrid = document.createElement("div");
    tokensGrid.className = "q12-token-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2";

    sampledTokens.forEach((token, index) => {
      const tokenEl = document.createElement("div");
      tokenEl.className = "q12-token";

      const probPercent = token.probability * 100;
      let bucket = "very-low";
      if (probPercent >= 20) bucket = "high";
      else if (probPercent >= 10) bucket = "medium";
      else if (probPercent >= 5) bucket = "low";
      tokenEl.classList.add(`q12-token--${bucket}`);

      tokenEl.innerHTML = `
        <div class="q12-token-term">"${token.token}"</div>
        <div class="q12-token-meta">
          <span class="q12-token-value">${probPercent.toFixed(2)}%</span>
          <span class="q12-token-rank">Rank ${index + 1}</span>
        </div>
      `;
      tokenEl.title = `Token: "${token.token}" • Probability: ${probPercent.toFixed(2)}% • Rank: ${index + 1}`;
      tokensGrid.appendChild(tokenEl);
    });

    tokensContainer.appendChild(tokensGrid);

    const totalProb = sampledTokens.reduce((sum, token) => sum + token.probability, 0);
    const avgProb = sampledTokens.length ? totalProb / sampledTokens.length : 0;
    const maxProb = sampledTokens.length ? Math.max(...sampledTokens.map((t) => t.probability)) : 0;

    const statsEl = document.createElement("div");
    statsEl.className = "q12-stat-grid";
    statsEl.innerHTML = `
      <div class="q12-metric" data-tone="emerald">
        <span class="q12-metric-value">${sampledTokens.length}</span>
        <span class="q12-metric-label">Candidates</span>
      </div>
      <div class="q12-metric" data-tone="emerald">
        <span class="q12-metric-value">${(totalProb * 100).toFixed(1)}%</span>
        <span class="q12-metric-label">Total Prob</span>
      </div>
      <div class="q12-metric" data-tone="indigo">
        <span class="q12-metric-value">${(avgProb * 100).toFixed(1)}%</span>
        <span class="q12-metric-label">Avg Prob</span>
      </div>
      <div class="q12-metric" data-tone="amber">
        <span class="q12-metric-value">${(maxProb * 100).toFixed(1)}%</span>
        <span class="q12-metric-label">Max Prob</span>
      </div>
    `;
    tokensContainer.appendChild(statsEl);
    output.appendChild(tokensContainer);

    if (legend) {
      legend.innerHTML = `
        <div class="q12-legend-note">Token ≈ subword piece (demo uses whole words for clarity)</div>
        <div class="q12-legend-scale">
          <div class="q12-legend-item"><span class="q12-legend-swatch q12-legend-swatch--high"></span><span>High prob (≥20%)</span></div>
          <div class="q12-legend-item"><span class="q12-legend-swatch q12-legend-swatch--medium"></span><span>Medium (10–20%)</span></div>
          <div class="q12-legend-item"><span class="q12-legend-swatch q12-legend-swatch--low"></span><span>Low (5–10%)</span></div>
          <div class="q12-legend-item"><span class="q12-legend-swatch q12-legend-swatch--very-low"></span><span>Very low (&lt;5%)</span></div>
        </div>
      `;
    }

    updateExplanation(strategy, sampledTokens, k, p);
  };

  contextInput.addEventListener("change", processAndDisplay);

  strategyRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateStrategyVisuals();
      setStrategyIndicator(getCurrentStrategy());
      updateControlsVisibility();
      processAndDisplay();
    });
  });

  if (kValue) {
    kValue.addEventListener("input", () => {
      updateParameterDisplays();
      if (getCurrentStrategy() === "topk") {
        processAndDisplay();
      }
    });
  }

  if (pValue) {
    pValue.addEventListener("input", () => {
      updateParameterDisplays();
      if (getCurrentStrategy() === "topp") {
        processAndDisplay();
      }
    });
  }

  if (tempValue) {
    tempValue.addEventListener("input", () => {
      updateParameterDisplays();
      processAndDisplay();
    });
  }

  updateParameterDisplays();
  updateStrategyVisuals();
  setStrategyIndicator(getCurrentStrategy());
  updateControlsVisibility();
  processAndDisplay();
};

if (typeof module !== "undefined") {
  module.exports = interactiveScript;
} else if (typeof window !== "undefined") {
  window.question12Interactive = interactiveScript;
}

