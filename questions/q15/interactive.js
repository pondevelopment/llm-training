const interactiveScript = () => {
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
                    chipClass: "chip chip-success",
                    accent: "alignment",
                    performanceRetention: 0.88,
                    efficiencyGain: 1.0,
                    trainingTime: 1.0,
                    explanation: "Uses soft probability distributions from the teacher to train the student. Good balance between performance retention and training simplicity."
                },
                progressive: {
                    name: "Progressive Distillation",
                    chipClass: "chip chip-info",
                    accent: "training",
                    performanceRetention: 0.94,
                    efficiencyGain: 0.7,
                    trainingTime: 2.5,
                    explanation: "Reduces model size gradually through multiple generations. Highest performance retention but significantly more training time and complexity."
                },
                "task-specific": {
                    name: "Task-Specific Distillation",
                    chipClass: "chip chip-accent",
                    accent: "generation",
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
            const strategyOptions = Array.from(strategyRadios, radio => radio.closest('.q15-strategy-option'));
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
                    strategyIndicator.className = `${config.chipClass} text-xs`;
                }

                strategyOptions.forEach(option => {
                    if (!option) return;
                    const input = option.querySelector('input[name="q15-strategy"]');
                    const optionConfig = strategyConfig[input?.value];
                    option.classList.toggle('panel-emphasis', input?.value === strategy);
                    if (input?.value === strategy && optionConfig?.accent) {
                        option.setAttribute('data-accent', optionConfig.accent);
                    } else {
                        option.removeAttribute('data-accent');
                    }
                });

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
                const studentMeter = document.getElementById('q15-student-meter');
                const teacherSizeSpan = document.getElementById('q15-teacher-size');
                const studentSizeSpan = document.getElementById('q15-student-size');
                const sizeRatioChip = document.getElementById('q15-size-ratio');
                const studentNote = document.getElementById('q15-student-note');

                if (studentMeter) {
                    const width = Math.max(4, Math.min(100, 100 / metrics.sizeReduction));
                    studentMeter.style.width = `${width}%`;
                }
                if (teacherSizeSpan) teacherSizeSpan.textContent = teacher.parameters;
                if (studentSizeSpan) {
                    const studentSize = metrics.studentParams >= 1 ? 
                        `${metrics.studentParams.toFixed(1)}B` : 
                        `${(metrics.studentParams * 1000).toFixed(0)}M`;
                    studentSizeSpan.textContent = studentSize;
                }

                const ratioText = `${metrics.sizeReduction}x smaller`;
                if (sizeRatioChip) sizeRatioChip.textContent = ratioText;
                if (studentNote) {
                    const reductionPct = Math.min(99, Math.round((1 - (1 / metrics.sizeReduction)) * 100));
                    studentNote.textContent = `${ratioText} · ${reductionPct}% reduction`;
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question15Interactive = interactiveScript;
}
