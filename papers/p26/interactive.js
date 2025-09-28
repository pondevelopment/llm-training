const interactiveScript = () => {
  const root = document.getElementById('p26-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p26-scenario');
  const loadInput = document.getElementById('p26-load');
  const lengthInput = document.getElementById('p26-length');
  const rmsToggle = document.getElementById('p26-rms');
  const matmulToggle = document.getElementById('p26-matmul');
  const attnToggle = document.getElementById('p26-attn');
  const pinToggle = document.getElementById('p26-pin');
  const dedupeToggle = document.getElementById('p26-dedupe');

  const uniquesEl = document.getElementById('p26-uniques');
  const uniquesChipEl = document.getElementById('p26-uniques-chip');
  const divergenceEl = document.getElementById('p26-divergence');
  const klEl = document.getElementById('p26-kl');
  const latencyEl = document.getElementById('p26-latency');
  const signalEl = document.getElementById('p26-signal');
  const flagsEl = document.getElementById('p26-flags');
  const summaryEl = document.getElementById('p26-summary');
  const actionsEl = document.getElementById('p26-actions');

  if (!scenarioSelect || !loadInput || !lengthInput || !rmsToggle || !matmulToggle || !attnToggle ||
      !pinToggle || !dedupeToggle || !uniquesEl || !uniquesChipEl || !divergenceEl || !klEl ||
      !latencyEl || !signalEl || !flagsEl || !summaryEl || !actionsEl) {
    return;
  }

  const scenarios = {
    steady: {
      label: 'Steady SaaS API',
      description: 'Customers expect identical completions for audit trails; batches rarely exceed 4 tokens.',
      baseUnique: 12,
      baseDivergence: 420,
      baseKL: 0.0006,
      baseLatency: 1.05,
      flags: {
        risk: [
          'Unique completions spike during regional failovers; autoscaling creates surprise batch merges.',
          'Customer support tickets cite mismatched receipts or contract clauses across retries.'
        ],
        watch: [
          'Pinned queue sees &gt;5 unique completions per 1k requests; replay cache hit rate slipping.',
          'GPU utilization jumps above 80% during business hours, hinting at split-K heuristics changing.'
        ],
        good: [
          'Bitwise diffs stay flat; nightly regression compares hashes across three replica tiers.',
          'KL alerts remain under 2e-4, so policy fine tuning can stay on-policy.'
        ]
      },
      baseActions: [
        'Keep a nightly temp-0 replay of top 20 prompts and diff completions in git.',
        'Expose batch-size distributions in your papertrail so product can price deterministic SLAs.'
      ]
    },
    burst: {
      label: 'Consumer burstiness',
      description: 'Traffic swings by the minute; batching engines aggressively coalesce requests for throughput.',
      baseUnique: 38,
      baseDivergence: 260,
      baseKL: 0.0012,
      baseLatency: 1.0,
      flags: {
        risk: [
          '80+ unique completions per 1k requests mirror the blog baseline; drift arrives before token 120.',
          'vLLM logs show frequent fallback to nondeterministic attention cleanup when batches spike.'
        ],
        watch: [
          'Product sees inconsistent marketing copy on synchronous retries; queue depth above 16.',
          'Prometheus shows sampler/trainer KL hovering near 8e-4 during surges.'
        ],
        good: [
          'Burst buffer keeps temp-0 completions at 1 and canary prompts hash equal across replicas.',
          'Latency tax holds under 1.7x while deterministic lane carries VIP customers.'
        ]
      },
      baseActions: [
        'Gate deterministic mode behind a feature flag so you can shed load gracefully during surges.',
        'Capture per-batch reduction stats from FlexAttention to prove fixed split sizes in production.'
      ]
    },
    rl: {
      label: 'RLHF training loop',
      description: 'Policy sampling shares hardware with trainer; off-policy drift collapses reward if numerics differ.',
      baseUnique: 36,
      baseDivergence: 200,
      baseKL: 0.0018,
      baseLatency: 1.12,
      flags: {
        risk: [
          'Reward collapses mid-run just like the blog without importance weighting; KL spikes above 0.003.',
          'Replay buffer contains mismatched logprobs between sampler and trainer checkpoints.'
        ],
        watch: [
          'Importance weighting props up reward but KL hovers near 0.001; perf counters show tile heuristics shifting.',
          'Trainer GPU shares hardware with inference; queue depth >8 sequences when long rollouts arrive.'
        ],
        good: [
          'KL pinned at 0.0000x; RLVR plots stay smooth with deterministic sampler.',
          'Sampler and trainer share the same torch.Library overrides checked into version control.'
        ]
      },
      baseActions: [
        'Bundle deterministic kernels with experiment configs so checkpoints remain reproducible.',
        'Log sampler KL alongside reward; alert when divergence exceeds 5e-4.'
      ]
    }
  };

  const loadUniqueAdjust = [-12, 0, 35];
  const loadDivergenceAdjust = [140, 0, -120];
  const loadKLAdjust = [-0.0003, 0, 0.0006];
  const loadLatencyAdjust = [-0.05, 0, 0.12];

  const kernelEffects = {
    rms: { unique: -18, divergence: 140, kl: -0.00025, latency: 0.16 },
    matmul: { unique: -22, divergence: 180, kl: -0.0003, latency: 0.34 },
    attn: { unique: -36, divergence: 260, kl: -0.0004, latency: 0.18 }
  };

  const queueEffects = {
    pin: { unique: -10, divergence: 120, kl: -0.0002, latency: 0.18 },
    dedupe: { unique: -6, divergence: 80, kl: -0.00015, latency: -0.06 }
  };

  const chipStyles = {
    good: { className: 'chip chip-success uppercase tracking-wide', text: 'Deterministic' },
    watch: { className: 'chip chip-neutral uppercase tracking-wide', text: 'Monitor' },
    risk: { className: 'chip chip-warning uppercase tracking-wide', text: 'Drifting' }
  };

  const formatPercent = (value) => {
    if (value <= 0) return '0.0000';
    if (value < 0.0001) return value.toExponential(2);
    return value.toFixed(4);
  };

  const buildSummary = (scenario, uniques, divergence, kl, latency, level) => {
    const pieces = [];
    pieces.push('<p><strong>' + scenario.label + ':</strong> ' + scenario.description + '</p>');
    pieces.push('<p>With the current settings you are seeing <strong>' + uniques + '</strong> unique completions per 1,000 temp-0 calls, diverging around token <strong>' + divergence + '</strong>. KL between sampler and trainer is roughly <strong>' + formatPercent(kl) + '</strong>.</p>');
    if (level === 'risk') {
      pieces.push('<p>That mirrors the blog\'s baseline drift: expect auditors to notice and RL runs to go off-policy unless you harden the kernels or isolate batches.</p>');
    } else if (level === 'watch') {
      pieces.push('<p>You are holding the line, but batch-size shifts or longer generations could still surface nondeterministic copies. Keep the nightly diff jobs alive.</p>');
    } else {
      pieces.push('<p>Outputs are bitwise stable in practice. You can forward this lane to regulated users or training jobs that demand reproducibility.</p>');
    }
    pieces.push('<p>Latency multiplier sits at <strong>' + latency.toFixed(2) + 'x</strong> versus default kernels, so share the tax with product and SREs.</p>');
    return pieces.join('');
  };

  const render = () => {
    const key = scenarioSelect.value;
    const scenario = scenarios[key] || scenarios.steady;

    const loadIndex = parseInt(loadInput.value, 10) || 0;
    const targetLength = parseInt(lengthInput.value, 10) || 256;
    const hasRms = rmsToggle.checked;
    const hasMatmul = matmulToggle.checked;
    const hasAttn = attnToggle.checked;
    const hasPin = pinToggle.checked;
    const hasDedupe = dedupeToggle.checked;

    const lengthDelta = (targetLength - 256) / 64;

    let uniques = scenario.baseUnique + (loadUniqueAdjust[loadIndex] || 0) + Math.round(lengthDelta * 4);
    let divergence = scenario.baseDivergence + (loadDivergenceAdjust[loadIndex] || 0) - Math.round(lengthDelta * 12);
    let kl = scenario.baseKL + (loadKLAdjust[loadIndex] || 0) + lengthDelta * 0.00008;
    let latency = scenario.baseLatency + (loadLatencyAdjust[loadIndex] || 0) + lengthDelta * 0.04;

    if (hasRms) {
      uniques += kernelEffects.rms.unique;
      divergence += kernelEffects.rms.divergence;
      kl += kernelEffects.rms.kl;
      latency += kernelEffects.rms.latency;
    }
    if (hasMatmul) {
      uniques += kernelEffects.matmul.unique;
      divergence += kernelEffects.matmul.divergence;
      kl += kernelEffects.matmul.kl;
      latency += kernelEffects.matmul.latency;
    }
    if (hasAttn) {
      uniques += kernelEffects.attn.unique;
      divergence += kernelEffects.attn.divergence;
      kl += kernelEffects.attn.kl;
      latency += kernelEffects.attn.latency;
    }

    if (hasPin) {
      uniques += queueEffects.pin.unique;
      divergence += queueEffects.pin.divergence;
      kl += queueEffects.pin.kl;
      latency += queueEffects.pin.latency;
    }
    if (hasDedupe) {
      uniques += queueEffects.dedupe.unique;
      divergence += queueEffects.dedupe.divergence;
      kl += queueEffects.dedupe.kl;
      latency += queueEffects.dedupe.latency;
    }

    if ((hasRms || hasMatmul) && !hasAttn) {
      latency += 0.45; // mirrors the 55s vs 26s slowdown without deterministic attention
    }
    if (hasRms && hasMatmul && hasAttn) {
      latency -= 0.2; // reclaimed perf once FlexAttention is patched
    }

    uniques = Math.max(1, Math.round(uniques));
    divergence = Math.max(targetLength + 20, Math.round(divergence));
    kl = Math.max(0, kl);
    latency = Math.max(1, Number(latency.toFixed(2)));

    const level = uniques <= 3 ? 'good' : uniques <= 20 ? 'watch' : 'risk';
    const chip = chipStyles[level] || chipStyles.watch;

    uniquesEl.textContent = uniques.toString();
    uniquesChipEl.textContent = chip.text;
    uniquesChipEl.className = chip.className;

    divergenceEl.textContent = divergence + ' tokens';
    klEl.textContent = formatPercent(kl);
    latencyEl.textContent = latency.toFixed(2) + 'x';

    signalEl.textContent = level === 'good'
      ? 'Safe to route regulated traffic'
      : level === 'watch'
        ? 'Monitor nightly hashes and queue depth'
        : 'Drift mirrors Horace He baseline';

    const flagList = scenario.flags[level] || scenario.flags.watch;
    flagsEl.innerHTML = flagList.map((item) => '<li>' + item + '</li>').join('');

    summaryEl.innerHTML = buildSummary(scenario, uniques, divergence, kl, latency, level);

    const actions = new Set(scenario.baseActions);
    if (!hasRms) actions.add('Swap in the batch-invariant RMSNorm kernel from the blog\'s repo; it removes load-sensitive reduction order.');
    if (!hasMatmul) actions.add('Fix split-K heuristics to a tile size so matmuls stop picking different reduction trees.');
    if (!hasAttn) actions.add('Adopt the deterministic FlexAttention cleanup path; without it you replicate the 80-unique baseline.');
    if (!hasPin && level !== 'good') actions.add('Reserve a deterministic queue for VIP traffic so load spikes stop changing batch size.');
    if (!hasDedupe && level !== 'good') actions.add('Cache temperature-0 completions so duplicate prompts short-circuit and avoid fresh nondeterministic runs.');
    if (kl > 0.0005) actions.add('Enable importance weighting or, preferably, align sampler numerics to keep KL under 5e-4.');
    if (latency > 1.8) actions.add('Budget the throughput tax: plan additional GPUs or sell deterministic inference as a premium SKU.');
    if (targetLength > 384) actions.add('Consider chunking responses or streaming to users; long generations amplify divergence pressure.');

    actionsEl.innerHTML = Array.from(actions).map((item) => '<li>' + item + '</li>').join('');
  };

  const controls = [scenarioSelect, loadInput, lengthInput, rmsToggle, matmulToggle, attnToggle, pinToggle, dedupeToggle];

  let pendingFrame = null;
  const queueRender = () => {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      if (pendingFrame !== null) {
        window.cancelAnimationFrame(pendingFrame);
      }
      pendingFrame = window.requestAnimationFrame(() => {
        pendingFrame = null;
        render();
      });
    } else {
      render();
    }
  };

  controls.forEach((control) => {
    control.addEventListener('change', queueRender);
    if (control.tagName === 'INPUT') {
      control.addEventListener('input', queueRender);
    }
  });

  render();

  if (typeof window !== 'undefined' && window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
    window.MathJax.typesetPromise();
  }
};

if (typeof module !== 'undefined') {
  module.exports = { interactiveScript };
}

if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}

