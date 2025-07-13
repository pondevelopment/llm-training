// Question 20: GPT-4 vs GPT-3 - Features and Applications
// Created: July 13, 2025
// Educational Focus: Understanding the key improvements and differences between GPT-3 and GPT-4, including multimodal capabilities, context length, and accuracy

const question = {
    title: "20. How does GPT-4 differ from GPT-3 in features and applications?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🚀 GPT-4 vs GPT-3: The Evolution</h4>
            <p class="text-blue-800">Think of GPT-4 as a <strong>significantly upgraded smartphone</strong> compared to GPT-3's older model. While both can make calls and send texts (generate text), GPT-4 can also take photos (process images), has much more storage (larger context), and makes fewer mistakes (enhanced accuracy). It's the same core technology, but with major improvements that unlock entirely new possibilities.</p>
        </div>
        
        <!-- Direct Comparison Grid -->
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">📱 GPT-3 (2020)</h5>
                <div class="space-y-2 text-sm text-orange-700">
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>Input:</strong> Text only
                    </div>
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>Context:</strong> 4,096 tokens (~3,000 words)
                    </div>
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>Parameters:</strong> 175 billion
                    </div>
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>Accuracy:</strong> Good but prone to hallucinations
                    </div>
                    <div class="bg-orange-100 p-2 rounded">
                        <strong>Applications:</strong> Text generation, basic Q&A, creative writing
                    </div>
                </div>
            </div>
            
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🌟 GPT-4 (2023)</h5>
                <div class="space-y-2 text-sm text-green-700">
                    <div class="bg-green-100 p-2 rounded">
                        <strong>Input:</strong> Text AND images (multimodal)
                    </div>
                    <div class="bg-green-100 p-2 rounded">
                        <strong>Context:</strong> 25,000+ tokens (~18,000 words)
                    </div>
                    <div class="bg-green-100 p-2 rounded">
                        <strong>Parameters:</strong> ~1 trillion (estimated)
                    </div>
                    <div class="bg-green-100 p-2 rounded">
                        <strong>Accuracy:</strong> Significantly more reliable
                    </div>
                    <div class="bg-green-100 p-2 rounded">
                        <strong>Applications:</strong> Visual Q&A, complex analysis, coding, research
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Improvements -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">👁️ Multimodal Input</h5>
                <p class="text-sm text-purple-700 mb-2">Can process both text and images</p>
                <div class="text-xs bg-purple-100 p-2 rounded">
                    <strong>Example:</strong> "What's in this image?" + photo → detailed description
                </div>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded border-l-4 border-indigo-400">
                <h5 class="font-medium text-indigo-900 mb-2">📚 Larger Context</h5>
                <p class="text-sm text-indigo-700 mb-2">6x more context window for complex tasks</p>
                <div class="text-xs bg-indigo-100 p-2 rounded">
                    <strong>Benefit:</strong> Can analyze entire documents, maintain longer conversations
                </div>
            </div>
            
            <div class="bg-teal-50 p-4 rounded border-l-4 border-teal-400">
                <h5 class="font-medium text-teal-900 mb-2">🎯 Enhanced Accuracy</h5>
                <p class="text-sm text-teal-700 mb-2">Better fine-tuning reduces errors</p>
                <div class="text-xs bg-teal-100 p-2 rounded">
                    <strong>Result:</strong> More reliable facts, fewer hallucinations
                </div>
            </div>
        </div>

        <!-- Performance Comparison -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h5 class="font-medium text-gray-900 mb-3">📊 Performance Benchmarks</h5>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <div class="font-medium text-gray-700 mb-2">Academic Benchmarks:</div>
                    <div class="space-y-1">
                        <div class="flex justify-between">
                            <span>SAT Math:</span>
                            <span><span class="text-orange-600">GPT-3: 590</span> → <span class="text-green-600">GPT-4: 700</span></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Bar Exam:</span>
                            <span><span class="text-orange-600">GPT-3: 10th%</span> → <span class="text-green-600">GPT-4: 90th%</span></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Coding (HumanEval):</span>
                            <span><span class="text-orange-600">GPT-3: 0%</span> → <span class="text-green-600">GPT-4: 67%</span></span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="font-medium text-gray-700 mb-2">Language Understanding:</div>
                    <div class="space-y-1">
                        <div class="flex justify-between">
                            <span>Reading Comprehension:</span>
                            <span><span class="text-orange-600">Good</span> → <span class="text-green-600">Excellent</span></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Factual Accuracy:</span>
                            <span><span class="text-orange-600">75%</span> → <span class="text-green-600">85%+</span></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Reasoning:</span>
                            <span><span class="text-orange-600">Limited</span> → <span class="text-green-600">Enhanced</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why These Improvements Matter</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Multimodal Capabilities:</strong> Enables visual question answering, document analysis, and image-based applications</li>
                <li>• <strong>Extended Context:</strong> Allows for complex document analysis, longer conversations, and better task completion</li>
                <li>• <strong>Improved Reliability:</strong> More trustworthy for professional applications, research, and critical decision-making</li>
                <li>• <strong>Better Reasoning:</strong> Enhanced logical thinking and problem-solving capabilities across domains</li>
                <li>• <strong>Professional Applications:</strong> Suitable for legal analysis, medical consultation, advanced coding, and academic research</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔬 GPT Model Comparison Simulator",
        html: `<div class="space-y-6">
            <!-- Model Selection -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">🤖 Choose GPT Model to Test</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q20-model" value="gpt3" checked class="absolute top-3 right-3">
                        <div class="model-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">📱 GPT-3</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">2020</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Text-only, 4K context, 175B parameters</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Input: Text → Output: Text
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q20-model" value="gpt4" class="absolute top-3 right-3">
                        <div class="model-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">🌟 GPT-4</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2023</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Multimodal, 25K+ context, ~1T parameters</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                Input: Text + Images → Output: Enhanced
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
            <!-- Test Scenario Selection with Task Type Display -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label for="q20-scenario-select" class="block text-sm font-medium text-gray-700 mb-2">🔍 Choose Test Scenario</label>
                <select id="q20-scenario-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3">
                    <option value="creative">📝 Creative Writing: Write a short story</option>
                    <option value="analysis">📚 Document Analysis: Summarize research paper</option>
                    <option value="coding">💻 Code Generation: Write Python function</option>
                    <option value="math">🧮 Math Problem: Solve complex equation</option>
                    <option value="image">👁️ Visual Analysis: Analyze uploaded photo</option>
                    <option value="conversation">💬 Long Context: Multi-turn dialogue</option>
                    <option value="facts">📖 Factual Knowledge: Historical information</option>
                    <option value="reasoning">🧠 Complex Reasoning: Logic puzzle solution</option>
                </select>
                <div id="q20-task-indicator" class="text-xs bg-blue-50 border border-blue-200 rounded p-2 text-blue-800">
                    <span class="font-medium">Task Type:</span> <span id="q20-current-task">Text Generation</span>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Comparisons:</span>
                <button id="q20-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try: Creative Writing Comparison</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎭 Model Performance Simulation</h4>
                    <div id="q20-model-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q20-output" class="min-h-[120px] p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300"></div>
            </div>
            
            <!-- Feature Comparison -->
            <div id="q20-comparison" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Key Differences for This Task</h4>
                <div id="q20-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const scenarioSelect = document.getElementById('q20-scenario-select');
            const output = document.getElementById('q20-output');
            const modelRadios = document.querySelectorAll('input[name="q20-model"]');
            const exampleBtn = document.getElementById('q20-example-btn');
            const modelIndicator = document.getElementById('q20-model-indicator');
            const explanation = document.getElementById('q20-explanation');
            const currentTaskSpan = document.getElementById('q20-current-task');

            // Check if required elements exist
            if (!scenarioSelect || !output) {
                console.error('Required DOM elements not found');
                return;
            }

            // Model data with capabilities and limitations
            const modelData = {
                gpt3: {
                    name: 'GPT-3 (2020)',
                    color: 'orange',
                    capabilities: {
                        text: 'Good',
                        visual: 'Not Supported',
                        reasoning: 'Limited',
                        context: '4K tokens',
                        accuracy: '75%',
                        speed: 'Fast'
                    },
                    limitations: ['Text input only', 'Limited context', 'Prone to hallucinations', 'Weaker reasoning']
                },
                gpt4: {
                    name: 'GPT-4 (2023)',
                    color: 'green',
                    capabilities: {
                        text: 'Excellent',
                        visual: 'Supported',
                        reasoning: 'Enhanced',
                        context: '25K+ tokens',
                        accuracy: '85%+',
                        speed: 'Moderate'
                    },
                    limitations: ['Slower inference', 'Higher cost', 'Still has some limitations']
                }
            };

            // Task scenarios with model-specific responses and task type mapping
            const scenarios = {
                creative: {
                    name: 'Creative Writing',
                    taskType: 'Text Generation',
                    gpt3: {
                        quality: 'Good',
                        output: 'Produces creative content but may lack consistency in longer pieces. Sometimes repeats themes or loses narrative thread.',
                        score: 75,
                        strengths: ['Fast generation', 'Creative ideas'],
                        weaknesses: ['Inconsistent quality', 'Limited context awareness']
                    },
                    gpt4: {
                        quality: 'Excellent',
                        output: 'Creates highly coherent, engaging stories with consistent character development and plot progression throughout.',
                        score: 90,
                        strengths: ['Consistent narrative', 'Rich character development', 'Better plot structure'],
                        weaknesses: ['Slower generation', 'Higher resource usage']
                    }
                },
                analysis: {
                    name: 'Document Analysis',
                    taskType: 'Long Context Processing',
                    gpt3: {
                        quality: 'Limited',
                        output: 'Can summarize short documents but struggles with longer texts due to context limitations. May miss key connections.',
                        score: 60,
                        strengths: ['Basic summarization', 'Fast processing'],
                        weaknesses: ['Context window too small', 'Misses connections across long documents']
                    },
                    gpt4: {
                        quality: 'Excellent',
                        output: 'Analyzes entire documents comprehensively, identifies key themes, and maintains context across long passages.',
                        score: 95,
                        strengths: ['Full document analysis', 'Contextual understanding', 'Identifies complex patterns'],
                        weaknesses: ['Requires more processing time']
                    }
                },
                coding: {
                    name: 'Code Generation',
                    taskType: 'Programming & Logic',
                    gpt3: {
                        quality: 'Basic',
                        output: 'Generates simple code snippets but often contains bugs or incomplete implementations for complex tasks.',
                        score: 45,
                        strengths: ['Basic syntax generation', 'Simple functions'],
                        weaknesses: ['Frequent bugs', 'Poor complex logic', 'Limited understanding']
                    },
                    gpt4: {
                        quality: 'Advanced',
                        output: 'Produces high-quality, well-structured code with proper error handling and documentation. Passes most test cases.',
                        score: 85,
                        strengths: ['Clean code structure', 'Error handling', 'Good documentation', 'Complex logic'],
                        weaknesses: ['Still occasional edge case issues']
                    }
                },
                math: {
                    name: 'Mathematical Problem Solving',
                    taskType: 'Quantitative Reasoning',
                    gpt3: {
                        quality: 'Inconsistent',
                        output: 'Can solve basic math problems but frequently makes calculation errors and struggles with multi-step reasoning.',
                        score: 50,
                        strengths: ['Basic arithmetic', 'Simple formulas'],
                        weaknesses: ['Calculation errors', 'Poor multi-step reasoning', 'Inconsistent methodology']
                    },
                    gpt4: {
                        quality: 'Much Improved',
                        output: 'Shows systematic problem-solving approach with step-by-step reasoning and significantly fewer calculation errors.',
                        score: 80,
                        strengths: ['Systematic approach', 'Better accuracy', 'Clear step-by-step solutions'],
                        weaknesses: ['Still not perfect for very complex proofs']
                    }
                },
                image: {
                    name: 'Visual Analysis',
                    taskType: 'Multimodal Processing',
                    gpt3: {
                        quality: 'Not Available',
                        output: 'Cannot process images. This capability is not supported in GPT-3.',
                        score: 0,
                        strengths: ['N/A'],
                        weaknesses: ['No visual processing capability']
                    },
                    gpt4: {
                        quality: 'Excellent',
                        output: 'Provides detailed image descriptions, identifies objects, reads text in images, and answers visual questions accurately.',
                        score: 90,
                        strengths: ['Detailed visual understanding', 'Text recognition', 'Object identification', 'Scene analysis'],
                        weaknesses: ['Cannot generate images', 'Some fine detail limitations']
                    }
                },
                conversation: {
                    name: 'Extended Conversation',
                    taskType: 'Long Context Memory',
                    gpt3: {
                        quality: 'Forgetful',
                        output: 'Maintains conversation for short exchanges but loses context quickly in longer discussions.',
                        score: 55,
                        strengths: ['Natural responses', 'Good for short exchanges'],
                        weaknesses: ['Forgets early context', 'Inconsistent personality', 'Limited memory']
                    },
                    gpt4: {
                        quality: 'Consistent',
                        output: 'Maintains context and consistent personality throughout very long conversations with coherent references to earlier topics.',
                        score: 90,
                        strengths: ['Long-term memory', 'Consistent personality', 'Contextual references'],
                        weaknesses: ['Eventually hits context limits']
                    }
                },
                facts: {
                    name: 'Factual Accuracy',
                    taskType: 'Knowledge Retrieval',
                    gpt3: {
                        quality: 'Unreliable',
                        output: 'Provides information but frequently includes incorrect facts or "hallucinated" information presented confidently.',
                        score: 65,
                        strengths: ['Broad knowledge base', 'Confident presentation'],
                        weaknesses: ['Frequent hallucinations', 'Outdated information', 'Overconfident in errors']
                    },
                    gpt4: {
                        quality: 'More Reliable',
                        output: 'Significantly more accurate with better fact-checking and admission of uncertainty when unsure.',
                        score: 85,
                        strengths: ['Higher accuracy', 'Better uncertainty handling', 'Improved fact-checking'],
                        weaknesses: ['Still occasional errors', 'Knowledge cutoff limitations']
                    }
                },
                reasoning: {
                    name: 'Complex Reasoning',
                    taskType: 'Logical Analysis',
                    gpt3: {
                        quality: 'Basic',
                        output: 'Can follow simple logical steps but struggles with complex multi-step reasoning and often jumps to conclusions.',
                        score: 55,
                        strengths: ['Simple logical steps', 'Pattern recognition'],
                        weaknesses: ['Weak multi-step reasoning', 'Jumps to conclusions', 'Poor logical consistency']
                    },
                    gpt4: {
                        quality: 'Enhanced',
                        output: 'Demonstrates systematic reasoning with clear logical progression and better handling of complex, multi-step problems.',
                        score: 85,
                        strengths: ['Systematic approach', 'Multi-step reasoning', 'Logical consistency', 'Better analysis'],
                        weaknesses: ['Still not perfect for very abstract reasoning']
                    }
                }
            };

            // Helper functions
            function getCurrentModel() {
                const selectedRadio = document.querySelector('input[name="q20-model"]:checked');
                return selectedRadio ? selectedRadio.value : 'gpt3';
            }

            function getCurrentScenario() {
                return scenarioSelect.value;
            }

            // Update task type display based on scenario
            function updateTaskTypeDisplay() {
                const scenario = getCurrentScenario();
                const scenarioData = scenarios[scenario];
                if (currentTaskSpan && scenarioData) {
                    currentTaskSpan.textContent = scenarioData.taskType;
                }
            }

            // Update visual indicators
            function updateModelVisuals() {
                const selectedModel = getCurrentModel();
                
                // Update radio button containers
                document.querySelectorAll('input[name="q20-model"]').forEach((radio) => {
                    const container = radio.closest('label');
                    
                    if (radio.checked) {
                        if (radio.value === 'gpt3') {
                            container.classList.add('ring-2', 'ring-orange-500', 'bg-orange-50');
                        } else {
                            container.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
                        }
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-orange-500', 'ring-green-500', 'bg-orange-50', 'bg-green-50');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update model indicator
                if (modelIndicator) {
                    modelIndicator.textContent = modelData[selectedModel].name;
                    const color = modelData[selectedModel].color;
                    modelIndicator.className = `text-xs bg-${color}-100 text-${color}-800 px-2 py-1 rounded font-medium`;
                }
            }

            // Update task selection visuals
            function updateTaskVisuals() {
                const selectedTask = getCurrentTask();
                
                document.querySelectorAll('input[name="q20-task"]').forEach((radio) => {
                    const container = radio.parentElement.querySelector('div');
                    
                    if (radio.checked) {
                        container.classList.add('bg-blue-100', 'border-blue-400');
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('bg-blue-100', 'border-blue-400');
                        container.classList.add('border-gray-200');
                    }
                });
            }

            // Main processing function
            const processAndDisplay = () => {
                const model = getCurrentModel();
                const scenario = getCurrentScenario();
                
                // Clear previous results
                output.innerHTML = '';
                
                updateModelVisuals();
                updateTaskTypeDisplay();

                const scenarioData = scenarios[scenario];
                const modelResponse = scenarioData[model];
                
                // Create results display
                const resultsContainer = document.createElement('div');
                resultsContainer.className = 'space-y-4';
                
                // Scenario header
                const headerSection = document.createElement('div');
                headerSection.innerHTML = `
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-medium text-gray-900">📋 ${scenarioData.name}</h5>
                        <div class="text-xs bg-gray-100 px-2 py-1 rounded">Score: ${modelResponse.score}/100</div>
                    </div>
                `;
                resultsContainer.appendChild(headerSection);
                
                // Performance visualization
                const performanceSection = document.createElement('div');
                const color = model === 'gpt3' ? 'orange' : 'green';
                performanceSection.innerHTML = `
                    <div class="mb-3">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Performance Quality: <strong>${modelResponse.quality}</strong></span>
                            <span>${modelResponse.score}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-3">
                            <div class="bg-${color}-500 h-3 rounded-full transition-all duration-1000" style="width: ${modelResponse.score}%"></div>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(performanceSection);
                
                // Model output simulation
                const outputSection = document.createElement('div');
                outputSection.innerHTML = `
                    <div class="text-sm font-medium text-gray-700 mb-2">🤖 Model Response:</div>
                    <div class="p-3 bg-${color}-50 border border-${color}-200 rounded text-sm">
                        ${modelResponse.output}
                    </div>
                `;
                resultsContainer.appendChild(outputSection);
                
                // Strengths and weaknesses
                const analysisSection = document.createElement('div');
                analysisSection.innerHTML = `
                    <div class="grid md:grid-cols-2 gap-3">
                        <div>
                            <div class="text-sm font-medium text-green-700 mb-2">✅ Strengths:</div>
                            <ul class="text-xs space-y-1">
                                ${modelResponse.strengths.map(strength => `<li class="flex items-start"><span class="text-green-500 mr-1">•</span>${strength}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-red-700 mb-2">❌ Limitations:</div>
                            <ul class="text-xs space-y-1">
                                ${modelResponse.weaknesses.map(weakness => `<li class="flex items-start"><span class="text-red-500 mr-1">•</span>${weakness}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(analysisSection);

                output.appendChild(resultsContainer);

                // Update educational explanation
                updateExplanation(model, scenario);
            };

            // Update the educational explanation
            function updateExplanation(model, scenario) {
                if (!explanation) return;
                
                const scenarioData = scenarios[scenario];
                const otherModel = model === 'gpt3' ? 'gpt4' : 'gpt3';
                const currentData = scenarioData[model];
                const comparisonData = scenarioData[otherModel];
                
                const explanations = {
                    gpt3: `
                        <strong>📱 GPT-3 Performance on ${scenarioData.name}:</strong>
                        <br><br>• <strong>Current Score:</strong> ${currentData.score}/100 vs GPT-4's ${comparisonData.score}/100
                        <br>• <strong>Key Limitation:</strong> ${currentData.weaknesses[0]}
                        <br>• <strong>Why GPT-4 is Better:</strong> ${comparisonData.strengths[0]}
                        <br>• <strong>Recommendation:</strong> ${currentData.score < 70 ? 'Consider upgrading to GPT-4 for this task' : 'GPT-3 is adequate but GPT-4 offers significant improvements'}
                    `,
                    gpt4: `
                        <strong>🌟 GPT-4 Performance on ${scenarioData.name}:</strong>
                        <br><br>• <strong>Current Score:</strong> ${currentData.score}/100 vs GPT-3's ${comparisonData.score}/100
                        <br>• <strong>Improvement:</strong> +${currentData.score - comparisonData.score} points over GPT-3
                        <br>• <strong>Key Advantage:</strong> ${currentData.strengths[0]}
                        <br>• <strong>Trade-off:</strong> ${currentData.weaknesses[0] || 'Higher computational cost but much better results'}
                    `
                };
                
                explanation.innerHTML = explanations[model] || '';
            }

            // Example cycling functionality
            const examples = [
                { 
                    scenario: 'creative', 
                    model: 'gpt3',
                    note: 'Compare creative writing capabilities' 
                },
                { 
                    scenario: 'image', 
                    model: 'gpt4',
                    note: 'Showcase multimodal capabilities' 
                },
                { 
                    scenario: 'analysis', 
                    model: 'gpt4',
                    note: 'Demonstrate context window improvements' 
                },
                { 
                    scenario: 'coding', 
                    model: 'gpt3',
                    note: 'Show accuracy improvements needed' 
                },
                { 
                    scenario: 'reasoning', 
                    model: 'gpt4',
                    note: 'Highlight enhanced reasoning abilities' 
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    scenarioSelect.value = example.scenario;
                    document.querySelector(`input[name="q20-model"][value="${example.model}"]`).checked = true;
                    processAndDisplay();
                    exampleIndex++;
                    
                    // Update button text for next example
                    const nextExample = examples[exampleIndex % examples.length];
                    const nextScenario = scenarios[nextExample.scenario].name;
                    exampleBtn.innerHTML = `Try: ${nextScenario} (${nextExample.model.toUpperCase()})`;
                    exampleBtn.title = nextExample.note;
                });
            }

            // Event listeners
            scenarioSelect.addEventListener('change', processAndDisplay);
            modelRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    updateModelVisuals();
                    processAndDisplay();
                });
            });
            
            // Initial setup
            updateModelVisuals();
            updateTaskTypeDisplay();
            processAndDisplay();
        }
    }
};
