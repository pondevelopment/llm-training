const interactiveScript = () => {
            // Inject minimal styles once for clickable words if not present
            if (!document.getElementById('q2-clickable-style')) {
                const style = document.createElement('style');
                style.id = 'q2-clickable-style';
                style.textContent = `.q2-word{position:relative;cursor:pointer;transition:color .15s, background-color .15s, box-shadow .15s;padding:2px 4px;border-radius:4px;}
                .q2-word:hover{background:rgba(99,102,241,0.12);color:#3730a3;box-shadow:0 0 0 1px rgba(99,102,241,0.25);} 
                .q2-word.selected{background:rgba(99,102,241,0.25);color:#1e1b4b;font-weight:600;}
                .q2-word.attn-high{background:linear-gradient(90deg,rgba(251,191,36,0.55),rgba(253,230,138,0.4));}
                .q2-word.attn-med{background:linear-gradient(90deg,rgba(251,191,36,0.35),rgba(253,230,138,0.25));}
                .q2-word.attn-low{background:linear-gradient(90deg,rgba(251,191,36,0.18),rgba(253,230,138,0.12));}`;
                document.head.appendChild(style);
            }
            // Get DOM elements with error checking
            const input = document.getElementById('q2-text-select');
            const sentenceDisplay = document.getElementById('q2-sentence-display');
            const attentionRadios = document.querySelectorAll('input[name="q2-attention-type"]');
            const exampleBtn = document.getElementById('q2-example-btn');
            const attentionIndicator = document.getElementById('q2-attention-indicator');
            const legend = document.getElementById('q2-legend');
            const explanationContent = document.getElementById('q2-explanation-content');

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
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q2-attention-type"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update attention indicator
                if (attentionIndicator && attentionPatterns[selectedValue]) {
                    attentionIndicator.textContent = attentionPatterns[selectedValue].name;
                }
            }

            // Render sentence as clickable tokens
            function renderSentence() {
                const sentenceText = input.value;
                const words = sentenceText.split(' ').filter(w => w.length > 0);
                
                if (words.length === 0) {
                    sentenceDisplay.innerHTML = '<div class="text-center text-gray-500 py-8"><p class="text-lg mb-2">📝 Enter text above to begin</p><p class="text-sm">Try: "The cat chased the mouse"</p></div>';
                    return;
                }
                
                // Clear previous content but keep canvas
                sentenceDisplay.innerHTML = '<canvas id="q2-canvas" class="absolute top-0 left-0 w-full h-full pointer-events-none" style="z-index: 1;"></canvas>';
                wordElements = [];
                currentQueryIndex = -1;

                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.className = 'inline-block px-3 py-2 m-1 rounded cursor-pointer transition-all duration-200 hover:bg-blue-200 hover:shadow-md border-2 border-blue-200 bg-white text-gray-800 font-medium hover:border-blue-400 hover:scale-105';
                    span.style.cssText = 'position: relative; z-index: 2;';
                    span.dataset.index = index;
                    span.title = `Click to see what "${word}" pays attention to`;
                    sentenceDisplay.appendChild(span);
                    wordElements.push(span);

                    span.addEventListener('click', () => {
                        // Stop any pulsing animations
                        wordElements.forEach(el => {
                            el.classList.remove('animate-pulse');
                            el.style.animation = '';
                        });
                        
                        // Reset all word styles
                        wordElements.forEach(el => {
                            el.classList.remove('bg-blue-600', 'text-white', 'bg-blue-100', 'border-blue-600', 'shadow-lg', 'border-blue-300');
                            el.classList.add('border-blue-200', 'bg-white', 'text-gray-800');
                        });
                        
                        // Highlight selected word
                        span.classList.remove('border-blue-200', 'bg-white', 'text-gray-800');
                        span.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-lg');
                        
                        currentQueryIndex = index;
                        visualizeAttention(index, words);
                    });
                });

                // Add visual pulse animation to first word as a hint
                if (wordElements.length > 0) {
                    const firstWord = wordElements[0];
                    firstWord.classList.add('animate-pulse');
                    setTimeout(() => {
                        if (currentQueryIndex === -1) { // Only if user hasn't clicked yet
                            firstWord.classList.remove('animate-pulse');
                            firstWord.style.animation = 'pulse 2s infinite';
                        }
                    }, 1000);
                }

                // Clear canvas and explanation
                clearCanvas();
                updateExplanation();
                if (legend) legend.innerHTML = '';
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

                // Reset non-query word highlights before applying new ones
                wordElements.forEach((el, idx) => {
                    if (idx === queryIndex) return;
                    el.classList.remove('bg-blue-100', 'border-blue-300');
                    el.classList.add('border-blue-200', 'bg-white', 'text-gray-800');
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
                    const alpha = Math.max(0.4, Math.min(attentionScore * 1.5, 1));
                    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                    ctx.lineWidth = Math.max(3, attentionScore * 10);
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.stroke();

                    // Add a glowing effect for high attention scores
                    if (attentionScore > 0.3) {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
                        ctx.strokeStyle = `rgba(59, 130, 246, 0.15)`;
                        ctx.lineWidth = Math.max(8, attentionScore * 16);
                        ctx.stroke();
                    }

                    // Add an even softer outer glow for very high attention
                    if (attentionScore > 0.6) {
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.quadraticCurveTo(cp1x, cp1y, x2, y2);
                        ctx.strokeStyle = `rgba(59, 130, 246, 0.08)`;
                        ctx.lineWidth = Math.max(15, attentionScore * 24);
                        ctx.stroke();
                    }

                    // Highlight key words with attention
                    if (attentionScore > 0.5) {
                        keyWordEl.classList.remove('border-blue-200', 'bg-white');
                        keyWordEl.classList.add('bg-blue-100', 'border-blue-300');
                    } else if (attentionScore > 0.3) {
                        keyWordEl.classList.remove('border-blue-200', 'bg-white');
                        keyWordEl.classList.add('bg-blue-50', 'border-blue-300');
                    }
                });

                // Create legend
                createLegend(attentionScores.sort((a, b) => b.score - a.score), words);
                
                // Update attention indicator
                if (attentionIndicator) {
                    const strongConnections = attentionScores.filter(s => s.score > 0.5).length;
                    const mediumConnections = attentionScores.filter(s => s.score > 0.3 && s.score <= 0.5).length;
                    attentionIndicator.innerHTML = `🎯 "${queryWord}" — ${strongConnections} strong, ${mediumConnections} medium`;
                    attentionIndicator.className = strongConnections > 0
                        ? 'text-xs bg-green-100 text-green-700 px-3 py-1 rounded font-medium border border-green-200'
                        : mediumConnections > 0
                            ? 'text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded font-medium border border-blue-200'
                            : 'text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded font-medium border border-gray-200';
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
                    const color = item.score > 0.7 ? '#3730a3' : item.score > 0.4 ? '#6366f1' : '#a5b4fc';
                    
                    return `<span class="inline-flex items-center gap-1 text-xs mr-3">
                        <span class="w-3 h-1 rounded" style="background-color: ${color}"></span>
                        ${words[item.index]}: ${strength} (${item.score.toFixed(2)})
                    </span>`;
                }).join('');
                
                legend.innerHTML = `<div class="flex flex-wrap gap-1">${legendItems}</div>`;
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
                        <br>• The model identifies words with related meanings (nouns with their actions, related concepts)
                        <br>• Thicker lines show stronger semantic relationships
                        <br>• This helps the model understand the meaning and context of "${queryWord}"
                    `,
                    'syntactic': `
                        <strong>Syntactic Attention for "${queryWord}":</strong> ${description}
                        <br>• The model focuses on grammatical relationships (subject-verb, determiner-noun, etc.)
                        <br>• Stronger connections to grammatically related words
                        <br>• This helps the model understand the role of "${queryWord}" in the sentence structure
                    `,
                    'positional': `
                        <strong>Positional Attention for "${queryWord}":</strong> ${description}
                        <br>• The model gives higher attention to nearby words
                        <br>• Attention strength decreases with distance
                        <br>• This helps the model capture local context around "${queryWord}"
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
                        const words = input.value.split(' ').filter(w => w.length > 0);
                        if (currentQueryIndex < words.length) {
                            visualizeAttention(currentQueryIndex, words);
                        }
                    } else {
                        // No word selected yet; keep the generic explanation
                        updateExplanation();
                    }
                });
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (currentQueryIndex >= 0) {
                    setTimeout(() => {
                        const words = input.value.split(' ').filter(w => w.length > 0);
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
