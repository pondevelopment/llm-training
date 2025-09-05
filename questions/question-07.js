// Question 7: Embeddings and Semantic Understanding
// Created: July 8, 2025
// Educational Focus: Understanding vector representations, semantic similarity, and how machines process meaning

const question = {
    title: "7. What are embeddings and how do they enable LLMs to understand semantic meaning?",
    answer: `<div class="space-y-4">
        <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading (related)</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-01" class="text-indigo-700 underline hover:text-indigo-900">Question 1: What does tokenization entail?</a></li>
                <li><a href="#question-02" class="text-indigo-700 underline hover:text-indigo-900">Question 2: How does the attention mechanism function in transformer models?</a></li>
                <li><a href="#question-09" class="text-indigo-700 underline hover:text-indigo-900">Question 9: What is a transformer architecture?</a></li>
                <li><a href="#question-47" class="text-indigo-700 underline hover:text-indigo-900">Question 47: What is context and perplexity?</a></li>
            </ul>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧠 What are Embeddings?</h4>
            <p class="text-blue-800">Embeddings are dense numerical vectors that represent words, tokens, or concepts in high-dimensional space. Think of them as a universal translator that converts human language into mathematical coordinates that machines can understand and compute with, while preserving semantic meaning and relationships.</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-4 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900 mb-2">📍 Static Embeddings</h5>
                <p class="text-sm text-green-700 mb-2">Fixed vector per word (Word2Vec, GloVe)</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Simple:</strong> One vector per word</div>
                    <div>✅ <strong>Fast:</strong> Pre-computed vectors</div>
                    <div>❌ <strong>Context-blind:</strong> "bank" always same vector</div>
                    <div>❌ <strong>Limited:</strong> No handling of ambiguity</div>
                </div>
                <code class="text-xs bg-green-100 px-1 rounded mt-2 block">Example: Word2Vec, GloVe</code>
            </div>
            
            <div class="bg-purple-50 p-4 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900 mb-2">🎯 Contextual Embeddings</h5>
                <p class="text-sm text-purple-700 mb-2">Dynamic vectors based on context (BERT, GPT)</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Smart:</strong> Context-aware vectors</div>
                    <div>✅ <strong>Precise:</strong> Handles word ambiguity</div>
                    <div>✅ <strong>Rich:</strong> Captures subtle meanings</div>
                    <div>❌ <strong>Complex:</strong> Requires computation</div>
                </div>
                <code class="text-xs bg-purple-100 px-1 rounded mt-2 block">Example: BERT, RoBERTa</code>
            </div>
            
            <div class="bg-orange-50 p-4 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900 mb-2">🚀 Transformer Embeddings</h5>
                <p class="text-sm text-orange-700 mb-2">Multi-layered contextual representations</p>
                <div class="text-xs space-y-1">
                    <div>✅ <strong>Powerful:</strong> Deep contextual understanding</div>
                    <div>✅ <strong>Flexible:</strong> Task-specific adaptations</div>
                    <div>✅ <strong>Scalable:</strong> Works with any text length</div>
                    <div>❌ <strong>Resource-heavy:</strong> High computational cost</div>
                </div>
                <code class="text-xs bg-orange-100 px-1 rounded mt-2 block">Example: GPT, T5, LLaMA</code>
            </div>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Embeddings Matter</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Semantic Understanding:</strong> Enable machines to grasp meaning, not just match symbols</li>
                <li>• <strong>Mathematical Operations:</strong> Allow vector arithmetic to explore relationships (e.g., king − man + woman ≈ queen)</li>
                <li>• <strong>Transfer Learning:</strong> Pre-trained embeddings can be reused across different tasks and domains</li>
                <li>• <strong>Foundation of AI:</strong> Critical component in search engines, recommendation systems, and all modern NLP</li>
            </ul>
        </div>
        
        <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-2">🧭 Provider quick reference (2025)</h4>
            <ul class="text-sm text-indigo-900 space-y-1 list-disc pl-5">
                <li><strong>Similarity:</strong> Prefer cosine similarity on L2-normalized vectors. When vectors are normalized, cosine, dot, and Euclidean rank similarly.</li>
                <li><strong>Retrieval task hints:</strong> Use provider-specific flags so queries and documents embed optimally:
                    <span class="block text-indigo-800 mt-1">Cohere <code class="bg-indigo-100 px-1 rounded">input_type</code> (search_query vs search_document), Voyage <code class="bg-indigo-100 px-1 rounded">input_type</code> (query vs document), Google <code class="bg-indigo-100 px-1 rounded">task_type</code> in config.</span>
                </li>
                <li><strong>Dimensions:</strong> Adjustable for storage/speed trade-offs:
                    <span class="block text-indigo-800 mt-1">Cohere <code>256/512/1024/1536</code>, Google Gemini up to <code>3072</code> via <code>output_dimensionality</code>, Voyage <code>256–2048</code> (model-dependent), Mistral fixed <code>1024</code>.</span>
                </li>
                <li><strong>Quantization:</strong> Some providers return <code>int8</code>/<code>uint8</code>/<code>binary</code>/<code>ubinary</code> to save space. Binary is bit-packed (length = dim/8) and may need unpacking for some vector DBs.</li>
                <li><strong>Multilingual/Multimodal:</strong> Cohere embed-v4.0 is multilingual and supports text+image fusion; Google offers separate multimodal embedding APIs.</li>
                <li><strong>Limits (typical):</strong> Google: up to ~250 inputs/request and 2048 tokens/input; Cohere: up to ~96 inputs; Voyage: up to ~1000 texts (model limits vary). Always check current docs.</li>
            </ul>
            <div class="mt-3">
                <div class="text-xs font-semibold text-indigo-900 uppercase tracking-wide">Provider models</div>
                <ul class="text-sm text-indigo-900 list-disc pl-5 mt-1 space-y-0.5">
                    <li><strong>OpenAI:</strong> text-embedding-3 family</li>
                    <li><strong>Google:</strong> gemini-embedding-001</li>
                    <li><strong>Cohere:</strong> embed-v4.0</li>
                    <li><strong>Mistral:</strong> mistral-embed</li>
                    <li><strong>Voyage:</strong> 3.x (e.g., voyage-3-large, voyage-3.5, voyage-3.5-lite)</li>
                </ul>
            </div>
            <p class="text-xs text-indigo-700 mt-2">Note: Linear analogy tricks (e.g., king − man + woman ≈ queen) are illustrative; modern sentence embeddings don’t guarantee such relationships.</p>
        </div>
    </div>`,
    interactive: {
        title: "🧠 Interactive Embedding Space Laboratory",
        html: `<div class="space-y-6">
            <!-- Word Vector Configuration -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">🔍 Select Embedding Visualization Type</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="cursor-pointer">
                        <input type="radio" name="q7-viz-type" value="similarity" class="sr-only" checked>
                        <div class="border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <div class="font-medium text-blue-900">Semantic Similarity</div>
                            <div class="text-xs text-blue-700">Find words with similar meanings</div>
                            <div class="text-xs text-blue-600 mt-1">Explore relationships</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q7-viz-type" value="arithmetic" class="sr-only">
                        <div class="border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                            <div class="font-medium text-purple-900">Vector Arithmetic</div>
                            <div class="text-xs text-purple-700">King - Man + Woman = ?</div>
                            <div class="text-xs text-purple-600 mt-1">Mathematical operations</div>
                        </div>
                    </label>
                    
                    <label class="cursor-pointer">
                        <input type="radio" name="q7-viz-type" value="context" class="sr-only">
                        <div class="border-2 border-green-200 rounded-lg p-3 hover:border-green-400 hover:bg-green-50 transition-colors">
                            <div class="font-medium text-green-900">Context Comparison</div>
                            <div class="text-xs text-green-700">Same word, different contexts</div>
                            <div class="text-xs text-green-600 mt-1">Contextual embeddings</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">💡 Quick Experiments:</span>
                <button id="q7-example-btn" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Try Famous Examples</button>
                <button id="q7-random-btn" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">🎲 Random Words</button>
            </div>
            
            <!-- Similarity Explorer -->
            <div id="q7-similarity-panel" class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">🔍 Semantic Similarity Explorer</h4>
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Query Input -->
                    <div>
                        <label for="q7-query-word" class="block text-sm font-medium text-gray-700 mb-2">Search for similar words:</label>
                        <div class="flex gap-2">
                            <select id="q7-query-word" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="king">king</option>
                                <option value="queen">queen</option>
                                <option value="cat">cat</option>
                                <option value="dog">dog</option>
                                <option value="happy">happy</option>
                                <option value="sad">sad</option>
                                <option value="france">france</option>
                                <option value="germany">germany</option>
                                <option value="computer">computer</option>
                                <option value="programming">programming</option>
                                <option value="walk">walk</option>
                                <option value="run">run</option>
                            </select>
                            <button id="q7-search-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                Search
                            </button>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">Select any word from our vocabulary to find semantic neighbors</p>
                        <div class="mt-2 text-[11px] text-gray-600 bg-gray-50 border border-dashed border-gray-300 rounded p-2">
                            Tip for real systems: embed <em>documents</em> and <em>queries</em> with retrieval hints (e.g., Cohere/Voyage <code>input_type</code>, Google <code>task_type</code>) and prefer cosine similarity on normalized vectors.
                        </div>
                    </div>
                    
                    <!-- Results -->
                    <div>
                        <p class="text-sm font-medium text-gray-700 mb-2">Similar words (cosine similarity):</p>
                        <div id="q7-similarity-results" class="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded border">
                            Enter a word to find its semantic neighbors
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Vector Arithmetic Panel -->
            <div id="q7-arithmetic-panel" class="bg-white border border-gray-200 rounded-lg p-4 hidden">
                <h4 class="font-medium text-gray-900 mb-3">🧮 Vector Arithmetic Laboratory</h4>
                <div class="space-y-4">
                    <div class="grid md:grid-cols-5 gap-3 items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Word A:</label>
                            <select id="q7-word-a" class="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono">
                                <option value="king">king</option>
                                <option value="queen">queen</option>
                                <option value="man">man</option>
                                <option value="woman">woman</option>
                                <option value="france">france</option>
                                <option value="germany">germany</option>
                                <option value="paris">paris</option>
                                <option value="berlin">berlin</option>
                                <option value="walking">walking</option>
                                <option value="running">running</option>
                            </select>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-600">−</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Word B:</label>
                            <select id="q7-word-b" class="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono">
                                <option value="man">man</option>
                                <option value="woman">woman</option>
                                <option value="king">king</option>
                                <option value="queen">queen</option>
                                <option value="paris">paris</option>
                                <option value="berlin">berlin</option>
                                <option value="walk">walk</option>
                                <option value="run">run</option>
                            </select>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">+</div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Word C:</label>
                            <select id="q7-word-c" class="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono">
                                <option value="woman">woman</option>
                                <option value="man">man</option>
                                <option value="queen">queen</option>
                                <option value="king">king</option>
                                <option value="berlin">berlin</option>
                                <option value="paris">paris</option>
                                <option value="run">run</option>
                                <option value="walk">walk</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <button id="q7-calculate-btn" class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors">
                            Calculate: A - B + C = ?
                        </button>
                    </div>
                    
                    <div id="q7-arithmetic-result" class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div class="text-center text-gray-600">Click "Calculate" to see the result of vector arithmetic</div>
                    </div>
                </div>
            </div>
            
            <!-- Context Comparison Panel -->
            <div id="q7-context-panel" class="bg-white border border-gray-200 rounded-lg p-4 hidden">
                <h4 class="font-medium text-gray-900 mb-3">📝 Contextual Embedding Comparison</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Select a word to analyze in different contexts:</label>
                        <select id="q7-context-word" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="bank">bank (financial vs river)</option>
                            <option value="bark">bark (dog vs tree)</option>
                            <option value="bat">bat (animal vs sports)</option>
                            <option value="light">light (illumination vs weight)</option>
                            <option value="fair">fair (just vs carnival)</option>
                        </select>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h6 class="font-medium text-blue-900 mb-2">Context A</h6>
                            <div id="q7-context-a" class="text-sm mb-3 font-mono bg-white p-2 rounded border">
                                "I went to the bank to deposit money."
                            </div>
                            <div class="text-xs text-blue-700">
                                <strong>Embedding neighbors:</strong>
                                <div id="q7-context-a-neighbors" class="mt-1">financial, money, deposit, account</div>
                            </div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h6 class="font-medium text-green-900 mb-2">Context B</h6>
                            <div id="q7-context-b" class="text-sm mb-3 font-mono bg-white p-2 rounded border">
                                "We sat by the bank of the river."
                            </div>
                            <div class="text-xs text-green-700">
                                <strong>Embedding neighbors:</strong>
                                <div id="q7-context-b-neighbors" class="mt-1">river, shore, water, edge</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                        <div class="text-sm text-yellow-800">
                            <strong>Cosine Similarity:</strong> <span id="q7-context-similarity" class="font-mono">0.23</span>
                            <span class="ml-2 text-xs">(Lower similarity = more different meanings)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Visualization Space -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 2D Embedding Visualization</h4>
                    <div class="text-xs bg-gray-100 px-2 py-1 rounded">
                        Reduced from 512D → 2D using t-SNE
                    </div>
                </div>
                
                <div class="relative">
                    <div id="q7-embedding-space" class="w-full h-80 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden">
                        <svg id="q7-svg-space" class="w-full h-full">
                            <!-- Dynamic word points will be rendered here -->
                        </svg>
                        <div id="q7-hover-tooltip" class="absolute bg-black text-white text-xs px-2 py-1 rounded pointer-events-none opacity-0 transition-opacity">
                            Word info
                        </div>
                    </div>
                    
                    <div id="q7-embedding-legend" class="mt-3 flex flex-wrap gap-4 text-xs">
                        <div class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Query word</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Similar words</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span>Other words</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Educational Insights -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🧠 Understanding Embeddings</h4>
                <div id="q7-explanation" class="text-sm text-yellow-800">
                    Embeddings map words to high-dimensional vectors where semantic similarity is preserved as geometric proximity. 
                    Explore the different modes above to understand how machines represent and process meaning mathematically.
                </div>
            </div>
        </div>`,
        script: () => {
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
        }
    }
};

// Export the question object
if (typeof module !== 'undefined' && module.exports) {
    module.exports = question;
} else if (typeof window !== 'undefined') {
    window.question07 = question;
}
