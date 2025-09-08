// Question 26: How are gradients computed for embeddings in LLMs?
// Created: July 13, 2025
// Educational Focus: Backpropagation, chain rule, embedding gradient computation, semantic refinement

const question = {
    title: "26. How are gradients computed for embeddings in LLMs?",
    answer: `<div class="space-y-4">
        <!-- Recommended Reading (Top) -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-7" class="text-indigo-700 underline hover:text-indigo-900">Question 7: What are embeddings and how do they enable semantic meaning?</a></li>
                <li><a href="#question-25" class="text-indigo-700 underline hover:text-indigo-900">Question 25: Why is cross-entropy loss used in language modeling?</a></li>
                <li><a href="#question-31" class="text-indigo-700 underline hover:text-indigo-900">Question 31: How does backpropagation work, and why is the chain rule critical?</a></li>
                <li><a href="#question-23" class="text-indigo-700 underline hover:text-indigo-900">Question 23: How is the softmax function applied in attention mechanisms?</a></li>
            </ul>
        </div>

        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔗 What are Embedding Gradients?</h4>
            <p class="text-blue-800">Embedding gradients tell us how to adjust each word's vector representation to reduce the model's prediction error. Think of it like tuning a musical instrument - if a note sounds off, the gradient shows exactly how much to tighten or loosen each string (dimension). The chain rule connects the final loss back to each embedding: ∂L/∂E = (∂L/∂logits) × (∂logits/∂E), allowing the model to refine word meanings through training.</p>
        </div>
        
        <!-- Chain Rule Breakdown -->
        <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 class="font-semibold text-green-900 mb-2">⛓️ The Chain Rule in Action</h4>
            <p class="text-green-800">During backpropagation, gradients flow backward through the network layers:</p>
            <ul class="text-green-700 mt-2 space-y-1">
                <li>• <strong>Loss → Output Layer:</strong> How much does changing the final prediction affect loss?</li>
                <li>• <strong>Output → Hidden Layers:</strong> How do hidden representations impact the output?</li>
                <li>• <strong>Hidden → Embeddings:</strong> How do embedding changes propagate through the network?</li>
                <li>• <strong>Chain Rule:</strong> Multiply all these partial derivatives together</li>
            </ul>
        </div>
        
        <!-- Mathematical Formula -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <h4 class="font-semibold text-gray-900 mb-2">📐 The Gradient Formula</h4>
            <div id="q26-formula" class="math-display">
                $$ \\frac{\\partial L}{\\partial E} \\;=\\; \\frac{\\partial L}{\\partial \\text{logits}} \\cdot \\frac{\\partial \\text{logits}}{\\partial E} $$
            </div>
            <div class="text-sm text-gray-600 space-y-1">
                <p><strong>∂L/∂E</strong> = Gradient of loss with respect to embeddings</p>
                <p><strong>∂L/∂logits</strong> = How loss changes with output predictions</p>
                <p><strong>∂logits/∂E</strong> = How predictions change with embedding values</p>
                <p><strong>Chain Rule</strong> = Connects final loss to initial embeddings</p>
                <p class="mt-2">Note (softmax + cross-entropy): $$ \\frac{\\partial L}{\\partial \\text{logits}} \\;=\\; \\hat{p} - y $$</p>
            </div>
        </div>
        
        <!-- Gradient Flow Comparison -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Forward Pass</h5>
                <p class="text-sm text-green-700">Embeddings → Hidden → Logits → Loss</p>
                <code class="text-xs bg-green-100 px-1 rounded">E → h → ŷ → L</code>
                <div class="text-xs text-green-600 mt-1">✓ Data flows forward</div>
                <div class="text-xs text-green-600">✓ Computes predictions</div>
                <div class="text-xs text-green-600">✓ Calculates loss</div>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Backward Pass</h5>
                <p class="text-sm text-purple-700">Loss → Logits → Hidden → Embeddings</p>
                <code class="text-xs bg-purple-100 px-1 rounded">∂L/∂L → ∂L/∂ŷ → ∂L/∂h → ∂L/∂E</code>
                <div class="text-xs text-purple-600 mt-1">✓ Gradients flow backward</div>
                <div class="text-xs text-purple-600">✓ Uses chain rule</div>
                <div class="text-xs text-purple-600">✓ Updates parameters</div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Parameter Update</h5>
                <p class="text-sm text-orange-700">Apply gradients to refine embeddings</p>
                <code class="text-xs bg-orange-100 px-1 rounded">E_new = E - α × ∂L/∂E</code>
                <div class="text-xs text-orange-600 mt-1">✓ Learning rate scaling</div>
                <div class="text-xs text-orange-600">✓ Gradient descent</div>
                <div class="text-xs text-orange-600">✓ Semantic refinement</div>
            </div>
        </div>
        
        <!-- Embedding Update Process -->
        <div class="bg-indigo-50 p-4 rounded-lg">
            <h4 class="font-semibold text-indigo-900 mb-2">🎯 How Embeddings Learn Meaning</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">Gradient Calculation:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• <strong>Error Signal:</strong> Compare prediction to true answer</li>
                        <li>• <strong>Backpropagate:</strong> Send error backward through layers</li>
                        <li>• <strong>Chain Rule:</strong> Compute embedding contribution to error</li>
                        <li>• <strong>Accumulate:</strong> Sum gradients across all examples</li>
                    </ul>
                </div>
                <div>
                    <h6 class="font-medium text-indigo-800 mb-2">Semantic Updates:</h6>
                    <ul class="text-indigo-700 space-y-1">
                        <li>• <strong>Context Learning:</strong> Words in similar contexts get similar vectors</li>
                        <li>• <strong>Task Alignment:</strong> Embeddings adapt to specific objectives</li>
                        <li>• <strong>Meaning Refinement:</strong> Subtle semantic distinctions emerge</li>
                        <li>• <strong>Relationship Encoding:</strong> Analogies and patterns develop</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Practical Examples -->
        <div class="bg-teal-50 p-4 rounded-lg">
            <h4 class="font-semibold text-teal-900 mb-2">🔍 Gradients in Action</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Example: Predicting "king"</h6>
                    <div class="bg-white p-2 rounded font-mono text-xs">
                        <div>Context: "The __ ruled the kingdom"</div>
                        <div>True word: "king"</div>
                        <div>Model predicts: "queen" (wrong!)</div>
                        <div class="text-red-600 mt-1">High loss → Large gradients</div>
                        <div class="text-blue-600 mt-1">Update: Make "king" more likely in royal contexts</div>
                    </div>
                </div>
                <div>
                    <h6 class="font-medium text-teal-800 mb-2">Gradient Flow Process:</h6>
                    <div class="bg-white p-2 rounded font-mono text-xs">
                        <div>1. Loss = CrossEntropy(pred, true)</div>
                        <div>2. ∂L/∂logits = pred - true_one_hot</div>
                        <div>3. ∂L/∂hidden = ∂L/∂logits × W_out</div>
                        <div>4. ∂L/∂embedding = ∂L/∂hidden × W_hidden</div>
                        <div class="text-green-600 mt-1">→ Update embedding for "king"</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Gradient Challenges -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">⚠️ Gradient Computation Challenges</h4>
            <div class="text-sm text-red-800 space-y-2">
                <p><strong>Sparse Updates:</strong> Only embeddings of words present in the batch receive gradients. Rare words update slowly, potentially remaining poorly trained.</p>
                <p><strong>Gradient Magnitude:</strong> Words appearing in many contexts may receive very large or very small gradients, requiring careful learning rate scheduling.</p>
                <p><strong>Memory Requirements:</strong> With vocabularies of 50K+ words and 768+ dimensions, embedding gradients can consume significant memory during training.</p>
            </div>
        </div>
        
        <!-- Training Dynamics -->
        <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-purple-900 mb-2">📈 Training Dynamics</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h6 class="font-medium text-purple-800 mb-2">Early Training:</h6>
                    <ul class="text-purple-700 space-y-1">
                        <li>• Large gradients reshape embeddings dramatically</li>
                        <li>• Basic word associations form (cat → animal)</li>
                        <li>• Frequent words stabilize first</li>
                        <li>• Syntactic patterns emerge before semantics</li>
                    </ul>
                </div>
                <div>
                    <h6 class="font-medium text-purple-800 mb-2">Late Training:</h6>
                    <ul class="text-purple-700 space-y-1">
                        <li>• Smaller gradients fine-tune relationships</li>
                        <li>• Subtle semantic distinctions develop</li>
                        <li>• Rare words slowly improve</li>
                        <li>• Complex analogies and reasoning patterns</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Optimization Techniques -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">⚡ Optimization Techniques</h4>
            <ul class="text-sm text-yellow-800 space-y-2">
                <li>• <strong>Gradient Clipping:</strong> Prevent exploding gradients from destabilizing training</li>
                <li>• <strong>Learning Rate Scheduling:</strong> Start high for exploration, decrease for fine-tuning</li>
                <li>• <strong>Weight Decay:</strong> Regularize embeddings to prevent overfitting to training data</li>
                <li>• <strong>Gradient Accumulation:</strong> Handle large batches when memory is limited</li>
                <li>• <strong>Mixed Precision:</strong> Use FP16 for gradients while maintaining FP32 for critical updates</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Embedding Gradient Calculator",
        html: `<div class="space-y-6">
            <!-- Scenario Selection -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label for="q26-scenario" class="block text-sm font-medium text-gray-700 mb-2">📝 Choose Training Scenario</label>
                <select id="q26-scenario" aria-describedby="q26-scenario-help" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="correct-prediction">Correct Prediction - Low gradients</option>
                    <option value="wrong-prediction" selected>Wrong Prediction - High gradients</option>
                    <option value="uncertain-prediction">Uncertain Prediction - Medium gradients</option>
                    <option value="rare-word">Rare Word Training - Sparse updates</option>
                    <option value="frequent-word">Frequent Word Training - Regular updates</option>
                </select>
                <p id="q26-scenario-help" class="text-xs text-gray-600 mt-1">Different scenarios show how gradients vary based on prediction accuracy and word frequency</p>
            </div>
            
            <!-- Gradient Computation Mode -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Choose Gradient Analysis Mode</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q26-mode" value="step-by-step" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Step-by-Step</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Detailed</span>
                            </div>
                            <p class="text-xs text-gray-600">Show mathematical chain rule computation</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                ∂L/∂E = (∂L/∂logits) × (∂logits/∂E)
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q26-mode" value="visualization" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Visualization</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visual</span>
                            </div>
                            <p class="text-xs text-gray-600">Show gradient flow through network layers</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Embedding → Hidden → Output → Loss
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q26-mode" value="semantic-impact" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Semantic Impact</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Meaning</span>
                            </div>
                            <p class="text-xs text-gray-600">Show how gradients change word meaning</p>
                            <div class="text-xs mt-2 font-mono bg-gray-100 px-2 py-1 rounded">
                                Before → Update → After
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Word and Context Selection -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q26-target-word" class="block text-sm font-medium text-gray-700 mb-2">🎯 Target Word</label>
                    <select id="q26-target-word" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="king">king (frequent, royal)</option>
                        <option value="queen">queen (frequent, royal)</option>
                        <option value="cat">cat (frequent, animal)</option>
                        <option value="elephant">elephant (medium, animal)</option>
                        <option value="xylophone">xylophone (rare, instrument)</option>
                        <option value="programming">programming (frequent, tech)</option>
                        <option value="algorithm">algorithm (medium, tech)</option>
                        <option value="beautiful">beautiful (frequent, adjective)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Word being updated during training</p>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q26-context" class="block text-sm font-medium text-gray-700 mb-2">📖 Context</label>
                    <select id="q26-context" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="The [WORD] ruled the kingdom">The [WORD] ruled the kingdom</option>
                        <option value="The [WORD] is a beautiful animal">The [WORD] is a beautiful animal</option>
                        <option value="I love [WORD] music">I love [WORD] music</option>
                        <option value="The [WORD] is very complex">The [WORD] is very complex</option>
                        <option value="She is [WORD] and kind">She is [WORD] and kind</option>
                        <option value="Learning [WORD] takes practice">Learning [WORD] takes practice</option>
                        <option value="The [WORD] makes lovely sounds">The [WORD] makes lovely sounds</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Context where the word appears</p>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                <button id="q26-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Wrong prediction example</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Gradient Computation Results</h4>
                    <div id="q26-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Step-by-Step</div>
                </div>
                <div id="q26-output" class="min-h-[200px]" aria-live="polite" aria-atomic="true" role="status"></div>
                <div id="q26-legend" class="mt-3 text-xs text-gray-600" aria-live="polite"></div>
            </div>
            
            <!-- Educational Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Gradient Analysis</h4>
                <div id="q26-explanation" class="text-sm text-yellow-800" aria-live="polite"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const scenarioSelect = document.getElementById('q26-scenario');
            const targetWordSelect = document.getElementById('q26-target-word');
            const contextSelect = document.getElementById('q26-context');
            const modeRadios = document.querySelectorAll('input[name="q26-mode"]');
            const output = document.getElementById('q26-output');
            const exampleBtn = document.getElementById('q26-example-btn');
            const modeIndicator = document.getElementById('q26-mode-indicator');
            const legend = document.getElementById('q26-legend');
            const explanation = document.getElementById('q26-explanation');

            // Check if required elements exist
            if (!scenarioSelect || !output || !targetWordSelect || !contextSelect) {
                console.error('Required DOM elements not found for Question 26');
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize Question 26 interactive components.</div>';
                }
                return;
            }

            // Configuration for different scenarios
            const scenarioConfig = {
                'correct-prediction': {
                    name: 'Correct Prediction',
                    description: 'Model correctly predicts the target word, resulting in small gradients',
                    gradientMagnitude: 'small',
                    loss: 0.1,
                    confidence: 0.85
                },
                'wrong-prediction': {
                    name: 'Wrong Prediction', 
                    description: 'Model incorrectly predicts the target word, resulting in large gradients',
                    gradientMagnitude: 'large',
                    loss: 2.3,
                    confidence: 0.15
                },
                'uncertain-prediction': {
                    name: 'Uncertain Prediction',
                    description: 'Model is unsure about prediction, resulting in medium gradients',
                    gradientMagnitude: 'medium',
                    loss: 1.1,
                    confidence: 0.45
                },
                'rare-word': {
                    name: 'Rare Word Training',
                    description: 'Infrequent word receives sparse but potentially large gradient updates',
                    gradientMagnitude: 'sparse',
                    loss: 1.8,
                    confidence: 0.25
                },
                'frequent-word': {
                    name: 'Frequent Word Training',
                    description: 'Common word receives regular, stabilized gradient updates',
                    gradientMagnitude: 'regular',
                    loss: 0.6,
                    confidence: 0.65
                }
            };

            // Example scenarios
            const examples = [
                {
                    scenario: 'wrong-prediction',
                    targetWord: 'king',
                    context: 'The [WORD] ruled the kingdom',
                    mode: 'step-by-step',
                    note: 'Wrong prediction example - large gradients'
                },
                {
                    scenario: 'rare-word',
                    targetWord: 'xylophone',
                    context: 'The [WORD] makes lovely sounds',
                    mode: 'visualization',
                    note: 'Rare word training - sparse updates'
                },
                {
                    scenario: 'correct-prediction',
                    targetWord: 'beautiful',
                    context: 'She is [WORD] and kind',
                    mode: 'semantic-impact',
                    note: 'Correct prediction - minimal updates'
                },
                {
                    scenario: 'uncertain-prediction',
                    targetWord: 'algorithm',
                    context: 'The [WORD] is very complex',
                    mode: 'step-by-step',
                    note: 'Uncertain prediction - medium gradients'
                }
            ];
            
            let exampleIndex = 0;

            // Generate gradient values based on scenario
            function generateGradientData(scenario, targetWord, context) {
                // Resolve scenario config with safe fallback
                const config = scenarioConfig[scenario] || scenarioConfig['uncertain-prediction'];
                if (!scenarioConfig[scenario]) {
                    console.error('Scenario config not found for:', scenario, 'Available:', Object.keys(scenarioConfig));
                }
                
                const embeddingDim = 768; // Typical embedding dimension
                
                // Generate mock gradient values based on scenario
                const gradients = [];
                for (let i = 0; i < 8; i++) { // Show first 8 dimensions
                    let magnitude;
                    switch (config.gradientMagnitude) {
                        case 'large':
                            magnitude = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
                            break;
                        case 'medium':
                            magnitude = (Math.random() - 0.5) * 0.4; // -0.2 to 0.2
                            break;
                        case 'small':
                            magnitude = (Math.random() - 0.5) * 0.1; // -0.05 to 0.05
                            break;
                        case 'sparse':
                            magnitude = Math.random() < 0.3 ? (Math.random() - 0.5) * 0.6 : 0; // Sparse large gradients
                            break;
                        case 'regular':
                            magnitude = (Math.random() - 0.5) * 0.3; // -0.15 to 0.15
                            break;
                        default:
                            magnitude = (Math.random() - 0.5) * 0.2;
                    }
                    gradients.push(magnitude);
                }
                
                return {
                    gradients,
                    loss: config.loss,
                    confidence: config.confidence,
                    embeddingDim,
                    config
                };
            }

            // Get current mode
            function getCurrentMode() {
                const selected = document.querySelector('input[name="q26-mode"]:checked');
                return selected ? selected.value : 'step-by-step';
            }

            // Update visual indicators
            function updateModeVisuals() {
                const mode = getCurrentMode();
                const modeNames = {
                    'step-by-step': 'Step-by-Step',
                    'visualization': 'Visualization', 
                    'semantic-impact': 'Semantic Impact'
                };
                
                // Update mode indicator
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                // Update radio button containers
                document.querySelectorAll('input[name="q26-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Render step-by-step computation
            function renderStepByStep(targetWord, context, gradientData) {
                const contextWithWord = context.replace('[WORD]', targetWord);
                
                let html = '<div class="space-y-4">';
                
                // Scenario setup
                html += `
                    <div class="bg-gray-50 p-3 rounded border">
                        <h5 class="font-medium text-gray-700 mb-2">Training Scenario Setup</h5>
                        <div class="text-sm space-y-1">
                            <div><strong>Context:</strong> "${contextWithWord}"</div>
                            <div><strong>Target Word:</strong> "${targetWord}"</div>
                            <div><strong>Scenario:</strong> ${gradientData.config.name}</div>
                            <div><strong>Prediction Loss:</strong> ${gradientData.loss.toFixed(3)}</div>
                        </div>
                    </div>
                `;

                // Chain rule breakdown
                html += `
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <h5 class="font-medium text-blue-700 mb-3">Chain Rule Computation</h5>
                        <div class="space-y-3 text-sm">
                            <div class="font-mono bg-white p-2 rounded">
                                <div class="text-blue-600">Step 1: ∂L/∂logits</div>
                                <div>Loss gradient w.r.t. output predictions</div>
                                <div class="text-xs text-gray-600 mt-1">= predicted_probs - true_one_hot</div>
                                <div class="text-green-600 font-bold">≈ ${(1 - gradientData.confidence).toFixed(3)}</div>
                            </div>
                            
                            <div class="font-mono bg-white p-2 rounded">
                                <div class="text-blue-600">Step 2: ∂logits/∂hidden</div>
                                <div>Output gradient w.r.t. hidden states</div>
                                <div class="text-xs text-gray-600 mt-1">= output_layer_weights</div>
                                <div class="text-green-600 font-bold">≈ W_out (768 × vocab_size)</div>
                            </div>
                            
                            <div class="font-mono bg-white p-2 rounded">
                                <div class="text-blue-600">Step 3: ∂hidden/∂embedding</div>
                                <div>Hidden gradient w.r.t. embeddings</div>
                                <div class="text-xs text-gray-600 mt-1">= hidden_layer_weights</div>
                                <div class="text-green-600 font-bold">≈ W_hidden (depends on architecture)</div>
                            </div>
                            
                            <div class="font-mono bg-white p-2 rounded border-2 border-green-500">
                                <div class="text-blue-600">Final: ∂L/∂E</div>
                                <div>Chain rule multiplication</div>
                                <div class="text-xs text-gray-600 mt-1">= (∂L/∂logits) × (∂logits/∂hidden) × (∂hidden/∂E)</div>
                                <div class="text-green-600 font-bold">Magnitude: {${gradientData.config.gradientMagnitude.toUpperCase()}}</div>
                            </div>
                        </div>
                    </div>
                `;

                // Gradient values table
                html += `
                    <div class="bg-white border rounded">
                        <h5 class="font-medium text-gray-700 p-3 border-b">Computed Embedding Gradients (First 8 Dimensions)</h5>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-3 py-2 text-left">Dimension</th>
                                        <th class="px-3 py-2 text-left">Gradient Value</th>
                                        <th class="px-3 py-2 text-left">Magnitude</th>
                                        <th class="px-3 py-2 text-left">Update Direction</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;

                gradientData.gradients.forEach((grad, index) => {
                    const magnitude = Math.abs(grad);
                    const direction = grad > 0 ? 'Increase ↑' : grad < 0 ? 'Decrease ↓' : 'No change →';
                    const magnitudeLabel = magnitude > 0.3 ? 'Large' : magnitude > 0.1 ? 'Medium' : magnitude > 0.01 ? 'Small' : 'Minimal';
                    const colorClass = magnitude > 0.3 ? 'text-red-600' : magnitude > 0.1 ? 'text-orange-600' : 'text-gray-600';

                    html += `
                        <tr class="${index % 2 === 0 ? 'bg-gray-50' : ''}">
                            <td class="px-3 py-2">Dim ${index + 1}</td>
                            <td class="px-3 py-2 font-mono ${colorClass}">${grad.toFixed(4)}</td>
                            <td class="px-3 py-2">${magnitudeLabel}</td>
                            <td class="px-3 py-2">${direction}</td>
                        </tr>
                    `;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                html += '</div>';
                return html;
            }

            // Render gradient flow visualization
            function renderVisualization(targetWord, context, gradientData) {
                const contextWithWord = context.replace('[WORD]', targetWord);
                
                let html = '<div class="space-y-4">';
                
                // Network flow diagram
                html += `
                    <div class="bg-gray-50 p-4 rounded border">
                        <h5 class="font-medium text-gray-700 mb-3">Gradient Flow Visualization</h5>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                            <!-- Loss -->
                            <div class="bg-red-100 p-3 rounded border-2 border-red-300">
                                <div class="font-bold text-red-700">Loss</div>
                                <div class="text-2xl font-mono text-red-600">${gradientData.loss.toFixed(2)}</div>
                                <div class="text-xs text-red-600 mt-1">Cross-Entropy</div>
                                <div class="text-xs mt-2">→ ∂L/∂L = 1.0</div>
                            </div>
                            
                            <!-- Output Layer -->
                            <div class="bg-orange-100 p-3 rounded border-2 border-orange-300">
                                <div class="font-bold text-orange-700">Output Layer</div>
                                <div class="text-lg font-mono text-orange-600">Logits</div>
                                <div class="text-xs text-orange-600 mt-1">Vocab Size</div>
                                <div class="text-xs mt-2">→ ∂L/∂logits</div>
                            </div>
                            
                            <!-- Hidden Layer -->
                            <div class="bg-blue-100 p-3 rounded border-2 border-blue-300">
                                <div class="font-bold text-blue-700">Hidden Layer</div>
                                <div class="text-lg font-mono text-blue-600">h</div>
                                <div class="text-xs text-blue-600 mt-1">768 dims</div>
                                <div class="text-xs mt-2">→ ∂L/∂h</div>
                            </div>
                            
                            <!-- Embeddings -->
                            <div class="bg-green-100 p-3 rounded border-2 border-green-300">
                                <div class="font-bold text-green-700">Embeddings</div>
                                <div class="text-lg font-mono text-green-600">E</div>
                                <div class="text-xs text-green-600 mt-1">"${targetWord}"</div>
                                <div class="text-xs mt-2">→ ∂L/∂E</div>
                            </div>
                        </div>
                        
                        <!-- Flow arrows -->
                        <div class="flex justify-center mt-4">
                            <div class="text-xs text-gray-600 bg-white px-3 py-1 rounded border">
                                Gradients flow backward: Loss ← Output ← Hidden ← Embeddings
                            </div>
                        </div>
                    </div>
                `;

                // Gradient magnitude visualization
                const maxGrad = Math.max(...gradientData.gradients.map(Math.abs));
                html += `
                    <div class="bg-white border rounded p-4">
                        <h5 class="font-medium text-gray-700 mb-3">Gradient Magnitude Visualization</h5>
                        <div class="space-y-2">
                `;

                gradientData.gradients.forEach((grad, index) => {
                    const magnitude = Math.abs(grad);
                    const percentage = maxGrad > 0 ? (magnitude / maxGrad) * 100 : 0;
                    const color = grad > 0 ? 'bg-blue-500' : grad < 0 ? 'bg-red-500' : 'bg-gray-300';
                    
                    html += `
                        <div class="flex items-center gap-2">
                            <div class="w-16 text-xs font-mono">Dim ${index + 1}:</div>
                            <div class="flex-1 bg-gray-200 rounded h-4 relative">
                                <div class="${color} h-full rounded transition-all" style="width: ${percentage}%"></div>
                                <div class="absolute inset-0 flex items-center justify-center text-xs font-mono text-white">
                                    ${grad.toFixed(3)}
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                        <div class="mt-3 text-xs text-gray-600">
                            <span class="inline-block w-3 h-3 bg-blue-500 mr-1"></span>Positive gradients (increase values)
                            <span class="inline-block w-3 h-3 bg-red-500 mr-1 ml-4"></span>Negative gradients (decrease values)
                        </div>
                    </div>
                `;

                html += '</div>';
                return html;
            }

            // Render semantic impact analysis
            function renderSemanticImpact(targetWord, context, gradientData) {
                const contextWithWord = context.replace('[WORD]', targetWord);
                
                let html = '<div class="space-y-4">';
                
                // Before/after semantic comparison
                html += `
                    <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                        <h5 class="font-medium text-purple-700 mb-3">Semantic Impact Analysis</h5>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="bg-white p-3 rounded border">
                                <h6 class="font-semibold text-gray-700 mb-2">Before Update</h6>
                                <div class="text-sm space-y-1">
                                    <div><strong>Context:</strong> "${contextWithWord}"</div>
                                    <div><strong>Confidence:</strong> ${(gradientData.confidence * 100).toFixed(1)}%</div>
                                    <div><strong>Status:</strong> ${gradientData.config.name}</div>
                                </div>
                            </div>
                            
                            <div class="bg-yellow-100 p-3 rounded border flex items-center justify-center">
                                <div class="text-center">
                                    <div class="text-2xl">→</div>
                                    <div class="text-xs font-mono mt-1">Gradient Update</div>
                                    <div class="text-xs text-gray-600">α = 0.001</div>
                                </div>
                            </div>
                            
                <div class="bg-white p-3 rounded border">
                                <h6 class="font-semibold text-gray-700 mb-2">After Update</h6>
                                <div class="text-sm space-y-1">
                                    <div><strong>Expected Change:</strong> ${gradientData.config.gradientMagnitude} adjustment</div>
                    <div><strong>New Confidence:</strong> ${(Math.min(0.95, gradientData.confidence + (1 - gradientData.confidence) * 0.1) * 100).toFixed(1)}%</div>
                                    <div><strong>Semantic Shift:</strong> Improved context alignment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Learning dynamics explanation
                html += `
                    <div class="bg-indigo-50 p-4 rounded">
                        <h5 class="font-medium text-indigo-700 mb-3">Learning Dynamics</h5>
                        <div class="space-y-3 text-sm">
                `;

                const scenarios = {
                    'large': {
                        title: 'Large Gradients - Major Adjustment',
                        description: 'The embedding will shift significantly to better match the context. This happens when the model makes confident wrong predictions.',
                        impact: 'High semantic change, fast learning'
                    },
                    'medium': {
                        title: 'Medium Gradients - Moderate Adjustment', 
                        description: 'The embedding will adjust moderately to improve context alignment. This occurs with uncertain predictions.',
                        impact: 'Moderate semantic change, balanced learning'
                    },
                    'small': {
                        title: 'Small Gradients - Fine Tuning',
                        description: 'The embedding will make minor adjustments for refinement. This happens when predictions are mostly correct.',
                        impact: 'Minimal semantic change, stability'
                    },
                    'sparse': {
                        title: 'Sparse Gradients - Irregular Updates',
                        description: 'The embedding updates only occasionally but potentially with large changes. Common for rare words.',
                        impact: 'Irregular but potentially significant changes'
                    },
                    'regular': {
                        title: 'Regular Gradients - Steady Learning',
                        description: 'The embedding receives consistent, moderate updates. Typical for frequent words with established patterns.',
                        impact: 'Steady, predictable semantic evolution'
                    }
                };

                const scenario = scenarios[gradientData.config.gradientMagnitude];
                html += `
                            <div class="bg-white p-3 rounded border-l-4 border-indigo-400">
                                <h6 class="font-semibold text-indigo-700">${scenario.title}</h6>
                                <p class="text-indigo-600 mt-1">${scenario.description}</p>
                                <div class="text-xs text-indigo-500 mt-2"><strong>Impact:</strong> ${scenario.impact}</div>
                            </div>
                        </div>
                    </div>
                `;

                html += '</div>';
                return html;
            }

            // Main processing function
            const processAndDisplay = () => {
                const scenario = scenarioSelect.value;
                const targetWord = targetWordSelect.value;
                const context = contextSelect.value;
                const mode = getCurrentMode();
                
                updateModeVisuals();

                // Generate gradient data
                const gradientData = generateGradientData(scenario, targetWord, context);

                // Render based on mode
                let html;
                switch (mode) {
                    case 'step-by-step':
                        html = renderStepByStep(targetWord, context, gradientData);
                        break;
                    case 'visualization':
                        html = renderVisualization(targetWord, context, gradientData);
                        break;
                    case 'semantic-impact':
                        html = renderSemanticImpact(targetWord, context, gradientData);
                        break;
                    default:
                        html = renderStepByStep(targetWord, context, gradientData);
                }

                output.innerHTML = html;

                // Update legend
                if (legend) {
                    const avgGradient = gradientData.gradients.reduce((sum, g) => sum + Math.abs(g), 0) / gradientData.gradients.length;
                    legend.innerHTML = `
                        Target: "${targetWord}" | 
                        Context: "${context.replace('[WORD]', targetWord)}" | 
                        Scenario: ${gradientData.config.name} | 
                        Avg Gradient: ${avgGradient.toFixed(4)} | 
                        Loss: ${gradientData.loss.toFixed(3)}
                    `;
                }

                // Update explanation
                updateExplanation(scenario, gradientData, mode);

                // Future-proof MathJax rendering in case dynamic content includes TeX later
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([output, legend, explanation]).catch(() => {});
                }
            };

            // Update educational explanation
            function updateExplanation(scenario, gradientData, mode) {
                if (!explanation) return;

                const config = gradientData.config;
                let modeDescription, keyInsight, practicalImplication;

                switch (mode) {
                    case 'step-by-step':
                        modeDescription = "The chain rule computation shows how errors at the output layer propagate back to update embedding parameters.";
                        keyInsight = "Each gradient component tells us exactly how much to adjust each embedding dimension.";
                        break;
                    case 'visualization':
                        modeDescription = "The gradient flow visualization shows how error signals travel backward through network layers.";
                        keyInsight = "Larger gradients indicate dimensions that need more significant adjustments for better predictions.";
                        break;
                    case 'semantic-impact':
                        modeDescription = "The semantic impact analysis shows how gradient updates change word meaning representations.";
                        keyInsight = "Gradients guide embeddings toward better semantic representations for the given context.";
                        break;
                }

                if (config.gradientMagnitude === 'large') {
                    practicalImplication = "Large gradients indicate the model needs major corrections. This often happens early in training or with difficult examples.";
                } else if (config.gradientMagnitude === 'small') {
                    practicalImplication = "Small gradients suggest the model is performing well and only needs minor refinements. This is common later in training.";
                } else if (config.gradientMagnitude === 'sparse') {
                    practicalImplication = "Sparse gradients mean this word rarely appears in training, so updates are infrequent but potentially impactful when they occur.";
                } else {
                    practicalImplication = "Medium gradients indicate moderate learning progress, with the model making reasonable but improvable predictions.";
                }

                explanation.innerHTML = `
                    <div class="space-y-3">
                        <p><strong>Analysis Mode:</strong> ${modeDescription}</p>
                        
                        <p><strong>Scenario Insight:</strong> ${config.description}. The ${config.gradientMagnitude} gradients will cause ${config.gradientMagnitude === 'large' ? 'significant' : config.gradientMagnitude === 'small' ? 'minimal' : 'moderate'} changes to the "${targetWordSelect.value}" embedding.</p>
                        
                        <p><strong>Key Learning:</strong> ${keyInsight} ${practicalImplication}</p>
                        
                        <div class="mt-3 p-3 bg-yellow-100 rounded text-xs">
                            <strong>💡 Training Insight:</strong> Embedding gradients are the primary mechanism by which language models learn word meanings. Through repeated exposure to contexts, words gradually develop rich semantic representations that capture syntactic, semantic, and pragmatic properties.
                        </div>
                    </div>
                `;
            }

            // Example cycling functionality
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    scenarioSelect.value = example.scenario;
                    targetWordSelect.value = example.targetWord;
                    contextSelect.value = example.context;
                    
                    // Set the mode radio button
                    const modeRadio = document.querySelector(`input[name="q26-mode"][value="${example.mode}"]`);
                    if (modeRadio) {
                        modeRadio.checked = true;
                    }
                    
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.note;
                    exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.targetWord} in context`;
                    
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            scenarioSelect.addEventListener('change', processAndDisplay);
            targetWordSelect.addEventListener('change', processAndDisplay);
            contextSelect.addEventListener('change', processAndDisplay);
            modeRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            updateModeVisuals();
            processAndDisplay();
        }
    }
};
