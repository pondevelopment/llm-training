// Question 19: Generative vs Discriminative Models in NLP
// Created: July 13, 2025
// Educational Focus: Understanding the fundamental differences between generative and discriminative models, their use cases, and practical applications

const question = {
    title: "19. What are generative versus discriminative models in NLP?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related topics)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-02" class="text-indigo-700 underline hover:text-indigo-900">Question 2: Attention mechanisms</a></li>
                <li><a href="#question-17" class="text-indigo-700 underline hover:text-indigo-900">Question 17: Seq2Seq vs Transformers</a></li>
            </ul>
        </div>
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🤖 Generative vs Discriminative Models</h4>
            <p class="text-blue-800">Think of it like two different types of artists: a <strong>generative model</strong> is like a creative writer who can compose entirely new stories from scratch, while a <strong>discriminative model</strong> is like a literary critic who excels at categorizing and analyzing existing texts. Both are essential but serve fundamentally different purposes in NLP.</p>
        </div>
        
        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🎨 Generative Models</h5>
                <p class="text-sm text-green-700 mb-2">Model joint probability P(X,Y) to create new data</p>
                <div class="space-y-2">
                    <div class="text-xs bg-green-100 p-2 rounded">
                        <strong>Examples:</strong> OpenAI: GPT-4.1/4o, o1/o3; Anthropic: Claude 3.7/4; Google: Gemini 2.5 Pro/Flash; Meta: Llama 3.1/4; Mistral: Large 2, Mixtral
                    </div>
                    <div class="text-xs bg-green-100 p-2 rounded">
                        <strong>Tasks:</strong> Text generation, translation, summarization, creative writing
                    </div>
                    <div class="text-xs bg-green-100 p-2 rounded">
                        <strong>Output:</strong> "The future of AI will likely involve..."
                    </div>
                </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🎯 Discriminative Models</h5>
                <p class="text-sm text-purple-700 mb-2">Model conditional probability P(Y|X) to classify existing data</p>
                <div class="space-y-2">
                    <div class="text-xs bg-purple-100 p-2 rounded">
                        <strong>Examples:</strong> BERT, RoBERTa, DistilBERT, ELECTRA
                    </div>
                    <div class="text-xs bg-purple-100 p-2 rounded">
                        <strong>Tasks:</strong> Sentiment analysis, NER, question answering, classification
                    </div>
                    <div class="text-xs bg-purple-100 p-2 rounded">
                        <strong>Output:</strong> [Positive], [Person: "John"], [Answer: "Paris"]
                    </div>
                </div>
            </div>
        </div>

        <!-- Mathematical Foundation -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h5 class="font-medium text-indigo-900 mb-2">📊 Mathematical Foundation</h5>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <strong class="text-green-700">Generative Models:</strong>
                    <div class="text-xs bg-white p-2 rounded mt-1 text-center overflow-x-auto whitespace-nowrap">
                        $$ P(X, Y) = P(X\mid Y) \\times P(Y) $$
                    </div>
                    <p class="text-indigo-700 text-xs mt-1">Learn the full data distribution to generate new samples</p>
                </div>
                <div>
                    <strong class="text-purple-700">Discriminative Models:</strong>
                    <div class="text-xs bg-white p-2 rounded mt-1 text-center overflow-x-auto whitespace-nowrap">
                        $$ P(Y\mid X) $$
                    </div>
                    <p class="text-indigo-700 text-xs mt-1">Learn decision boundaries to classify given inputs</p>
                </div>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Distinction Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Task Selection:</strong> Choose generative for content creation, discriminative for analysis tasks</li>
                <li>• <strong>Data Requirements:</strong> Generative models need more diverse training data, discriminative need labeled examples</li>
                <li>• <strong>Computational Costs:</strong> Generative models are typically more expensive to train and run</li>
                <li>• <strong>Performance Trade-offs:</strong> Discriminative models often achieve higher accuracy on classification tasks</li>
                <li>• <strong>Hybrid Approaches:</strong> Modern systems often combine both types for optimal results</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔬 Model Type Classifier & Generator",
        html: `<div class="space-y-6">
            <!-- Input Section -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q19-text-select" class="block text-sm font-medium text-gray-700 mb-2">💬 Choose example text to analyze or generate from</label>
                <select id="q19-text-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="I love this new product! It's amazing and works perfectly.">Positive product review</option>
                    <option value="This movie was terrible and completely boring.">Negative movie review</option>
                    <option value="The weather today is quite nice for a walk.">Neutral weather comment</option>
                    <option value="Breaking news: Technology companies report">Incomplete news headline</option>
                    <option value="Scientists discover new treatment for">Incomplete scientific announcement</option>
                    <option value="I'm so excited about this upcoming concert!">Excited personal statement</option>
                    <option value="The company's quarterly earnings exceeded">Business news beginning</option>
                    <option value="This restaurant has decent food but slow service.">Mixed restaurant review</option>
                    <option value="Artificial intelligence will transform">AI prediction starter</option>
                    <option value="I feel anxious about the upcoming presentation.">Emotional expression</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Each example is designed to showcase different model behaviors!</p>
            </div>
            
            <!-- Model Type Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🤖 Choose Model Type</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q19-model-type" value="generative" checked class="absolute top-3 right-3">
                        <div class="model-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">🎨 Generative Model</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Creates</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Models P(X,Y) to generate new content</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Input → "Generated continuation..."
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q19-model-type" value="discriminative" class="absolute top-3 right-3">
                        <div class="model-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">🎯 Discriminative Model</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Classifies</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Models P(Y|X) to analyze content</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Input → [Positive, Confident: 95%]
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Task Selection for Discriminative -->
            <div id="q19-discriminative-tasks" class="bg-white border border-gray-200 rounded-lg p-4" style="display: none;">
                <label class="block text-sm font-medium text-gray-700 mb-3">🔍 Choose Analysis Task</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <label class="cursor-pointer">
                        <input type="radio" name="q19-task" value="sentiment" checked class="sr-only">
                        <div class="border border-gray-200 rounded p-2 text-center hover:bg-purple-50 transition-colors">
                            <div class="text-xs font-medium">😊 Sentiment</div>
                        </div>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="q19-task" value="emotion" class="sr-only">
                        <div class="border border-gray-200 rounded p-2 text-center hover:bg-purple-50 transition-colors">
                            <div class="text-xs font-medium">❤️ Emotion</div>
                        </div>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="q19-task" value="topic" class="sr-only">
                        <div class="border border-gray-200 rounded p-2 text-center hover:bg-purple-50 transition-colors">
                            <div class="text-xs font-medium">📋 Topic</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q19-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: "This movie was terrible..."</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎭 Model Output</h4>
                    <div id="q19-model-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium" aria-live="polite"></div>
                </div>
                <div id="q19-output" class="min-h-[120px] p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300" aria-live="polite"></div>
                <div id="q19-legend" class="mt-3 text-xs"></div>
            </div>
            
            <!-- Educational Comparison -->
            <div id="q19-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Understanding This Model Type</h4>
                <div id="q19-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const textSelect = document.getElementById('q19-text-select');
            const output = document.getElementById('q19-output');
            const modelTypeRadios = document.querySelectorAll('input[name="q19-model-type"]');
            const taskRadios = document.querySelectorAll('input[name="q19-task"]');
            const discriminativeTasksDiv = document.getElementById('q19-discriminative-tasks');
            const exampleBtn = document.getElementById('q19-example-btn');
            const modelIndicator = document.getElementById('q19-model-indicator');
            const legend = document.getElementById('q19-legend');
            const explanation = document.getElementById('q19-explanation');

            // Check if required elements exist
            if (!textSelect || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Model configurations
            const modelData = {
                generative: {
                    name: 'Generative Model (GPT-style)',
                    description: 'Generates new text by modeling P(X,Y) - the joint probability of input and output',
                    color: 'green'
                },
                discriminative: {
                    name: 'Discriminative Model (BERT-style)',
                    description: 'Classifies text by modeling P(Y|X) - the conditional probability of output given input',
                    color: 'purple'
                }
            };

            // Simulated model responses
            const generativeTemplates = [
                "will likely continue to evolve with new innovations.",
                "represents a significant step forward in technology.",
                "brings exciting possibilities for the future.",
                "could revolutionize how we approach this domain.",
                "offers tremendous potential for improvement.",
                "demonstrates the power of modern innovation."
            ];

            const sentimentResponses = {
                positive: ['Positive', 'Very Positive', 'Extremely Positive'],
                negative: ['Negative', 'Very Negative', 'Extremely Negative'],
                neutral: ['Neutral', 'Slightly Positive', 'Slightly Negative']
            };

            const emotionResponses = ['Joy', 'Excitement', 'Satisfaction', 'Anger', 'Sadness', 'Fear', 'Surprise', 'Trust', 'Anticipation'];
            const topicResponses = ['Technology', 'Entertainment', 'Business', 'Sports', 'Politics', 'Science', 'Health', 'Education'];

            // Helper function to get current model type
            function getCurrentModelType() {
                const selectedRadio = document.querySelector('input[name="q19-model-type"]:checked');
                return selectedRadio ? selectedRadio.value : 'generative';
            }

            // Helper function to get current task
            function getCurrentTask() {
                const selectedRadio = document.querySelector('input[name="q19-task"]:checked');
                return selectedRadio ? selectedRadio.value : 'sentiment';
            }

            // Simulate generative model output with more sophisticated responses
            function generateText(inputText) {
                const text = inputText.toLowerCase();
                
                // More specific continuations based on input patterns
                if (text.includes('breaking news: technology companies report')) {
                    return inputText + " record-breaking quarterly earnings, driven by increased demand for AI solutions and cloud services.";
                } else if (text.includes('scientists discover new treatment for')) {
                    return inputText + " Alzheimer's disease using advanced gene therapy techniques that show promising results in early trials.";
                } else if (text.includes('artificial intelligence will transform')) {
                    return inputText + " industries by automating complex tasks, enhancing decision-making, and creating new opportunities for innovation.";
                } else if (text.includes('the company\'s quarterly earnings exceeded')) {
                    return inputText + " analyst expectations by 15%, demonstrating strong performance across all business segments.";
                } else if (text.includes('love') && text.includes('product')) {
                    return inputText + " The innovative design and user-friendly interface make it a standout choice in the market.";
                } else if (text.includes('terrible') && text.includes('movie')) {
                    return inputText + " However, the cinematography was decent and some scenes showed potential for what could have been.";
                } else if (text.includes('weather') && text.includes('nice')) {
                    return inputText + " The clear skies and gentle breeze create perfect conditions for outdoor activities.";
                } else if (text.includes('excited') && text.includes('concert')) {
                    return inputText + " The venue is amazing and I've heard they put on an incredible live show.";
                } else if (text.includes('anxious') && text.includes('presentation')) {
                    return inputText + " But I've prepared thoroughly and practiced multiple times to build my confidence.";
                } else if (text.includes('restaurant') && text.includes('decent')) {
                    return inputText + " The atmosphere is cozy though, and the prices are reasonable for the portion sizes.";
                } else {
                    // Fallback to original template system
                    const templates = [
                        "will likely continue to evolve with new innovations.",
                        "represents a significant step forward in technology.",
                        "brings exciting possibilities for the future.",
                        "could revolutionize how we approach this domain.",
                        "offers tremendous potential for improvement.",
                        "demonstrates the power of modern innovation."
                    ];
                    const template = templates[Math.floor(Math.random() * templates.length)];
                    return inputText + " " + template.charAt(0).toUpperCase() + template.slice(1);
                }
            }

            // Simulate discriminative model classification with improved accuracy
            function classifyText(inputText, task) {
                const text = inputText.toLowerCase();
                let result = {};
                
                switch(task) {
                    case 'sentiment':
                        if (text.includes('love') || text.includes('amazing') || text.includes('great') || text.includes('excellent') || text.includes('wonderful') || text.includes('excited')) {
                            result = { label: 'Positive', confidence: 0.95, color: 'green' };
                        } else if (text.includes('hate') || text.includes('terrible') || text.includes('awful') || text.includes('horrible') || text.includes('boring') || text.includes('anxious')) {
                            result = { label: 'Negative', confidence: 0.92, color: 'red' };
                        } else if (text.includes('decent') || text.includes('nice') || text.includes('weather')) {
                            result = { label: 'Neutral', confidence: 0.85, color: 'gray' };
                        } else if (text.includes('breaking news') || text.includes('scientists') || text.includes('earnings') || text.includes('companies')) {
                            result = { label: 'Neutral', confidence: 0.78, color: 'gray' };
                        } else {
                            result = { label: 'Neutral', confidence: 0.72, color: 'gray' };
                        }
                        break;
                        
                    case 'emotion':
                        if (text.includes('love') || text.includes('amazing') || text.includes('excited')) {
                            result = { label: 'Joy', confidence: 0.94, color: 'yellow' };
                        } else if (text.includes('excited') || text.includes('concert')) {
                            result = { label: 'Excitement', confidence: 0.91, color: 'orange' };
                        } else if (text.includes('terrible') || text.includes('hate') || text.includes('boring')) {
                            result = { label: 'Anger', confidence: 0.89, color: 'red' };
                        } else if (text.includes('anxious') || text.includes('presentation')) {
                            result = { label: 'Anxiety', confidence: 0.88, color: 'orange' };
                        } else if (text.includes('decent') || text.includes('nice')) {
                            result = { label: 'Satisfaction', confidence: 0.82, color: 'green' };
                        } else {
                            result = { label: 'Neutral', confidence: 0.75, color: 'gray' };
                        }
                        break;
                        
                    case 'topic':
                        if (text.includes('product') || text.includes('technology') || text.includes('software') || text.includes('artificial intelligence') || text.includes('companies report')) {
                            result = { label: 'Technology', confidence: 0.93, color: 'blue' };
                        } else if (text.includes('movie') || text.includes('concert') || text.includes('show')) {
                            result = { label: 'Entertainment', confidence: 0.95, color: 'purple' };
                        } else if (text.includes('business') || text.includes('company') || text.includes('earnings') || text.includes('quarterly')) {
                            result = { label: 'Business', confidence: 0.90, color: 'green' };
                        } else if (text.includes('scientists') || text.includes('treatment') || text.includes('discover')) {
                            result = { label: 'Science', confidence: 0.92, color: 'teal' };
                        } else if (text.includes('breaking news') || text.includes('report')) {
                            result = { label: 'News', confidence: 0.87, color: 'red' };
                        } else if (text.includes('restaurant') || text.includes('food')) {
                            result = { label: 'Food & Dining', confidence: 0.89, color: 'orange' };
                        } else if (text.includes('weather') || text.includes('walk')) {
                            result = { label: 'Weather/Lifestyle', confidence: 0.84, color: 'blue' };
                        } else if (text.includes('presentation') || text.includes('anxious')) {
                            result = { label: 'Education/Work', confidence: 0.81, color: 'indigo' };
                        } else {
                            result = { label: 'General', confidence: 0.70, color: 'gray' };
                        }
                        break;
                }
                
                return result;
            }

            // Update visual indicators for model type selection
            function updateModelTypeVisuals() {
                const selectedModelType = getCurrentModelType();
                
                // Update radio button containers
                document.querySelectorAll('input[name="q19-model-type"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        if (radio.value === 'generative') {
                            container.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
                        } else {
                            container.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50');
                        }
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-green-500', 'ring-purple-500', 'bg-green-50', 'bg-purple-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Show/hide discriminative tasks
                if (discriminativeTasksDiv) {
                    discriminativeTasksDiv.style.display = selectedModelType === 'discriminative' ? 'block' : 'none';
                }
                
                // Update model indicator
                if (modelIndicator) {
                    modelIndicator.textContent = modelData[selectedModelType].name;
                    const map = {
                        green: 'bg-green-100 text-green-800',
                        purple: 'bg-purple-100 text-purple-800'
                    };
                    modelIndicator.className = `text-xs ${map[modelData[selectedModelType].color] || 'bg-gray-100 text-gray-800'} px-2 py-1 rounded font-medium`;
                }
            }

            // Update task selection visuals
            function updateTaskVisuals() {
                const selectedTask = getCurrentTask();
                
                document.querySelectorAll('input[name="q19-task"]').forEach((radio) => {
                    const container = radio.parentElement.querySelector('div');
                    
                    if (radio.checked) {
                        container.classList.add('bg-purple-100', 'border-purple-400');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('bg-purple-100', 'border-purple-400');
                        container.classList.add('border-gray-200');
                    }
                });
            }

            // Main processing function
            const processAndDisplay = () => {
                const text = textSelect.value.trim();
                const modelType = getCurrentModelType();
                const task = getCurrentTask();
                
                // Clear previous results
                output.innerHTML = '';
                if (legend) legend.innerHTML = '';
                
                updateModelTypeVisuals();
                updateTaskVisuals();

                if (!text) {
                    output.innerHTML = '<div class="text-gray-500 text-center py-8">Select text to see how the model processes it...</div>';
                    return;
                }

                // Create results display
                const resultsContainer = document.createElement('div');
                resultsContainer.className = 'space-y-4';
                
                if (modelType === 'generative') {
                    // Generative model output
                    const generated = generateText(text);
                    
                    // Input section
                    const inputSection = document.createElement('div');
                    inputSection.innerHTML = `
                        <div class="text-sm font-medium text-gray-700 mb-2">📝 Input Text:</div>
                        <div class="p-3 bg-gray-100 rounded border text-sm">${text}</div>
                    `;
                    resultsContainer.appendChild(inputSection);
                    
                    // Generated section
                    const generatedSection = document.createElement('div');
                    generatedSection.innerHTML = `
                        <div class="text-sm font-medium text-green-700 mb-2">🎨 Generated Continuation:</div>
                        <div class="p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <span class="text-gray-600">${text}</span>
                            <span class="text-green-700 font-medium">${generated.slice(text.length)}</span>
                        </div>
                    `;
                    resultsContainer.appendChild(generatedSection);
                    
                    // Stats
                    const statsSection = document.createElement('div');
                    statsSection.className = 'grid grid-cols-3 gap-3 p-3 bg-white rounded border text-sm';
                    statsSection.innerHTML = `
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-600">${text.split(' ').length}</div>
                            <div class="text-gray-600 text-xs">Input Tokens</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-600">${generated.split(' ').length}</div>
                            <div class="text-gray-600 text-xs">Total Tokens</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-purple-600">${(generated.split(' ').length - text.split(' ').length)}</div>
                            <div class="text-gray-600 text-xs">Generated</div>
                        </div>
                    `;
                    resultsContainer.appendChild(statsSection);
                    
                } else {
                    // Discriminative model output
                    const classification = classifyText(text, task);
                    
                    // Input section
                    const inputSection = document.createElement('div');
                    inputSection.innerHTML = `
                        <div class="text-sm font-medium text-gray-700 mb-2">📝 Input Text:</div>
                        <div class="p-3 bg-gray-100 rounded border text-sm">${text}</div>
                    `;
                    resultsContainer.appendChild(inputSection);
                    
                    // Classification section
                    const classificationSection = document.createElement('div');
                    const colorMap = {
                        gray:  { label: 'text-gray-600',   badgeBg: 'bg-gray-100',   badgeText: 'text-gray-800',   bar: 'bg-gray-500' },
                        red:   { label: 'text-red-600',    badgeBg: 'bg-red-100',    badgeText: 'text-red-800',    bar: 'bg-red-500' },
                        green: { label: 'text-green-600',  badgeBg: 'bg-green-100',  badgeText: 'text-green-800',  bar: 'bg-green-500' },
                        yellow:{ label: 'text-yellow-600', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-800', bar: 'bg-yellow-500' },
                        orange:{ label: 'text-orange-600', badgeBg: 'bg-orange-100', badgeText: 'text-orange-800', bar: 'bg-orange-500' },
                        blue:  { label: 'text-blue-600',   badgeBg: 'bg-blue-100',   badgeText: 'text-blue-800',   bar: 'bg-blue-500' },
                        teal:  { label: 'text-teal-600',   badgeBg: 'bg-teal-100',   badgeText: 'text-teal-800',   bar: 'bg-teal-500' },
                        indigo:{ label: 'text-indigo-600', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800', bar: 'bg-indigo-500' },
                        purple:{ label: 'text-purple-600', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', bar: 'bg-purple-500' }
                    };
                    const c = colorMap[classification.color] || colorMap.gray;
                    classificationSection.innerHTML = `
                        <div class="text-sm font-medium text-purple-700 mb-2">🎯 ${task.charAt(0).toUpperCase() + task.slice(1)} Classification:</div>
                        <div class="p-4 bg-purple-50 border border-purple-200 rounded">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-lg font-bold ${c.label}">${classification.label}</span>
                                <span class="text-xs ${c.badgeBg} ${c.badgeText} px-2 py-1 rounded">
                                    ${(classification.confidence * 100).toFixed(1)}% confident
                                </span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="${c.bar} h-2 rounded-full transition-all duration-500" style="width: ${classification.confidence * 100}%"></div>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(classificationSection);
                    
                    // Alternative predictions
                    const alternativesSection = document.createElement('div');
                    alternativesSection.innerHTML = `
                        <div class="text-sm font-medium text-gray-700 mb-2">🔄 Alternative Predictions:</div>
                        <div class="space-y-1">
                            ${task === 'sentiment' ? 
                                ['Positive', 'Negative', 'Neutral'].filter(s => s !== classification.label).map(s => 
                                    `<div class="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                        <span>${s}</span>
                                        <span>${((1 - classification.confidence) * Math.random() * 100).toFixed(1)}%</span>
                                    </div>`
                                ).join('') :
                                task === 'emotion' ?
                                emotionResponses.filter(e => e !== classification.label).slice(0, 3).map(e =>
                                    `<div class="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                        <span>${e}</span>
                                        <span>${((1 - classification.confidence) * Math.random() * 100).toFixed(1)}%</span>
                                    </div>`
                                ).join('') :
                                topicResponses.filter(t => t !== classification.label).slice(0, 3).map(t =>
                                    `<div class="flex justify-between text-xs p-2 bg-gray-50 rounded">
                                        <span>${t}</span>
                                        <span>${((1 - classification.confidence) * Math.random() * 100).toFixed(1)}%</span>
                                    </div>`
                                ).join('')
                            }
                        </div>
                    `;
                    resultsContainer.appendChild(alternativesSection);
                }

                output.appendChild(resultsContainer);

                // Update educational explanation
                updateExplanation(modelType, task);
            };

            // Update the educational explanation based on selected model type
            function updateExplanation(modelType, task) {
                if (!explanation) return;
                
                const explanations = {
                    'generative': `
                        <strong>🎨 Generative Model (like GPT)</strong> works by learning the joint probability P(X,Y) of text sequences.
                        <br><br>• <strong>How it works:</strong> The model predicts the next word based on all previous words, building text token by token
                        <br>• <strong>Training:</strong> Learns from massive text corpora to understand language patterns and continue text naturally
                        <br>• <strong>Strength:</strong> Can create entirely new, coherent content that didn't exist in training data
                        <br>• <strong>Use cases:</strong> Content generation, creative writing, translation, summarization, conversation
                        <br>• <strong>Example models:</strong> OpenAI: GPT-4.1/4o, o1/o3; Anthropic: Claude 3.7/4; Google: Gemini 2.5 Pro/Flash; Meta: Llama 3.1/4; Mistral: Large 2, Mixtral, Magistral
                        <br>• <strong>Note:</strong> ChatGPT is an application using GPT models; cite the underlying model when possible
                    `,
                    'discriminative': `
                        <strong>🎯 Discriminative Model (like BERT)</strong> works by learning conditional probability P(Y|X) to classify inputs.
                        <br><br>• <strong>How it works:</strong> The model learns decision boundaries to separate different categories of text
                        <br>• <strong>Training:</strong> Uses labeled data to learn patterns that distinguish between classes (positive/negative, topics, etc.)
                        <br>• <strong>Strength:</strong> Highly accurate at classification and analysis tasks with clear categories
                        <br>• <strong>Current task:</strong> ${task.charAt(0).toUpperCase() + task.slice(1)} analysis - determining the ${task} of input text
                        <br>• <strong>Example models:</strong> BERT, RoBERTa, DistilBERT, ELECTRA
                    `
                };
                
                explanation.innerHTML = explanations[modelType] || '';
            }

            // Example cycling functionality - now cycles through dropdown options
            const examples = [
                { 
                    value: 'This movie was terrible and completely boring.', 
                    modelType: 'discriminative', 
                    task: 'sentiment',
                    note: 'Perfect for sentiment analysis - clear negative emotion' 
                },
                { 
                    value: 'Breaking news: Technology companies report', 
                    modelType: 'generative', 
                    task: 'sentiment',
                    note: 'Great for text generation - incomplete sentence to continue' 
                },
                { 
                    value: "I'm so excited about this upcoming concert!", 
                    modelType: 'discriminative', 
                    task: 'emotion',
                    note: 'Shows strong positive emotion - good for emotion classification' 
                },
                { 
                    value: 'Artificial intelligence will transform', 
                    modelType: 'generative', 
                    task: 'topic',
                    note: 'AI topic starter - perfect for text generation' 
                },
                { 
                    value: 'Scientists discover new treatment for', 
                    modelType: 'generative', 
                    task: 'topic',
                    note: 'Science news starter - excellent for continuation' 
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    textSelect.value = example.value;
                    document.querySelector(`input[name="q19-model-type"][value="${example.modelType}"]`).checked = true;
                    document.querySelector(`input[name="q19-task"][value="${example.task}"]`).checked = true;
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    const shortText = nextExample.value.length > 25 ? nextExample.value.substring(0, 25) + '...' : nextExample.value;
                    exampleBtn.innerHTML = `Try: "${shortText}"`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            textSelect.addEventListener('change', processAndDisplay);
            modelTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModelTypeVisuals();
                    processAndDisplay();
                });
            });
            taskRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateTaskVisuals();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateModelTypeVisuals();
            updateTaskVisuals();
            processAndDisplay();
        }
    }
};
