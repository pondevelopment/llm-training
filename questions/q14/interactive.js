const interactiveScript = () => {
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
                    explanation: "Adds small trainable modules while keeping base model frozen. Excellent retention with good efficiency since only a small portion of parameters are trained. Not sure what LoRA is? Jump to Question 4 for a short comparison of LoRA vs QLoRA and practical guidance."
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
            const rehearsalLabel = document.getElementById('q14-rehearsal-label');

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

            // Enable/disable the rehearsal ratio control based on strategy
            function setRehearsalRatioEnabled(enabled) {
                if (!rehearsalRatio) return;
                rehearsalRatio.disabled = !enabled;
                const container = rehearsalRatio.closest('div');
                if (container) {
                    container.classList.toggle('opacity-50', !enabled);
                    container.classList.toggle('pointer-events-none', !enabled);
                }
                if (rehearsalLabel) {
                    rehearsalLabel.textContent = enabled ? 'Old Data Ratio (%)' : 'Old Data Ratio (%) — Rehearsal only';
                    rehearsalLabel.title = enabled ? '' : 'This control only affects the Rehearsal strategy';
                }
            }

            // Update forgetting visualization
            function updateForgettingVisualization(strategy, scenario, ratio) {
                const steps = ['q14-step1', 'q14-step2', 'q14-step3', 'q14-step4', 'q14-step5', 'q14-step6', 'q14-step7', 'q14-step8', 'q14-final'];
                
                // Calculate forgetting curve based on strategy
                let forgettingRate;
                switch (strategy) {
                    case 'naive': forgettingRate = 0.08; break;
                    case 'rehearsal': forgettingRate = 0.04; break;
                    case 'ewc': forgettingRate = 0.03; break;
                    case 'lora': forgettingRate = 0.01; break;
                }
                // Old data ratio mitigates forgetting for rehearsal
                if (strategy === 'rehearsal' && typeof ratio === 'number') {
                    // Reduce forgetting linearly up to ~0.025 at 50% ratio
                    forgettingRate = Math.max(0.005, forgettingRate - (ratio * 0.0005));
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

                // Toggle availability of the rehearsal ratio slider
                setRehearsalRatioEnabled(strategy === 'rehearsal');

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
                updateForgettingVisualization(strategy, scenario, ratio);

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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question14Interactive = interactiveScript;
}
