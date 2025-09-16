const interactiveScript = () => {
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
                },
                gpt5: {
                    name: 'GPT-5 (2025)',
                    color: 'blue',
                    capabilities: {
                        text: 'Excellent+',
                        visual: 'Advanced',
                        reasoning: 'Stronger (fast or deep)',
                        context: 'Router-managed',
                        accuracy: '90%+',
                        speed: 'Adaptive'
                    },
                    limitations: ['Router may switch behavior', 'Tone can feel conservative', 'Legacy model picker reduced']
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
                    },
                    gpt5: {
                        quality: 'Excellent+',
                        output: 'Maintains strong narrative coherence while adapting style quickly; faster for short pieces and can switch to deeper planning for long-form.',
                        score: 92,
                        strengths: ['Adaptive speed/depth', 'Consistent long-form structure', 'Fewer hallucinations'],
                        weaknesses: ['Tone may feel cautious for edgy styles']
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
                    },
                    gpt5: {
                        quality: 'Excellent+',
                        output: 'Balances speed and depth using routing; robust cross-referencing with fewer misses and clearer citations when uncertain.',
                        score: 96,
                        strengths: ['Adaptive depth', 'Fewer hallucinations', 'Clearer uncertainty handling'],
                        weaknesses: ['May switch styles mid-session due to routing']
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
                    },
                    gpt5: {
                        quality: 'Advanced+',
                        output: 'Generates robust, testable code; better tool usage and refactoring suggestions; quicker fixes with fewer regressions.',
                        score: 92,
                        strengths: ['Refactoring suggestions', 'Test awareness', 'Faster iteration', 'Stronger reasoning'],
                        weaknesses: ['Occasional conservative choices']
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
                    },
                    gpt5: {
                        quality: 'Stronger',
                        output: 'Toggles between quick answers and deeper chain-of-thought style reasoning at inference time; fewer arithmetic slips.',
                        score: 88,
                        strengths: ['Deeper reasoning on demand', 'Fewer calculation errors'],
                        weaknesses: ['Can be slower when using deep mode']
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
                    },
                    gpt5: {
                        quality: 'Excellent',
                        output: 'Stable multimodal analysis with faster responses for simple tasks and deeper inspection when requested.',
                        score: 92,
                        strengths: ['Adaptive analysis depth', 'Faster simple reads', 'Strong OCR and object reasoning'],
                        weaknesses: ['Occasional conservative interpretations']
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
                    },
                    gpt5: {
                        quality: 'Consistent+',
                        output: 'Maintains context across long sessions with clearer uncertainty handling; balances speed and depth via routing.',
                        score: 93,
                        strengths: ['Stable persona', 'Better uncertainty handling', 'Adaptive speed'],
                        weaknesses: ['May feel less “warm” by default']
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
                    },
                    gpt5: {
                        quality: 'Even More Reliable',
                        output: 'Lower hallucination rates and more helpful safe completions; clearer citations or caveats when the answer is uncertain.',
                        score: 90,
                        strengths: ['Fewer hallucinations', 'Safer outputs', 'Clearer citations/caveats'],
                        weaknesses: ['May avoid edgy/creative risks']
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
                    },
                    gpt5: {
                        quality: 'Stronger',
                        output: 'Uses deeper thinking mode when needed to plan multi-step solutions; more robust logical consistency on complex tasks.',
                        score: 90,
                        strengths: ['Deeper planning', 'More robust logic', 'Adaptive compute'],
                        weaknesses: ['Deep mode can increase latency']
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
                        } else if (radio.value === 'gpt4') {
                            container.classList.add('ring-2', 'ring-green-500', 'bg-green-50');
                        } else if (radio.value === 'gpt5') {
                            container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                        }
                        container.classList.remove('border-gray-200');
                    } else {
                        container.classList.remove('ring-2', 'ring-orange-500', 'ring-green-500', 'ring-blue-500', 'bg-orange-50', 'bg-green-50', 'bg-blue-50');
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
                const color = modelData[model]?.color || 'gray';
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
                const currentData = scenarioData[model];
                // Choose comparison target
                let compareModel = 'gpt4';
                if (model === 'gpt3') compareModel = 'gpt4';
                if (model === 'gpt4') compareModel = 'gpt3';
                if (model === 'gpt5') compareModel = 'gpt4';
                const comparisonData = scenarioData[compareModel];
                
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
                    `,
                    gpt5: `
                        <strong>💠 GPT-5 Performance on ${scenarioData.name}:</strong>
                        <br><br>• <strong>Current Score:</strong> ${currentData.score}/100 vs GPT-4's ${comparisonData.score}/100
                        <br>• <strong>What’s New:</strong> Router balances fast replies with deeper thinking for tougher parts
                        <br>• <strong>Key Advantage:</strong> ${currentData.strengths[0]}
                        <br>• <strong>Trade-off:</strong> ${currentData.weaknesses[0] || 'Occasionally higher latency in deep mode'}
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
                },
                { 
                    scenario: 'reasoning', 
                    model: 'gpt5',
                    note: 'Show deeper thinking mode via routing' 
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question20Interactive = interactiveScript;
}
