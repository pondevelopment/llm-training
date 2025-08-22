// Question 29: What is KL divergence, and how is it used in LLMs?
// Created: July 16, 2025
// Educational Focus: KL divergence, probability distributions, loss functions, model alignment, fine-tuning

const question = {
    title: "29. What is KL divergence, and how is it used in LLMs?",
    answer: `<div class="space-y-6">
        <!-- Recommended Reading (Top) -->
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-25" class="text-indigo-700 underline hover:text-indigo-900">Question 25: Why is cross-entropy loss used in language modeling?</a></li>
                <li><a href="#question-23" class="text-indigo-700 underline hover:text-indigo-900">Question 23: How is the softmax function applied in attention mechanisms?</a></li>
                <li><a href="#question-31" class="text-indigo-700 underline hover:text-indigo-900">Question 31: How does backpropagation work, and why is the chain rule critical?</a></li>
                <li><a href="#question-28" class="text-indigo-700 underline hover:text-indigo-900">Question 28: How do eigenvalues and eigenvectors relate to dimensionality reduction?</a></li>
            </ul>
        </div>
        <!-- Hero Section with Clear Definition -->
        <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-6 rounded-xl border border-blue-200 shadow-sm">
            <div class="text-center mb-4">
                <h3 class="text-xl font-bold text-gray-900 mb-2">📊 Kullback-Leibler (KL) Divergence</h3>
                <p class="text-lg text-gray-700 max-w-3xl mx-auto">
                    A mathematical measure that quantifies how one probability distribution differs from another, essential for training and aligning language models.
                </p>
            </div>
            
            <div class="max-w-3xl mx-auto">
                <div class="bg-white p-6 rounded-lg border shadow-sm">
                    <div class="text-center space-y-4">
                        <p class="text-sm font-medium text-gray-700">Core Mathematical Definition</p>
                        
                        <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <div class="space-y-3">
                                <div>$$D_{KL}(P||Q) = \\sum_{x} P(x) \\log \\frac{P(x)}{Q(x)}$$</div>
                                <div class="text-sm text-gray-600">where \\( P(x) \\) is the true distribution and \\( Q(x) \\) is the approximating distribution</div>
                            </div>
                        </div>
                        
                        <div class="text-center text-sm text-gray-600 mt-4">
                            Measures the "surprise" when using distribution Q to approximate the true distribution P
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mathematical Properties -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                📐 Mathematical Properties
            </h4>
            
            <div class="grid lg:grid-cols-2 gap-6">
                <!-- Key Properties -->
                <div class="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <h5 class="font-semibold text-blue-900 mb-4 text-center">Essential Properties</h5>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg border">
                            <div class="text-sm font-medium text-gray-700 mb-2">Non-negativity</div>
                            <div class="text-center">$$D_{KL}(P||Q) \\geq 0$$</div>
                            <div class="text-xs text-gray-600 mt-2">Always positive; equals 0 only when P = Q</div>
                        </div>
                        
                        <div class="bg-white p-4 rounded-lg border">
                            <div class="text-sm font-medium text-gray-700 mb-2">Asymmetry</div>
                            <div class="text-center">$$D_{KL}(P||Q) \\neq D_{KL}(Q||P)$$</div>
                            <div class="text-xs text-gray-600 mt-2">Not a true distance metric - order matters!</div>
                        </div>
                    </div>
                </div>

                <!-- Information Theory Connection -->
                <div class="bg-green-50 p-5 rounded-lg border border-green-200">
                    <h5 class="font-semibold text-green-900 mb-3">Information Theory Interpretation</h5>
                    <div class="space-y-3">
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Relative Entropy</div>
                                <div class="text-xs text-gray-600">Extra bits needed when using Q instead of P</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Cross-entropy Connection</div>
                                <div class="text-xs text-gray-600">\\( D_{KL}(P||Q) = H(P,Q) - H(P) \\)</div>
                            </div>
                        </div>
                        <div class="bg-white p-3 rounded-lg border flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <div class="font-medium text-sm text-gray-900">Information Gain</div>
                                <div class="text-xs text-gray-600">Measures information lost in approximation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- LLM Applications -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                🤖 Applications in Large Language Models
            </h4>
            
            <div class="grid md:grid-cols-3 gap-4">
                <!-- Knowledge Distillation -->
                <div class="text-center">
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 h-full">
                        <div class="font-medium text-purple-900 mb-3">Knowledge Distillation</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">$$\\mathcal{L} = D_{KL}(P_{teacher}||P_{student})$$</div>
                        </div>
                        <div class="text-xs text-purple-700">Train smaller models to mimic larger teacher models by minimizing distribution differences</div>
                    </div>
                </div>

                <!-- RLHF Training -->
                <div class="text-center">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 h-full">
                        <div class="font-medium text-blue-900 mb-3">RLHF Constraint</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">
                                $$
                                \\begin{align*}
                                \\mathcal{L} = & \\mathbb{E}[r(x,y)] \\\\
                                               & - \\beta D_{KL}(\\pi||\\pi_{ref})
                                \\end{align*}
                                $$
                            </div>
                        </div>
                        <div class="text-xs text-blue-700">Prevents policy from drifting too far from reference model during alignment</div>
                    </div>
                </div>

                <!-- Model Regularization -->
                <div class="text-center">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200 h-full">
                        <div class="font-medium text-green-900 mb-3">Regularization</div>
                        <div class="bg-white p-3 rounded border mb-3">
                            <div class="text-sm">
                                $$
                                \\begin{align*}
                                \\mathcal{L} = & \\mathcal{L}_{task} \\\\
                                               & + \\lambda D_{KL}(P_{model}||P_{prior})
                                \\end{align*}
                                $$
                            </div>
                        </div>
                        <div class="text-xs text-green-700">Keeps model close to a prior distribution to prevent overfitting</div>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="text-sm text-purple-800 text-center">
                    <strong>Key Insight:</strong> KL divergence provides a principled way to measure and control how much models change during training, ensuring stability and preventing catastrophic forgetting.
                </div>
            </div>
        </div>
        
        <!-- Practical Considerations -->
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span class="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                ⚙️ Practical Implementation Considerations
            </h4>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Numerical Stability -->
                <div class="bg-white p-4 rounded-lg border">
                    <h5 class="font-semibold text-gray-900 mb-3">Numerical Stability</h5>
                    <div class="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-3">
                        <div class="text-center">
                            <div class="text-sm">
                                $$
                                \\begin{align*}
                                D_{KL}(P||Q) = & \\sum P(x) \\left[\\log P(x) \\right. \\\\
                                               & \\left. - \\log Q(x)\\right]
                                \\end{align*}
                                $$
                            </div>
                            <div class="text-xs text-gray-600 mt-2">Numerically stable log-space computation</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 space-y-2">
                        <div>• Use log-space arithmetic to avoid underflow</div>
                        <div>• Add small epsilon to prevent log(0)</div>
                        <div>• Use torch.nn.functional.kl_div in PyTorch</div>
                    </div>
                </div>
                
                <!-- Common Pitfalls -->
                <div class="bg-white p-4 rounded-lg border">
                    <h5 class="font-semibold text-gray-900 mb-3">Common Pitfalls</h5>
                    <div class="space-y-3">
                        <div class="bg-red-50 p-3 rounded border border-red-200">
                            <div class="font-medium text-red-900 text-sm">Asymmetry Confusion</div>
                            <div class="text-xs text-red-700">\\( D_{KL}(P||Q) \neq D_{KL}(Q||P) \\) - order matters!</div>
                        </div>
                        
                        <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <div class="font-medium text-yellow-900 text-sm">Zero Probability Issue</div>
                            <div class="text-xs text-yellow-700">Undefined when Q(x)=0 but P(x)>0</div>
                        </div>
                        
                        <div class="bg-blue-50 p-3 rounded border border-blue-200">
                            <div class="font-medium text-blue-900 text-sm">Scale Sensitivity</div>
                            <div class="text-xs text-blue-700">Very sensitive to probability tail differences</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Alternative Divergences -->
        <div class="bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 class="text-lg font-bold text-gray-900 mb-4 text-center">🔄 Related Divergence Measures</h4>
            
            <div class="grid lg:grid-cols-3 gap-6">
                <div class="bg-white p-5 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-3">↔️</div>
                    <h5 class="font-semibold text-blue-900 mb-3">Jensen-Shannon Divergence</h5>
                    <div class="text-sm bg-blue-50 p-3 rounded mb-3">
                        $$
                        \\begin{align*}
                        JS(P,Q) = & \\frac{1}{2}D_{KL}(P||M) \\\\
                                  & + \\frac{1}{2}D_{KL}(Q||M)
                        \\end{align*}
                        $$
                    </div>
                    <p class="text-sm text-gray-700">
                        Symmetric version of KL divergence, bounded between 0 and 1
                    </p>
                </div>
                
                <div class="bg-white p-5 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-3">🎯</div>
                    <h5 class="font-semibold text-purple-900 mb-3">Reverse KL</h5>
                    <div class="text-sm bg-purple-50 p-3 rounded mb-3">
                        $$D_{KL}(Q||P)$$
                    </div>
                    <p class="text-sm text-gray-700">
                        Mode-seeking behavior, used in variational inference and GANs
                    </p>
                </div>
                
                <div class="bg-white p-5 rounded-lg border shadow-sm text-center">
                    <div class="text-2xl mb-3">🌊</div>
                    <h5 class="font-semibold text-green-900 mb-3">Wasserstein Distance</h5>
                    <div class="text-sm bg-green-50 p-3 rounded mb-3">
                        $$W(P,Q) = \\inf_{\\gamma} \\mathbb{E}[d(x,y)]$$
                    </div>
                    <p class="text-sm text-gray-700">
                        Earth mover's distance, more stable for training GANs
                    </p>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "📊 Interactive KL Divergence Explorer",
    html: `<div class="space-y-6">
            <!-- Distribution Configuration -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <label for="q29-dist-type" class="block text-sm font-medium text-gray-700 mb-2">📈 Choose Distribution Scenario</label>
        <select id="q29-dist-type" aria-describedby="q29-dist-type-desc" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="teacher-student" selected>Teacher-Student Distillation</option>
                    <option value="rlhf-drift">RLHF Policy Drift</option>
                    <option value="fine-tuning">Fine-tuning Regularization</option>
                    <option value="custom">Custom Distributions</option>
                </select>
        <p id="q29-dist-type-desc" class="text-xs text-gray-600 mt-1">Different scenarios show how KL divergence is used in LLM training</p>
            </div>
            
            <!-- Distribution Parameters -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q29-dist-p" class="block text-sm font-medium text-gray-700 mb-2">🎯 Target Distribution P</label>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <label class="text-xs w-16">Peak:</label>
                            <input type="range" id="q29-p-peak" min="0" max="10" value="5" step="0.1" class="flex-1">
                            <span id="q29-p-peak-val" class="text-xs w-8">5.0</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <label class="text-xs w-16">Width:</label>
                            <input type="range" id="q29-p-width" min="0.5" max="3" value="1" step="0.1" class="flex-1">
                            <span id="q29-p-width-val" class="text-xs w-8">1.0</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">True/teacher/reference distribution</p>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q29-dist-q" class="block text-sm font-medium text-gray-700 mb-2">🔄 Approximating Distribution Q</label>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <label class="text-xs w-16">Peak:</label>
                            <input type="range" id="q29-q-peak" min="0" max="10" value="4.5" step="0.1" class="flex-1">
                            <span id="q29-q-peak-val" class="text-xs w-8">4.5</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <label class="text-xs w-16">Width:</label>
                            <input type="range" id="q29-q-width" min="0.5" max="3" value="1.2" step="0.1" class="flex-1">
                            <span id="q29-q-width-val" class="text-xs w-8">1.2</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Student/policy/model distribution</p>
                </div>
            </div>

            <!-- KL Divergence Mode Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">🔬 Analysis Mode</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q29-mode" value="forward" checked class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Forward KL</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">D(P||Q)</span>
                            </div>
                            <p class="text-xs text-gray-600">Mean-seeking: Q covers all of P's mass</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q29-mode" value="reverse" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Reverse KL</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">D(Q||P)</span>
                            </div>
                            <p class="text-xs text-gray-600">Mode-seeking: Q focuses on P's modes</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q29-mode" value="symmetric" class="absolute top-2 right-2">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Jensen-Shannon</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">JS(P,Q)</span>
                            </div>
                            <p class="text-xs text-gray-600">Symmetric: balanced trade-off</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Scenarios -->
            <div class="flex flex-wrap gap-2">
                <span class="text-sm font-medium text-gray-700">💡 Quick Scenarios:</span>
                <button id="q29-scenario-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Perfect Match</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">📊 KL Divergence Analysis</h4>
                    <div id="q29-mode-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Forward KL</div>
                </div>
                <div id="q29-output" class="min-h-[300px]" aria-live="polite" aria-atomic="true"></div>
                <div id="q29-legend" class="mt-3 text-xs text-gray-600" aria-live="polite"></div>
            </div>
            
            <!-- Mathematical Insight -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🧮 Mathematical Insight</h4>
                <div id="q29-explanation" class="text-sm text-yellow-800" aria-live="polite"></div>
            </div>
        </div>`,
        script: () => {
            // Safe MathJax typeset helper
            function typesetMath(root) {
                try {
                    if (window.MathJax && MathJax.typesetPromise) {
                        return MathJax.typesetPromise(root ? [root] : undefined).catch(() => {});
                    }
                } catch (_) {}
                return Promise.resolve();
            }
            // Get DOM elements with error checking
            const distTypeSelect = document.getElementById('q29-dist-type');
            const pPeakSlider = document.getElementById('q29-p-peak');
            const pWidthSlider = document.getElementById('q29-p-width');
            const qPeakSlider = document.getElementById('q29-q-peak');
            const qWidthSlider = document.getElementById('q29-q-width');
            const pPeakVal = document.getElementById('q29-p-peak-val');
            const pWidthVal = document.getElementById('q29-p-width-val');
            const qPeakVal = document.getElementById('q29-q-peak-val');
            const qWidthVal = document.getElementById('q29-q-width-val');
            const modeRadios = document.querySelectorAll('input[name="q29-mode"]');
            const output = document.getElementById('q29-output');
            const scenarioBtn = document.getElementById('q29-scenario-btn');
            const modeIndicator = document.getElementById('q29-mode-indicator');
            const legend = document.getElementById('q29-legend');
            const explanation = document.getElementById('q29-explanation');

            // Check if required elements exist
            if (!distTypeSelect || !output || !pPeakSlider || !qPeakSlider) {
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Scenario configurations
            const scenarios = {
                'teacher-student': {
                    name: 'Teacher-Student Knowledge Distillation',
                    description: 'Large teacher model (P) transfers knowledge to smaller student (Q)',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 4.8, width: 1.2 },
                    context: 'Student tries to match teacher\'s output distribution'
                },
                'rlhf-drift': {
                    name: 'RLHF Policy Drift Prevention',
                    description: 'Reference model (P) constrains fine-tuned policy (Q) during RLHF',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 5.3, width: 0.9 },
                    context: 'Policy should not drift too far from reference'
                },
                'fine-tuning': {
                    name: 'Fine-tuning with Prior Regularization',
                    description: 'Prior distribution (P) regularizes fine-tuned model (Q)',
                    pDefault: { peak: 5.0, width: 1.5 },
                    qDefault: { peak: 4.5, width: 1.0 },
                    context: 'Model adapts to new task while staying close to prior'
                },
                'custom': {
                    name: 'Custom Distributions',
                    description: 'Explore arbitrary probability distributions',
                    pDefault: { peak: 5.0, width: 1.0 },
                    qDefault: { peak: 4.5, width: 1.2 },
                    context: 'Free exploration of KL divergence behavior'
                }
            };

            // Predefined scenarios for cycling
            const quickScenarios = [
                { dist: 'teacher-student', p: {peak: 5.0, width: 1.0}, q: {peak: 5.0, width: 1.0}, mode: 'forward', note: 'Perfect Match' },
                { dist: 'teacher-student', p: {peak: 5.0, width: 1.0}, q: {peak: 4.5, width: 1.5}, mode: 'forward', note: 'Student Underfits' },
                { dist: 'rlhf-drift', p: {peak: 5.0, width: 1.0}, q: {peak: 6.0, width: 0.8}, mode: 'forward', note: 'Policy Drift' },
                { dist: 'fine-tuning', p: {peak: 5.0, width: 2.0}, q: {peak: 4.0, width: 0.8}, mode: 'reverse', note: 'Mode Collapse' }
            ];
            let scenarioIndex = 0;

            // Gaussian probability distribution
            function gaussian(x, mu, sigma) {
                return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)) / (sigma * Math.sqrt(2 * Math.PI));
            }

            // Normalize distribution to sum to 1
            function normalize(dist) {
                const sum = dist.reduce((s, val) => s + val, 0);
                return dist.map(val => val / sum);
            }

            // Calculate KL divergence
            function calculateKL(P, Q, mode = 'forward') {
                const epsilon = 1e-10; // Numerical stability
                let kl = 0;
                
                if (mode === 'forward') {
                    // D(P||Q)
                    for (let i = 0; i < P.length; i++) {
                        if (P[i] > epsilon) {
                            kl += P[i] * Math.log((P[i] + epsilon) / (Q[i] + epsilon));
                        }
                    }
                } else if (mode === 'reverse') {
                    // D(Q||P)
                    for (let i = 0; i < P.length; i++) {
                        if (Q[i] > epsilon) {
                            kl += Q[i] * Math.log((Q[i] + epsilon) / (P[i] + epsilon));
                        }
                    }
                } else if (mode === 'symmetric') {
                    // Jensen-Shannon divergence
                    const M = P.map((p, i) => (p + Q[i]) / 2);
                    let js = 0;
                    for (let i = 0; i < P.length; i++) {
                        if (P[i] > epsilon) {
                            js += 0.5 * P[i] * Math.log((P[i] + epsilon) / (M[i] + epsilon));
                        }
                        if (Q[i] > epsilon) {
                            js += 0.5 * Q[i] * Math.log((Q[i] + epsilon) / (M[i] + epsilon));
                        }
                    }
                    kl = js;
                }
                
                return Math.max(0, kl); // Ensure non-negative
            }

            // Get current mode
            function getCurrentMode() {
                const selected = document.querySelector('input[name="q29-mode"]:checked');
                return selected ? selected.value : 'forward';
            }

            // Update slider value displays
            function updateSliderValues() {
                if (pPeakVal) pPeakVal.textContent = parseFloat(pPeakSlider.value).toFixed(1);
                if (pWidthVal) pWidthVal.textContent = parseFloat(pWidthSlider.value).toFixed(1);
                if (qPeakVal) qPeakVal.textContent = parseFloat(qPeakSlider.value).toFixed(1);
                if (qWidthVal) qWidthVal.textContent = parseFloat(qWidthSlider.value).toFixed(1);
            }

            // Update visual indicators
            function updateModeVisuals() {
                const mode = getCurrentMode();
                const modeNames = {
                    'forward': 'Forward KL: D(P||Q)',
                    'reverse': 'Reverse KL: D(Q||P)',
                    'symmetric': 'Jensen-Shannon Divergence'
                };
                
                if (modeIndicator) {
                    modeIndicator.textContent = modeNames[mode];
                }

                document.querySelectorAll('input[name="q29-mode"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Apply scenario defaults
            function applyScenario(scenarioKey) {
                const scenario = scenarios[scenarioKey];
                if (!scenario) return;

                pPeakSlider.value = scenario.pDefault.peak;
                pWidthSlider.value = scenario.pDefault.width;
                qPeakSlider.value = scenario.qDefault.peak;
                qWidthSlider.value = scenario.qDefault.width;
                
                updateSliderValues();
            }

            // Main processing function
            const processAndDisplay = () => {
                try {
                    const distType = distTypeSelect.value;
                    const mode = getCurrentMode();
                    
                    // Get distribution parameters
                    const pPeak = parseFloat(pPeakSlider.value);
                    const pWidth = parseFloat(pWidthSlider.value);
                    const qPeak = parseFloat(qPeakSlider.value);
                    const qWidth = parseFloat(qWidthSlider.value);
                    
                    updateModeVisuals();
                    updateSliderValues();

                    // Generate distributions
                    const xRange = [];
                    const P = [];
                    const Q = [];
                    
                    for (let x = 0; x <= 10; x += 0.1) {
                        xRange.push(x);
                        P.push(gaussian(x, pPeak, pWidth));
                        Q.push(gaussian(x, qPeak, qWidth));
                    }
                    
                    // Normalize distributions
                    const PNorm = normalize(P);
                    const QNorm = normalize(Q);
                    
                    // Calculate divergences
                    const klForward = calculateKL(PNorm, QNorm, 'forward');
                    const klReverse = calculateKL(PNorm, QNorm, 'reverse');
                    const jsDivergence = calculateKL(PNorm, QNorm, 'symmetric');
                    
                    let html = '<div class="space-y-4">';
                    
                    // Scenario information
                    const scenario = scenarios[distType];
                    html += `
                        <div class="bg-gray-50 p-3 rounded border">
                            <h5 class="font-medium text-gray-700 mb-2">${scenario.name}</h5>
                            <p class="text-sm text-gray-600 mb-2">${scenario.description}</p>
                            <div class="text-xs text-gray-500">${scenario.context}</div>
                        </div>
                    `;

                    // Divergence values
                    html += `
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-blue-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-blue-700">${klForward.toFixed(4)}</div>
                                <div class="text-xs text-blue-600">D(P||Q)</div>
                                <div class="text-xs text-gray-500">Forward KL</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-purple-700">${klReverse.toFixed(4)}</div>
                                <div class="text-xs text-purple-600">D(Q||P)</div>
                                <div class="text-xs text-gray-500">Reverse KL</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded text-center">
                                <div class="text-lg font-bold text-green-700">${jsDivergence.toFixed(4)}</div>
                                <div class="text-xs text-green-600">JS(P,Q)</div>
                                <div class="text-xs text-gray-500">Jensen-Shannon</div>
                            </div>
                        </div>
                    `;

                    // Visual distribution comparison
                    html += `
                        <div class="bg-white border rounded p-4">
                            <h5 class="font-medium text-gray-700 mb-3">Distribution Visualization</h5>
                            <div class="space-y-4">
                                <!-- Distribution curves as bar chart -->
                                <div class="relative h-32 bg-gradient-to-b from-gray-50 to-gray-100 rounded border p-2">
                                    <div class="flex items-end justify-between h-full space-x-1">
                    `;
                    
                    // Create visual bars for distributions
                    const numBars = 25;
                    const maxHeight = Math.max(Math.max(...PNorm), Math.max(...QNorm));
                    
                    for (let i = 0; i < numBars; i++) {
                        const xIndex = Math.floor((i / numBars) * PNorm.length);
                        const pHeight = (PNorm[xIndex] / maxHeight) * 100;
                        const qHeight = (QNorm[xIndex] / maxHeight) * 100;
                        const maxBar = Math.max(pHeight, qHeight);
                        
                        html += `
                            <div class="flex-1 flex flex-col items-center justify-end h-full relative" style="min-height: 100px;">
                                <!-- Background bar for scale -->
                                <div class="w-full bg-gray-200 rounded-sm opacity-20" style="height: 100%"></div>
                                
                                <!-- P distribution bar -->
                                <div class="absolute bottom-0 w-2/5 left-0 bg-blue-500 rounded-sm opacity-70 transition-all hover:opacity-90" 
                                     style="height: ${pHeight}%"
                                     title="P: ${PNorm[xIndex].toFixed(4)}"></div>
                                
                                <!-- Q distribution bar -->
                                <div class="absolute bottom-0 w-2/5 right-0 bg-purple-500 rounded-sm opacity-70 transition-all hover:opacity-90" 
                                     style="height: ${qHeight}%"
                                     title="Q: ${QNorm[xIndex].toFixed(4)}"></div>
                            </div>
                        `;
                    }
                    
                    html += `
                                    </div>
                                    
                                    <!-- X-axis labels -->
                                    <div class="flex justify-between text-xs text-gray-500 mt-2 px-1">
                                        <span>0</span>
                                        <span>2.5</span>
                                        <span>5.0</span>
                                        <span>7.5</span>
                                        <span>10</span>
                                    </div>
                                </div>
                                
                                <!-- Legend and key metrics -->
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <!-- Legend -->
                                    <div class="bg-gray-50 p-3 rounded border">
                                        <h6 class="font-medium text-gray-900 mb-2 text-center">Legend</h6>
                                        <div class="space-y-2">
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-3 bg-blue-500 rounded-sm opacity-70"></div>
                                                <span class="text-sm text-blue-700">P (Target)</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-3 bg-purple-500 rounded-sm opacity-70"></div>
                                                <span class="text-sm text-purple-700">Q (Approximation)</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Distribution P stats -->
                                    <div class="bg-blue-50 p-3 rounded border border-blue-200">
                                        <h6 class="font-medium text-blue-900 mb-2 text-center">Distribution P</h6>
                                        <div class="text-sm text-blue-800 space-y-1 text-center">
                                            <div>Peak: <span class="font-mono">${pPeak.toFixed(1)}</span></div>
                                            <div>Width: <span class="font-mono">${pWidth.toFixed(1)}</span></div>
                                            <div>Max: <span class="font-mono">${Math.max(...PNorm).toFixed(4)}</span></div>
                                        </div>
                                    </div>
                                    
                                    <!-- Distribution Q stats -->
                                    <div class="bg-purple-50 p-3 rounded border border-purple-200">
                                        <h6 class="font-medium text-purple-900 mb-2 text-center">Distribution Q</h6>
                                        <div class="text-sm text-purple-800 space-y-1 text-center">
                                            <div>Peak: <span class="font-mono">${qPeak.toFixed(1)}</span></div>
                                            <div>Width: <span class="font-mono">${qWidth.toFixed(1)}</span></div>
                                            <div>Max: <span class="font-mono">${Math.max(...QNorm).toFixed(4)}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Current mode highlight
                    const currentKL = mode === 'forward' ? klForward : 
                                    mode === 'reverse' ? klReverse : jsDivergence;
                    
                    html += `
                        <div class="p-3 rounded border-2 ${
                            mode === 'forward' ? 'border-blue-300 bg-blue-50' :
                            mode === 'reverse' ? 'border-purple-300 bg-purple-50' :
                            'border-green-300 bg-green-50'
                        }">
                            <div class="text-center">
                                <div class="text-2xl font-bold ${
                                    mode === 'forward' ? 'text-blue-700' :
                                    mode === 'reverse' ? 'text-purple-700' :
                                    'text-green-700'
                                }">${currentKL.toFixed(6)}</div>
                                <div class="text-sm font-medium text-gray-700">
                                    Current: ${modeIndicator ? modeIndicator.textContent : mode}
                                </div>
                            </div>
                        </div>
                    `;

                    html += '</div>';
                    output.innerHTML = html;
                    typesetMath(output);

                    if (legend) {
                        legend.innerHTML = `
                            Scenario: ${scenario.name} | 
                            P: μ=${pPeak.toFixed(1)}, σ=${pWidth.toFixed(1)} | 
                            Q: μ=${qPeak.toFixed(1)}, σ=${qWidth.toFixed(1)} | 
                            Mode: ${mode}
                        `;
                        typesetMath(legend);
                    }

                    if (explanation) {
                        let explText = '';
                        if (mode === 'forward') {
                            explText = `<strong>Forward KL D(P||Q) = ${klForward.toFixed(4)}:</strong> Measures how much information is lost when using Q to approximate P. `;
                            if (klForward < 0.01) {
                                explText += 'Excellent match - Q closely approximates P.';
                            } else if (klForward < 0.1) {
                                explText += 'Good approximation with minor differences.';
                            } else {
                                explText += 'Significant divergence - Q poorly approximates P.';
                            }
                        } else if (mode === 'reverse') {
                            explText = `<strong>Reverse KL D(Q||P) = ${klReverse.toFixed(4)}:</strong> Mode-seeking behavior where Q focuses on P's modes. `;
                            explText += 'Used in variational inference and GAN training.';
                        } else {
                            explText = `<strong>Jensen-Shannon JS(P,Q) = ${jsDivergence.toFixed(4)}:</strong> Symmetric measure bounded between 0 and 1. `;
                            explText += 'Provides balanced comparison without directional bias.';
                        }
                        
                        explText += ` <strong>LLM Context:</strong> In ${scenario.name.toLowerCase()}, this measures ${scenario.context.toLowerCase()}.`;
                        
                        explanation.innerHTML = explText;
                        typesetMath(explanation);
                    }
                    
                } catch (error) {
                    console.error('Error in processAndDisplay:', error);
                    if (output) {
                        output.innerHTML = '<div class="text-red-500 p-4">Error processing data. Please try again.</div>';
                    }
                }
            };

            // Scenario cycling functionality
            if (scenarioBtn) {
                scenarioBtn.addEventListener('click', () => {
                    try {
                        const scenario = quickScenarios[scenarioIndex];
                        
                        distTypeSelect.value = scenario.dist;
                        pPeakSlider.value = scenario.p.peak;
                        pWidthSlider.value = scenario.p.width;
                        qPeakSlider.value = scenario.q.peak;
                        qWidthSlider.value = scenario.q.width;
                        
                        const modeRadio = document.querySelector(`input[name="q29-mode"][value="${scenario.mode}"]`);
                        if (modeRadio) {
                            modeRadio.checked = true;
                        }
                        
                        processAndDisplay();
                        
                        scenarioBtn.textContent = scenario.note;
                        scenarioBtn.title = `Scenario ${scenarioIndex + 1}/${quickScenarios.length}: ${scenario.note}`;
                        
                        scenarioIndex = (scenarioIndex + 1) % quickScenarios.length;
                    } catch (error) {
                        console.error('Error in scenario cycling:', error);
                    }
                });
            }

            // Event listeners
            if (distTypeSelect) {
                distTypeSelect.addEventListener('change', () => {
                    applyScenario(distTypeSelect.value);
                    processAndDisplay();
                });
            }
            
            [pPeakSlider, pWidthSlider, qPeakSlider, qWidthSlider].forEach(slider => {
                if (slider) {
                    slider.addEventListener('input', processAndDisplay);
                }
            });
            
            modeRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            applyScenario(distTypeSelect.value);
            updateModeVisuals();
            processAndDisplay();
        }
    }
};

// Optional export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
