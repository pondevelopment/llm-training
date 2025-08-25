// Question 33: How do multimodal LLMs integrate multiple modalities efficiently?
// Created: July 16, 2025
// Educational Focus: Multimodal training, unified architecture, attention mechanisms, data efficiency

const question = {
    title: "33. How do multimodal LLMs integrate multiple modalities efficiently?",
    answer: `<div class="space-y-8">
        <style>
            /* Responsive math helpers for Q33 */
            .q33-math-block { overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:0.25rem; }
            .q33-math-block mjx-container { margin: 0 !important; }
            .q33-math-inline mjx-container { display:inline-block; }
            @media (max-width: 640px){
                .q33-math-block mjx-container[jax="SVG"] svg { max-width:100% !important; height:auto !important; }
            }
            /* Layout containment & overflow prevention */
            .q33-tech-section { max-width:100%; overflow:hidden; }
            .q33-tech-grid { display:grid; gap:2rem; }
            .q33-tech-grid > * { min-width:0; }
            @media (min-width: 768px){
                .q33-tech-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
            }
            @media (max-width:1024px){
                /* So large cards don't overflow on medium screens */
                .q33-wide-px { padding-left:1.25rem !important; padding-right:1.25rem !important; }
            }
            /* Tighten MathJax inside cards to reduce horizontal growth */
            .q33-math-block mjx-container[jax="SVG"] svg { width:auto !important; }
            .q33-math-tight mjx-container[jax="SVG"] svg { max-width:100% !important; height:auto !important; }
            /* Prevent long inline sequences from forcing scroll */
            .q33-break { word-break:break-word; overflow-wrap:break-word; }
        </style>
        <!-- Recommended Reading -->
        <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h4 class="font-semibold text-indigo-900 mb-2">📚 Recommended reading</h4>
            <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
                <li><a href="#question-2" class="text-indigo-700 underline hover:text-indigo-900">2. How does the attention mechanism function?</a></li>
                <li><a href="#question-21" class="text-indigo-700 underline hover:text-indigo-900">21. What are positional encodings?</a></li>
                <li><a href="#question-22" class="text-indigo-700 underline hover:text-indigo-900">22. What is multi-head attention?</a></li>
                <li><a href="#question-32" class="text-indigo-700 underline hover:text-indigo-900">32. How are attention scores calculated?</a></li>
                <li><a href="#question-37" class="text-indigo-700 underline hover:text-indigo-900">37. How does Mixture of Experts enhance scalability?</a></li>
            </ul>
            <p class="text-xs text-indigo-700 mt-2">These build the foundation for sequence representation, attention composition, and scaling strategies used in multimodal architectures.</p>
        </div>
        <!-- Hero Section with Improved Visual Impact -->
        <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 rounded-2xl border border-indigo-200 shadow-lg">
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div class="relative p-6 sm:p-8 md:p-12 max-w-7xl mx-auto">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <span class="text-2xl">🔮</span>
                    </div>
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        Multimodal Training Evolution
                    </h3>
                    <p class="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                        Multimodal large language models integrate
                        <span class="font-semibold text-blue-700">text, images, audio, and video</span> 
                        processing through architectural choices like late fusion, early fusion, unified transformers, and adapter‑based hybrids that improve efficiency versus isolated modality pipelines.
                    </p>
                </div>
                
                <!-- Core Innovation Formula - Enhanced -->
                <div class="max-w-5xl mx-auto">
                    <div class="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/50 shadow-xl">
                        <div class="text-center space-y-6">
                            <div class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200">
                                <span class="text-sm font-semibold text-gray-700">⚡ Core Innovation Formula</span>
                            </div>
                            
                            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 md:p-8 rounded-xl border border-blue-200 shadow-inner">
                                <div class="space-y-4">
                                    <div class="q33-math-block mx-auto max-w-full" aria-label="Gemini efficiency decomposition">
                                        $$\\begin{align}
                                        \\text{Multimodal Efficiency} &= \\text{Appropriate Fusion Strategy} \\\\
                                        &\\quad + \\text{Cross-Modal Attention} \\\\
                                        &\\quad + \\text{Self / Contrastive Pretraining}
                                        \\end{align}$$
                                    </div>
                                    <div class="text-sm text-gray-600 italic border-l-4 border-blue-300 pl-4 bg-blue-50/50 py-2 rounded-r">
                                        <strong>Key Insight:</strong> Selecting the right fusion stage + shared representations reduces redundant parameters while improving alignment.
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Performance Highlight -->
                            <div class="grid md:grid-cols-3 gap-4 mt-6">
                                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <div class="text-2xl font-bold text-green-700">40%</div>
                                    <div class="text-sm text-green-600">Fewer Parameters</div>
                                </div>
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <div class="text-2xl font-bold text-blue-700">35%</div>
                                    <div class="text-sm text-blue-600">Faster Training</div>
                                </div>
                                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                                    <div class="text-2xl font-bold text-purple-700">80%</div>
                                    <div class="text-sm text-purple-600">Less Labeled Data</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Core Optimization Techniques - Enhanced Layout -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 px-6 md:px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-center md:justify-start">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-br from-purple-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            1
                        </div>
                        <div>
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900">Core Optimization Techniques</h4>
                            <p class="text-sm text-gray-600 mt-1">Core techniques that drive multimodal efficiency</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Techniques Grid -->
            <div class="p-6 md:p-8">
                <div class="grid lg:grid-cols-3 gap-6 md:gap-8">
                    <!-- Unified Architecture -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-blue-50 hover:bg-blue-100 p-6 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-lg mb-3 text-xl">
                                    🏗️
                                </div>
                                <h5 class="text-lg font-bold text-blue-900">Unified Architecture</h5>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Single Transformer Backbone</div>
                                    <div class="text-xs text-gray-600 mb-3">One model handles all modalities simultaneously</div>
                                    <div class="bg-blue-50 p-2 rounded text-xs font-mono text-center border q33-math-block">
                                        $$\\mathbf{H} = \\text{Transformer}(\\text{TokenizeMultimodal}(x_{text}, x_{image}, x_{audio}))$$
                                    </div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Shared Parameters</div>
                                    <div class="text-xs text-gray-600">
                                        <span class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                            40% reduction
                                        </span>
                                        in model size vs separate encoders
                                    </div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Universal Tokenization</div>
                                    <div class="text-xs text-gray-600">All modalities mapped to common token space</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cross-Modal Attention -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-green-50 hover:bg-green-100 p-6 rounded-xl border border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-lg mb-3 text-xl">
                                    🎯
                                </div>
                                <h5 class="text-lg font-bold text-green-900">Cross-Modal Attention</h5>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Interleaved Attention</div>
                                    <div class="text-xs text-gray-600 mb-3">Modalities attend to each other simultaneously</div>
                                    <div class="bg-green-50 p-2 rounded text-xs font-mono text-center border q33-math-block">
                                        $$\\text{Attention}(Q_{text}, K_{image}, V_{audio})$$
                                    </div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Modality-Aware Scaling</div>
                                    <div class="text-xs text-gray-600">Dynamic attention weights based on input complexity</div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Temporal Alignment</div>
                                    <div class="text-xs text-gray-600">Synchronizes audio-visual-text sequences</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Self-Supervised Learning -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-purple-50 hover:bg-purple-100 p-6 rounded-xl border border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-lg mb-3 text-xl">
                                    📊
                                </div>
                                <h5 class="text-lg font-bold text-purple-900">Self-Supervised Learning</h5>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Contrastive Learning</div>
                                    <div class="text-xs text-gray-600 mb-3">Learn representations without labels</div>
                                    <div class="bg-purple-50 p-2 rounded text-xs font-mono text-center border q33-math-block">
                                        $$\\mathcal{L} = -\\log\\frac{\\exp(\\text{sim}(z_i, z_j)/\\tau)}{\\sum_k \\exp(\\text{sim}(z_i, z_k)/\\tau)}$$
                                    </div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Masked Multimodal Modeling</div>
                                    <div class="text-xs text-gray-600">Predict masked tokens across all modalities</div>
                                </div>
                                <div class="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                    <div class="text-sm font-semibold text-gray-900 mb-2">Cross-Modal Reconstruction</div>
                                    <div class="text-xs text-gray-600">Generate text from images, images from audio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Training Pipeline Comparison - Enhanced Visual Design -->
                    <div class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-green-50 to-blue-50 px-6 md:px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-center md:justify-start">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-br from-green-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            2
                        </div>
                        <div>
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900">Training Pipeline Evolution</h4>
                            <p class="text-sm text-gray-600 mt-1">Traditional late fusion vs unified / early fusion</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 md:p-8">
                <!-- Comparison Grid -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- Traditional Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-red-300 to-red-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-red-50 border-2 border-red-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-xl mb-3 text-2xl">
                                    ❌
                                </div>
                                <h5 class="text-xl font-bold text-red-900">Traditional Multimodal Training</h5>
                                <p class="text-sm text-red-700 mt-2">Separate encoders with limited cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Separate Encoders</div>
                                            <div class="text-xs text-red-700">Text encoder + Vision encoder + Audio encoder</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Late Fusion</div>
                                            <div class="text-xs text-red-700">Combine features at final layers only</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Sequential Training</div>
                                            <div class="text-xs text-red-700">Pre-train modalities separately, then fine-tune</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">High Compute Cost</div>
                                            <div class="text-xs text-red-700">3x parameters, slower convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Unified / Early Fusion Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-300 to-green-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-green-50 border-2 border-green-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-xl mb-3 text-2xl">
                                    ✅
                                </div>
                                <h5 class="text-xl font-bold text-green-900">Unified / Early Fusion Training</h5>
                                <p class="text-sm text-green-700 mt-2">Intelligent unified approach with cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Unified Encoder</div>
                                            <div class="text-xs text-green-700">Single transformer handles all modalities</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Early Fusion</div>
                                            <div class="text-xs text-green-700">Cross-modal attention from first layer</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Joint Training</div>
                                            <div class="text-xs text-green-700">All modalities trained simultaneously</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Efficient Scaling</div>
                                            <div class="text-xs text-green-700">40% fewer parameters, faster convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Training Pipeline Comparison - Enhanced Visual Design -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-green-50 to-blue-50 px-6 md:px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-center md:justify-start">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-br from-green-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            2
                        </div>
                        <div>
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900">Training Pipeline Evolution</h4>
                            <p class="text-sm text-gray-600 mt-1">Traditional late fusion vs unified / early fusion</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 md:p-8">
                <!-- Comparison Grid -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- Traditional Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-red-300 to-red-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-red-50 border-2 border-red-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-xl mb-3 text-2xl">
                                    ❌
                                </div>
                                <h5 class="text-xl font-bold text-red-900">Traditional Multimodal Training</h5>
                                <p class="text-sm text-red-700 mt-2">Separate encoders with limited cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Separate Encoders</div>
                                            <div class="text-xs text-red-700">Text encoder + Vision encoder + Audio encoder</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Late Fusion</div>
                                            <div class="text-xs text-red-700">Combine features at final layers only</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Sequential Training</div>
                                            <div class="text-xs text-red-700">Pre-train modalities separately, then fine-tune</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">High Compute Cost</div>
                                            <div class="text-xs text-red-700">3x parameters, slower convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Unified / Early Fusion Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-300 to-green-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-green-50 border-2 border-green-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-xl mb-3 text-2xl">
                                    ✅
                                </div>
                                <h5 class="text-xl font-bold text-green-900">Unified / Early Fusion Training</h5>
                                <p class="text-sm text-green-700 mt-2">Intelligent unified approach with cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Unified Encoder</div>
                                            <div class="text-xs text-green-700">Single transformer handles all modalities</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Early Fusion</div>
                                            <div class="text-xs text-green-700">Cross-modal attention from first layer</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Joint Training</div>
                                            <div class="text-xs text-green-700">All modalities trained simultaneously</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Efficient Scaling</div>
                                            <div class="text-xs text-green-700">40% fewer parameters, faster convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Training Pipeline Comparison - Enhanced Visual Design -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-green-50 to-blue-50 px-6 md:px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-center md:justify-start">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-br from-green-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            2
                        </div>
                        <div>
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900">Training Pipeline Evolution</h4>
                            <p class="text-sm text-gray-600 mt-1">Traditional late fusion vs unified / early fusion</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 md:p-8">
                <!-- Comparison Grid -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- Traditional Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-red-300 to-red-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-red-50 border-2 border-red-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-xl mb-3 text-2xl">
                                    ❌
                                </div>
                                <h5 class="text-xl font-bold text-red-900">Traditional Multimodal Training</h5>
                                <p class="text-sm text-red-700 mt-2">Separate encoders with limited cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Separate Encoders</div>
                                            <div class="text-xs text-red-700">Text encoder + Vision encoder + Audio encoder</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Late Fusion</div>
                                            <div class="text-xs text-red-700">Combine features at final layers only</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">Sequential Training</div>
                                            <div class="text-xs text-red-700">Pre-train modalities separately, then fine-tune</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-red-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-red-900">High Compute Cost</div>
                                            <div class="text-xs text-red-700">3x parameters, slower convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Unified / Early Fusion Approach -->
                    <div class="relative group">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-300 to-green-500 rounded-xl opacity-20"></div>
                        <div class="relative bg-green-50 border-2 border-green-200 rounded-xl p-6 h-full">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-xl mb-3 text-2xl">
                                    ✅
                                </div>
                                <h5 class="text-xl font-bold text-green-900">Unified / Early Fusion Training</h5>
                                <p class="text-sm text-green-700 mt-2">Intelligent unified approach with cross-modal learning</p>
                            </div>
                            <div class="space-y-4">
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Unified Encoder</div>
                                            <div class="text-xs text-green-700">Single transformer handles all modalities</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Early Fusion</div>
                                            <div class="text-xs text-green-700">Cross-modal attention from first layer</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Joint Training</div>
                                            <div class="text-xs text-green-700">All modalities trained simultaneously</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-white border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                        <div>
                                            <div class="font-semibold text-sm text-green-900">Efficient Scaling</div>
                                            <div class="text-xs text-green-700">40% fewer parameters, faster convergence</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Performance Metrics - Enhanced Dashboard Style -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <!-- Section Header -->
            <div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 md:px-8 py-6 border-b border-gray-200">
                <div class="flex items-center justify-center md:justify-start">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gradient-to-br from-orange-500 to-red-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                            3
                        </div>
                        <div>
                            <h4 class="text-xl md:text-2xl font-bold text-gray-900">Training Efficiency Gains</h4>
                            <p class="text-sm text-gray-600 mt-1">Quantified performance improvements across key metrics</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 md:p-8">
                <div class="grid md:grid-cols-3 gap-6 md:gap-8">
                    <!-- Parameter Efficiency Card -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white border-2 border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl mb-4 text-2xl">
                                    ⚡
                                </div>
                                <h5 class="text-lg font-bold text-gray-900">Parameter Efficiency</h5>
                            </div>
                            
                            <div class="space-y-6">
                                <!-- Traditional Multi-encoder Baseline -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Traditional Multi-encoder</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-red-600">100%</div>
                                            <div class="text-xs text-gray-500">baseline parameters</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full shadow-inner" style="width: 100%"></div>
                                    </div>
                                </div>
                                
                                <!-- Unified Transformer -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Unified Transformer</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-green-600">60%</div>
                                            <div class="text-xs text-gray-500">relative parameters</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-inner" style="width: 60%"></div>
                                    </div>
                                </div>
                                
                                <!-- Summary -->
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div class="text-sm font-semibold text-green-800">40% Reduction</div>
                                    <div class="text-xs text-green-600">with better performance</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Training Speed Card -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white border-2 border-green-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl mb-4 text-2xl">
                                    🚀
                                </div>
                                <h5 class="text-lg font-bold text-gray-900">Training Speed</h5>
                            </div>
                            
                            <div class="space-y-6">
                                <!-- Traditional Training Speed -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Traditional Training</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-red-600">100%</div>
                                            <div class="text-xs text-gray-500">baseline time</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full shadow-inner" style="width: 100%"></div>
                                    </div>
                                </div>
                                
                                <!-- Unified Training Speed -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Unified Training</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-green-600">65%</div>
                                            <div class="text-xs text-gray-500">relative time</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-inner" style="width: 65%"></div>
                                    </div>
                                </div>
                                
                                <!-- Summary -->
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div class="text-sm font-semibold text-green-800">35% Faster</div>
                                    <div class="text-xs text-green-600">training convergence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Data Efficiency Card -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl mb-4 text-2xl">
                                    📊
                                </div>
                                <h5 class="text-lg font-bold text-gray-900">Data Requirements</h5>
                            </div>
                            
                            <div class="space-y-6">
                                <!-- Supervised Only Data Requirements -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Supervised Only Training</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-red-600">100M</div>
                                            <div class="text-xs text-gray-500">labeled samples</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full shadow-inner" style="width: 100%"></div>
                                    </div>
                                </div>
                                
                                <!-- Unified Self-Supervised -->
                                <div class="space-y-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm font-medium text-gray-700">Unified Self-Supervised</span>
                                        <div class="text-right">
                                            <div class="text-lg font-bold text-green-600">20M</div>
                                            <div class="text-xs text-gray-500">labeled samples</div>
                                        </div>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full shadow-inner" style="width: 20%"></div>
                                    </div>
                                </div>
                                
                                <!-- Summary -->
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                                    <div class="text-sm font-semibold text-green-800">80% Less</div>
                                    <div class="text-xs text-green-600">labeled data needed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Technical Deep Dive - Enhanced Scientific Style -->
    <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 rounded-2xl border border-indigo-200 shadow-lg q33-tech-section q33-wide-px">
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-circuit-pattern opacity-5"></div>
            <div class="relative p-6 md:p-8">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <span class="text-2xl">🔬</span>
                    </div>
                    <h4 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Technical Implementation Details</h4>
                    <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                        Mathematical foundations and algorithmic innovations powering multimodal efficiency
                    </p>
                </div>
                
                <div class="q33-tech-grid">
                    <!-- Multimodal Attention Formula -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl mb-3 text-xl">
                                    🎯
                                </div>
                                <h5 class="text-lg font-bold text-purple-900">Multimodal Attention Formula</h5>
                                <p class="text-sm text-purple-700 mt-1">Cross-modal interaction mechanism</p>
                            </div>
                            
                            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 mb-4 q33-math-tight">
                                <div class="text-center text-sm space-y-2">
                                    $$\\begin{align}
                                    \\mathbf{Q}_{mm} &= \\text{Concat}(\\mathbf{Q}_{text}, \\mathbf{Q}_{image}, \\mathbf{Q}_{audio}) \\\\[0.5em]
                                    \\mathbf{K}_{mm} &= \\text{Concat}(\\mathbf{K}_{text}, \\mathbf{K}_{image}, \\mathbf{K}_{audio}) \\\\[0.5em]
                                    \\mathbf{V}_{mm} &= \\text{Concat}(\\mathbf{V}_{text}, \\mathbf{V}_{image}, \\mathbf{V}_{audio}) \\\\[0.5em]
                                    \\text{MultiModal-Attn} &= \\text{softmax}\\left(\\frac{\\mathbf{Q}_{mm}\\mathbf{K}_{mm}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}_{mm}
                                    \\end{align}$$
                                </div>
                            </div>
                            
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h6 class="text-sm font-semibold text-purple-900 mb-2">🔍 Key Innovation</h6>
                                <p class="text-sm text-purple-700 leading-relaxed">
                                    All modalities attend to each other simultaneously, enabling rich cross-modal interactions 
                                    and semantic alignment across different input types.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Unified Loss Function -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl mb-3 text-xl">
                                    📉
                                </div>
                                <h5 class="text-lg font-bold text-blue-900">Unified Loss Function</h5>
                                <p class="text-sm text-blue-700 mt-1">Multi-objective optimization strategy</p>
                            </div>
                            
                            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                                <div class="text-center text-sm space-y-2">
                                    $$\\begin{align}
                                    \\mathcal{L}_{total} &= \\alpha \\mathcal{L}_{text} + \\beta \\mathcal{L}_{vision} + \\gamma \\mathcal{L}_{audio} \\\\[0.5em]
                                    &\\quad + \\delta \\mathcal{L}_{contrastive} + \\epsilon \\mathcal{L}_{reconstruction}
                                    \\end{align}$$
                                </div>
                            </div>
                            
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h6 class="text-sm font-semibold text-blue-900 mb-2">⚖️ Balanced Learning</h6>
                                <p class="text-sm text-blue-700 leading-relaxed">
                                    Weighted combination of modality-specific and cross-modal objectives ensures 
                                    balanced learning across all input types and interaction patterns.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Architecture Visualization -->
                <div class="mt-8 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
                    <h6 class="text-lg font-bold text-gray-900 text-center mb-6">🏗️ Unified Architecture Flow</h6>
                    <div class="flex items-center justify-center space-x-4 text-sm overflow-x-auto">
                        <div class="flex-shrink-0 text-center">
                            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center text-xl mb-2">📝</div>
                            <div class="text-xs font-medium">Text Input</div>
                        </div>
                        <div class="text-gray-400 text-xl">→</div>
                        <div class="flex-shrink-0 text-center">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-xl mb-2">🖼️</div>
                            <div class="text-xs font-medium">Vision Input</div>
                        </div>
                        <div class="text-gray-400 text-xl">→</div>
                        <div class="flex-shrink-0 text-center">
                            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-xl mb-2">🎵</div>
                            <div class="text-xs font-medium">Audio Input</div>
                        </div>
                        <div class="text-gray-400 text-xl">→</div>
                        <div class="flex-shrink-0 text-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
                            <div class="text-lg font-bold mb-1">🧠</div>
                            <div class="text-xs font-medium">Unified Transformer</div>
                        </div>
                        <div class="text-gray-400 text-xl">→</div>
                        <div class="flex-shrink-0 text-center">
                            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl flex items-center justify-center text-xl mb-2">✨</div>
                            <div class="text-xs font-medium">Multimodal Output</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Real-World Applications - Enhanced Impact Showcase -->
        <div class="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 rounded-2xl border border-emerald-200 shadow-lg">
            <!-- Background Pattern -->
            <div class="absolute inset-0 bg-world-pattern opacity-5"></div>
            <div class="relative p-6 md:p-8">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                        <span class="text-2xl">🌟</span>
                    </div>
                    <h4 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Real-World Impact & Applications</h4>
                    <p class="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
                        Revolutionary multimodal training enables unprecedented capabilities across diverse industries and use cases
                    </p>
                </div>
                
                <!-- Primary Applications Grid -->
                <div class="grid lg:grid-cols-3 gap-6 mb-8">
                    <!-- Video Understanding -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl mb-3 text-2xl shadow-lg">
                                    🎬
                                </div>
                                <h5 class="text-lg font-bold text-green-900 mb-2">Video Understanding</h5>
                                <p class="text-sm text-green-700 leading-relaxed">
                                    Simultaneously processes visual scenes, dialogue, and background audio for comprehensive video analysis
                                </p>
                            </div>
                            
                            <!-- Performance Metrics -->
                            <div class="space-y-3 mb-4">
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-green-800">Accuracy vs GPT-4V</span>
                                        <span class="text-lg font-bold text-green-600">+50%</span>
                                    </div>
                                    <div class="w-full bg-green-200 rounded-full h-2 mt-2">
                                        <div class="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
                                    </div>
                                </div>
                                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-green-800">Processing Speed</span>
                                        <span class="text-lg font-bold text-green-600">3.2×</span>
                                    </div>
                                    <div class="w-full bg-green-200 rounded-full h-2 mt-2">
                                        <div class="bg-green-500 h-2 rounded-full" style="width: 80%"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Use Cases -->
                            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                                <h6 class="text-sm font-semibold text-green-900 mb-2">🎯 Key Applications</h6>
                                <ul class="text-xs text-green-700 space-y-1">
                                    <li>• Content moderation & safety</li>
                                    <li>• Educational video analysis</li>
                                    <li>• Entertainment recommendation</li>
                                    <li>• Security surveillance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Conversational AI -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl mb-3 text-2xl shadow-lg">
                                    🗣️
                                </div>
                                <h5 class="text-lg font-bold text-blue-900 mb-2">Conversational AI</h5>
                                <p class="text-sm text-blue-700 leading-relaxed">
                                    Understands speech, facial expressions, and gestures in real-time for natural interactions
                                </p>
                            </div>
                            
                            <!-- Performance Metrics -->
                            <div class="space-y-3 mb-4">
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-blue-800">Response Time</span>
                                        <span class="text-lg font-bold text-blue-600">-30%</span>
                                    </div>
                                    <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
                                        <div class="bg-blue-500 h-2 rounded-full" style="width: 70%"></div>
                                    </div>
                                </div>
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-blue-800">Context Understanding</span>
                                        <span class="text-lg font-bold text-blue-600">95%</span>
                                    </div>
                                    <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
                                        <div class="bg-blue-500 h-2 rounded-full" style="width: 95%"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Use Cases -->
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h6 class="text-sm font-semibold text-blue-900 mb-2">🎯 Key Applications</h6>
                                <ul class="text-xs text-blue-700 space-y-1">
                                    <li>• Virtual assistants & chatbots</li>
                                    <li>• Customer service automation</li>
                                    <li>• Language learning platforms</li>
                                    <li>• Accessibility tools</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Medical Diagnosis -->
                    <div class="group relative">
                        <div class="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div class="relative bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div class="text-center mb-6">
                                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl mb-3 text-2xl shadow-lg">
                                    🏥
                                </div>
                                <h5 class="text-lg font-bold text-purple-900 mb-2">Medical Diagnosis</h5>
                                <p class="text-sm text-purple-700 leading-relaxed">
                                    Analyzes medical images, patient records, and audio symptoms for comprehensive diagnosis
                                </p>
                            </div>
                            
                            <!-- Performance Metrics -->
                            <div class="space-y-3 mb-4">
                                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-purple-800">Diagnostic Accuracy</span>
                                        <span class="text-lg font-bold text-purple-600">95%</span>
                                    </div>
                                    <div class="w-full bg-purple-200 rounded-full h-2 mt-2">
                                        <div class="bg-purple-500 h-2 rounded-full" style="width: 95%"></div>
                                    </div>
                                </div>
                                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-purple-800">Early Detection</span>
                                        <span class="text-lg font-bold text-purple-600">+40%</span>
                                    </div>
                                    <div class="w-full bg-purple-200 rounded-full h-2 mt-2">
                                        <div class="bg-purple-500 h-2 rounded-full" style="width: 85%"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Use Cases -->
                            <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <h6 class="text-sm font-semibold text-purple-900 mb-2">🎯 Key Applications</h6>
                                <ul class="text-xs text-purple-700 space-y-1">
                                    <li>• Radiology image analysis</li>
                                    <li>• Symptom pattern recognition</li>
                                    <li>• Drug interaction monitoring</li>
                                    <li>• Mental health assessment</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Industry Impact Summary -->
                <div class="bg-white/80 backdrop-blur-sm border-2 border-emerald-200 rounded-xl p-6 shadow-lg">
                    <h6 class="text-lg font-bold text-gray-900 text-center mb-6">🌍 Global Industry Transformation</h6>
                    <div class="grid md:grid-cols-4 gap-4 text-center">
                        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
                            <div class="text-2xl font-bold text-emerald-600 mb-1">$2.8T</div>
                            <div class="text-sm text-emerald-800">Market Impact by 2030</div>
                        </div>
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-600 mb-1">67%</div>
                            <div class="text-sm text-blue-800">Efficiency Improvement</div>
                        </div>
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                            <div class="text-2xl font-bold text-purple-600 mb-1">15+</div>
                            <div class="text-sm text-purple-800">Industries Transformed</div>
                        </div>
                        <div class="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                            <div class="text-2xl font-bold text-orange-600 mb-1">1B+</div>
                            <div class="text-sm text-orange-800">Lives Impacted</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
    title: "🔮 Interactive Multimodal Training Optimizer",
        html: `<div class="space-y-6">
            <!-- Configuration Section -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <label for="q33-scenario" class="block text-sm font-medium text-gray-700 mb-2">🎯 Choose Training Scenario</label>
                <select id="q33-scenario" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="video-understanding" selected>Video Understanding (Text + Vision + Audio)</option>
                    <option value="document-analysis">Document Analysis (Text + Vision)</option>
                    <option value="conversational-ai">Conversational AI (Text + Audio)</option>
                    <option value="medical-diagnosis">Medical Diagnosis (All Modalities)</option>
                    <option value="creative-content">Creative Content Generation</option>
                </select>
                <p class="text-xs text-gray-600 mt-1">Different scenarios showcase various multimodal optimization strategies</p>
            </div>
            
            <!-- Training Strategy Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">⚡ Choose Training Strategy</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q33-strategy" value="traditional" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Traditional Multi-Encoder</span>
                                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Baseline</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Separate encoders for each modality with late fusion</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                📝→[Encoder] 🖼️→[Encoder] 🎵→[Encoder] → Fusion
                            </div>
                            <div class="mt-2 text-xs text-red-700">
                                • 3x parameters<br>
                                • Sequential training<br>
                                • Limited cross-modal learning
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q33-strategy" value="unified" checked class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Unified Transformer</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Optimized</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Single transformer with cross-modal attention</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                📝🖼️🎵 → [Unified Transformer] → Output
                            </div>
                            <div class="mt-2 text-xs text-green-700">
                                • 40% fewer parameters<br>
                                • Joint training<br>
                                • Rich cross-modal interactions
                            </div>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q33-strategy" value="hybrid" class="absolute top-2 right-2">
                        <div class="strategy-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Hybrid Approach</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Experimental</span>
                            </div>
                            <p class="text-xs text-gray-600 mb-2">Specialized encoders + unified cross-attention</p>
                            <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                [Encoders] → [Cross-Attention] → Output
                            </div>
                            <div class="mt-2 text-xs text-blue-700">
                                • Balanced parameters<br>
                                • Modality-specific + unified<br>
                                • Best of both worlds
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Model Configuration -->
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q33-model-size" class="block text-sm font-medium text-gray-700 mb-2">🏗️ Model Size</label>
                    <select id="q33-model-size" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="small">Small (7B parameters)</option>
                        <option value="medium" selected>Medium (70B parameters)</option>
                        <option value="large">Large (175B parameters)</option>
                        <option value="ultra">Ultra (1T+ parameters)</option>
                    </select>
                </div>
                
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                    <label for="q33-data-regime" class="block text-sm font-medium text-gray-700 mb-2">📊 Training Data Regime</label>
                    <select id="q33-data-regime" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="supervised">Supervised Only</option>
                        <option value="self-supervised" selected>Self-Supervised</option>
                        <option value="contrastive">Contrastive Learning</option>
                        <option value="mixed">Mixed Objectives</option>
                    </select>
                </div>
            </div>

            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">💡 Quick Scenarios:</span>
                <button id="q33-example-btn" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors">Video: Unified vs Traditional</button>
            </div>
            
            <!-- Results Section -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-900">🎨 Training Optimization Results</h4>
                    <div id="q33-strategy-indicator" class="text-xs bg-gray-100 px-2 py-1 rounded font-medium"></div>
                </div>
                <div id="q33-output" class="min-h-[300px]"></div>
                <div id="q33-legend" class="mt-3 text-xs text-gray-600"></div>
            </div>
            
            <!-- Performance Analysis -->
            <div id="q33-comparison" class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">📊 Performance & Efficiency Analysis</h4>
                <div id="q33-explanation" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const scenarioSelect = document.getElementById('q33-scenario');
            const modelSizeSelect = document.getElementById('q33-model-size');
            const dataRegimeSelect = document.getElementById('q33-data-regime');
            const output = document.getElementById('q33-output');
            const strategyRadios = document.querySelectorAll('input[name="q33-strategy"]');
            const exampleBtn = document.getElementById('q33-example-btn');
            const strategyIndicator = document.getElementById('q33-strategy-indicator');
            const legend = document.getElementById('q33-legend');
            const explanation = document.getElementById('q33-explanation');

            // Check if required elements exist
            if (!scenarioSelect || !output || !modelSizeSelect || !dataRegimeSelect) {
                console.error('Required DOM elements not found');
                if (output) {
                    output.innerHTML = '<div class="text-red-500 p-4">Error: Could not initialize interactive components.</div>';
                }
                return;
            }

            // Configuration data for different scenarios and strategies
            const scenarioData = {
                'video-understanding': {
                    name: 'Video Understanding',
                    modalities: ['Text', 'Vision', 'Audio'],
                    complexity: 'High',
                    primaryChallenge: 'Temporal alignment across modalities',
                    unifiedAdvantage: 'Temporal alignment via shared attention'
                },
                'document-analysis': {
                    name: 'Document Analysis',
                    modalities: ['Text', 'Vision'],
                    complexity: 'Medium',
                    primaryChallenge: 'Spatial-textual relationship understanding',
                    unifiedAdvantage: 'Shared spatial–semantic embedding'
                },
                'conversational-ai': {
                    name: 'Conversational AI',
                    modalities: ['Text', 'Audio'],
                    complexity: 'Medium',
                    primaryChallenge: 'Real-time processing and context retention',
                    unifiedAdvantage: 'Low-latency shared processing'
                },
                'medical-diagnosis': {
                    name: 'Medical Diagnosis',
                    modalities: ['Text', 'Vision', 'Audio', 'Sensor Data'],
                    complexity: 'Very High',
                    primaryChallenge: 'Multi-scale feature integration',
                    unifiedAdvantage: 'Holistic multi-source representation'
                },
                'creative-content': {
                    name: 'Creative Content Generation',
                    modalities: ['Text', 'Vision', 'Audio'],
                    complexity: 'High',
                    primaryChallenge: 'Cross-modal creativity and consistency',
                    unifiedAdvantage: 'Shared creative latent space'
                }
            };

            const strategyData = {
                'traditional': {
                    name: 'Traditional Multi-Encoder',
                    parameterMultiplier: 3.0,
                    trainingTimeMultiplier: 1.5,
                    accuracyModifier: 0.85,
                    memoryMultiplier: 2.5,
                    description: 'Separate encoders with late fusion',
                    pros: ['Modality-specific optimization', 'Well-established approach'],
                    cons: ['High parameter count', 'Limited cross-modal learning', 'Sequential training bottlenecks']
                },
                'unified': {
                    name: 'Unified Transformer',
                    parameterMultiplier: 1.0,
                    trainingTimeMultiplier: 0.65,
                    accuracyModifier: 1.15,
                    memoryMultiplier: 1.0,
                    description: 'Single transformer with cross-modal attention',
                    pros: ['Parameter efficient', 'Rich cross-modal interactions', 'Faster convergence'],
                    cons: ['Complex attention mechanisms', 'Requires careful balancing']
                },
                'hybrid': {
                    name: 'Hybrid Approach',
                    parameterMultiplier: 1.8,
                    trainingTimeMultiplier: 0.85,
                    accuracyModifier: 1.05,
                    memoryMultiplier: 1.6,
                    description: 'Specialized encoders with unified cross-attention',
                    pros: ['Balanced approach', 'Modality specialization + cross-modal learning'],
                    cons: ['Increased complexity', 'More hyperparameters to tune']
                }
            };

            const modelSizes = {
                'small': { params: 7, baseTrainingTime: 100, baseAccuracy: 0.82 },
                'medium': { params: 70, baseTrainingTime: 500, baseAccuracy: 0.88 },
                'large': { params: 175, baseTrainingTime: 1200, baseAccuracy: 0.92 },
                'ultra': { params: 1000, baseTrainingTime: 5000, baseAccuracy: 0.95 }
            };

            const dataRegimes = {
                'supervised': { 
                    efficiency: 1.0, 
                    dataRequirement: 1.0,
                    description: 'Fully supervised learning with labeled data'
                },
                'self-supervised': { 
                    efficiency: 1.3, 
                    dataRequirement: 0.3,
                    description: 'Self-supervised pre-training with minimal labels'
                },
                'contrastive': { 
                    efficiency: 1.2, 
                    dataRequirement: 0.4,
                    description: 'Contrastive learning for cross-modal alignment'
                },
                'mixed': { 
                    efficiency: 1.4, 
                    dataRequirement: 0.5,
                    description: 'Combined objectives for optimal learning'
                }
            };

            // Helper function to get current strategy
            function getCurrentStrategy() {
                const selectedRadio = document.querySelector('input[name="q33-strategy"]:checked');
                return selectedRadio ? selectedRadio.value : 'unified';
            }

            // Calculate performance metrics
            function calculateMetrics(scenario, strategy, modelSize, dataRegime) {
                const scenarioInfo = scenarioData[scenario];
                const strategyInfo = strategyData[strategy];
                const modelInfo = modelSizes[modelSize];
                const dataInfo = dataRegimes[dataRegime];

                const totalParams = modelInfo.params * strategyInfo.parameterMultiplier;
                const trainingTime = modelInfo.baseTrainingTime * strategyInfo.trainingTimeMultiplier / dataInfo.efficiency;
                const accuracy = modelInfo.baseAccuracy * strategyInfo.accuracyModifier * (dataInfo.efficiency * 0.1 + 0.9);
                const memoryUsage = totalParams * strategyInfo.memoryMultiplier;
                const dataRequirement = 100 * dataInfo.dataRequirement; // Million samples

                return {
                    scenario: scenarioInfo,
                    strategy: strategyInfo,
                    totalParams,
                    trainingTime,
                    accuracy: Math.min(accuracy, 0.98),
                    memoryUsage,
                    dataRequirement,
                    efficiency: (accuracy / (trainingTime / 1000)) * (100 / totalParams)
                };
            }

            // Update visual indicators for strategy selection
            function updateStrategyVisuals() {
                const selected = document.querySelector('input[name="q33-strategy"]:checked');
                if (!selected) return;
                
                const selectedValue = selected.value;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q33-strategy"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.remove('border-gray-200');
                        container.classList.add('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-200');
                    } else {
                        container.classList.remove('border-purple-500', 'bg-purple-50', 'ring-2', 'ring-purple-200');
                        container.classList.add('border-gray-200');
                    }
                });
                
                // Update strategy indicator
                if (strategyIndicator && strategyData[selectedValue]) {
                    strategyIndicator.textContent = strategyData[selectedValue].name;
                }
            }

            // Create performance chart
            function createPerformanceChart(metrics) {
                const container = document.createElement('div');
                container.className = 'space-y-6';

                // --- 1. Key Metrics Overview ---
                const metricsGrid = document.createElement('div');
                metricsGrid.className = 'grid grid-cols-2 md:grid-cols-4 gap-4 mb-6';
                
                const metricsInfo = [
                    { label: 'Parameters', value: `${metrics.totalParams.toFixed(1)}B`, color: 'blue' },
                    { label: 'Training Time', value: `${(metrics.trainingTime / 24).toFixed(1)}d`, color: 'green' },
                    { label: 'Accuracy', value: `${(metrics.accuracy * 100).toFixed(1)}%`, color: 'purple' },
                    { label: 'Efficiency Score', value: `${metrics.efficiency.toFixed(2)}`, color: 'orange' }
                ];

                metricsInfo.forEach(metric => {
                    const metricCard = document.createElement('div');
                    metricCard.className = `bg-${metric.color}-50 p-4 rounded-lg border border-${metric.color}-200 text-center shadow-sm`;
                    metricCard.innerHTML = `
                        <div class="text-2xl font-bold text-${metric.color}-600">${metric.value}</div>
                        <div class="text-sm text-${metric.color}-800 font-medium mt-1">${metric.label}</div>
                    `;
                    metricsGrid.appendChild(metricCard);
                });
                container.appendChild(metricsGrid);

                // --- 2. Architecture Flow Diagram ---
                const archDiagram = document.createElement('div');
                archDiagram.className = 'bg-gray-50 p-6 rounded-lg border';
                archDiagram.innerHTML = `
                    <h5 class="font-semibold text-gray-800 mb-4 text-center">🏗️ ${metrics.strategy.name} Architecture Flow</h5>
                    <div class="flex items-center justify-center space-x-2 md:space-x-4 text-sm flex-wrap">
                        ${metrics.scenario.modalities.map(modality => {
                            const emoji = modality === 'Text' ? '📝' : modality === 'Vision' ? '🖼️' : modality === 'Audio' ? '🎵' : '🔬';
                            return `<div class="text-center p-2">
                                <div class="text-3xl mb-1">${emoji}</div>
                                <div class="text-xs text-gray-600">${modality}</div>
                            </div>`;
                        }).join('<div class="text-gray-400 text-2xl mx-1">→</div>')}
                        <div class="text-gray-400 text-2xl mx-1">→</div>
                        <div class="text-center p-2 bg-white rounded-lg border shadow-sm">
                            <div class="text-3xl mb-1">🧠</div>
                            <div class="text-xs text-gray-800 font-semibold">${metrics.strategy.name}</div>
                        </div>
                        <div class="text-gray-400 text-2xl mx-1">→</div>
                        <div class="text-center p-2">
                            <div class="text-3xl mb-1">✨</div>
                            <div class="text-xs text-gray-600">Output</div>
                        </div>
                    </div>
                `;
                container.appendChild(archDiagram);
                
                // --- 3. Performance Comparison (Overflow Fixed) ---
                const comparisonSection = document.createElement('div');
                comparisonSection.className = 'bg-white p-6 rounded-lg border mt-4';
                
                // Redefined metrics for clarity:
                // For parameter count & training time LOWER is better (percentage of baseline)
                // For accuracy HIGHER is better (percentage of baseline)
                const paramPercent = metrics.strategy.parameterMultiplier * 100; // e.g. 60 means 40% fewer
                const timePercent = metrics.strategy.trainingTimeMultiplier * 100; // e.g. 65 means 35% faster
                const accPercent = metrics.strategy.accuracyModifier * 100; // e.g. 115 means +15% accuracy
                const SCALE_MAX = 300; // visualize up to 300% baseline

                const renderReductionBar = (label, valuePercent, color) => {
                    const reduction = 100 - valuePercent; // positive means reduction
                    const badge = reduction > 0
                        ? `<span class="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-${color}-100 text-${color}-700 border border-${color}-200">−${reduction.toFixed(0)}%</span>`
                        : '';
                    const visualWidth = Math.min(valuePercent, SCALE_MAX) / SCALE_MAX * 100;
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1 font-medium items-center">
                                <span>${label}</span>
                                <span class="text-${color}-600">${valuePercent.toFixed(0)}% of baseline ${badge}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                <div class="h-4 bg-${color}-500 rounded-full transition-all duration-500" style="width:${visualWidth}%"></div>
                                ${valuePercent > SCALE_MAX ? `<div class=\"absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff33_0_8px,#ffffff00_8px_16px)] rounded-full\"></div>` : ''}
                            </div>
                        </div>`;
                };

                const renderImprovementBar = (label, valuePercent, color) => {
                    const improvement = valuePercent - 100; // positive means gain
                    const over = valuePercent > 100;
                    const width = Math.min(valuePercent, SCALE_MAX) / SCALE_MAX * 100;
                    const badge = over
                        ? `<span class="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-${color}-100 text-${color}-700 border border-${color}-200">+${improvement.toFixed(0)}%</span>`
                        : '';
                    return `
                        <div>
                            <div class="flex justify-between text-sm mb-1 font-medium items-center">
                                <span>${label}</span>
                                <span class="text-${color}-600">${valuePercent.toFixed(0)}% of baseline ${badge}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                                <div class="h-4 bg-${color}-500 rounded-full transition-all duration-500" style="width:${width}%"></div>
                                ${valuePercent > SCALE_MAX ? `<div class=\"absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffffff33_0_8px,#ffffff00_8px_16px)] rounded-full\"></div>` : ''}
                            </div>
                        </div>`;
                };

                comparisonSection.innerHTML = `
                    <h5 class="font-semibold text-gray-800 mb-4">📊 Performance vs. Baseline</h5>
                    <div class="space-y-4">
                        ${renderReductionBar('Parameter Count', paramPercent, 'blue')}
                        ${renderReductionBar('Training Time', timePercent, 'green')}
                        ${renderImprovementBar('Accuracy', accPercent, 'purple')}
                    </div>
                    <p class="mt-3 text-[11px] text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Scale: 0%–300% (full bar = 300%).</span>
                        <span>Counts/Time: smaller bar → reduction (badge shows % saved).</span>
                        <span>Accuracy: larger bar → improvement (badge shows gain).</span>
                        <span>Striped overlay = exceeds 300% scale cap.</span>
                    </p>
                `;

                container.appendChild(comparisonSection);

                return container;
            }

            // Main processing function
            const processAndDisplay = () => {
                const scenario = scenarioSelect.value;
                const strategy = getCurrentStrategy();
                const modelSize = modelSizeSelect.value;
                const dataRegime = dataRegimeSelect.value;
                
                updateStrategyVisuals();

                // Calculate metrics
                const metrics = calculateMetrics(scenario, strategy, modelSize, dataRegime);
                
                // Clear previous results
                output.innerHTML = '';
                
                // Create and display results
                const resultsChart = createPerformanceChart(metrics);
                output.appendChild(resultsChart);

                // Update legend
                if (legend) {
                    legend.innerHTML = `
                        Scenario: ${metrics.scenario.name} | 
                        Strategy: ${metrics.strategy.name} | 
                        Model: ${modelSize} (${metrics.totalParams.toFixed(1)}B params) | 
                        Data: ${dataRegimes[dataRegime].description}
                    `;
                }

                // Update explanation
                updateExplanation(metrics);
            };

            // Update the educational explanation
            function updateExplanation(metrics) {
                if (!explanation) return;

                const strategy = metrics.strategy;
                const scenario = metrics.scenario;

                let explanationText = `
                    <div class="space-y-3">
                        <div class="bg-white p-4 rounded-lg border">
                            <h6 class="font-semibold text-gray-900 mb-2">🎯 ${strategy.name} for ${scenario.name}</h6>
                            <p class="text-sm text-gray-700 mb-3">${strategy.description}</p>
                            
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div class="font-medium text-green-900 mb-1">✅ Advantages:</div>
                                    <ul class="text-xs text-green-700 space-y-1">
                                        ${strategy.pros.map(pro => `<li>• ${pro}</li>`).join('')}
                                    </ul>
                                </div>
                                <div>
                                    <div class="font-medium text-red-900 mb-1">⚠️ Considerations:</div>
                                    <ul class="text-xs text-red-700 space-y-1">
                                        ${strategy.cons.map(con => `<li>• ${con}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-blue-50 p-3 rounded border border-blue-200">
                            <h6 class="font-medium text-blue-900 mb-2">📈 Key Performance Insights</h6>
                            <div class="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
                                <div>
                                    <strong>Efficiency Score:</strong> ${metrics.efficiency.toFixed(2)}/10<br/>
                                    <strong>Memory Usage:</strong> ${metrics.memoryUsage.toFixed(1)}B parameters<br/>
                                    <strong>Data Requirement:</strong> ${metrics.dataRequirement.toFixed(1)}M samples
                                </div>
                                <div>
                                    <strong>Primary Challenge:</strong> ${scenario.primaryChallenge}<br/>
                                    <strong>Unified Advantage:</strong> ${scenario.unifiedAdvantage || ''}<br/>
                                    <strong>Modality Count:</strong> ${scenario.modalities.length} modalities
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Add strategy-specific insights
                if (getCurrentStrategy() === 'unified') {
                    explanationText += `
                        <div class="bg-green-50 p-3 rounded border border-green-200">
                            <h6 class="font-medium text-green-900 mb-2">🔮 Unified Transformer Key Characteristics</h6>
                            <div class="text-sm text-green-800 space-y-1">
                                <div>• <strong>Unified Tokenization:</strong> All modalities mapped to a shared token or embedding space</div>
                                <div>• <strong>Cross-Modal Attention:</strong> Interleaved attention enables early semantic exchange</div>
                                <div>• <strong>Parameter Sharing:</strong> Reduces redundancy versus siloed encoders</div>
                                <div>• <strong>Joint Training:</strong> Simultaneous optimization leverages cross-modal signals</div>
                            </div>
                        </div>
                    `;
                } else if (getCurrentStrategy() === 'traditional') {
                    explanationText += `
                        <div class="bg-red-50 p-3 rounded border border-red-200">
                            <h6 class="font-medium text-red-900 mb-2">⚠️ Traditional Approach Limitations</h6>
                            <div class="text-sm text-red-800 space-y-1">
                                <div>• <strong>Parameter Bloat:</strong> ${strategy.parameterMultiplier}x more parameters than unified approach</div>
                                <div>• <strong>Late Fusion:</strong> Limited cross-modal learning opportunities</div>
                                <div>• <strong>Sequential Training:</strong> Can't leverage cross-modal signals during pre-training</div>
                                <div>• <strong>Memory Intensive:</strong> Higher computational requirements</div>
                            </div>
                        </div>
                    `;
                }

                explanationText += `</div>`;
                explanation.innerHTML = explanationText;
            }

            // Example cycling functionality
            const examples = [
                { 
                    scenario: 'video-understanding', 
                    strategy: 'gemini', 
                    modelSize: 'medium', 
                    dataRegime: 'self-supervised',
                    note: 'Video: Unified vs Traditional'
                },
                { 
                    scenario: 'medical-diagnosis', 
                    strategy: 'traditional', 
                    modelSize: 'large', 
                    dataRegime: 'supervised',
                    note: 'Medical AI: Traditional Approach'
                },
                { 
                    scenario: 'conversational-ai', 
                    strategy: 'hybrid', 
                    modelSize: 'medium', 
                    dataRegime: 'contrastive',
                    note: 'Conversational AI: Hybrid Strategy'
                },
                { 
                    scenario: 'creative-content', 
                    strategy: 'unified', 
                    modelSize: 'ultra', 
                    dataRegime: 'mixed',
                    note: 'Creative AI: Unified Ultra'
                }
            ];
            
            let exampleIndex = 0;
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => {
                    const example = examples[exampleIndex];
                    scenarioSelect.value = example.scenario;
                    modelSizeSelect.value = example.modelSize;
                    dataRegimeSelect.value = example.dataRegime;
                    
                    const strategyRadio = document.querySelector(`input[name="q33-strategy"][value="${example.strategy}"]`);
                    if (strategyRadio) {
                        strategyRadio.checked = true;
                    }
                    
                    processAndDisplay();
                    
                    exampleBtn.textContent = example.note;
                    exampleIndex = (exampleIndex + 1) % examples.length;
                });
            }

            // Event listeners
            scenarioSelect.addEventListener('change', processAndDisplay);
            modelSizeSelect.addEventListener('change', processAndDisplay);
            dataRegimeSelect.addEventListener('change', processAndDisplay);
            strategyRadios.forEach(radio => {
                radio.addEventListener('change', processAndDisplay);
            });
            
            // Initial setup
            updateStrategyVisuals();
            processAndDisplay();
        }
    }
};