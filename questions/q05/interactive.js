const interactiveScript = () => {
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

            const getCssVar = (name, fallback) => {
                const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
                return value || fallback;
            };

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
                const successTone = getCssVar('--tone-emerald-strong', '#059669');
                const mutedTone = getCssVar('--color-muted', '#64748b');

                probs.forEach((prob, index) => {
                    const isChosen = index === 0;
                    const row = document.createElement('div');
                    row.className = isChosen
                        ? 'panel panel-success panel-emphasis p-2 flex items-center justify-between text-sm'
                        : 'panel panel-neutral p-2 flex items-center justify-between text-sm';

                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = `${isChosen ? '👑 ' : ''}${prob.word}`;

                    const valueSpan = document.createElement('span');
                    valueSpan.className = isChosen ? 'text-xs font-medium' : 'text-xs text-muted';
                    valueSpan.style.color = isChosen ? successTone : mutedTone;
                    valueSpan.textContent = `${(prob.prob * 100).toFixed(1)}%`;

                    row.append(wordSpan, valueSpan);
                    greedyProbsEl.appendChild(row);
                });
            }

            function renderBeams(beams) {
                if (!beamListEl) return;
                beamListEl.innerHTML = '';
                const accentTone = getCssVar('--tone-purple-strong', '#7c3aed');
                const mutedTone = getCssVar('--color-muted', '#64748b');

                beams.forEach((beam, index) => {
                    const isBest = index === 0;
                    const entry = document.createElement('div');
                    entry.className = isBest
                        ? 'panel panel-accent panel-emphasis p-3 space-y-2'
                        : 'panel panel-neutral p-3 space-y-2';

                    const header = document.createElement('div');
                    header.className = 'flex items-start justify-between gap-3';

                    const seqSpan = document.createElement('span');
                    seqSpan.className = 'font-mono text-sm';
                    seqSpan.textContent = beam.sequence.length > 0 ? beam.sequence.join(' ') : '(start)';
                    if (isBest) {
                        seqSpan.textContent = `🥇 ${seqSpan.textContent}`;
                        seqSpan.style.fontWeight = '600';
                    }

                    const scoreSpan = document.createElement('span');
                    scoreSpan.className = 'text-xs font-medium';
                    scoreSpan.style.color = isBest ? accentTone : mutedTone;
                    scoreSpan.textContent = `${(beam.score * 100).toFixed(2)}%`;

                    header.append(seqSpan, scoreSpan);
                    entry.appendChild(header);

                    if (isBest) {
                        const badge = document.createElement('span');
                        badge.className = 'chip chip-accent text-xs';
                        badge.textContent = 'Best candidate';
                        entry.appendChild(badge);
                    }

                    beamListEl.appendChild(entry);
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
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question05Interactive = interactiveScript;
}
