// Question 1: Tokenization
const question = {
    title: "1. What does tokenization entail, and why is it critical for LLMs?",
    answer: `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔤 What is Tokenization?</h4>
            <p class="text-blue-800">Tokenization breaks down raw text into smaller units called <strong>tokens</strong> that LLMs can process. Think of it as cutting up a sentence into digestible pieces.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Word-level</h5>
                <p class="text-sm text-green-700">Splits by spaces and punctuation</p>
                <code class="text-xs bg-green-100 px-1 rounded">"Hello world!" → ["Hello", "world", "!"]</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Subword (BPE)</h5>
                <p class="text-sm text-purple-700">Breaks words into meaningful parts</p>
                <code class="text-xs bg-purple-100 px-1 rounded">"unhappy" → ["un", "happy"]</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Character-level</h5>
                <p class="text-sm text-orange-700">Each character is a token</p>
                <code class="text-xs bg-orange-100 px-1 rounded">"hi" → ["h", "i"]</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Vocabulary Size:</strong> Affects model memory and training time</li>
                <li>• <strong>Unknown Words:</strong> Subword tokenization handles new terms better</li>
                <li>• <strong>Languages:</strong> Different strategies work better for different languages</li>
                <li>• <strong>Efficiency:</strong> Fewer tokens = faster processing</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Tokenization Explorer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q1-text-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Enter Text to Tokenize</label>
                <input type="text" id="q1-text-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="The unbelievable transformation is happening!">
                <p class="text-xs text-gray-600 mt-1">Try different text to see how tokenization changes!</p>
            </div>
            
            <!-- Strategy Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Tokenization Strategy</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q1-strategy" value="word" checked class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Word-level</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Simple</span>
                            </div>
                            <p class="text-xs text-gray-600">Splits text by spaces and punctuation</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "Hello!" → ["Hello", "!"]
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q1-strategy" value="subword" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Subword (BPE)</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Smart</span>
                            </div>
                            <p class="text-xs text-gray-600">Breaks words into meaningful parts</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "unhappy" → ["un", "happy"]
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q1-strategy" value="char" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Character-level</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Detailed</span>
                            </div>
                            <p class="text-xs text-gray-600">Each character becomes a token</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                "hi" → ["h", "i"]
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q1-oov-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "cryptocurrency blockchain technology"</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Tokenization Results</h4>
                    <div id="q1-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q1-output" class="min-h-[80px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
                <div id="q1-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q1-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Why This Strategy?</h4>
                <div id="q1-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            const input = document.getElementById('q1-text-input');
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
            input.addEventListener('input', tokenize);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateStrategyVisuals();
                    tokenize();
                });
            });
            
            // Initial setup
            updateStrategyVisuals();
            tokenize();
        }
    }
};
