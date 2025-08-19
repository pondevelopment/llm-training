// Question 16: Out-of-Vocabulary (OOV) Word Management in LLMs
// Created: July 11, 2025
// Educational Focus: Subword tokenization, BPE, SentencePiece, OOV handling, vocabulary coverage

const question = {
    title: "16. How do LLMs manage out-of-vocabulary (OOV) words?",
    answer: `
        <div class="space-y-4">
            <!-- Recommended Reading -->
            <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (if these terms are new)</h4>
                <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                    <li><a href="#question-1" class="text-indigo-700 underline hover:text-indigo-900">Question 1: What is tokenization and why does it matter?</a></li>
                    <li><a href="#question-12" class="text-indigo-700 underline hover:text-indigo-900">Question 12: Tokens vs. words — how are they different?</a></li>
                </ul>
            </div>

            <!-- Main Concept -->
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 class="font-semibold text-blue-900 mb-2">🔤 What are Out-of-Vocabulary (OOV) Words?</h4>
                <p class="text-blue-800">
                    OOV words are like encountering unfamiliar ingredients while cooking - you need a strategy to handle them. 
                    In traditional NLP, words not in the training vocabulary were simply marked as "unknown" ([UNK]). 
                    Modern LLMs solve this by breaking unknown words into smaller, familiar pieces called subwords, 
                    allowing them to understand and generate even words they've never seen before.
                </p>
            </div>

            <!-- Tokenization Strategies -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <h5 class="font-medium text-green-900">🧩 Byte-Pair Encoding (BPE)</h5>
                    <p class="text-sm text-green-700 mb-2">
                        Iteratively merges the most frequent character pairs to build a vocabulary of subwords.
                    </p>
                    <code class="text-xs bg-green-100 px-1 rounded block">
                        "cryptocurrency" → ["crypto", "currency"]
                    </code>
                </div>
                
                <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <h5 class="font-medium text-purple-900">🎯 SentencePiece</h5>
                    <p class="text-sm text-purple-700 mb-2">
                        Language-agnostic algorithm that treats text as raw bytes, handling any language without pre-tokenization.
                    </p>
                    <code class="text-xs bg-purple-100 px-1 rounded block">
                        "▁crypto" + "currency" (with space markers)
                    </code>
                </div>
                
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <h5 class="font-medium text-orange-900">🔤 WordPiece</h5>
                    <p class="text-sm text-orange-700 mb-2">
                        Maximizes likelihood of training data by choosing merges that best predict the next character.
                    </p>
                    <code class="text-xs bg-orange-100 px-1 rounded block">
                        "crypto" + "##currency" (with continuation markers)
                    </code>
                </div>
            </div>

            <!-- Technical Process -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">⚙️ Subword Tokenization Process</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Training Phase:</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• Start with character-level vocabulary</li>
                            <li>• Count frequency of character pairs</li>
                            <li>• Merge most frequent pairs iteratively</li>
                            <li>• Build vocabulary of optimal subwords</li>
                            <li>• Set vocabulary size limit (e.g., 50K tokens)</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Inference Phase:</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• Apply learned merge rules to new text</li>
                            <li>• Break OOV words into known subwords</li>
                            <li>• Fall back to characters if needed</li>
                            <li>• Maintain semantic relationships</li>
                            <li>• Enable robust generation and understanding</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Advanced Techniques -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                    <h5 class="font-medium text-indigo-900">🌍 Multilingual Handling</h5>
                    <p class="text-sm text-indigo-700">
                        Subword tokenization naturally handles multiple languages by learning language-agnostic patterns.
                    </p>
                    <code class="text-xs bg-indigo-100 px-1 rounded block mt-1">
                        "Tokyo" + "駅" → ["To", "ky", "o", "駅"]
                    </code>
                </div>
                
                <div class="bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                    <h5 class="font-medium text-teal-900">🔄 Adaptive Vocabularies</h5>
                    <p class="text-sm text-teal-700">
                        Some models dynamically expand vocabularies during training to capture domain-specific terms.
                    </p>
                    <code class="text-xs bg-teal-100 px-1 rounded block mt-1">
                        Medical: "cardio" + "vascular" + "itis"
                    </code>
                </div>
            </div>

            <!-- Benefits and Advantages -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-900 mb-2">🎯 Key Benefits of Subword Tokenization</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-yellow-800 mb-2">Robustness Benefits:</h6>
                        <ul class="text-yellow-700 space-y-1">
                            <li>• <strong>No UNK Tokens:</strong> Every word can be represented</li>
                            <li>• <strong>Morphological Awareness:</strong> Understands word structure</li>
                            <li>• <strong>Cross-lingual Transfer:</strong> Shared subwords across languages</li>
                            <li>• <strong>Domain Adaptation:</strong> Handles specialized terminology</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-yellow-800 mb-2">Efficiency Benefits:</h6>
                        <ul class="text-yellow-700 space-y-1">
                            <li>• <strong>Vocabulary Control:</strong> Fixed vocabulary size</li>
                            <li>• <strong>Better Compression:</strong> Optimal sequence length</li>
                            <li>• <strong>Semantic Preservation:</strong> Meaningful subword units</li>
                            <li>• <strong>Training Stability:</strong> Consistent token distributions</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Real-world Examples -->
            <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-green-900 mb-2">🌟 Real-world OOV Handling Examples</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-green-800 mb-2">Technical Terms:</h6>
                        <ul class="text-green-700 space-y-1">
                            <li>• "blockchain" → ["block", "chain"]</li>
                            <li>• "cryptocurrency" → ["crypto", "currency"]</li>
                            <li>• "biodegradable" → ["bio", "de", "grad", "able"]</li>
                            <li>• "neuroscientist" → ["neuro", "scientist"]</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-green-800 mb-2">Proper Nouns & Neologisms:</h6>
                        <ul class="text-green-700 space-y-1">
                            <li>• "COVID-19" → ["COVID", "-", "19"]</li>
                            <li>• "Pokémon" → ["Po", "ké", "mon"]</li>
                            <li>• "unfriend" → ["un", "friend"]</li>
                            <li>• "livestream" → ["live", "stream"]</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Challenges and Limitations -->
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-red-900 mb-2">⚠️ Challenges and Considerations</h4>
                <div class="text-sm text-red-800 space-y-2">
                    <p><strong>Semantic Boundaries:</strong> Subword splits may not align with morphological boundaries, potentially losing semantic meaning.</p>
                    <p><strong>Sequence Length:</strong> Breaking words into subwords increases sequence length, impacting computational efficiency.</p>
                    <p><strong>Training Data Bias:</strong> Subword vocabularies reflect training data distribution, potentially underrepresenting minority languages or domains.</p>
                    <p><strong>Tokenization Consistency:</strong> Different tokenization can lead to inconsistent representations of the same concept.</p>
                </div>
            </div>
        </div>
    `,
    interactive: {
        title: "🔍 OOV Word Tokenization Explorer",
        html: `
            <div class="space-y-6">
                <!-- Text Input -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q16-text-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Enter Text with Potential OOV Words</label>
                    <input type="text" id="q16-text-input" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="The blockchain cryptocurrency enthusiast livestreamed about biodegradable packaging.">
                    <p class="text-xs text-gray-600 mt-1">Try technical terms, neologisms, compound words, or foreign words!</p>
                </div>
                
                <!-- Tokenization Strategy Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Tokenization Strategy</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q16-strategy" value="bpe" class="mr-3" checked>
                            <div>
                                <div class="font-medium text-sm">Byte-Pair Encoding</div>
                                <div class="text-xs text-gray-500">Frequent pair merging</div>
                                <div class="text-xs bg-green-100 text-green-700 px-1 rounded mt-1">Standard</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q16-strategy" value="sentencepiece" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">SentencePiece</div>
                                <div class="text-xs text-gray-500">Language-agnostic</div>
                                <div class="text-xs bg-purple-100 text-purple-700 px-1 rounded mt-1">Universal</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q16-strategy" value="wordpiece" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">WordPiece</div>
                                <div class="text-xs text-gray-500">Likelihood-based</div>
                                <div class="text-xs bg-orange-100 text-orange-700 px-1 rounded mt-1">Optimized</div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Vocabulary Size Control -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-3">⚙️ Tokenization Parameters</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="q16-vocab-size" class="block text-sm font-medium text-gray-700 mb-2">Vocabulary Size</label>
                            <input type="range" id="q16-vocab-size" min="1000" max="100000" step="5000" value="50000" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1K</span>
                                <span id="q16-vocab-display" class="font-medium">50K</span>
                                <span>100K</span>
                            </div>
                        </div>
                        <div>
                            <label for="q16-min-frequency" class="block text-sm font-medium text-gray-700 mb-2">Min Subword Frequency</label>
                            <input type="range" id="q16-min-frequency" min="1" max="100" step="5" value="10" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1</span>
                                <span id="q16-freq-display" class="font-medium">10</span>
                                <span>100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Examples -->
                <div class="flex flex-wrap gap-2">
                    <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                    <button id="q16-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Technical Terms</button>
                </div>

                <!-- Tokenization Results -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">🎨 Tokenization Results</h4>
                        <div id="q16-strategy-indicator" class="text-xs px-2 py-1 rounded font-medium">Byte-Pair Encoding</div>
                    </div>
                    
                    <!-- Token Visualization -->
                    <div id="q16-output" class="min-h-[100px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300 mb-4">
                        <div class="text-sm text-gray-500 text-center">Tokens will appear here...</div>
                    </div>
                    
                    <!-- Statistics -->
                    <div class="grid md:grid-cols-4 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-600" id="q16-token-count">0</div>
                            <div class="text-xs text-gray-500">Total Tokens</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-600" id="q16-oov-count">0</div>
                            <div class="text-xs text-gray-500">OOV Words Handled</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-purple-600" id="q16-compression">1.0x</div>
                            <div class="text-xs text-gray-500">Compression Ratio</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-orange-600" id="q16-coverage">100%</div>
                            <div class="text-xs text-gray-500">Vocabulary Coverage</div>
                        </div>
                    </div>
                    
                    <!-- Detailed Analysis -->
                    <div class="bg-gray-50 p-3 rounded">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Token Analysis</h5>
                        <div id="q16-analysis" class="text-xs text-gray-600">
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Subword Breakdown:</strong>
                                    <ul id="q16-subword-list" class="mt-1 space-y-1"></ul>
                                </div>
                                <div>
                                    <strong>OOV Handling:</strong>
                                    <ul id="q16-oov-list" class="mt-1 space-y-1"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">💡 Tokenization Strategy Analysis</h4>
                    <div id="q16-explanation" class="text-sm text-yellow-800"></div>
                </div>
            </div>
        `,
        script: () => {
            // Ensure DOM is ready before initializing
            setTimeout(() => {
                initializeQuestion16();
            }, 100);
        }
    }
};

