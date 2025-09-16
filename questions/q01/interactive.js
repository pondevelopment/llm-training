const interactiveScript = () => {
            const input = document.getElementById('q1-text-select');
            const output = document.getElementById('q1-output');
            const strategyRadios = document.querySelectorAll('input[name="q1-strategy"]');
            const oovBtn = document.getElementById('q1-oov-btn');
            const strategyIndicator = document.getElementById('q1-strategy-indicator');
            const legend = document.getElementById('q1-legend');
            const explanation = document.getElementById('q1-explanation');

            // Enhanced subword vocabulary (simplified BPE-like)
            const subwordVocab = {
                // Common prefixes
                'un': ['un'], 'pre': ['pre'], 'anti': ['anti'], 'auto': ['auto'],
                'crypto': ['crypto'], 'micro': ['micro'], 'macro': ['macro'],
                'super': ['super'], 'inter': ['inter'], 'trans': ['trans'],
                
                // Common suffixes
                'tion': ['tion'], 'sion': ['sion'], 'ment': ['ment'], 'ing': ['ing'],
                'ed': ['ed'], 'er': ['er'], 'est': ['est'], 'ly': ['ly'],
                'ful': ['ful'], 'less': ['less'], 'ness': ['ness'], 'able': ['able'],
                'ical': ['ical'], 'ization': ['ization'], 'ational': ['ational'],
                
                // Tech and AI terms
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

            // Function to perform BPE-like subword tokenization
            function performSubwordTokenization(word) {
                const cleanWord = word.toLowerCase().replace(/[.,!?;:"'()]/g, '');
                
                // Check if we have a predefined tokenization
                if (subwordVocab[cleanWord]) {
                    return subwordVocab[cleanWord];
                }
                
                // Try to find subword components
                let result = [];
                let remaining = cleanWord;
                
                while (remaining.length > 0) {
                    let found = false;
                    
                    // Try to find the longest matching subword from the beginning
                    for (let len = Math.min(remaining.length, 8); len >= 2; len--) {
                        const substr = remaining.substring(0, len);
                        if (subwordVocab[substr]) {
                            result.push(substr);
                            remaining = remaining.substring(len);
                            found = true;
                            break;
                        }
                    }
                    
                    // If no subword found, take characters
                    if (!found) {
                        if (remaining.length <= 3) {
                            result.push(remaining);
                            break;
                        } else {
                            result.push(remaining.substring(0, 2));
                            remaining = remaining.substring(2);
                        }
                    }
                }
                
                return result.length > 0 ? result : [cleanWord];
            }

            // Get color for token type
            function getTokenColor(tokenType) {
                const colors = {
                    'word': '#dbeafe',      // light blue
                    'subword': '#e0e7ff',   // light indigo  
                    'char': '#fef3c7',      // light yellow
                    'punct': '#d1fae5',     // light green
                    'space': '#f3f4f6',     // light gray
                    'unknown': '#fecaca'    // light red
                };
                return colors[tokenType] || colors.unknown;
            }

            // Update strategy selection visuals
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="q1-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q1-strategy"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update strategy indicator
                const strategyNames = {
                    'word': 'Word-level Tokenization',
                    'subword': 'Subword (BPE) Tokenization', 
                    'char': 'Character-level Tokenization'
                };
                if (strategyIndicator) {
                    strategyIndicator.textContent = strategyNames[selectedValue];
                }
            }

            const tokenize = () => {
                const text = input.value;
                const selectedRadio = document.querySelector('input[name="q1-strategy"]:checked');
                if (!selectedRadio) return;
                
                const strategy = selectedRadio.value;
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                let tokens = [];

                updateStrategyVisuals();

                if (strategy === 'word') {
                    // Word-level tokenization
                    tokens = text.match(/\b\w+\b|[.,!?;:"'()]/g) || [];
                } else if (strategy === 'subword') {
                    // Subword tokenization
                    const words = text.match(/\b\w+\b|[.,!?;:"'()]/g) || [];
                    tokens = words.flatMap(word => {
                        if (/^[.,!?;:"'()]$/.test(word)) {
                            return [word];
                        }
                        return performSubwordTokenization(word);
                    });
                } else if (strategy === 'char') {
                    // Character-level tokenization
                    tokens = text.split('').map(char => char === ' ' ? '␣' : char);
                }

                // Create tokens display
                const tokenContainer = document.createElement('div');
                tokenContainer.className = 'flex flex-wrap gap-1 mb-4';
                
                const tokenTypes = new Set();
                
                tokens.forEach((token, index) => {
                    const el = document.createElement('span');
                    el.className = 'inline-flex items-center px-2 py-1 rounded text-sm font-mono border border-gray-300 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer';
                    el.textContent = token;
                    
                    // Determine token type and styling
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
                        tokenType = token === '␣' ? 'space' : 'char';
                        tokenInfo = token === '␣' ? 'Space character' : 'Character';
                    } else if (/^[.,!?;:"'()]$/.test(token)) {
                        tokenType = 'punct';
                        tokenInfo = 'Punctuation';
                    } else {
                        tokenType = 'word';
                        tokenInfo = 'Word token';
                    }
                    
                    tokenTypes.add(tokenType);
                    
                    // Style the token
                    el.style.backgroundColor = getTokenColor(tokenType);
                    el.style.color = '#374151';
                    
                    // Add detailed tooltip
                    const tokenId = 1000 + index;
                    el.title = `Token ${index + 1} (ID: ${tokenId})
Type: ${tokenInfo}
Length: ${token.length} chars
Text: "${token}"`;
                    
                    tokenContainer.appendChild(el);
                });

                output.appendChild(tokenContainer);

                // Add statistics
                const statsEl = document.createElement('div');
                statsEl.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white rounded border text-sm';
                statsEl.innerHTML = `
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600">${tokens.length}</div>
                        <div class="text-gray-600">Tokens</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600">${text.length}</div>
                        <div class="text-gray-600">Characters</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-purple-600">${((text.length / tokens.length) || 0).toFixed(1)}</div>
                        <div class="text-gray-600">Chars/Token</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-orange-600">${tokenTypes.size}</div>
                        <div class="text-gray-600">Token Types</div>
                    </div>
                `;
                output.appendChild(statsEl);

                // Create legend
                if (tokenTypes.size > 1 && legend) {
                    const legendItems = Array.from(tokenTypes).map(type => {
                        const labels = {
                            'word': '🔤 Word tokens',
                            'subword': '🧩 Subword pieces', 
                            'char': '🔡 Characters',
                            'punct': '⚡ Punctuation',
                            'space': '␣ Spaces'
                        };
                        return `<span class="inline-flex items-center gap-1 text-xs">
                            <span class="w-3 h-3 rounded border" style="background-color: ${getTokenColor(type)}"></span>
                            ${labels[type] || type}
                        </span>`;
                    }).join('');
                    
                    legend.innerHTML = `<div class="flex flex-wrap gap-3">${legendItems}</div>`;
                }

                // Update educational explanation
                updateExplanation(strategy, tokens.length, text.length, tokenTypes);
            };

            function updateExplanation(strategy, tokenCount, charCount, tokenTypes) {
                if (!explanation) return;
                
                const explanations = {
                    'word': `
                        <strong>Word-level tokenization</strong> splits text by spaces and punctuation. 
                        This is simple but creates problems with unknown words and large vocabularies.
                        <br>• <strong>Pros:</strong> Easy to understand, preserves word meaning
                        <br>• <strong>Cons:</strong> Can't handle new words, very large vocabulary
                    `,
                    'subword': `
                        <strong>Subword tokenization (BPE)</strong> breaks words into meaningful pieces. 
                        This is what most modern LLMs use! It balances vocabulary size with meaning.
                        <br>• <strong>Pros:</strong> Handles unknown words, reasonable vocabulary size
                        <br>• <strong>Cons:</strong> More complex, may break word boundaries
                    `,
                    'char': `
                        <strong>Character-level tokenization</strong> treats each character as a token.
                        This guarantees any text can be tokenized but creates very long sequences.
                        <br>• <strong>Pros:</strong> No unknown characters, smallest vocabulary
                        <br>• <strong>Cons:</strong> Very long sequences, loses word-level meaning
                    `
                };
                
                explanation.innerHTML = explanations[strategy];
            }

            // Enhanced example cycling
            const oovExamples = [
                { text: 'cryptocurrency blockchain technology', strategy: 'subword', note: 'Notice how technical terms are broken into meaningful parts!' },
                { text: 'The unbelievable transformation is happening!', strategy: 'subword', note: 'See how prefixes and suffixes are separated.' },
                { text: 'Hello, world! How are you today?', strategy: 'word', note: 'Simple word splitting - notice the punctuation.' },
                { text: 'AI revolutionizes everything continuously.', strategy: 'subword', note: 'Complex words become manageable subword pieces.' },
                { text: 'tokenization', strategy: 'char', note: 'Character-level creates many tokens from one word!' }
            ];
            
            let exampleIndex = 0;
            oovBtn.addEventListener('click', () => {
                const example = oovExamples[exampleIndex % oovExamples.length];
                input.value = example.text;
                document.querySelector(`input[name="q1-strategy"][value="${example.strategy}"]`).checked = true;
                tokenize();
                exampleIndex++;
                
                // Update button text
                const nextExample = oovExamples[exampleIndex % oovExamples.length];
                oovBtn.innerHTML = `Try: "${nextExample.text.substring(0, 25)}${nextExample.text.length > 25 ? '...' : ''}"`;
                oovBtn.title = nextExample.note;
            });

            // Event listeners
            input.addEventListener('change', tokenize);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateStrategyVisuals();
                    tokenize();
                });
            });
            
            // Initial setup
            updateStrategyVisuals();
            tokenize();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question01Interactive = interactiveScript;
}
