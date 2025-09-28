const interactiveScript = () => {
  const MAX_RETRIES = 10;
  const scheduleRetry = (fn) => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(fn);
    } else {
      setTimeout(fn, 20);
    }
  };

  const attemptInit = (attempt = 0) => {
    const $ = (id) => document.getElementById(id);
    const archSel = $('q46-arch');
    const stepEl = $('q46-step');
    const lenEl = $('q46-len');
    const railEl = $('q46-rail');
    const railCaptionEl = $('q46-rail-caption');
    const contextSummaryEl = $('q46-context-summary');
    const flowListEl = $('q46-flow');
    const lensNoteEl = $('q46-lens-note');
    const coverageBarEl = $('q46-coverage-bar');
    const coverageLabelEl = $('q46-coverage-label');
    const coverageBadgeEl = $('q46-coverage-badge');
    const insightTextEl = $('q46-insight-text');
    const insightListEl = $('q46-insight-list');
    const explEl = $('q46-expl');
    const guideEl = $('q46-guide');

    if (!archSel || !stepEl || !lenEl || !railEl || !flowListEl || !coverageBarEl || !explEl) {
      if (attempt < MAX_RETRIES) {
        scheduleRetry(() => attemptInit(attempt + 1));
      } else if (!window.__q46InitLogged) {
        window.__q46InitLogged = true;
        console.warn('q46 interactive: elements not found after retries – aborting init');
      }
      return;
    }

    window.__q46InitLogged = false;

    const TOKEN_BANK = {
      encoder: [
        'Source', 'sequence', 'offers', 'bidirectional', 'signals', 'for',
        'representation', 'learning', 'across', 'the', 'entire', 'span'
      ],
      decoder: [
        'Generated', 'tokens', 'lean', 'on', 'past', 'context', 'only,',
        'future', 'positions', 'stay', 'masked', 'away'
      ],
      encdec: [
        'Source', 'memory', 'sits', 'inside', 'the', 'encoder,', 'decoder',
        'queries', 'it', 'while', 'predicting', 'targets'
      ]
    };

    const ARCH_COPY = {
      encoder: {
        lensNote: 'Every token sees both past and future tokens inside the encoder.',
        railCaption: (L) => `All ${L} tokens are mutually visible.`,
        summary: 'Encoder-only models build rich bidirectional embeddings.',
        bullets: [
          'Use for retrieval, classification, and embedding tasks.',
          'Requires an external head/decoder to generate text.'
        ]
      },
      decoder: {
        lensNote: 'Causal mask: only completed tokens feed the next prediction.',
        railCaption: (L, t, visible) => `${visible} of ${L} prior tokens feed step t = ${t}.`,
        summary: 'Decoder-only models predict left to right.',
        bullets: [
          'Great for free-form generation and chain-of-thought.',
          'Coverage expands token by token; future positions remain hidden.'
        ]
      },
      encdec: {
        lensNote: 'Decoder reads past outputs and the full encoder memory.',
        railCaption: (L, t) => `Full source (${L}) plus ${Math.max(0, t - 1)} generated tokens are visible.`,
        summary: 'Encoder–decoder stacks mix encoder context with causal decoding.',
        bullets: [
          'Ideal for translation, summarisation, and instruction following.',
          'Cross-attention fuses encoder states with the partial target.'
        ]
      }
    };

    const FLOW_STEPS = {
      encoder: [
        { label: 'Encoder', desc: 'Bidirectional self-attention across the whole input.', tone: 'encoder' }
      ],
      decoder: [
        { label: 'Decoder', desc: 'Causal self-attention over completed tokens only.', tone: 'decoder' }
      ],
      encdec: [
        { label: 'Encoder', desc: 'Bidirectional context builder for the source.', tone: 'encoder' },
        { label: 'Decoder', desc: 'Causal self-attention over generated history.', tone: 'decoder' },
        { label: 'Cross-attn', desc: 'Decoder queries encoder states each step.', tone: 'cross' }
      ]
    };

    const messages = {
      encoder: 'At any position, the encoder sees the <em>entire</em> input (bidirectional). It does not generate tokens; it produces contextual embeddings typically read by a task head or a decoder.',
      decoder: 'The decoder enforces a <strong>causal mask</strong>: at step t it can attend only to tokens 1…t−1. This enables next-token prediction \\( p(y_t \\mid y_{< t}) \\).',
      encdec: 'Two hops: (1) the encoder builds global representations of the source; (2) the decoder uses <em>masked</em> self-attention plus <strong>cross-attention</strong> to those encoder states to generate y step-by-step.'
    };

    function describeState(arch, state) {
      if (arch === 'decoder') {
        if (state === 'current') return 'focus · predicting';
        if (state === 'future') return 'locked · hidden';
        return 'context · ready';
      }
      if (arch === 'encdec') {
        if (state === 'current') return 'focus · decoder';
        return 'source · memory';
      }
      if (state === 'current') return 'focus · bidirectional';
      return 'context · bidirectional';
    }

    function pillTitle(arch, state, index, t) {
      if (arch === 'decoder') {
        if (state === 'current') return `Token ${index}: currently predicting step t = ${t}`;
        if (state === 'future') return `Token ${index}: not yet visible (causal mask hides future positions)`;
        return `Token ${index}: in left-context for decoding`;
      }
      if (arch === 'encdec') {
        return state === 'current'
          ? `Token ${index}: decoder focuses here while cross-attending`
          : `Token ${index}: encoder memory available to the decoder`;
      }
      return `Token ${index}: encoder sees full bidirectional context`;
    }

    function buildRail(arch, L, t) {
      railEl.innerHTML = '';
      const visibleCount = arch === 'decoder' ? Math.max(0, t - 1) : L;

      const tokenList = TOKEN_BANK[arch] || TOKEN_BANK.decoder;

      for (let i = 1; i <= L; i += 1) {
        const pill = document.createElement('div');
        pill.className = 'q46-token-pill';
        let state = 'visible';
        if (arch === 'decoder') {
          if (i < t) state = 'visible';
          else if (i === t) state = 'current';
          else state = 'future';
        } else if (arch === 'encdec' && i === t) {
          state = 'current';
        }
        const label = describeState(arch, state);
        const word = tokenList[(i - 1) % tokenList.length] || `Token ${i}`;
        pill.dataset.state = state;
        pill.title = pillTitle(arch, state, i, t);
        pill.innerHTML = `<span class="q46-token-word">${word}</span><span class="q46-token-state">${label}</span>`;
        railEl.appendChild(pill);
      }

      const copy = ARCH_COPY[arch];
      contextSummaryEl.textContent = arch === 'decoder'
        ? `${visibleCount}/${L} tokens visible`
        : arch === 'encdec'
          ? `Source ${L} + history ${Math.max(0, t - 1)}`
          : `All ${L} tokens visible`;
      railCaptionEl.textContent = copy.railCaption(L, t, visibleCount);
    }

    function renderFlow(arch) {
      const steps = FLOW_STEPS[arch] || [];
      flowListEl.innerHTML = steps.map((step) => (
        `<li class="q46-flow-item">
          <span class="q46-flow-badge" data-tone="${step.tone}">${step.label}</span>
          <span class="q46-flow-desc">${step.desc}</span>
        </li>`
      )).join('');
    }

    function renderCoverage(arch, coverage, visible, L, t) {
      const clamped = Math.max(0, Math.min(1, coverage));
      const percent = Math.round(clamped * 100);
      let state = 'neutral';
      let label = '';
      if (clamped >= 0.95) { label = 'Excellent'; state = 'excellent'; }
      else if (clamped >= 0.6) { label = 'Good'; state = 'good'; }
      else if (clamped >= 0.3) { label = 'Limited'; state = 'limited'; }
      else { label = 'Poor'; state = 'poor'; }

      coverageBarEl.style.width = `${percent}%`;
      coverageBarEl.dataset.state = state;
      coverageLabelEl.textContent = `${percent}%`;
      coverageBadgeEl.textContent = `${label} (${percent}%)`;
      coverageBadgeEl.dataset.state = state;

      const coverageLine = arch === 'decoder'
        ? `${visible} / ${L} prior tokens visible at t = ${t}`
        : arch === 'encdec'
          ? `Full source (${L}) + ${Math.max(0, t - 1)} generated history accessible`
          : `All ${L} tokens mutually visible (bidirectional)`;

      const copy = ARCH_COPY[arch];
      insightTextEl.textContent = copy.summary;
      const bullets = [coverageLine, ...copy.bullets];
      insightListEl.innerHTML = bullets.map((text) => `<li>${text}</li>`).join('');
    }

    function guidance(arch, t, L) {
      const parts = [];
      if (arch === 'encoder') {
        parts.push('Encoder: full bidirectional context – ideal for representation (classify, retrieve, embed).');
      } else if (arch === 'decoder') {
        parts.push('Decoder: causal left-to-right generation.');
        parts.push(`Step t = ${t}: uses ${Math.max(0, t - 1)} / ${L} prior tokens.`);
      } else if (arch === 'encdec') {
        parts.push('Encoder–decoder: global source memory + causal target stream.');
        parts.push(`Step t = ${t}: full source (${L}) + ${Math.max(0, t - 1)} generated history.`);
      }
      if (L > 6) parts.push('Longer inputs amplify encoder strength but slow decoder steps.');
      return parts.join(' ');
    }

    function render() {
      const arch = archSel.value;
      let L = parseInt(lenEl.value, 10);
      if (!Number.isFinite(L)) L = 8;
      L = Math.max(2, Math.min(12, L));

      let t = parseInt(stepEl.value, 10);
      if (!Number.isFinite(t)) t = 1;
      t = Math.max(1, Math.min(L, t));
      stepEl.max = String(L);

      const coverage = arch === 'decoder' ? (L > 0 ? (t - 1) / L : 0) : 1;
      const visible = arch === 'decoder' ? Math.max(0, t - 1) : L;

      buildRail(arch, L, t);
      renderFlow(arch);
      renderCoverage(arch, coverage, visible, L, t);

      const copy = ARCH_COPY[arch];
      lensNoteEl.textContent = copy.lensNote;

      const header = `
        <div class="flex items-center gap-2 mb-2">
          <span class="${arch === 'encoder' ? 'chip chip-success' : arch === 'decoder' ? 'chip chip-accent' : 'chip chip-warning'} text-xs q46-chip">${arch === 'encoder' ? 'Encoder-only' : arch === 'decoder' ? 'Decoder-only' : 'Encoder–decoder'}</span>
          <span class="small-caption">(L = ${L}, t = ${t})</span>
        </div>
      `;
      explEl.innerHTML = `${header}<p>${messages[arch]}</p>`;

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([explEl]).catch(() => {});
      }

      if (guideEl) {
        guideEl.textContent = guidance(arch, t, L);
      }
    }

    function updateHash() {
      const params = new URLSearchParams({ arch: archSel.value, t: stepEl.value, L: lenEl.value });
      const newHash = `#question-46?${params.toString()}`;
      if (location.hash !== newHash) history.replaceState(null, '', newHash);
    }

    function applyPreset(name) {
      if (name === 'enc-cls') { archSel.value = 'encoder'; lenEl.value = '8'; stepEl.value = '1'; }
      else if (name === 'dec-early') { archSel.value = 'decoder'; lenEl.value = '10'; stepEl.value = '2'; }
      else if (name === 'dec-late') { archSel.value = 'decoder'; lenEl.value = '12'; stepEl.value = '10'; }
      else if (name === 'encdec-early') { archSel.value = 'encdec'; lenEl.value = '8'; stepEl.value = '2'; }
      else if (name === 'encdec-late') { archSel.value = 'encdec'; lenEl.value = '10'; stepEl.value = '8'; }
      render();
      updateHash();
    }

    function initFromHash() {
      if (!location.hash) return;
      const match = location.hash.match(/question-46\?(.*)$/);
      if (!match) return;
      const params = new URLSearchParams(match[1]);
      if (params.get('arch')) archSel.value = params.get('arch');
      if (params.get('t')) stepEl.value = params.get('t');
      if (params.get('L')) lenEl.value = params.get('L');
    }

    if (!archSel.dataset.q46Bound) {
      archSel.dataset.q46Bound = 'true';
      archSel.addEventListener('change', () => { render(); updateHash(); });
    }
    if (!stepEl.dataset.q46Bound) {
      stepEl.dataset.q46Bound = 'true';
      stepEl.addEventListener('input', () => { render(); updateHash(); });
    }
    if (!lenEl.dataset.q46Bound) {
      lenEl.dataset.q46Bound = 'true';
      lenEl.addEventListener('change', () => { render(); updateHash(); });
      lenEl.addEventListener('input', () => { render(); updateHash(); });
    }
    document.querySelectorAll('[data-q46-preset]').forEach((btn) => {
      if (!btn.dataset.q46Bound) {
        btn.dataset.q46Bound = 'true';
        btn.addEventListener('click', () => applyPreset(btn.getAttribute('data-q46-preset')));
      }
    });

    initFromHash();
    render();
    updateHash();
  };

  attemptInit();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question46Interactive = interactiveScript;
}
