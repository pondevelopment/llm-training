const interactiveScript = () => {
    const input = document.getElementById('q1-text-select');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const output = document.getElementById('q1-output');
    const strategyRadios = document.querySelectorAll('input[name="q1-strategy"]');
    const oovBtn = document.getElementById('q1-oov-btn');
    const strategyIndicator = document.getElementById('q1-strategy-indicator');
    const legend = document.getElementById('q1-legend');
    const explanation = document.getElementById('q1-explanation');

    if (!input || !output || !strategyRadios.length) {
        return;
    }

    const SPACE_GLYPH = '␣';

    const STRATEGY_TONES = {
        word: 'var(--tone-emerald-strong)',
        subword: 'var(--tone-purple-strong)',
        char: 'var(--tone-amber-strong)'
    };

    const TOKEN_TONES = {
        word: 'var(--tone-sky-strong)',
        subword: 'var(--tone-purple-strong)',
        char: 'var(--tone-amber-strong)',
        punct: 'var(--tone-emerald-strong)',
        space: 'var(--accent-border)',
        unknown: 'var(--tone-rose-strong)'
    };

    const subwordVocab = {
        'un': ['un'], 'pre': ['pre'], 'anti': ['anti'], 'auto': ['auto'],
        'crypto': ['crypto'], 'micro': ['micro'], 'macro': ['macro'],
        'super': ['super'], 'inter': ['inter'], 'trans': ['trans'],
        'tion': ['tion'], 'sion': ['sion'], 'ment': ['ment'], 'ing': ['ing'],
        'ed': ['ed'], 'er': ['er'], 'est': ['est'], 'ly': ['ly'],
        'ful': ['ful'], 'less': ['less'], 'ness': ['ness'], 'able': ['able'],
        'ical': ['ical'], 'ization': ['ization'], 'ational': ['ational'],
        'token': ['token'], 'model': ['model'], 'language': ['language'],
        'transform': ['transform'], 'attention': ['attention'],
        'embed': ['embed'], 'neural': ['neural'], 'network': ['network'],
        'artificial': ['art', 'ific', 'ial'], 'intelligence': ['intel', 'lig', 'ence'],
        'machine': ['mach', 'ine'], 'learning': ['learn', 'ing'],
        'deep': ['deep'], 'algorithm': ['algo', 'rithm'],
        'technology': ['tech', 'nol', 'ogy'], 'innovation': ['innov', 'ation'],
        'blockchain': ['block', 'chain'], 'cryptocurrency': ['crypto', 'currency'],
        'believe': ['be', 'lieve'], 'unbelievable': ['un', 'believ', 'able'],
        'transformation': ['trans', 'form', 'ation'], 'happening': ['happen', 'ing'],
        'development': ['develop', 'ment'], 'programming': ['program', 'ming']
    };

    function performSubwordTokenization(word) {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:"'()]/g, '');
        if (subwordVocab[cleanWord]) {
            return subwordVocab[cleanWord];
        }
        const result = [];
        let remaining = cleanWord;
        while (remaining.length > 0) {
            let found = false;
            for (let len = Math.min(remaining.length, 8); len >= 2; len--) {
                const candidate = remaining.substring(0, len);
                if (subwordVocab[candidate]) {
                    result.push(candidate);
                    remaining = remaining.substring(len);
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (remaining.length <= 3) {
                    result.push(remaining);
                    break;
                }
                result.push(remaining.substring(0, 2));
                remaining = remaining.substring(2);
            }
        }
        return result.length ? result : [cleanWord];
    }

    function mixColor(tone, percentage, base = 'var(--color-card)') {
        const remainder = Math.max(0, 100 - percentage);
        return `color-mix(in srgb, ${tone} ${percentage}%, ${base} ${remainder}%)`;
    }

    function getStrategyTone(strategy) {
        return STRATEGY_TONES[strategy] || STRATEGY_TONES.word;
    }

    function getTokenPalette(tokenType) {
        const tone = TOKEN_TONES[tokenType] || TOKEN_TONES.unknown;
        return {
            background: mixColor(tone, 18),
            border: mixColor(tone, 32, 'var(--color-border-subtle)'),
            text: mixColor(tone, 58, 'var(--color-heading)')
        };
    }

    function resetStrategyStyles(container) {
        container.classList.remove('question-strategy-active');
        container.style.background = getCssVar('--color-card', '#f1f5f9');
        container.style.borderColor = getCssVar('--color-border-subtle', '#e2e8f0');
        container.style.boxShadow = 'none';
        container.style.color = getCssVar('--color-body', '#1e293b');
    }

    function applyStrategyStyles(container, tone) {
        const darkMode = document.documentElement.classList.contains('dark');
        container.classList.add('question-strategy-active');
        container.style.background = mixColor(tone, 12);
        container.style.borderColor = mixColor(tone, 32, 'var(--color-border-subtle)');
        container.style.boxShadow = '0 12px 26px -18px rgba(15, 23, 42, 0.55)';
        container.style.color = mixColor(tone, darkMode ? 20 : 65, 'var(--color-heading)');
    }

    function updateStrategyVisuals() {
        const selected = document.querySelector('input[name="q1-strategy"]:checked');
        if (!selected) return;
        const selectedValue = selected.value;
        const tone = getStrategyTone(selectedValue);

        strategyRadios.forEach(radio => {
            const container = radio.closest('.question-strategy');
            if (!container) return;
            if (radio.checked) {
                applyStrategyStyles(container, tone);
            } else {
                resetStrategyStyles(container);
            }
        });

        const strategyNames = {
            word: 'Word-level Tokenization',
            subword: 'Subword (BPE) Tokenization',
            char: 'Character-level Tokenization'
        };

        if (strategyIndicator) {
            const dm = document.documentElement.classList.contains('dark');
            strategyIndicator.textContent = strategyNames[selectedValue];
            strategyIndicator.style.background = mixColor(tone, 14);
            strategyIndicator.style.borderColor = mixColor(tone, 28, 'var(--color-border-subtle)');
            strategyIndicator.style.color = mixColor(tone, dm ? 18 : 60, 'var(--color-heading)');
        }
    }

    const tokenize = () => {
        const text = input.value ?? '';
        const selectedRadio = document.querySelector('input[name="q1-strategy"]:checked');
        if (!selectedRadio) return;

        const strategy = selectedRadio.value;
        output.innerHTML = '';
        if (legend) legend.innerHTML = '';
        const tokenTypes = new Set();

        updateStrategyVisuals();

        let tokens = [];
        if (strategy === 'word' || strategy === 'subword') {
        const chunks = text.match(/\b\w+\b|[.,!?;:"'()]/g) || [];
            tokens = strategy === 'word'
                ? chunks
                : chunks.flatMap(chunk => /^[.,!?;:"'()]$/.test(chunk) ? [chunk] : performSubwordTokenization(chunk));
        } else {
            tokens = text.split('').map(char => char === ' ' ? SPACE_GLYPH : char);
        }

        const tokenContainer = document.createElement('div');
        tokenContainer.className = 'question-token-grid';

        tokens.forEach((token, index) => {
            const el = document.createElement('span');
            let tokenType = 'word';
            let tokenInfo = '';

            if (strategy === 'subword') {
                if (token.length <= 2 && /^[a-z]+$/.test(token)) {
                    tokenType = 'subword';
                    tokenInfo = 'Subword piece';
                } else if (subwordVocab[token]) {
                    tokenType = 'subword';
                    tokenInfo = 'Known subword';
                } else if (/^[.,!?;:"'()]$/.test(token)) {
                    tokenType = 'punct';
                    tokenInfo = 'Punctuation';
                } else {
                    tokenType = 'word';
                    tokenInfo = 'Word token';
                }
            } else if (strategy === 'char') {
                tokenType = token === SPACE_GLYPH ? 'space' : 'char';
                tokenInfo = token === SPACE_GLYPH ? 'Space character' : 'Character';
            } else if (/^[.,!?;:"'()]$/.test(token)) {
                tokenType = 'punct';
                tokenInfo = 'Punctuation';
            } else {
                tokenType = 'word';
                tokenInfo = 'Word token';
            }

            tokenTypes.add(tokenType);
            const palette = getTokenPalette(tokenType);
            el.className = 'question-token';
            el.dataset.tokenType = tokenType;
            el.textContent = token;
            el.style.background = palette.background;
            el.style.borderColor = palette.border;
            el.style.color = palette.text;

            const tokenId = 1000 + index;
            el.title = `Token ${index + 1} (ID: ${tokenId})
Type: ${tokenInfo}
Length: ${token.length} chars
Text: "${token}"`;

            tokenContainer.appendChild(el);
        });

        output.appendChild(tokenContainer);

        if (tokens.length) {
            const statsEl = document.createElement('div');
            statsEl.className = 'question-stats grid grid-cols-2 md:grid-cols-4';
            const stats = [
                { label: 'Tokens', value: tokens.length, tone: TOKEN_TONES.word },
                { label: 'Characters', value: text.length, tone: TOKEN_TONES.char },
                { label: 'Chars/token', value: ((text.length / tokens.length) || 0).toFixed(1), tone: TOKEN_TONES.subword },
                { label: 'Token types', value: tokenTypes.size, tone: getStrategyTone(strategy) }
            ];
            statsEl.innerHTML = stats.map(stat => {
                const valueColor = mixColor(stat.tone, 60, 'var(--color-heading)');
                const labelColor = mixColor(stat.tone, 28, 'var(--color-secondary)');
                return `<div class="question-stat">
                    <div class="question-stat-value" style="color:${valueColor}">${stat.value}</div>
                    <div class="question-stat-label" style="color:${labelColor}">${stat.label}</div>
                </div>`;
            }).join('');
            output.appendChild(statsEl);
        }

        if (tokenTypes.size && legend) {
            const legendItems = Array.from(tokenTypes).map(type => {
                const palette = getTokenPalette(type);
                const labels = {
                    word: '🔧 Word tokens',
                    subword: '🧩 Subword pieces',
                    char: '💡 Characters',
                    punct: '⚡ Punctuation',
                    space: '␣ Spaces'
                };
                return `<span class="question-legend-item">
                    <span class="question-legend-dot" style="background:${palette.background};border-color:${palette.border}"></span>
                    ${labels[type] || type}
                </span>`;
            }).join('');
            legend.innerHTML = legendItems;
        }

        updateExplanation(strategy, tokens.length, text.length, tokenTypes);
    };

    function updateExplanation(strategy) {
        if (!explanation) return;
        const explanations = {
            word: `<strong>Word-level tokenization</strong> splits text by spaces and punctuation.
                This is simple, but unseen words and large vocabularies become a problem.
                <br>• <strong>Pros:</strong> Easy to interpret, preserves word meaning
                <br>• <strong>Cons:</strong> Cannot handle new words gracefully, vocabulary explodes`,
            subword: `<strong>Subword tokenization (BPE)</strong> breaks words into meaningful pieces.
                Modern LLMs favour this because it balances vocabulary size with expressiveness.
                <br>• <strong>Pros:</strong> Handles unfamiliar words, keeps vocabulary manageable
                <br>• <strong>Cons:</strong> Adds complexity, may slice across word boundaries`,
            char: `<strong>Character-level tokenization</strong> treats every character as a token.
                You never hit unknown tokens, but sequences become very long.
                <br>• <strong>Pros:</strong> Works for any text, smallest vocabulary
                <br>• <strong>Cons:</strong> Long sequences, loses word-level semantics`
        };
        explanation.innerHTML = explanations[strategy] || '';
    }

    const oovExamples = [
        { text: 'cryptocurrency blockchain technology', strategy: 'subword', note: 'Technical terms split into meaningful pieces.' },
        { text: 'The unbelievable transformation is happening!', strategy: 'subword', note: 'Prefixes and suffixes become separate tokens.' },
        { text: 'Hello, world! How are you today?', strategy: 'word', note: 'Notice punctuation as separate tokens.' },
        { text: 'AI revolutionizes everything continuously.', strategy: 'subword', note: 'Complex words break into smaller parts.' },
        { text: 'tokenization', strategy: 'char', note: 'Character-level creates many tokens from one word.' }
    ];

    let exampleIndex = 0;
    if (oovBtn) {
        oovBtn.addEventListener('click', () => {
            const example = oovExamples[exampleIndex % oovExamples.length];
            input.value = example.text;
            const radio = document.querySelector(`input[name="q1-strategy"][value="${example.strategy}"]`);
            if (radio) radio.checked = true;
            tokenize();
            exampleIndex += 1;
            const nextExample = oovExamples[exampleIndex % oovExamples.length];
            oovBtn.textContent = `Try: "${nextExample.text.substring(0, 28)}${nextExample.text.length > 28 ? '…' : ''}"`;
            oovBtn.title = nextExample.note;
        });
    }

    input.addEventListener('change', tokenize);
    strategyRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateStrategyVisuals();
            tokenize();
        });
    });

    updateStrategyVisuals();
    tokenize();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question01Interactive = interactiveScript;
}
