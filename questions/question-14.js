// Question 14: Catastrophic Forgetting Prevention in LLM Fine-tuning
// Created: July 11, 2025
// Educational Focus: Catastrophic forgetting, rehearsal methods, elastic weight consolidation, modular architectures

const question = {
    title: "14. How can LLMs avoid catastrophic forgetting during fine-tuning?",
    answer: `
        <div class="space-y-4">
            <!-- Main Concept -->
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 class="font-semibold text-blue-900 mb-2">🧠 What is Catastrophic Forgetting?</h4>
                <p class="text-blue-800">
                    Catastrophic forgetting occurs when a neural network loses previously learned knowledge while learning new tasks. 
                    Imagine studying for a new subject so intensively that you forget everything you learned in previous courses - 
                    that's essentially what happens to LLMs during aggressive fine-tuning without proper safeguards.
                </p>
            </div>

            <!-- Prevention Strategies -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <h5 class="font-medium text-green-900">🔄 Rehearsal Methods</h5>
                    <p class="text-sm text-green-700 mb-2">
                        Mix old and new training data to remind the model of previous knowledge while learning new tasks.
                    </p>
                    <code class="text-xs bg-green-100 px-1 rounded block">
                        Training = 70% new data + 30% old data
                    </code>
                </div>
                
                <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <h5 class="font-medium text-purple-900">⚖️ Elastic Weight Consolidation</h5>
                    <p class="text-sm text-purple-700 mb-2">
                        Protect important weights from large changes by adding regularization based on weight importance.
                    </p>
                    <code class="text-xs bg-purple-100 px-1 rounded block">
                        Loss = Task_Loss + λ∑(F_i × (θ_i - θ*_i)²)
                    </code>
                </div>
                
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <h5 class="font-medium text-orange-900">🔧 Modular Architectures</h5>
                    <p class="text-sm text-orange-700 mb-2">
                        Add task-specific modules (adapters, LoRA) instead of modifying the entire model.
                    </p>
                    <code class="text-xs bg-orange-100 px-1 rounded block">
                        Base Model + Task-Specific Adapter
                    </code>
                </div>
            </div>

            <!-- Advanced Techniques -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                    <h5 class="font-medium text-indigo-900">📚 Progressive Neural Networks</h5>
                    <p class="text-sm text-indigo-700">
                        Create new columns for each task while preserving old ones, allowing lateral connections between tasks.
                    </p>
                    <code class="text-xs bg-indigo-100 px-1 rounded block mt-1">
                        Task1 → Task2 → Task3 (with connections)
                    </code>
                </div>
                
                <div class="bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                    <h5 class="font-medium text-teal-900">🎯 Task-Specific Heads</h5>
                    <p class="text-sm text-teal-700">
                        Keep shared representations while using different output layers for different tasks.
                    </p>
                    <code class="text-xs bg-teal-100 px-1 rounded block mt-1">
                        Shared Encoder → Task-Specific Decoder
                    </code>
                </div>
            </div>

            <!-- Memory Consolidation Strategies -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">🧩 Memory Consolidation Approaches</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Regularization-Based:</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• <strong>EWC:</strong> Fisher Information Matrix weighting</li>
                            <li>• <strong>SI:</strong> Synaptic Intelligence tracking</li>
                            <li>• <strong>MAS:</strong> Memory Aware Synapses</li>
                            <li>• <strong>L2:</strong> Simple weight decay regularization</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Architecture-Based:</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• <strong>LoRA:</strong> Low-rank adaptation layers</li>
                            <li>• <strong>Adapters:</strong> Bottleneck task modules</li>
                            <li>• <strong>Prefix Tuning:</strong> Learnable prompt vectors</li>
                            <li>• <strong>BitFit:</strong> Bias-only fine-tuning</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Why It Matters -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Preventing Catastrophic Forgetting Matters</h4>
                <ul class="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Versatility:</strong> Maintain ability to handle diverse tasks and domains</li>
                    <li>• <strong>Cost Efficiency:</strong> Avoid retraining from scratch for each new task</li>
                    <li>• <strong>Knowledge Transfer:</strong> Leverage shared representations across related tasks</li>
                    <li>• <strong>Deployment Flexibility:</strong> Single model can serve multiple applications</li>
                    <li>• <strong>Continuous Learning:</strong> Enable lifelong learning capabilities</li>
                </ul>
            </div>

            <!-- Trade-offs and Considerations -->
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-red-900 mb-2">⚠️ Trade-offs and Considerations</h4>
                <div class="text-sm text-red-800 space-y-2">
                    <p><strong>Memory vs. Performance:</strong> Storing old data or importance weights increases memory requirements.</p>
                    <p><strong>Plasticity vs. Stability:</strong> Strong forgetting prevention may reduce learning capacity for new tasks.</p>
                    <p><strong>Computational Cost:</strong> Some methods require additional forward/backward passes or complex calculations.</p>
                    <p><strong>Task Similarity:</strong> Methods work better when tasks share common structure or domain.</p>
                </div>
            </div>
        </div>
    `,
    interactive: {
        title: "🧪 Catastrophic Forgetting Prevention Simulator",
        html: `
            <div class="space-y-6">
                <!-- Scenario Selection -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q14-scenario-select" class="block text-sm font-medium text-gray-700 mb-2">📋 Select Fine-tuning Scenario</label>
                    <select id="q14-scenario-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="0" selected>Medical Text Analysis (from General Language)</option>
                        <option value="1">Code Generation (from Text Understanding)</option>
                        <option value="2">Legal Document Processing (from General NLP)</option>
                        <option value="3">Creative Writing (from Technical Documentation)</option>
                        <option value="4">Customer Support (from Academic Text)</option>
                        <option value="5">Translation (from Monolingual Tasks)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Choose different scenarios to see how forgetting prevention strategies perform across various domain shifts!</p>
                </div>
                
                <!-- Prevention Strategy Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🛡️ Forgetting Prevention Strategy</label>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q14-strategy" value="naive" class="mr-3" checked>
                            <div>
                                <div class="font-medium text-sm">Naive Fine-tuning</div>
                                <div class="text-xs text-gray-500">No protection</div>
                                <div class="text-xs bg-red-100 text-red-700 px-1 rounded mt-1">High forgetting</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q14-strategy" value="rehearsal" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Rehearsal</div>
                                <div class="text-xs text-gray-500">Mix old & new data</div>
                                <div class="text-xs bg-yellow-100 text-yellow-700 px-1 rounded mt-1">Moderate protection</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q14-strategy" value="ewc" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">EWC</div>
                                <div class="text-xs text-gray-500">Weight importance</div>
                                <div class="text-xs bg-blue-100 text-blue-700 px-1 rounded mt-1">Smart protection</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q14-strategy" value="lora" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">LoRA</div>
                                <div class="text-xs text-gray-500">Modular adaptation</div>
                                <div class="text-xs bg-green-100 text-green-700 px-1 rounded mt-1">Best protection</div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Training Parameters -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-3">⚙️ Training Configuration</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label for="q14-learning-rate" class="block text-sm font-medium text-gray-700 mb-2">Learning Rate</label>
                            <input type="range" id="q14-learning-rate" min="1" max="10" step="1" value="5" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1e-5</span>
                                <span id="q14-lr-display" class="font-medium">5e-5</span>
                                <span>1e-4</span>
                            </div>
                        </div>
                        <div>
                            <label for="q14-rehearsal-ratio" class="block text-sm font-medium text-gray-700 mb-2">Old Data Ratio (%)</label>
                            <input type="range" id="q14-rehearsal-ratio" min="0" max="50" step="5" value="30" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0%</span>
                                <span id="q14-ratio-display" class="font-medium">30%</span>
                                <span>50%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Results Visualization -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">📊 Performance Impact Simulation</h4>
                        <div id="q14-strategy-indicator" class="text-xs px-2 py-1 rounded font-medium">Naive Fine-tuning</div>
                    </div>
                    
                    <!-- Performance Metrics -->
                    <div class="grid md:grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-600" id="q14-new-task">85%</div>
                            <div class="text-xs text-gray-500">New Task Performance</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q14-new-task-bar" class="h-full bg-blue-500 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-red-600" id="q14-retention">45%</div>
                            <div class="text-xs text-gray-500">Knowledge Retention</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q14-retention-bar" class="h-full bg-red-500 rounded-full" style="width: 45%"></div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-600" id="q14-efficiency">Medium</div>
                            <div class="text-xs text-gray-500">Training Efficiency</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q14-efficiency-bar" class="h-full bg-green-500 rounded-full" style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Forgetting Visualization -->
                    <div class="bg-gray-50 p-3 rounded">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Knowledge Retention Over Training Steps</h5>
                        <div class="flex items-end justify-between h-20 space-x-1">
                            <div class="bg-blue-400 rounded-t" style="height: 100%" title="Step 0: 100%"></div>
                            <div id="q14-step1" class="bg-blue-400 rounded-t" style="height: 95%" title="Step 1"></div>
                            <div id="q14-step2" class="bg-blue-400 rounded-t" style="height: 90%" title="Step 2"></div>
                            <div id="q14-step3" class="bg-blue-400 rounded-t" style="height: 85%" title="Step 3"></div>
                            <div id="q14-step4" class="bg-blue-400 rounded-t" style="height: 80%" title="Step 4"></div>
                            <div id="q14-step5" class="bg-blue-400 rounded-t" style="height: 75%" title="Step 5"></div>
                            <div id="q14-step6" class="bg-blue-400 rounded-t" style="height: 70%" title="Step 6"></div>
                            <div id="q14-step7" class="bg-blue-400 rounded-t" style="height: 65%" title="Step 7"></div>
                            <div id="q14-step8" class="bg-blue-400 rounded-t" style="height: 60%" title="Step 8"></div>
                            <div id="q14-final" class="bg-blue-400 rounded-t" style="height: 55%" title="Final"></div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Start</span>
                            <span>Training Progress</span>
                            <span>End</span>
                        </div>
                    </div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">💡 Strategy Analysis</h4>
                    <div id="q14-explanation" class="text-sm text-yellow-800"></div>
                </div>
            </div>
        `,
        script: () => {
            // Scenario definitions with different characteristics
            const scenarios = [
                {
                    name: "Medical Text Analysis",
                    description: "Fine-tuning from general language to medical domain",
                    domainShift: "high",
                    basePerformance: { naive: 45, rehearsal: 65, ewc: 72, lora: 85 },
                    newTaskPerformance: { naive: 88, rehearsal: 85, ewc: 82, lora: 87 }
                },
                {
                    name: "Code Generation",
                    description: "Adapting from text understanding to programming",
                    domainShift: "very-high",
                    basePerformance: { naive: 35, rehearsal: 55, ewc: 68, lora: 82 },
                    newTaskPerformance: { naive: 92, rehearsal: 87, ewc: 84, lora: 89 }
                },
                {
                    name: "Legal Document Processing",
                    description: "Specializing from general NLP to legal domain",
                    domainShift: "high",
                    basePerformance: { naive: 50, rehearsal: 70, ewc: 78, lora: 88 },
                    newTaskPerformance: { naive: 85, rehearsal: 82, ewc: 80, lora: 86 }
                },
                {
                    name: "Creative Writing",
                    description: "Shifting from technical to creative writing",
                    domainShift: "medium",
                    basePerformance: { naive: 60, rehearsal: 75, ewc: 80, lora: 90 },
                    newTaskPerformance: { naive: 83, rehearsal: 81, ewc: 78, lora: 84 }
                },
                {
                    name: "Customer Support",
                    description: "Adapting from academic to conversational text",
                    domainShift: "medium",
                    basePerformance: { naive: 55, rehearsal: 72, ewc: 76, lora: 87 },
                    newTaskPerformance: { naive: 86, rehearsal: 84, ewc: 81, lora: 85 }
                },
                {
                    name: "Translation",
                    description: "Adding translation to monolingual model",
                    domainShift: "very-high",
                    basePerformance: { naive: 30, rehearsal: 50, ewc: 62, lora: 78 },
                    newTaskPerformance: { naive: 90, rehearsal: 86, ewc: 83, lora: 88 }
                }
            ];

            // Strategy configurations
            const strategyConfig = {
                naive: {
                    name: "Naive Fine-tuning",
                    color: "text-red-700",
                    bgColor: "bg-red-100",
                    efficiency: 95,
                    explanation: "No protection against forgetting. The model rapidly adapts to new data but loses previous knowledge. Fast and simple but catastrophic for knowledge retention."
                },
                rehearsal: {
                    name: "Rehearsal",
                    color: "text-yellow-700",
                    bgColor: "bg-yellow-100",
                    efficiency: 45,
                    explanation: "Mixes old and new data during training. Helps retain knowledge but requires storing old data and significantly increases training time and memory usage."
                },
                ewc: {
                    name: "Elastic Weight Consolidation",
                    color: "text-blue-700",
                    bgColor: "bg-blue-100",
                    efficiency: 60,
                    explanation: "Uses Fisher Information Matrix to identify important weights and prevent large changes. Smart approach but requires computing importance scores and additional regularization computations."
                },
                lora: {
                    name: "LoRA (Modular)",
                    color: "text-green-700",
                    bgColor: "bg-green-100",
                    efficiency: 85,
                    explanation: "Adds small trainable modules while keeping base model frozen. Excellent retention with good efficiency since only a small portion of parameters are trained."
                }
            };

            // DOM elements
            const scenarioSelect = document.getElementById('q14-scenario-select');
            const strategyRadios = document.querySelectorAll('input[name="q14-strategy"]');
            const strategyIndicator = document.getElementById('q14-strategy-indicator');
            const learningRate = document.getElementById('q14-learning-rate');
            const rehearsalRatio = document.getElementById('q14-rehearsal-ratio');
            const lrDisplay = document.getElementById('q14-lr-display');
            const ratioDisplay = document.getElementById('q14-ratio-display');
            const newTaskElement = document.getElementById('q14-new-task');
            const retentionElement = document.getElementById('q14-retention');
            const efficiencyElement = document.getElementById('q14-efficiency');
            const newTaskBar = document.getElementById('q14-new-task-bar');
            const retentionBar = document.getElementById('q14-retention-bar');
            const efficiencyBar = document.getElementById('q14-efficiency-bar');
            const explanation = document.getElementById('q14-explanation');

            if (!scenarioSelect || !newTaskElement) {
                console.error('Required DOM elements not found for Question 14');
                return;
            }

            // Get current selections
            function getCurrentScenario() {
                return scenarios[parseInt(scenarioSelect.value)] || scenarios[0];
            }

            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q14-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'naive';
            }

            // Update parameter displays
            function updateParameterDisplays() {
                const lr = parseInt(learningRate.value);
                const ratio = parseInt(rehearsalRatio.value);
                
                lrDisplay.textContent = `${lr}e-5`;
                ratioDisplay.textContent = `${ratio}%`;
            }

            // Update forgetting visualization
            function updateForgettingVisualization(strategy, scenario) {
                const steps = ['q14-step1', 'q14-step2', 'q14-step3', 'q14-step4', 'q14-step5', 'q14-step6', 'q14-step7', 'q14-step8', 'q14-final'];
                
                // Calculate forgetting curve based on strategy
                let forgettingRate;
                switch (strategy) {
                    case 'naive': forgettingRate = 0.08; break;
                    case 'rehearsal': forgettingRate = 0.04; break;
                    case 'ewc': forgettingRate = 0.03; break;
                    case 'lora': forgettingRate = 0.01; break;
                }
                
                // Adjust for scenario difficulty
                const domainMultiplier = {
                    'low': 0.5,
                    'medium': 1.0,
                    'high': 1.5,
                    'very-high': 2.0
                };
                forgettingRate *= domainMultiplier[scenario.domainShift];
                
                steps.forEach((stepId, index) => {
                    const element = document.getElementById(stepId);
                    if (element) {
                        const retention = Math.max(20, 100 - (forgettingRate * 100 * (index + 1)));
                        element.style.height = `${retention}%`;
                        element.title = `Step ${index + 1}: ${retention.toFixed(0)}%`;
                        
                        // Color coding based on retention level
                        if (retention >= 80) element.className = 'bg-green-400 rounded-t';
                        else if (retention >= 60) element.className = 'bg-yellow-400 rounded-t';
                        else if (retention >= 40) element.className = 'bg-orange-400 rounded-t';
                        else element.className = 'bg-red-400 rounded-t';
                    }
                });
            }

            // Update display based on selections
            function updateDisplay() {
                const scenario = getCurrentScenario();
                const strategy = getCurrentStrategy();
                const config = strategyConfig[strategy];
                const lr = parseInt(learningRate.value);
                const ratio = parseInt(rehearsalRatio.value);

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.className = `text-xs px-2 py-1 rounded font-medium ${config.color} ${config.bgColor}`;
                }

                // Calculate performance metrics
                let baseRetention = scenario.basePerformance[strategy];
                let newTaskPerf = scenario.newTaskPerformance[strategy];
                
                // Adjust based on parameters
                if (strategy === 'rehearsal') {
                    baseRetention += Math.floor(ratio * 0.5); // Higher ratio improves retention
                    newTaskPerf -= Math.floor(ratio * 0.3); // But slightly reduces new task performance
                }
                
                // Learning rate effects
                if (lr > 7) {
                    baseRetention -= 5; // High LR increases forgetting
                    newTaskPerf += 2; // But improves new task learning
                } else if (lr < 3) {
                    baseRetention += 3; // Low LR reduces forgetting
                    newTaskPerf -= 3; // But slows new task learning
                }

                // Clamp values
                baseRetention = Math.max(15, Math.min(95, baseRetention));
                newTaskPerf = Math.max(60, Math.min(95, newTaskPerf));

                // Update performance displays
                if (newTaskElement) newTaskElement.textContent = `${newTaskPerf}%`;
                if (retentionElement) retentionElement.textContent = `${baseRetention}%`;
                
                // Calculate efficiency (affected by parameters)
                let efficiency = config.efficiency;
                if (strategy === 'rehearsal') {
                    // Higher rehearsal ratio decreases efficiency due to more data processing
                    efficiency = Math.max(25, config.efficiency - Math.floor(ratio * 0.8));
                }
                
                if (efficiencyElement) {
                    efficiencyElement.textContent = efficiency >= 75 ? 'High' : efficiency >= 50 ? 'Medium' : 'Low';
                }

                // Update progress bars
                if (newTaskBar) newTaskBar.style.width = `${newTaskPerf}%`;
                if (retentionBar) {
                    retentionBar.style.width = `${baseRetention}%`;
                    retentionBar.className = `h-full rounded-full ${
                        baseRetention >= 80 ? 'bg-green-500' :
                        baseRetention >= 60 ? 'bg-yellow-500' :
                        baseRetention >= 40 ? 'bg-orange-500' : 'bg-red-500'
                    }`;
                }
                if (efficiencyBar) efficiencyBar.style.width = `${efficiency}%`;

                // Update forgetting visualization
                updateForgettingVisualization(strategy, scenario);

                // Update explanation
                if (explanation) {
                    explanation.innerHTML = `
                        <p><strong>${config.name} for ${scenario.name}:</strong></p>
                        <p class="mt-2">${config.explanation}</p>
                        <p class="mt-2"><strong>Results:</strong> ${newTaskPerf}% new task performance, ${baseRetention}% knowledge retention. 
                        ${baseRetention >= 80 ? 'Excellent knowledge preservation!' :
                          baseRetention >= 60 ? 'Good balance of learning and retention.' :
                          baseRetention >= 40 ? 'Moderate forgetting - consider stronger protection.' :
                          'Significant catastrophic forgetting detected!'}</p>
                        <p class="mt-2"><strong>Recommendation:</strong> ${
                            strategy === 'naive' ? 'Switch to a forgetting prevention method for better retention.' :
                            strategy === 'rehearsal' ? 'Consider increasing old data ratio or trying EWC/LoRA for better results.' :
                            strategy === 'ewc' ? 'Good choice! May benefit from tuning regularization strength.' :
                            'Excellent choice! LoRA provides the best balance of performance and retention.'
                        }</p>
                    `;
                }
            }

            // Event listeners
            scenarioSelect.addEventListener('change', updateDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', updateDisplay);
            });
            learningRate.addEventListener('input', () => {
                updateParameterDisplays();
                updateDisplay();
            });
            rehearsalRatio.addEventListener('input', () => {
                updateParameterDisplays();
                updateDisplay();
            });

            // Initial setup
            updateParameterDisplays();
            updateDisplay();
        }
    }
};
