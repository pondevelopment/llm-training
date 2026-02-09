const interactiveScript = () => {
            // Visualization mode management
            const vizTypeRadios = document.querySelectorAll('input[name="q7-viz-type"]');
            const similarityPanel = document.getElementById('q7-similarity-panel');
            const arithmeticPanel = document.getElementById('q7-arithmetic-panel');
            const contextPanel = document.getElementById('q7-context-panel');
            const svgSpace = document.getElementById('q7-svg-space');
            const tooltip = document.getElementById('q7-hover-tooltip');
            const explanation = document.getElementById('q7-explanation');
            
            // Common controls
            const exampleBtn = document.getElementById('q7-example-btn');
            const randomBtn = document.getElementById('q7-random-btn');

            const getCssVar = (name, fallback) => {
                const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
                return value || fallback;
            };

            const mixColor = (tone, percentage, base) => {
                const pct = Math.max(0, Math.min(percentage, 100));
                const remainder = Math.max(0, 100 - pct);
                const fallback = base || getCssVar('--color-card', '#f1f5f9');
                return 'color-mix(in srgb, ' + tone + ' ' + pct + '%, ' + fallback + ' ' + remainder + '%)';
            };

            const resetStrategyStyles = (frame) => {
                if (!frame) return;
                frame.classList.remove('question-strategy-active');
                frame.style.background = '';
                frame.style.borderColor = '';
                frame.style.boxShadow = '';
                frame.style.color = '';
                const inner = frame.querySelector('.stacked-card');
                if (inner) {
                    inner.style.background = '';
                    inner.style.borderColor = '';
                    inner.style.boxShadow = '';
                    inner.style.color = '';
                }
                const badge = frame.querySelector('.stacked-card .chip');
                if (badge) {
                    badge.style.borderColor = '';
                    badge.style.background = '';
                    badge.style.color = '';
                }
            };

            const applyStrategyStyles = (frame, tone) => {
                if (!frame) return;
                const cardColor = getCssVar('--color-card', '#f1f5f9');
                const borderSubtle = getCssVar('--color-border-subtle', '#e2e8f0');
                const heading = getCssVar('--color-heading', '#0f172a');
                const darkMode = document.documentElement.classList.contains('dark');

                const intensities = darkMode ? {
                    bg: 36,
                    border: 56,
                    text: 68,
                    innerText: 68,
                    badgeBorder: 44,
                    badgeBg: 20,
                    badgeText: 72,
                    shadow: '0 24px 48px -26px rgba(15, 23, 42, 0.55)'
                } : {
                    bg: 16,
                    border: 28,
                    text: 42,
                    innerText: 46,
                    badgeBorder: 22,
                    badgeBg: 8,
                    badgeText: 56,
                    shadow: '0 18px 36px -28px rgba(15, 23, 42, 0.18)'
                };

                frame.classList.add('question-strategy-active');
                frame.style.background = mixColor(tone, intensities.bg, cardColor);
                frame.style.borderColor = mixColor(tone, intensities.border, borderSubtle);
                frame.style.boxShadow = intensities.shadow;
                frame.style.color = mixColor(tone, intensities.text, heading);

                const inner = frame.querySelector('.stacked-card');
                if (inner) {
                    inner.style.background = 'transparent';
                    inner.style.borderColor = 'transparent';
                    inner.style.boxShadow = 'none';
                    inner.style.color = mixColor(tone, intensities.innerText, heading);
                }

                const badge = frame.querySelector('.stacked-card .chip');
                if (badge) {
                    badge.style.borderColor = mixColor(tone, intensities.badgeBorder, borderSubtle);
                    badge.style.background = mixColor(tone, intensities.badgeBg, cardColor);
                    badge.style.color = mixColor(tone, intensities.badgeText, heading);
                }
            };

            const STRATEGY_TONES = {
                similarity: 'var(--tone-sky-strong)',
                arithmetic: 'var(--tone-purple-strong)',
                context: 'var(--tone-emerald-strong)'
            };

            // Simplified word embeddings for demonstration (normally 512+ dimensions)
            const embeddings = {
                // Animals cluster
                'cat': { x: 0.18, y: 0.68, vector: [0.8, 0.2, 0.1, 0.9, 0.3] },
                'dog': { x: 0.32, y: 0.58, vector: [0.7, 0.3, 0.2, 0.8, 0.4] },
                'kitten': { x: 0.12, y: 0.78, vector: [0.85, 0.15, 0.05, 0.95, 0.2] },
                'puppy': { x: 0.36, y: 0.48, vector: [0.75, 0.25, 0.15, 0.85, 0.35] },
                'tiger': { x: 0.24, y: 0.38, vector: [0.6, 0.4, 0.3, 0.7, 0.5] },

                // Royalty/People cluster
                'king': { x: 0.74, y: 0.82, vector: [0.1, 0.9, 0.8, 0.2, 0.7] },
                'queen': { x: 0.84, y: 0.7, vector: [0.2, 0.8, 0.7, 0.3, 0.8] },
                'prince': { x: 0.62, y: 0.88, vector: [0.15, 0.85, 0.75, 0.25, 0.65] },
                'princess': { x: 0.9, y: 0.78, vector: [0.25, 0.75, 0.65, 0.35, 0.75] },
                'man': { x: 0.58, y: 0.52, vector: [0.3, 0.7, 0.4, 0.4, 0.6] },
                'woman': { x: 0.66, y: 0.46, vector: [0.4, 0.6, 0.3, 0.5, 0.7] },

                // Geography cluster
                'france': { x: 0.12, y: 0.12, vector: [0.5, 0.1, 0.9, 0.6, 0.2] },
                'germany': { x: 0.22, y: 0.16, vector: [0.45, 0.15, 0.85, 0.65, 0.25] },
                'paris': { x: 0.08, y: 0.08, vector: [0.55, 0.05, 0.95, 0.55, 0.15] },
                'berlin': { x: 0.26, y: 0.2, vector: [0.4, 0.2, 0.8, 0.7, 0.3] },

                // Emotions cluster
                'happy': { x: 0.44, y: 0.36, vector: [0.2, 0.3, 0.1, 0.8, 0.9] },
                'sad': { x: 0.52, y: 0.2, vector: [0.8, 0.7, 0.9, 0.2, 0.1] },
                'joy': { x: 0.34, y: 0.28, vector: [0.1, 0.2, 0.05, 0.9, 0.95] },
                'angry': { x: 0.6, y: 0.24, vector: [0.9, 0.8, 0.7, 0.1, 0.2] },

                // Actions cluster
                'walk': { x: 0.74, y: 0.44, vector: [0.3, 0.4, 0.2, 0.6, 0.5] },
                'run': { x: 0.82, y: 0.38, vector: [0.2, 0.5, 0.3, 0.7, 0.6] },
                'walking': { x: 0.68, y: 0.48, vector: [0.35, 0.35, 0.25, 0.65, 0.55] },
                'running': { x: 0.88, y: 0.36, vector: [0.15, 0.55, 0.35, 0.75, 0.65] },

                // Tech cluster
                'computer': { x: 0.32, y: 0.4, vector: [0.6, 0.1, 0.3, 0.4, 0.8] },
                'programming': { x: 0.28, y: 0.44, vector: [0.7, 0.05, 0.25, 0.3, 0.85] },
                'algorithm': { x: 0.38, y: 0.36, vector: [0.65, 0.15, 0.35, 0.35, 0.75] }
            };
            // Enhanced word relationships for contextual examples
            const contextualExamples = {
                'bank': {
                    financial: {
                        sentence: "I went to the bank to deposit money.",
                        neighbors: ['money', 'deposit', 'account', 'financial'],
                        vector: [0.1, 0.9, 0.8, 0.2, 0.1]
                    },
                    river: {
                        sentence: "We sat by the bank of the river.",
                        neighbors: ['river', 'shore', 'water', 'edge'],
                        vector: [0.8, 0.1, 0.2, 0.9, 0.8]
                    }
                },
                'bark': {
                    dog: {
                        sentence: "The dog's bark was very loud.",
                        neighbors: ['dog', 'sound', 'noise', 'animal'],
                        vector: [0.8, 0.2, 0.1, 0.9, 0.3]
                    },
                    tree: {
                        sentence: "The bark of the oak tree was rough.",
                        neighbors: ['tree', 'wood', 'surface', 'rough'],
                        vector: [0.2, 0.8, 0.9, 0.1, 0.7]
                    }
                },
                'bat': {
                    animal: {
                        sentence: "The bat flew through the cave.",
                        neighbors: ['animal', 'flying', 'cave', 'mammal'],
                        vector: [0.9, 0.1, 0.2, 0.8, 0.3]
                    },
                    sports: {
                        sentence: "He swung the baseball bat hard.",
                        neighbors: ['baseball', 'sports', 'swing', 'equipment'],
                        vector: [0.1, 0.9, 0.8, 0.2, 0.7]
                    }
                }
            };

            let currentMode = 'similarity';
            let currentQueryWord = document.getElementById('q7-query-word') ? document.getElementById('q7-query-word').value : 'king';

            // Calculate cosine similarity between vectors
            function calculateCosineSimilarity(vec1, vec2) {
                if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
                
                const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
                const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
                const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
                if (!magnitude1 || !magnitude2) return 0;

                return dotProduct / (magnitude1 * magnitude2);
            }

            // Render embedding space visualization
            function renderEmbeddingSpace() {
                svgSpace.innerHTML = '';

                const cardColor = getCssVar('--color-card', '#f1f5f9');
                const headingTone = getCssVar('--color-heading', '#0f172a');
                const toneQuery = getCssVar('--tone-sky-strong', '#0ea5e9');
                const toneSimilar = getCssVar('--tone-emerald-strong', '#10b981');
                const toneHighlight = getCssVar('--tone-amber-strong', '#f59e0b');
                const mutedTone = getCssVar('--color-muted', '#64748b');
                const darkMode = document.documentElement.classList.contains('dark');

                const queryFill = mixColor(toneQuery, darkMode ? 72 : 58, cardColor);
                const similarFill = mixColor(toneSimilar, darkMode ? 64 : 46, cardColor);
                const midFill = mixColor(toneHighlight, darkMode ? 52 : 38, cardColor);
                const otherFill = mixColor(mutedTone, darkMode ? 28 : 16, cardColor);
                const strokeColor = mixColor(headingTone, darkMode ? 42 : 18, cardColor);

                tooltip.style.background = mixColor(headingTone, darkMode ? 44 : 78, cardColor);
                tooltip.style.color = cardColor;

                Object.entries(embeddings).forEach(([word, data]) => {
                    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    group.setAttribute('cursor', 'pointer');

                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    const padding = 36;
                    // Use rendered dimensions first, fall back to computed style so the scatter fills the canvas even before layout settles.
                    let { width, height } = svgSpace.getBoundingClientRect();
                    if (!width || !height) {
                        const style = getComputedStyle(svgSpace);
                        width = parseFloat(style.width) || 560;
                        height = parseFloat(style.height) || 320;
                    }
                    const usableWidth = Math.max(40, width - padding * 2);
                    const usableHeight = Math.max(40, height - padding * 2);
                    const cx = padding + data.x * usableWidth;
                    const cy = padding + (1 - data.y) * usableHeight;

                    circle.setAttribute('cx', cx);
                    circle.setAttribute('cy', cy);
                    circle.setAttribute('r', '6');

                    const isQuery = currentMode === 'similarity' && word === currentQueryWord;
                    let fill = otherFill;
                    if (currentMode === 'similarity' && currentQueryWord && embeddings[currentQueryWord]) {
                        if (isQuery) {
                            fill = queryFill;
                        } else {
                            const similarity = calculateCosineSimilarity(embeddings[currentQueryWord].vector, data.vector);
                            if (similarity > 0.7) {
                                fill = similarFill;
                            } else if (similarity > 0.5) {
                                fill = midFill;
                            }
                        }
                    }

                    const baseRadius = isQuery ? 9 : 6;
                    circle.setAttribute('r', String(baseRadius));
                    circle.setAttribute('fill', fill);
                    circle.setAttribute('stroke', isQuery ? mixColor(toneQuery, darkMode ? 85 : 65, cardColor) : strokeColor);
                    circle.setAttribute('stroke-width', isQuery ? '3' : '2');

                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', cx);
                    label.setAttribute('y', cy - 12);
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('font-size', '12');
                    label.setAttribute('font-weight', '600');
                    label.setAttribute('fill', isQuery ? mixColor(toneQuery, 80, headingTone) : headingTone);
                    label.textContent = word;

                    group.addEventListener('mouseenter', (event) => {
                        circle.setAttribute('r', String(baseRadius + 2));
                        circle.setAttribute('stroke-width', String(isQuery ? 4 : 3));
                        let similarityLabel = 'N/A';
                        if (currentQueryWord && embeddings[currentQueryWord]) {
                            const value = calculateCosineSimilarity(embeddings[currentQueryWord].vector, data.vector) * 100;
                            similarityLabel = value.toFixed(1) + '%';
                        }
                        tooltip.textContent = word + ' (similarity: ' + similarityLabel + ')';
                        tooltip.style.opacity = '1';
                        tooltip.style.left = (event.pageX + 12) + 'px';
                        tooltip.style.top = (event.pageY - 28) + 'px';
                    });

                    group.addEventListener('mouseleave', () => {
                        circle.setAttribute('r', String(baseRadius));
                        circle.setAttribute('stroke-width', String(isQuery ? 3 : 2));
                        tooltip.style.opacity = '0';
                    });

                    group.addEventListener('click', () => {
                        if (currentMode === 'similarity' && word !== currentQueryWord) {
                            const select = document.getElementById('q7-query-word');
                            if (select) {
                                select.value = word;
                                searchSimilarWords();
                            }
                        }
                    });

                    group.appendChild(circle);
                    group.appendChild(label);
                    svgSpace.appendChild(group);
                });
            }


            function updateModeCards() {
                vizTypeRadios.forEach((radio) => {
                    const frame = radio.closest('.question-strategy');
                    resetStrategyStyles(frame);
                    if (radio.checked) {
                        const tone = STRATEGY_TONES[radio.value];
                        applyStrategyStyles(frame, tone);
                    }
                });
            }

            // Mode switching
            function switchMode(mode) {
                currentMode = mode;
                
                // Hide all panels
                similarityPanel.classList.add('hidden');
                arithmeticPanel.classList.add('hidden');
                contextPanel.classList.add('hidden');
                
                // Show selected panel and update explanation
                switch(mode) {
                    case 'similarity':
                        similarityPanel.classList.remove('hidden');
                        explanation.textContent = "Semantic similarity reveals how close words are in meaning. Words with similar contexts cluster together in embedding space.";
                        break;
                    case 'arithmetic':
                        arithmeticPanel.classList.remove('hidden');
                        explanation.textContent = "Vector arithmetic lets us explore word relationships mathematically (illustrative only; modern sentence embeddings don't guarantee analogies).";
                        break;
                    case 'context':
                        contextPanel.classList.remove('hidden');
                        explanation.textContent = "Contextual embeddings show how the same word can have different meanings based on surrounding context.";
                        updateContextComparison();
                        break;
                }
                
                updateModeCards();
                renderEmbeddingSpace();
            }

            // Similarity search functionality
            function searchSimilarWords() {
                const querySelect = document.getElementById('q7-query-word');
                const resultsDiv = document.getElementById('q7-similarity-results');
                if (!querySelect || !resultsDiv) return;

                const queryWord = querySelect.value;
                currentQueryWord = queryWord;

                const similarities = Object.entries(embeddings)
                    .filter(([word]) => word !== queryWord)
                    .map(([word, data]) => ({
                        word: word,
                        similarity: calculateCosineSimilarity(embeddings[queryWord].vector, data.vector)
                    }))
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 6);

                resultsDiv.innerHTML = '';
                similarities.forEach((item) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.classList.add('panel', 'panel-neutral');
                    button.style.display = 'flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'space-between';
                    button.style.width = '100%';
                    button.style.padding = '0.75rem';
                    button.style.gap = '0.75rem';

                    const wordLabel = document.createElement('span');
                    wordLabel.classList.add('font-medium', 'text-heading');
                    wordLabel.textContent = item.word;

                    const badge = document.createElement('span');
                    badge.classList.add('chip', 'text-xs');
                    if (item.similarity > 0.7) {
                        badge.classList.add('chip-success');
                    } else if (item.similarity > 0.5) {
                        badge.classList.add('chip-warning');
                    } else {
                        badge.classList.add('chip-neutral');
                    }
                    badge.textContent = (item.similarity * 100).toFixed(1) + '%';

                    button.append(wordLabel, badge);
                    button.addEventListener('click', () => {
                        querySelect.value = item.word;
                        searchSimilarWords();
                    });

                    resultsDiv.appendChild(button);
                });

                renderEmbeddingSpace();
            }

            // Vector arithmetic functionality
            function calculateVectorArithmetic() {
                const wordA = document.getElementById('q7-word-a');
                const wordB = document.getElementById('q7-word-b');
                const wordC = document.getElementById('q7-word-c');
                const resultDiv = document.getElementById('q7-arithmetic-result');
                if (!wordA || !wordB || !wordC || !resultDiv) return;

                const vector = embeddings[wordA.value].vector.map((val, index) => {
                    return val - embeddings[wordB.value].vector[index] + embeddings[wordC.value].vector[index];
                });

                const candidates = Object.entries(embeddings)
                    .filter(([word]) => ![wordA.value, wordB.value, wordC.value].includes(word))
                    .map(([word, data]) => ({
                        word: word,
                        similarity: calculateCosineSimilarity(vector, data.vector)
                    }))
                    .sort((a, b) => b.similarity - a.similarity);

                const best = candidates[0];
                if (!best) return;

                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '0.75rem';
                container.style.alignItems = 'center';

                const chipsRow = document.createElement('div');
                chipsRow.style.display = 'flex';
                chipsRow.style.flexWrap = 'wrap';
                chipsRow.style.alignItems = 'center';
                chipsRow.style.justifyContent = 'center';
                chipsRow.style.gap = '0.5rem';
                chipsRow.style.fontFamily = "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace";

                const buildChip = (label, toneClass) => {
                    const chip = document.createElement('span');
                    chip.classList.add('chip', toneClass, 'text-sm');
                    chip.textContent = label;
                    return chip;
                };

                chipsRow.appendChild(buildChip(wordA.value, 'chip-info'));
                chipsRow.appendChild(document.createTextNode(' − '));
                chipsRow.appendChild(buildChip(wordB.value, 'chip-warning'));
                chipsRow.appendChild(document.createTextNode(' + '));
                chipsRow.appendChild(buildChip(wordC.value, 'chip-success'));
                chipsRow.appendChild(document.createTextNode(' = '));
                chipsRow.appendChild(buildChip(best.word, 'chip-accent'));

                const confidence = document.createElement('div');
                confidence.classList.add('small-caption', 'text-muted');
                confidence.textContent = 'Confidence: ' + (best.similarity * 100).toFixed(1) + '%';

                const alternatives = document.createElement('div');
                alternatives.classList.add('small-caption', 'text-muted');
                const strong = document.createElement('strong');
                strong.textContent = 'Top alternatives:';
                alternatives.appendChild(strong);
                alternatives.appendChild(document.createTextNode(' ' + candidates.slice(1, 4).map((c) => c.word).join(', ')));

                container.appendChild(chipsRow);
                container.appendChild(confidence);
                container.appendChild(alternatives);

                resultDiv.innerHTML = '';
                resultDiv.appendChild(container);
            }

            // Context comparison functionality
            function updateContextComparison() {
                const selectedWord = document.getElementById('q7-context-word').value;
                const [word] = selectedWord.split(' ');
                
                if (contextualExamples[word]) {
                    const contexts = contextualExamples[word];
                    const contextKeys = Object.keys(contexts);
                    
                    // Update context displays
                    document.getElementById('q7-context-a').textContent = contexts[contextKeys[0]].sentence;
                    document.getElementById('q7-context-b').textContent = contexts[contextKeys[1]].sentence;
                    
                    document.getElementById('q7-context-a-neighbors').textContent = 
                        contexts[contextKeys[0]].neighbors.join(', ');
                    document.getElementById('q7-context-b-neighbors').textContent = 
                        contexts[contextKeys[1]].neighbors.join(', ');
                    
                    // Calculate similarity between contexts
                    const similarity = calculateCosineSimilarity(
                        contexts[contextKeys[0]].vector,
                        contexts[contextKeys[1]].vector
                    );
                    
                    document.getElementById('q7-context-similarity').textContent = similarity.toFixed(3);
                }
            }

            // Example scenarios
            function loadExamples() {
                const examples = [
                    { mode: 'similarity', word: 'king', description: 'Explore royal vocabulary' },
                    { mode: 'arithmetic', a: 'king', b: 'man', c: 'woman', description: 'Classic analogy' },
                    { mode: 'similarity', word: 'happy', description: 'Emotion concepts' }
                ];
                
                const randomExample = examples[Math.floor(Math.random() * examples.length)];
                
                if (randomExample.mode === 'similarity') {
                    document.querySelector('input[name="q7-viz-type"][value="similarity"]').checked = true;
                    switchMode('similarity');
                    document.getElementById('q7-query-word').value = randomExample.word;
                    searchSimilarWords();
                } else if (randomExample.mode === 'arithmetic') {
                    document.querySelector('input[name="q7-viz-type"][value="arithmetic"]').checked = true;
                    switchMode('arithmetic');
                    document.getElementById('q7-word-a').value = randomExample.a;
                    document.getElementById('q7-word-b').value = randomExample.b;
                    document.getElementById('q7-word-c').value = randomExample.c;
                    calculateVectorArithmetic();
                }
            }

            function loadRandomWord() {
                const words = Object.keys(embeddings);
                const randomWord = words[Math.floor(Math.random() * words.length)];
                
                document.getElementById('q7-query-word').value = randomWord;
                if (currentMode === 'similarity') {
                    searchSimilarWords();
                }
            }

            // Event listeners
            vizTypeRadios.forEach((radio) => {
                radio.addEventListener('change', (event) => {
                    switchMode(event.target.value);
                });
            });
            
            document.getElementById('q7-calculate-btn').addEventListener('click', calculateVectorArithmetic);
            document.getElementById('q7-context-word').addEventListener('change', updateContextComparison);
            if (exampleBtn) exampleBtn.addEventListener('click', loadExamples);
            if (randomBtn) randomBtn.addEventListener('click', loadRandomWord);
            
            // Allow change event for search (since it's now a dropdown)
            document.getElementById('q7-query-word').addEventListener('change', searchSimilarWords);

            const themeObserver = new MutationObserver((mutations) => {
                if (mutations.some((mutation) => mutation.type === 'attributes')) {
                    updateModeCards();
                    renderEmbeddingSpace();
                }
            });
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

            // Initialize
            updateModeCards();
            switchMode('similarity');
            searchSimilarWords();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question07Interactive = interactiveScript;
}
