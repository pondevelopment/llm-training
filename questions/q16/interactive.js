const interactiveScript = () => {
  const selectEl = document.querySelector('#q16-text-select');
  const descriptionEl = document.querySelector('#q16-example-desc');
  const strategyRadios = Array.from(document.querySelectorAll('input[name="q16-strategy"]'));
  const sampleTextEl = document.querySelector('#q16-sample-text');
  const strategyCards = strategyRadios.map((radio) => radio.closest('.question-strategy'));
  const vocabSlider = document.querySelector('#q16-vocab-size');
  const vocabDisplay = document.querySelector('#q16-vocab-display');
  const freqSlider = document.querySelector('#q16-min-frequency');
  const freqDisplay = document.querySelector('#q16-freq-display');
  const indicatorEl = document.querySelector('#q16-strategy-indicator');
  const outputEl = document.querySelector('#q16-output');
  const tokenCountEl = document.querySelector('#q16-token-count');
  const oovCountEl = document.querySelector('#q16-oov-count');
  const compressionEl = document.querySelector('#q16-compression');
  const coverageEl = document.querySelector('#q16-coverage');
  const subwordListEl = document.querySelector('#q16-subword-list');
  const oovListEl = document.querySelector('#q16-oov-list');
  const explanationEl = document.querySelector('#q16-explanation');

  if (!selectEl || !descriptionEl || !sampleTextEl || strategyRadios.length === 0 || !vocabSlider || !freqSlider) {
    return;
  }

  const strategyMeta = {
    bpe: {
      label: 'Byte-Pair Encoding',
      chipClass: 'chip chip-success text-xs',
      summary: 'BPE keeps a compact vocabulary by merging the most common character pairs.'
    },
    sentencepiece: {
      label: 'SentencePiece',
      chipClass: 'chip chip-accent text-xs',
      summary: 'SentencePiece operates on raw bytes, so it stays robust on multilingual or emoji-heavy inputs.'
    },
    wordpiece: {
      label: 'WordPiece',
      chipClass: 'chip chip-warning text-xs',
      summary: 'WordPiece favours merges that improve likelihood and marks continuation fragments with ## prefixes.'
    }
  };

  const sampleTexts = [
    {
      id: 'launch',
      label: 'Launch blog blurb',
      description: 'Marketing copy with cryptography jargon and bespoke product names.',
      text: 'Our cryptoasset HyperLoopX accelerates cross-border settlements with zero-knowledge proofs.'
    },
    {
      id: 'clinical',
      label: 'Clinical trial note',
      description: 'Medical terminology with hyphenated conditions and longer compounds.',
      text: 'Dr. Alvarez prescribed neuroadaptive probiotics to stabilise post-COVID fatigue scores.'
    },
    {
      id: 'livestream',
      label: 'Livestream chat snippet',
      description: 'Casual chatter full of hashtags, domain names, and creative spellings.',
      text: 'Fans shouted "K-pop mega-tour" while livestreaming on HoloChat.jp and tagging everything #hyperboost.'
    }
  ];

  const subwordOverrides = {
    cryptoasset: { common: ['crypto', 'asset'] },
    hyperloopx: { common: ['hyper', 'loop', 'x'] },
    settlements: { common: ['settle', 'ments'] },
    zeroknowledge: { common: ['zero', 'knowledge'] },
    alvarez: { common: ['al', 'varez'] },
    neuroadaptive: { common: ['neuro', 'adaptive'] },
    probiotics: { common: ['pro', 'biotics'] },
    stabilise: { common: ['stabil', 'ise'] },
    fatigue: { common: ['fati', 'gue'] },
    livestreaming: { common: ['live', 'stream', 'ing'] },
    holochat: { common: ['holo', 'chat'] },
    hyperboost: { common: ['hyper', 'boost'] },
    megatour: { common: ['mega', 'tour'] }
  };

  const state = {
    sampleId: sampleTexts[0].id,
    strategy: 'bpe',
    vocabSize: Number(vocabSlider.value || 50000),
    minFrequency: Number(freqSlider.value || 10)
  };

  const sentencePiecePrefix = String.fromCharCode(0x2581);

  function formatNumber(value) {
    if (value >= 1000) {
      const rounded = Math.round(value / 100) / 10;
      if (rounded >= 10) {
        return `${Math.round(rounded)}K`;
      }
      return `${rounded.toFixed(1)}K`;
    }
    return value.toString();
  }

  function tokeniseText(sampleText, strategy) {
    const segments = sampleText.trim().match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]+/gu) || [];
    const vocabPressure = 1 - Math.max(0, Math.min(1, (state.vocabSize - 1000) / (100000 - 1000)));
    const freqPressure = Math.max(0, Math.min(1, (state.minFrequency - 1) / (100 - 1)));
    const pressure = Math.max(0, Math.min(1, (vocabPressure * 0.7) + (freqPressure * 0.5)));

    const tokens = [];
    const details = [];
    let wordCount = 0;

    segments.forEach((segment) => {
      const isWord = /[\p{L}\p{N}]/u.test(segment);
      if (!isWord) {
        tokens.push(segment);
        return;
      }

      wordCount += 1;
      const lower = segment.toLowerCase();
      const override = subwordOverrides[lower];
      let slices;

      if (override && (override[strategy] || override.common)) {
        slices = [...(override[strategy] || override.common)];
      } else {
        slices = fallbackSplit(lower);
      }

      const pressured = applyPressure(slices, pressure);
      const finalPieces = formatPieces(pressured, strategy);

      tokens.push(...finalPieces);
      if (finalPieces.length > 1) {
        details.push({ word: segment, pieces: finalPieces });
      }
    });

    return { tokens, details, wordCount };
  }

  function fallbackSplit(word) {
    if (word.length <= 4) {
      return [word];
    }
    if (word.length <= 7) {
      const mid = Math.ceil(word.length / 2);
      return [word.slice(0, mid), word.slice(mid)];
    }
    const third = Math.ceil(word.length / 3);
    return [word.slice(0, third), word.slice(third, third * 2), word.slice(third * 2)];
  }

  function applyPressure(pieces, pressure) {
    if (pressure <= 0.2) {
      return pieces;
    }

    const adjusted = [];
    pieces.forEach((piece) => {
      const cleaned = piece.replace(/[^a-z0-9]/gi, '');
      if (cleaned.length <= 3) {
        adjusted.push(piece);
        return;
      }

      if (pressure > 0.75 && cleaned.length > 5) {
        const third = Math.max(2, Math.ceil(cleaned.length / 3));
        adjusted.push(piece.slice(0, third), piece.slice(third, third * 2), piece.slice(third * 2));
      } else if (pressure > 0.45 && cleaned.length > 5) {
        const mid = Math.ceil(cleaned.length / 2);
        adjusted.push(piece.slice(0, mid), piece.slice(mid));
      } else {
        adjusted.push(piece);
      }
    });

    return adjusted.filter(Boolean);
  }

  function formatPieces(pieces, strategy) {
    if (strategy === 'sentencepiece') {
      return pieces.map((piece, index) => (index === 0 ? sentencePiecePrefix + piece : piece));
    }
    if (strategy === 'wordpiece') {
      return pieces.map((piece, index) => (index === 0 ? piece : `##${piece}`));
    }
    return pieces;
  }

  function renderTokenStream(tokens) {
    outputEl.innerHTML = '';
    if (!tokens.length) {
      const empty = document.createElement('div');
      empty.className = 'text-sm panel-muted text-center';
      empty.textContent = 'Tokens will appear here...';
      outputEl.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    tokens.forEach((token) => {
      const span = document.createElement('span');
      span.className = 'chip chip-neutral text-xs q16-token';
      span.textContent = token;
      fragment.appendChild(span);
    });
    outputEl.appendChild(fragment);
  }

  function renderLists(details) {
    subwordListEl.innerHTML = '';
    oovListEl.innerHTML = '';

    if (details.length === 0) {
      const empty = document.createElement('li');
      empty.textContent = 'All words stayed intact. No fallback subwords needed.';
      empty.className = 'panel-muted';
      subwordListEl.appendChild(empty.cloneNode(true));
      oovListEl.appendChild(empty);
      return;
    }

    details.forEach((detail, index) => {
      const text = `${detail.word} -> ${detail.pieces.join(' | ')}`;
      const li = document.createElement('li');
      li.textContent = text;
      subwordListEl.appendChild(li);

      if (index < 6) {
        const oovLi = document.createElement('li');
        oovLi.textContent = text;
        oovListEl.appendChild(oovLi);
      }
    });
  }

  function updateExplanation(tokens, details, wordCount) {
    const meta = strategyMeta[state.strategy];
    const vocabSummary = `${formatNumber(state.vocabSize)} token vocab`;
    const freqSummary = `min frequency ${state.minFrequency}`;
    const splitSummary = details.length
      ? `${details.length} words split (${details.slice(0, 2).map((d) => d.word).join(', ')}${details.length > 2 ? ', ...' : ''}).`
      : 'No words needed additional splitting.';

    explanationEl.textContent = `${meta.summary} With a ${vocabSummary} and ${freqSummary}, this sample yields ${tokens.length} tokens from ${wordCount} words. ${splitSummary}`;
  }

  function updateUI() {
    const sample = sampleTexts.find((item) => item.id === state.sampleId) || sampleTexts[0];
    const { tokens, details, wordCount } = tokeniseText(sample.text, state.strategy);

    descriptionEl.textContent = sample.description;
    sampleTextEl.textContent = sample.text;

    const meta = strategyMeta[state.strategy];
    indicatorEl.className = meta.chipClass;
    indicatorEl.textContent = meta.label;

    strategyCards.forEach((card) => {
      if (!card) {
        return;
      }
      const input = card.querySelector('input[name="q16-strategy"]');
      card.classList.toggle('question-strategy-active', input?.value === state.strategy);
    });

    renderTokenStream(tokens);
    renderLists(details);
    updateExplanation(tokens, details, wordCount);

    tokenCountEl.textContent = tokens.length;
    oovCountEl.textContent = details.length;

    const compressionRatio = wordCount === 0 ? 1 : wordCount / Math.max(tokens.length, 1);
    compressionEl.textContent = `${compressionRatio.toFixed(1)}x`;

    const vocabPressure = 1 - Math.max(0, Math.min(1, (state.vocabSize - 1000) / (100000 - 1000)));
    const coverage = Math.max(55, Math.min(100, Math.round(100 - (details.length / Math.max(wordCount, 1)) * 45 - vocabPressure * 20)));
    coverageEl.textContent = `${coverage}%`;
  }

  function hydrateSelectors() {
    selectEl.innerHTML = '';
    sampleTexts.forEach((sample) => {
      const option = document.createElement('option');
      option.value = sample.id;
      option.textContent = sample.label;
      selectEl.appendChild(option);
    });
    selectEl.value = state.sampleId;
  }

  function attachEvents() {
    selectEl.addEventListener('change', (event) => {
      state.sampleId = event.target.value;
      updateUI();
    });

    strategyRadios.forEach((radio) => {
      radio.addEventListener('change', (event) => {
        if (event.target.checked) {
          state.strategy = event.target.value;
          updateUI();
        }
      });
    });

    vocabSlider.addEventListener('input', (event) => {
      state.vocabSize = Number(event.target.value);
      vocabDisplay.textContent = formatNumber(state.vocabSize);
      updateUI();
    });

    freqSlider.addEventListener('input', (event) => {
      state.minFrequency = Number(event.target.value);
      freqDisplay.textContent = state.minFrequency;
      updateUI();
    });
  }

  hydrateSelectors();
  vocabDisplay.textContent = formatNumber(state.vocabSize);
  freqDisplay.textContent = state.minFrequency;
  attachEvents();
  updateUI();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question16Interactive = interactiveScript;
}
