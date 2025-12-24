(function () {
  'use strict';

  const ARCHES = {
    sas: {
      name: 'Single agent (SAS)',
      tag: 'SAS',
      overheadPct: 0,
      efficiency: 0.466,
      errorAmp: 1.0,
      successRate: 0.466,
      successPer1k: 67.7
    },
    independent: {
      name: 'Independent (ensemble)',
      tag: 'MAS-Independent',
      overheadPct: 58,
      efficiency: 0.234,
      errorAmp: 17.2,
      successRate: 0.370,
      successPer1k: 42.4
    },
    decentralized: {
      name: 'Decentralized (peer debate)',
      tag: 'MAS-Decentralized',
      overheadPct: 263,
      efficiency: 0.132,
      errorAmp: 7.8,
      successRate: 0.477,
      successPer1k: 23.9
    },
    centralized: {
      name: 'Centralized (orchestrator)',
      tag: 'MAS-Centralized',
      overheadPct: 285,
      efficiency: 0.120,
      errorAmp: 4.4,
      successRate: 0.463,
      successPer1k: 21.5
    },
    hybrid: {
      name: 'Hybrid',
      tag: 'MAS-Hybrid',
      overheadPct: 515,
      efficiency: 0.074,
      errorAmp: 5.1,
      successRate: 0.452,
      successPer1k: 13.6
    }
  };

  const TASK_STRUCTURE_HELP = {
    parallel:
      'Example: an analyst memo where different agents can independently pull facts (market, filings, competitors) and one “lead” combines it into a final recommendation.',
    dynamic:
      'Example: helping a support rep by navigating multiple pages, clicking around, and extracting the right snippet; exploration diversity helps, but verification is harder.',
    sequential:
      'Example: a runbook where step 3 depends on step 2’s outcome (state changes). Splitting this across agents often adds coordination overhead without adding real progress.',
    toolheavy:
      'Example: a workflow that touches many tools/systems (tickets, logs, DB, CI). Extra coordination can crowd out the “doing the work” tokens, so keep coordination light.'
  };

  function getEl(id) {
    return document.getElementById(id);
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function pickRecommendation(taskStructure, baselinePct, toolCount) {
    const baseline = clamp(baselinePct, 0, 100) / 100;

    const baselineSaturated = baseline >= 0.45;
    const toolHeavy = toolCount >= 12;

    if (taskStructure === 'sequential') {
      return {
        key: 'sas',
        tag: 'Prefer SAS',
        primary:
          'Start with a single agent. Multi-agent variants often degrade on sequential, state-dependent planning.',
        why:
          'Sequential interdependence means coordination fragments context under fixed budgets; the paper reports consistent MAS degradation on PlanCraft.',
        caveat:
          'If you still trial MAS here, treat it as a debugging aid (diverse hypotheses), not a performance scaler—and cap team size.'
      };
    }

    if (baselineSaturated) {
      return {
        key: 'sas',
        tag: 'Prefer SAS',
        primary:
          'Start with a single agent. Coordination often has diminishing or negative returns once your baseline is already strong.',
        why:
          'The paper reports a capability saturation region around ~45% single-agent baselines where coordination costs outweigh gains under fixed budgets.',
        caveat:
          toolHeavy
            ? 'Exception case to consider: if the work is highly decomposable and tool-heavy, a decentralized team can sometimes improve coverage—but only if you can afford the overhead and you validate outcomes rigorously.'
            : 'If you add agents anyway, prefer centralized verification for high-risk outputs to contain error propagation.'
      };
    }

    if (taskStructure === 'parallel') {
      return {
        key: 'centralized',
        tag: 'Try Centralized',
        primary:
          'Try centralized coordination (orchestrator + sub-agents) when the task decomposes cleanly into parallel subtasks.',
        why:
          'In the paper, Finance-Agent shows the strongest gains under centralized coordination (+80.8% vs SAS), consistent with parallelizable research/synthesis.',
        caveat:
          toolHeavy
            ? 'Tool-heavy decompositions can still suffer from coordination tax. Keep sub-agent scopes tight (one tool cluster each) and monitor overhead.'
            : 'Keep the orchestrator role focused on verification + synthesis; avoid long back-and-forth rounds.'
      };
    }

    if (taskStructure === 'dynamic') {
      return {
        key: 'decentralized',
        tag: 'Try Decentralized',
        primary:
          'Try decentralized coordination (peer debate + voting) for dynamic exploration tasks like browsing/navigation.',
        why:
          'The paper reports decentralized coordination performing best on BrowseComp-Plus (+9.2% vs SAS) where exploration benefits from diverse paths.',
        caveat:
          'Cap team size and watch diminishing returns—more messages eventually saturate and add latency without improving success.'
      };
    }

    if (taskStructure === 'toolheavy') {
      return {
        key: 'decentralized',
        tag: 'Cautious MAS',
        primary:
          'Treat multi-agent as optional. If you trial MAS, start with decentralized and keep coordination lightweight.',
        why:
          'Tool-heavy tasks amplify coordination overhead and efficiency penalties; the paper finds a strong efficiency×tools trade-off (β̂≈−0.267).',
        caveat:
          'If your tool workflow is mostly sequential (step A unlocks step B), prefer SAS even at low baselines. MAS helps most when tool calls can be parallelized and then reconciled.'
      };
    }

    return {
      key: 'sas',
      tag: 'Prefer SAS',
      primary: 'Default to a single agent unless you have a clear decomposition plan.',
      why: 'Multi-agent gains are task-contingent and overhead grows quickly with team size.',
      caveat: 'When in doubt, measure baseline first and run a small A/B with matched budgets.'
    };
  }

  function renderArchitectureCards(container, highlightKey) {
    if (!container) return;

    const order = ['sas', 'centralized', 'decentralized', 'hybrid', 'independent'];

    container.innerHTML = order
      .map((key) => {
        const arch = ARCHES[key];
        const isHighlight = key === highlightKey;
        const panelClass = isHighlight ? 'panel panel-success' : 'panel panel-neutral';

        return `
          <div class="${panelClass} p-3 space-y-1">
            <div class="flex items-center justify-between gap-2">
              <div class="text-xs font-semibold text-heading">${arch.tag}</div>
              <div class="text-xs panel-muted">Overhead ${arch.overheadPct}%</div>
            </div>
            <div class="text-xs panel-muted">Success (avg): <span class="font-mono">${(arch.successRate * 100).toFixed(1)}%</span></div>
            <div class="text-xs panel-muted">Error amp: <span class="font-mono">${arch.errorAmp.toFixed(1)}×</span></div>
            <div class="text-xs panel-muted">Success / 1k toks: <span class="font-mono">${arch.successPer1k.toFixed(1)}</span></div>
          </div>
        `;
      })
      .join('');
  }

  function updateUI() {
    const root = getEl('p63-explorer');
    if (!root) return;

    const taskStructureEl = getEl('p63-task-structure');
    const baselineEl = getEl('p63-baseline');
    const toolCountEl = getEl('p63-tool-count');

    const baselineLabel = getEl('p63-baseline-label');
    const toolCountLabel = getEl('p63-tool-count-label');
    const taskHelp = getEl('p63-task-structure-help');

    const recoTag = getEl('p63-reco-tag');
    const primary = getEl('p63-primary');
    const why = getEl('p63-why');
    const caveat = getEl('p63-caveat');

    const archCards = getEl('p63-arch-cards');

    if (!taskStructureEl || !baselineEl || !toolCountEl) return;

    const baselinePct = parseInt(baselineEl.value, 10);
    const toolCount = parseInt(toolCountEl.value, 10);

    if (baselineLabel) baselineLabel.textContent = `${baselinePct}%`;
    if (toolCountLabel) toolCountLabel.textContent = `${toolCount}`;

    const taskKey = taskStructureEl.value;
    if (taskHelp) taskHelp.textContent = TASK_STRUCTURE_HELP[taskKey] || '';

    const reco = pickRecommendation(taskKey, baselinePct, toolCount);

    if (recoTag) {
      recoTag.textContent = reco.tag;
      recoTag.className = 'chip text-xs ' + (reco.key === 'sas' ? 'chip-neutral' : 'chip-success');
    }

    if (primary) primary.textContent = reco.primary;
    if (why) why.textContent = reco.why;
    if (caveat) caveat.textContent = reco.caveat;

    renderArchitectureCards(archCards, reco.key);
  }

  function init() {
    const root = getEl('p63-explorer');
    if (!root) return;

    const taskStructureEl = getEl('p63-task-structure');
    const baselineEl = getEl('p63-baseline');
    const toolCountEl = getEl('p63-tool-count');

    if (!taskStructureEl || !baselineEl || !toolCountEl) return;

    taskStructureEl.addEventListener('change', updateUI);
    baselineEl.addEventListener('input', updateUI);
    toolCountEl.addEventListener('input', updateUI);

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
