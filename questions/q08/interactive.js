const interactiveScript = () => {
            // Stage management
            const stageRadios = document.querySelectorAll('input[name="q8-stage"]');
            const collectionPanel = document.getElementById('q8-collection-panel');
            const rewardPanel = document.getElementById('q8-reward-panel');
            const optimizePanel = document.getElementById('q8-optimize-panel');
            const explanation = document.getElementById('q8-explanation');
            // How it works elements
            const howToggle = document.getElementById('q8-how-toggle');
            const howBody = document.getElementById('q8-how-body');
            const tourBtn = document.getElementById('q8-tour-btn');
            
            // Common controls
            const exampleBtn = document.getElementById('q8-example-btn');
            const resetBtn = document.getElementById('q8-reset-btn');
            
            // Data collection elements
            const voteABtn = document.getElementById('q8-vote-a');
            const voteBBtn = document.getElementById('q8-vote-b');
            const voteResult = document.getElementById('q8-vote-result');
            const voteText = document.getElementById('q8-vote-text');
            const feedbackCount = document.getElementById('q8-feedback-count');
            const feedbackProgress = document.getElementById('q8-feedback-progress');
            
            // Debug: Check if vote buttons exist
            if (!voteABtn) console.error('q8-vote-a button not found');
            if (!voteBBtn) console.error('q8-vote-b button not found');
            
            // Notification system
            function showNotification(message, type = 'info', duration = 4000) {
                const notificationsContainer = document.getElementById('q8-notifications');
                if (!notificationsContainer) return;
                
                const notification = document.createElement('div');
                const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
                                type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
                                type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                                'bg-blue-100 border-blue-400 text-blue-700';
                
                notification.className = `${bgColor} border-2 p-6 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out opacity-0 scale-95`;
                notification.innerHTML = `
                    <div class="flex items-center justify-between min-w-0">
                        <div class="flex items-center min-w-0">
                            <span class="text-2xl mr-3 flex-shrink-0">${type === 'success' ? '🎉' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}</span>
                            <span class="text-base font-semibold text-center">${message}</span>
                        </div>
                        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                `;
                
                notificationsContainer.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.classList.remove('opacity-0', 'scale-95');
                }, 100);
                
                // Auto remove after duration
                setTimeout(() => {
                    notification.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }

            // Simple guided tour using notifications and stage switches
            function startGuidedTour() {
                // Ensure we start at Stage 1
                document.querySelector('input[name="q8-stage"][value="collection"]').checked = true;
                switchStage('collection');
                // Step 1
                showNotification('Step 1: Compare Response A vs B and click “Prefer This” (5 times).', 'info', 4500);
                setTimeout(() => {
                    showNotification('Watch the progress: 0/5 → 5/5. We’ll auto-move to Reward Model when ready.', 'info', 4500);
                }, 1600);
                // Step 2
                setTimeout(() => {
                    document.querySelector('input[name="q8-stage"][value="reward"]').checked = true;
                    switchStage('reward');
                    showNotification('Step 2: Click “Train Reward Model” to simulate learning a preference predictor.', 'info', 5000);
                }, 3600);
                // Step 3
                setTimeout(() => {
                    document.querySelector('input[name="q8-stage"][value="optimize"]').checked = true;
                    switchStage('optimize');
                    showNotification('Step 3: Run PPO training, then Evaluate to see the alignment score.', 'info', 5000);
                }, 6200);
                // Tip
                setTimeout(() => {
                    showNotification('Tip: Use “Try Training Examples” to preload a scenario, or “Reset Progress” to start over.', 'success', 6000);
                }, 9000);
            }
            
            // Dynamic example elements
            const currentPrompt = document.getElementById('q8-current-prompt');
            const responseA = document.getElementById('q8-response-a');
            const responseB = document.getElementById('q8-response-b');
            const styleA = document.getElementById('q8-response-a-style');
            const styleB = document.getElementById('q8-response-b-style');
            const descA = document.getElementById('q8-response-a-meta');
            const descB = document.getElementById('q8-response-b-meta');
            const exampleCounter = document.getElementById('q8-example-counter');
            
            // Reward model elements
            const trainRewardBtn = document.getElementById('q8-train-reward');
            const trainingPairs = document.getElementById('q8-training-pairs');
            const qualityData = document.getElementById('q8-quality-data');
            const modelAccuracy = document.getElementById('q8-model-accuracy');
            const rewardStatus = document.getElementById('q8-reward-status');
            
            // RL optimization elements
            const runPPOBtn = document.getElementById('q8-run-ppo');
            const evaluateBtn = document.getElementById('q8-evaluate');
            const episodes = document.getElementById('q8-episodes');
            const avgReward = document.getElementById('q8-avg-reward');
            const helpfulness = document.getElementById('q8-helpfulness');
            const safety = document.getElementById('q8-safety');
            const coherence = document.getElementById('q8-coherence');
            const preference = document.getElementById('q8-preference');
            const alignment = document.getElementById('q8-alignment');
            const robustness = document.getElementById('q8-robustness');
            const trainingStatus = document.getElementById('q8-rl-status');
            
            // Progress tracking
            const overallProgress = document.getElementById('q8-overall-progress');
            const stage1Status = document.getElementById('q8-stage1-status');
            const stage2Status = document.getElementById('q8-stage2-status');
            const stage3Status = document.getElementById('q8-stage3-status');
            const stage1Icon = document.getElementById('q8-stage1-icon');
            const stage2Icon = document.getElementById('q8-stage2-icon');
            const stage3Icon = document.getElementById('q8-stage3-icon');
            // Help toggles
            const policyHelpBtn = document.getElementById('q8-policy-help');
            const policyHelpBody = document.getElementById('q8-policy-help-body');
            const perfHelpBtn = document.getElementById('q8-performance-help');
            const perfHelpBody = document.getElementById('q8-performance-help-body');
            const alignHelpBtn = document.getElementById('q8-alignment-help');
            const alignHelpBody = document.getElementById('q8-alignment-help-body');

            let currentStage = 'collection';
            let gameState = {
                feedbackCollected: 0,
                rewardModelTrained: false,
                rewardModelTraining: false,
                rlTrainingStarted: false,
                rlTrainingCompleted: false,
                performance: {
                    helpfulness: 65,
                    safety: 78,
                    coherence: 82,
                    preference: 71,
                    alignment: 68,
                    robustness: 75
                },
                episodes: 0,
                avgReward: 0.0
            };

            // Example scenarios for different stages - 5 unique training examples
            const examples = [
                {
                    stage: 'collection',
                    prompt: "Write a poem about artificial intelligence",
                    responseA: {
                        text: "AI is smart and cool,<br>It helps us every day,<br>Technology is great,<br>Hip hip hooray!",
                        description: "Basic rhyme scheme, simple vocabulary",
                        style: "Simple & Direct"
                    },
                    responseB: {
                        text: "Silicon dreams awaken,<br>Neural networks weave thoughts,<br>Human wisdom guides<br>Digital consciousness forth.",
                        description: "Haiku-like structure, metaphorical language",
                        style: "Creative & Poetic"
                    }
                },
                {
                    stage: 'collection',
                    prompt: "Explain machine learning in simple terms",
                    responseA: {
                        text: "Machine learning is when computers learn from data to make predictions or decisions without being explicitly programmed for each task.",
                        description: "Clear, technical definition",
                        style: "Educational & Precise"
                    },
                    responseB: {
                        text: "Think of machine learning like teaching a child to recognize animals. You show them lots of pictures of cats and dogs, and eventually they learn to tell them apart on their own!",
                        description: "Uses analogy and everyday language",
                        style: "Accessible & Relatable"
                    }
                },
                {
                    stage: 'collection',
                    prompt: "Help me write a professional email declining a job offer",
                    responseA: {
                        text: "Thanks for the offer. I have decided to decline. Best regards, [Name]",
                        description: "Very brief, minimal politeness",
                        style: "Minimal & Blunt"
                    },
                    responseB: {
                        text: "Dear [Hiring Manager],<br><br>Thank you for offering me the [Position] role. After careful consideration, I must respectfully decline. I truly appreciate the time and effort you invested in the interview process.<br><br>Best wishes for finding the right candidate.<br><br>Sincerely, [Name]",
                        description: "Detailed, courteous, professional tone",
                        style: "Professional & Thoughtful"
                    }
                },
                {
                    stage: 'collection',
                    prompt: "What should I do if I'm feeling stressed at work?",
                    responseA: {
                        text: "Take deep breaths, organize your tasks, and talk to your manager about workload concerns. Consider stress management techniques like meditation.",
                        description: "Practical, actionable advice",
                        style: "Solution-Focused"
                    },
                    responseB: {
                        text: "I understand work stress can be overwhelming. Remember that your wellbeing matters most. Try taking short breaks, prioritizing tasks, and don't hesitate to seek support from colleagues or a mental health professional if needed.",
                        description: "Empathetic, holistic approach",
                        style: "Supportive & Caring"
                    }
                },
                {
                    stage: 'collection',
                    prompt: "Write code to reverse a string in Python",
                    responseA: {
                        text: "def reverse_string(s):<br>&nbsp;&nbsp;&nbsp;&nbsp;return s[::-1]<br><br>text = 'hello'<br>print(reverse_string(text))",
                        description: "Concise, uses Python idioms",
                        style: "Pythonic & Elegant"
                    },
                    responseB: {
                        text: "def reverse_string(s):<br>&nbsp;&nbsp;&nbsp;&nbsp;# Create empty string to store result<br>&nbsp;&nbsp;&nbsp;&nbsp;result = ''<br>&nbsp;&nbsp;&nbsp;&nbsp;# Loop through string backwards<br>&nbsp;&nbsp;&nbsp;&nbsp;for i in range(len(s)-1, -1, -1):<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result += s[i]<br>&nbsp;&nbsp;&nbsp;&nbsp;return result<br><br>text = 'hello'<br>reversed_text = reverse_string(text)<br>print(f'Original: {text}')<br>print(f'Reversed: {reversed_text}')",
                        description: "Verbose, educational with comments",
                        style: "Detailed & Educational"
                    }
                }
            ];

            let exampleIndex = 1; // Start at 1 so that exampleIndex - 1 = 0 for first example

            // Stage switching
            function switchStage(stage) {
                currentStage = stage;
                
                // Hide all panels
                collectionPanel.classList.add('hidden');
                rewardPanel.classList.add('hidden');
                optimizePanel.classList.add('hidden');
                
                // Show selected panel and update explanation
                switch(stage) {
                    case 'collection':
                        collectionPanel.classList.remove('hidden');
                        explanation.textContent = "In this stage, human annotators compare model outputs and provide feedback on which responses they prefer. This creates the training data for the reward model.";
                        overallProgress.textContent = "Stage 1/3";
                        break;
                    case 'reward':
                        rewardPanel.classList.remove('hidden');
                        explanation.textContent = "The reward model learns to predict human preferences from the collected feedback data. It assigns scores to outputs based on quality, helpfulness, and alignment.";
                        overallProgress.textContent = "Stage 2/3";
                        break;
                    case 'optimize':
                        optimizePanel.classList.remove('hidden');
                        explanation.textContent = "Using PPO (Proximal Policy Optimization), the language model is fine-tuned to maximize the reward model's scores while maintaining its original capabilities.";
                        overallProgress.textContent = "Stage 3/3";
                        break;
                }
                
                updateStageStatus();
            }

            const stageDefaults = {
                collection: stage1Status?.textContent?.trim() || 'Awaiting comparisons',
                reward: stage2Status?.textContent?.trim() || 'Training pending',
                optimize: stage3Status?.textContent?.trim() || 'Not started'
            };

            function setStageState(statusEl, iconEl, state, text) {
                if (statusEl) {
                    statusEl.textContent = text;
                    statusEl.dataset.state = state;
                }
                if (iconEl) {
                    iconEl.dataset.state = state;
                }
            }

            // Update stage progress indicators
            function updateStageStatus() {
                setStageState(stage1Status, stage1Icon, 'idle', stageDefaults.collection);
                setStageState(stage2Status, stage2Icon, 'idle', stageDefaults.reward);
                setStageState(stage3Status, stage3Icon, 'idle', stageDefaults.optimize);

                if (gameState.feedbackCollected >= 5) {
                    setStageState(stage1Status, stage1Icon, 'done', 'Complete');
                } else if (gameState.feedbackCollected > 0 || currentStage === 'collection') {
                    const label = gameState.feedbackCollected > 0 ? 'Collecting comparisons' : 'Collect feedback';
                    setStageState(stage1Status, stage1Icon, 'progress', label);
                }

                if (gameState.rewardModelTrained) {
                    setStageState(stage2Status, stage2Icon, 'done', 'Complete');
                } else if (gameState.rewardModelTraining) {
                    setStageState(stage2Status, stage2Icon, 'progress', 'Training reward model');
                } else if (gameState.feedbackCollected >= 5) {
                    setStageState(stage2Status, stage2Icon, 'ready', 'Ready to train');
                } else if (currentStage === 'reward') {
                    setStageState(stage2Status, stage2Icon, 'idle', 'Needs feedback first');
                }

                if (gameState.rlTrainingCompleted) {
                    setStageState(stage3Status, stage3Icon, 'done', 'Complete');
                } else if (gameState.rlTrainingStarted) {
                    setStageState(stage3Status, stage3Icon, 'progress', 'Optimizing with PPO');
                } else if (gameState.rewardModelTrained) {
                    setStageState(stage3Status, stage3Icon, 'ready', 'Ready for PPO');
                } else if (gameState.rewardModelTraining) {
                    setStageState(stage3Status, stage3Icon, 'idle', 'Reward model in training');
                } else if (currentStage === 'optimize') {
                    setStageState(stage3Status, stage3Icon, 'idle', 'Train reward model first');
                }
            }

            // Data collection functionality
            function collectFeedback(choice) {
                // Get current example index based on feedback collected (0-indexed)
                const currentExampleIndex = gameState.feedbackCollected % examples.length;
                const currentExample = examples[currentExampleIndex];
                
                gameState.feedbackCollected = Math.min(5, gameState.feedbackCollected + 1);
                
                let choiceText;
                if (currentExample && currentExample.responseA && currentExample.responseB) {
                    const choiceStyle = choice === 'A' ? currentExample.responseA.style : currentExample.responseB.style;
                    choiceText = choice === 'A' ? 
                        `Response A preferred (${choiceStyle.toLowerCase()})` : 
                        `Response B preferred (${choiceStyle.toLowerCase()})`;
                } else {
                    // Fallback if example data is missing
                    choiceText = choice === 'A' ? 
                        'Response A preferred' : 
                        'Response B preferred';
                }
                
                voteText.textContent = choiceText;
                voteResult.classList.remove('hidden');
                
                feedbackCount.textContent = `${gameState.feedbackCollected} / 5 comparisons`;
                feedbackProgress.style.width = (gameState.feedbackCollected / 5 * 100) + '%';
                
                // Update feedback step counter to show current progress
                exampleCounter.textContent = `${gameState.feedbackCollected} of 5`;
                
                // Show next example if more feedback is needed
                if (gameState.feedbackCollected < 5) {
                    // Capture next step and index now to avoid drift if user clicks quickly
                    const scheduledStep = Math.min(5, gameState.feedbackCollected + 1);
                    const nextExampleIndex = (currentExampleIndex + 1) % examples.length;
                    setTimeout(() => {
                        updateExampleDisplay(nextExampleIndex, scheduledStep);
                    }, 250); // Brief pause so the feedback message is readable
                }
                
                // Auto-advance when enough feedback is collected
                if (gameState.feedbackCollected >= 5 && !gameState.rewardModelTrained) {
                    setTimeout(() => {
                        showNotification('Sufficient feedback collected! Moving to reward model training.', 'success');
                        setTimeout(() => {
                            document.querySelector('input[name="q8-stage"][value="reward"]').checked = true;
                            switchStage('reward');
                        }, 1500);
                    }, 1000);
                }
                
                updateStageStatus();
                
                // Hide result after enough time to read it
                setTimeout(() => {
                    voteResult.classList.add('hidden');
                }, 6000);
            }

            // Reward model training
            function trainRewardModel() {
                if (gameState.feedbackCollected < 5) {
                    showNotification('Need more feedback data before training reward model!', 'warning');
                    return;
                }
                
                gameState.rewardModelTraining = true;
                rewardStatus.textContent = 'Training reward model...';
                trainRewardBtn.disabled = true;
                
                updateStageStatus();
                
                // Simulate training progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    trainingPairs.textContent = Math.floor(gameState.feedbackCollected * 0.8);
                    qualityData.textContent = Math.floor(gameState.feedbackCollected * 0.6);
                    modelAccuracy.textContent = Math.min(95, 60 + progress) + '%';
                    
                    if (progress >= 30) {
                        clearInterval(interval);
                        gameState.rewardModelTraining = false;
                        gameState.rewardModelTrained = true;
                        rewardStatus.textContent = '✅ Reward model training complete!';
                        trainRewardBtn.textContent = '✅ Model Trained';

                        updateStageStatus();
                        
                        setTimeout(() => {
                            showNotification('Reward model ready! Moving to RL optimization.', 'success');
                            setTimeout(() => {
                                document.querySelector('input[name="q8-stage"][value="optimize"]').checked = true;
                                switchStage('optimize');
                            }, 1500);
                        }, 1500);
                    }
                }, 500);
            }

            // RL optimization
            function runPPOTraining() {
                if (!gameState.rewardModelTrained) {
                    showNotification('Need trained reward model before starting RL optimization!', 'warning');
                    return;
                }
                
                gameState.rlTrainingStarted = true;
                trainingStatus.textContent = 'Running PPO training...';
                runPPOBtn.disabled = true;
                
                // Simulate training progress
                const interval = setInterval(() => {
                    gameState.episodes += 1;
                    gameState.avgReward = Math.min(0.95, gameState.avgReward + 0.02 + Math.random() * 0.01);
                    
                    episodes.textContent = gameState.episodes;
                    avgReward.textContent = gameState.avgReward.toFixed(3);
                    
                    // Gradually improve performance metrics
                    if (gameState.episodes % 3 === 0) {
                        gameState.performance.helpfulness = Math.min(95, gameState.performance.helpfulness + 1);
                        gameState.performance.safety = Math.min(98, gameState.performance.safety + 0.5);
                        gameState.performance.coherence = Math.min(94, gameState.performance.coherence + 0.8);
                        gameState.performance.preference = Math.min(92, gameState.performance.preference + 1.2);
                        gameState.performance.alignment = Math.min(89, gameState.performance.alignment + 1.5);
                        gameState.performance.robustness = Math.min(88, gameState.performance.robustness + 0.9);
                        
                        updatePerformanceMetrics();
                    }
                    
                    if (gameState.episodes >= 25) {
                        clearInterval(interval);
                        gameState.rlTrainingCompleted = true;
                        trainingStatus.textContent = '✅ PPO training complete! Model is now aligned.';
                        runPPOBtn.textContent = '✅ Training Complete';
                        updateStageStatus(); // Update status to show completion
                    }
                }, 200);
                
                updateStageStatus();
            }

            // Update performance metrics display
            function updatePerformanceMetrics() {
                helpfulness.textContent = Math.round(gameState.performance.helpfulness) + '%';
                safety.textContent = Math.round(gameState.performance.safety) + '%';
                coherence.textContent = Math.round(gameState.performance.coherence) + '%';
                preference.textContent = Math.round(gameState.performance.preference) + '%';
                alignment.textContent = Math.round(gameState.performance.alignment) + '%';
                robustness.textContent = Math.round(gameState.performance.robustness) + '%';
            }

            // Evaluate model
            function evaluateModel() {
                if (!gameState.rlTrainingStarted) {
                    showNotification('Start RL training first!', 'warning');
                    return;
                }
                
                const avgScore = Object.values(gameState.performance).reduce((a, b) => a + b, 0) / Object.keys(gameState.performance).length;
                
                const resultMessage = `Model Evaluation Complete! Overall Alignment Score: ${avgScore.toFixed(1)}% - ` +
                    `${avgScore >= 85 ? 'Excellent alignment achieved! 🎉 Training complete.' : 
                      avgScore >= 75 ? 'Good alignment achieved! Model is ready for deployment.' : 
                      'Model shows improvement but may benefit from additional training.'}`;
                
                const resultType = avgScore >= 85 ? 'success' : avgScore >= 75 ? 'success' : 'warning';
                showNotification(resultMessage, resultType, 6000);
            }

            // Update example display - now shows different examples for each feedback step
            function updateExampleDisplay(exampleIndex, feedbackStep) {
                const example = examples[exampleIndex];
                if (example && example.prompt) {
                    currentPrompt.textContent = `"${example.prompt}"`;
                    responseA.innerHTML = example.responseA.text;
                    responseB.innerHTML = example.responseB.text;
                    if (styleA) styleA.textContent = example.responseA.style;
                    if (styleB) styleB.textContent = example.responseB.style;
                    if (descA) descA.textContent = example.responseA.description;
                    if (descB) descB.textContent = example.responseB.description;
                    // Show current feedback step (clamped to 5)
                    const safeStep = Math.min(5, Math.max(1, feedbackStep || 1));
                    exampleCounter.textContent = `${safeStep} of 5`;
                }
            }

            // Load examples - start with first example
            function loadExamples() {
                // Start with the first example (index 0) for step 1
                updateExampleDisplay(0, 1);
                
                // Switch to the collection stage
                document.querySelector('input[name="q8-stage"][value="collection"]').checked = true;
                switchStage('collection');
                
                // Auto-collect feedback to simulate training
                setTimeout(() => {
                    if (gameState.feedbackCollected < 5) {
                        // Randomly prefer A or B to show variety
                        const choice = Math.random() > 0.6 ? 'B' : 'A';
                        collectFeedback(choice);
                    }
                }, 1000);
            }

            // Reset progress
            function resetProgress() {
                gameState = {
                    feedbackCollected: 0,
                    rewardModelTrained: false,
                    rewardModelTraining: false,
                    rlTrainingStarted: false,
                    rlTrainingCompleted: false,
                    performance: {
                        helpfulness: 65,
                        safety: 78,
                        coherence: 82,
                        preference: 71,
                        alignment: 68,
                        robustness: 75
                    },
                    episodes: 0,
                    avgReward: 0.0
                };
                
                // Reset UI elements
                feedbackCount.textContent = '0 / 5 comparisons';
                feedbackProgress.style.width = '0%';
                exampleCounter.textContent = '1 of 5'; // Reset feedback step counter
                trainingPairs.textContent = '0';
                qualityData.textContent = '0';
                modelAccuracy.textContent = '0%';
                episodes.textContent = '0';
                avgReward.textContent = '0.00';
                
                // Reset buttons
                trainRewardBtn.disabled = false;
                trainRewardBtn.textContent = '🧠 Train Reward Model';
                runPPOBtn.disabled = false;
                runPPOBtn.textContent = '🚀 Run PPO Training';
                
                // Reset status messages
                rewardStatus.textContent = 'Click to start reward-model training.';
                trainingStatus.textContent = 'Run PPO training to update the metrics.';
                
                updatePerformanceMetrics();
                updateStageStatus();
                
                // Switch back to collection stage
                document.querySelector('input[name="q8-stage"][value="collection"]').checked = true;
                switchStage('collection');
            }

            // Event listeners
            stageRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const label = e.target.closest('label');
                    // Update visual selection
                    document.querySelectorAll('input[name="q8-stage"] + div').forEach(div => {
                        div.className = div.className.replace('border-blue-400 bg-blue-50', 'border-gray-200');
                        div.className = div.className.replace('border-green-400 bg-green-50', 'border-green-200');
                        div.className = div.className.replace('border-purple-400 bg-purple-50', 'border-purple-200');
                        div.className = div.className.replace('border-orange-400 bg-orange-50', 'border-orange-200');
                    });
                    
                    // Highlight selected
                    const targetClass = e.target.value === 'collection' ? 'border-green-400 bg-green-50' :
                                       e.target.value === 'reward' ? 'border-purple-400 bg-purple-50' :
                                       'border-orange-400 bg-orange-50';
                    label.querySelector('div').className = label.querySelector('div').className.replace(/border-\w+-200/, targetClass);
                    
                    switchStage(e.target.value);
                });
            });
            // How it works interactions
            howToggle?.addEventListener('click', () => {
                if (!howBody) return;
                const isHidden = howBody.classList.toggle('hidden');
                if (howToggle) howToggle.setAttribute('aria-expanded', (!isHidden).toString());
                if (howToggle) howToggle.textContent = isHidden ? 'Show' : 'Hide';
            });
            tourBtn?.addEventListener('click', startGuidedTour);
            // Toggle definitions in RL Optimization boxes
            policyHelpBtn?.addEventListener('click', () => policyHelpBody?.classList.toggle('hidden'));
            perfHelpBtn?.addEventListener('click', () => perfHelpBody?.classList.toggle('hidden'));
            alignHelpBtn?.addEventListener('click', () => alignHelpBody?.classList.toggle('hidden'));
            
            // Initialize after a small delay to ensure DOM is ready
            setTimeout(() => {
                // Re-query DOM elements to ensure they exist
                const voteABtn = document.getElementById('q8-vote-a');
                const voteBBtn = document.getElementById('q8-vote-b');
                const trainRewardBtn = document.getElementById('q8-train-reward');
                const runPPOBtn = document.getElementById('q8-run-ppo');
                const evaluateBtn = document.getElementById('q8-evaluate');
                const exampleBtn = document.getElementById('q8-example-btn');
                const resetBtn = document.getElementById('q8-reset-btn');
                
                // Attach event listeners
                if (voteABtn) {
                    voteABtn.addEventListener('click', () => {
                        collectFeedback('A');
                    });
                }
                if (voteBBtn) {
                    voteBBtn.addEventListener('click', () => {
                        collectFeedback('B');
                    });
                }
                trainRewardBtn?.addEventListener('click', trainRewardModel);
                runPPOBtn?.addEventListener('click', runPPOTraining);
                evaluateBtn?.addEventListener('click', evaluateModel);
                exampleBtn?.addEventListener('click', loadExamples);
                resetBtn?.addEventListener('click', resetProgress);

                // Initialize
                switchStage('collection');
                updatePerformanceMetrics();
                updateExampleDisplay(0, 1); // Show first example, step 1 of 5
            }, 100);
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question08Interactive = interactiveScript;
}