function initializeQuestion16() {
    // Tokenization strategy configurations
    const strategyConfig = {
                bpe: {
                    name: "Byte-Pair Encoding (BPE)",
                    color: "text-green-700",
                    bgColor: "bg-green-100",
                    description: "Merges most frequent character pairs iteratively. Good balance of efficiency and semantic preservation.",
                    mergeChar: "",
                    continuationMarker: ""
                },
                sentencepiece: {
                    name: "SentencePiece",
                    color: "text-purple-700",
                    bgColor: "bg-purple-100", 
                    description: "Language-agnostic approach treating text as raw bytes. Excellent for multilingual models.",
                    mergeChar: "▁",
                    continuationMarker: "▁"
                },
                wordpiece: {
                    name: "WordPiece",
                    color: "text-orange-700",
                    bgColor: "bg-orange-100",
                    description: "Maximizes training data likelihood. Optimized for specific model architectures like BERT.",
                    mergeChar: "",
                    continuationMarker: "##"
                }
            };

            // Example texts for different scenarios
            const examples = [
                {
                    name: "Technical Terms",
                    text: "The blockchain cryptocurrency enthusiast livestreamed about biodegradable packaging.",
                    description: "Modern technical vocabulary and compound words"
                },
                {
                    name: "Medical Terminology",
                    text: "The cardiologist diagnosed atherosclerosis using echocardiography and electrocardiogram.",
                    description: "Specialized medical terms with Greek/Latin roots"
                },
                {
                    name: "Neologisms & Social Media",
                    text: "She unfriended him after he started subtweeting about their relationship.",
                    description: "Modern internet slang and social media terms"
                },
                {
                    name: "Multilingual Text",
                    text: "Visit Tokyo駅 for the best ramen, café, and Pokémon merchandise.",
                    description: "Mixed languages with foreign characters"
                },
                {
                    name: "Scientific Terms", 
                    text: "The photosynthesis process involves chlorophyll molecules absorbing electromagnetic radiation.",
                    description: "Complex scientific vocabulary and processes"
                },
                {
                    name: "Compound Words",
                    text: "The cybersecurity specialist worked on anti-malware software for smartphones.",
                    description: "Technology compound words and hyphenated terms"
                }
            ];

            // Pre-built vocabulary for simulation (simplified)
            const baseVocabulary = new Set([
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
                'about', 'work', 'time', 'way', 'day', 'man', 'woman', 'people', 'good', 'new', 'first',
                'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'small',
                'large', 'local', 'black', 'white', 'red', 'blue', 'green', 'best', 'better', 'crypto',
                'block', 'chain', 'stream', 'live', 'bio', 'able', 'grad', 'de', 'ist', 'ism', 'ologist'
            ]);

            // DOM elements
            const textInput = document.getElementById('q16-text-input');
            const strategyRadios = document.querySelectorAll('input[name="q16-strategy"]');
            const strategyIndicator = document.getElementById('q16-strategy-indicator');
            const vocabSizeSlider = document.getElementById('q16-vocab-size');
            const minFreqSlider = document.getElementById('q16-min-frequency');
            const vocabDisplay = document.getElementById('q16-vocab-display');
            const freqDisplay = document.getElementById('q16-freq-display');
            const exampleBtn = document.getElementById('q16-example-btn');
            const output = document.getElementById('q16-output');
            const explanation = document.getElementById('q16-explanation');
            const tokenCountElement = document.getElementById('q16-token-count');
            const oovCountElement = document.getElementById('q16-oov-count');
            const compressionElement = document.getElementById('q16-compression');
            const coverageElement = document.getElementById('q16-coverage');
            const subwordList = document.getElementById('q16-subword-list');
            const oovList = document.getElementById('q16-oov-list');

            if (!textInput || !output || !explanation) {
                console.error('Required DOM elements not found for Question 16');
                return;
            }

            // Additional validation for slider elements
            if (!vocabSizeSlider || !minFreqSlider) {
                console.error('Slider elements not found for Question 16:', {
                    vocabSizeSlider: !!vocabSizeSlider,
                    minFreqSlider: !!minFreqSlider
                });
                return;
            }

            // Additional validation for display elements
            if (!vocabDisplay || !freqDisplay) {
                console.error('Display elements not found for Question 16:', {
                    vocabDisplay: !!vocabDisplay,
                    freqDisplay: !!freqDisplay
                });
                return;
            }

            let currentExampleIndex = 0;

            // Get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q16-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'bpe';
            }

            // Update parameter displays
            function updateParameterDisplays() {
                if (!vocabSizeSlider || !minFreqSlider || !vocabDisplay || !freqDisplay) {
                    console.error('Slider or display elements missing in updateParameterDisplays');
                    return;
                }

                const vocabSize = parseInt(vocabSizeSlider.value);
                const minFreq = parseInt(minFreqSlider.value);
                
                // Format vocabulary size display
                if (vocabSize >= 1000) {
                    const kValue = Math.round(vocabSize / 1000);
                    vocabDisplay.textContent = `${kValue}K`;
                } else {
                    vocabDisplay.textContent = vocabSize.toString();
                }
                
                freqDisplay.textContent = minFreq.toString();
            }

            // Simulate subword tokenization
            function tokenizeText(text, strategy, vocabSize, minFreq) {
                const config = strategyConfig[strategy];
                // Keep Unicode letters, marks, numbers, spaces, apostrophes, and hyphens; replace others with spaces
                const words = text
                    .toLowerCase()
                    .replace(/[^\p{L}\p{M}\p{N}\s'\-]/gu, ' ')
                    .trim()
                    .split(/\s+/)
                    .filter(w => w.length > 0);
                
                let tokens = [];
                let oovWords = [];
                let subwordBreakdowns = [];
                
                words.forEach(word => {
                    if (baseVocabulary.has(word)) {
                        // Word is in vocabulary
                        tokens.push({
                            text: word,
                            type: 'known',
                            original: word
                        });
                    } else {
                        // OOV word - break into subwords
                        oovWords.push(word);
                        const subwords = simulateSubwordSplit(word, strategy, vocabSize, minFreq);
                        
                        subwords.forEach((subword, index) => {
                            let displayText = subword;
                            if (strategy === 'wordpiece' && index > 0) {
                                displayText = config.continuationMarker + subword;
                            } else if (strategy === 'sentencepiece' && index === 0) {
                                displayText = config.continuationMarker + subword;
                            }
                            
                            tokens.push({
                                text: displayText,
                                type: 'subword',
                                original: word,
                                subwordIndex: index,
                                totalSubwords: subwords.length
                            });
                        });
                        
                        subwordBreakdowns.push({
                            original: word,
                            subwords: subwords,
                            strategy: strategy
                        });
                    }
                });
                
                // Calculate metrics
                const originalLength = text.length;
                const tokenLength = tokens.reduce((sum, token) => sum + token.text.length, 0);
                const compressionRatio = originalLength / tokenLength;
                const coverage = ((words.length - oovWords.length) / words.length) * 100;
                
                return {
                    tokens,
                    oovWords,
                    subwordBreakdowns,
                    metrics: {
                        tokenCount: tokens.length,
                        oovCount: oovWords.length,
                        compressionRatio,
                        coverage
                    }
                };
            }

            // Simulate how different strategies would split words
            function simulateSubwordSplit(word, strategy, vocabSize, minFreq) {
                const length = word.length;
                
                if (length <= 3) {
                    return [word];
                }
                
                // Vocabulary size affects aggressiveness of splitting
                const aggressiveness = Math.max(0.3, Math.min(1.0, (100000 - vocabSize) / 90000));
                
                // Min frequency affects minimum subword length
                const minSubwordLength = Math.max(2, Math.floor(minFreq / 20) + 2);
                
                // Simulate different splitting strategies
                switch (strategy) {
                    case 'bpe':
                        // BPE tends to split at morphological boundaries
                        return simulateBPESplit(word, aggressiveness, minSubwordLength);
                    case 'sentencepiece':
                        // SentencePiece can be more aggressive
                        return simulateSentencePieceSplit(word, aggressiveness, minSubwordLength);
                    case 'wordpiece':
                        // WordPiece optimizes for likelihood
                        return simulateWordPieceSplit(word, aggressiveness, minSubwordLength);
                    default:
                        return [word];
                }
            }

            function simulateBPESplit(word, aggressiveness, minSubwordLength) {
                // Common prefixes and suffixes
                const prefixes = ['un', 're', 'pre', 'dis', 'over', 'under', 'anti', 'bio', 'cyber', 'crypto'];
                const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'able', 'ness', 'ment', 'ology', 'graphy'];
                
                let remaining = word;
                let parts = [];
                
                // Check for known prefixes
                for (const prefix of prefixes) {
                    if (remaining.startsWith(prefix) && remaining.length > prefix.length) {
                        parts.push(prefix);
                        remaining = remaining.slice(prefix.length);
                        break;
                    }
                }
                
                // Check for known suffixes
                for (const suffix of suffixes) {
                    if (remaining.endsWith(suffix) && remaining.length > suffix.length) {
                        const root = remaining.slice(0, -suffix.length);
                        if (root.length >= minSubwordLength) {
                            parts.push(root);
                            parts.push(suffix);
                            return parts;
                        }
                    }
                }
                
                // If no prefix/suffix found, add remaining
                if (remaining.length > 0) {
                    if (parts.length === 0) {
                        // Split into reasonable chunks based on aggressiveness
                        if (remaining.length > 6 && aggressiveness > 0.5) {
                            const splitPoint = Math.floor(remaining.length * (0.4 + aggressiveness * 0.2));
                            const firstPart = remaining.slice(0, splitPoint);
                            const secondPart = remaining.slice(splitPoint);
                            
                            if (firstPart.length >= minSubwordLength && secondPart.length >= minSubwordLength) {
                                parts.push(firstPart);
                                parts.push(secondPart);
                            } else {
                                parts.push(remaining);
                            }
                        } else {
                            parts.push(remaining);
                        }
                    } else {
                        parts.push(remaining);
                    }
                }
                
                return parts.filter(p => p.length > 0);
            }

            function simulateSentencePieceSplit(word, aggressiveness, minSubwordLength) {
                // SentencePiece can be more aggressive with shorter segments
                if (word.length <= minSubwordLength + 1) return [word];
                
                const segments = [];
                let remaining = word;
                
                while (remaining.length > 0) {
                    if (remaining.length <= minSubwordLength) {
                        segments.push(remaining);
                        break;
                    }
                    
                    // Aggressiveness affects segment length - higher aggressiveness = smaller segments
                    const baseLength = minSubwordLength;
                    const variableLength = Math.floor((1 - aggressiveness) * 3); // 0-3 extra chars
                    const segmentLength = Math.min(remaining.length, baseLength + variableLength);
                    
                    segments.push(remaining.slice(0, segmentLength));
                    remaining = remaining.slice(segmentLength);
                }
                
                return segments;
            }

            function simulateWordPieceSplit(word, aggressiveness, minSubwordLength) {
                // WordPiece tries to maximize likelihood, often similar to BPE but with continuation markers
                const bpeResult = simulateBPESplit(word, aggressiveness, minSubwordLength);
                
                // WordPiece might merge some segments differently based on likelihood
                if (bpeResult.length > 2 && aggressiveness < 0.7) {
                    // Sometimes merge first two segments if they're short and aggressiveness is low
                    if (bpeResult[0].length <= minSubwordLength && bpeResult[1].length <= minSubwordLength + 1) {
                        return [bpeResult[0] + bpeResult[1], ...bpeResult.slice(2)];
                    }
                }
                
                return bpeResult;
            }

            // Render tokens with color coding
            function renderTokens(tokens) {
                const tokenElements = tokens.map(token => {
                    const colorClass = token.type === 'known' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
                    const title = token.type === 'known' ? 
                        `Known word: "${token.original}"` : 
                        `Subword ${token.subwordIndex + 1}/${token.totalSubwords} of "${token.original}"`;
                    
                    return `<span class="inline-block px-2 py-1 rounded text-sm font-medium ${colorClass} mr-1 mb-1" title="${title}">${token.text}</span>`;
                });
                
                return tokenElements.join('');
            }

            // Update display
            function updateDisplay() {
                const text = textInput.value.trim();
                const strategy = getCurrentStrategy();
                const config = strategyConfig[strategy];
                const vocabSize = parseInt(vocabSizeSlider.value);
                const minFreq = parseInt(minFreqSlider.value);

                if (!text) {
                    output.innerHTML = '<div class="text-sm text-gray-500 text-center">Enter some text to see tokenization...</div>';
                    return;
                }

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.className = `text-xs px-2 py-1 rounded font-medium ${config.color} ${config.bgColor}`;
                }

                // Tokenize text
                const result = tokenizeText(text, strategy, vocabSize, minFreq);

                // Update output
                output.innerHTML = renderTokens(result.tokens);

                // Update metrics
                if (tokenCountElement) tokenCountElement.textContent = result.metrics.tokenCount;
                if (oovCountElement) oovCountElement.textContent = result.metrics.oovCount;
                if (compressionElement) compressionElement.textContent = `${result.metrics.compressionRatio.toFixed(1)}x`;
                if (coverageElement) coverageElement.textContent = `${result.metrics.coverage.toFixed(0)}%`;

                // Update analysis
                if (subwordList) {
                    subwordList.innerHTML = result.subwordBreakdowns
                        .slice(0, 5) // Show first 5
                        .map(breakdown => `<li>"${breakdown.original}" → [${breakdown.subwords.map(s => `"${s}"`).join(', ')}]</li>`)
                        .join('');
                }

                // Update explanation
                const efficiencyLevel = result.metrics.compressionRatio >= 1.3 ? 'excellent' :
                                       result.metrics.compressionRatio >= 1.1 ? 'good' : 'moderate';
                
                const coverageLevel = result.metrics.coverage >= 90 ? 'excellent' :
                                     result.metrics.coverage >= 70 ? 'good' : 'limited';

                // Calculate parameter effects
                const aggressiveness = Math.max(0.3, Math.min(1.0, (100000 - vocabSize) / 90000));
                const minSubwordLength = Math.max(2, Math.floor(minFreq / 20) + 2);

                explanation.innerHTML = `
                    <p><strong>${config.name}:</strong></p>
                    <p class="mt-2">${config.description}</p>
                    <p class="mt-2"><strong>Current Parameters:</strong> Vocabulary size: ${vocabSize.toLocaleString()}, Min frequency: ${minFreq}. 
                    This creates ${aggressiveness > 0.7 ? 'aggressive' : aggressiveness > 0.4 ? 'moderate' : 'conservative'} splitting with min subword length of ${minSubwordLength} characters.</p>
                    <p class="mt-2"><strong>Results:</strong> Processed ${result.metrics.tokenCount} tokens with ${result.metrics.oovCount} OOV words handled. 
                    Compression efficiency is ${efficiencyLevel} (${result.metrics.compressionRatio.toFixed(1)}x), vocabulary coverage is ${coverageLevel} (${result.metrics.coverage.toFixed(0)}%).</p>
                    <p class="mt-2"><strong>Strategy Analysis:</strong> ${strategy === 'bpe' ? 
                        'BPE effectively handles morphological patterns and produces intuitive splits for compound words.' :
                        strategy === 'sentencepiece' ? 
                        'SentencePiece provides consistent handling across languages and handles Unicode characters well.' :
                        'WordPiece optimizes for training likelihood and works well with transformer architectures.'}</p>
                    <p class="mt-2"><strong>OOV Handling:</strong> ${result.metrics.oovCount === 0 ? 
                        'All words were in vocabulary - excellent coverage!' :
                        `Successfully decomposed ${result.metrics.oovCount} unknown words into meaningful subword units, maintaining semantic information.`}</p>
                `;
            }

            // Example cycling
            function cycleExample() {
                const example = examples[currentExampleIndex];
                
                textInput.value = example.text;
                exampleBtn.textContent = example.name;
                exampleBtn.title = example.description;
                
                updateDisplay();
                
                // Next example
                currentExampleIndex = (currentExampleIndex + 1) % examples.length;
            }

            // Event listeners
            textInput.addEventListener('input', updateDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', updateDisplay);
            });
            
            // Add event listeners for sliders with validation
            if (vocabSizeSlider && minFreqSlider) {
                [vocabSizeSlider, minFreqSlider].forEach(slider => {
                    slider.addEventListener('input', () => {
                        updateParameterDisplays();
                        updateDisplay();
                    });
                });
            } else {
                console.error('Cannot add event listeners - sliders not found');
            }
            
            exampleBtn.addEventListener('click', cycleExample);

            // Initial setup
            updateParameterDisplays();
            updateDisplay();
}

// Optional (safe) export for Node-based tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
