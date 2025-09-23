const interactiveScript = () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q2-text-select');
            const sentenceDisplay = document.getElementById('q2-sentence-display');
            const attentionRadios = document.querySelectorAll('input[name="q2-attention-type"]');
            const exampleBtn = document.getElementById('q2-example-btn');
            const attentionIndicator = document.getElementById('q2-attention-indicator');
            const legend = document.getElementById('q2-legend');
            const explanationContent = document.getElementById('q2-explanation-content');

            const STRATEGY_TONES = {
                semantic: 'var(--tone-emerald-strong)',
                syntactic: 'var(--tone-purple-strong)',
                positional: 'var(--tone-amber-strong)'
            };

            const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || name;

            function mixColor(tone, percentage, base = 'var(--color-card)') {
                const remainder = Math.max(0, 100 - percentage);
                return `color-mix(in srgb, ${tone} ${percentage}%, ${base} ${remainder}%)`;
            }

            function getStrategyTone(type) {
                return STRATEGY_TONES[type] || STRATEGY_TONES.semantic;
            }

            function resetStrategyStyles(container) {
                if (!container) return;
                container.classList.remove('question-strategy-active');
                container.style.background = 'var(--color-card)';
                container.style.borderColor = 'var(--color-border-subtle)';
                container.style.boxShadow = 'none';
                container.style.color = 'var(--color-body)';
            }

            function applyStrategyStyles(container, tone) {
                if (!container) return;
                container.classList.add('question-strategy-active');
                container.style.background = mixColor(tone, 12);
                container.style.borderColor = mixColor(tone, 32, 'var(--color-border-subtle)');
                container.style.boxShadow = '0 12px 26px -18px rgba(15, 23, 42, 0.55)';
                container.style.color = mixColor(tone, 65, 'var(--color-heading)');
            }

            function resetWordState(el) {
                if (!el) return;
                el.classList.remove('is-active', 'attn-high', 'attn-med', 'attn-low', 'q2-word-hint');
                el.setAttribute('aria-pressed', 'false');
            }

            function selectWord(index, words) {
                if (!Array.isArray(words) || index < 0 || index >= wordElements.length) return;
                wordElements.forEach(resetWordState);
                const target = wordElements[index];
                if (!target) return;
                target.classList.add('is-active');
                target.setAttribute('aria-pressed', 'true');
                currentQueryIndex = index;
                visualizeAttention(index, words);
            }

            // Check if required elements exist
            if (!input || !sentenceDisplay) {
                console.error('Required DOM elements not found for Question 2');
                return;
            }

            let wordElements = [];
            let currentQueryIndex = -1;

            // Attention pattern configurations
            const attentionPatterns = {
                semantic: {
                    name: 'Semantic Attention',
                    description: 'Focuses on words with related meanings and semantic relationships',
                    getScore: (queryWord, keyWord, queryIndex, keyIndex, words) => {
                        const q = queryWord.toLowerCase();
                        const k = keyWord.toLowerCase();
                        
                        // Semantic relationships
                        const semanticPairs = {
                            'cat': ['mouse', 'chased', 'animal'],
                            'mouse': ['cat', 'chased', 'cheese'],
                            'chased': ['cat', 'mouse', 'ran', 'pursued'],
                            'car': ['drove', 'road', 'traffic', 'stopped'],
                            'red': ['car', 'color', 'bright'],
                            'traffic': ['light', 'car', 'stopped', 'road'],
                            'light': ['traffic', 'bright', 'stopped'],
                            'stopped': ['car', 'traffic', 'light'],

                            // Curated examples vocabulary
                            'machine': ['learning', 'models', 'process'],
                            'learning': ['machine', 'models', 'process'],
                            'models': ['machine', 'learning', 'process', 'language', 'text'],
                            'process': ['models', 'text', 'language'],
                            'natural': ['language', 'text'],
                            'language': ['natural', 'text', 'models'],
                            'text': ['language', 'process'],

                            'intelligent': ['student', 'solved'],
                            'student': ['intelligent', 'solved', 'problem'],
                            'difficult': ['problem'],
                            'problem': ['difficult', 'solved'],
                            'quickly': ['solved'],

                            'beautiful': ['flowers', 'garden'],
                            'flowers': ['beautiful', 'bloom', 'spring', 'garden'],
                            'bloom': ['flowers', 'spring', 'garden'],
                            'spring': ['garden', 'flowers', 'bloom'],
                            'garden': ['flowers', 'spring', 'bloom']
                        };
                        
                        if (semanticPairs[q] && semanticPairs[q].includes(k)) {
                            return 0.8 + Math.random() * 0.15;
                        }
                        
                        // Articles with nouns
                        if ((q === 'the' || q === 'a') && ['cat', 'mouse', 'car', 'garden', 'traffic', 'light', 'student', 'problem', 'flowers', 'models', 'language', 'text'].includes(k)) {
                            return 0.4 + Math.random() * 0.2;
                        }

                        // Common adjective-noun pairs in curated sentences
                        const adjNounPairs = [
                            ['red', 'car'],
                            ['intelligent', 'student'],
                            ['difficult', 'problem'],
                            ['beautiful', 'flowers'],
                            ['natural', 'language']
                        ];
                        if (adjNounPairs.some(([a, n]) => (q === a && k === n) || (q === n && k === a))) {
                            return 0.75 + Math.random() * 0.15;
                        }
                        
                        return 0.05 + Math.random() * 0.1;
                    }
                },
                syntactic: {
                    name: 'Syntactic Attention',
                    description: 'Focuses on grammatical relationships and sentence structure',
                    getScore: (queryWord, keyWord, queryIndex, keyIndex, words) => {
                        const q = queryWord.toLowerCase();
                        const k = keyWord.toLowerCase();
                        const distance = Math.abs(queryIndex - keyIndex);
                        
                        // Subject-verb-object relationships
                        if (q === 'chased' && (k === 'cat' || k === 'mouse')) {
                            return 0.9;
                        }
                        if ((q === 'cat' || q === 'mouse') && k === 'chased') {
                            return 0.7;
                        }

                        // Curated SVO patterns
                        if ((q === 'models' && k === 'process') || (q === 'process' && (k === 'models' || k === 'text' || k === 'language'))) {
                            return q === 'models' ? 0.85 : 0.8;
                        }
                        if ((q === 'student' && k === 'solved') || (q === 'solved' && (k === 'student' || k === 'problem'))) {
                            return q === 'student' ? 0.85 : 0.8;
                        }
                        if ((q === 'flowers' && k === 'bloom') || (q === 'bloom' && (k === 'flowers' || k === 'spring' || k === 'garden'))) {
                            return q === 'flowers' ? 0.85 : 0.8;
                        }
                        
                        // Determiner-noun relationships
                        if (q === 'the' && distance === 1) {
                            return 0.8;
                        }
                        if (['cat', 'mouse', 'car', 'garden', 'light', 'student', 'problem', 'flowers', 'models', 'language', 'text'].includes(q) && k === 'the' && distance === 1) {
                            return 0.6;
                        }
                        
                        // Adjective-noun relationships
                        if (q === 'red' && k === 'car' && distance === 1) {
                            return 0.85;
                        }
                        if (q === 'traffic' && k === 'light' && distance === 1) {
                            return 0.85;
                        }
                        if (q === 'intelligent' && k === 'student' && distance === 1) {
                            return 0.85;
                        }
                        if (q === 'difficult' && k === 'problem' && distance === 1) {
                            return 0.85;
                        }
                        if (q === 'beautiful' && k === 'flowers' && distance === 1) {
                            return 0.85;
                        }
                        if (q === 'natural' && k === 'language' && distance === 1) {
                            return 0.85;
                        }
                        
                        // Preposition relationships
                        if (q === 'through' && (k === 'chased' || k === 'garden')) {
                            return 0.6;
                        }
                        if (q === 'in' && (k === 'bloom' || k === 'spring' || k === 'garden')) {
                            return 0.6;
                        }
                        
                        return 0.05 + Math.random() * 0.1;
                    }
                },
                positional: {
                    name: 'Positional Attention',
                    description: 'Focuses on words based on their proximity in the sentence',
                    getScore: (queryWord, keyWord, queryIndex, keyIndex, words) => {
                        const distance = Math.abs(queryIndex - keyIndex);
                        
                        if (distance === 0) return 0;
                        if (distance === 1) return 0.8 + Math.random() * 0.15;
                        if (distance === 2) return 0.5 + Math.random() * 0.2;
                        if (distance === 3) return 0.3 + Math.random() * 0.15;
                        
                        return Math.max(0.05, 0.8 / (distance + 1) + Math.random() * 0.1);
                    }
                }
            };

            // Get current attention pattern
            function getCurrentAttentionType() {
                const selectedRadio = document.querySelector('input[name="q2-attention-type"]:checked');
                return selectedRadio ? selectedRadio.value : 'semantic';
            }

            // Update attention type visual indicators
            function updateAttentionTypeVisuals() {
                const selected = document.querySelector('input[name="q2-attention-type"]:checked');
                if (!selected) return;

                document.querySelectorAll('input[name="q2-attention-type"]').forEach((radio) => {
                    const container = radio.closest('.question-strategy');
                    if (!container) return;

                    const tone = getStrategyTone(radio.value);
                    if (radio.checked) {
                        applyStrategyStyles(container, tone);
                    } else {
                        resetStrategyStyles(container);
                    }
                });

                const tone = getStrategyTone(selected.value);
                if (attentionIndicator) {
                    const labelEl = attentionIndicator.querySelector('.attention-indicator-label');
                    if (labelEl) {
                        labelEl.textContent = attentionPatterns[selected.value]?.name || 'Attention pattern';
                    }
                    attentionIndicator.style.background = mixColor(tone, 14);
                    attentionIndicator.style.borderColor = mixColor(tone, 26, 'var(--color-border-subtle)');
                    attentionIndicator.style.color = mixColor(tone, 60, 'var(--color-heading)');
                    const dot = attentionIndicator.querySelector('.attention-indicator-dot');
                    if (dot) {
                        dot.style.background = mixColor(tone, 55, 'transparent');
                        dot.style.boxShadow = `0 0 0 2px ${mixColor(tone, 22, 'transparent')}`;
                    }
                }
            }

            // Render sentence as clickable tokens
                        function renderSentence() {
                const sentenceText = (input.value || '').trim();
                const words = sentenceText.split(/\s+/).filter(Boolean);

                sentenceDisplay.innerHTML = '';

                const canvas = document.createElement('canvas');
                canvas.id = 'q2-canvas';
                canvas.className = 'q2-canvas-layer';
                sentenceDisplay.appendChild(canvas);

                const hint = document.createElement('div');
                hint.className = 'q2-sentence-hint';
                hint.textContent = 'Click any word to inspect attention strength';
                sentenceDisplay.appendChild(hint);

                wordElements = [];
                currentQueryIndex = -1;

                if (!words.length) {
                    const empty = document.createElement('div');
                    empty.className = 'q2-empty-state';
                    empty.innerHTML = '<p class="q2-empty-state-title">Select a sentence to begin</p><p>Try &ldquo;The cat chased the mouse&rdquo;</p>';
                    sentenceDisplay.appendChild(empty);
                    clearCanvas();
                    updateExplanation();
                    if (legend) legend.innerHTML = '';
                    const labelEl = attentionIndicator?.querySelector('.attention-indicator-label');
                    if (labelEl) labelEl.textContent = 'Choose an attention pattern';
                    return;
                }

                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.className = 'q2-word';
                    span.dataset.index = index;
                    span.setAttribute('role', 'button');
                    span.setAttribute('tabindex', '0');
                    span.setAttribute('aria-pressed', 'false');
                    span.title = `Click to see how "${word}" routes attention`;
                    const handleSelect = () => {
                        selectWord(index, words);
                        wordElements.forEach(el => el.classList.remove('q2-word-hint'));
                    };
                    span.addEventListener('click', handleSelect);
                    span.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleSelect();
                        }
                    });
                    sentenceDisplay.appendChild(span);
                    wordElements.push(span);
                });

                if (wordElements.length > 0) {
                    const firstWord = wordElements[0];
                    firstWord.classList.add('q2-word-hint');
                    setTimeout(() => {
                        if (currentQueryIndex === -1) {
                            firstWord.classList.add('q2-word-hint');
                        } else {
                            firstWord.classList.remove('q2-word-hint');
                        }
                    }, 1200);
                }

                clearCanvas();
                updateExplanation();
                if (legend) legend.innerHTML = '';
                const labelEl = attentionIndicator?.querySelector('.attention-indicator-label');
                if (labelEl) labelEl.textContent = 'Click a word below';
            }
            // Clear canvas
            function clearCanvas() {
                const canvas = document.getElementById('q2-canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    canvas.width = sentenceDisplay.offsetWidth;
                    canvas.height = sentenceDisplay.offsetHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }

            // Visualize attention connections
            function visualizeAttention(queryIndex, words) {
                const canvas = document.getElementById('q2-canvas');
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                canvas.width = sentenceDisplay.offsetWidth;
                canvas.height = sentenceDisplay.offsetHeight;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const queryWordEl = wordElements[queryIndex];
                const queryWord = words[queryIndex];
                const attentionType = getCurrentAttentionType();
                const pattern = attentionPatterns[attentionType];

                const toneIndigo = getCssVar('--tone-indigo-strong') || '#4f46e5';
                const toneIndigoSoft = getCssVar('--tone-indigo-soft') || toneIndigo;

                // Reset non-query word highlights before applying new ones
                wordElements.forEach((el, idx) => {
                    if (idx === queryIndex) return;
                    el.classList.remove('attn-high', 'attn-med', 'attn-low');
                });

                const attentionScores = [];

                wordElements.forEach((keyWordEl, keyIndex) => {
                    if (queryIndex === keyIndex) return;

                    const keyWord = words[keyIndex];
                    const attentionScore = pattern.getScore(queryWord, keyWord, queryIndex, keyIndex, words);
                    attentionScores.push({ index: keyIndex, score: attentionScore });

                    // Calculate positions
                    const rect1 = queryWordEl.getBoundingClientRect();
                    const rect2 = keyWordEl.getBoundingClientRect();
                    const containerRect = sentenceDisplay.getBoundingClientRect();
                    
                    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
                    const y1 = rect1.top + rect1.height / 2 - containerRect.top;
                    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
                    const y2 = rect2.top + rect2.height / 2 - containerRect.top;

                    // Draw curved connection with higher, more visible arcs
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Significantly increase arc height for better visibility
                    const baseArcHeight = Math.max(60, dist * 0.8); // Minimum 60px height
                    const attentionArcHeight = baseArcHeight + (attentionScore * 40); // Stronger attention = higher arc
                    const arcHeight = Math.min(attentionArcHeight, 120); // Cap at 120px
                    
                    // Create control point for quadratic curve
                    const cp1x = midX - dy / dist * arcHeight;
                    const cp1y = midY + dx / dist * arcHeight;

                    // Draw line with opacity and thickness based on attention score
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
                    
                    // Make lines more visible with stronger colors and better opacity
                    const alpha = Math.max(0.35, Math.min(attentionScore * 1.2, 1));
                    ctx.save();
                    ctx.strokeStyle = toneIndigo;
                    ctx.globalAlpha = alpha;
                    ctx.lineWidth = Math.max(3, attentionScore * 10);
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();
                    ctx.restore();

                    if (attentionScore > 0.3) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
                        ctx.strokeStyle = toneIndigoSoft;
                        ctx.globalAlpha = 0.18;
                        ctx.lineWidth = Math.max(8, attentionScore * 16);
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.stroke();
                        ctx.restore();
                    }

                    if (attentionScore > 0.6) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
                        ctx.strokeStyle = toneIndigoSoft;
                        ctx.globalAlpha = 0.1;
                        ctx.lineWidth = Math.max(15, attentionScore * 24);
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.stroke();
                        ctx.restore();
                    }

                    // Highlight key words with attention
                    if (attentionScore > 0.5) {
                        keyWordEl.classList.add('attn-high');
                    } else if (attentionScore > 0.3) {
                        keyWordEl.classList.add('attn-med');
                    } else if (attentionScore > 0.15) {
                        keyWordEl.classList.add('attn-low');
                    }
                });

                // Create legend
                createLegend(attentionScores.sort((a, b) => b.score - a.score), words);
                
                // Update attention indicator
                if (attentionIndicator) {
                    const strongConnections = attentionScores.filter(s => s.score > 0.5).length;
                    const mediumConnections = attentionScores.filter(s => s.score > 0.3 && s.score <= 0.5).length;
                    const labelEl = attentionIndicator?.querySelector('.attention-indicator-label');
                    if (labelEl) {
                        labelEl.textContent = `"${queryWord}" - ${strongConnections} strong, ${mediumConnections} medium`;
                    }
                    if (attentionIndicator) {
                        attentionIndicator.setAttribute('aria-label', `Attention summary for ${queryWord}`);
                    }
                }
                
                // Update explanation
                updateExplanation(queryWord, attentionType, pattern.description);
            }

            // Create attention scores legend
            function createLegend(sortedScores, words) {
                if (!legend) return;
                
                const topScores = sortedScores.slice(0, 5);
                const legendItems = topScores.map(item => {
                    const strength = item.score > 0.7 ? 'Strong' : item.score > 0.4 ? 'Medium' : 'Weak';
                        const strengthClass = item.score > 0.7
                        ? 'legend-strength legend-strength-strong'
                        : item.score > 0.4
                            ? 'legend-strength legend-strength-medium'
                            : 'legend-strength legend-strength-weak';
                    return `<span class="${strengthClass}">${words[item.index]}: ${strength} (${item.score.toFixed(2)})</span>`;
                }).join('');
                
                legend.innerHTML = legendItems ? `<div class="legend-summary">${legendItems}</div>` : '';
            }

            // Update educational explanation
            function updateExplanation(queryWord = null, attentionType = null, description = null) {
                if (!explanationContent) return;
                
                if (!queryWord) {
                    explanationContent.innerHTML = 'Select an attention pattern above and click on a word to see how the attention mechanism connects it to other words. The thickness of the connection lines represents the attention strength.';
                    return;
                }
                
                const explanations = {
                    'semantic': `
                        <strong>Semantic Attention for "${queryWord}":</strong> ${description}
                        <br>&bull; The model identifies words with related meanings (nouns with their actions, related concepts)
                        <br>&bull; Thicker lines show stronger semantic relationships
                        <br>&bull; This helps the model understand the meaning and context of "${queryWord}"
                    `,
                    'syntactic': `
                        <strong>Syntactic Attention for "${queryWord}":</strong> ${description}
                        <br>&bull; The model focuses on grammatical relationships (subject-verb, determiner-noun, etc.)
                        <br>&bull; Stronger connections to grammatically related words
                        <br>&bull; This helps the model understand the role of "${queryWord}" in the sentence structure
                    `,
                    'positional': `
                        <strong>Positional Attention for "${queryWord}":</strong> ${description}
                        <br>&bull; The model gives higher attention to nearby words
                        <br>&bull; Attention strength decreases with distance
                        <br>&bull; This helps the model capture local context around "${queryWord}"
                    `
                };
                
                explanationContent.innerHTML = explanations[attentionType] || 'Unknown attention type';
            }

            // Example cycling functionality
            const examples = [
                { text: 'The red car stopped at the traffic light', type: 'semantic', note: 'Great for showing semantic relationships between traffic-related words' },
                { text: 'The intelligent student solved the difficult problem quickly', type: 'syntactic', note: 'Demonstrates grammatical relationships between adjectives, nouns, and verbs' },
                { text: 'Machine learning models process natural language text', type: 'positional', note: 'Shows how positional attention connects nearby technical terms' },
                { text: 'The cat chased the mouse through the garden', type: 'semantic', note: 'Classic example showing action-subject-object relationships' },
                { text: 'Beautiful flowers bloom in the spring garden', type: 'syntactic', note: 'Shows adjective-noun and prepositional phrase relationships' }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    input.value = example.text;
                    document.querySelector(`input[name="q2-attention-type"][value="${example.type}"]`).checked = true;
                    updateAttentionTypeVisuals();
                    renderSentence();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    exampleBtn.innerHTML = `Try: "${nextExample.text.substring(0, 30)}${nextExample.text.length > 30 ? '...' : ''}"`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            input.addEventListener('change', renderSentence);
            attentionRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateAttentionTypeVisuals();
                    if (currentQueryIndex >= 0) {
                        const words = input.value.split(/\s+/).filter(Boolean);
                        if (currentQueryIndex < words.length) {
                            selectWord(currentQueryIndex, words);
                        }
                    } else {
                        updateExplanation();
                    }
                });
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (currentQueryIndex >= 0) {
                    setTimeout(() => {
                        const words = input.value.split(/\s+/).filter(Boolean);
                        if (currentQueryIndex < words.length) {
                            visualizeAttention(currentQueryIndex, words);
                        }
                    }, 100);
                }
            });
            
            // Initial setup
            updateAttentionTypeVisuals();
            renderSentence();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question02Interactive = interactiveScript;
}

