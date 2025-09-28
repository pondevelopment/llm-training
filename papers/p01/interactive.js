const interactiveScript = () => {
  const root = document.getElementById("p01-explorer");
  if (!root) return;

  const dimensionInput = document.getElementById("p01-dimension");
  const corpusInput = document.getElementById("p01-corpus");
  const kInput = document.getElementById("p01-k");
  const vectorsInput = document.getElementById("p01-vectors");
  const rerankerInput = document.getElementById("p01-reranker");
  const retentionInput = document.getElementById("p01-retention");

  const dimensionLabel = document.getElementById("p01-dimension-label");
  const corpusLabel = document.getElementById("p01-corpus-label");
  const kLabel = document.getElementById("p01-k-label");
  const vectorsLabel = document.getElementById("p01-vectors-label");
  const retentionLabel = document.getElementById("p01-retention-label");
  const effectiveLabel = document.getElementById("p01-effective-label");

  const representableEl = document.getElementById("p01-representable");
  const totalEl = document.getElementById("p01-total");
  const insightEl = document.getElementById("p01-insight");
  const coveragePercentEl = document.getElementById("p01-coverage-percent");
  const coverageBarEl = document.getElementById("p01-coverage-bar");
  const coverageNoteEl = document.getElementById("p01-coverage-note");
  const coverageSingleEl = document.getElementById("p01-coverage-single");
  const coverageMultiEl = document.getElementById("p01-coverage-multi");
  const coverageBoostEl = document.getElementById("p01-coverage-reranker");

  const scenarioSelect = document.getElementById("p01-sim-scenario");
  const scenarioDescEl = document.getElementById("p01-sim-scenario-desc");
  const simQueriesInput = document.getElementById("p01-sim-queries");
  const simQueriesLabel = document.getElementById("p01-sim-queries-label");
  const simRunBtn = document.getElementById("p01-sim-run");
  const simSummaryEl = document.getElementById("p01-sim-summary");
  const simTableEl = document.getElementById("p01-sim-table");

  const scenarios = {
    support: {
      label: "Customer support search",
      description: "Users file tickets about account access and billing. Relevant docs are short FAQs with different wording than the ticket text.",
      queries: [
        { name: "Password reset email never arrives", docs: ["Password reset FAQ", "Email deliverability checklist"], hint: "email deliverability" },
        { name: "Locked out after too many MFA retries", docs: ["Account lockout playbook", "Reset MFA token"] },
        { name: "Delete workspaces when staff leave", docs: ["Offboarding runbook", "Workspace archival policy"], hint: "workspace archival" },
        { name: "Monthly invoice missing VAT number", docs: ["Billing VAT guide", "Finance escalation SOP"] },
        { name: "Webhook retries keep failing", docs: ["Webhook retry logic", "API status dashboard"], hint: "retry logic" },
        { name: "Need to export chat transcripts", docs: ["Data export FAQ", "Retention settings"], hint: "data export" },
        { name: "Stop marketing emails for suspended users", docs: ["Lifecycle marketing controls", "User suppression list"] },
        { name: "Mobile push notifications delayed", docs: ["Push latency troubleshooting", "Regional outage tracker"] },
        { name: "Integrate SSO with Okta", docs: ["SSO setup guide", "Okta mapping reference"] },
        { name: "Restore accidentally deleted project", docs: ["Project recovery policy", "Soft delete retention window"] }
      ]
    },
    commerce: {
      label: "Product catalog discovery",
      description: "E-commerce shoppers phrase the same intent in different ways. Relevant documents are structured listings and buying guides.",
      queries: [
        { name: "Waterproof hiking backpack 30L", docs: ["TrailPack 30L specs", "Daypack buying guide"], hint: "30 liter" },
        { name: "Noise canceling buds for flights", docs: ["AeroQuiet earbuds", "Travel audio tips"], hint: "noise canceling" },
        { name: "Mid-century walnut coffee table", docs: ["Sven coffee table", "Mid-century living room lookbook"] },
        { name: "Refill pods for smart toothbrush", docs: ["SmartBrush pod 4-pack", "Auto-ship program"] },
        { name: "Cold brew maker under $80", docs: ["BrewMate cold brewer", "Coffee gift guide"] },
        { name: "Pet-safe houseplant bundle", docs: ["Pet friendly plant trio", "Toxic plants FAQ"], hint: "pet safe" },
        { name: "4K monitor with USB-C", docs: ["VisionPro 27''", "Monitor connectivity primer"] },
        { name: "Sustainable yoga mat", docs: ["EcoFlex mat", "Materials sustainability report"] },
        { name: "Beginner drone with camera", docs: ["SkyScout starter kit", "Drone regulations cheat sheet"] },
        { name: "Kids coding starter kit", docs: ["CodeCraft junior", "Parents buying checklist"] }
      ]
    },
    legal: {
      label: "Legal discovery triage",
      description: "Compliance teams search large archives for clauses and obligations. Relevant documents are long contracts and policy memos.",
      queries: [
        { name: "GDPR data processing obligations", docs: ["Master service agreement – Article 28 addendum", "European compliance memo"], hint: "GDPR article" },
        { name: "Termination for convenience clause", docs: ["Vendor contract template", "Termination playbook"], hint: "termination clause" },
        { name: "SaaS uptime commitments", docs: ["Service level agreement", "Uptime remediation policy"] },
        { name: "PII retention limits", docs: ["Data retention standard", "Deletion workflow"] },
        { name: "Subprocessor notification rules", docs: ["Subprocessor register", "Customer notification template"], hint: "subprocessor" },
        { name: "Export control restrictions", docs: ["Trade compliance memo", "Export checklist"] },
        { name: "Incident response timeframes", docs: ["Security incident playbook", "Regulatory reporting matrix"] },
        { name: "HIPAA business associate clauses", docs: ["Healthcare addendum", "PHI handling guideline"] },
        { name: "Insurance indemnity limits", docs: ["Master insurance policy", "Risk mitigation FAQ"] },
        { name: "Open-source license obligations", docs: ["OSS usage policy", "License compatibility chart"] }
      ]
    }
  };

  const scenarioKeys = Object.keys(scenarios);
  const defaultScenarioKey = scenarioKeys[0];
  if (scenarioSelect) {
    scenarioSelect.innerHTML = scenarioKeys.map(key => `<option value="${key}">${scenarios[key].label}</option>`).join('');
    scenarioSelect.value = defaultScenarioKey;
  }

  const getActiveScenario = () => {
    if (scenarioSelect && scenarios[scenarioSelect.value]) {
      return scenarios[scenarioSelect.value];
    }
    return scenarios[defaultScenarioKey];
  };

  const updateScenarioUI = () => {
    const scenario = getActiveScenario();
    if (scenarioDescEl) {
      scenarioDescEl.textContent = scenario.description;
    }
    if (simQueriesInput) {
      const previousValue = Number(simQueriesInput.value);
      simQueriesInput.max = scenario.queries.length;
      simQueriesInput.min = Math.min(5, scenario.queries.length);
      if (previousValue > scenario.queries.length) {
        simQueriesInput.value = scenario.queries.length;
      } else if (previousValue < simQueriesInput.min) {
        simQueriesInput.value = simQueriesInput.min;
      }
      simQueriesLabel.textContent = simQueriesInput.value;
    }
  };

  const MAX_N = 5000;
  const logFactorial = new Array(MAX_N + 1).fill(0);
  for (let i = 2; i <= MAX_N; i += 1) {
    logFactorial[i] = logFactorial[i - 1] + Math.log(i);
  }

  const logCombination = (n, k) => {
    if (!Number.isFinite(n) || !Number.isFinite(k) || k < 0 || k > n) {
      return -Infinity;
    }
    const nInt = Math.max(0, Math.round(n));
    const kInt = Math.max(0, Math.round(k));
    if (nInt > MAX_N) {
      return -Infinity;
    }
    return logFactorial[nInt] - logFactorial[kInt] - logFactorial[nInt - kInt];
  };

  const formatFromLog = (logValue) => {
    if (!Number.isFinite(logValue) || logValue === -Infinity) return "0";
    if (logValue < Math.log(1e6)) {
      return Math.round(Math.exp(logValue)).toLocaleString();
    }
    const exponent = Math.floor(logValue / Math.log(10));
    const mantissa = Math.exp(logValue - exponent * Math.log(10));
    return `${mantissa.toFixed(2)}e${exponent}`;
  };

  const formatPercent = (fraction) => {
    if (!Number.isFinite(fraction) || fraction <= 0) return "0%";
    const clamped = Math.min(1, Math.max(0, fraction));
    const decimals = clamped >= 0.1 ? 1 : 2;
    return `${(clamped * 100).toFixed(decimals)}%`;
  };

  let currentMetrics = {
    boostedCoverage: 0
  };

  const computeMetrics = () => {
    const d = Number(dimensionInput.value);
    const n = Number(corpusInput.value);
    const k = Number(kInput.value);
    const vectors = Number(vectorsInput.value);
    const retentionPct = Number(retentionInput.value);
    const reranker = Boolean(rerankerInput.checked);

    const retentionRatio = Math.max(0.01, retentionPct / 100);
    const effectiveDim = Math.max(1, d * retentionRatio);

    const valid = Number.isFinite(d) && d > 0 && Number.isFinite(k) && k > 0;
    const logRepresentable = valid ? k * Math.log(effectiveDim) : -Infinity;
    const logTotal = Number.isFinite(n) && n >= k && k >= 0 ? logCombination(n, k) : -Infinity;

    let coverageSingle = 0;
    if (Number.isFinite(logRepresentable) && Number.isFinite(logTotal) && logTotal !== -Infinity) {
      const logCoverage = Math.min(0, logRepresentable - logTotal);
      coverageSingle = Math.exp(logCoverage);
    }
    coverageSingle = Math.max(0, Math.min(coverageSingle, 1));

    const coverageMulti = Math.max(0, Math.min(1, coverageSingle * Math.max(1, vectors)));
    let boostedCoverage = coverageMulti;
    if (reranker) {
      const bonus = 0.15 * (1 - boostedCoverage);
      boostedCoverage = Math.min(1, boostedCoverage + bonus);
    }

    return {
      d,
      n,
      k,
      vectors,
      reranker,
      retentionPct,
      retentionRatio,
      effectiveDim,
      logRepresentable,
      logTotal,
      representableText: formatFromLog(logRepresentable),
      totalText: formatFromLog(logTotal),
      coverageSingle,
      coverageMulti,
      boostedCoverage
    };
  };

  const update = () => {
    const metrics = computeMetrics();
    currentMetrics = metrics;

    dimensionLabel.textContent = Number.isFinite(metrics.d) ? metrics.d.toString() : "—";
    corpusLabel.textContent = Number.isFinite(metrics.n) ? `${metrics.n.toLocaleString()} docs` : "—";
    kLabel.textContent = Number.isFinite(metrics.k) ? `k = ${metrics.k}` : "k = —";
    vectorsLabel.textContent = metrics.vectors.toString();
    retentionLabel.textContent = `${metrics.retentionPct}%`;
    effectiveLabel.textContent = Math.round(metrics.effectiveDim).toLocaleString();

    representableEl.textContent = metrics.representableText;
    totalEl.textContent = metrics.totalText;

    const boosted = metrics.boostedCoverage;
    coveragePercentEl.textContent = formatPercent(boosted);
    coverageBarEl.style.width = `${Math.round(boosted * 100)}%`;
    coveragePercentEl.classList.remove("text-info", "text-success", "text-warning", "text-danger");
    let barColor = "var(--tone-indigo-strong)";
    let percentClass = "text-danger";
    if (!Number.isFinite(boosted) || boosted <= 0) {
      percentClass = "text-info";
      barColor = "var(--tone-indigo-strong)";
    } else if (boosted >= 0.6) {
      percentClass = "text-success";
      barColor = "var(--tone-emerald-strong)";
    } else if (boosted >= 0.3) {
      percentClass = "text-warning";
      barColor = "var(--tone-amber-strong)";
    } else {
      percentClass = "text-danger";
      barColor = "var(--color-path-scaling-strong)";
    }
    coveragePercentEl.classList.add(percentClass);
    coverageBarEl.style.background = barColor;

    coverageSingleEl.textContent = formatPercent(metrics.coverageSingle);
    coverageMultiEl.textContent = formatPercent(metrics.coverageMulti);
    coverageBoostEl.textContent = formatPercent(boosted);

    let note;
    if (!Number.isFinite(metrics.boostedCoverage) || metrics.logTotal === -Infinity) {
      note = "Provide valid values for dimension, corpus size, and k to evaluate coverage.";
    } else if (boosted >= 0.6) {
      note = "Comfortable margin: this design should recover most relevant documents, even under LIMIT-style stress.";
    } else if (boosted >= 0.3) {
      note = "Caution: you are entering a risky regime. Multi-vector retrieval or rerankers are advisable.";
    } else {
      note = "Severe capacity cliff: a single-vector setup will miss many queries. Add more signals or restructure the index.";
    }
    coverageNoteEl.textContent = note;

    const coverageSingleText = formatPercent(metrics.coverageSingle);
    const coverageMultiText = formatPercent(metrics.coverageMulti);
    const boostedText = formatPercent(boosted);
    const vectorSuffix = metrics.vectors > 1 ? "s" : "";

    insightEl.innerHTML = `
      <h4 class="text-sm font-semibold text-heading mb-2">What this configuration implies</h4>
      <ul class="space-y-2 text-sm text-body">
        <li><strong>${coverageSingleText}</strong> of the k-way subsets are reachable with one vector per document.</li>
        <li><strong>${coverageMultiText}</strong> becomes reachable when you store ${metrics.vectors} vector${vectorSuffix} per document.</li>
        <li><strong>${boostedText}</strong> is the coverage after applying the reranker toggle${metrics.reranker ? "" : " (enable it to simulate a lexical reranker)"}.</li>
      </ul>
      <p class="text-xs text-muted mt-2">Doubling context length alone does not raise these ceilings—the effective embedding dimension drives capacity.</p>
    `;
  };

  const runSimulation = () => {
    const scenario = getActiveScenario();
    const requested = Number(simQueriesInput.value);
    const coverage = currentMetrics.boostedCoverage;

    if (!Number.isFinite(coverage) || coverage <= 0) {
      simSummaryEl.textContent = "Coverage is effectively zero. Adjust the design knobs above before running the simulator.";
      simTableEl.innerHTML = "";
      return;
    }

    const availableQueries = [...scenario.queries];
    const sampleSize = Math.min(requested, availableQueries.length);
    const sampled = [];
    for (let i = 0; i < sampleSize; i += 1) {
      const idx = Math.floor(Math.random() * availableQueries.length);
      sampled.push(availableQueries.splice(idx, 1)[0]);
    }

    let hits = 0;
    const rows = sampled.map((query, index) => {
      const hit = Math.random() < coverage;
      if (hit) hits += 1;
      const rowStyle = hit
        ? 'style="background: var(--swatch-emerald-50); border-color: var(--tone-emerald-border);"'
        : 'style="background: var(--swatch-rose-50); border-color: var(--color-path-scaling-border);"';
      const statusClass = hit ? "text-success" : "text-danger";
      const statusLabel = hit ? "retrieved" : "missed";
      const docs = query.docs.join(', ');
      const followup = hit ? '' : `<p class="mt-1 text-[11px] text-muted">Consider boosting terms like <span class="font-mono text-info">${(query.hint || query.name).toLowerCase()}</span> or adding metadata filters.</p>`;
      return `<div class="rounded-md px-3 py-2 text-xs text-body border border-divider" ${rowStyle}>
        <div class="flex items-center justify-between gap-2">
          <span class="font-semibold text-sm">${index + 1}. ${query.name}</span>
          <span class="font-semibold ${statusClass}">${statusLabel}</span>
        </div>
        <p class="mt-1 text-[11px] text-muted">Key docs: ${docs}</p>
        ${followup}
      </div>`;
    });

    const observed = sampleSize ? hits / sampleSize : 0;
    simSummaryEl.textContent = `${scenario.label}: observed recall ${formatPercent(observed)} (${hits}/${sampleSize}) • expected ${formatPercent(coverage)} with current settings.`;
    simTableEl.innerHTML = rows.join("");
  };

  dimensionInput.addEventListener("input", update);
  corpusInput.addEventListener("input", update);
  kInput.addEventListener("input", update);
  vectorsInput.addEventListener("input", update);
  rerankerInput.addEventListener("change", update);
  retentionInput.addEventListener("input", update);

  if (scenarioSelect) {
    scenarioSelect.addEventListener("change", () => {
      updateScenarioUI();
      simSummaryEl.textContent = "Run the simulator to see recall variance.";
      simTableEl.innerHTML = "";
    });
  }
  simQueriesInput.addEventListener("input", () => {
    simQueriesLabel.textContent = simQueriesInput.value;
  });
  simRunBtn.addEventListener("click", runSimulation);

  updateScenarioUI();
  update();
  simQueriesLabel.textContent = simQueriesInput.value;
};

if (typeof module !== "undefined") {
  module.exports = interactiveScript;
} else if (typeof window !== "undefined") {
  window.paper01Interactive = interactiveScript;
}
