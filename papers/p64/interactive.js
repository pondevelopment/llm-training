(function () {
  'use strict';

  function getEl(id) {
    return document.getElementById(id);
  }

  function fmtPct(n) {
    return `${n.toFixed(1)}%`;
  }

  function fmtInt(n) {
    return `${Math.round(n)}`;
  }

  function safeDiv(n, d) {
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
    return n / d;
  }

  // Data copied from Tables 1–3 in arXiv:2511.20639v2.
  // Metrics:
  // - acc: percentage
  // - tokens: total output tokens
  // - time: seconds per run
  const DATA = {
    sequential: {
      tableLabel: 'Table 1 / Table 3 (Sequential MAS)',
      byScale: {
        '4B': {
          ARC_E: { single: { acc: 95.4, tokens: 724, time: 369 }, text: { acc: 96.4, tokens: 2420, time: 2874 }, latent: { acc: 98.6, tokens: 581, time: 512 } },
          ARC_C: { single: { acc: 89.2, tokens: 913, time: 97 }, text: { acc: 90.0, tokens: 2678, time: 1579 }, latent: { acc: 92.3, tokens: 718, time: 260 } },
          GSM8K: { single: { acc: 82.4, tokens: 1136, time: 469 }, text: { acc: 89.8, tokens: 3172, time: 1970 }, latent: { acc: 88.2, tokens: 607, time: 375 } },
          MedQA: { single: { acc: 47.7, tokens: 2134, time: 236 }, text: { acc: 65.3, tokens: 3962, time: 1267 }, latent: { acc: 66.3, tokens: 1685, time: 438 } },
          MBPP: { single: { acc: 63.5, tokens: 1634, time: 523 }, text: { acc: 69.8, tokens: 4420, time: 2148 }, latent: { acc: 73.5, tokens: 1339, time: 577 } },
          HumanEval: { single: { acc: 75.0, tokens: 2380, time: 274 }, text: { acc: 79.7, tokens: 5987, time: 1044 }, latent: { acc: 79.9, tokens: 1775, time: 350 } }
        },
        '8B': {
          ARC_E: { single: { acc: 95.6, tokens: 656, time: 404 }, text: { acc: 99.1, tokens: 2085, time: 3702 }, latent: { acc: 98.8, tokens: 490, time: 1759 } },
          ARC_C: { single: { acc: 91.0, tokens: 846, time: 266 }, text: { acc: 94.6, tokens: 2252, time: 2059 }, latent: { acc: 94.4, tokens: 529, time: 703 } },
          GSM8K: { single: { acc: 81.1, tokens: 1280, time: 449 }, text: { acc: 92.3, tokens: 2324, time: 1739 }, latent: { acc: 93.8, tokens: 860, time: 543 } },
          MedQA: { single: { acc: 53.0, tokens: 2098, time: 476 }, text: { acc: 75.0, tokens: 4260, time: 1923 }, latent: { acc: 75.3, tokens: 1555, time: 928 } },
          MBPP: { single: { acc: 64.8, tokens: 2053, time: 1064 }, text: { acc: 69.5, tokens: 3695, time: 3628 }, latent: { acc: 74.6, tokens: 1164, time: 1275 } },
          HumanEval: { single: { acc: 74.4, tokens: 2507, time: 502 }, text: { acc: 80.5, tokens: 4593, time: 1619 }, latent: { acc: 80.5, tokens: 1866, time: 497 } },
          AIME24: { single: { acc: 50.0, tokens: 12891, time: 421 }, text: { acc: 53.3, tokens: 38596, time: 2808 }, latent: { acc: 56.7, tokens: 8953, time: 688 } },
          AIME25: { single: { acc: 46.7, tokens: 14692, time: 450 }, text: { acc: 53.3, tokens: 45088, time: 3150 }, latent: { acc: 53.3, tokens: 8699, time: 820 } },
          GPQA: { single: { acc: 39.9, tokens: 6435, time: 813 }, text: { acc: 43.4, tokens: 17986, time: 5771 }, latent: { acc: 45.5, tokens: 4571, time: 854 } }
        },
        '14B': {
          ARC_E: { single: { acc: 97.2, tokens: 608, time: 551 }, text: { acc: 99.0, tokens: 1670, time: 9171 }, latent: { acc: 99.4, tokens: 224, time: 2124 } },
          ARC_C: { single: { acc: 92.6, tokens: 773, time: 338 }, text: { acc: 95.9, tokens: 2985, time: 5125 }, latent: { acc: 95.6, tokens: 426, time: 1136 } },
          GSM8K: { single: { acc: 83.7, tokens: 1118, time: 536 }, text: { acc: 93.8, tokens: 3324, time: 3729 }, latent: { acc: 95.2, tokens: 644, time: 1952 } },
          MedQA: { single: { acc: 64.7, tokens: 1746, time: 1360 }, text: { acc: 80.3, tokens: 3444, time: 4142 }, latent: { acc: 80.7, tokens: 1841, time: 1420 } },
          MBPP: { single: { acc: 68.5, tokens: 1858, time: 2410 }, text: { acc: 72.8, tokens: 4971, time: 8728 }, latent: { acc: 75.7, tokens: 1621, time: 2400 } },
          HumanEval: { single: { acc: 76.8, tokens: 2366, time: 1084 }, text: { acc: 81.1, tokens: 5934, time: 4062 }, latent: { acc: 86.5, tokens: 2042, time: 1285 } },
          AIME24: { single: { acc: 63.3, tokens: 11263, time: 1018 }, text: { acc: 63.3, tokens: 32092, time: 4554 }, latent: { acc: 66.7, tokens: 10593, time: 1149 } },
          AIME25: { single: { acc: 56.7, tokens: 11298, time: 1040 }, text: { acc: 60.0, tokens: 44618, time: 5184 }, latent: { acc: 63.3, tokens: 11402, time: 1473 } },
          GPQA: { single: { acc: 48.5, tokens: 5547, time: 1043 }, text: { acc: 51.5, tokens: 12676, time: 9714 }, latent: { acc: 52.0, tokens: 5454, time: 1475 } }
        }
      }
    },
    hierarchical: {
      tableLabel: 'Table 2 / Table 3 (Hierarchical MAS)',
      byScale: {
        '4B': {
          ARC_E: { single: { acc: 95.4, tokens: 724, time: 369 }, text: { acc: 97.1, tokens: 2054, time: 2239 }, latent: { acc: 96.8, tokens: 363, time: 591 } },
          ARC_C: { single: { acc: 89.2, tokens: 913, time: 97 }, text: { acc: 92.5, tokens: 2674, time: 1275 }, latent: { acc: 91.7, tokens: 447, time: 299 } },
          GSM8K: { single: { acc: 82.4, tokens: 1136, time: 469 }, text: { acc: 89.4, tokens: 3098, time: 1878 }, latent: { acc: 88.4, tokens: 555, time: 360 } },
          MedQA: { single: { acc: 47.7, tokens: 2134, time: 236 }, text: { acc: 65.0, tokens: 6702, time: 1495 }, latent: { acc: 67.3, tokens: 1015, time: 557 } },
          MBPP: { single: { acc: 63.5, tokens: 1634, time: 523 }, text: { acc: 69.3, tokens: 6782, time: 1766 }, latent: { acc: 70.6, tokens: 1339, time: 489 } },
          HumanEval: { single: { acc: 75.0, tokens: 2380, time: 274 }, text: { acc: 76.2, tokens: 8127, time: 931 }, latent: { acc: 79.3, tokens: 1373, time: 333 } }
        },
        '8B': {
          ARC_E: { single: { acc: 95.6, tokens: 656, time: 404 }, text: { acc: 98.2, tokens: 2237, time: 3619 }, latent: { acc: 98.3, tokens: 308, time: 1779 } },
          ARC_C: { single: { acc: 91.0, tokens: 846, time: 266 }, text: { acc: 93.3, tokens: 2854, time: 2034 }, latent: { acc: 93.9, tokens: 344, time: 714 } },
          GSM8K: { single: { acc: 81.1, tokens: 1280, time: 449 }, text: { acc: 90.4, tokens: 2370, time: 1365 }, latent: { acc: 89.5, tokens: 353, time: 702 } },
          MedQA: { single: { acc: 53.0, tokens: 2098, time: 476 }, text: { acc: 76.3, tokens: 6893, time: 3387 }, latent: { acc: 77.0, tokens: 1007, time: 964 } },
          MBPP: { single: { acc: 64.8, tokens: 2053, time: 1064 }, text: { acc: 71.9, tokens: 7703, time: 3898 }, latent: { acc: 72.2, tokens: 1264, time: 1387 } },
          HumanEval: { single: { acc: 74.4, tokens: 2507, time: 502 }, text: { acc: 76.8, tokens: 8768, time: 1809 }, latent: { acc: 78.0, tokens: 1274, time: 439 } },
          AIME24: { single: { acc: 50.0, tokens: 12891, time: 421 }, text: { acc: 53.3, tokens: 42629, time: 3132 }, latent: { acc: 53.3, tokens: 7526, time: 776 } },
          AIME25: { single: { acc: 46.7, tokens: 14692, time: 450 }, text: { acc: 50.0, tokens: 53929, time: 3488 }, latent: { acc: 50.0, tokens: 13230, time: 616 } },
          GPQA: { single: { acc: 39.9, tokens: 6435, time: 813 }, text: { acc: 43.0, tokens: 22450, time: 6108 }, latent: { acc: 46.9, tokens: 3395, time: 798 } }
        },
        '14B': {
          ARC_E: { single: { acc: 97.2, tokens: 608, time: 551 }, text: { acc: 98.3, tokens: 2752, time: 7102 }, latent: { acc: 98.7, tokens: 619, time: 1884 } },
          ARC_C: { single: { acc: 92.6, tokens: 773, time: 338 }, text: { acc: 95.3, tokens: 2167, time: 4283 }, latent: { acc: 95.5, tokens: 295, time: 1090 } },
          GSM8K: { single: { acc: 83.7, tokens: 1118, time: 536 }, text: { acc: 90.8, tokens: 3021, time: 3675 }, latent: { acc: 91.6, tokens: 495, time: 1631 } },
          MedQA: { single: { acc: 64.7, tokens: 1746, time: 1360 }, text: { acc: 78.0, tokens: 5473, time: 7591 }, latent: { acc: 78.3, tokens: 899, time: 1250 } },
          MBPP: { single: { acc: 68.5, tokens: 1858, time: 2410 }, text: { acc: 73.0, tokens: 7458, time: 9162 }, latent: { acc: 73.8, tokens: 1187, time: 2507 } },
          HumanEval: { single: { acc: 76.8, tokens: 2366, time: 1084 }, text: { acc: 84.1, tokens: 8114, time: 3988 }, latent: { acc: 86.6, tokens: 1512, time: 1188 } },
          AIME24: { single: { acc: 63.3, tokens: 11263, time: 1018 }, text: { acc: 70.0, tokens: 29025, time: 5718 }, latent: { acc: 73.3, tokens: 10230, time: 1089 } },
          AIME25: { single: { acc: 56.7, tokens: 11298, time: 1040 }, text: { acc: 66.7, tokens: 50003, time: 6019 }, latent: { acc: 66.7, tokens: 9527, time: 1056 } },
          GPQA: { single: { acc: 48.5, tokens: 5547, time: 1043 }, text: { acc: 52.0, tokens: 20931, time: 9119 }, latent: { acc: 53.0, tokens: 3606, time: 1458 } }
        }
      }
    }
  };

  const TASKS = [
    { key: 'ARC_E', label: 'ARC-Easy (ARC-E)' },
    { key: 'ARC_C', label: 'ARC-Challenge (ARC-C)' },
    { key: 'GSM8K', label: 'GSM8K' },
    { key: 'MedQA', label: 'MedQA' },
    { key: 'MBPP', label: 'MBPP+ (code)' },
    { key: 'HumanEval', label: 'HumanEval+ (code)' },
    { key: 'AIME24', label: 'AIME24' },
    { key: 'AIME25', label: 'AIME25' },
    { key: 'GPQA', label: 'GPQA-Diamond' }
  ];

  const TASK_DETAILS = {
    ARC_E: 'Grade-school science multiple-choice questions (easier split).',
    ARC_C: 'Grade-school science multiple-choice questions (harder “challenge” split).',
    GSM8K: 'Multi-step grade-school math word problems.',
    MedQA: 'Medical multiple-choice exam-style questions.',
    MBPP: 'Code generation: write small programs that pass unit tests.',
    HumanEval: 'Code generation: write function implementations for programming tasks.',
    AIME24: 'Competition math problems that often require longer reasoning.',
    AIME25: 'Competition math problems that often require longer reasoning.',
    GPQA: 'Very difficult graduate-level QA designed to be hard to guess.'
  };

  function availableTaskKeys(settingKey, scaleKey) {
    const block = DATA?.[settingKey]?.byScale?.[scaleKey];
    if (!block) return [];
    return Object.keys(block);
  }

  function rebuildTaskOptions(taskSelect, availableKeys) {
    if (!taskSelect) return;
    const avail = new Set(availableKeys);

    const existing = taskSelect.value;

    taskSelect.innerHTML = TASKS.filter(t => avail.has(t.key))
      .map(t => `<option value="${t.key}">${t.label}</option>`)
      .join('');

    if (existing && avail.has(existing)) {
      taskSelect.value = existing;
    }
  }

  function metricCardHtml(title, metrics, accent) {
    const chipClass = accent === 'success' ? 'chip chip-success' : accent === 'info' ? 'chip chip-info' : 'chip chip-neutral';
    return `
      <div class="panel panel-neutral-soft p-3 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold text-heading">${title}</p>
          <span class="${chipClass} text-xs">${metrics.label}</span>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="text-xs panel-muted">
            <div>Acc</div>
            <div class="font-mono text-body">${fmtPct(metrics.acc)}</div>
          </div>
          <div class="text-xs panel-muted">
            <div>Tokens</div>
            <div class="font-mono text-body">${fmtInt(metrics.tokens)}</div>
          </div>
          <div class="text-xs panel-muted">
            <div>Time</div>
            <div class="font-mono text-body">${fmtInt(metrics.time)}s</div>
          </div>
        </div>
      </div>
    `;
  }

  function updateUI() {
    const root = getEl('p64-explorer');
    if (!root) return;

    const settingEl = getEl('p64-setting');
    const scaleEl = getEl('p64-scale');
    const taskEl = getEl('p64-task');

    const sourceEl = getEl('p64-source');
    const cardsEl = getEl('p64-metric-cards');

    const deltaAccEl = getEl('p64-delta-acc');
    const deltaTokenEl = getEl('p64-delta-token');
    const deltaSpeedEl = getEl('p64-delta-speed');

    const explanationEl = getEl('p64-explanation');

    if (!settingEl || !scaleEl || !taskEl || !cardsEl) return;

    const settingKey = settingEl.value;
    const scaleKey = scaleEl.value;

    const availableKeys = availableTaskKeys(settingKey, scaleKey);
    rebuildTaskOptions(taskEl, availableKeys);

    const taskKey = taskEl.value || availableKeys[0];
    if (!taskKey) return;

    const entry = DATA?.[settingKey]?.byScale?.[scaleKey]?.[taskKey];
    if (!entry) return;

    if (sourceEl) sourceEl.textContent = DATA?.[settingKey]?.tableLabel || 'Table —';

    const single = { ...entry.single, label: 'Single' };
    const text = { ...entry.text, label: 'TextMAS' };
    const latent = { ...entry.latent, label: 'LatentMAS' };

    cardsEl.innerHTML = [
      metricCardHtml('Single model', single, 'neutral'),
      metricCardHtml('Text-based MAS', text, 'info'),
      metricCardHtml('LatentMAS', latent, 'success')
    ].join('');

    const accDelta = latent.acc - text.acc;
    const tokenRatio = safeDiv(latent.tokens, text.tokens);
    const tokenReduction = tokenRatio === null ? null : 1 - tokenRatio;
    const speedup = safeDiv(text.time, latent.time);

    if (deltaAccEl) {
      const sign = accDelta >= 0 ? '+' : '';
      deltaAccEl.textContent = `${sign}${accDelta.toFixed(1)} pp`;
    }

    if (deltaTokenEl) {
      if (tokenReduction === null) {
        deltaTokenEl.textContent = '—';
      } else {
        deltaTokenEl.textContent = `${(tokenReduction * 100).toFixed(1)}% fewer tokens`;
      }
    }

    if (deltaSpeedEl) {
      if (speedup === null) {
        deltaSpeedEl.textContent = '—';
      } else {
        deltaSpeedEl.textContent = `${speedup.toFixed(1)}× faster`;
      }
    }

    if (explanationEl) {
      const taskLabel = (TASKS.find(t => t.key === taskKey)?.label || taskKey).replace(/</g, '&lt;');
      const taskDetail = TASK_DETAILS[taskKey] || 'A standard evaluation benchmark.';
      const lines = [
        `<p><strong>${taskLabel}</strong>: ${taskDetail}</p>`,
        `<p>This illustrates the paper’s core mechanism: LatentMAS avoids generating (and passing) long token traces between agents.</p>`,
        `<p>When the TextMAS baseline needs thousands (or tens of thousands) of tokens for explicit chain-of-thought, LatentMAS can transfer a compact latent working memory (KV caches + latent thought embeddings) and decode only at the end, which is why token usage and wall-clock time often drop sharply.</p>`,
        `<p>Accuracy can move either direction on individual tasks. The paper’s aggregate takeaway is that latent collaboration can deliver large efficiency wins without additional training, so it’s worth treating the communication medium as a first-class design choice.</p>`
      ];
      explanationEl.innerHTML = lines.join('');
    }
  }

  function init() {
    const root = getEl('p64-explorer');
    if (!root) return;

    const settingEl = getEl('p64-setting');
    const scaleEl = getEl('p64-scale');
    const taskEl = getEl('p64-task');

    if (!settingEl || !scaleEl || !taskEl) return;

    settingEl.addEventListener('change', updateUI);
    scaleEl.addEventListener('change', updateUI);
    taskEl.addEventListener('change', updateUI);

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
