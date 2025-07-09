// Question 5: Beam Search vs Greedy Decoding
// Created: July 8, 2025
// Educational Focus: Understanding text generation strategies, search algorithms, and probability optimization

const question = {
    title: "5. How does beam search improve text generation compared to greedy decoding?",
    answer: `<div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔍 What is Text Generation Strategy?</h4>
            <p class="text-blue-800">When LLMs generate text, they don't just pick random words - they use sophisticated strategies to select the most appropriate next token. These strategies balance between finding the highest probability words and maintaining diversity to avoid repetitive, boring outputs.</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">🎯 Greedy Decoding</h5>
                <p class="text-sm text-green-700 mb-2">Always picks the single highest-probability word at each step</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Fast:</strong> One choice per step</div>
                    <div>✅ <strong>Simple:</strong> Easy to implement</div>
                    <div>❌ <strong>Myopic:</strong> Can miss better overall sequences</div>
                    <div>❌ <strong>Repetitive:</strong> Often gets stuck in loops</div>
                </div>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🌟 Beam Search</h5>
                <p class="text-sm text-purple-700 mb-2">Maintains multiple promising sequences (beams) and explores them in parallel</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Better Quality:</strong> Finds globally better sequences</div>
                    <div>✅ <strong>Balanced:</strong> Considers multiple paths</div>
                    <div>❌ <strong>Slower:</strong> More computation needed</div>
                    <div>❌ <strong>Memory:</strong> Stores multiple sequences</div>
                </div>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Quality vs Speed:</strong> Beam search produces more coherent text but takes longer</li>
                <li>• <strong>Real Applications:</strong> Translation systems use beam search for better accuracy</li>
                <li>• <strong>Creative Writing:</strong> Different strategies produce different styles of text</li>
                <li>• <strong>Search Space:</strong> Understanding how AI explores the vast space of possible texts</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "🚀 Interactive Text Generation Comparator",
        html: `<div class="space-y-6">
            <!-- Strategy Configuration -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">⚙️ Beam Search Configuration</label>
                <div class="flex items-center gap-4">
                    <label class="text-sm">Beam Width:</label>
                    <select id="q5-beam-width" class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="1">1 (Greedy)</option>
                        <option value="2" selected>2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <button id="q5-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try Different Beam Widths</button>
                    <button id="q5-reset-both-btn" class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors ml-2">🔄 Reset Both</button>
                </div>
                <p class="text-xs text-blue-700 font-medium mt-2 bg-blue-100 px-2 py-1 rounded">👆 Beam width of 1 = Greedy decoding!</p>
            </div>

            <!-- Side-by-side Comparison -->
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Greedy Decoding Panel -->
                <div class="bg-white border-2 border-green-200 rounded-lg p-4 space-y-4">
                    <div class="text-center">
                        <h4 class="font-bold text-green-900 text-lg flex items-center justify-center gap-2">
                            🎯 Greedy Decoding
                        </h4>
                        <p class="text-xs text-green-700">Always picks highest probability</p>
                    </div>
                    
                    <div class="text-center space-x-2">
                        <button id="q5-greedy-step-btn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                            ▶️ Next Step
                        </button>
                        <button id="q5-greedy-reset-btn" class="text-xs text-gray-500 hover:underline">🔄 Reset</button>
                    </div>
                    
                    <div>
                        <p class="text-sm font-semibold text-green-900 mb-2">📝 Generated Sequence:</p>
                        <div id="q5-greedy-sequence" class="p-3 bg-green-50 rounded-lg min-h-[40px] text-lg font-mono border border-green-200"></div>
                    </div>
                    
                    <div>
                        <p class="text-sm font-semibold text-green-900 mb-2">📊 Next Word Probabilities:</p>
                        <div id="q5-greedy-probs" class="space-y-1 font-mono text-sm bg-green-50 p-2 rounded border border-green-200 min-h-[80px]"></div>
                    </div>
                    
                    <div class="bg-green-100 p-2 rounded">
                        <div class="text-xs text-green-800">
                            <strong>Total Probability:</strong> <span id="q5-greedy-total-prob">1.000</span>
                        </div>
                    </div>
                </div>
                
                <!-- Beam Search Panel -->
                <div class="bg-white border-2 border-purple-200 rounded-lg p-4 space-y-4">
                    <div class="text-center">
                        <h4 class="font-bold text-purple-900 text-lg flex items-center justify-center gap-2">
                            🌟 Beam Search
                        </h4>
                        <p class="text-xs text-purple-700">Explores multiple paths simultaneously</p>
                    </div>
                    
                    <div class="text-center space-x-2">
                        <button id="q5-beam-step-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                            ▶️ Next Step
                        </button>
                        <button id="q5-beam-reset-btn" class="text-xs text-gray-500 hover:underline">🔄 Reset</button>
                    </div>
                    
                    <div>
                        <p class="text-sm font-semibold text-purple-900 mb-2">🎯 Active Beams:</p>
                        <div id="q5-beam-list" class="space-y-2 bg-purple-50 p-2 rounded border border-purple-200 min-h-[120px]"></div>
                    </div>
                    
                    <div class="bg-purple-100 p-2 rounded">
                        <div class="text-xs text-purple-800">
                            <strong>Beam Width:</strong> <span id="q5-current-beam-width">2</span> | 
                            <strong>Best Score:</strong> <span id="q5-best-score">1.000</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Step-by-step Analysis -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-3">🔍 Step-by-step Analysis</h4>
                <div id="q5-analysis" class="text-sm text-yellow-800">
                    Click "Next Step" on either strategy to begin generating text and see how the approaches differ.
                </div>
            </div>
            
            <!-- Performance Comparison -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">📈 Performance Metrics</h4>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-white p-3 rounded border">
                        <div class="text-xs text-gray-600">Steps Taken</div>
                        <div class="text-lg font-bold" id="q5-steps">0</div>
                    </div>
                    <div class="bg-white p-3 rounded border">
                        <div class="text-xs text-gray-600">Sequences Explored</div>
                        <div class="text-lg font-bold" id="q5-sequences">0</div>
                    </div>
                    <div class="bg-white p-3 rounded border">
                        <div class="text-xs text-gray-600">Diversity Score</div>
                        <div class="text-lg font-bold" id="q5-diversity">0.0</div>
                    </div>
                </div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const greedyStepBtn = document.getElementById('q5-greedy-step-btn');
            const greedyResetBtn = document.getElementById('q5-greedy-reset-btn');
            const greedySeqEl = document.getElementById('q5-greedy-sequence');
            const greedyProbsEl = document.getElementById('q5-greedy-probs');
            const greedyTotalProbEl = document.getElementById('q5-greedy-total-prob');

            const beamStepBtn = document.getElementById('q5-beam-step-btn');
            const beamResetBtn = document.getElementById('q5-beam-reset-btn');
            const beamListEl = document.getElementById('q5-beam-list');
            const beamWidthSelect = document.getElementById('q5-beam-width');
            const currentBeamWidthEl = document.getElementById('q5-current-beam-width');
            const bestScoreEl = document.getElementById('q5-best-score');

            const analysisEl = document.getElementById('q5-analysis');
            const stepsEl = document.getElementById('q5-steps');
            const sequencesEl = document.getElementById('q5-sequences');
            const diversityEl = document.getElementById('q5-diversity');
            const exampleBtn = document.getElementById('q5-example-btn');
            const resetBothBtn = document.getElementById('q5-reset-both-btn');

            if (!greedyStepBtn || !beamStepBtn) return;

            // Simplified, focused scenarios for clear comparison
            const scenarios = {
                start: [
                    {word: 'The', prob: 0.6},
                    {word: 'A', prob: 0.4}
                ],
                'The': [
                    {word: 'cat', prob: 0.5},
                    {word: 'dog', prob: 0.3},
                    {word: 'quick', prob: 0.2}
                ],
                'A': [
                    {word: 'cat', prob: 0.4},
                    {word: 'dog', prob: 0.4},
                    {word: 'quick', prob: 0.2}
                ],
                'cat': [
                    {word: 'sat', prob: 0.5},
                    {word: 'chased', prob: 0.3},
                    {word: 'slept', prob: 0.2}
                ],
                'dog': [
                    {word: 'barked', prob: 0.6},
                    {word: 'ran', prob: 0.4}
                ],
                'quick': [
                    {word: 'brown', prob: 0.8},
                    {word: 'silver', prob: 0.2}
                ],
                'sat': [
                    {word: 'on', prob: 0.7},
                    {word: 'quietly', prob: 0.3}
                ],
                'chased': [
                    {word: 'the', prob: 0.9},
                    {word: 'after', prob: 0.1}
                ],
                'slept': [
                    {word: 'peacefully', prob: 0.8},
                    {word: 'soundly', prob: 0.2}
                ],
                'barked': [
                    {word: 'loudly', prob: 0.7},
                    {word: 'softly', prob: 0.3}
                ],
                'ran': [
                    {word: 'quickly', prob: 0.6},
                    {word: 'away', prob: 0.4}
                ],
                'brown': [
                    {word: 'fox', prob: 0.9},
                    {word: 'bear', prob: 0.1}
                ],
                'silver': [
                    {word: 'car', prob: 0.7},
                    {word: 'moon', prob: 0.3}
                ],
                'on': [
                    {word: 'the', prob: 0.8},
                    {word: 'a', prob: 0.2}
                ],
                'the': [
                    {word: 'mat', prob: 0.4},
                    {word: 'chair', prob: 0.3},
                    {word: 'floor', prob: 0.3}
                ],
                'a': [
                    {word: 'cushion', prob: 0.6},
                    {word: 'pillow', prob: 0.4}
                ],
                'quietly': [
                    {word: '.', prob: 1.0}
                ],
                'peacefully': [
                    {word: '.', prob: 1.0}
                ],
                'soundly': [
                    {word: '.', prob: 1.0}
                ],
                'loudly': [
                    {word: '.', prob: 1.0}
                ],
                'softly': [
                    {word: '.', prob: 1.0}
                ],
                'quickly': [
                    {word: '.', prob: 1.0}
                ],
                'away': [
                    {word: '.', prob: 1.0}
                ],
                'fox': [
                    {word: 'jumped', prob: 0.8},
                    {word: 'ran', prob: 0.2}
                ],
                'bear': [
                    {word: 'walked', prob: 0.7},
                    {word: 'growled', prob: 0.3}
                ],
                'car': [
                    {word: 'drove', prob: 0.8},
                    {word: 'parked', prob: 0.2}
                ],
                'moon': [
                    {word: 'shone', prob: 0.9},
                    {word: 'glowed', prob: 0.1}
                ],
                'mat': [
                    {word: '.', prob: 1.0}
                ],
                'chair': [
                    {word: '.', prob: 1.0}
                ],
                'floor': [
                    {word: '.', prob: 1.0}
                ],
                'cushion': [
                    {word: '.', prob: 1.0}
                ],
                'pillow': [
                    {word: '.', prob: 1.0}
                ],
                'jumped': [
                    {word: '.', prob: 1.0}
                ],
                'walked': [
                    {word: '.', prob: 1.0}
                ],
                'growled': [
                    {word: '.', prob: 1.0}
                ],
                'drove': [
                    {word: '.', prob: 1.0}
                ],
                'parked': [
                    {word: '.', prob: 1.0}
                ],
                'shone': [
                    {word: '.', prob: 1.0}
                ],
                'glowed': [
                    {word: '.', prob: 1.0}
                ]
            };

            // State management
            let greedyState = { sequence: [], totalProb: 1.0, step: 0 };
            let beamState = { beams: [{sequence: [], score: 1.0}], step: 0 };
            let currentBeamWidth = 2;
            let totalSequencesExplored = 0;

            // Example scenarios - focus on beam width differences
            const examples = [
                { width: 2, description: 'Standard beam search (width=2)' },
                { width: 3, description: 'Wider exploration (width=3)' },
                { width: 1, description: 'Greedy mode (width=1)' },
                { width: 4, description: 'Maximum exploration (width=4)' }
            ];
            let exampleIndex = 0;

            // Update beam width
            function updateBeamWidth() {
                currentBeamWidth = parseInt(beamWidthSelect.value);
                currentBeamWidthEl.textContent = currentBeamWidth;
                resetBeam();
            }

            // Render greedy probabilities with enhanced styling
            function renderGreedyProbs(probs) {
                if (!greedyProbsEl) return;
                greedyProbsEl.innerHTML = '';
                probs.forEach((p, i) => {
                    const div = document.createElement('div');
                    const isChosen = i === 0;
                    div.className = `p-2 rounded ${isChosen ? 'bg-green-200 border-2 border-green-400 font-bold' : 'bg-white border border-green-200'} transition-all`;
                    div.innerHTML = `
                        <span class="flex justify-between items-center">
                            <span>${isChosen ? '👑 ' : ''}${p.word}</span>
                            <span class="text-xs ${isChosen ? 'text-green-800' : 'text-gray-600'}">${(p.prob * 100).toFixed(1)}%</span>
                        </span>
                    `;
                    greedyProbsEl.appendChild(div);
                });
            }
            
            // Render beam search beams with enhanced styling
            function renderBeams(beams) {
                if (!beamListEl) return;
                beamListEl.innerHTML = '';
                beams.forEach((beam, i) => {
                    const div = document.createElement('div');
                    const isBest = i === 0;
                    div.className = `p-3 rounded-lg border-2 transition-all ${isBest ? 'border-purple-400 bg-purple-100' : 'border-purple-200 bg-white'} relative`;
                    
                    const sequenceText = beam.sequence.length > 0 ? beam.sequence.join(' ') : '(start)';
                    div.innerHTML = `
                        <div class="flex justify-between items-start">
                            <span class="font-mono text-sm ${isBest ? 'font-bold' : ''}">${isBest ? '🥇 ' : ''}${sequenceText}</span>
                            <span class="text-xs ${isBest ? 'text-purple-800 font-bold' : 'text-gray-600'} ml-2">
                                ${(beam.score * 100).toFixed(2)}%
                            </span>
                        </div>
                        ${isBest ? '<div class="text-xs text-purple-700 mt-1">Best candidate</div>' : ''}
                    `;
                    beamListEl.appendChild(div);
                });
                
                if (bestScoreEl && beams.length > 0) {
                    bestScoreEl.textContent = (beams[0].score * 100).toFixed(2) + '%';
                }
            }

            // Calculate diversity score
            function calculateDiversity(beams) {
                if (beams.length <= 1) return 0;
                const sequences = beams.map(b => b.sequence.join(' '));
                const uniqueWords = new Set();
                sequences.forEach(seq => seq.split(' ').forEach(word => uniqueWords.add(word)));
                return (uniqueWords.size / sequences.join(' ').split(' ').length).toFixed(2);
            }

            // Update analysis
            function updateAnalysis(method, step, data) {
                if (!analysisEl) return;
                
                let analysis = '';
                if (method === 'greedy') {
                    analysis = `<strong>Greedy Step ${step}:</strong> Selected "${data.chosen}" with ${(data.prob * 100).toFixed(1)}% probability. 
                    Greedy always picks the highest probability option, but this might lead to suboptimal overall sequences.`;
                } else if (method === 'beam') {
                    analysis = `<strong>Beam Step ${step}:</strong> Exploring ${data.candidates} candidates, keeping top ${currentBeamWidth} beams. 
                    Beam search considers multiple paths simultaneously, potentially finding better overall sequences.`;
                }
                
                analysisEl.innerHTML = analysis;
            }

            // Update metrics
            function updateMetrics() {
                if (stepsEl) stepsEl.textContent = Math.max(greedyState.step, beamState.step);
                if (sequencesEl) sequencesEl.textContent = totalSequencesExplored;
                if (diversityEl) diversityEl.textContent = calculateDiversity(beamState.beams);
            }

            // Greedy decoding step
            function stepGreedy() {
                const lastWord = greedyState.sequence.length > 0 ? 
                    greedyState.sequence[greedyState.sequence.length - 1] : 'start';
                const nextOptions = scenarios[lastWord];
                
                if (!nextOptions) {
                    renderGreedyProbs([{word: '[END]', prob: 1.0}]);
                    updateAnalysis('greedy', greedyState.step, {chosen: '[END]', prob: 1.0});
                    return;
                }
                
                // Sort by probability (greedy chooses highest)
                const sortedOptions = [...nextOptions].sort((a, b) => b.prob - a.prob);
                const choice = sortedOptions[0];
                
                greedyState.sequence.push(choice.word);
                greedyState.totalProb *= choice.prob;
                greedyState.step++;
                totalSequencesExplored++;
                
                if (greedySeqEl) greedySeqEl.textContent = greedyState.sequence.join(' ');
                if (greedyTotalProbEl) greedyTotalProbEl.textContent = (greedyState.totalProb * 100).toFixed(3) + '%';
                
                renderGreedyProbs(sortedOptions);
                updateAnalysis('greedy', greedyState.step, {chosen: choice.word, prob: choice.prob});
                updateMetrics();
            }

            // Beam search step
            function stepBeam() {
                const allCandidates = [];
                let totalCandidates = 0;
                
                for (const beam of beamState.beams) {
                    const lastWord = beam.sequence.length > 0 ? 
                        beam.sequence[beam.sequence.length - 1] : 'start';
                    const nextOptions = scenarios[lastWord];
                    
                    if (nextOptions) {
                        for (const option of nextOptions) {
                            allCandidates.push({
                                sequence: [...beam.sequence, option.word],
                                score: beam.score * option.prob
                            });
                            totalCandidates++;
                        }
                    }
                }
                
                if (allCandidates.length === 0) {
                    updateAnalysis('beam', beamState.step, {candidates: 0});
                    return;
                }

                // Sort by score and keep top beams
                allCandidates.sort((a, b) => b.score - a.score);
                beamState.beams = allCandidates.slice(0, currentBeamWidth);
                beamState.step++;
                totalSequencesExplored += totalCandidates;
                
                renderBeams(beamState.beams);
                updateAnalysis('beam', beamState.step, {candidates: totalCandidates});
                updateMetrics();
            }
            
            // Reset functions - ensure both start from same state
            function resetGreedy() { 
                greedyState = { sequence: [], totalProb: 1.0, step: 0 }; 
                totalSequencesExplored = 0; // Reset shared counter
                if (greedySeqEl) greedySeqEl.textContent = ''; 
                if (greedyProbsEl) greedyProbsEl.innerHTML = ''; 
                if (greedyTotalProbEl) greedyTotalProbEl.textContent = '100.000%';
                if (analysisEl) analysisEl.innerHTML = 'Both strategies start from the same point. Click "Next Step" to see how they differ in their token selection process.';
                updateMetrics();
            }
            
            function resetBeam() { 
                beamState = { beams: [{sequence: [], score: 1.0}], step: 0 }; 
                totalSequencesExplored = 0; // Reset shared counter
                if (beamListEl) beamListEl.innerHTML = ''; 
                if (bestScoreEl) bestScoreEl.textContent = '100.00%';
                renderBeams(beamState.beams);
                updateMetrics();
            }

            function resetBoth() {
                resetGreedy();
                resetBeam();
                if (analysisEl) analysisEl.innerHTML = 'Both strategies reset. They will now generate text from the same starting point, allowing you to compare their different approaches.';
            }

            // Event listeners
            if (greedyStepBtn) greedyStepBtn.addEventListener('click', stepGreedy);
            if (greedyResetBtn) greedyResetBtn.addEventListener('click', resetGreedy);
            if (beamStepBtn) beamStepBtn.addEventListener('click', stepBeam);
            if (beamResetBtn) beamResetBtn.addEventListener('click', resetBeam);
            if (beamWidthSelect) beamWidthSelect.addEventListener('change', updateBeamWidth);
            if (resetBothBtn) resetBothBtn.addEventListener('click', resetBoth);

            // Example button
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    beamWidthSelect.value = example.width;
                    updateBeamWidth();
                    resetBoth(); // Reset both when changing examples
                    exampleBtn.textContent = `Try: ${example.description}`;
                    exampleIndex++;
                });
            }
            
            // Initialize
            updateBeamWidth();
            resetGreedy();
            resetBeam();
        }
    }
};
