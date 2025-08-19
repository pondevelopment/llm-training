// Question 15: Model Distillation for LLMs
// Created: July 11, 2025
// Educational Focus: Knowledge distillation, teacher-student models, model compression, deployment optimization

const question = {
    title: "15. What is model distillation, and how does it benefit LLMs?",
    answer: `
        <div class="space-y-4">
            <!-- Recommended Reading Links -->
            <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (if these terms are new)</h4>
                <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                    <li><a href="#question-4" class="text-indigo-700 underline hover:text-indigo-900">Question 4: LoRA vs QLoRA</a> — adapters vs full fine‑tuning and memory trade‑offs.</li>
                    <li><a href="#question-29" class="text-indigo-700 underline hover:text-indigo-900">Question 29: KL divergence</a> — the divergence used in many distillation losses.</li>
                    <li><a href="#question-6" class="text-indigo-700 underline hover:text-indigo-900">Question 6: Temperature in generation</a> — intuition for temperature T used during distillation.</li>
                </ul>
            </div>
            <!-- Main Concept -->
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h4 class="font-semibold text-blue-900 mb-2">🎓 What is Model Distillation?</h4>
                <p class="text-blue-800">
                    Model distillation is like a master craftsman teaching an apprentice. A large, powerful "teacher" model 
                    trains a smaller "student" model by sharing not just the final answers, but also its confidence levels 
                    and reasoning patterns. The student learns to mimic the teacher's decision-making process while being 
                    much smaller and faster.
                </p>
            </div>

            <!-- Distillation Types -->
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <h5 class="font-medium text-green-900">📚 Knowledge Distillation</h5>
                    <p class="text-sm text-green-700 mb-2">
                        Train student using teacher's soft probability distributions instead of hard labels.
                    </p>
                    <div class="text-xs bg-green-100 px-2 py-1 rounded border text-center overflow-x-auto whitespace-nowrap">
                        $$
                        \\mathcal{L} = \\alpha\\, T^2\\, D_{KL}\\!\\left(p_{t}^{(T)}\\,\\big\\|\\, p_{s}^{(T)}\\right) + (1-\\alpha)\\, \\mathrm{CE}(y, p_s)
                        $$
                    </div>
                </div>
                
                <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <h5 class="font-medium text-purple-900">🏗️ Progressive Distillation</h5>
                    <p class="text-sm text-purple-700 mb-2">
                        Gradually reduce model size through multiple teacher-student generations.
                    </p>
                    <code class="text-xs bg-purple-100 px-1 rounded block">
                        Large → Medium → Small → Tiny
                    </code>
                </div>
                
                <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                    <h5 class="font-medium text-orange-900">🎯 Task-Specific Distillation</h5>
                    <p class="text-sm text-orange-700 mb-2">
                        Specialize student models for specific tasks while maintaining general teacher knowledge.
                    </p>
                    <code class="text-xs bg-orange-100 px-1 rounded block">
                        General Teacher → Task Expert
                    </code>
                </div>
            </div>

            <!-- Technical Process -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-2">⚙️ Distillation Process</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Teacher Model (Large):</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• Generates soft probability distributions</li>
                            <li>• Provides rich knowledge about uncertainty</li>
                            <li>• Shows confidence patterns across classes</li>
                            <li>• Reveals dark knowledge from training</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-gray-800 mb-2">Student Model (Small):</h6>
                        <ul class="text-gray-700 space-y-1">
                            <li>• Learns from teacher's probability distributions</li>
                            <li>• Mimics teacher's confidence patterns</li>
                            <li>• Compressed architecture with fewer parameters</li>
                            <li>• Optimized for target deployment environment</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Advanced Techniques -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400">
                    <h5 class="font-medium text-indigo-900">🌡️ Temperature Scaling</h5>
                    <p class="text-sm text-indigo-700">
                        Adjust softmax temperature to control probability distribution smoothness during distillation.
                    </p>
                    <div class="text-xs bg-indigo-100 px-2 py-1 rounded border text-center mt-1 overflow-x-auto whitespace-nowrap">
                        $$
                        p_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}
                        $$
                    </div>
                </div>
                
                <div class="bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                    <h5 class="font-medium text-teal-900">🔄 Online Distillation</h5>
                    <p class="text-sm text-teal-700">
                        Train teacher and student simultaneously, with mutual learning between peer networks.
                    </p>
                    <code class="text-xs bg-teal-100 px-1 rounded block mt-1">
                        Peer Network A ↔ Peer Network B
                    </code>
                </div>
            </div>

            <!-- Benefits and Applications -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="font-semibold text-yellow-900 mb-2">🎯 Key Benefits for LLMs</h4>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h6 class="font-medium text-yellow-800 mb-2">Performance Benefits:</h6>
                        <ul class="text-yellow-700 space-y-1">
                            <li>• <strong>Size Reduction:</strong> 10-100x smaller models</li>
                            <li>• <strong>Speed Increase:</strong> 5-50x faster inference</li>
                            <li>• <strong>Memory Efficiency:</strong> Lower GPU/CPU requirements</li>
                            <li>• <strong>Energy Savings:</strong> Reduced power consumption</li>
                        </ul>
                    </div>
                    <div>
                        <h6 class="font-medium text-yellow-800 mb-2">Deployment Benefits:</h6>
                        <ul class="text-yellow-700 space-y-1">
                            <li>• <strong>Mobile Deployment:</strong> Run on smartphones/tablets</li>
                            <li>• <strong>Edge Computing:</strong> Local processing capabilities</li>
                            <li>• <strong>Real-time Applications:</strong> Low-latency responses</li>
                            <li>• <strong>Cost Reduction:</strong> Lower infrastructure costs</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Trade-offs and Considerations -->
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-red-900 mb-2">⚖️ Trade-offs and Considerations</h4>
                <div class="text-sm text-red-800 space-y-2">
                    <p><strong>Performance vs. Size:</strong> Smaller models typically have some performance degradation compared to teachers.</p>
                    <p><strong>Task Generalization:</strong> Distilled models may struggle with tasks very different from training data.</p>
                    <p><strong>Training Complexity:</strong> Requires careful tuning of temperature, loss weights, and architectures.</p>
                    <p><strong>Teacher Quality:</strong> Student performance is fundamentally limited by teacher model quality.</p>
                </div>
            </div>

            <!-- Standard Distillation Loss (Reference) -->
            <div class="bg-white p-3 rounded border">
                <h5 class="font-medium text-gray-900 mb-1">🧮 Standard Distillation Loss</h5>
                <p class="text-sm text-gray-700 mb-2">Weighted combination of soft (teacher) and hard (ground‑truth) terms with temperature scaling:</p>
                <div class="text-sm bg-gray-50 p-2 rounded border text-center overflow-x-auto whitespace-nowrap">
                    $$
                    \\mathcal{L}_{\\mathrm{KD}} = \\alpha\\, T^2\\, D_{KL}\\!\\left(p_{t}^{(T)}\\,\\big\\|\\, p_{s}^{(T)}\\right) + (1-\\alpha)\\, \\mathrm{CE}(y, p_s)
                    $$
                </div>
                <p class="text-xs text-gray-500 mt-2">Where: <em>T</em> is temperature, <em>\alpha</em> balances soft vs. hard targets, <em>p_t^{(T)}</em> and <em>p_s^{(T)}</em> are teacher/student with temperature.</p>
            </div>
        </div>
    `,
    interactive: {
        title: "🧪 Model Distillation Simulator",
        html: `
            <div class="space-y-6">
                <!-- Teacher Model Selection -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <label for="q15-teacher-select" class="block text-sm font-medium text-gray-700 mb-2">👨‍🏫 Select Teacher Model</label>
                    <select id="q15-teacher-select" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="0" selected>GPT-Large (175B parameters)</option>
                        <option value="1">T5-XXL (11B parameters)</option>
                        <option value="2">BERT-Large (340M parameters)</option>
                        <option value="3">PaLM-62B (62B parameters)</option>
                        <option value="4">LLaMA-70B (70B parameters)</option>
                    </select>
                    <p class="text-xs text-gray-600 mt-1">Choose your teacher model to see how different architectures affect distillation outcomes!</p>
                </div>
                
                <!-- Distillation Strategy Selection -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-3">🎯 Distillation Strategy</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q15-strategy" value="knowledge" class="mr-3" checked>
                            <div>
                                <div class="font-medium text-sm">Knowledge Distillation</div>
                                <div class="text-xs text-gray-500">Soft probabilities</div>
                                <div class="text-xs bg-green-100 text-green-700 px-1 rounded mt-1">Balanced</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q15-strategy" value="progressive" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Progressive</div>
                                <div class="text-xs text-gray-500">Multi-stage reduction</div>
                                <div class="text-xs bg-blue-100 text-blue-700 px-1 rounded mt-1">Gradual</div>
                            </div>
                        </label>
                        
                        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input type="radio" name="q15-strategy" value="task-specific" class="mr-3">
                            <div>
                                <div class="font-medium text-sm">Task-Specific</div>
                                <div class="text-xs text-gray-500">Specialized focus</div>
                                <div class="text-xs bg-purple-100 text-purple-700 px-1 rounded mt-1">Targeted</div>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Training Parameters -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-3">⚙️ Distillation Configuration</h4>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label for="q15-temperature" class="block text-sm font-medium text-gray-700 mb-2">Temperature (T)</label>
                            <input type="range" id="q15-temperature" min="1" max="10" step="1" value="4" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1</span>
                                <span id="q15-temp-display" class="font-medium">4</span>
                                <span>10</span>
                            </div>
                        </div>
                        <div>
                            <label for="q15-alpha" class="block text-sm font-medium text-gray-700 mb-2">Soft Loss Weight (α)</label>
                            <input type="range" id="q15-alpha" min="0" max="10" step="1" value="7" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0.0</span>
                                <span id="q15-alpha-display" class="font-medium">0.7</span>
                                <span>1.0</span>
                            </div>
                        </div>
                        <div>
                            <label for="q15-compression" class="block text-sm font-medium text-gray-700 mb-2">Compression Ratio</label>
                            <input type="range" id="q15-compression" min="2" max="100" step="2" value="10" class="w-full">
                            <div class="flex justify-between text-xs text-gray-500 mt-1">
                                <span>2x</span>
                                <span id="q15-compression-display" class="font-medium">10x</span>
                                <span>100x</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Examples -->
                <div class="flex flex-wrap gap-2">
                    <span class="text-sm font-medium text-gray-700">💡 Quick Examples:</span>
                    <button id="q15-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Mobile Deployment</button>
                </div>

                <!-- Results Visualization -->
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-medium text-gray-900">📊 Distillation Results</h4>
                        <div id="q15-strategy-indicator" class="text-xs px-2 py-1 rounded font-medium">Knowledge Distillation</div>
                    </div>
                    
                    <!-- Performance Metrics -->
                    <div class="grid md:grid-cols-4 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-lg font-bold text-blue-600" id="q15-performance">92%</div>
                            <div class="text-xs text-gray-500">Performance Retention</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q15-performance-bar" class="h-full bg-blue-500 rounded-full" style="width: 92%"></div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-green-600" id="q15-size-reduction">10x</div>
                            <div class="text-xs text-gray-500">Size Reduction</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q15-size-bar" class="h-full bg-green-500 rounded-full" style="width: 70%"></div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-purple-600" id="q15-speed">8.5x</div>
                            <div class="text-xs text-gray-500">Speed Improvement</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q15-speed-bar" class="h-full bg-purple-500 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-orange-600" id="q15-memory">85%</div>
                            <div class="text-xs text-gray-500">Memory Savings</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div id="q15-memory-bar" class="h-full bg-orange-500 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Model Comparison Visualization -->
                    <div class="bg-gray-50 p-3 rounded">
                        <h5 class="text-sm font-medium text-gray-700 mb-2">Model Size Comparison</h5>
                        <div class="flex items-end justify-between h-20 space-x-2">
                            <div class="flex flex-col items-center">
                                <div id="q15-teacher-bar" class="bg-red-400 rounded-t" style="width: 40px; height: 100%" title="Teacher Model"></div>
                                <span class="text-xs text-gray-600 mt-1">Teacher</span>
                            </div>
                            <div class="flex flex-col items-center">
                                <div id="q15-student-bar" class="bg-blue-400 rounded-t" style="width: 40px; height: 10%" title="Student Model"></div>
                                <span class="text-xs text-gray-600 mt-1">Student</span>
                            </div>
                        </div>
                        <div class="text-center text-xs text-gray-500 mt-2">
                            <span id="q15-teacher-size">175B</span> → <span id="q15-student-size">17.5B</span> parameters
                        </div>
                    </div>
                </div>
                
                <!-- Educational Explanation -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 class="font-medium text-yellow-900 mb-2">💡 Distillation Analysis</h4>
                    <div id="q15-explanation" class="text-sm text-yellow-800"></div>
                </div>
            </div>
        `,
        script: () => {
            // Teacher model definitions
            const teacherModels = [
                {
                    name: "GPT-Large",
                    parameters: "175B",
                    parameterCount: 175,
                    architecture: "Transformer Decoder",
                    strengths: ["Text generation", "Few-shot learning", "Versatile language tasks"],
                    computeRequirement: "Very High"
                },
                {
                    name: "T5-XXL",
                    parameters: "11B",
                    parameterCount: 11,
                    architecture: "Encoder-Decoder",
                    strengths: ["Text-to-text tasks", "Translation", "Summarization"],
                    computeRequirement: "High"
                },
                {
                    name: "BERT-Large",
                    parameters: "340M",
                    parameterCount: 0.34,
                    architecture: "Encoder-Only",
                    strengths: ["Text classification", "NER", "Understanding tasks"],
                    computeRequirement: "Medium"
                },
                {
                    name: "PaLM-62B",
                    parameters: "62B",
                    parameterCount: 62,
                    architecture: "Transformer Decoder",
                    strengths: ["Reasoning", "Code generation", "Mathematical tasks"],
                    computeRequirement: "Very High"
                },
                {
                    name: "LLaMA-70B",
                    parameters: "70B",
                    parameterCount: 70,
                    architecture: "Transformer Decoder",
                    strengths: ["Efficient architecture", "Strong performance", "Open weights"],
                    computeRequirement: "Very High"
                }
            ];

            // Distillation strategy configurations
            const strategyConfig = {
                knowledge: {
                    name: "Knowledge Distillation",
                    color: "text-green-700",
                    bgColor: "bg-green-100",
                    performanceRetention: 0.88,
                    efficiencyGain: 1.0,
                    trainingTime: 1.0,
                    explanation: "Uses soft probability distributions from the teacher to train the student. Good balance between performance retention and training simplicity."
                },
                progressive: {
                    name: "Progressive Distillation",
                    color: "text-blue-700",
                    bgColor: "bg-blue-100",
                    performanceRetention: 0.94,
                    efficiencyGain: 0.7,
                    trainingTime: 2.5,
                    explanation: "Reduces model size gradually through multiple generations. Highest performance retention but significantly more training time and complexity."
                },
                "task-specific": {
                    name: "Task-Specific Distillation",
                    color: "text-purple-700",
                    bgColor: "bg-purple-100",
                    performanceRetention: 0.82,
                    efficiencyGain: 1.3,
                    trainingTime: 1.2,
                    explanation: "Specializes the student for specific tasks. Lower general performance but excels in target domain with better efficiency."
                }
            };

            // Example scenarios
            const examples = [
                {
                    name: "Mobile Deployment",
                    description: "Deploying a language model on smartphones with severe memory constraints",
                    teacherIndex: 0,
                    strategy: "knowledge",
                    temperature: 4,
                    alpha: 7,
                    compression: 50
                },
                {
                    name: "Edge Computing",
                    description: "IoT device with limited resources requiring task-specific performance",
                    teacherIndex: 2,
                    strategy: "task-specific",
                    temperature: 3,
                    alpha: 6,
                    compression: 25
                },
                {
                    name: "Real-time Chat",
                    description: "Low-latency conversational AI requiring high performance retention",
                    teacherIndex: 1,
                    strategy: "progressive",
                    temperature: 4,
                    alpha: 8,
                    compression: 12
                },
                {
                    name: "Code Assistant",
                    description: "Programming help requiring balance of performance and efficiency",
                    teacherIndex: 3,
                    strategy: "knowledge",
                    temperature: 5,
                    alpha: 7,
                    compression: 20
                },
                {
                    name: "Enterprise Server",
                    description: "High-performance deployment with moderate compression for cost efficiency",
                    teacherIndex: 4,
                    strategy: "progressive",
                    temperature: 3,
                    alpha: 8,
                    compression: 8
                }
            ];

            // DOM elements
            const teacherSelect = document.getElementById('q15-teacher-select');
            const strategyRadios = document.querySelectorAll('input[name="q15-strategy"]');
            const strategyIndicator = document.getElementById('q15-strategy-indicator');
            const temperatureSlider = document.getElementById('q15-temperature');
            const alphaSlider = document.getElementById('q15-alpha');
            const compressionSlider = document.getElementById('q15-compression');
            const tempDisplay = document.getElementById('q15-temp-display');
            const alphaDisplay = document.getElementById('q15-alpha-display');
            const compressionDisplay = document.getElementById('q15-compression-display');
            const exampleBtn = document.getElementById('q15-example-btn');
            const explanation = document.getElementById('q15-explanation');

            if (!teacherSelect || !explanation) {
                console.error('Required DOM elements not found for Question 15');
                return;
            }

            let currentExampleIndex = 0;

            // Get current selections
            function getCurrentTeacher() {
                return teacherModels[parseInt(teacherSelect.value)] || teacherModels[0];
            }

            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q15-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'knowledge';
            }

            // Update parameter displays
            function updateParameterDisplays() {
                const temp = parseInt(temperatureSlider.value);
                const alpha = parseInt(alphaSlider.value);
                const compression = parseInt(compressionSlider.value);
                
                tempDisplay.textContent = temp.toString();
                alphaDisplay.textContent = (alpha / 10).toFixed(1);
                compressionDisplay.textContent = `${compression}x`;
            }

            // Calculate distillation metrics
            function calculateMetrics(teacher, strategy, temperature, alpha, compression) {
                const config = strategyConfig[strategy];
                
                // Base performance retention
                let performanceRetention = config.performanceRetention;
                
                // Temperature effects (optimal around 3-4, performance drops at extremes)
                const tempOptimal = 4;
                const tempDeviation = Math.abs(temperature - tempOptimal);
                const tempFactor = Math.max(0.85, 1 - (tempDeviation * 0.03));
                performanceRetention *= tempFactor;
                
                // Alpha effects (balance between soft and hard targets, optimal around 0.7)
                const alphaOptimal = 0.7;
                const alphaActual = alpha / 10;
                const alphaDeviation = Math.abs(alphaActual - alphaOptimal);
                const alphaFactor = Math.max(0.9, 1 - (alphaDeviation * 0.15));
                performanceRetention *= alphaFactor;
                
                // Compression effects (higher compression = more performance loss, non-linear)
                const compressionPenalty = Math.max(0.65, Math.pow(0.995, compression - 2));
                performanceRetention *= compressionPenalty;
                
                // Teacher model size effect (larger teachers transfer better)
                const teacherSizeFactor = Math.min(1.05, 0.95 + (Math.log10(teacher.parameterCount) * 0.02));
                performanceRetention *= teacherSizeFactor;
                
                // Calculate other metrics
                const sizeReduction = compression;
                
                // Speed improvement (accounts for architecture efficiency and overhead)
                let speedImprovement = compression * 0.7 * config.efficiencyGain;
                if (compression > 20) {
                    speedImprovement *= 1.2; // Better cache efficiency with very small models
                }
                
                // Memory savings (accounts for model overhead and runtime requirements)
                const baseMemorySavings = (1 - 1/compression) * 100;
                const overheadFactor = Math.max(0.8, 1 - (compression * 0.002)); // Overhead becomes significant
                const memorySavings = Math.min(95, baseMemorySavings * overheadFactor);
                
                // Student model size
                const studentParams = teacher.parameterCount / compression;
                
                return {
                    performanceRetention: Math.max(0.55, Math.min(0.98, performanceRetention)),
                    sizeReduction,
                    speedImprovement: Math.max(1.5, speedImprovement),
                    memorySavings: Math.max(30, memorySavings),
                    studentParams,
                    teacherParams: teacher.parameterCount,
                    trainingTime: config.trainingTime
                };
            }

            // Update display
            function updateDisplay() {
                const teacher = getCurrentTeacher();
                const strategy = getCurrentStrategy();
                const config = strategyConfig[strategy];
                const temperature = parseInt(temperatureSlider.value);
                const alpha = parseInt(alphaSlider.value);
                const compression = parseInt(compressionSlider.value);

                // Update strategy indicator
                if (strategyIndicator) {
                    strategyIndicator.textContent = config.name;
                    strategyIndicator.className = `text-xs px-2 py-1 rounded font-medium ${config.color} ${config.bgColor}`;
                }

                // Calculate metrics
                const metrics = calculateMetrics(teacher, strategy, temperature, alpha, compression);

                // Update performance displays
                const performanceElement = document.getElementById('q15-performance');
                const sizeElement = document.getElementById('q15-size-reduction');
                const speedElement = document.getElementById('q15-speed');
                const memoryElement = document.getElementById('q15-memory');

                if (performanceElement) performanceElement.textContent = `${Math.round(metrics.performanceRetention * 100)}%`;
                if (sizeElement) sizeElement.textContent = `${metrics.sizeReduction}x`;
                if (speedElement) speedElement.textContent = `${metrics.speedImprovement.toFixed(1)}x`;
                if (memoryElement) memoryElement.textContent = `${Math.round(metrics.memorySavings)}%`;

                // Update progress bars
                const performanceBar = document.getElementById('q15-performance-bar');
                const sizeBar = document.getElementById('q15-size-bar');
                const speedBar = document.getElementById('q15-speed-bar');
                const memoryBar = document.getElementById('q15-memory-bar');

                if (performanceBar) performanceBar.style.width = `${metrics.performanceRetention * 100}%`;
                if (sizeBar) sizeBar.style.width = `${Math.min(100, metrics.sizeReduction)}%`;
                if (speedBar) speedBar.style.width = `${Math.min(100, metrics.speedImprovement * 10)}%`;
                if (memoryBar) memoryBar.style.width = `${metrics.memorySavings}%`;

                // Update model comparison
                const teacherBar = document.getElementById('q15-teacher-bar');
                const studentBar = document.getElementById('q15-student-bar');
                const teacherSizeSpan = document.getElementById('q15-teacher-size');
                const studentSizeSpan = document.getElementById('q15-student-size');

                if (teacherBar) teacherBar.style.height = '100%';
                if (studentBar) studentBar.style.height = `${Math.max(5, 100 / metrics.sizeReduction)}%`;
                if (teacherSizeSpan) teacherSizeSpan.textContent = teacher.parameters;
                if (studentSizeSpan) {
                    const studentSize = metrics.studentParams >= 1 ? 
                        `${metrics.studentParams.toFixed(1)}B` : 
                        `${(metrics.studentParams * 1000).toFixed(0)}M`;
                    studentSizeSpan.textContent = studentSize;
                }

                // Update explanation
                const performanceLevel = metrics.performanceRetention >= 0.9 ? 'excellent' : 
                                       metrics.performanceRetention >= 0.8 ? 'good' : 
                                       metrics.performanceRetention >= 0.7 ? 'moderate' : 'poor';
                
                const trainingComplexity = config.trainingTime >= 2 ? 'high complexity' :
                                          config.trainingTime >= 1.5 ? 'moderate complexity' : 'low complexity';
                
                // Parameter analysis
                const tempAnalysis = temperature === 4 ? 'optimal' : 
                                   Math.abs(temperature - 4) <= 1 ? 'near-optimal' : 'suboptimal';
                const alphaAnalysis = Math.abs((alpha/10) - 0.7) <= 0.1 ? 'optimal' : 
                                    Math.abs((alpha/10) - 0.7) <= 0.2 ? 'acceptable' : 'suboptimal';
                
                explanation.innerHTML = `
                    <p><strong>${config.name} with ${teacher.name}:</strong></p>
                    <p class="mt-2">${config.explanation}</p>
                    <p class="mt-2"><strong>Performance Analysis:</strong> ${Math.round(metrics.performanceRetention * 100)}% retention with ${metrics.sizeReduction}x compression - 
                    this is ${performanceLevel} performance. Training complexity is ${trainingComplexity} (${config.trainingTime.toFixed(1)}x baseline time).</p>
                    <p class="mt-2"><strong>Parameter Settings:</strong> Temperature (${temperature}) is ${tempAnalysis}, 
                    Alpha (${(alpha/10).toFixed(1)}) is ${alphaAnalysis}. 
                    ${tempAnalysis === 'suboptimal' || alphaAnalysis === 'suboptimal' ? 'Consider adjusting parameters for better results.' : 'Parameters are well-tuned.'}</p>
                    <p class="mt-2"><strong>Teacher Model:</strong> ${teacher.name} (${teacher.parameters}) - ${teacher.architecture}. 
                    Strengths: ${teacher.strengths.join(', ')}. Compute requirement: ${teacher.computeRequirement}.</p>
                    <p class="mt-2"><strong>Deployment Benefits:</strong> ${metrics.speedImprovement.toFixed(1)}x faster inference, ${Math.round(metrics.memorySavings)}% memory savings. 
                    Best for: ${compression >= 50 ? 'mobile/IoT devices with severe constraints' : 
                               compression >= 20 ? 'edge computing and embedded systems' : 
                               compression >= 10 ? 'efficient cloud deployment' : 'high-performance applications with some optimization'}.</p>
                `;
            }

            // Example cycling
            function cycleExample() {
                const example = examples[currentExampleIndex];
                
                // Update controls
                teacherSelect.value = example.teacherIndex.toString();
                document.querySelector(`input[name="q15-strategy"][value="${example.strategy}"]`).checked = true;
                temperatureSlider.value = example.temperature.toString();
                alphaSlider.value = example.alpha.toString();
                compressionSlider.value = example.compression.toString();
                
                // Update button text
                exampleBtn.textContent = example.name;
                exampleBtn.title = example.description;
                
                // Update displays
                updateParameterDisplays();
                updateDisplay();
                
                // Next example
                currentExampleIndex = (currentExampleIndex + 1) % examples.length;
            }

            // Event listeners
            teacherSelect.addEventListener('change', updateDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', updateDisplay);
            });
            [temperatureSlider, alphaSlider, compressionSlider].forEach(slider => {
                slider.addEventListener('input', () => {
                    updateParameterDisplays();
                    updateDisplay();
                });
            });
            exampleBtn.addEventListener('click', cycleExample);

            // Initial setup
            updateParameterDisplays();
            updateDisplay();
        }
    }
};
