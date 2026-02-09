const interactiveScript = () => {
    const contextInput = document.getElementById('q25-context');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const trueWordInput = document.getElementById('q25-true-word');
    const scenarioRadios = document.querySelectorAll('input[name="q25-scenario"]');
    const output = document.getElementById('q25-output');
    const exampleBtn = document.getElementById('q25-example-btn');
    const scenarioIndicator = document.getElementById('q25-scenario-indicator');
    const legend = document.getElementById('q25-legend');
    const explanation = document.getElementById('q25-explanation');

    if (!contextInput || !trueWordInput || !output) {
        console.error('Required DOM elements not found for Question 25');
        if (output) {
            output.innerHTML = '<div class="panel panel-warning p-4 text-sm">Error: could not initialise the cross-entropy interactive.</div>';
        }
        return;
    }

    const scenarioConfig = {
        good: {
            name: 'Good Prediction',
            description: 'Model accurately predicts the next word with high confidence.'
        },
        uncertain: {
            name: 'Uncertain Prediction',
            description: 'Model is unsure and spreads probability across several candidates.'
        },
        bad: {
            name: 'Bad Prediction',
            description: 'Model is confident in the wrong continuation and underweights the truth.'
        }
    };

    const SCENARIO_TONES = {
        good: 'var(--tone-emerald-strong)',
        uncertain: 'var(--tone-sky-strong)',
        bad: 'var(--tone-rose-strong)'
    };

    const examples = [
        { context: 'The weather today is very', trueWord: 'sunny', scenario: 'good', note: 'Weather prediction - model should prefer weather adjectives' },
        { context: 'I love eating', trueWord: 'pizza', scenario: 'good', note: 'Food context - strong semantic cues' },
        { context: 'The movie was', trueWord: 'amazing', scenario: 'uncertain', note: 'Opinion context - many valid adjectives' },
        { context: 'Artificial intelligence will', trueWord: 'help', scenario: 'uncertain', note: 'Abstract future prediction - high uncertainty' },
        { context: 'The cat', trueWord: 'meowed', scenario: 'bad', note: 'Simple context but the model predicts poorly' },
        { context: 'The food tastes', trueWord: 'delicious', scenario: 'good', note: 'Food quality - sensory context' },
        { context: 'Programming can be', trueWord: 'challenging', scenario: 'uncertain', note: 'Subjective difficulty - multiple answers' }
    ];

    let exampleIndex = 0;

    function mixColor(tone, percentage, base = 'var(--color-card)') {
        const remainder = Math.max(0, 100 - percentage);
        return `color-mix(in srgb, ${tone} ${percentage}%, ${base} ${remainder}%)`;
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char] ?? char));
    }

    function getScenarioTone(key) {
        return SCENARIO_TONES[key] || SCENARIO_TONES.good;
    }

    function getCurrentScenario() {
        const selected = document.querySelector('input[name="q25-scenario"]:checked');
        return selected ? selected.value : 'good';
    }

    function resetScenarioCard(card) {
        if (!card) return;
        card.classList.remove('question-strategy-active');
        card.style.background = getCssVar('--color-card', '#f1f5f9');
        card.style.borderColor = getCssVar('--color-border-subtle', '#e2e8f0');
        card.style.boxShadow = 'none';
        card.style.color = getCssVar('--color-body', '#1e293b');
    }

    function applyScenarioCard(card, tone) {
        if (!card) return;
        card.classList.add('question-strategy-active');
        card.style.background = mixColor(tone, 12);
        card.style.borderColor = mixColor(tone, 32, 'var(--color-border-subtle)');
        card.style.boxShadow = '0 14px 32px -26px rgba(15, 23, 42, 0.6)';
        card.style.color = mixColor(tone, 65, 'var(--color-heading)');
    }

    function updateScenarioVisuals() {
        const scenario = getCurrentScenario();
        const tone = getScenarioTone(scenario);

        scenarioRadios.forEach((radio) => {
            const container = radio.closest('.question-strategy');
            if (radio.checked) {
                applyScenarioCard(container, tone);
            } else {
                resetScenarioCard(container);
            }
        });

        if (scenarioIndicator) {
            scenarioIndicator.className = 'strategy-indicator text-xs font-medium';
            scenarioIndicator.textContent = scenarioConfig[scenario]?.name ?? 'Scenario';
            scenarioIndicator.style.background = mixColor(tone, 16);
            scenarioIndicator.style.borderColor = mixColor(tone, 28, 'var(--color-border-subtle)');
            scenarioIndicator.style.color = mixColor(tone, 58, 'var(--color-heading)');
        }
    }

    function generateProbabilities(trueWord, scenario, contextWords) {
        const vocabulary = [
            trueWord,
            'and', 'the', 'of', 'to', 'a', 'in', 'is', 'it', 'you',
            'that', 'he', 'was', 'for', 'on', 'are', 'as', 'with',
            'his', 'they', 'at', 'be', 'this', 'have', 'from',
            'or', 'one', 'had', 'by', 'word', 'but', 'not',
            'what', 'all', 'were', 'we', 'when', 'your', 'can',
            'said', 'there', 'each', 'which', 'she', 'do', 'how'
        ];

        const contextRelevant = [];
        const context = contextWords.toLowerCase();

        if (context.includes('weather') || context.includes('today')) {
            contextRelevant.push('hot', 'cold', 'rainy', 'cloudy', 'sunny', 'windy', 'nice', 'warm', 'cool');
        } else if (context.includes('eating') || context.includes('food') || context.includes('tastes')) {
            contextRelevant.push('pizza', 'pasta', 'salad', 'fruit', 'vegetables', 'meat', 'fish', 'bread', 'delicious', 'awful', 'good', 'bad');
        } else if (context.includes('movie') || context.includes('film') || context.includes('book')) {
            contextRelevant.push('good', 'bad', 'amazing', 'terrible', 'funny', 'boring', 'exciting', 'interesting', 'awful', 'fantastic');
        } else if (context.includes('cat') || context.includes('dog')) {
            contextRelevant.push('ran', 'jumped', 'slept', 'meowed', 'barked', 'played', 'ate', 'walked');
        } else if (context.includes('artificial intelligence') || context.includes('machine learning') || context.includes('programming')) {
            contextRelevant.push('help', 'change', 'improve', 'transform', 'powerful', 'complex', 'difficult', 'easy', 'fascinating', 'challenging');
        } else {
            contextRelevant.push('good', 'bad', 'big', 'small', 'new', 'old', 'important', 'different');
        }

        const allWords = [...new Set([...vocabulary, ...contextRelevant])];
        if (!allWords.includes(trueWord)) {
            allWords[0] = trueWord;
        }

        const probabilities = {};
        let total = 0;

        switch (scenario) {
            case 'good': {
                const trueProbGood = 0.6 + Math.random() * 0.2;
                probabilities[trueWord] = trueProbGood;
                total = trueProbGood;

                const remainingGood = 1 - trueProbGood;
                contextRelevant.forEach((word) => {
                    if (word !== trueWord) {
                        const prob = (remainingGood / contextRelevant.length) * (0.5 + Math.random());
                        probabilities[word] = prob;
                        total += prob;
                    }
                });
                break;
            }
            case 'uncertain': {
                const trueProbUncertain = 0.2 + Math.random() * 0.2;
                probabilities[trueWord] = trueProbUncertain;
                total = trueProbUncertain;

                const remainingUncertain = 1 - trueProbUncertain;
                const topWords = [...contextRelevant, ...vocabulary.slice(0, 10)];
                topWords.forEach((word) => {
                    if (word !== trueWord) {
                        const prob = (remainingUncertain / topWords.length) * (0.3 + Math.random() * 1.4);
                        probabilities[word] = prob;
                        total += prob;
                    }
                });
                break;
            }
            case 'bad': {
                const trueProbBad = 0.02 + Math.random() * 0.08;
                probabilities[trueWord] = trueProbBad;
                total = trueProbBad;

                const irrelevantWords = ['elephant', 'quantum', 'refrigerator', 'parliament', 'xylophone'];
                irrelevantWords.forEach((word) => {
                    const prob = 0.1 + Math.random() * 0.2;
                    probabilities[word] = prob;
                    total += prob;
                });
                break;
            }
            default:
                break;
        }

        Object.keys(probabilities).forEach((word) => {
            probabilities[word] = probabilities[word] / total;
        });

        return Object.entries(probabilities)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8);
    }

    function calculateCrossEntropyLoss(predictions, trueWord) {
        const trueProb = predictions.find(([word]) => word === trueWord)?.[1] || 0.0001;
        return -Math.log(trueProb);
    }

    const processAndDisplay = () => {
        const context = contextInput.value.trim();
        const trueWord = trueWordInput.value.trim().toLowerCase();
        const scenario = getCurrentScenario();

        if (!context || !trueWord) {
            output.innerHTML = '<div class="panel panel-neutral-soft p-4 text-sm text-muted text-center">Select a context and true word to see the cross-entropy calculation.</div>';
            if (legend) legend.textContent = '';
            if (explanation) explanation.innerHTML = '';
            return;
        }

        updateScenarioVisuals();

        const predictions = generateProbabilities(trueWord, scenario, context);
        const loss = calculateCrossEntropyLoss(predictions, trueWord);
        const trueWordProb = predictions.find(([word]) => word === trueWord)?.[1] || 0;
        const perplexity = Math.exp(loss);
        const tone = getScenarioTone(scenario);
        const config = scenarioConfig[scenario];

        const highlightRow = mixColor('var(--tone-emerald-strong)', 18);

        const rows = predictions.map(([word, prob], index) => {
            const isTrue = word === trueWord;
            const badge = isTrue
                ? '<span class="chip chip-success text-xs">Correct</span>'
                : '<span class="chip chip-neutral text-xs">Predicted</span>';
            const rowStyle = isTrue ? ` style="background:${highlightRow};"` : '';
            return `
                <tr${rowStyle}>
                    <td class="px-3 py-2 text-sm">${index + 1}</td>
                    <td class="px-3 py-2 font-mono text-sm">${escapeHtml(word)}</td>
                    <td class="px-3 py-2 font-mono text-sm">${prob.toFixed(4)}</td>
                    <td class="px-3 py-2 font-mono text-sm">${(-Math.log(prob)).toFixed(3)}</td>
                    <td class="px-3 py-2">${badge}</td>
                </tr>
            `;
        }).join('');

        let lossBadgeClass = 'chip chip-warning text-xs';
        let lossBadgeText = 'High loss';
        if (loss < 1) {
            lossBadgeClass = 'chip chip-success text-xs';
            lossBadgeText = 'Low loss';
        } else if (loss < 2) {
            lossBadgeClass = 'chip chip-info text-xs';
            lossBadgeText = 'Moderate loss';
        }

        const parts = [];
        parts.push(`
            <div class="panel panel-neutral-soft p-3 space-y-1">
                <h5 class="font-medium text-heading">Prediction setup</h5>
                <div class="text-sm space-y-1">
                    <div><strong>Context:</strong> "${escapeHtml(context)}"</div>
                    <div><strong>True next word:</strong> "${escapeHtml(trueWord)}"</div>
                    <div><strong>Scenario:</strong> ${config?.name ?? 'Scenario'}</div>
                </div>
            </div>
        `);

        parts.push(`
            <div class="panel panel-neutral p-0 overflow-hidden">
                <div class="px-3 py-2 border-b border-subtle bg-subtle text-sm font-medium text-heading">Model's top predictions</div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-subtle text-secondary">
                            <tr>
                                <th class="px-3 py-2 text-left font-medium">Rank</th>
                                <th class="px-3 py-2 text-left font-medium">Word</th>
                                <th class="px-3 py-2 text-left font-medium">Probability</th>
                                <th class="px-3 py-2 text-left font-medium">-log(p)</th>
                                <th class="px-3 py-2 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `);

        parts.push(`
            <div class="panel panel-info panel-emphasis p-3 space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <h5 class="font-medium text-heading">Cross-entropy calculation</h5>
                    <span class="${lossBadgeClass}">${lossBadgeText}</span>
                </div>
                <div class="font-mono text-sm">L = -log(P(true_word)) = -log(P("${escapeHtml(trueWord)}"))</div>
                <div class="font-mono text-sm">L = -log(${trueWordProb.toFixed(4)}) = <strong>${loss.toFixed(3)}</strong></div>
            </div>
        `);

        parts.push(`
            <div class="panel panel-accent p-3">
                <div class="grid md:grid-cols-3 gap-4 text-sm text-center">
                    <div class="space-y-1">
                        <div class="text-2xl font-semibold text-heading">${(trueWordProb * 100).toFixed(1)}%</div>
                        <div class="text-muted">Model confidence</div>
                        <div class="text-xs text-muted">Probability on the correct token</div>
                    </div>
                    <div class="space-y-1">
                        <div class="text-2xl font-semibold text-heading">${loss.toFixed(2)}</div>
                        <div class="text-muted">Cross-entropy loss</div>
                        <div class="text-xs text-muted">0 is perfect, higher means more surprise</div>
                    </div>
                    <div class="space-y-1">
                        <div class="text-2xl font-semibold text-heading">${perplexity.toFixed(1)}</div>
                        <div class="text-muted">Perplexity</div>
                        <div class="text-xs text-muted">Model's effective surprise level</div>
                    </div>
                </div>
            </div>
        `);

        output.innerHTML = parts.join('');

        if (legend) {
            legend.textContent = `Context: "${context}" -> "${trueWord}" | Loss: ${loss.toFixed(3)} | Confidence: ${(trueWordProb * 100).toFixed(1)}% | Scenario: ${config?.name ?? 'Scenario'}`;
        }

        updateExplanation(scenario, loss, trueWordProb);
    };

    function updateExplanation(scenario, loss, trueWordProb) {
        if (!explanation) return;

        const config = scenarioConfig[scenario];
        let lossCategory;
        let gradientInfo;
        let trainingImpact;

        if (loss < 0.7) {
            lossCategory = 'Excellent prediction';
            gradientInfo = 'Small gradients - the model is confident and correct.';
            trainingImpact = 'Minimal weight updates needed; the model is learning well.';
        } else if (loss < 1.5) {
            lossCategory = 'Reasonable prediction';
            gradientInfo = 'Moderate gradients - the model needs some adjustment.';
            trainingImpact = 'Moderate weight updates to improve confidence.';
        } else if (loss < 3.0) {
            lossCategory = 'Poor prediction';
            gradientInfo = 'Large gradients - the model needs significant correction.';
            trainingImpact = 'Strong weight updates to fix miscalibrated probabilities.';
        } else {
            lossCategory = 'Very poor prediction';
            gradientInfo = 'Very large gradients - the model is badly miscalibrated.';
            trainingImpact = 'Major weight updates required, with risk of unstable training if pervasive.';
        }

        explanation.innerHTML = `
            <div class="space-y-3">
                <p><strong>Scenario analysis:</strong> ${config.description} The model assigned ${(trueWordProb * 100).toFixed(1)}% probability to "${escapeHtml(trueWordInput.value)}", yielding ${lossCategory.toLowerCase()}.</p>
                <p><strong>Loss impact:</strong> ${lossCategory} (loss = ${loss.toFixed(3)}). ${gradientInfo} During training this triggers ${trainingImpact.toLowerCase()}.</p>
                <p><strong>Why cross-entropy?</strong> The logarithmic penalty punishes confident mistakes far more than cautious guesses, keeping both accuracy and calibration in check.</p>
                <div class="panel panel-neutral-soft p-3 text-xs">
                    <strong>&#x1F4A1; Training insight:</strong> Encourage the model to be accurate and calibrated. Confidently wrong predictions (loss >= 3) flag areas where data augmentation or regularisation may be needed.
                </div>
            </div>
        `;
    }

    if (exampleBtn) {
        exampleBtn.addEventListener('click', () => {
            const example = examples[exampleIndex];
            contextInput.value = example.context;
            trueWordInput.value = example.trueWord;

            const scenarioRadio = document.querySelector(`input[name="q25-scenario"][value="${example.scenario}"]`);
            if (scenarioRadio) scenarioRadio.checked = true;

            processAndDisplay();

            exampleBtn.textContent = example.note;
            exampleBtn.title = `Example ${exampleIndex + 1}/${examples.length}: ${example.context} -> ${example.trueWord}`;

            exampleIndex = (exampleIndex + 1) % examples.length;
        });
    }

    contextInput.addEventListener('change', processAndDisplay);
    trueWordInput.addEventListener('change', processAndDisplay);
    scenarioRadios.forEach((radio) => radio.addEventListener('change', processAndDisplay));

    updateScenarioVisuals();
    processAndDisplay();
};

if (typeof module !== 'undefined') {
    module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
    window.question25Interactive = interactiveScript;
}


