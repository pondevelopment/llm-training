(function () {
  'use strict';

  const ARCHES = {
    sas: {
      name: 'Single agent',
      detail: 'One agent (no coordination)',
      overheadPct: 0,
      efficiency: 0.466,
      errorAmp: 1.0,
      successRate: 0.466,
      successPer1k: 67.7
    },
    independent: {
      name: 'Independent agents (ensemble)',
      detail: 'Multiple agents, combine at the end',
      overheadPct: 58,
      efficiency: 0.234,
      errorAmp: 17.2,
      successRate: 0.370,
      successPer1k: 42.4
    },
    decentralized: {
      name: 'Peer debate (decentralized)',
      detail: 'Agents debate/vote as peers',
      overheadPct: 263,
      efficiency: 0.132,
      errorAmp: 7.8,
      successRate: 0.477,
      successPer1k: 23.9
    },
    centralized: {
      name: 'Orchestrator (centralized)',
      detail: 'One lead agent coordinates sub-agents',
      overheadPct: 285,
      efficiency: 0.120,
      errorAmp: 4.4,
      successRate: 0.463,
      successPer1k: 21.5
    },
    hybrid: {
      name: 'Hybrid',
      detail: 'Mix of debate + orchestration',
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
    const veryLowBaseline = baseline < 0.2;
    const lowBaseline = baseline < 0.3;

    if (taskStructure === 'sequential') {
      return {
        key: 'sas',
        tag: 'Prefer single agent',
        primary:
          'Start with a single agent. Multi-agent variants often degrade on sequential, state-dependent planning.',
        why:
          'Sequential interdependence means coordination fragments context under fixed budgets; the paper reports consistent multi-agent degradation on PlanCraft (a step-by-step planning benchmark).',
        caveat:
          'If you still trial multi-agent here, treat it as a debugging aid (diverse hypotheses), not a performance scaler—and cap team size.'
      };
    }

    // Independent ensemble: low-overhead diversity when baseline is very low.
    // This is included as an exploratory option; the paper shows high error amplification for independent ensembles.
    if (veryLowBaseline && !toolHeavy && (taskStructure === 'parallel' || taskStructure === 'dynamic')) {
      return {
        key: 'independent',
        tag: 'Try independent ensemble',
        primary:
          'If your baseline is very low, independent agents can be a pragmatic way to get diverse attempts with limited coordination overhead.',
        why:
          'Independent ensembles have much lower overhead than debate/orchestration, but they can amplify errors substantially in the paper’s results.',
        caveat:
          'Exploration preset: included to show the low-overhead diversity option. Use strict checks and avoid for high-stakes outputs. If you can afford more coordination, prefer peer debate or an orchestrator for better control.'
      };
    }

    // Tool-heavy workflows are a special case in the paper’s selection rules: even with high single-agent baselines,
    // decentralized coordination can be favored because parallelization/redundancy outweigh efficiency losses.
    if (taskStructure === 'toolheavy') {
      if (!toolHeavy) {
        return {
          key: 'sas',
          tag: 'Prefer single agent',
          primary:
            'With a low tool count, start with a single agent—coordination is unlikely to pay off here.',
          why:
            'This “IT automation” option is meant for workflows that touch many systems/tools. If you only expect a handful of tools, the coordination tax can outweigh benefits under fixed budgets.',
          caveat:
            'If the work is actually parallel research/synthesis, switch the task type accordingly. If it’s step-by-step state changes, treat it as sequential and keep it single-agent.'
        };
      }
      return {
        key: 'decentralized',
        tag: 'Try peer debate (tool-heavy)',
        primary:
          'For tool-heavy workflows, try peer debate (decentralized) when you can parallelize independent tool work and reconcile results.',
        why:
          'The paper’s selection example favors decentralized coordination for tool-heavy tasks (high tool count) despite high overhead, because parallelization and redundancy can outweigh efficiency losses.',
        caveat:
          baselineSaturated
            ? 'Even then, expect small wins: when single-agent success is already high (~45%+), coordination often has diminishing returns. Measure cost/latency and keep the protocol lightweight.'
            : 'Keep coordination lightweight and cap team size—overhead grows quickly and can crowd out “doing the work” tokens under fixed budgets.'
      };
    }

    if (baselineSaturated) {
      return {
        key: 'sas',
        tag: 'Prefer single agent',
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
        tag: 'Try orchestrator',
        primary:
          'Try centralized coordination (orchestrator + sub-agents) when the task decomposes cleanly into parallel subtasks.',
        why:
          'In the paper, Finance-Agent shows the strongest gains under centralized coordination (+80.8% vs single-agent), consistent with parallelizable research/synthesis.',
        caveat:
          toolHeavy
            ? 'Tool-heavy decompositions can still suffer from coordination tax. Keep sub-agent scopes tight (one tool cluster each) and monitor overhead.'
            : 'Keep the orchestrator role focused on verification + synthesis; avoid long back-and-forth rounds.'
      };
    }

    if (taskStructure === 'dynamic') {
      if (lowBaseline && toolCount <= 8) {
        return {
          key: 'hybrid',
          tag: 'Try hybrid',
          primary:
            'If you can afford the overhead, hybrid coordination can combine exploration with more structured synthesis/checking.',
          why:
            'Hybrid adds extra coordination layers compared to pure peer debate; it can help when you need both diverse exploration and stronger reconciliation.',
          caveat:
            'Exploration preset: included to surface the highest-overhead coordination style. Hybrid is expensive. Start with peer debate first if latency/cost is important.'
        };
      }
      return {
        key: 'decentralized',
        tag: 'Try peer debate',
        primary:
          'Try decentralized coordination (peer debate + voting) for dynamic exploration tasks like browsing/navigation.',
        why:
          'The paper reports decentralized coordination performing best on BrowseComp-Plus (+9.2% vs single-agent) where exploration benefits from diverse paths.',
        caveat:
          'Cap team size and watch diminishing returns—more messages eventually saturate and add latency without improving success.'
      };
    }

    return {
      key: 'sas',
      tag: 'Prefer single agent',
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
        const chipClass = isHighlight ? 'chip chip-success' : 'chip chip-neutral';

        return `
          <div class="${panelClass} p-3">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-start gap-2">
                  <div class="text-sm font-semibold text-heading leading-snug">${arch.name}</div>
                  <span class="${chipClass} text-xs whitespace-nowrap">Overhead ${arch.overheadPct}%</span>
                </div>
                <div class="text-xs panel-muted mt-1">${arch.detail || ''}</div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="text-xs panel-muted">
                  <div class="whitespace-nowrap">Success (avg)</div>
                  <div class="font-mono">${(arch.successRate * 100).toFixed(1)}%</div>
                </div>
                <div class="text-xs panel-muted">
                  <div class="whitespace-nowrap">Error amp</div>
                  <div class="font-mono">${arch.errorAmp.toFixed(1)}×</div>
                </div>
                <div class="text-xs panel-muted">
                  <div class="whitespace-nowrap">Success / 1k</div>
                  <div class="font-mono">${arch.successPer1k.toFixed(1)}</div>
                </div>
              </div>
            </div>
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

    const presetIndependent = getEl('p63-preset-independent');
    const presetHybrid = getEl('p63-preset-hybrid');

    if (!taskStructureEl || !baselineEl || !toolCountEl) return;

    taskStructureEl.addEventListener('change', updateUI);
    baselineEl.addEventListener('input', updateUI);
    toolCountEl.addEventListener('input', updateUI);

    if (presetIndependent) {
      presetIndependent.addEventListener('click', () => {
        taskStructureEl.value = 'parallel';
        baselineEl.value = '10';
        toolCountEl.value = '6';
        updateUI();
      });
    }

    if (presetHybrid) {
      presetHybrid.addEventListener('click', () => {
        taskStructureEl.value = 'dynamic';
        baselineEl.value = '25';
        toolCountEl.value = '6';
        updateUI();
      });
    }

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
