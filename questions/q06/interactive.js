const interactiveScript = () => {
            // Get DOM elements with error checking
            const tempSlider = document.getElementById('q6-temp-slider');
            const tempValue = document.getElementById('q6-temp-value');
            const tempIndicator = document.getElementById('q6-temp-indicator');
            const probChart = document.getElementById('q6-prob-chart');
            const entropyValue = document.getElementById('q6-entropy-value');
            const sampleBtn = document.getElementById('q6-sample-btn');
            const sampleResult = document.getElementById('q6-sample-result');
            const sampleStats = document.getElementById('q6-sample-stats');
            const compareBtn = document.getElementById('q6-compare-btn');
            const lowTempOutput = document.getElementById('q6-low-temp-output');
            const currentTempOutput = document.getElementById('q6-current-temp-output');
            const highTempOutput = document.getElementById('q6-high-temp-output');
            const currentTempLabel = document.getElementById('q6-current-temp-label');
            const diversityScore = document.getElementById('q6-diversity-score');
            const avgProb = document.getElementById('q6-avg-prob');
            const generationCount = document.getElementById('q6-generation-count');
            const sampleDiversityEl = document.getElementById('q6-sample-diversity');
            const sampleAvgProbEl = document.getElementById('q6-sample-avg-prob');
            const sampleCountEl = document.getElementById('q6-sample-count');
            const resetMetricsBtn = document.getElementById('q6-reset-metrics');
            const explanationEl = document.getElementById('q6-explanation');
            const exampleBtn = document.getElementById('q6-example-btn');

            const getCssVar = (name, fallback) => {
                const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
                return value || fallback;
            };

            const mixColor = (tone, percentage, base) => {
                const pct = Math.max(0, Math.min(100, percentage));
                const remainder = Math.max(0, 100 - pct);
                const fallback = base || getCssVar('--color-card', '#f1f5f9');
                return `color-mix(in srgb, ${tone} ${pct}%, ${fallback} ${remainder}%)`;
            };

            const resetStrategyStyles = (frame) => {
                if (!frame) return;
                frame.classList.remove('question-strategy-active');
                frame.style.background = '';
                frame.style.borderColor = '';
                frame.style.boxShadow = '';
                frame.style.color = '';
                const inner = frame.querySelector('.stacked-card');
                if (inner) {
                    inner.style.background = '';
                    inner.style.borderColor = '';
                    inner.style.boxShadow = '';
                    inner.style.color = '';
                }
                const badge = frame.querySelector('.stacked-card .chip');
                if (badge) {
                    badge.style.borderColor = '';
                    badge.style.background = '';
                    badge.style.color = '';
                }
            };

            const applyStrategyStyles = (frame, tone) => {
                if (!frame) return;
                const cardColor = getCssVar('--color-card', '#f1f5f9');
                const borderSubtle = getCssVar('--color-border-subtle', '#e2e8f0');
                const heading = getCssVar('--color-heading', '#0f172a');
                const darkMode = document.documentElement.classList.contains('dark');

                const intensities = darkMode ? {
                    bg: 38,
                    border: 58,
                    text: 20,
                    innerText: 22,
                    badgeBorder: 48,
                    badgeBg: 22,
                    badgeText: 24,
                    shadow: `0 24px 52px -28px ${getCssVar('--shadow-elevation-dark', '#0206178c')}`
                } : {
                    bg: 16,
                    border: 28,
                    text: 42,
                    innerText: 48,
                    badgeBorder: 24,
                    badgeBg: 8,
                    badgeText: 58,
                    shadow: '0 20px 36px -30px rgba(15, 23, 42, 0.18)'
                };

                frame.classList.add('question-strategy-active');
                frame.style.background = mixColor(tone, intensities.bg, cardColor);
                frame.style.borderColor = mixColor(tone, intensities.border, borderSubtle);
                frame.style.boxShadow = intensities.shadow;
                frame.style.color = mixColor(tone, intensities.text, heading);

                const inner = frame.querySelector('.stacked-card');
                if (inner) {
                    inner.style.background = 'transparent';
                    inner.style.borderColor = 'transparent';
                    inner.style.boxShadow = 'none';
                    inner.style.color = mixColor(tone, intensities.innerText, heading);
                }

                const badge = frame.querySelector('.stacked-card .chip');
                if (badge) {
                    badge.style.borderColor = mixColor(tone, intensities.badgeBorder, borderSubtle);
                    badge.style.background = mixColor(tone, intensities.badgeBg, cardColor);
                    badge.style.color = mixColor(tone, intensities.badgeText, heading);
                }
            };

            const CONTEXT_TONES = {
                weather: 'var(--tone-sky-strong)',
                story: 'var(--tone-emerald-strong)',
                product: 'var(--tone-purple-strong)'
            };

            const TEMPERATURE_BANDS = [
                { max: 0.3, text: 'Ultra conservative: nearly deterministic selection', chipClass: 'chip-success', tone: 'var(--tone-emerald-strong)', palette: 'blue' },
                { max: 0.7, text: 'Conservative: focused on high-probability tokens', chipClass: 'chip-success', tone: 'var(--tone-emerald-strong)', palette: 'blue' },
                { max: 1.2, text: 'Balanced: natural language variation', chipClass: 'chip-info', tone: 'var(--tone-purple-strong)', palette: 'purple' },
                { max: 1.6, text: 'Creative: explores diverse vocabulary', chipClass: 'chip-accent', tone: 'var(--tone-purple-strong)', palette: 'orange' },
                { max: Infinity, text: 'Wild: highly experimental and unpredictable', chipClass: 'chip-warning', tone: 'var(--tone-amber-strong)', palette: 'red' }
            ];

            if (!tempSlider || !probChart) return;

            // Enhanced vocabulary with multiple contexts
            const vocabularies = {
                weather: [
                    { word: 'sunny', baseProb: 0.35 },
                    { word: 'cloudy', baseProb: 0.25 },
                    { word: 'rainy', baseProb: 0.15 },
                    { word: 'cold', baseProb: 0.10 },
                    { word: 'warm', baseProb: 0.08 },
                    { word: 'windy', baseProb: 0.07 }
                ],
                story: [
                    { word: 'there', baseProb: 0.30 },
                    { word: 'in', baseProb: 0.25 },
                    { word: 'lived', baseProb: 0.20 },
                    { word: 'was', baseProb: 0.15 },
                    { word: 'a', baseProb: 0.10 }
                ],
                product: [
                    { word: 'launch', baseProb: 0.28 },
                    { word: 'feature', baseProb: 0.22 },
                    { word: 'customers', baseProb: 0.18 },
                    { word: 'update', baseProb: 0.14 },
                    { word: 'faster', baseProb: 0.10 },
                    { word: 'workflow', baseProb: 0.08 }
                ]
            };

            // State management
            let sampleCount = 0;
            let generationHistory = [];
            let samplingHistory = []; // { word, prob }
            let currentContext = 'weather';

            // Example temperature settings
            const examples = [
                { temp: 0.1, description: 'Ultra-conservative (0.1)' },
                { temp: 0.5, description: 'Conservative (0.5)' },
                { temp: 1.0, description: 'Balanced (1.0)' },
                { temp: 1.5, description: 'Creative (1.5)' },
                { temp: 2.0, description: 'Wild (2.0)' }
            ];
            let exampleIndex = 0;

            // Get current context
            function getCurrentContext() {
                const selected = document.querySelector('input[name="q6-context"]:checked');
                return selected ? selected.value : 'weather';
            }

            // Get current vocabulary
            function getCurrentVocabulary() {
                return vocabularies[getCurrentContext()] || vocabularies.weather;
            }

            // Apply temperature to probabilities (softmax with temperature)
            function applyTemperature(probs, temp) {
                const scaledLogits = probs.map(p => Math.log(Math.max(p.baseProb, 1e-10)) / temp);
                const maxLogit = Math.max(...scaledLogits);
                const expLogits = scaledLogits.map(logit => Math.exp(logit - maxLogit));
                const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
                
                return probs.map((p, i) => ({
                    ...p,
                    tempProb: expLogits[i] / sumExp
                }));
            }

            // Calculate entropy (measure of randomness)
            function calculateEntropy(probs) {
                return -probs.reduce((sum, p) => {
                    const prob = p.tempProb || p.baseProb;
                    return sum + (prob > 0 ? prob * Math.log2(prob) : 0);
                }, 0);
            }

            // Get temperature description
            function getTemperatureDescription(temp) {
                return TEMPERATURE_BANDS.find(band => temp <= band.max) || TEMPERATURE_BANDS[TEMPERATURE_BANDS.length - 1];
            }

            // Update probability visualization
            function updateProbabilityChart() {
                const temp = parseFloat(tempSlider.value);
                const vocab = getCurrentVocabulary();
                const tempProbs = applyTemperature(vocab, temp);
                const entropy = calculateEntropy(tempProbs);
                const description = getTemperatureDescription(temp);
                
                // Update UI elements
                tempValue.textContent = temp.toFixed(1);
                currentTempLabel.textContent = temp.toFixed(1);
                entropyValue.textContent = `Entropy: ${entropy.toFixed(2)}`;
                
                // Update temperature indicator
                tempIndicator.className = `chip ${description.chipClass} text-xs w-fit`;
                currentTempLabel.className = `chip ${description.chipClass} text-xs`;
                const darkMode = document.documentElement.classList.contains('dark');
                const colorMap = {
                    blue: darkMode ? { bg: `${getCssVar('--tone-sky-strong', '#3b82f6')}2e`, fg: getCssVar('--tone-sky-soft', '#bfdbfe') } : { bg: getCssVar('--tone-sky-soft', '#DBEAFE'), fg: getCssVar('--tone-sky-text', '#1E40AF') },
                    purple: darkMode ? { bg: `${getCssVar('--tone-purple-strong', '#a855f7')}2e`, fg: getCssVar('--tone-purple-soft', '#e9d5ff') } : { bg: getCssVar('--tone-purple-soft', '#EDE9FE'), fg: getCssVar('--tone-purple-text', '#5B21B6') },
                    orange: darkMode ? { bg: `${getCssVar('--tone-amber-strong', '#fbbf24')}2e`, fg: getCssVar('--tone-amber-soft', '#fde68a') } : { bg: getCssVar('--tone-amber-soft', '#FFEDD5'), fg: getCssVar('--tone-amber-text', '#9A3412') },
                    red: darkMode ? { bg: `${getCssVar('--tone-rose-strong', '#f87171')}33`, fg: getCssVar('--tone-rose-soft', '#fecaca') } : { bg: getCssVar('--tone-rose-soft', '#FEE2E2'), fg: getCssVar('--tone-rose-text', '#7F1D1D') }
                };
                const palette = colorMap[description.palette] || colorMap.purple;
                tempIndicator.style.backgroundColor = palette.bg;
                tempIndicator.style.color = palette.fg;
                tempIndicator.textContent = description.text;
                
                // Update probability chart
                probChart.innerHTML = '';
                const accentTone = getCssVar('--tone-purple-strong', '#7c3aed');
                const cardColor = getCssVar('--color-card', '#f1f5f9');
                const borderSubtle = getCssVar('--color-border-subtle', '#e2e8f0');
                const headingTone = getCssVar('--color-heading', '#0f172a');
                const highlightConfig = darkMode ? {
                    primary: 18,
                    secondary: 12,
                    rest: 6,
                    borderBoost: 12,
                    shadow: `0 16px 32px -28px ${getCssVar('--shadow-accent-dark', '#581c8759')}`,
                    labelTone: headingTone,
                    barPrimary: 60,
                    barSecondary: 48,
                    barRest: 36,
                    rail: 8
                } : {
                    primary: 10,
                    secondary: 6,
                    rest: 3,
                    borderBoost: 6,
                    shadow: `0 14px 28px -24px ${getCssVar('--shadow-accent', '#581c872e')}`,
                    labelTone: mixColor(accentTone, 14, headingTone),
                    barPrimary: 42,
                    barSecondary: 28,
                    barRest: 20,
                    rail: 2
                };

                tempProbs.forEach((item, index) => {
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';
                    container.style.gap = '0.75rem';
                    container.style.padding = '0.5rem 0.65rem';
                    container.style.borderRadius = '0.85rem';
                    container.style.transition = 'background-color .3s ease, border-color .3s ease';

                    const highlight = index === 0 ? highlightConfig.primary : index === 1 ? highlightConfig.secondary : highlightConfig.rest;
                    container.style.background = mixColor(accentTone, highlight, cardColor);
                    container.style.border = `1px solid ${mixColor(accentTone, highlight + highlightConfig.borderBoost, borderSubtle)}`;
                    container.style.boxShadow = index === 0 ? highlightConfig.shadow : 'none';

                    const rank = document.createElement('span');
                    rank.className = 'small-caption text-muted';
                    rank.style.minWidth = '1.5rem';
                    rank.style.textAlign = 'center';
                    rank.textContent = index + 1;

                    const label = document.createElement('span');
                    label.style.fontFamily = "'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace";
                    label.style.fontSize = '0.875rem';
                    label.style.color = highlightConfig.labelTone;
                    label.style.minWidth = '4.5rem';
                    label.textContent = item.word;

                    const barContainer = document.createElement('div');
                    barContainer.style.flex = '1';
                    barContainer.style.height = '0.45rem';
                    barContainer.style.borderRadius = '999px';
                    barContainer.style.overflow = 'hidden';
                    barContainer.style.background = mixColor(accentTone, highlightConfig.rail, borderSubtle);

                    const bar = document.createElement('div');
                    bar.style.height = '100%';
                    bar.style.borderRadius = 'inherit';
                    const barStrength = index === 0 ? highlightConfig.barPrimary : index === 1 ? highlightConfig.barSecondary : highlightConfig.barRest;
                    bar.style.background = mixColor(accentTone, barStrength, cardColor);
                    bar.style.width = `${(item.tempProb * 100).toFixed(1)}%`;
                    bar.style.transition = 'width 0.5s ease';

                    barContainer.appendChild(bar);

                    const percentage = document.createElement('span');
                    percentage.className = 'small-caption text-muted';
                    percentage.style.minWidth = '3rem';
                    percentage.style.textAlign = 'right';
                    percentage.textContent = `${(item.tempProb * 100).toFixed(1)}%`;

                    container.append(rank, label, barContainer, percentage);
                    container.title = `${item.word}: ${(item.tempProb * 100).toFixed(2)}% chance of selection`;
                    probChart.appendChild(container);
                });
                
                // Update effective vocabulary size display (2^entropy)
                const effVocabEl = document.getElementById('q6-eff-vocab');
                if (effVocabEl) effVocabEl.textContent = `Eff. vocab: ${Math.pow(2, entropy).toFixed(2)}`;

                updateExplanation(temp, entropy);
            }

            // Sample token based on temperature
            function selectRandomToken(probs) {
                const random = Math.random();
                let cumulative = 0;
                
                for (const item of probs) {
                    cumulative += item.tempProb;
                    if (random <= cumulative) {
                        return item;
                    }
                }
                return probs[0];
            }

            // Sample token visualization
            function sampleToken() {
                const temp = parseFloat(tempSlider.value);
                const vocab = getCurrentVocabulary();
                const tempProbs = applyTemperature(vocab, temp);
                const selected = selectRandomToken(tempProbs);
                
                sampleCount++;
                
                // Animate the selection
                sampleResult.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-purple-700 text-lg">"${selected.word}"</span>
                        <span class="text-xs text-purple-600">${(selected.tempProb * 100).toFixed(1)}% chance</span>
                    </div>
                    <div class="text-xs text-gray-600 mt-1">Selected from ${vocab.length} possible tokens</div>
                `;
                
                sampleStats.textContent = `Samples taken: ${sampleCount}`;
                
                // Visual feedback
                sampleResult.style.transform = 'scale(1.05)';
                sampleResult.style.backgroundColor = getCssVar('--tone-purple-soft', '#f3e8ff');
                setTimeout(() => {
                    sampleResult.style.transform = 'scale(1)';
                    sampleResult.style.backgroundColor = getCssVar('--tone-purple-soft', '#faf5ff');
                }, 200);

                // Update sampling history and sampling metrics
                samplingHistory.push({ word: selected.word, prob: selected.tempProb });
                if (samplingHistory.length > 100) samplingHistory.shift();

                updateSampleMetrics();

                return selected.word;
            }

            // Generate text with different temperatures
            function generateComparison() {
                const context = getCurrentContext();
                const contextTexts = {
                    weather: 'The weather is',
                    story: 'Once upon a time',
                    product: 'We\'re excited to announce'
                };
                
                const baseText = contextTexts[context];
                const vocab = getCurrentVocabulary();
                
                // Generate with different temperatures
                const lowTemp = applyTemperature(vocab, 0.2);
                const currentTemp = applyTemperature(vocab, parseFloat(tempSlider.value));
                const highTemp = applyTemperature(vocab, 1.8);
                
                const lowResult = selectRandomToken(lowTemp);
                const currentResult = selectRandomToken(currentTemp);
                const highResult = selectRandomToken(highTemp);
                
                // Update outputs
                const skyTone = getCssVar('--tone-sky-strong', '#0ea5e9');
                const accentTone = getCssVar('--tone-purple-strong', '#7c3aed');
                const amberTone = getCssVar('--tone-amber-strong', '#f59e0b');

                lowTempOutput.innerHTML = `
                    <div>"${baseText} <strong style="color:${skyTone}">${lowResult.word}</strong>..."</div>
                    <div class="small-caption text-muted">${(lowResult.tempProb * 100).toFixed(1)}% probability</div>
                `;

                currentTempOutput.innerHTML = `
                    <div>"${baseText} <strong style="color:${accentTone}">${currentResult.word}</strong>..."</div>
                    <div class="small-caption text-muted">${(currentResult.tempProb * 100).toFixed(1)}% probability</div>
                `;

                highTempOutput.innerHTML = `
                    <div>"${baseText} <strong style="color:${amberTone}">${highResult.word}</strong>..."</div>
                    <div class="small-caption text-muted">${(highResult.tempProb * 100).toFixed(1)}% probability</div>
                `;

                // Update metrics
                generationHistory.push({ low: lowResult, current: currentResult, high: highResult });
                updateMetrics();
            }

            // Update generation metrics
            function updateMetrics() {
                if (generationHistory.length === 0) return;
                
                const words = generationHistory.flatMap(gen => [gen.low.word, gen.current.word, gen.high.word]);
                const uniqueWords = new Set(words);
                const diversity = (uniqueWords.size / words.length).toFixed(2);
                
                const avgProbability = generationHistory.reduce((sum, gen) => {
                    return sum + (gen.low.tempProb + gen.current.tempProb + gen.high.tempProb) / 3;
                }, 0) / generationHistory.length;
                
                diversityScore.textContent = diversity;
                avgProb.textContent = `${(avgProbability * 100).toFixed(1)}%`;
                generationCount.textContent = generationHistory.length;
            }

            // Update sampling-only metrics
            function updateSampleMetrics() {
                if (!sampleDiversityEl || !sampleAvgProbEl || !sampleCountEl) return;
                const count = samplingHistory.length;
                if (count === 0) {
                    sampleDiversityEl.textContent = '0.0';
                    sampleAvgProbEl.textContent = '0.0%';
                    sampleCountEl.textContent = '0';
                    return;
                }
                const words = samplingHistory.map(s => s.word);
                const unique = new Set(words).size;
                const diversity = unique / count;
                const avgP = samplingHistory.reduce((s, r) => s + r.prob, 0) / count;
                sampleDiversityEl.textContent = diversity.toFixed(2);
                sampleAvgProbEl.textContent = `${(avgP * 100).toFixed(1)}%`;
                sampleCountEl.textContent = String(sampleCount);
            }

            function resetAllMetrics() {
                generationHistory = [];
                samplingHistory = [];
                sampleCount = 0;
                if (diversityScore) diversityScore.textContent = '0.0';
                if (avgProb) avgProb.textContent = '0.0%';
                if (generationCount) generationCount.textContent = '0';
                updateSampleMetrics();
                if (sampleStats) sampleStats.textContent = 'Samples taken: 0';
            }

            // Update educational explanation
            function updateExplanation(temp, entropy) {
                let explanation = '';
                
                if (temp <= 0.3) {
                    explanation = `<strong>Low Temperature (${temp}):</strong> The model is being very conservative. The softmax function is sharpened, making high-probability tokens even more likely. Entropy is low (${entropy.toFixed(2)}), indicating low randomness. Perfect for factual content where consistency matters.`;
                } else if (temp <= 0.7) {
                    explanation = `<strong>Conservative Temperature (${temp}):</strong> Still favoring high-probability tokens but with some variation. The probability distribution is moderately sharp. Entropy is ${entropy.toFixed(2)}, showing controlled randomness.`;
                } else if (temp <= 1.2) {
                    explanation = `<strong>Balanced Temperature (${temp}):</strong> Near-natural language generation. The softmax function operates normally, providing good balance between coherence and creativity. Entropy is ${entropy.toFixed(2)}, indicating healthy variation.`;
                } else if (temp <= 1.6) {
                    explanation = `<strong>Creative Temperature (${temp}):</strong> The probability distribution is flattened, giving lower-probability tokens better chances. Entropy is ${entropy.toFixed(2)}, showing increased randomness. Good for creative writing.`;
                } else {
                    explanation = `<strong>Wild Temperature (${temp}):</strong> Very flat probability distribution. Even low-probability tokens have significant chances of selection. High entropy (${entropy.toFixed(2)}) means very unpredictable outputs. Use with caution!`;
                }
                
                explanationEl.innerHTML = explanation;
            }

            // Handle context changes
            function updateContextSelection() {
                currentContext = getCurrentContext();

                document.querySelectorAll('input[name="q6-context"]').forEach(radio => {
                    const frame = radio.closest('.question-strategy');
                    const tone = CONTEXT_TONES[radio.value] || CONTEXT_TONES.weather;
                    resetStrategyStyles(frame);
                    if (radio.checked) {
                        applyStrategyStyles(frame, tone);
                    }
                });

                updateProbabilityChart();
            }

            // Event listeners
            if (tempSlider) tempSlider.addEventListener('input', updateProbabilityChart);
            if (sampleBtn) sampleBtn.addEventListener('click', sampleToken);
            if (compareBtn) compareBtn.addEventListener('click', generateComparison);
            if (resetMetricsBtn) resetMetricsBtn.addEventListener('click', resetAllMetrics);
            
            // Context selection listeners
            document.querySelectorAll('input[name="q6-context"]').forEach(radio => {
                radio.addEventListener('change', updateContextSelection);
            });
            
            // Example button
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex % examples.length];
                    tempSlider.value = example.temp;
                    exampleBtn.textContent = `Try: ${example.description}`;
                    exampleIndex++;
                    updateProbabilityChart();
                });
            }

            // React to theme changes so styles stay legible in light/dark
            const themeObserver = new MutationObserver((mutations) => {
                if (mutations.some(m => m.type === 'attributes')) {
                    updateContextSelection();
                }
            });
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

            // Initialize
            updateContextSelection();
            updateProbabilityChart();
            updateSampleMetrics();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question06Interactive = interactiveScript;
}
