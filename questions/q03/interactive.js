const interactiveScript = () => {
            // Get DOM elements with error checking
            const input = document.getElementById('q3-text-input');
            const output = document.getElementById('q3-output');
            const windowIndicator = document.getElementById('q3-window-indicator');
            const coherenceBar = document.getElementById('q3-coherence-bar');
            const costBar = document.getElementById('q3-cost-bar');
            const usecaseBar = document.getElementById('q3-usecase-bar');
            const coherenceText = document.getElementById('q3-coherence-text');
            const costText = document.getElementById('q3-cost-text');
            const usecaseText = document.getElementById('q3-usecase-text');
            const summarizeBtn = document.getElementById('q3-summarize-btn');
            const qaBtn = document.getElementById('q3-qa-btn');
            const demoOutput = document.getElementById('q3-demo-output');
            const explanationContent = document.getElementById('q3-explanation-content');
            const exampleBtn = document.getElementById('q3-example-btn');
            const tokenSummary = document.getElementById('q3-token-summary');
            const modeRadios = document.querySelectorAll('input[name="q3-mode"]');
            const demoSection = document.getElementById('q3-demo-section');
            const realSection = document.getElementById('q3-real-section');
            const loremBtn = document.getElementById('q3-lorem-btn');
            const loremSize = document.getElementById('q3-lorem-size');
            
            const TONE_MAP = {
                green: 'var(--tone-emerald-strong)',
                purple: 'var(--tone-purple-strong)',
                orange: 'var(--tone-amber-strong)',
                blue: 'var(--tone-sky-strong)',
                emerald: 'var(--tone-emerald-strong)',
                sky: 'var(--tone-sky-strong)',
                amber: 'var(--tone-amber-strong)',
                rose: 'var(--tone-rose-strong)'
            };

            const mixColor = (tone, percentage, base = 'var(--color-card)') => {
                const remainder = Math.max(0, 100 - percentage);
                return `color-mix(in srgb, ${tone} ${percentage}%, ${base} ${remainder}%)`;
            };

            const toneValue = (key) => TONE_MAP[key] || 'var(--tone-indigo-strong)';

            function styleSelectableCard(card, toneKey, selected) {
                if (!card) return;
                const tone = toneValue(toneKey);
                if (selected) {
                    card.classList.add('context-card--selected');
                    card.style.background = mixColor(tone, 18);
                    card.style.borderColor = mixColor(tone, 36, 'var(--color-border-subtle)');
                    card.style.boxShadow = '0 14px 32px -24px rgba(15, 23, 42, 0.55)';
                } else {
                    card.classList.remove('context-card--selected');
                    card.style.background = 'var(--color-card)';
                    card.style.borderColor = 'var(--color-border-subtle)';
                    card.style.boxShadow = 'none';
                }
            }

            function setModeOptionState(option, active) {
                if (!option) return;
                option.classList.toggle('context-mode-option--active', active);
            }

            const formatNumber = (value) => value.toLocaleString();

            const modeOptions = document.querySelectorAll('.context-mode-option');
            const demoSizeRadios = document.querySelectorAll('input[name="q3-window-size"]');
            const realSizeRadios = document.querySelectorAll('input[name="q3-real-window"]');

            const updateModeStyles = () => {
                modeOptions.forEach(option => {
                    const radio = option.querySelector('input[name="q3-mode"]');
                    setModeOptionState(option, radio ? radio.checked : false);
                });
            };

            const updateDemoCardStyles = () => {
                demoSizeRadios.forEach(radio => {
                    const card = radio.closest('.context-card');
                    if (!card) return;
                    styleSelectableCard(card, card.dataset.tone || radio.dataset.tone, radio.checked);
                });
            };

            const updateRealCardStyles = () => {
                realSizeRadios.forEach(radio => {
                    const card = radio.closest('.context-card');
                    if (!card) return;
                    styleSelectableCard(card, card.dataset.tone || radio.dataset.tone, radio.checked);
                });
            };

            if (!input || !output) return;

            // Configuration data for demo window sizes
            const demoWindowConfig = {
                small: {
                    name: 'Small Window (50 tokens)',
                    tokens: 50,
                    coherence: 30,
                    cost: 20,
                    usecase: 40,
                    coherenceText: 'Limited context retention',
                    costText: 'Very low processing cost',
                    usecaseText: 'Good for simple tasks',
                    color: 'green',
                    description: 'Small windows process only recent text, making them fast but potentially losing important earlier context. Best for short interactions and simple tasks.'
                },
                medium: {
                    name: 'Medium Window (100 tokens)',
                    tokens: 100,
                    coherence: 70,
                    cost: 50,
                    usecase: 80,
                    coherenceText: 'Good context retention',
                    costText: 'Moderate processing cost',
                    usecaseText: 'Excellent for most tasks',
                    color: 'purple',
                    description: 'Medium windows offer a good balance between context retention and computational efficiency. Ideal for most conversational AI applications and moderate-length documents.'
                },
                large: {
                    name: 'Large Window (200 tokens)',
                    tokens: 200,
                    coherence: 95,
                    cost: 90,
                    usecase: 95,
                    coherenceText: 'Excellent context retention',
                    costText: 'High processing cost',
                    usecaseText: 'Perfect for complex tasks',
                    color: 'orange',
                    description: 'Large windows can maintain context across lengthy documents, enabling sophisticated analysis and long-form generation, but require substantial computational resources.'
                }
            };

            // Real-world presets (approximate)
            const realWindowConfig = {
                '4k': {
                    name: 'Real-world (4K tokens)',
                    tokens: 4000,
                    coherence: 55,
                    cost: 35,
                    usecase: 60,
                    coherenceText: 'Decent for short docs',
                    costText: 'Low to moderate cost',
                    usecaseText: 'Good for utilities',
                    color: 'blue',
                    description: 'Legacy small context typical of earlier LLMs and compact models.'
                },
                '32k': {
                    name: 'Real-world (32K tokens)',
                    tokens: 32000,
                    coherence: 75,
                    cost: 50,
                    usecase: 80,
                    coherenceText: 'Solid retention',
                    costText: 'Moderate cost',
                    usecaseText: 'Common production baseline',
                    color: 'blue',
                    description: 'Common baseline on many providers; handles long chats and larger files.'
                },
                '128k': {
                    name: 'Real-world (128K tokens)',
                    tokens: 128000,
                    coherence: 85,
                    cost: 70,
                    usecase: 90,
                    coherenceText: 'High retention',
                    costText: 'Higher cost',
                    usecaseText: 'Great for complex tasks',
                    color: 'blue',
                    description: 'Mainstream large context across many models; enables broader in-context learning.'
                },
                '200k': {
                    name: 'Real-world (200K tokens)',
                    tokens: 200000,
                    coherence: 90,
                    cost: 80,
                    usecase: 95,
                    coherenceText: 'Very high retention',
                    costText: 'High cost',
                    usecaseText: 'Excellent for long docs',
                    color: 'blue',
                    description: 'Offered by Claude family; excellent for large documents.'
                },
                '1m': {
                    name: 'Real-world (1M tokens)',
                    tokens: 1000000,
                    coherence: 95,
                    cost: 95,
                    usecase: 98,
                    coherenceText: 'Extremely high retention',
                    costText: 'Very high cost',
                    usecaseText: 'Specialized long-context tasks',
                    color: 'blue',
                    description: 'Gemini and some Claude beta configurations; consider caching and retrieval strategies.'
                }
            };

            // Helpers
            const estimateTokens = (text) => Math.max(1, Math.ceil(text.length / 4)); // ~4 chars per token
            const getCurrentMode = () => {
                const selected = document.querySelector('input[name="q3-mode"]:checked');
                return selected ? selected.value : 'demo';
            };
            function getCurrentWindowSelection() {
                const mode = getCurrentMode();
                if (mode === 'real') {
                    const sel = document.querySelector('input[name="q3-real-window"]:checked');
                    const key = sel ? sel.value : '32k';
                    return realWindowConfig[key];
                }
                const selected = document.querySelector('input[name="q3-window-size"]:checked');
                const key = selected ? selected.value : 'medium';
                return demoWindowConfig[key];
            }

            // Main processing function
            const processInput = () => {
                const text = input.value;
                const words = text.split(/\s+/).filter(w => w.length > 0);
                const config = getCurrentWindowSelection();
                const approxTokens = estimateTokens(text);
                
                if (words.length === 0) {
                    output.innerHTML = '<div class="context-empty"><p class="context-empty-title">Paste text to get started</p><p class="small-caption text-muted">Try a long article, transcript, || code snippet.</p></div>';
                    return;
                }

                // Clear previous content
                output.innerHTML = '';
                
                // Create word elements with approximate token-based highlighting
                const avgTokensPerWord = Math.max(1, approxTokens / words.length);
                const wordsWithin = Math.floor(config.tokens / avgTokensPerWord);
                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word + ' ';
                    const within = index < wordsWithin;
                    if (within) {
                        span.className = 'context-token context-token--in';
                        span.title = `≈ Token group ${index + 1}: Within context window`;
                    } else {
                        span.className = 'context-token context-token--out';
                        span.title = `≈ Token group ${index + 1}: Outside context window (forgotten)`;
                    }
                    
                    output.appendChild(span);
                });

                // Token summary and truncation indicator
                const tokensInWindow = Math.min(approxTokens, config.tokens);
                const tokensMissed = Math.max(0, approxTokens - config.tokens);
                const pct = Math.round((tokensInWindow / Math.max(1, approxTokens)) * 100);
                if (tokenSummary) {
                    tokenSummary.innerHTML = `<span><strong>${formatNumber(approxTokens)}</strong> tokens</span><span><strong>${formatNumber(config.tokens)}</strong> window</span><span><strong>${pct}%</strong> coverage</span>`;
                }

                if (tokensMissed > 0) {
                    const indicator = document.createElement('div');
                    indicator.className = 'context-truncation';
                    indicator.textContent = `⚠️ ${formatNumber(tokensMissed)} tokens beyond the window (model cannot reference them)`;
                    output.appendChild(indicator);
                }

                // Update metrics
                updateMetrics(config);
                updateExplanation(config, approxTokens);
                
                // Hide demo output when input changes
                demoOutput.classList.add('hidden');
            };

            // Update performance metrics
            function updateMetrics(config) {
                windowIndicator.textContent = config.name;
                if (windowIndicator) {
                    windowIndicator.dataset.tone = config.color;
                }

                coherenceBar.style.width = `${config.coherence}%`;
                costBar.style.width = `${config.cost}%`;
                usecaseBar.style.width = `${config.usecase}%`;
                
                coherenceText.textContent = config.coherenceText;
                costText.textContent = config.costText;
                usecaseText.textContent = config.usecaseText;
            }

            // Update educational explanation
            function updateExplanation(config, tokenCount) {
                const tokensInWindow = Math.min(tokenCount, config.tokens);
                const tokensMissed = Math.max(0, tokenCount - config.tokens);
                
                explanationContent.innerHTML = `
                    <strong>${config.name}:</strong> ${config.description}
                    <br><br>
                    <strong>Current Analysis:</strong>
                    <br>• Processing ${tokensInWindow.toLocaleString()} of ${tokenCount.toLocaleString()} tokens (${Math.round((tokensInWindow/Math.max(1, tokenCount))*100)}% of input)
                    ${tokensMissed > 0 ? `<br>• <span class="text-red-600">${tokensMissed} tokens are outside the context window and will be ignored</span>` : '<br>• ✅ Entire document fits within context window'}
                    <br>• Complexity: Prefill ~O(n²), Decode with KV caching ~O(n) per new token
                    <br><small class="small-caption text-muted">Token estimate uses ~4 chars per token guideline.</small>
                `;
            }

            // Example cycling functionality
            const examples = [
                {
                    text: 'Artificial intelligence has evolved rapidly in recent years, with large language models representing a significant breakthrough. These models can understand and generate human-like text by processing vast amounts of training data. The context window determines how much preceding text the model can reference when generating responses. A larger context window enables better coherence but requires more computational resources. Modern applications include chatbots, content creation, code generation, and document analysis. The balance between context length and processing efficiency remains a key consideration in AI system design.',
                    note: 'Research paper excerpt - tests context retention across multiple topics'
                },
                {
                    text: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet. Pangrams are often used to test fonts and keyboards. They provide a simple way to display all characters. Short sentences like this are easy to process with any context window size.',
                    note: 'Short text example - fits easily in small windows'
                },
                {
                    text: 'Machine learning models require careful consideration of various hyperparameters during training and inference. The learning rate controls how quickly the model adapts to new information. Batch size affects memory usage and training stability. Context window size in language models determines how much previous text can influence generation. Attention mechanisms allow models to focus on relevant parts of the input sequence. Transformer architectures have revolutionized natural language processing by enabling parallel computation and better long-range dependencies. Pre-training on large corpora followed by fine-tuning on specific tasks has become the standard approach. Recent advances include techniques like retrieval-augmented generation, which can access external knowledge bases. The field continues to evolve with new architectures and training methodologies being developed regularly.',
                    note: 'Long technical text - demonstrates the need for larger context windows'
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    input.value = example.text;
                    exampleBtn.textContent = `Try: ${example.note}`;
                    exampleIndex++;
                    processInput();
                });
            }

            // Lorem ipsum generator
            if (loremBtn) {
                loremBtn.addEventListener('click', () => {
                    const targetTokens = parseInt((loremSize && loremSize.value) || '3000', 10) || 3000;
                    const base = [
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    ].join(' ');
                    const targetChars = Math.max(1, targetTokens * 4); // ~4 chars/token
                    let text = base;
                    while (text.length < targetChars) text += ' ' + base;
                    text = text.slice(0, targetChars);
                    input.value = text;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
            }

            // Demo simulation buttons
            if (summarizeBtn) {
                summarizeBtn.addEventListener('click', () => {
                    const config = getCurrentWindowSelection();
                    const words = input.value.split(/\s+/).filter(w => w.length > 0);
                    
                    demoOutput.classList.remove('hidden');
                    let summaryQuality, summaryText;
                    
                    if (config.tokens < 75 && words.length > 100) {
                        summaryQuality = 'Poor';
                        summaryText = 'AI models exist. They do things with text. Some have windows.';
                    } else if (config.tokens < 150 && words.length > 150) {
                        summaryQuality = 'Fair';
                        summaryText = 'Language models process text using context windows. Larger windows provide better understanding but cost more computationally.';
                    } else {
                        summaryQuality = 'Good';
                        summaryText = 'Large language models use context windows to determine how much preceding text they can reference when generating responses. The balance between context length and computational efficiency is crucial for practical deployment.';
                    }
                    
                    demoOutput.innerHTML = `
                        <strong>Summary Quality:</strong> ${summaryQuality}
                        <br><strong>Generated Summary:</strong> "${summaryText}"
                        <br><small class="small-caption text-muted">Quality depends on how much context the model can "see"</small>
                    `;
                });
            }

            if (qaBtn) {
                qaBtn.addEventListener('click', () => {
                    const config = getCurrentWindowSelection();
                    const words = input.value.split(/\s+/).filter(w => w.length > 0);
                    
                    demoOutput.classList.remove('hidden');
                    let qaQuality, qaText;
                    
                    if (config.tokens < 75 && words.length > 100) {
                        qaQuality = 'Limited';
                        qaText = 'Can only answer about the most recent content. Earlier context is lost.';
                    } else if (config.tokens < 150 && words.length > 150) {
                        qaQuality = 'Moderate';
                        qaText = 'Can answer questions about recent content and some earlier context.';
                    } else {
                        qaQuality = 'Comprehensive';
                        qaText = 'Can answer questions by referencing information throughout the entire document.';
                    }
                    
                    demoOutput.innerHTML = `
                        <strong>Q&A Capability:</strong> ${qaQuality}
                        <br><strong>Analysis:</strong> ${qaText}
                        <br><small class="small-caption text-muted">Larger context windows enable better question answering</small>
                    `;
                });
            }

            // Event listeners
            input.addEventListener('input', processInput);
            // Mode switching
            modeRadios.forEach(r => {
                r.addEventListener('change', () => {
                    const mode = getCurrentMode();
                    if (mode === 'real') {
                        demoSection.classList.add('hidden');
                        realSection.classList.remove('hidden');
                    } else {
                        realSection.classList.add('hidden');
                        demoSection.classList.remove('hidden');
                    }
                    updateModeStyles();
                    updateDemoCardStyles();
                    updateRealCardStyles();
                    processInput();
                });
            });
            demoSizeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateDemoCardStyles();
                    processInput();
                });
            });

            document.querySelectorAll('input[name="q3-real-window"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    updateRealCardStyles();
                    processInput();
                });
            });

            // Initial setup
            updateModeStyles();
            updateDemoCardStyles();
            updateRealCardStyles();
            processInput();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question03Interactive = interactiveScript;
}
