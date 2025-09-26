const interactiveScript = () => {

            // Get DOM elements with error checking

            const wordSelect = document.getElementById('q10-word-select');

            const output = document.getElementById('q10-output');

            const compareGrid = document.getElementById('q10-compare-grid');

            const outputA = document.getElementById('q10-output-a');

            const outputB = document.getElementById('q10-output-b');

            const titleA = document.getElementById('q10-compare-title-a');

            const titleB = document.getElementById('q10-compare-title-b');

            const strategyRadios = document.querySelectorAll('input[name="q10-strategy"]');

            const contextRadios = document.querySelectorAll('input[name="q10-context"]');

            const exampleBtn = document.getElementById('q10-example-btn');

            const strategyIndicator = document.getElementById('q10-strategy-indicator');

            const legend = document.getElementById('q10-legend');

            const explanation = document.getElementById('q10-explanation');

            const contextSummary = document.getElementById('q10-context-summary');

            const contextSummaryName = document.getElementById('q10-specialized-name');

            const contextSummaryDesc = document.getElementById('q10-specialized-desc');

            const sortSelect = document.getElementById('q10-sort-select');

            const compareToggle = document.getElementById('q10-compare-toggle');

            const compareStrategySelect = document.getElementById('q10-compare-strategy');

            const resetBtn = document.getElementById('q10-reset-btn');

            if (!wordSelect || !output) {

                console.error('Required DOM elements not found for Question 10');

                return;

            }

            // Configuration data for different initialization strategies

            const configData = {

                random: {

                    name: 'Random Initialization',

                    description: 'Start with random vectors, learn everything from training data',

                    tone: 'emerald',

                    convergenceTime: '100-0 epochs',

                    dataNeeds: 'High'

                },

                pretrained: {

                    name: 'Pre-trained Initialization',

                    description: 'Use existing embeddings (Word2Vec, GloVe) as starting point',

                    tone: 'purple',

                    convergenceTime: '-50 epochs',

                    dataNeeds: 'Medium'

                },

                hybrid: {

                    name: 'Hybrid Initialization',

                    description: 'Combine pre-trained embeddings with random for new vocabulary',

                    tone: 'amber',

                    convergenceTime: '30-80 epochs',

                    dataNeeds: 'Medium-Low'

                }

            };

            // Context-specific similarity patterns

            const toneVarMap = {

                emerald: '--tone-emerald-strong',

                purple: '--tone-purple-strong',

                amber: '--tone-amber-strong',

                indigo: '--tone-indigo-strong',

                rose: '--tone-rose-strong'

            };

            const getCssVar = (name) => {

                const style = getComputedStyle(document.documentElement);

                return style.getPropertyValue(name).trim();

            };

            const toneColor = (tone) => {

                const varName = toneVarMap[tone] || '--tone-indigo-strong';

                const value = getCssVar(varName);

                if (value) return value;

                const fallback = getCssVar('--tone-indigo-strong');

                return fallback || 'hsl(227, 68%, 60%)';

            };

            const toneSurface = (tone, amount = 16) => `color-mix(in srgb, ${toneColor(tone)} ${amount}%, var(--color-card))`;

            const toneBorder = (tone, amount = 32) => `color-mix(in srgb, ${toneColor(tone)} ${amount}%, var(--color-border-subtle))`;

            const toneTransparent = (tone, amount = 24) => `color-mix(in srgb, ${toneColor(tone)} ${amount}%, transparent)`;

            const contextSimilarities = {

                general: {

                    dog: ['animal', 'pet', 'cat', 'mammal'],

                    cat: ['animal', 'pet', 'dog', 'feline'],

                    animal: ['creature', 'being', 'organism', 'life'],

                    pet: ['companion', 'friend', 'animal', 'dog'],

                    king: ['queen', 'royal', 'monarch', 'ruler'],

                    queen: ['king', 'royal', 'monarch', 'ruler'],

                    royal: ['nobility', 'crown', 'palace', 'kingdom'],

                    monarch: ['sovereign', 'ruler', 'throne', 'empire'],

                    happy: ['joyful', 'glad', 'content', 'pleased'],

                    sad: ['unhappy', 'depressed', 'sorrowful', 'blue'],

                    joyful: ['happy', 'elated', 'cheerful', 'delighted'],

                    depressed: ['sad', 'down', 'melancholy', 'dejected'],

                    computer: ['technology', 'machine', 'digital', 'electronic'],

                    software: ['program', 'application', 'code', 'system'],

                    algorithm: ['method', 'procedure', 'logic', 'process'],

                    data: ['information', 'facts', 'statistics', 'records'],

                    book: ['literature', 'novel', 'text', 'publication'],

                    read: ['study', 'peruse', 'examine', 'comprehend'],

                    write: ['compose', 'author', 'create', 'draft'],

                    author: ['writer', 'creator', 'novelist', 'poet'],

                    car: ['vehicle', 'automobile', 'transportation', 'motor'],

                    drive: ['operate', 'steer', 'navigate', 'pilot'],

                    road: ['street', 'highway', 'path', 'route'],

                    traffic: ['vehicles', 'congestion', 'flow', 'circulation'],

                    heart: ['organ', 'body', 'health', 'pulse'],

                    brain: ['mind', 'organ', 'thought', 'intelligence'],

                    medicine: ['drug', 'treatment', 'healing', 'remedy'],

                    doctor: ['physician', 'professional', 'healer', 'expert'],

                    therapy: ['treatment', 'healing', 'recovery', 'care'],

                    treatment: ['therapy', 'care', 'healing', 'procedure'],

                    diagnosis: ['identification', 'assessment', 'analysis', 'evaluation'],

                    prescription: ['medicine', 'order', 'instruction', 'treatment']

                },

                specialized: {

                    // Political Science Domain (Royalty & Hierarchy)

                    king: ['sovereignty', 'governance', 'legitimacy', 'authority'],

                    queen: ['monarchy', 'regency', 'succession', 'dynasty'],

                    royal: ['aristocracy', 'peerage', 'nobility', 'court'],

                    monarch: ['absolutism', 'constitutional', 'divine right', 'succession'],

                    

                    // Psychology Domain (Emotions)

                    happy: ['positive affect', 'wellbeing', 'dopamine', 'euphoria'],

                    sad: ['depression', 'melancholia', 'dysthymia', 'grief'],

                    joyful: ['elation', 'bliss', 'exuberance', 'jubilation'],

                    depressed: ['clinical depression', 'major depressive', 'anhedonia', 'dysphoria'],

                    

                    // Medical Domain (Medical Terms)

                    heart: ['cardiac', 'coronary', 'myocardial', 'valve'],

                    brain: ['neural', 'cerebral', 'cognitive', 'cortex'],

                    medicine: ['pharmacology', 'therapeutics', 'pharmaceutical', 'dosage'],

                    doctor: ['physician', 'clinician', 'practitioner', 'specialist'],

                    therapy: ['rehabilitation', 'intervention', 'protocol', 'modality'],

                    treatment: ['therapeutic', 'intervention', 'protocol', 'regimen'],

                    diagnosis: ['differential', 'pathology', 'clinical assessment', 'nosology'],

                    prescription: ['medication', 'pharmaceutical', 'dosage', 'contraindication'],

                    

                    // Computer Science Domain (Technology)

                    computer: ['computational', 'processor', 'architecture', 'algorithm'],

                    software: ['programming', 'codebase', 'framework', 'library'],

                    algorithm: ['complexity', 'optimization', 'recursion', 'efficiency'],

                    data: ['database', 'dataset', 'metadata', 'schema'],

                    

                    // Literary Studies Domain (Literature)

                    book: ['manuscript', 'narrative', 'genre', 'canon'],

                    read: ['interpretation', 'hermeneutics', 'close reading', 'analysis'],

                    write: ['composition', 'rhetoric', 'discourse', 'authorship'],

                    author: ['authorial intent', 'voice', 'persona', 'biography'],

                    

                    // Transportation Systems Domain (Transportation)

                    car: ['vehicle', 'automotive', 'transportation', 'mobility'],

                    drive: ['navigation', 'traffic flow', 'route optimization', 'logistics'],

                    road: ['infrastructure', 'transportation network', 'traffic engineering', 'corridor'],

                    traffic: ['flow dynamics', 'congestion management', 'capacity', 'throughput'],

                    

                    // Veterinary/Animal Science Domain (Animals & Pets)

                    dog: ['canine', 'domestication', 'breeding', 'behavior'],

                    cat: ['feline', 'domestication', 'territorial', 'predatory'],

                    animal: ['zoology', 'ethology', 'taxonomy', 'habitat'],

                    pet: ['companion animal', 'domestication', 'human-animal bond', 'welfare']

                }

            };

            // Word set to specialized domain mapping

            const wordSetDomains = {

                'dog cat animal pet': {

                    name: 'Veterinary Science',

                    description: 'Animal health, behavior, and companion animal studies',                },

                'king queen royal monarch': {

                    name: 'Political Science',

                    description: 'Governance, monarchy, and political structures',                },

                'happy sad joyful depressed': {

                    name: 'Psychology',

                    description: 'Emotional states, mental health, and cognitive science',                },

                'heart brain medicine doctor': {

                    name: 'Medical Science',

                    description: 'Healthcare, anatomy, and medical terminology',                },

                'therapy treatment diagnosis prescription': {

                    name: 'Clinical Medicine',

                    description: 'Medical procedures, treatment protocols, and clinical practice',                },

                'computer software algorithm data': {

                    name: 'Computer Science',

                    description: 'Computing, programming, and information technology',                },

                'book read write author': {

                    name: 'Literary Studies',

                    description: 'Literature, authorship, and textual analysis',                },

                'car drive road traffic': {

                    name: 'Transportation Systems',

                    description: 'Traffic engineering, logistics, and transportation planning',                }

            };

            const defaultContextSummary = {

                general: {

                    name: 'General language',

                    description: 'Broad corpora such as Wikipedia or Common Crawl with diverse vocabulary.'

                },

                specialized: {

                    name: 'Specialized domain',

                    description: 'Tune vectors toward domain-specific terminology and relationships.'

                }

            };

            function updateContextSummary(mode, domain = null) {

                if (!contextSummaryName || !contextSummaryDesc) return;

                const state = mode === 'specialized' ? 'specialized' : 'general';

                const summary = state === 'specialized'

                    ? (domain || defaultContextSummary.specialized)

                    : defaultContextSummary.general;

                contextSummaryName.textContent = summary.name;

                contextSummaryDesc.textContent = summary.description;

                contextSummaryName.className = state === 'specialized'

                    ? 'chip chip-warning text-xs'

                    : 'chip chip-info text-xs';

                if (contextSummary) {

                    contextSummary.dataset.state = state;

                }

            }

            updateContextSummary('general');

            // Helper function to get current strategy

            function getCurrentStrategy() {

                const selectedRadio = document.querySelector('input[name="q10-strategy"]:checked');

                return selectedRadio ? selectedRadio.value : 'random';

            }

            // Helper function to get current context

            function getCurrentContext() {

                const selectedRadio = document.querySelector('input[name="q10-context"]:checked');

                return selectedRadio ? selectedRadio.value : 'general';

            }

            // Simple hash function for consistent randomness

            function hashCode(str) {

                let hash = 0;

                for (let i = 0; i < str.length; i++) {

                    const char = str.charCodeAt(i);

                    hash = ((hash << 5) - hash) + char;

                    hash = hash & hash;

                }

                return Math.abs(hash);

            }

            // Deterministic pseudo-random based on seed

            function seededRandom(seed) {

                const x = Math.sin(seed) * 10000;

                return x - Math.floor(x);

            }

            // Helper function to determine appropriate context and update specialized domain display

            function getRecommendedContext(selectedValue) {

                if (wordSetDomains[selectedValue]) {

                    updateContextSummary('specialized', wordSetDomains[selectedValue]);

                    return 'specialized';

                }

                updateContextSummary('general');

                return 'general';

            }



            // Simulate embedding evolution

            function simulateEmbeddingEvolution(words, strategy, context) {

                const results = [];

                const similarities = contextSimilarities[context];

                

                words.forEach((word) => {

                    const wordLower = word.toLowerCase();

                    const relatedWords = similarities[wordLower] || ['similar', 'related', 'associated', 'connected'];

                    

                    // Include context in seed calculation for different results

                    const baseWordSeed = hashCode(wordLower + strategy);

                    const contextMultiplier = context === 'specialized' ? 1000 : 1; // Big difference for context

                    const wordSeed = baseWordSeed + contextMultiplier;

                    const dimensionSeed = hashCode(wordLower + strategy + context + 'dimensions');

                    

                    const rand1 = seededRandom(wordSeed);

                    const rand2 = seededRandom(wordSeed + 1);

                    const rand3 = seededRandom(wordSeed + 2);

                    

                    let initialSimilarity, finalSimilarity, convergenceSpeed;

                    

                    switch(strategy) {

                        case 'random':

                            initialSimilarity = rand1 * 0.3;

                            finalSimilarity = rand2 * 0.4 + 0.6;

                            convergenceSpeed = 'Slow';

                            break;

                        case 'pretrained':

                            initialSimilarity = rand1 * 0.3 + 0.4;

                            finalSimilarity = rand2 * 0.2 + 0.8;

                            convergenceSpeed = 'Fast';

                            break;

                        case 'hybrid':

                            initialSimilarity = rand1 * 0.3 + 0.3;

                            finalSimilarity = rand2 * 0.25 + 0.75;

                            convergenceSpeed = 'Medium';

                            break;

                    }

                    // Context adjustments - make the difference much more noticeable

                    if (context === 'specialized' && similarities[wordLower]) {

                        // Specialized context shows much higher similarity and faster convergence

                        finalSimilarity = Math.min(0.98, finalSimilarity + 0.2);

                        initialSimilarity = Math.min(0.85, initialSimilarity + 0.15);

                    } else if (context === 'general') {

                        // General context shows more moderate similarities

                        finalSimilarity = Math.max(0.4, finalSimilarity - 0.1);

                        initialSimilarity = Math.max(0.05, initialSimilarity - 0.05);

                    }

                    results.push({

                        word: word,

                        initialSimilarity: initialSimilarity,

                        finalSimilarity: finalSimilarity,

                        convergenceSpeed: convergenceSpeed,

                        relatedWords: relatedWords.slice(0, 3),

                        dimensions: Math.floor(seededRandom(dimensionSeed) * 512) + 256

                    });

                });

                return results;

            }

            function sortResults(results, by){

                const arr=[...results];

                if(by==='alpha') return arr.sort((a,b)=>a.word.localeCompare(b.word));

                if(by==='improvement') return arr.sort((a,b)=>((b.finalSimilarity-b.initialSimilarity)-(a.finalSimilarity-a.initialSimilarity)));

                return arr.sort((a,b)=>b.finalSimilarity-a.finalSimilarity);

            }

            function renderResultsInto(container, results, config, context, currentDomain, sortBy){

                container.innerHTML='';

                const sorted = sortResults(results, sortBy);

                const evolutionContainer = document.createElement('div');

                evolutionContainer.className='space-y-4';

                sorted.forEach((result) => {

                    const wordContainer = document.createElement('div');

                    wordContainer.className = 'panel panel-neutral-soft p-4 space-y-3 hover:shadow-lg transition-shadow';

                    wordContainer.style.backgroundColor = toneSurface(config.tone, 18);

                    wordContainer.style.borderColor = toneBorder(config.tone, 38);

                    const initialPercentage = (result.initialSimilarity * 100).toFixed(1);

                    const finalPercentage = (result.finalSimilarity * 100).toFixed(1);

                    const improvement = (result.finalSimilarity - result.initialSimilarity) * 100;

                    const contextLabel = context === 'general' ? 'general context' : (currentDomain ? `${currentDomain.name.toLowerCase()} context` : 'specialized context');

                    wordContainer.innerHTML = `

                        <div class="flex items-center justify-between mb-3">

                            <h5 class="font-semibold text-lg" style="color: ${toneColor(config.tone)}">${result.word}</h5>

                            <span class="text-xs px-2 py-1 rounded" style="background-color: ${toneTransparent(config.tone, 22)}; color: ${toneColor(config.tone)}">

                                ${result.dimensions}D vector

                            </span>

                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-3">

                            <div class="panel panel-neutral-soft p-3 text-center space-y-1">

                                <div class="text-sm text-muted">Initial Similarity</div>

                                <div class="text-lg font-bold text-danger">${initialPercentage}%</div>

                                <div class="text-xs text-muted-soft">To related words</div>

                            </div>

                            <div class="panel panel-neutral-soft p-3 text-center space-y-1">

                                <div class="text-sm text-muted">Final Similarity</div>

                                <div class="text-lg font-bold text-success">${finalPercentage}%</div>

                                <div class="text-xs text-muted-soft">After training</div>

                            </div>

                        </div>

                        <div class="mb-3">

                            <div class="text-sm text-muted mb-1">Training Progress</div>

                            <div class="w-full h-2 rounded-full bg-subtle">

                                <div class="h-2 rounded-full transition-all duration-500" style="background: linear-gradient(90deg, color-mix(in srgb, var(--tone-rose-strong) 45%, transparent), color-mix(in srgb, var(--tone-emerald-strong) 55%, transparent)); width: ${finalPercentage}%"></div>

                            </div>

                            <div class="text-xs text-muted-soft mt-1">Improvement: +${improvement.toFixed(1)}% | Speed: ${result.convergenceSpeed}</div>

                        </div>

                        <div class="text-sm">

                            <div class="text-muted mb-1">Related words in ${contextLabel}:</div>

                            <div class="flex flex-wrap gap-1 p-2 panel panel-neutral-soft">

                                ${result.relatedWords.map(word => `<span class="px-2 py-1 text-xs rounded" style="background-color: ${toneTransparent(config.tone, 22)}; color: ${toneColor(config.tone)}">${word}</span>`).join('')}

                            </div>

                        </div>`;

                    evolutionContainer.appendChild(wordContainer);

                });

                container.appendChild(evolutionContainer);

                // Stats summary

                const statsEl = document.createElement('div');

                statsEl.className = 'panel panel-neutral-soft mt-4 p-3 text-sm grid grid-cols-2 md:grid-cols-4 gap-3';

                const avgInitial = sorted.reduce((sum, r) => sum + r.initialSimilarity, 0) / sorted.length;

                const avgFinal = sorted.reduce((sum, r) => sum + r.finalSimilarity, 0) / sorted.length;

                const avgImprovement = ((avgFinal - avgInitial) * 100);

                statsEl.innerHTML = `

                    <div class="text-center"><div class="text-lg font-bold" style="color: ${toneColor(config.tone)}">${sorted.length}</div><div class="text-muted text-xs">Words Analyzed</div></div>

                    <div class="text-center"><div class="text-lg font-bold text-accent">${config.convergenceTime}</div><div class="text-muted text-xs">Training Time</div></div>

                    <div class="text-center"><div class="text-lg font-bold text-success">${avgImprovement.toFixed(1)}%</div><div class="text-muted text-xs">Avg Improvement</div></div>

                    <div class="text-center"><div class="text-lg font-bold text-accent">${config.dataNeeds}</div><div class="text-muted text-xs">Data Needs</div></div>`;

                container.appendChild(statsEl);

            }

            // Process and display embeddings

            function processAndDisplay() {

                const selectedValue = wordSelect.value.trim();

                if (!selectedValue) {

                    output.innerHTML = '<div class="text-muted-soft text-center py-8">Select words above to see how their embeddings evolve</div>';

                    return;

                }

                const words = selectedValue.split(/\s+/).filter(word => word.length > 0);

                const strategy = getCurrentStrategy();

                let context = getCurrentContext();

                

                // Don't auto-switch context if user manually selected it recently

                if (!q10ManualContextSelection) {

                    // Auto-switch context based on word selection and update specialized domain display

                    const recommendedContext = getRecommendedContext(selectedValue);

                    if (recommendedContext !== context) {

                        const targetRadio = document.querySelector(`input[name="q10-context"][value="${recommendedContext}"]`);

                        if (targetRadio) {

                            targetRadio.checked = true;

                            context = recommendedContext;

                            updateStrategyVisuals();

                        }

                    }

                }

                const config = configData[strategy];

                // Get current domain info for display

                const currentDomain = context === 'specialized' && wordSetDomains[selectedValue] ?

                    wordSetDomains[selectedValue] : null;

                updateContextSummary(context, currentDomain);

                // Update strategy indicator

                if (strategyIndicator) {

                    const contextLabel = context === 'general' ? 'General Context' : 

                        (currentDomain ? `${currentDomain.name} Context` : 'Specialized Context');

                    strategyIndicator.textContent = `${config.name} (${contextLabel})`;

                    strategyIndicator.style.backgroundColor = toneSurface(config.tone, 18);

                    strategyIndicator.style.color = toneColor(config.tone);

                }

                // Simulate embedding evolution

                const results = simulateEmbeddingEvolution(words, strategy, context);

                const sortBy = sortSelect?.value || 'final';

                const otherStrategy = compareStrategySelect?.value || 'pretrained';

                if(compareToggle?.checked){

                    output.classList.add('hidden');

                    compareGrid?.classList.remove('hidden');

                    if(titleA) titleA.textContent = `${configData[strategy].name}`;

                    if(titleB) titleB.textContent = `${configData[otherStrategy].name}`;

                    const resultsB = simulateEmbeddingEvolution(words, otherStrategy, context);

                    renderResultsInto(outputA, results, configData[strategy], context, currentDomain, sortBy);

                    renderResultsInto(outputB, resultsB, configData[otherStrategy], context, currentDomain, sortBy);

                } else {

                    compareGrid?.classList.add('hidden');

                    output.classList.remove('hidden');

                    renderResultsInto(output, results, config, context, currentDomain, sortBy);

                }

                // Update legend

                if (legend) {

                    legend.innerHTML = `

                        <div class="flex flex-wrap items-center justify-center gap-4 text-xs">

                            <div class="flex items-center gap-1">

                                <div class="q10-legend-dot" style="background-color: ${toneTransparent(config.tone, 26)}; box-shadow: 0 0 0 1px ${toneBorder(config.tone, 36)};"></div>

                                <span>${config.name}</span>

                            </div>

                            <div class="flex items-center gap-1">

                                <div class="q10-legend-dot q10-legend-dot--initial"></div>

                                <span>Initial state</span>

                            </div>

                            <div class="flex items-center gap-1">

                                <div class="q10-legend-dot q10-legend-dot--final"></div>

                                <span>After training</span>

                            </div>

                        </div>

                    `;

                }

                // Update explanation

                updateExplanation(strategy, context, selectedValue);

            }

            // Update strategy visuals

            function updateStrategyVisuals() {

                document.querySelectorAll('input[name="q10-strategy"]').forEach((radio) => {

                    const card = radio.closest('label')?.querySelector('.q10-card');

                    if (!card) return;

                    const tone = configData[radio.value]?.tone || 'indigo';

                    card.dataset.tone = tone;

                    card.dataset.active = radio.checked ? 'true' : 'false';

                });

                document.querySelectorAll('input[name="q10-context"]').forEach((radio) => {

                    const card = radio.closest('label')?.querySelector('.q10-card');

                    if (!card) return;

                    const tone = radio.value === 'general' ? 'indigo' : 'rose';

                    card.dataset.tone = tone;

                    card.dataset.active = radio.checked ? 'true' : 'false';

                });

            }

            // Update educational explanation

            function updateExplanation(strategy, context, selectedValue = null) {

                if (!explanation) return;

                

                const config = configData[strategy];

                const currentDomain = context === 'specialized' && selectedValue && wordSetDomains[selectedValue] ? 

                    wordSetDomains[selectedValue] : null;

                const contextName = context === 'general' ? 'General Language' : 

                    (currentDomain ? currentDomain.name : 'Specialized Domain');

                

                const explanations = {
                    random: `
                        <strong>Random Initialization</strong> starts embeddings with random values from a normal distribution.
                        <ul class="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Training Process:</strong> The model learns word relationships entirely from your training data</li>
                            <li><strong>Advantage:</strong> No pre-existing bias, can discover domain-specific patterns</li>
                            <li><strong>Challenge:</strong> Requires substantial training data and longer convergence time</li>
                            <li><strong>Best for:</strong> Specialized domains, novel languages, or when you have abundant training data</li>
                        </ul>
                    `,
                    pretrained: `
                        <strong>Pre-trained Initialization</strong> uses embeddings trained on large corpora (Wikipedia, Common Crawl).
                        <ul class="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Knowledge Transfer:</strong> Starts with rich semantic understanding from general language</li>
                            <li><strong>Advantage:</strong> Faster convergence, better performance with limited data</li>
                            <li><strong>Challenge:</strong> May carry biases from original training data</li>
                            <li><strong>Best for:</strong> General applications, limited training data, transfer learning scenarios</li>
                        </ul>
                    `,
                    hybrid: `
                        <strong>Hybrid Initialization</strong> combines pre-trained embeddings for known words with random initialization for new vocabulary.
                        <ul class="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Balanced Approach:</strong> Leverages existing knowledge while allowing new learning</li>
                            <li><strong>Advantage:</strong> Handles both common and domain-specific vocabulary effectively</li>
                            <li><strong>Challenge:</strong> Requires careful alignment between pre-trained and random embeddings</li>
                            <li><strong>Best for:</strong> Domain adaptation, extending vocabulary, production systems</li>
                        </ul>
                    `
                };

                

                explanation.innerHTML = `

                    ${explanations[strategy]}

                    <br><br>

                    <strong>Context Impact (${contextName}):</strong> ${context === 'general' ? 

                        'Words develop broad semantic relationships useful for general language understanding.' : 

                        currentDomain ? 

                            `Words evolve specialized meanings relevant to ${currentDomain.name.toLowerCase()} terminology and relationships.` :

                            'Words develop domain-specific semantic relationships.'

                    }

                `;

            }

            // Example cycling functionality

            const examples = [

                { words: 'dog cat animal pet', strategy: 'random', context: 'general' },

                { words: 'heart brain medicine doctor', strategy: 'pretrained', context: 'specialized' },

                { words: 'king queen royal monarch', strategy: 'hybrid', context: 'general' },

                { words: 'happy sad joyful depressed', strategy: 'pretrained', context: 'specialized' },

                { words: 'therapy treatment diagnosis prescription', strategy: 'hybrid', context: 'specialized' }

            ];

            

            let exampleIndex = 0;

            if (exampleBtn) {

                exampleBtn.addEventListener('click', () => {

                    const example = examples[exampleIndex % examples.length];

                    

                    // Find and select the matching option in the dropdown

                    const options = wordSelect.querySelectorAll('option');

                    for (let option of options) {

                        if (option.value === example.words) {

                            wordSelect.value = example.words;

                            break;

                        }

                    }

                    

                    document.querySelector(`input[name="q10-strategy"][value="${example.strategy}"]`).checked = true;

                    document.querySelector(`input[name="q10-context"][value="${example.context}"]`).checked = true;

                    updateStrategyVisuals();

                    processAndDisplay();

                    exampleIndex++;

                    

                    // Update button text for next example

                    const nextExample = examples[exampleIndex % examples.length];

                    const nextWords = nextExample.words.split(' ').slice(0, 2).join(' ');

                    exampleBtn.innerHTML = `Try: "${nextWords}..."`;

                });

            }

            // Event listeners

            // Persistence helpers

            function saveState(){

                try{

                    const state={

                        words: wordSelect.value,

                        strategy: getCurrentStrategy(),

                        context: getCurrentContext(),

                        sort: sortSelect?.value,

                        compare: !!compareToggle?.checked,

                        compareWith: compareStrategySelect?.value

                    };

                    localStorage.setItem('q10_state', JSON.stringify(state));

                }catch{}

            }

            function loadState(){

                try{

                    const raw=localStorage.getItem('q10_state'); if(!raw) return;

                    const state=JSON.parse(raw);

                    if(state.words){ wordSelect.value=state.words; }

                    if(state.strategy){ const r=document.querySelector(`input[name="q10-strategy"][value="${state.strategy}"]`); if(r) r.checked=true; }

                    if(state.context){ const r=document.querySelector(`input[name="q10-context"][value="${state.context}"]`); if(r) r.checked=true; }

                    if(state.sort && sortSelect){ sortSelect.value=state.sort; }

                    if(compareToggle){ compareToggle.checked=!!state.compare; }

                    if(state.compareWith && compareStrategySelect){ compareStrategySelect.value=state.compareWith; }

                }catch{}

            }

            wordSelect.addEventListener('change', ()=>{ processAndDisplay(); saveState(); });

            

            strategyRadios.forEach(radio => {

                radio.addEventListener('change', () => { updateStrategyVisuals(); processAndDisplay(); saveState(); });

            });

            contextRadios.forEach(radio => {

                radio.addEventListener('change', () => {

                    q10ManualContextSelection = true; // Mark as manual selection

                    updateStrategyVisuals();

                    processAndDisplay();

                    saveState();

                    setTimeout(() => { q10ManualContextSelection = false; }, 00);

                });

            });

            // Additional click handlers for context labels to ensure they work

            document.querySelectorAll('input[name="q10-context"]').forEach(radio => {

                const label = radio.closest('label');

                if (label) {

                    label.addEventListener('click', (e) => {

                        // Prevent double firing if radio button was clicked directly

                        if (e.target === radio) return;

                        

                        radio.checked = true;

                        q10ManualContextSelection = true; // Mark as manual selection

                        

                        // Trigger change event

                        radio.dispatchEvent(new Event('change'));

                    });

                }

            });

            function updateCompareUIState(){

                if(!compareStrategySelect) return;

                const on = !!compareToggle?.checked;

                compareStrategySelect.disabled = !on;

                compareStrategySelect.classList.toggle('opacity-50', !on);

                compareStrategySelect.classList.toggle('cursor-not-allowed', !on);

            }

            sortSelect?.addEventListener('change', ()=>{ processAndDisplay(); saveState(); });

            compareToggle?.addEventListener('change', ()=>{ updateCompareUIState(); processAndDisplay(); saveState(); });

            compareStrategySelect?.addEventListener('change', ()=>{ processAndDisplay(); saveState(); });

            resetBtn?.addEventListener('click', ()=>{

                localStorage.removeItem('q10_state');

                // Defaults

                wordSelect.selectedIndex=0;

                document.querySelector('input[name="q10-strategy"][value="random"]').checked=true;

                document.querySelector('input[name="q10-context"][value="general"]').checked=true;

                if(sortSelect) sortSelect.value='final';

                if(compareToggle) compareToggle.checked=false;

                if(compareStrategySelect) compareStrategySelect.value='pretrained';

                updateStrategyVisuals();

                updateCompareUIState();

                processAndDisplay();

            });

            // Initial setup

            let q10ManualContextSelection = false;

            loadState();

            updateStrategyVisuals();

            updateCompareUIState();

            processAndDisplay();

            saveState();

        };

if (typeof module !== 'undefined') {

  module.exports = interactiveScript;

} else if (typeof window !== 'undefined') {

  window.question10Interactive = interactiveScript;

}

