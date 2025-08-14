// Question 48: What is a hyperparameter, and why is it important?
// Created: 2025-08-14
// Educational Focus: Define hyperparameters, distinguish from parameters, and let users explore their qualitative impact.

const question = {
    title: "48. What is a hyperparameter, and why is it important?",
    answer: `<div class="space-y-4">
        <!-- Main Concept Box -->
        <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 class="font-semibold text-blue-900 mb-2">🧭 Core idea</h4>
            <p class="text-blue-800">Hyperparameters are preset values that control training dynamics, such as learning rate, batch size, and weight decay. They guide optimization and generalization but are not learned from data directly.</p>
            <div class="text-center mt-3 bg-white p-3 rounded border">
                $$\\text{Update: } \\theta_{t+1} = \\theta_t - \eta \\nabla_\\theta \\mathcal{L}(\\theta_t)$$
            </div>
        </div>

        <!-- Comparison Grid -->
        <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <h5 class="font-medium text-green-900">Examples</h5>
                <ul class="text-sm text-green-800 list-disc pl-5 space-y-1">
                    <li>Learning rate (η)</li>
                    <li>Batch size</li>
                    <li>Weight decay / dropout</li>
                </ul>
            </div>
            <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                <h5 class="font-medium text-purple-900">Not hyperparameters</h5>
                <ul class="text-sm text-purple-800 list-disc pl-5 space-y-1">
                    <li>Model weights (learned parameters)</li>
                    <li>Activations during forward passes</li>
                    <li>Gradients during backprop</li>
                </ul>
            </div>
            <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <h5 class="font-medium text-orange-900">Why it matters</h5>
                <ul class="text-sm text-orange-800 list-disc pl-5 space-y-1">
                    <li>Controls stability, speed, and generalization</li>
                    <li>Bad settings can diverge or overfit</li>
                    <li>Good settings accelerate convergence</li>
                </ul>
            </div>
        </div>

        <!-- Why It Matters -->
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why this matters</h4>
            <ul class="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Convergence:</strong> Learning rate affects whether training stabilizes.</li>
                <li>• <strong>Generalization:</strong> Regularization hyperparameters reduce overfitting.</li>
                <li>• <strong>Efficiency:</strong> Batch size and schedulers impact throughput and wall-clock time.</li>
            </ul>
        </div>
    </div>`,
    interactive: {
        title: "⚙️ Hyperparameter impact explorer",
        html: `<div class="space-y-6">
            <!-- Controls -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div class="grid md:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Learning rate (η)</label>
                        <input id="q48-lr" type="range" min="-4" max="-1" step="0.1" value="-2.5" class="w-full">
                        <div class="text-xs text-gray-600">Log10 scale: η = 10^x</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Batch size</label>
                        <select id="q48-bs" class="w-full px-2 py-2 border border-gray-300 rounded">
                            <option>8</option>
                            <option>16</option>
                            <option selected>32</option>
                            <option>64</option>
                            <option>128</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Weight decay</label>
                        <input id="q48-wd" type="range" min="0" max="0.1" step="0.005" value="0.01" class="w-full">
                        <div class="text-xs text-gray-600">L2 regularization strength</div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dropout</label>
                        <input id="q48-do" type="range" min="0" max="0.7" step="0.05" value="0.1" class="w-full">
                        <div class="text-xs text-gray-600">Probability of dropping units</div>
                    </div>
                </div>
            </div>

            <!-- Impact & Guidance -->
            <div class="bg-white p-3 rounded-lg border">
                <div class="grid md:grid-cols-3 gap-4 items-start">
                    <div>
                        <div class="text-sm font-medium text-gray-700 mb-1">Stability/Speed estimate</div>
                        <div id="q48-impact" class="text-xs">
                            <span id="q48-impact-badge" class="inline-block px-2 py-0.5 rounded border"></span>
                            <div class="h-2 mt-1 rounded bg-gray-200 overflow-hidden">
                                <div id="q48-meter" class="h-full rounded" style="width:0%"></div>
                            </div>
                        </div>
                        <div class="text-[11px] text-gray-500 mt-1">Heuristic based on η, batch size, and regularization.</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-green-700 mb-1">Good points</div>
                        <ul id="q48-pros" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-red-700 mb-1">Potential issues</div>
                        <ul id="q48-cons" class="list-disc pl-5 text-xs text-gray-700 space-y-1"></ul>
                    </div>
                </div>
            </div>

            <!-- Output -->
            <div id="q48-expl" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900"></div>
        </div>`,
        script: () => {
            const lrEl = document.getElementById('q48-lr');
            const bsEl = document.getElementById('q48-bs');
            const wdEl = document.getElementById('q48-wd');
            const doEl = document.getElementById('q48-do');
            const badgeEl = document.getElementById('q48-impact-badge');
            const meterEl = document.getElementById('q48-meter');
            const prosEl = document.getElementById('q48-pros');
            const consEl = document.getElementById('q48-cons');
            const expl = document.getElementById('q48-expl');
            if (!lrEl || !bsEl || !wdEl || !doEl || !badgeEl || !meterEl || !prosEl || !consEl || !expl) return;

            function setImpact(score) {
                // score in [0,1]
                score = Math.max(0, Math.min(1, score));
                let label = '';
                let bg = '#e5e7eb', fg = '#111827', border = '#d1d5db';
                if (score >= 0.8) { label = `Excellent (${Math.round(score*100)}%)`; bg = '#dcfce7'; fg = '#166534'; border = '#86efac'; }
                else if (score >= 0.6) { label = `Good (${Math.round(score*100)}%)`; bg = '#dbeafe'; fg = '#1e40af'; border = '#93c5fd'; }
                else if (score >= 0.35) { label = `Limited (${Math.round(score*100)}%)`; bg = '#fef9c3'; fg = '#854d0e'; border = '#fde68a'; }
                else { label = `Poor (${Math.round(score*100)}%)`; bg = '#fee2e2'; fg = '#991b1b'; border = '#fecaca'; }
                badgeEl.textContent = label;
                badgeEl.style.backgroundColor = bg;
                badgeEl.style.color = fg;
                badgeEl.style.borderColor = border;
                meterEl.style.width = `${Math.round(score*100)}%`;
                meterEl.style.backgroundColor = fg;
            }

            function computeScore(lrPow, bs, wd, drop) {
                // Heuristic: optimal lr around 1e-3 to 1e-2 depending on bs
                const lr = Math.pow(10, lrPow); // lrPow is log10
                const lrTarget = Math.min(5e-3, 5e-4 * Math.sqrt(bs));
                const lrScore = Math.exp(-Math.pow(Math.log(lr/lrTarget), 2) / 1.5); // bell around target
                const regScore = Math.max(0, 1 - (wd*4 + drop*0.6)); // too large regularization hurts
                const scaleScore = Math.min(1, Math.log2(bs)/8); // diminishing returns for huge batches
                // Combine
                return Math.max(0, Math.min(1, 0.55*lrScore + 0.25*regScore + 0.2*scaleScore));
            }

            function render() {
                const lrPow = parseFloat(lrEl.value || '-2.5');
                const bs = parseInt(bsEl.value || '32', 10);
                const wd = parseFloat(wdEl.value || '0.01');
                const drop = parseFloat(doEl.value || '0.1');
                const score = computeScore(lrPow, bs, wd, drop);
                setImpact(score);

                // Pros/Cons
                const pros = [];
                const cons = [];
                if (score >= 0.8) pros.push('Learning setup likely stable and fast');
                else if (score >= 0.6) pros.push('Training likely stable; tune further for speed');
                else pros.push('Conservative but may be stable; iterate to improve');

                if (Math.pow(10, lrPow) > 0.02) cons.push('Learning rate may be too high → divergence risk');
                if (wd > 0.05) cons.push('Weight decay may underfit; reduce if validation loss is high');
                if (drop > 0.5) cons.push('High dropout can slow learning and hurt capacity');
                if (bs < 16) cons.push('Very small batch may be noisy; consider gradient accumulation');
                if (bs > 128) cons.push('Very large batch may need warmup or higher LR schedule');

                prosEl.innerHTML = pros.map(p => `<li>${p}</li>`).join('');
                consEl.innerHTML = cons.map(c => `<li>${c}</li>`).join('');

                // Explanation text with inline math
                const eta = Math.pow(10, lrPow).toExponential(1);
                expl.innerHTML = `
                    <div class=\"flex items-center gap-2 mb-2\"><span class=\"text-indigo-700\">Current setup</span>
                    <span class=\"text-xs text-gray-500\">(η=${eta}, batch=${bs}, wd=${wd.toFixed(3)}, dropout=${drop.toFixed(2)})</span></div>
                    Proper hyperparameters help optimizers follow the gradient \\(\\nabla \\mathcal{L}\\) efficiently without divergence or overfitting. Adjust them based on validation metrics and training curves.
                `;
                if (window.MathJax && window.MathJax.typesetPromise) {
                    window.MathJax.typesetPromise([expl]).catch(()=>{});
                }
            }

            lrEl.addEventListener('input', render);
            bsEl.addEventListener('change', render);
            wdEl.addEventListener('input', render);
            doEl.addEventListener('input', render);
            render();
        }
    }
};

module.exports = { question };
