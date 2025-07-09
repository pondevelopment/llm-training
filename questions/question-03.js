// Question 3: Context Window in LLMs
// Created: July 8, 2025
// Educational Focus: Understanding context windows, memory limitations, and computational trade-offs

const question = {
    title: "3. What is the context window in LLMs, and why does it matter?",
    answer: `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧠 What is a Context Window?</h4>
            <p class="text-blue-800">The context window is the maximum number of tokens an LLM can process and remember at one time. Think of it like your short-term memory when reading - you can only hold so much information in your head before earlier details start to fade away.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Small Window (512-2K tokens)</h5>
                <p class="text-sm text-green-700">Fast processing, lower costs, but limited context</p>
                <code class="text-xs bg-green-100 px-1 rounded">Good for: Short responses, simple tasks</code>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Medium Window (4K-8K tokens)</h5>
                <p class="text-sm text-purple-700">Balanced performance and context retention</p>
                <code class="text-xs bg-purple-100 px-1 rounded">Good for: Most conversations, code analysis</code>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Large Window (32K-128K+ tokens)</h5>
                <p class="text-sm text-orange-700">Excellent context but computationally expensive</p>
                <code class="text-xs bg-orange-100 px-1 rounded">Good for: Document analysis, long conversations</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Memory Continuity:</strong> Larger windows maintain conversation context across many exchanges</li>
                <li>• <strong>Document Understanding:</strong> Can process entire articles, books, or codebases at once</li>
                <li>• <strong>Cost vs Performance:</strong> Computational cost grows quadratically with window size</li>
                <li>• <strong>Real-world Applications:</strong> Critical for tasks like summarization, analysis, and long-form content</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Context Window Explorer",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q3-text-input" class="block text-sm font-medium text-gray-700 mb-2">📝 Document to Analyze</label>
                <textarea id="q3-text-input" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Paste text to analyze context window effects...">Large Language Models represent a breakthrough in artificial intelligence, transforming how we interact with computers through natural language. These models, trained on vast datasets, can understand and generate human-like text with remarkable fluency. The context window is a crucial architectural feature that determines how much preceding text the model can reference when generating each new token. A larger context window allows for better coherence across longer texts but comes with significant computational costs. Modern models like GPT-4 have context windows of 8K to 128K tokens, enabling them to process entire documents or maintain context across very long conversations. This capability is essential for tasks such as document summarization, creative writing, code generation, and complex problem-solving that requires maintaining awareness of multiple interconnected concepts throughout a lengthy interaction.</textarea>
                <p class="text-xs text-blue-700 font-medium mt-2 bg-blue-100 px-2 py-1 rounded">👆 Edit the text to see how different context windows affect understanding!</p>
            </div>
            
            <!-- Window Size Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Context Window Size</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="cursor-pointer">
                        <input type="radio" name="q3-window-size" value="small" class="sr-only">
                        <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-colors">
                            <div class="font-medium text-green-900">Small (50 tokens)</div>
                            <div class="text-xs text-green-700">Fast & Efficient</div>
                            <div class="text-xs text-green-600 mt-1">~200 words</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q3-window-size" value="medium" class="sr-only" checked>
                        <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div class="font-medium text-purple-900">Medium (100 tokens)</div>
                            <div class="text-xs text-purple-700">Balanced</div>
                            <div class="text-xs text-purple-600 mt-1">~400 words</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q3-window-size" value="large" class="sr-only">
                        <div class="border-2 border-orange-200 rounded-lg p-3 hover:border-orange-400 hover:bg-orange-50 transition-colors">
                            <div class="font-medium text-orange-900">Large (200 tokens)</div>
                            <div class="text-xs text-orange-700">Maximum Context</div>
                            <div class="text-xs text-orange-600 mt-1">~800 words</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q3-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: Long research paper excerpt</button>
            </div>
            
            <!-- Results -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Context Window Visualization</h4>
                    <div id="q3-window-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Medium Window</div>
                </div>
                <div id="q3-output" class="min-h-[120px] p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300 text-sm leading-relaxed overflow-auto max-h-60">Enter or edit text above to begin...</div>
                <div id="q3-legend" class="mt-3 text-xs bg-blue-50 p-2 rounded">
                    <div class="flex flex-wrap gap-4">
                        <span class="inline-flex items-center gap-1">
                            <span class="w-3 h-3 bg-blue-200 rounded"></span>
                            Within Context Window
                        </span>
                        <span class="inline-flex items-center gap-1">
                            <span class="w-3 h-3 bg-gray-200 rounded"></span>
                            Outside Context (Forgotten)
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Performance Metrics -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 class="font-medium text-green-900 mb-2">📈 Coherence Quality</h5>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div id="q3-coherence-bar" class="bg-green-500 h-3 rounded-full transition-all duration-500" style="width: 60%"></div>
                    </div>
                    <p id="q3-coherence-text" class="text-xs text-green-700 mt-1">Good context retention</p>
                </div>
                
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h5 class="font-medium text-red-900 mb-2">⚡ Computational Cost</h5>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div id="q3-cost-bar" class="bg-red-500 h-3 rounded-full transition-all duration-500" style="width: 40%"></div>
                    </div>
                    <p id="q3-cost-text" class="text-xs text-red-700 mt-1">Moderate processing load</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 class="font-medium text-blue-900 mb-2">🎯 Use Case Fit</h5>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div id="q3-usecase-bar" class="bg-blue-500 h-3 rounded-full transition-all duration-500" style="width: 70%"></div>
                    </div>
                    <p id="q3-usecase-text" class="text-xs text-blue-700 mt-1">Good for most tasks</p>
                </div>
            </div>
            
            <!-- Interactive Demo -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-3">🎮 Task Simulation</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    <button id="q3-summarize-btn" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors">📄 Generate Summary</button>
                    <button id="q3-qa-btn" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-2 rounded-lg transition-colors">❓ Answer Questions</button>
                </div>
                <div id="q3-demo-output" class="mt-3 p-3 bg-white rounded-lg border hidden">
                    <div class="text-sm"></div>
                </div>
            </div>
            
            <!-- Educational Explanation -->
            <div id="q3-explanation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 How Context Windows Work</h4>
                <div id="q3-explanation-content" class="text-sm text-yellow-800">
                    Select a window size above and edit the text to see how context limitations affect the model's ability to understand and process information. Larger windows retain more context but require significantly more computational resources.
                </div>
            </div>
        </div>`,
        script: () => {
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
            
            if (!input || !output) return;

            // Configuration data for different window sizes
            const windowConfig = {
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

            // Get current window size selection
            function getCurrentWindowSize() {
                const selected = document.querySelector('input[name="q3-window-size"]:checked');
                return selected ? selected.value : 'medium';
            }

            // Main processing function
            const processInput = () => {
                const text = input.value;
                const words = text.split(/\s+/).filter(w => w.length > 0);
                const windowSize = getCurrentWindowSize();
                const config = windowConfig[windowSize];
                
                if (words.length === 0) {
                    output.innerHTML = '<div class="text-center text-gray-500 py-8"><p class="text-lg mb-2">📝 Enter text above to begin</p><p class="text-sm">Try pasting a long article or document</p></div>';
                    return;
                }

                // Clear previous content
                output.innerHTML = '';
                
                // Create word elements with context window highlighting
                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word + ' ';
                    
                    if (index < config.tokens) {
                        span.className = `inline bg-blue-200 text-blue-900 px-1 rounded-sm mr-1 transition-all duration-300`;
                        span.title = `Token ${index + 1}: Within context window`;
                    } else {
                        span.className = `inline bg-gray-200 text-gray-600 px-1 rounded-sm mr-1 opacity-60 transition-all duration-300`;
                        span.title = `Token ${index + 1}: Outside context window (forgotten)`;
                    }
                    
                    output.appendChild(span);
                });

                // Add truncation indicator if text exceeds window
                if (words.length > config.tokens) {
                    const indicator = document.createElement('div');
                    indicator.className = 'mt-2 text-xs text-gray-500 italic border-t pt-2';
                    indicator.innerHTML = `⚠️ ${words.length - config.tokens} tokens truncated (model cannot see this content)`;
                    output.appendChild(indicator);
                }

                // Update metrics
                updateMetrics(config);
                updateExplanation(config, words.length);
                
                // Hide demo output when input changes
                demoOutput.classList.add('hidden');
            };

            // Update performance metrics
            function updateMetrics(config) {
                windowIndicator.textContent = config.name;
                windowIndicator.className = `text-xs bg-${config.color}-100 text-${config.color}-700 px-2 py-1 rounded font-medium`;
                
                coherenceBar.style.width = `${config.coherence}%`;
                costBar.style.width = `${config.cost}%`;
                usecaseBar.style.width = `${config.usecase}%`;
                
                coherenceText.textContent = config.coherenceText;
                costText.textContent = config.costText;
                usecaseText.textContent = config.usecaseText;
            }

            // Update educational explanation
            function updateExplanation(config, wordCount) {
                const tokensInWindow = Math.min(wordCount, config.tokens);
                const tokensMissed = Math.max(0, wordCount - config.tokens);
                
                explanationContent.innerHTML = `
                    <strong>${config.name}:</strong> ${config.description}
                    <br><br>
                    <strong>Current Analysis:</strong>
                    <br>• Processing ${tokensInWindow} of ${wordCount} tokens (${Math.round((tokensInWindow/wordCount)*100)}% of document)
                    ${tokensMissed > 0 ? `<br>• <span class="text-red-600">${tokensMissed} tokens are outside the context window and will be ignored</span>` : '<br>• ✅ Entire document fits within context window'}
                    <br>• Computational complexity: O(n²) where n = ${config.tokens}
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

            // Demo simulation buttons
            if (summarizeBtn) {
                summarizeBtn.addEventListener('click', () => {
                    const windowSize = getCurrentWindowSize();
                    const config = windowConfig[windowSize];
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
                        <br><small class="text-gray-600">Quality depends on how much context the model can "see"</small>
                    `;
                });
            }

            if (qaBtn) {
                qaBtn.addEventListener('click', () => {
                    const windowSize = getCurrentWindowSize();
                    const config = windowConfig[windowSize];
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
                        <br><small class="text-gray-600">Larger context windows enable better question answering</small>
                    `;
                });
            }

            // Event listeners
            input.addEventListener('input', processInput);
            document.querySelectorAll('input[name="q3-window-size"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    // Update visual selection
                    document.querySelectorAll('input[name="q3-window-size"]').forEach(r => {
                        const card = r.nextElementSibling;
                        if (r.checked) {
                            card.classList.remove('border-green-200', 'border-purple-200', 'border-orange-200');
                            card.classList.add('border-green-400', 'bg-green-50');
                            if (r.value === 'medium') {
                                card.classList.remove('border-green-400', 'bg-green-50');
                                card.classList.add('border-purple-400', 'bg-purple-50');
                            } else if (r.value === 'large') {
                                card.classList.remove('border-green-400', 'bg-green-50');
                                card.classList.add('border-orange-400', 'bg-orange-50');
                            }
                        } else {
                            card.classList.remove('border-green-400', 'border-purple-400', 'border-orange-400', 'bg-green-50', 'bg-purple-50', 'bg-orange-50');
                            if (r.value === 'small') card.classList.add('border-green-200');
                            else if (r.value === 'medium') card.classList.add('border-purple-200');
                            else card.classList.add('border-orange-200');
                        }
                    });
                    processInput();
                });
            });

            // Initial setup
            processInput();
        }
    }
};
