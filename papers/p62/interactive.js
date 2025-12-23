(function () {
  'use strict';

  function el(id) {
    return document.getElementById(id);
  }

  const STAGES = {
    pre: {
      label: 'Pre-deployment harms',
      summary:
        'Risks that enter the system before you ship anything: training data privacy/consent problems, environmental and resource costs, and labor/economic harms in the development pipeline. These issues can seed downstream failures that are hard to fully “patch” later.',
      examples: [
        'Sensitive data memorization and leakage risk from training corpora',
        'Copyright/licensing uncertainty for scraped text',
        'Data annotation exploitation and harmful content review exposure',
        'Compute/resource inequality (who can train and who can’t)',
        'Carbon/water footprint and hardware supply-chain impacts'
      ],
      metrics: [
        'PII exposure rate in corpora (sampling + red-team extraction tests)',
        'Dataset provenance coverage (what % has explicit licensing metadata)',
        'Content review workload indicators (rotation, exposure, support)',
        'Training/inference energy and water estimates (tracked over time)',
        'Deletion/opt-out responsiveness (time-to-propagate removal)'
      ],
      mitigations: {
        technical: [
          'Up-front data governance: provenance tagging, PII scanning, opt-out handling, and reproducible dataset inventories.',
          'Privacy-aware training and evaluation: memorization probes, extraction red-teams, and targeted retraining/erasure where feasible.'
        ],
        governance: [
          'Clear policies for licensing/consent and documentation (dataset statements, model cards).',
          'Operational safeguards for human workers (exposure controls, support, fair compensation).'
        ]
      }
    },
    output: {
      label: 'Direct output harms',
      summary:
        'Harms produced at generation time: representational harms (stereotypes, marginalization), content harms (toxicity, misinformation, privacy-violating outputs), and quality/reliability failures (hallucination, inconsistency, overconfidence).',
      examples: [
        'Stereotyped or biased portrayals of demographic groups',
        'Toxic or hateful content in certain languages or dialects',
        'Misinformation in high-stakes answers (e.g., medical guidance)',
        'Hallucinated citations, fabricated facts, confident wrongness',
        'Inconsistent answers across equivalent prompts'
      ],
      metrics: [
        'Bias/toxicity audits across languages and dialects (not English-only)',
        'Hallucination rate on your workloads (with and without retrieval)',
        'Calibration gap: confidence vs empirical correctness',
        'Consistency tests: rephrase prompts and measure answer stability',
        'Leakage checks: prompts designed to elicit PII'
      ],
      mitigations: {
        technical: [
          'Layer safety at inference: policy filters, refusal behavior, and guarded tool/data access (least privilege).',
          'Improve reliability with retrieval + citation discipline where appropriate, and measure hallucinations continuously.'
        ],
        governance: [
          'Define “acceptable error” by domain and route risky intents to humans.',
          'Maintain an incident process for recurring output failures (triage → fix → regression tests).'
        ]
      }
    },
    misuse: {
      label: 'Misuse & malicious application harms',
      summary:
        'Harms when adversaries intentionally weaponize LLMs: generating harmful content at scale, enabling deception (fraud, phishing), and exploiting security weaknesses (prompt injection, data exfiltration, poisoning/backdoors).',
      examples: [
        'Scam/phishing message generation tuned for persuasion',
        'Prompt injection to override tool policies or leak secrets',
        'Jailbreak tactics and adversarial prompt suffixes',
        'Data extraction attempts against models and RAG pipelines',
        'Poisoning/open-weight backdoors triggered by hidden tokens'
      ],
      metrics: [
        'Jailbreak success rate under red-team suites (tracked per release)',
        'Prompt-injection resilience for tool-using agents (action denial rate)',
        'Secrets/data exfiltration tests for connected systems',
        'Abuse telemetry: suspicious prompting patterns and anomaly detection',
        'Mean time to detect and mitigate new attack patterns'
      ],
      mitigations: {
        technical: [
          'Security-by-construction for agents: least privilege, complete mediation, defense-in-depth around tools and data.',
          'Ongoing red-teaming and adversarial testing; treat attacks as evolving, not solved.'
        ],
        governance: [
          'Abuse monitoring and response playbooks (rate limits, blocks, reporting).',
          'Clear acceptable-use boundaries and escalation paths for suspected malicious use.'
        ]
      }
    },
    systemic: {
      label: 'Societal & systemic harms',
      summary:
        'Macro-level impacts: labor displacement and inequality, manipulation of public discourse and elections, and power/access concentration driven by compute and infrastructure control.',
      examples: [
        'Job displacement / deskilling pressure in exposed roles',
        'Information ecosystem dilution and coordinated persuasion at scale',
        'Unequal access to compute and model capabilities (compute divide)',
        'Concentration of AI development in a small set of firms',
        'Neglect of low-resource languages and communities'
      ],
      metrics: [
        'Workforce impact indicators for deployed tools (task shifts, quality of work)',
        'Abuse/coordination signals at platform level (bot-like activity, amplification)',
        'Coverage across languages/regions (who the model serves well)',
        'Transparency metrics (disclosures, changelogs, reporting completeness)',
        'Incident reporting volume and resolution quality over time'
      ],
      mitigations: {
        technical: [
          'Transparency infrastructure: changelogs, reporting hooks, model/system cards that stay updated.',
          'Evaluation that spans communities/languages to avoid “average-case” blind spots.'
        ],
        governance: [
          'Governance levers: incident reporting, audit readiness, and clarity on accountability.',
          'Policy engagement on compute and access inequities when relevant to your deployment context.'
        ]
      }
    },
    downstream: {
      label: 'Downstream application harms',
      summary:
        'Harms when LLMs are embedded in real workflows, especially high-stakes domains. Even small error rates can become unacceptable when decisions affect health, liberty, money, or education outcomes.',
      examples: [
        'Clinical decision support mistakes or hallucinated contraindications',
        'Financial advice with fabricated filings or incorrect tickers',
        'Bias amplification in criminal justice writing or summarization',
        'Academic integrity breakdown and “thinking atrophy” risks',
        'IP leakage and devaluation in creative/professional work'
      ],
      metrics: [
        'Domain-specific error taxonomy and audit sampling (per workflow)',
        'Human override/appeal rates and reasons (when the model is ignored)',
        'Latency-to-correction: time between user report and mitigation',
        'Quality drift across updates (regressions and new failure modes)',
        'Safety gating effectiveness (what % risky requests are blocked)'
      ],
      mitigations: {
        technical: [
          'Guardrails at integration points: tool restrictions, retrieval constraints, and output verification where possible.',
          'Monitoring + rollback: treat model changes like production releases with regression tests.'
        ],
        governance: [
          'Define “no-go” zones: cases where you do not deploy until reliability is proven.',
          'User training and UI design that prevent over-trust (clarify limits, encourage verification).'
        ]
      }
    }
  };

  const SCENARIOS = {
    support: {
      label: 'Customer support agent (tool-using)',
      stageKey: 'misuse',
      lensDefault: 'prevalence',
      secondary: ['output'],
      mapping:
        'Mostly: misuse & malicious application (prompt injection, data exfiltration) + direct output reliability (hallucinations, biased tone).'
    },
    healthcare: {
      label: 'Healthcare summarizer / clinician copilot',
      stageKey: 'downstream',
      lensDefault: 'severity',
      secondary: ['output'],
      mapping:
        'Mostly: downstream application harms (high-stakes decisions) + direct output reliability (hallucinations and overconfidence).'
    },
    marketing: {
      label: 'Marketing / content studio',
      stageKey: 'output',
      lensDefault: 'balanced',
      secondary: ['pre'],
      mapping:
        'Mostly: direct output harms (misinformation, stereotyping, brand safety) + pre-deployment concerns (licensing/provenance).'
    },
    hr: {
      label: 'HR / recruiting assistant',
      stageKey: 'downstream',
      lensDefault: 'balanced',
      secondary: ['systemic', 'output'],
      mapping:
        'Mostly: downstream harms (bias in decisions) + systemic concerns (inequality) + direct output bias.'
    }
  };

  let currentScenarioKey = 'support';

  function getScenarioKeyFromDOM() {
    const container = el('p62-scenarios');
    if (!container) return currentScenarioKey;
    const selected = container.querySelector('[data-selected="true"]');
    const key = selected?.getAttribute('data-scenario');
    return key && SCENARIOS[key] ? key : currentScenarioKey;
  }

  function applyScenarioSelection(key) {
    if (!SCENARIOS[key]) return;
    currentScenarioKey = key;

    const container = el('p62-scenarios');
    if (container) {
      container.querySelectorAll('button[data-scenario]').forEach(btn => {
        const isSelected = btn.getAttribute('data-scenario') === key;
        btn.setAttribute('data-selected', isSelected ? 'true' : 'false');
        btn.classList.toggle('panel-info', isSelected);
        btn.classList.toggle('panel-neutral-soft', !isSelected);

        const selectedEl = btn.querySelector('[data-role="selected"]');
        if (selectedEl) {
          selectedEl.setAttribute('aria-hidden', isSelected ? 'false' : 'true');
          selectedEl.textContent = isSelected ? 'Selected' : '';
        }
      });
    }

    const mappingEl = el('p62-scenario-mapping');
    if (mappingEl) {
      mappingEl.textContent = SCENARIOS[key].mapping;
    }

    const lensSelect = el('p62-lens');
    if (lensSelect) {
      lensSelect.value = SCENARIOS[key].lensDefault;
    }
  }

  function renderMitigations(stageKey, lensKey) {
    const stage = STAGES[stageKey] || STAGES.output;

    const posture =
      lensKey === 'severity'
        ? {
            title: 'Catastrophic posture',
            blurb:
              'Optimize for preventing rare-but-severe failures. Use stricter gating and treat any severe miss as an incident with a post-mortem and regression tests.'
          }
        : lensKey === 'prevalence'
          ? {
              title: 'Chronic posture',
              blurb:
                'Optimize for reducing everyday error rates. Use telemetry/sampling, trend monitoring, and UX that prevents over-trust at scale.'
            }
          : {
              title: 'Balanced posture',
              blurb:
                'Optimize for both. Maintain an incident log for severe events and prevalence metrics for day-to-day quality (two dashboards).' 
            };

    const blocks = [
      lensKey === 'severity'
        ? {
            title: 'What changes in practice',
            bullets: [
              'Gate deployment in critical domains until reliability is demonstrated (or keep a human as final decision-maker).',
              'Use incident-style monitoring: treat each severe failure as a post-mortem with regression tests.',
              'Prefer sandboxed tool use and strict privilege boundaries for agentic systems.'
            ]
          }
        : null,
      lensKey === 'prevalence'
        ? {
            title: 'What changes in practice',
            bullets: [
              'Instrument telemetry to estimate how often users see hallucinations/bias in your real workflows.',
              'Treat quality drift as a product metric (weekly trend review), not a one-off evaluation.',
              'Focus on UX + literacy: reduce over-trust and make verification the default.'
            ]
          }
        : null,
      lensKey === 'balanced'
        ? {
            title: 'What changes in practice',
            bullets: [
              'Maintain two dashboards: (1) incident log for severe events, (2) prevalence metrics from sampling/telemetry.',
              'Schedule recurring red-teams and refresh eval suites as threats and contexts evolve.',
              'Define ownership: each harm class needs an accountable team and escalation path.'
            ]
          }
        : null
    ].filter(Boolean);

    const parts = [];

    parts.push(
      `<div class="panel panel-neutral-soft p-3 space-y-2">` +
        `<div class="text-xs font-semibold text-heading">${escapeHtml(posture.title)}</div>` +
        `<div class="text-xs panel-muted">${escapeHtml(posture.blurb)}</div>` +
        `</div>`
    );

    parts.push(
      `<div class="panel panel-neutral-soft p-3 space-y-2">` +
        `<div class="text-xs font-semibold text-heading">Technical layers</div>` +
        `<ul class="list-disc ml-5 space-y-1 text-xs text-body">${stage.mitigations.technical
          .map(item => `<li>${escapeHtml(item)}</li>`)
          .join('')}</ul>` +
        `</div>`
    );

    parts.push(
      `<div class="panel panel-neutral-soft p-3 space-y-2">` +
        `<div class="text-xs font-semibold text-heading">Governance layers</div>` +
        `<ul class="list-disc ml-5 space-y-1 text-xs text-body">${stage.mitigations.governance
          .map(item => `<li>${escapeHtml(item)}</li>`)
          .join('')}</ul>` +
        `</div>`
    );

    blocks.forEach(block => {
      parts.push(
        `<div class="panel panel-neutral-soft p-3 space-y-2">` +
          `<div class="text-xs font-semibold text-heading">${escapeHtml(block.title)}</div>` +
          `<ul class="list-disc ml-5 space-y-1 text-xs text-body">${block.bullets
            .map(item => `<li>${escapeHtml(item)}</li>`)
            .join('')}</ul>` +
          `</div>`
      );
    });

    return parts.join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function updateUI() {
    const lensSelect = el('p62-lens');

    const stageLabel = el('p62-stage-label');
    const postureLabel = el('p62-posture-label');
    const summary = el('p62-summary');
    const examples = el('p62-examples');
    const metrics = el('p62-metrics');
    const mitigations = el('p62-mitigations');

    if (!lensSelect || !stageLabel || !summary || !examples || !metrics || !mitigations) {
      return;
    }

    const scenarioKey = getScenarioKeyFromDOM();
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.support;
    const stageKey = scenario.stageKey;
    const lensKey = lensSelect.value;
    const stage = STAGES[stageKey] || STAGES.output;

    stageLabel.textContent = stage.label;

    if (postureLabel) {
      postureLabel.textContent =
        lensKey === 'severity' ? 'Catastrophic' : lensKey === 'prevalence' ? 'Chronic' : 'Balanced';
    }
    summary.textContent = stage.summary;

    examples.innerHTML = stage.examples.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    metrics.innerHTML = stage.metrics.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    mitigations.innerHTML = renderMitigations(stageKey, lensKey);

    window.MathJax?.typesetPromise?.([el('p62-explorer')]).catch(() => {});
  }

  function init() {
    const root = el('p62-explorer');
    if (!root) {
      return;
    }
    const lensSelect = el('p62-lens');

    const scenarios = el('p62-scenarios');
    if (scenarios) {
      scenarios.querySelectorAll('button[data-scenario]').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-scenario');
          if (!key) return;
          applyScenarioSelection(key);
          updateUI();
        });
      });
    }

    lensSelect?.addEventListener('change', updateUI);

    applyScenarioSelection(currentScenarioKey);
    updateUI();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
