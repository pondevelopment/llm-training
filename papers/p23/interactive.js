const interactiveScript = () => {
  const root = document.getElementById('p23-lab');
  if (!root) return;

  const sectorSelect = document.getElementById('p23-sector');
  const modelSelect = document.getElementById('p23-model');
  const effortInput = document.getElementById('p23-effort');
  const scaffoldToggle = document.getElementById('p23-scaffold');
  const judgeToggle = document.getElementById('p23-judge');
  const inspectToggle = document.getElementById('p23-inspect');

  const winrateEl = document.getElementById('p23-winrate');
  const timeEl = document.getElementById('p23-time');
  const oversightEl = document.getElementById('p23-oversight');
  const risksEl = document.getElementById('p23-risks');
  const summaryEl = document.getElementById('p23-summary');
  const actionsEl = document.getElementById('p23-actions');

  const baseline = {
    analysis: {
      gpt5: { win: 0.48, time: 0.32, oversight: 0.56, risks: { instructions: 0.35, formatting: 0.28, hallucination: 0.2, tooling: 0.3 } },
      claude: { win: 0.44, time: 0.29, oversight: 0.62, risks: { instructions: 0.46, formatting: 0.18, hallucination: 0.24, tooling: 0.36 } },
      grok: { win: 0.31, time: 0.18, oversight: 0.76, risks: { instructions: 0.56, formatting: 0.3, hallucination: 0.36, tooling: 0.52 } }
    },
    creative: {
      gpt5: { win: 0.43, time: 0.28, oversight: 0.6, risks: { instructions: 0.4, formatting: 0.34, hallucination: 0.22, tooling: 0.28 } },
      claude: { win: 0.5, time: 0.33, oversight: 0.55, risks: { instructions: 0.35, formatting: 0.22, hallucination: 0.24, tooling: 0.3 } },
      grok: { win: 0.29, time: 0.17, oversight: 0.74, risks: { instructions: 0.54, formatting: 0.32, hallucination: 0.33, tooling: 0.45 } }
    },
    operations: {
      gpt5: { win: 0.46, time: 0.31, oversight: 0.58, risks: { instructions: 0.32, formatting: 0.24, hallucination: 0.18, tooling: 0.34 } },
      claude: { win: 0.41, time: 0.27, oversight: 0.63, risks: { instructions: 0.42, formatting: 0.2, hallucination: 0.23, tooling: 0.38 } },
      grok: { win: 0.33, time: 0.2, oversight: 0.72, risks: { instructions: 0.5, formatting: 0.27, hallucination: 0.3, tooling: 0.48 } }
    }
  };

  const riskCatalog = {
    instructions: { title: 'Instruction follow-through', description: 'Ignored constraints, missing reference data, or incomplete multi-step answers.' },
    formatting: { title: 'Layout and formatting', description: 'Slides, spreadsheets, or PDFs arrive with broken structure or unreadable styling.' },
    hallucination: { title: 'Unsupported claims', description: 'Invented metrics, wrong currency conversions, or unverified statements.' },
    tooling: { title: 'Tool / attachment usage', description: 'Agents skip the provided assets, fail uploads, or do not execute code snippets as needed.' }
  };

  const clamp01 = (value) => Math.min(Math.max(value, 0), 1);

  const render = () => {
    const sector = sectorSelect.value;
    const model = modelSelect.value;
    const effort = Number(effortInput.value);
    const useScaffold = scaffoldToggle.checked;
    const useJudge = judgeToggle.checked;
    const useInspect = inspectToggle.checked;

    const base = baseline[sector] && baseline[sector][model];
    if (!base) return;

    let win = base.win;
    let time = base.time;
    let oversight = base.oversight;
    const riskScores = Object.assign({}, base.risks);

    if (effort === 0) {
      win -= 0.05;
      time -= 0.04;
      oversight += 0.06;
      riskScores.instructions += 0.08;
      riskScores.hallucination += 0.05;
    } else if (effort === 2) {
      win += 0.05;
      time += 0.05;
      oversight -= 0.05;
      riskScores.instructions -= 0.08;
      riskScores.hallucination -= 0.04;
    }

    if (useScaffold) {
      win += 0.03;
      time += 0.04;
      oversight -= 0.06;
      riskScores.instructions -= 0.15;
      riskScores.formatting -= 0.1;
    }

    if (useJudge) {
      win += 0.05;
      time += 0.06;
      oversight -= 0.05;
      riskScores.hallucination -= 0.12;
    }

    if (useInspect) {
      win += 0.02;
      time += 0.03;
      oversight -= 0.07;
      riskScores.formatting -= 0.2;
      riskScores.tooling -= 0.08;
    }

    win = clamp01(win);
    time = clamp01(time);
    oversight = clamp01(oversight);

    Object.keys(riskScores).forEach((key) => {
      riskScores[key] = clamp01(riskScores[key]);
    });

    winrateEl.textContent = Math.round(win * 100) + '%';
    timeEl.textContent = time >= 0
      ? 'Likely faster turnaround'
      : 'No forecasted speed gain';

    let oversightLabel;
    if (oversight <= 0.35) {
      oversightLabel = 'Spot-check only (≈20% reviewer time)';
    } else if (oversight <= 0.65) {
      oversightLabel = 'Targeted review (≈40% reviewer time)';
    } else {
      oversightLabel = 'Full review required (≈70% reviewer time)';
    }
    oversightEl.textContent = oversightLabel;

    const severityToClass = (score) => {
      if (score >= 0.6) return 'border-rose-200 bg-rose-50 text-rose-800';
      if (score >= 0.35) return 'border-amber-200 bg-amber-50 text-amber-800';
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    };

    const riskMarkup = Object.entries(riskScores)
      .sort((a, b) => b[1] - a[1])
      .map(([key, score]) => {
        const info = riskCatalog[key];
        if (!info) return '';
        const style = severityToClass(score);
        const label = score >= 0.6 ? 'High' : score >= 0.35 ? 'Medium' : 'Managed';
        return '<article class="border rounded-lg p-3 space-y-1 ' + style + '">' +
          '<div class="flex items-center justify-between"><h4 class="text-sm font-semibold">' + info.title + '</h4>' +
          '<span class="text-[11px] font-semibold uppercase tracking-wide">' + label + '</span></div>' +
          '<p class="text-xs leading-snug">' + info.description + '</p>' +
        '</article>';
      })
      .join('');
    risksEl.innerHTML = riskMarkup;

    const sectorLabelMap = {
      analysis: 'financial and analytics teams',
      creative: 'marketing and communications crews',
      operations: 'operations and compliance orgs'
    };

    const modelLabelMap = {
      gpt5: 'GPT-5',
      claude: 'Claude Opus 4.1',
      grok: 'Grok 4'
    };

    const sectorLabel = sectorLabelMap[sector] || 'teams';
    const modelLabel = modelLabelMap[model] || 'the selected model';
    const effortLabel = effort === 0 ? 'lightweight prompting only' : effort === 2 ? 'extended reasoning traces' : 'standard runs';

    const summaryParts = [
      modelLabel + ' should match or beat human deliverables about ' + Math.round(win * 100) + '% of the time for ' + sectorLabel + '.',
      'Expect roughly ' + Math.round(time * 100) + '% faster turnarounds under ' + effortLabel + '.',
      oversight <= 0.35
        ? 'Review can focus on spot-checking high-stakes sections.'
        : oversight <= 0.65
        ? 'Keep reviewers on-call to patch instruction gaps and polish layouts.'
        : 'Budget heavy reviewer time until scaffolding removes the major failure patterns.'
    ];
    summaryEl.innerHTML = summaryParts.map(function(text) { return '<p>' + text + '</p>'; }).join('');

    const actions = [];
    if (!useScaffold) {
      actions.push('Adopt the GDPval prompt checklist to reduce instruction misses and formatting slips.');
    }
    if (!useInspect) {
      actions.push('Force the agent to render and review its own files before handoff.');
    }
    if (!useJudge) {
      actions.push('Layer in best-of sampling with an automated judge to filter hallucinated drafts.');
    }
    if (effort === 0) {
      actions.push('Increase reasoning effort on long-horizon tasks; quick drafts underperform on GDPval scenarios.');
    }
    if (riskScores.instructions >= 0.5) {
      actions.push('Add human checkpoints for brief restatement and reference tracking.');
    }
    if (riskScores.formatting >= 0.5) {
      actions.push('Route outputs through a templating or formatting linter before client review.');
    }
    if (!actions.length) {
      actions.push('Capture these workflow settings as a playbook and monitor win rates quarterly.');
    }
    actionsEl.innerHTML = actions.map(function(item) { return '<li>' + item + '</li>'; }).join('');
  };

  [sectorSelect, modelSelect, effortInput, scaffoldToggle, judgeToggle, inspectToggle].forEach((control) => {
    control.addEventListener('change', render);
    control.addEventListener('input', render);
  });

  render();
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}
