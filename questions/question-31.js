// Question 31: How does backpropagation work, and why is the chain rule critical?
// Created: July 16, 2025
// Educational Focus: Backpropagation algorithm, chain rule, gradient computation, neural network training

const question = {
    title: "31. How does backpropagation work, and why is the chain rule critical?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🔄 What is Backpropagation?</h4>
            <p class="text-blue-800">Backpropagation is the <strong>gradient computation algorithm</strong> that enables neural networks to learn. It works by propagating error signals backward through the network, using the <strong>chain rule of calculus</strong> to compute how much each parameter contributed to the final error. Think of it as tracing responsibility - when the network makes a mistake, backpropagation figures out which weights to blame and by how much.</p>
        </div>
        
        <!-- Chain Rule Mathematical Foundation -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-900 mb-3">📊 The Chain Rule Foundation</h4>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center">
                    <h5 class="font-medium text-gray-800 mb-2">Basic Chain Rule</h5>
                    <div class="bg-gray-50 p-3 rounded">
                        $$\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}$$
                    </div>
                    <p class="text-xs text-gray-600 mt-2">How loss L changes with weight w through intermediate variables</p>
                </div>
                <div class="text-center">
                    <h5 class="font-medium text-gray-800 mb-2">Neural Network Context</h5>
                    <div class="bg-gray-50 p-3 rounded">
                        $$\\frac{\\partial L}{\\partial W^{(1)}} = \\frac{\\partial L}{\\partial a^{(3)}} \\cdot \\frac{\\partial a^{(3)}}{\\partial z^{(3)}} \\cdot \\frac{\\partial z^{(3)}}{\\partial a^{(2)}} \\cdot \\frac{\\partial a^{(2)}}{\\partial z^{(2)}} \\cdot \\frac{\\partial z^{(2)}}{\\partial W^{(1)}}$$
                    </div>
                    <p class="text-xs text-gray-600 mt-2">Gradient flows through layers using chain rule</p>
                </div>
            </div>
        </div>
        
        <!-- Three-Step Process -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">1. Forward Pass</h5>
                <p class="text-sm text-green-700 mb-2">Compute predictions and store intermediate values</p>
                <div class="text-xs bg-green-100 px-2 py-1 rounded font-mono">
                    z = Wx + b → a = σ(z) → ŷ = f(a)
                </div>
                <p class="text-xs text-green-600 mt-2">✓ Cache activations for backward pass</p>
            </div>
            
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">2. Loss Computation</h5>
                <p class="text-sm text-purple-700 mb-2">Calculate error between prediction and target</p>
                <div class="text-xs bg-purple-100 px-2 py-1 rounded font-mono">
                    L = loss(ŷ, y_true)
                </div>
                <p class="text-xs text-purple-600 mt-2">⚠ Single scalar summarizing network performance</p>
            </div>
            
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">3. Backward Pass</h5>
                <p class="text-sm text-orange-700 mb-2">Propagate gradients backward layer by layer</p>
                <div class="text-xs bg-orange-100 px-2 py-1 rounded font-mono">
                    ∂L/∂W = chain_rule(∂L/∂ŷ, ∂ŷ/∂a, ∂a/∂z, ∂z/∂W)
                </div>
                <p class="text-xs text-orange-600 mt-2">🔄 Updates weights using computed gradients</p>
            </div>
        </div>
        
        <!-- Why It Matters Section -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why Backpropagation is Revolutionary</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Enables Learning:</strong> Without backprop, neural networks couldn't automatically adjust weights to minimize errors</li>
                <li>• <strong>Efficient Computation:</strong> Computes all gradients in one backward pass instead of separate finite differences</li>
                <li>• <strong>Scales to Deep Networks:</strong> Chain rule allows gradient computation through many layers systematically</li>
                <li>• <strong>Automatic Differentiation:</strong> Modern frameworks implement backprop automatically using computational graphs</li>
                <li>• <strong>Foundation of Deep Learning:</strong> Every neural network training relies on this gradient computation method</li>
            </ul>
        </div>
        
        <!-- Computational Graph Perspective -->
        <div class="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
            <h4 class="font-semibold text-indigo-900 mb-2">🌐 Computational Graph View</h4>
            <p class="text-sm text-indigo-800">Modern deep learning frameworks represent neural networks as <strong>computational graphs</strong> where nodes are operations and edges carry values. Forward pass flows data through the graph, backward pass flows gradients in reverse. The chain rule becomes automatic graph traversal, making backpropagation systematic and efficient.</p>
            <div class="mt-3 p-2 bg-indigo-100 rounded text-xs font-mono">
                Input → [Linear] → [ReLU] → [Linear] → [Softmax] → Output<br>
                ← ∂L/∂W₂ ← ∂L/∂a₁ ← ∂L/∂z₁ ← ∂L/∂W₁ ← ∂L/∂ŷ
            </div>
        </div>
        
        <!-- Common Challenges -->
        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 class="font-semibold text-red-900 mb-2">⚠️ Backpropagation Challenges</h4>
            <div class="grid md:grid-cols-2 gap-3 text-sm text-red-800">
                <div>
                    <p><strong>Vanishing Gradients:</strong> Deep networks suffer when gradients become extremely small during backward propagation, making early layers learn very slowly.</p>
                </div>
                <div>
                    <p><strong>Exploding Gradients:</strong> Conversely, gradients can become exponentially large, causing unstable training and divergence.</p>
                </div>
            </div>
        </div>
    </div>`,
    interactive: {
        title: "🔍 Interactive Backpropagation Visualizer",
        html: `<div class="space-y-6">
            <!-- Network Configuration -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">🧠 Neural Network Configuration</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label for="q31-input-value" class="text-xs text-gray-600">Input (x)</label>
                        <input type="range" id="q31-input-value" min="-2" max="2" step="0.1" value="1.0" class="w-full">
                        <span id="q31-input-display" class="text-xs font-medium">1.0</span>
                    </div>
                    <div>
                        <label for="q31-weight1" class="text-xs text-gray-600">Weight W₁</label>
                        <input type="range" id="q31-weight1" min="-2" max="2" step="0.1" value="0.5" class="w-full">
                        <span id="q31-weight1-display" class="text-xs font-medium">0.5</span>
                    </div>
                    <div>
                        <label for="q31-weight2" class="text-xs text-gray-600">Weight W₂</label>
                        <input type="range" id="q31-weight2" min="-2" max="2" step="0.1" value="0.8" class="w-full">
                        <span id="q31-weight2-display" class="text-xs font-medium">0.8</span>
                    </div>
                    <div>
                        <label for="q31-target" class="text-xs text-gray-600">Target (y)</label>
                        <input type="range" id="q31-target" min="0" max="1" step="0.1" value="0.7" class="w-full">
                        <span id="q31-target-display" class="text-xs font-medium">0.7</span>
                    </div>
                </div>
                <p class="text-xs text-gray-600 mt-2">Adjust parameters to see how gradients flow through the network!</p>
            </div>
            
            <!-- Activation Function Selection -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-3">⚡ Choose Activation Function</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q31-activation" value="sigmoid" checked class="absolute top-2 right-2">
                        <div class="activation-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Sigmoid</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Smooth</span>
                            </div>
                            <p class="text-xs text-gray-600">σ(x) = 1/(1 + e^(-x))</p>
                            <p class="text-xs text-gray-500 mt-1">Classic activation with smooth gradients</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q31-activation" value="tanh" class="absolute top-2 right-2">
                        <div class="activation-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">Tanh</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Centered</span>
                            </div>
                            <p class="text-xs text-gray-600">tanh(x) = (e^x - e^(-x))/(e^x + e^(-x))</p>
                            <p class="text-xs text-gray-500 mt-1">Zero-centered with stronger gradients</p>
                        </div>
                    </label>
                    
                    <label class="relative border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="q31-activation" value="relu" class="absolute top-2 right-2">
                        <div class="activation-option">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-900">ReLU</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Modern</span>
                            </div>
                            <p class="text-xs text-gray-600">ReLU(x) = max(0, x)</p>
                            <p class="text-xs text-gray-500 mt-1">Prevents vanishing gradients</p>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Integrated Network Flow & Calculations -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-4">🌐 Network Flow & Calculation</h4>
                
                <!-- Network Visualization -->
                <div id="q31-network-diagram" class="relative h-48 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg overflow-hidden mb-6">
                    <!-- Network diagram will be drawn here -->
                </div>
                
                <!-- Legend -->
                <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600 mb-6">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Forward Pass (Data Flow)</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Backward Pass (Gradient Flow)</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-8 h-1 bg-gray-300 mr-2"></div>
                        <span>Gradient Strength</span>
                    </div>
                </div>

                <!-- Forward Pass Section -->
                <h5 class="font-medium text-gray-900 mb-3 border-t pt-4 flex items-center">
                    <span class="text-xl mr-2">➡️</span>
                    Forward Pass
                    <span class="ml-2 text-sm text-gray-500">(Data flows left to right)</span>
                </h5>
                <div id="q31-forward-pass" class="space-y-3 mb-6">
                    <!-- Forward pass steps will be displayed here -->
                </div>

                <!-- Backward Pass Section -->
                <h5 class="font-medium text-gray-900 mb-3 border-t pt-4 flex items-center">
                    <span class="text-xl mr-2">⬅️</span>
                    Backward Pass (Chain Rule in Action)
                    <span class="ml-2 text-sm text-gray-500">(Gradients flow right to left)</span>
                </h5>
                <div id="q31-backward-pass" class="space-y-3">
                    <!-- Backward pass steps will be displayed here -->
                </div>
            </div>
            
            <!-- Gradient Summary -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">📊 Gradient Summary</h4>
                <div id="q31-gradients" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Gradient values will be displayed here -->
                </div>
            </div>
            
            <!-- Quick Examples -->
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700">💡 Quick Tests:</span>
                <button id="q31-example-1" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors">Large Error</button>
                <button id="q31-example-2" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">Small Error</button>
                <button id="q31-example-3" class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors">Zero Gradients</button>
            </div>
            
            <!-- Educational Explanation -->
            <div id="q31-explanation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 class="font-medium text-yellow-900 mb-2">🎓 Understanding the Process</h4>
                <div id="q31-explanation-content" class="text-sm text-yellow-800"></div>
            </div>
        </div>`,
        script: () => {
            // Get DOM elements with error checking
            const inputValue = document.getElementById('q31-input-value');
            const weight1 = document.getElementById('q31-weight1');
            const weight2 = document.getElementById('q31-weight2');
            const target = document.getElementById('q31-target');
            const inputDisplay = document.getElementById('q31-input-display');
            const weight1Display = document.getElementById('q31-weight1-display');
            const weight2Display = document.getElementById('q31-weight2-display');
            const targetDisplay = document.getElementById('q31-target-display');
            const activationRadios = document.querySelectorAll('input[name="q31-activation"]');
            const forwardPass = document.getElementById('q31-forward-pass');
            const backwardPass = document.getElementById('q31-backward-pass');
            const gradients = document.getElementById('q31-gradients');
            const explanationContent = document.getElementById('q31-explanation-content');
            const example1Btn = document.getElementById('q31-example-1');
            const example2Btn = document.getElementById('q31-example-2');
            const example3Btn = document.getElementById('q31-example-3');

            // Check if required elements exist
            if (!inputValue || !forwardPass) {
                console.error('Required DOM elements not found');
                return;
            }

            // Activation functions and their derivatives
            const activations = {
                sigmoid: {
                    fn: (x) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))),
                    derivative: (x) => {
                        const s = 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
                        return s * (1 - s);
                    },
                    name: 'Sigmoid'
                },
                tanh: {
                    fn: (x) => Math.tanh(x),
                    derivative: (x) => 1 - Math.tanh(x) ** 2,
                    name: 'Tanh'
                },
                relu: {
                    fn: (x) => Math.max(0, x),
                    derivative: (x) => x > 0 ? 1 : 0,
                    name: 'ReLU'
                }
            };

            // Helper function to get current activation
            function getCurrentActivation() {
                const selectedRadio = document.querySelector('input[name="q31-activation"]:checked');
                return selectedRadio ? selectedRadio.value : 'sigmoid';
            }

            // Update visual indicators for activation selection
            function updateActivationVisuals() {
                const selected = document.querySelector('input[name="q31-activation"]:checked');
                if (!selected) return;
                
                // Update radio button containers
                document.querySelectorAll('input[name="q31-activation"]').forEach((radio) => {
                    const container = radio.closest('label');
                    if (radio.checked) {
                        container.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
                    } else {
                        container.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
                    }
                });
            }

            // Draw network diagram with animated flow
            function drawNetworkDiagram(values) {
                const diagram = document.getElementById('q31-network-diagram');
                if (!diagram) return;
                
                const { x, z1, a1, z2, y_pred, y_true, loss, dL_dw1, dL_dw2 } = values;
                
                // Clear previous content
                diagram.innerHTML = '';
                
                // Create SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('viewBox', '0 0 800 180');
                
                // Node positions - better spacing and layout
                const nodes = [
                    { x: 80, y: 90, label: 'Input', value: x.toFixed(2), color: '#3b82f6' },
                    { x: 240, y: 90, label: 'Hidden', value: a1.toFixed(2), color: '#8b5cf6' },
                    { x: 400, y: 90, label: 'Output', value: y_pred.toFixed(2), color: '#ef4444' },
                    { x: 560, y: 90, label: 'Target', value: y_true.toFixed(2), color: '#10b981' }
                ];
                
                // Draw connections with animated flow
                const connections = [
                    { from: 0, to: 1, weight: parseFloat(weight1.value), gradient: dL_dw1 },
                    { from: 1, to: 2, weight: parseFloat(weight2.value), gradient: dL_dw2 }
                ];
                
                connections.forEach((conn, i) => {
                    const fromNode = nodes[conn.from];
                    const toNode = nodes[conn.to];
                    
                    // Forward connection line with gradient-based styling
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', fromNode.x + 35);
                    line.setAttribute('y1', fromNode.y);
                    line.setAttribute('x2', toNode.x - 35);
                    line.setAttribute('y2', toNode.y);
                    line.setAttribute('stroke', conn.weight >= 0 ? '#4f46e5' : '#dc2626');
                    line.setAttribute('stroke-width', Math.abs(conn.weight) * 2 + 2);
                    line.setAttribute('opacity', '0.8');
                    line.setAttribute('stroke-dasharray', conn.weight >= 0 ? 'none' : '5,5');
                    svg.appendChild(line);
                    
                    // Weight label with better positioning
                    const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    weightText.setAttribute('x', (fromNode.x + toNode.x) / 2);
                    weightText.setAttribute('y', fromNode.y - 25);
                    weightText.setAttribute('text-anchor', 'middle');
                    weightText.setAttribute('font-size', '11');
                    weightText.setAttribute('font-weight', 'bold');
                    weightText.setAttribute('fill', '#374151');
                    weightText.textContent = `w${i+1}=${conn.weight.toFixed(2)}`;
                    svg.appendChild(weightText);
                    
                    // Gradient label with visual emphasis
                    const gradText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    gradText.setAttribute('x', (fromNode.x + toNode.x) / 2);
                    gradText.setAttribute('y', fromNode.y + 40);
                    gradText.setAttribute('text-anchor', 'middle');
                    gradText.setAttribute('font-size', '10');
                    gradText.setAttribute('font-weight', 'bold');
                    gradText.setAttribute('fill', Math.abs(conn.gradient) > 0.1 ? '#dc2626' : '#059669');
                    gradText.textContent = `∇=${conn.gradient.toFixed(3)}`;
                    svg.appendChild(gradText);
                    
                    // Gradient magnitude indicator bar
                    const gradBarBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    gradBarBg.setAttribute('x', (fromNode.x + toNode.x) / 2 - 15);
                    gradBarBg.setAttribute('y', fromNode.y + 45);
                    gradBarBg.setAttribute('width', '30');
                    gradBarBg.setAttribute('height', '3');
                    gradBarBg.setAttribute('fill', '#e5e7eb');
                    gradBarBg.setAttribute('rx', '1.5');
                    svg.appendChild(gradBarBg);
                    
                    const gradBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    gradBar.setAttribute('x', (fromNode.x + toNode.x) / 2 - 15);
                    gradBar.setAttribute('y', fromNode.y + 45);
                    gradBar.setAttribute('width', Math.min(30, Math.abs(conn.gradient) * 100));
                    gradBar.setAttribute('height', '3');
                    gradBar.setAttribute('fill', Math.abs(conn.gradient) > 0.1 ? '#dc2626' : '#059669');
                    gradBar.setAttribute('rx', '1.5');
                    svg.appendChild(gradBar);
                    
                    // Enhanced animated flow dots for forward pass
                    const forwardDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    forwardDot.setAttribute('r', '5');
                    forwardDot.setAttribute('fill', '#3b82f6');
                    forwardDot.setAttribute('opacity', '0.9');
                    forwardDot.setAttribute('stroke', '#1e40af');
                    forwardDot.setAttribute('stroke-width', '1');
                    
                    const forwardPath = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
                    forwardPath.setAttribute('dur', '2s');
                    forwardPath.setAttribute('repeatCount', 'indefinite');
                    forwardPath.setAttribute('path', `M ${fromNode.x + 35} ${fromNode.y} L ${toNode.x - 35} ${toNode.y}`);
                    forwardDot.appendChild(forwardPath);
                    svg.appendChild(forwardDot);
                    
                    // Enhanced animated flow dots for backward pass (gradient flow)
                    const backwardDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    backwardDot.setAttribute('r', '4');
                    backwardDot.setAttribute('fill', '#dc2626');
                    backwardDot.setAttribute('opacity', '0.8');
                    backwardDot.setAttribute('stroke', '#991b1b');
                    backwardDot.setAttribute('stroke-width', '1');
                    
                    const backwardPath = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
                    backwardPath.setAttribute('dur', '2.5s');
                    backwardPath.setAttribute('repeatCount', 'indefinite');
                    backwardPath.setAttribute('begin', '1s');
                    backwardPath.setAttribute('path', `M ${toNode.x - 35} ${toNode.y + 15} L ${fromNode.x + 35} ${fromNode.y + 15}`);
                    backwardDot.appendChild(backwardPath);
                    svg.appendChild(backwardDot);
                });
                
                // Draw nodes with enhanced styling
                nodes.forEach((node, i) => {
                    // Node circle with gradient effect
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', node.x);
                    circle.setAttribute('cy', node.y);
                    circle.setAttribute('r', '30');
                    circle.setAttribute('fill', node.color);
                    circle.setAttribute('opacity', '0.15');
                    circle.setAttribute('stroke', node.color);
                    circle.setAttribute('stroke-width', '3');
                    svg.appendChild(circle);
                    
                    // Inner circle for depth
                    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    innerCircle.setAttribute('cx', node.x);
                    innerCircle.setAttribute('cy', node.y);
                    innerCircle.setAttribute('r', '22');
                    innerCircle.setAttribute('fill', 'white');
                    innerCircle.setAttribute('opacity', '0.9');
                    innerCircle.setAttribute('stroke', node.color);
                    innerCircle.setAttribute('stroke-width', '1');
                    svg.appendChild(innerCircle);
                    
                    // Node label
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', node.x);
                    label.setAttribute('y', node.y - 8);
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('font-size', '10');
                    label.setAttribute('font-weight', 'bold');
                    label.setAttribute('fill', node.color);
                    label.textContent = node.label;
                    svg.appendChild(label);
                    
                    // Node value with better contrast
                    const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    value.setAttribute('x', node.x);
                    value.setAttribute('y', node.y + 10);
                    value.setAttribute('text-anchor', 'middle');
                    value.setAttribute('font-size', '12');
                    value.setAttribute('font-weight', 'bold');
                    value.setAttribute('fill', '#1f2937');
                    value.textContent = node.value;
                    svg.appendChild(value);
                });
                
                // Add loss connection from Output to Target
                const lossLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                lossLine.setAttribute('x1', nodes[2].x + 30);
                lossLine.setAttribute('y1', nodes[2].y);
                lossLine.setAttribute('x2', nodes[3].x - 30);
                lossLine.setAttribute('y2', nodes[3].y);
                lossLine.setAttribute('stroke', loss > 0.1 ? '#dc2626' : '#059669');
                lossLine.setAttribute('stroke-width', '2');
                lossLine.setAttribute('opacity', '0.6');
                lossLine.setAttribute('stroke-dasharray', '8,4');
                svg.appendChild(lossLine);
                
                // Loss calculation in the middle
                const lossBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                lossBox.setAttribute('x', (nodes[2].x + nodes[3].x) / 2 - 35);
                lossBox.setAttribute('y', nodes[2].y - 35);
                lossBox.setAttribute('width', '70');
                lossBox.setAttribute('height', '25');
                lossBox.setAttribute('fill', loss > 0.1 ? '#fee2e2' : '#dcfce7');
                lossBox.setAttribute('stroke', loss > 0.1 ? '#dc2626' : '#059669');
                lossBox.setAttribute('stroke-width', '1');
                lossBox.setAttribute('rx', '5');
                svg.appendChild(lossBox);
                
                // Loss value text
                const lossText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                lossText.setAttribute('x', (nodes[2].x + nodes[3].x) / 2);
                lossText.setAttribute('y', nodes[2].y - 18);
                lossText.setAttribute('text-anchor', 'middle');
                lossText.setAttribute('font-size', '11');
                lossText.setAttribute('font-weight', 'bold');
                lossText.setAttribute('fill', loss > 0.1 ? '#dc2626' : '#059669');
                lossText.textContent = `Loss: ${loss.toFixed(3)}`;
                svg.appendChild(lossText);
                
                diagram.appendChild(svg);
            }

            // Main computation and visualization function
            function computeAndVisualize() {
                // Get current values
                const x = parseFloat(inputValue.value);
                const w1 = parseFloat(weight1.value);
                const w2 = parseFloat(weight2.value);
                const y_true = parseFloat(target.value);
                const activationType = getCurrentActivation();
                const activation = activations[activationType];

                // Update displays
                inputDisplay.textContent = x.toFixed(1);
                weight1Display.textContent = w1.toFixed(1);
                weight2Display.textContent = w2.toFixed(1);
                targetDisplay.textContent = y_true.toFixed(1);

                updateActivationVisuals();

                // Forward Pass Computation
                const z1 = w1 * x;  // First linear transformation
                const a1 = activation.fn(z1);  // First activation
                const z2 = w2 * a1;  // Second linear transformation
                const y_pred = activation.fn(z2);  // Final activation (prediction)
                const loss = 0.5 * (y_pred - y_true) ** 2;  // MSE loss

                // Display Forward Pass with enhanced flow visualization
                const forwardHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-9 gap-2 text-sm items-center">
                        <div class="bg-blue-50 p-3 rounded border text-center transform hover:scale-105 transition-transform">
                            <div class="font-medium text-blue-900">Input</div>
                            <div class="text-lg font-bold text-blue-600">${x.toFixed(3)}</div>
                            <div class="text-xs text-blue-700">x</div>
                        </div>
                        
                        <!-- Flow arrow 1 -->
                        <div class="text-center hidden md:block">
                            <div class="text-xl text-gray-400">→</div>
                            <div class="text-xs text-gray-500">×w₁</div>
                        </div>
                        
                        <div class="bg-green-50 p-3 rounded border text-center transform hover:scale-105 transition-transform">
                            <div class="font-medium text-green-900">Linear 1</div>
                            <div class="text-lg font-bold text-green-600">${z1.toFixed(3)}</div>
                            <div class="text-xs text-green-700">z₁ = ${w1.toFixed(1)} × ${x.toFixed(1)}</div>
                        </div>
                        
                        <!-- Flow arrow 2 -->
                        <div class="text-center hidden md:block">
                            <div class="text-xl text-gray-400">→</div>
                            <div class="text-xs text-gray-500">${activationType}</div>
                        </div>
                        
                        <div class="bg-purple-50 p-3 rounded border text-center transform hover:scale-105 transition-transform">
                            <div class="font-medium text-purple-900">${activation.name}</div>
                            <div class="text-lg font-bold text-purple-600">${a1.toFixed(3)}</div>
                            <div class="text-xs text-purple-700">a₁ = ${activationType}(z₁)</div>
                        </div>
                        
                        <!-- Flow arrow 3 -->
                        <div class="text-center hidden md:block">
                            <div class="text-xl text-gray-400">→</div>
                            <div class="text-xs text-gray-500">×w₂</div>
                        </div>
                        
                        <div class="bg-orange-50 p-3 rounded border text-center transform hover:scale-105 transition-transform">
                            <div class="font-medium text-orange-900">Linear 2</div>
                            <div class="text-lg font-bold text-orange-600">${z2.toFixed(3)}</div>
                            <div class="text-xs text-orange-700">z₂ = ${w2.toFixed(1)} × ${a1.toFixed(3)}</div>
                        </div>
                        
                        <!-- Flow arrow 4 -->
                        <div class="text-center hidden md:block">
                            <div class="text-xl text-gray-400">→</div>
                            <div class="text-xs text-gray-500">${activationType}</div>
                        </div>
                        
                        <div class="bg-red-50 p-3 rounded border text-center transform hover:scale-105 transition-transform">
                            <div class="font-medium text-red-900">Output</div>
                            <div class="text-lg font-bold text-red-600">${y_pred.toFixed(3)}</div>
                            <div class="text-xs text-red-700">ŷ = ${activationType}(z₂)</div>
                        </div>
                    </div>
                    
                    <!-- Loss calculation with visual emphasis -->
                    <div class="mt-4 p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-lg border-2 ${loss > 0.1 ? 'border-red-300' : loss > 0.01 ? 'border-yellow-300' : 'border-green-300'} text-center">
                        <div class="flex items-center justify-center space-x-4">
                            <div class="text-lg font-medium text-gray-700">Loss:</div>
                            <div class="text-3xl font-bold ${loss > 0.1 ? 'text-red-600' : loss > 0.01 ? 'text-yellow-600' : 'text-green-600'}">${loss.toFixed(4)}</div>
                            <div class="text-lg ${loss > 0.1 ? 'text-red-500' : loss > 0.01 ? 'text-yellow-500' : 'text-green-500'}">
                                ${loss > 0.1 ? '😰 High Error' : loss > 0.01 ? '😐 Moderate Error' : '😊 Low Error'}
                            </div>
                        </div>
                        <div class="text-sm text-gray-600 mt-2">
                            L = ½(ŷ - y)² = ½(${y_pred.toFixed(3)} - ${y_true})² 
                            <span class="ml-2 text-xs">
                                ${Math.abs(y_pred - y_true) > 0.1 ? '⚠️ Large prediction error' : '✅ Reasonable prediction'}
                            </span>
                        </div>
                    </div>
                `;
                forwardPass.innerHTML = forwardHTML;

                // Backward Pass Computation (Chain Rule)
                const dL_dy_pred = y_pred - y_true;  // ∂L/∂ŷ
                const dy_pred_dz2 = activation.derivative(z2);  // ∂ŷ/∂z₂
                const dz2_da1 = w2;  // ∂z₂/∂a₁
                const da1_dz1 = activation.derivative(z1);  // ∂a₁/∂z₁
                const dz1_dw1 = x;  // ∂z₁/∂w₁
                const dz2_dw2 = a1;  // ∂z₂/∂w₂

                // Final gradients using chain rule
                const dL_dw2 = dL_dy_pred * dy_pred_dz2 * dz2_dw2;  // ∂L/∂w₂
                const dL_dw1 = dL_dy_pred * dy_pred_dz2 * dz2_da1 * da1_dz1 * dz1_dw1;  // ∂L/∂w₁

                // Display Backward Pass with enhanced chain rule visualization
                const backwardHTML = `
                    <div class="space-y-4">
                        <!-- Step 1: Loss Gradient -->
                        <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 transform hover:scale-[1.02] transition-transform">
                            <div class="flex items-center justify-between mb-3">
                                <div class="font-bold text-red-900 text-lg">Step 1: Loss Gradient</div>
                                <div class="text-2xl">🎯</div>
                            </div>
                            <div class="bg-red-100 p-3 rounded font-mono text-sm">
                                ∂L/∂ŷ = ŷ - y = ${y_pred.toFixed(3)} - ${y_true.toFixed(3)} = <span class="font-bold text-red-700 text-lg">${dL_dy_pred.toFixed(4)}</span>
                            </div>
                            <div class="text-xs text-red-700 mt-2">
                                ${Math.abs(dL_dy_pred) > 0.1 ? '🔥 Strong error signal - network needs significant adjustment' : '✅ Small error signal - network is close to target'}
                            </div>
                        </div>
                        
                        <!-- Chain Rule Flow Indicator -->
                        <div class="flex items-center justify-center">
                            <div class="text-3xl text-gray-400">⬇️</div>
                            <div class="ml-2 text-sm text-gray-600 font-medium">Chain rule propagates error backward</div>
                        </div>
                        
                        <!-- Step 2: Output Layer Gradient -->
                        <div class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 transform hover:scale-[1.02] transition-transform">
                            <div class="flex items-center justify-between mb-3">
                                <div class="font-bold text-orange-900 text-lg">Step 2: Output Layer (w₂)</div>
                                <div class="text-2xl">⚡</div>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="bg-orange-100 p-2 rounded font-mono">∂ŷ/∂z₂ = ${activationType}'(z₂) = <span class="font-bold">${dy_pred_dz2.toFixed(4)}</span></div>
                                <div class="bg-orange-100 p-2 rounded font-mono">∂z₂/∂w₂ = a₁ = <span class="font-bold">${dz2_dw2.toFixed(4)}</span></div>
                                <div class="bg-orange-200 p-3 rounded font-mono border-t-2 border-orange-400">
                                    <div class="text-center">
                                        ∂L/∂w₂ = <span class="text-red-600">${dL_dy_pred.toFixed(4)}</span> × <span class="text-blue-600">${dy_pred_dz2.toFixed(4)}</span> × <span class="text-green-600">${dz2_dw2.toFixed(4)}</span>
                                    </div>
                                    <div class="text-center mt-1 text-lg font-bold text-orange-700">= ${dL_dw2.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Chain Rule Flow Indicator -->
                        <div class="flex items-center justify-center">
                            <div class="text-3xl text-gray-400">⬇️</div>
                            <div class="ml-2 text-sm text-gray-600 font-medium">Continuing through the chain...</div>
                        </div>
                        
                        <!-- Step 3: Hidden Layer Gradient -->
                        <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 transform hover:scale-[1.02] transition-transform">
                            <div class="flex items-center justify-between mb-3">
                                <div class="font-bold text-purple-900 text-lg">Step 3: Hidden Layer (w₁) - Full Chain</div>
                                <div class="text-2xl">🔗</div>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="bg-purple-100 p-2 rounded font-mono">∂z₂/∂a₁ = w₂ = <span class="font-bold">${dz2_da1.toFixed(4)}</span></div>
                                <div class="bg-purple-100 p-2 rounded font-mono">∂a₁/∂z₁ = ${activationType}'(z₁) = <span class="font-bold">${da1_dz1.toFixed(4)}</span></div>
                                <div class="bg-purple-100 p-2 rounded font-mono">∂z₁/∂w₁ = x = <span class="font-bold">${dz1_dw1.toFixed(4)}</span></div>
                                <div class="bg-purple-200 p-3 rounded font-mono border-t-2 border-purple-400">
                                    <div class="text-center text-xs mb-1">∂L/∂w₁ = Loss × Output' × w₂ × Hidden' × Input</div>
                                    <div class="text-center">
                                        = <span class="text-red-600">${dL_dy_pred.toFixed(4)}</span> × <span class="text-orange-600">${dy_pred_dz2.toFixed(4)}</span> × <span class="text-blue-600">${dz2_da1.toFixed(4)}</span> × <span class="text-green-600">${da1_dz1.toFixed(4)}</span> × <span class="text-yellow-600">${dz1_dw1.toFixed(4)}</span>
                                    </div>
                                    <div class="text-center mt-1 text-lg font-bold text-purple-700">= ${dL_dw1.toFixed(4)}</div>
                                </div>
                            </div>
                            <div class="text-xs text-purple-700 mt-2">
                                💡 Notice how w₁ gradient requires ${Math.abs(dL_dw1) < Math.abs(dL_dw2) ? 'more' : 'the same number of'} chain rule steps than w₂
                            </div>
                        </div>
                        
                        <!-- Final Chain Rule Summary -->
                        <div class="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                            <div class="text-center">
                                <div class="font-bold text-indigo-900 mb-2">🎓 Chain Rule Magic</div>
                                <div class="text-sm text-indigo-800">
                                    Each gradient flows backward through the network, multiplying derivatives at each step. 
                                    Earlier layers (w₁) need longer chains, which can lead to vanishing gradients in deep networks.
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                backwardPass.innerHTML = backwardHTML;

                // Display Gradient Summary with enhanced visuals
                const gradMagnitude = Math.sqrt(dL_dw1**2 + dL_dw2**2);
                const maxGrad = Math.max(Math.abs(dL_dw1), Math.abs(dL_dw2));
                
                // Create gradient bars for visual comparison
                const w1GradPercent = maxGrad > 0 ? Math.abs(dL_dw1) / maxGrad * 100 : 0;
                const w2GradPercent = maxGrad > 0 ? Math.abs(dL_dw2) / maxGrad * 100 : 0;
                
                const gradientHTML = `
                    <div class="text-center p-4 bg-blue-50 rounded border relative overflow-hidden">
                        <div class="font-medium text-blue-900 mb-2">Gradient for w₁</div>
                        <div class="text-2xl font-bold text-blue-600">${dL_dw1.toFixed(4)}</div>
                        <div class="text-xs text-blue-700 mb-2">Weight update: w₁ -= η × ${dL_dw1.toFixed(4)}</div>
                        <!-- Gradient strength bar -->
                        <div class="w-full bg-blue-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: ${w1GradPercent}%"></div>
                        </div>
                        <div class="text-xs text-blue-600 mt-1">${(Math.abs(dL_dw1) / (maxGrad || 1) * 100).toFixed(1)}% of max</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded border relative overflow-hidden">
                        <div class="font-medium text-green-900 mb-2">Gradient for w₂</div>
                        <div class="text-2xl font-bold text-green-600">${dL_dw2.toFixed(4)}</div>
                        <div class="text-xs text-green-700 mb-2">Weight update: w₂ -= η × ${dL_dw2.toFixed(4)}</div>
                        <!-- Gradient strength bar -->
                        <div class="w-full bg-green-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full transition-all duration-300" style="width: ${w2GradPercent}%"></div>
                        </div>
                        <div class="text-xs text-green-600 mt-1">${(Math.abs(dL_dw2) / (maxGrad || 1) * 100).toFixed(1)}% of max</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded border">
                        <div class="font-medium text-purple-900 mb-2">Overall Learning Signal</div>
                        <div class="text-2xl font-bold text-purple-600">${gradMagnitude.toFixed(4)}</div>
                        <div class="text-xs text-purple-700 mb-2">||∇L|| = √(∇w₁² + ∇w₂²)</div>
                        <!-- Learning intensity indicator -->
                        <div class="flex items-center justify-center space-x-1">
                            ${gradMagnitude < 0.01 ? '🟡' : gradMagnitude < 0.1 ? '🟠' : '🔴'}
                            <span class="text-xs font-medium">
                                ${gradMagnitude < 0.01 ? 'Weak' : gradMagnitude < 0.1 ? 'Moderate' : 'Strong'} Learning
                            </span>
                        </div>
                    </div>
                `;
                gradients.innerHTML = gradientHTML;

                // Draw network diagram
                drawNetworkDiagram({
                    x, z1, a1, z2, y_pred, y_true, loss, dL_dw1, dL_dw2
                });

                // Update explanation
                updateExplanation(activationType, dL_dw1, dL_dw2, loss);
            }

            // Update educational explanation with enhanced insights
            function updateExplanation(activationType, grad_w1, grad_w2, loss) {
                if (!explanationContent) return;

                const gradMagnitude = Math.sqrt(grad_w1**2 + grad_w2**2);
                const w1_abs = Math.abs(grad_w1);
                const w2_abs = Math.abs(grad_w2);
                const chainLengthW1 = 5; // x → z1 → a1 → z2 → y → loss
                const chainLengthW2 = 3; // a1 → z2 → y → loss
                
                let explanationText = '';

                // Blame Assignment Analysis
                if (loss > 0.1) {
                    const blame = w1_abs > w2_abs 
                        ? `Weight <strong>w₁</strong> (gradient: ${grad_w1.toFixed(4)}) is currently more <strong>responsible</strong> for the error than w₂.`
                        : `Weight <strong>w₂</strong> (gradient: ${grad_w2.toFixed(4)}) is currently more <strong>responsible</strong> for the error than w₁.`;
                    
                    const blameRatio = w1_abs > w2_abs ? (w1_abs / w2_abs).toFixed(1) : (w2_abs / w1_abs).toFixed(1);
                    const dominantWeight = w1_abs > w2_abs ? 'w₁' : 'w₂';
                    
                    explanationText += `
                        <p><strong>🎯 Blame Assignment:</strong> With a high loss of ${loss.toFixed(3)}, the gradients tell us which weights to blame for the error. ${blame}</p>
                        <p class="mt-2"><strong>🔍 Responsibility Factor:</strong> The dominant weight (${dominantWeight}) will receive ${blameRatio}× stronger updates, making it the primary target for error correction. This is backpropagation's way of <em>focusing learning</em> where it's needed most.</p>
                    `;
                } else if (loss < 0.01) {
                    explanationText += `
                        <p><strong>✅ Low Error State:</strong> The loss is very low (${loss.toFixed(4)}), so both weights share minimal blame. Small gradients (w₁: ${grad_w1.toFixed(4)}, w₂: ${grad_w2.toFixed(4)}) mean only gentle adjustments are needed.</p>
                        <p class="mt-2"><strong>🎯 Balanced Responsibility:</strong> When near the target, blame is distributed more evenly. The network has learned to balance contributions from both weights effectively!</p>
                    `;
                } else {
                    const moreResponsible = w1_abs > w2_abs ? 'w₁' : 'w₂';
                    const lessResponsible = w1_abs > w2_abs ? 'w₂' : 'w₁';
                    const dominantGrad = w1_abs > w2_abs ? grad_w1 : grad_w2;
                    
                    explanationText += `
                        <p><strong>⚖️ Moderate Blame Distribution:</strong> With moderate loss (${loss.toFixed(3)}), <strong>${moreResponsible}</strong> carries more responsibility (gradient: ${dominantGrad.toFixed(4)}) while ${lessResponsible} plays a supporting role.</p>
                        <p class="mt-2"><strong>🔄 Learning Balance:</strong> This moderate blame assignment ensures steady, stable learning without overshooting the target.</p>
                    `;
                }

                // Chain Rule Impact and Gradient Flow Analysis
                explanationText += `
                    <p class="mt-3"><strong>🔗 Chain Rule Impact:</strong> The gradient for w₁ travels through ${chainLengthW1} computational steps vs w₂'s ${chainLengthW2} steps. Each step multiplies the gradient by a derivative term.</p>
                `;

                // Vanishing/Exploding Gradient Analysis
                if (gradMagnitude < 0.001) {
                    explanationText += `
                        <p class="mt-2"><strong>⚠️ Vanishing Gradient Warning:</strong> Extremely small gradients (||∇|| = ${gradMagnitude.toFixed(6)}) demonstrate the <em>vanishing gradient problem</em>. In deeper networks, w₁ would receive even weaker signals, making early layers nearly impossible to train!</p>
                        <p class="mt-2"><strong>🔬 Why This Happens:</strong> Each ${activationType} derivative multiplied in the chain can shrink the gradient. With ${chainLengthW1} multiplications for w₁, small derivatives compound exponentially.</p>
                    `;
                } else if (gradMagnitude > 1.0) {
                    explanationText += `
                        <p class="mt-2"><strong>🚀 Exploding Gradient Alert:</strong> Large gradients (||∇|| = ${gradMagnitude.toFixed(4)}) show how the <em>exploding gradient problem</em> emerges. If activation derivatives were consistently large, w₁'s longer chain would amplify gradients dramatically!</p>
                        <p class="mt-2"><strong>⚡ Chain Multiplication Effect:</strong> The ${chainLengthW1}-step chain for w₁ means ${chainLengthW1 - chainLengthW2} extra multiplicative terms. In deep networks, this compounding effect becomes extreme.</p>
                    `;
                } else {
                    const gradientFlow = w1_abs < w2_abs * 0.1 ? 'weakening significantly' : w1_abs > w2_abs * 10 ? 'amplifying dramatically' : 'flowing reasonably well';
                    explanationText += `
                        <p class="mt-2"><strong>🌊 Gradient Flow Analysis:</strong> Through the ${chainLengthW1}-step chain to w₁, gradients are ${gradientFlow}. This demonstrates how chain length affects learning - deeper layers need careful design to maintain trainable gradients.</p>
                        <p class="mt-2"><strong>🎓 Deep Learning Insight:</strong> This simple 2-layer example shows why techniques like ResNet skip connections, careful weight initialization, and modern activations are crucial for training deep networks.</p>
                    `;
                }

                // Enhanced activation function specific insights with gradient context
                if (activationType === 'sigmoid') {
                    const sigmoidMaxDeriv = 0.25;
                    const potentialShrinkage = Math.pow(sigmoidMaxDeriv, chainLengthW1 - 1);
                    explanationText += `
                        <p class="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400 text-sm">
                            <strong>📊 Sigmoid & Vanishing Gradients:</strong> Sigmoid derivatives max out at ${sigmoidMaxDeriv}, meaning w₁'s gradient could shrink by up to ${(potentialShrinkage * 100).toFixed(1)}% due to the chain multiplications. This is why sigmoid fell out of favor for deep networks!
                        </p>`;
                } else if (activationType === 'tanh') {
                    explanationText += `
                        <p class="mt-3 p-3 bg-green-50 rounded border-l-4 border-green-400 text-sm">
                            <strong>📊 Tanh Advantage:</strong> Tanh derivatives can reach 1.0 (vs sigmoid's 0.25), providing stronger gradient flow through chains. Its zero-centered output also helps subsequent layers receive balanced inputs, improving gradient stability.
                        </p>`;
                } else if (activationType === 'relu') {
                    explanationText += `
                        <p class="mt-3 p-3 bg-orange-50 rounded border-l-4 border-orange-400 text-sm">
                            <strong>📊 ReLU & Gradient Flow:</strong> ReLU's binary derivative (0 or 1) either preserves or kills gradients entirely. This prevents vanishing gradients but can create "dead neurons" that never recover. Modern variants like Leaky ReLU address this issue.
                        </p>`;
                }

                // Practical implications
                explanationText += `
                    <p class="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200 text-sm">
                        <strong>💡 Practical Takeaway:</strong> This visualization shows why deep learning required innovations beyond basic backpropagation. The longer the chain, the more challenging it becomes to maintain useful gradients for effective learning.
                    </p>
                `;

                explanationContent.innerHTML = explanationText;
            }

            // Example scenarios
            if (example1Btn) {
                example1Btn.addEventListener('click', () => {
                    inputValue.value = 1.5;
                    weight1.value = 2.0;
                    weight2.value = 1.8;
                    target.value = 0.1;
                    computeAndVisualize();
                });
            }

            if (example2Btn) {
                example2Btn.addEventListener('click', () => {
                    inputValue.value = 0.8;
                    weight1.value = 0.6;
                    weight2.value = 0.7;
                    target.value = 0.75;
                    computeAndVisualize();
                });
            }

            if (example3Btn) {
                example3Btn.addEventListener('click', () => {
                    inputValue.value = 0.0;
                    weight1.value = 0.5;
                    weight2.value = 0.5;
                    target.value = 0.5;
                    computeAndVisualize();
                });
            }

            // Event listeners
            [inputValue, weight1, weight2, target].forEach(element => {
                if (element) {
                    element.addEventListener('input', computeAndVisualize);
                }
            });

            activationRadios.forEach(radio => {
                radio.addEventListener('change', computeAndVisualize);
            });

            // Initial computation
            computeAndVisualize();
        }
    }
};
