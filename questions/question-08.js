// Question 8: Reinforcement Learning from Human Feedback (RLHF)
// Created: July 8, 2025
// Educational Focus: Understanding RLHF process, reward models, and alignment techniques for LLMs

const question = {
    title: "8. What is RLHF and how does it improve LLM alignment with human preferences?",
    answer: `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🤝 What is RLHF?</h4>
            <p class="text-blue-800">Reinforcement Learning from Human Feedback (RLHF) is a training technique that aligns LLMs with human preferences and values. Think of it as teaching an AI to not just generate technically correct text, but text that humans actually find helpful, harmless, and honest. It's the secret sauce behind ChatGPT's conversational abilities.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">📝 Step 1: Data Collection</h5>
                <p class="text-sm text-green-700 mb-2">Collect human feedback on model outputs</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Ranking:</strong> Humans rank multiple responses</div>
                    <div>✅ <strong>Comparison:</strong> A vs B preference data</div>
                    <div>✅ <strong>Quality:</strong> Direct quality assessments</div>
                    <div>🔄 <strong>Scale:</strong> Thousands of comparisons needed</div>
                </div>
                <code class="text-xs bg-green-100 px-1 rounded mt-2 block">Human annotators rate outputs</code>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🧠 Step 2: Reward Model</h5>
                <p class="text-sm text-purple-700 mb-2">Train a model to predict human preferences</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Learning:</strong> Predicts which response humans prefer</div>
                    <div>✅ <strong>Scoring:</strong> Assigns reward scores to outputs</div>
                    <div>✅ <strong>Generalizing:</strong> Works on unseen examples</div>
                    <div>🔄 <strong>Proxy:</strong> Approximates human judgment</div>
                </div>
                <code class="text-xs bg-purple-100 px-1 rounded mt-2 block">Neural network reward predictor</code>
            </div>
            
            <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">🎯 Step 3: RL Optimization</h5>
                <p class="text-sm text-orange-700 mb-2">Fine-tune LLM using reinforcement learning</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>PPO:</strong> Proximal Policy Optimization</div>
                    <div>✅ <strong>Rewards:</strong> Higher scores for preferred outputs</div>
                    <div>✅ <strong>Balance:</strong> Maintain original capabilities</div>
                    <div>🔄 <strong>Iterative:</strong> Continuous improvement cycle</div>
                </div>
                <code class="text-xs bg-orange-100 px-1 rounded mt-2 block">Policy gradient optimization</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why RLHF Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Alignment:</strong> Ensures AI systems behave according to human values and preferences</li>
                <li>• <strong>Safety:</strong> Reduces harmful, biased, or inappropriate outputs through human guidance</li>
                <li>• <strong>Usefulness:</strong> Makes LLMs more helpful and relevant for real-world applications</li>
                <li>• <strong>Commercial Success:</strong> Powers ChatGPT, Claude, and other leading conversational AI systems</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🤝 Interactive RLHF Training Simulator",
        html: `<div class="space-y-6">
            <!-- In-site notifications container -->
            <div id="q8-notifications" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 space-y-2 max-w-md"></div>
            
            <!-- Training Stage Selection -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">🔄 Select RLHF Training Stage</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="cursor-pointer">
                        <input type="radio" name="q8-stage" value="collection" class="sr-only" checked>
                        <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-colors">
                            <div class="font-medium text-green-900">Data Collection</div>
                            <div class="text-xs text-green-700">Gather human preferences</div>
                            <div class="text-xs text-green-600 mt-1">Step 1: Feedback</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q8-stage" value="reward" class="sr-only">
                        <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div class="font-medium text-purple-900">Reward Modeling</div>
                            <div class="text-xs text-purple-700">Train preference predictor</div>
                            <div class="text-xs text-purple-600 mt-1">Step 2: Learn rewards</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q8-stage" value="optimize" class="sr-only">
                        <div class="border-2 border-orange-200 rounded-lg p-3 hover:border-orange-400 hover:bg-orange-50 transition-colors">
                            <div class="font-medium text-orange-900">RL Optimization</div>
                            <div class="text-xs text-orange-700">Fine-tune with PPO</div>
                            <div class="text-xs text-orange-600 mt-1">Step 3: Optimize policy</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">💡 Quick Scenarios:</span>
                <button id="q8-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try Training Examples</button>
                <button id="q8-reset-btn" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors">🔄 Reset Progress</button>
            </div>
            
            <!-- Data Collection Stage -->
            <div id="q8-collection-panel" class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">📝 Human Feedback Collection</h4>
                <div class="space-y-4">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-gray-700 mb-2">Prompt: <span id="q8-current-prompt">"Write a poem about artificial intelligence"</span></p>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h6 class="font-medium text-blue-900 mb-2">Response A <span id="q8-style-a" class="text-xs text-blue-600">(Simple & Direct)</span></h6>
                                <div class="bg-white p-2 rounded border">
                                    <p id="q8-response-a" class="text-sm text-gray-700 mb-3 font-mono">
                                        "AI is smart and cool,<br>
                                        It helps us every day,<br>
                                        Technology is great,<br>
                                        Hip hip hooray!"
                                    </p>
                                    <div id="q8-desc-a" class="text-xs text-gray-500 italic">Basic rhyme scheme, simple vocabulary</div>
                                </div>
                                <button id="q8-vote-a" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors mt-2">👍 Prefer This</button>
                            </div>
                            
                            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h6 class="font-medium text-green-900 mb-2">Response B <span id="q8-style-b" class="text-xs text-green-600">(Creative & Poetic)</span></h6>
                                <div class="bg-white p-2 rounded border">
                                    <p id="q8-response-b" class="text-sm text-gray-700 mb-3 font-mono">
                                        "Silicon dreams awaken,<br>
                                        Neural networks weave thoughts,<br>
                                        Human wisdom guides<br>
                                        Digital consciousness forth."
                                    </p>
                                    <div id="q8-desc-b" class="text-xs text-gray-500 italic">Haiku-like structure, metaphorical language</div>
                                </div>
                                <button id="q8-vote-b" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors mt-2">👍 Prefer This</button>
                            </div>
                        </div>
                        <div id="q8-vote-result" class="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm hidden">
                            <strong>Feedback recorded!</strong> <span id="q8-vote-text"></span>
                        </div>
                    </div>
                    
                    <div class="bg-gray-100 p-3 rounded">
                        <div class="text-sm text-gray-600">
                            <strong>Feedback Progress:</strong> <span id="q8-feedback-count">0</span>/5 comparisons
                            <div class="w-full bg-gray-300 rounded-full h-2 mt-2">
                                <div id="q8-feedback-progress" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="mt-2">
                            <span class="text-xs text-gray-500">Current feedback step: <span id="q8-example-counter">1 of 5</span></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Reward Model Stage -->
            <div id="q8-reward-panel" class="bg-white border border-gray-200 rounded-lg p-4 hidden">
                <h4 class="font-medium text-gray-900 mb-3">🧠 Reward Model Training</h4>
                <div class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <h6 class="font-medium text-purple-900 mb-2">Training Data</h6>
                            <div class="text-sm text-gray-700 space-y-1">
                                <div>📊 Preference pairs: <span id="q8-training-pairs">0</span></div>
                                <div>🎯 Quality annotations: <span id="q8-quality-data">0</span></div>
                                <div>📈 Training accuracy: <span id="q8-model-accuracy">0%</span></div>
                            </div>
                        </div>
                        
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <h6 class="font-medium text-yellow-900 mb-2">Reward Predictions</h6>
                            <div id="q8-reward-examples" class="text-sm space-y-1">
                                <div>High Quality: <span class="font-mono text-green-600">+0.85</span></div>
                                <div>Medium Quality: <span class="font-mono text-yellow-600">+0.42</span></div>
                                <div>Low Quality: <span class="font-mono text-red-600">-0.31</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <button id="q8-train-reward" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                            🧠 Train Reward Model
                        </button>
                        <div id="q8-reward-status" class="mt-2 text-sm text-gray-600">
                            Click to start reward model training
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- RL Optimization Stage -->
            <div id="q8-optimize-panel" class="bg-white border border-gray-200 rounded-lg p-4 hidden">
                <h4 class="font-medium text-gray-900 mb-3">🎯 Reinforcement Learning Optimization</h4>
                <div class="space-y-4">
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <h6 class="font-medium text-orange-900 mb-2">Policy Updates</h6>
                            <div class="text-sm text-gray-700">
                                <div>Episodes: <span id="q8-episodes">0</span></div>
                                <div>Avg Reward: <span id="q8-avg-reward">0.00</span></div>
                                <div>Learning Rate: <span class="font-mono">1e-5</span></div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h6 class="font-medium text-blue-900 mb-2">Performance</h6>
                            <div class="text-sm text-gray-700">
                                <div>Helpfulness: <span id="q8-helpfulness">65%</span></div>
                                <div>Safety: <span id="q8-safety">78%</span></div>
                                <div>Coherence: <span id="q8-coherence">82%</span></div>
                            </div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h6 class="font-medium text-green-900 mb-2">Alignment</h6>
                            <div class="text-sm text-gray-700">
                                <div>Human Preference: <span id="q8-preference">71%</span></div>
                                <div>Value Alignment: <span id="q8-alignment">68%</span></div>
                                <div>Robustness: <span id="q8-robustness">75%</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <button id="q8-run-ppo" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mr-2">
                            🚀 Run PPO Training
                        </button>
                        <button id="q8-evaluate" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                            📊 Evaluate Model
                        </button>
                        <div id="q8-training-status" class="mt-2 text-sm text-gray-600">
                            Ready to start reinforcement learning
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Results Visualization -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">📈 RLHF Training Progress</h4>
                    <div id="q8-overall-progress" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Stage 1/3</div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <span class="text-2xl">📝</span>
                        </div>
                        <div class="text-sm font-medium">Data Collection</div>
                        <div id="q8-stage1-status" class="text-xs text-green-600">In Progress</div>
                    </div>
                    
                    <div class="text-center">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <span class="text-2xl">🧠</span>
                        </div>
                        <div class="text-sm font-medium">Reward Model</div>
                        <div id="q8-stage2-status" class="text-xs text-gray-500">Waiting</div>
                    </div>
                    
                    <div class="text-center">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <span class="text-2xl">🎯</span>
                        </div>
                        <div class="text-sm font-medium">RL Training</div>
                        <div id="q8-stage3-status" class="text-xs text-gray-500">Waiting</div>
                    </div>
                </div>
            </div>
            
            <!-- Educational Explanation -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🧠 Understanding RLHF</h4>
                <div id="q8-explanation" class="text-sm text-yellow-800">
                    RLHF transforms raw language models into helpful, harmless, and honest AI assistants. 
                    Explore each stage above to understand how human feedback guides AI alignment.
                </div>
            </div>
        </div>`,
        script: () => {
            // Stage management
            const stageRadios = document.querySelectorAll('input[name="q8-stage"]');
            const collectionPanel = document.getElementById('q8-collection-panel');
            const rewardPanel = document.getElementById('q8-reward-panel');
            const optimizePanel = document.getElementById('q8-optimize-panel');
            const explanation = document.getElementById('q8-explanation');
            
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
            
            // Dynamic example elements
            const currentPrompt = document.getElementById('q8-current-prompt');
            const responseA = document.getElementById('q8-response-a');
            const responseB = document.getElementById('q8-response-b');
            const styleA = document.getElementById('q8-style-a');
            const styleB = document.getElementById('q8-style-b');
            const descA = document.getElementById('q8-desc-a');
            const descB = document.getElementById('q8-desc-b');
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
            const trainingStatus = document.getElementById('q8-training-status');
            
            // Progress tracking
            const overallProgress = document.getElementById('q8-overall-progress');
            const stage1Status = document.getElementById('q8-stage1-status');
            const stage2Status = document.getElementById('q8-stage2-status');
            const stage3Status = document.getElementById('q8-stage3-status');

            let currentStage = 'collection';
            let gameState = {
                feedbackCollected: 0,
                rewardModelTrained: false,
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

            // Update stage progress indicators
            function updateStageStatus() {
                // Reset all stages
                document.querySelectorAll('[id$="-status"]').forEach(el => {
                    el.textContent = 'Waiting';
                    el.className = 'text-xs text-gray-500';
                });
                
                // Update based on progress
                if (gameState.feedbackCollected >= 5) {
                    stage1Status.textContent = 'Complete';
                    stage1Status.className = 'text-xs text-green-600';
                } else if (currentStage === 'collection') {
                    stage1Status.textContent = 'In Progress';
                    stage1Status.className = 'text-xs text-blue-600';
                }
                
                if (gameState.rewardModelTrained) {
                    stage2Status.textContent = 'Complete';
                    stage2Status.className = 'text-xs text-green-600';
                } else if (currentStage === 'reward') {
                    stage2Status.textContent = 'In Progress';
                    stage2Status.className = 'text-xs text-blue-600';
                }
                
                if (gameState.rlTrainingCompleted) {
                    stage3Status.textContent = 'Complete';
                    stage3Status.className = 'text-xs text-green-600';
                } else if (gameState.rlTrainingStarted) {
                    stage3Status.textContent = 'In Progress';
                    stage3Status.className = 'text-xs text-blue-600';
                } else if (currentStage === 'optimize') {
                    stage3Status.textContent = 'Ready';
                    stage3Status.className = 'text-xs text-orange-600';
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
                
                feedbackCount.textContent = gameState.feedbackCollected;
                feedbackProgress.style.width = (gameState.feedbackCollected / 5 * 100) + '%';
                
                // Update feedback step counter to show current progress
                exampleCounter.textContent = `${gameState.feedbackCollected} of 5`;
                
                // Show next example if more feedback is needed
                if (gameState.feedbackCollected < 5) {
                    setTimeout(() => {
                        const nextExampleIndex = gameState.feedbackCollected % examples.length;
                        updateExampleDisplay(nextExampleIndex, gameState.feedbackCollected + 1);
                    }, 2000); // Wait 2 seconds after showing feedback result
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
                
                gameState.rewardModelTrained = true;
                rewardStatus.textContent = 'Training reward model...';
                trainRewardBtn.disabled = true;
                
                // Simulate training progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    trainingPairs.textContent = Math.floor(gameState.feedbackCollected * 0.8);
                    qualityData.textContent = Math.floor(gameState.feedbackCollected * 0.6);
                    modelAccuracy.textContent = Math.min(95, 60 + progress) + '%';
                    
                    if (progress >= 30) {
                        clearInterval(interval);
                        rewardStatus.textContent = '✅ Reward model training complete!';
                        trainRewardBtn.textContent = '✅ Model Trained';
                        
                        setTimeout(() => {
                            showNotification('Reward model ready! Moving to RL optimization.', 'success');
                            setTimeout(() => {
                                document.querySelector('input[name="q8-stage"][value="optimize"]').checked = true;
                                switchStage('optimize');
                            }, 1500);
                        }, 1500);
                    }
                }, 500);
                
                updateStageStatus();
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
                    styleA.textContent = `(${example.responseA.style})`;
                    styleB.textContent = `(${example.responseB.style})`;
                    descA.textContent = example.responseA.description;
                    descB.textContent = example.responseB.description;
                    // Show current feedback step
                    exampleCounter.textContent = `${feedbackStep} of 5`;
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
                feedbackCount.textContent = '0';
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
                rewardStatus.textContent = 'Click to start reward model training';
                trainingStatus.textContent = 'Ready to start reinforcement learning';
                
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
        }
    }
};

// Export the question object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
} else if (typeof window !== 'undefined') {
    window.question08 = question;
}
