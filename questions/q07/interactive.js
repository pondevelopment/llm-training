const interactiveScript = () => {
            // Visualization mode management
            const vizTypeRadios = document.querySelectorAll('input[name="q7-viz-type"]');
            const similarityPanel = document.getElementById('q7-similarity-panel');
            const arithmeticPanel = document.getElementById('q7-arithmetic-panel');
            const contextPanel = document.getElementById('q7-context-panel');
            const svgSpace = document.getElementById('q7-svg-space');
            const tooltip = document.getElementById('q7-hover-tooltip');
            const explanation = document.getElementById('q7-explanation');
            
            // Common controls
            const exampleBtn = document.getElementById('q7-example-btn');
            const randomBtn = document.getElementById('q7-random-btn');
            
            // Simplified word embeddings for demonstration (normally 512+ dimensions)
            const embeddings = {
                // Animals cluster
                'cat': { x: 100, y: 80, vector: [0.8, 0.2, 0.1, 0.9, 0.3] },
                'dog': { x: 140, y: 90, vector: [0.7, 0.3, 0.2, 0.8, 0.4] },
                'kitten': { x: 85, y: 65, vector: [0.85, 0.15, 0.05, 0.95, 0.2] },
                'puppy': { x: 155, y: 75, vector: [0.75, 0.25, 0.15, 0.85, 0.35] },
                'tiger': { x: 120, y: 50, vector: [0.6, 0.4, 0.3, 0.7, 0.5] },
                
                // Royalty/People cluster
                'king': { x: 280, y: 60, vector: [0.1, 0.9, 0.8, 0.2, 0.7] },
                'queen': { x: 320, y: 80, vector: [0.2, 0.8, 0.7, 0.3, 0.8] },
                'prince': { x: 260, y: 40, vector: [0.15, 0.85, 0.75, 0.25, 0.65] },
                'princess': { x: 340, y: 60, vector: [0.25, 0.75, 0.65, 0.35, 0.75] },
                'man': { x: 220, y: 120, vector: [0.3, 0.7, 0.4, 0.4, 0.6] },
                'woman': { x: 250, y: 140, vector: [0.4, 0.6, 0.3, 0.5, 0.7] },
                
                // Geography cluster
                'france': { x: 80, y: 240, vector: [0.5, 0.1, 0.9, 0.6, 0.2] },
                'germany': { x: 120, y: 260, vector: [0.45, 0.15, 0.85, 0.65, 0.25] },
                'paris': { x: 60, y: 280, vector: [0.55, 0.05, 0.95, 0.55, 0.15] },
                'berlin': { x: 140, y: 280, vector: [0.4, 0.2, 0.8, 0.7, 0.3] },
                
                // Emotions cluster
                'happy': { x: 180, y: 200, vector: [0.2, 0.3, 0.1, 0.8, 0.9] },
                'sad': { x: 200, y: 240, vector: [0.8, 0.7, 0.9, 0.2, 0.1] },
                'joy': { x: 160, y: 180, vector: [0.1, 0.2, 0.05, 0.9, 0.95] },
                'angry': { x: 220, y: 220, vector: [0.9, 0.8, 0.7, 0.1, 0.2] },
                
                // Actions cluster
                'walk': { x: 300, y: 180, vector: [0.3, 0.4, 0.2, 0.6, 0.5] },
                'run': { x: 330, y: 160, vector: [0.2, 0.5, 0.3, 0.7, 0.6] },
                'walking': { x: 280, y: 200, vector: [0.35, 0.35, 0.25, 0.65, 0.55] },
                'running': { x: 350, y: 180, vector: [0.15, 0.55, 0.35, 0.75, 0.65] },
                
                // Tech cluster
                'computer': { x: 160, y: 120, vector: [0.6, 0.1, 0.3, 0.4, 0.8] },
                'programming': { x: 140, y: 140, vector: [0.7, 0.05, 0.25, 0.3, 0.85] },
                'algorithm': { x: 180, y: 100, vector: [0.65, 0.15, 0.35, 0.35, 0.75] }
            };

            // Enhanced word relationships for contextual examples
            const contextualExamples = {
                'bank': {
                    financial: {
                        sentence: "I went to the bank to deposit money.",
                        neighbors: ['money', 'deposit', 'account', 'financial'],
                        vector: [0.1, 0.9, 0.8, 0.2, 0.1]
                    },
                    river: {
                        sentence: "We sat by the bank of the river.",
                        neighbors: ['river', 'shore', 'water', 'edge'],
                        vector: [0.8, 0.1, 0.2, 0.9, 0.8]
                    }
                },
                'bark': {
                    dog: {
                        sentence: "The dog's bark was very loud.",
                        neighbors: ['dog', 'sound', 'noise', 'animal'],
                        vector: [0.8, 0.2, 0.1, 0.9, 0.3]
                    },
                    tree: {
                        sentence: "The bark of the oak tree was rough.",
                        neighbors: ['tree', 'wood', 'surface', 'rough'],
                        vector: [0.2, 0.8, 0.9, 0.1, 0.7]
                    }
                },
                'bat': {
                    animal: {
                        sentence: "The bat flew through the cave.",
                        neighbors: ['animal', 'flying', 'cave', 'mammal'],
                        vector: [0.9, 0.1, 0.2, 0.8, 0.3]
                    },
                    sports: {
                        sentence: "He swung the baseball bat hard.",
                        neighbors: ['baseball', 'sports', 'swing', 'equipment'],
                        vector: [0.1, 0.9, 0.8, 0.2, 0.7]
                    }
                }
            };

            let currentMode = 'similarity';
            let currentQueryWord = 'king';
            let selectedWords = [];

            // Calculate cosine similarity between vectors
            function calculateCosineSimilarity(vec1, vec2) {
                if (!vec1 || !vec2 || vec1.length !== vec2.length) return 0;
                
                const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
                const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
                const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
                
                return dotProduct / (magnitude1 * magnitude2);
            }

            // Render embedding space visualization
            function renderEmbeddingSpace() {
                svgSpace.innerHTML = '';
                
                Object.entries(embeddings).forEach(([word, data]) => {
                    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    group.setAttribute('cursor', 'pointer');
                    
                    // Create circle
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', data.x);
                    circle.setAttribute('cy', data.y);
                    circle.setAttribute('r', '6');
                    
                    // Color based on similarity to query word if in similarity mode
                    let color = '#94a3b8'; // default gray
                    if (currentMode === 'similarity' && currentQueryWord && embeddings[currentQueryWord]) {
                        if (word === currentQueryWord) {
                            color = '#3b82f6'; // blue for query
                        } else {
                            const similarity = calculateCosineSimilarity(
                                embeddings[currentQueryWord].vector,
                                data.vector
                            );
                            if (similarity > 0.7) color = '#22c55e'; // green for similar
                            else if (similarity > 0.5) color = '#f59e0b'; // orange for somewhat similar
                        }
                    }
                    
                    circle.setAttribute('fill', color);
                    circle.setAttribute('stroke', '#ffffff');
                    circle.setAttribute('stroke-width', '2');
                    
                    // Create text
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', data.x);
                    text.setAttribute('y', data.y - 12);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '12');
                    text.setAttribute('font-weight', '600');
                    text.setAttribute('fill', '#374151');
                    text.textContent = word;
                    
                    // Add hover effects
                    group.addEventListener('mouseenter', (e) => {
                        circle.setAttribute('r', '8');
                        circle.setAttribute('stroke-width', '3');
                        
                        // Show tooltip
                        const similarity = currentQueryWord && embeddings[currentQueryWord] ? 
                            (calculateCosineSimilarity(embeddings[currentQueryWord].vector, data.vector) * 100).toFixed(1) + '%' :
                            'N/A';
                        tooltip.textContent = word + ' (similarity: ' + similarity + ')';
                        tooltip.style.opacity = '1';
                        tooltip.style.left = (e.pageX + 10) + 'px';
                        tooltip.style.top = (e.pageY - 30) + 'px';
                    });
                    
                    group.addEventListener('mouseleave', () => {
                        circle.setAttribute('r', '6');
                        circle.setAttribute('stroke-width', '2');
                        tooltip.style.opacity = '0';
                    });
                    
                    group.addEventListener('click', () => {
                        if (currentMode === 'similarity') {
                            currentQueryWord = word;
                            document.getElementById('q7-query-word').value = word;
                            searchSimilarWords();
                        }
                        renderEmbeddingSpace();
                    });
                    
                    group.appendChild(circle);
                    group.appendChild(text);
                    svgSpace.appendChild(group);
                });
            }

            // Mode switching
            function switchMode(mode) {
                currentMode = mode;
                
                // Hide all panels
                similarityPanel.classList.add('hidden');
                arithmeticPanel.classList.add('hidden');
                contextPanel.classList.add('hidden');
                
                // Show selected panel and update explanation
                switch(mode) {
                    case 'similarity':
                        similarityPanel.classList.remove('hidden');
                        explanation.textContent = "Semantic similarity reveals how close words are in meaning. Words with similar contexts cluster together in embedding space.";
                        break;
                    case 'arithmetic':
                        arithmeticPanel.classList.remove('hidden');
                        explanation.textContent = "Vector arithmetic lets us explore word relationships mathematically (illustrative only; modern sentence embeddings don't guarantee analogies).";
                        break;
                    case 'context':
                        contextPanel.classList.remove('hidden');
                        explanation.textContent = "Contextual embeddings show how the same word can have different meanings based on surrounding context.";
                        updateContextComparison();
                        break;
                }
                
                renderEmbeddingSpace();
            }

            // Similarity search functionality
            function searchSimilarWords() {
                const queryWord = document.getElementById('q7-query-word').value;
                const resultsDiv = document.getElementById('q7-similarity-results');
                
                currentQueryWord = queryWord;
                
                // Calculate similarities
                const similarities = Object.entries(embeddings)
                    .filter(([word]) => word !== queryWord)
                    .map(([word, data]) => ({
                        word,
                        similarity: calculateCosineSimilarity(embeddings[queryWord].vector, data.vector)
                    }))
                    .sort((a, b) => b.similarity - a.similarity)
                    .slice(0, 6);
                
                // Display results
                resultsDiv.innerHTML = similarities.map(item => 
                    '<div class="flex justify-between items-center p-2 bg-white border rounded hover:bg-gray-50 cursor-pointer"' +
                         ' onclick="document.getElementById(\'q7-query-word\').value=\'' + item.word + '\'; document.getElementById(\'q7-query-word\').dispatchEvent(new Event(\'change\'));">' +
                        '<span class="font-medium">' + item.word + '</span>' +
                        '<span class="text-sm ' + (item.similarity > 0.7 ? 'text-green-600' : item.similarity > 0.5 ? 'text-orange-500' : 'text-gray-500') + '">' +
                            (item.similarity * 100).toFixed(1) + '%' +
                        '</span>' +
                    '</div>'
                ).join('');
                
                renderEmbeddingSpace();
            }

            // Vector arithmetic functionality
            function calculateVectorArithmetic() {
                const wordA = document.getElementById('q7-word-a').value;
                const wordB = document.getElementById('q7-word-b').value;
                const wordC = document.getElementById('q7-word-c').value;
                const resultDiv = document.getElementById('q7-arithmetic-result');
                
                // Perform vector arithmetic: A - B + C
                const resultVector = embeddings[wordA].vector.map((val, i) => 
                    val - embeddings[wordB].vector[i] + embeddings[wordC].vector[i]
                );
                
                // Find closest word
                const candidates = Object.entries(embeddings)
                    .filter(([word]) => ![wordA, wordB, wordC].includes(word))
                    .map(([word, data]) => ({
                        word,
                        similarity: calculateCosineSimilarity(resultVector, data.vector)
                    }))
                    .sort((a, b) => b.similarity - a.similarity);
                
                const result = candidates[0];
                
                resultDiv.innerHTML = 
                    '<div class="text-center">' +
                        '<div class="text-lg font-mono mb-2">' +
                            '<span class="text-blue-600">' + wordA + '</span> - ' +
                            '<span class="text-red-600">' + wordB + '</span> + ' +
                            '<span class="text-green-600">' + wordC + '</span> = ' +
                            '<span class="text-purple-600 font-bold">' + result.word + '</span>' +
                        '</div>' +
                        '<div class="text-sm text-gray-600">' +
                            'Confidence: ' + (result.similarity * 100).toFixed(1) + '%' +
                        '</div>' +
                        '<div class="mt-3 text-xs text-gray-500">' +
                            '<strong>Top alternatives:</strong> ' + 
                            candidates.slice(1, 4).map(c => c.word).join(', ') +
                        '</div>' +
                    '</div>';
            }

            // Context comparison functionality
            function updateContextComparison() {
                const selectedWord = document.getElementById('q7-context-word').value;
                const [word] = selectedWord.split(' ');
                
                if (contextualExamples[word]) {
                    const contexts = contextualExamples[word];
                    const contextKeys = Object.keys(contexts);
                    
                    // Update context displays
                    document.getElementById('q7-context-a').textContent = contexts[contextKeys[0]].sentence;
                    document.getElementById('q7-context-b').textContent = contexts[contextKeys[1]].sentence;
                    
                    document.getElementById('q7-context-a-neighbors').textContent = 
                        contexts[contextKeys[0]].neighbors.join(', ');
                    document.getElementById('q7-context-b-neighbors').textContent = 
                        contexts[contextKeys[1]].neighbors.join(', ');
                    
                    // Calculate similarity between contexts
                    const similarity = calculateCosineSimilarity(
                        contexts[contextKeys[0]].vector,
                        contexts[contextKeys[1]].vector
                    );
                    
                    document.getElementById('q7-context-similarity').textContent = similarity.toFixed(3);
                }
            }

            // Example scenarios
            function loadExamples() {
                const examples = [
                    { mode: 'similarity', word: 'king', description: 'Explore royal vocabulary' },
                    { mode: 'arithmetic', a: 'king', b: 'man', c: 'woman', description: 'Classic analogy' },
                    { mode: 'similarity', word: 'happy', description: 'Emotion concepts' }
                ];
                
                const randomExample = examples[Math.floor(Math.random() * examples.length)];
                
                if (randomExample.mode === 'similarity') {
                    document.querySelector('input[name="q7-viz-type"][value="similarity"]').checked = true;
                    switchMode('similarity');
                    document.getElementById('q7-query-word').value = randomExample.word;
                    searchSimilarWords();
                } else if (randomExample.mode === 'arithmetic') {
                    document.querySelector('input[name="q7-viz-type"][value="arithmetic"]').checked = true;
                    switchMode('arithmetic');
                    document.getElementById('q7-word-a').value = randomExample.a;
                    document.getElementById('q7-word-b').value = randomExample.b;
                    document.getElementById('q7-word-c').value = randomExample.c;
                }
            }

            function loadRandomWords() {
                const words = Object.keys(embeddings);
                const randomWord = words[Math.floor(Math.random() * words.length)];
                
                document.getElementById('q7-query-word').value = randomWord;
                if (currentMode === 'similarity') {
                    searchSimilarWords();
                }
            }

            // Event listeners
            vizTypeRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const label = e.target.closest('label');
                    // Update visual selection
                    document.querySelectorAll('input[name="q7-viz-type"] + div').forEach(div => {
                        div.className = div.className.replace('border-blue-400 bg-blue-50', 'border-gray-200');
                    });
                    label.querySelector('div').className = label.querySelector('div').className.replace('border-gray-200', 'border-blue-400 bg-blue-50');
                    
                    switchMode(e.target.value);
                });
            });
            
            document.getElementById('q7-search-btn').addEventListener('click', searchSimilarWords);
            document.getElementById('q7-calculate-btn').addEventListener('click', calculateVectorArithmetic);
            document.getElementById('q7-context-word').addEventListener('change', updateContextComparison);
            exampleBtn.addEventListener('click', loadExamples);
            randomBtn.addEventListener('click', loadRandomWords);
            
            // Allow change event for search (since it's now a dropdown)
            document.getElementById('q7-query-word').addEventListener('change', searchSimilarWords);

            // Initialize
            switchMode('similarity');
            searchSimilarWords();
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question07Interactive = interactiveScript;
}
