(function() {
  'use strict';

  // Accuracy models based on paper findings
  // Standard fine-tuning: degrades sharply with digit count (local optimum)
  // Implicit CoT: maintains high accuracy (learns DAG structure)
  // Auxiliary loss: high accuracy with proper supervision
  const ACCURACY_MODELS = {
    'standard': {
      2: 0.95,  // Works well for short sequences
      3: 0.62,  // Starts degrading
      4: 0.28,  // Sharp drop due to lack of long-range dependencies
      5: 0.08   // Near failure
    },
    'implicit-cot': {
      2: 0.98,  // Excellent from the start
      3: 0.96,  // Maintains performance
      4: 0.94,  // Systematic generalization
      5: 0.91   // Graceful degradation if any
    },
    'auxiliary': {
      2: 0.97,  // Strong with auxiliary supervision
      3: 0.95,  // Running sum provides inductive bias
      4: 0.92,  // Learns long-range dependencies
      5: 0.88   // Maintains compositional structure
    }
  };

  // Explanation text for each approach
  const EXPLANATIONS = {
    'standard': {
      2: '<p><strong>Standard fine-tuning</strong> works well for 2-digit multiplication because the problem doesn\'t require complex long-range dependencies. The model can memorize common patterns and achieve high accuracy.</p>',
      3: '<p><strong>Standard fine-tuning</strong> starts to struggle with 3-digit numbers. The model converges to a local optimum that lacks the necessary computational structure to track carries and partial products across multiple digit positions.</p>',
      4: '<p><strong>Standard fine-tuning</strong> shows severe degradation at 4 digits. Without mechanisms for long-range dependencies, the model cannot systematically compose partial products. It encodes the necessary information but doesn\'t organize it algorithmically.</p>',
      5: '<p><strong>Standard fine-tuning</strong> essentially fails at 5-digit multiplication. The local optimum it finds during training cannot represent the complex interactions between distant digit positions required for correct multiplication.</p>'
    },
    'implicit-cot': {
      2: '<p><strong>Implicit chain-of-thought</strong> excels even at 2 digits by learning to build a directed acyclic graph (DAG) using attention. Early layers cache partial products (like 3×7), and later layers retrieve them to compute the final answer.</p>',
      3: '<p><strong>Implicit chain-of-thought</strong> maintains high accuracy because it learns the algorithmic structure. Attention heads implement partial products via Minkowski sums, and digits are represented using a Fourier basis—efficient representations that enable systematic composition.</p>',
      4: '<p><strong>Implicit chain-of-thought</strong> generalizes systematically to 4-digit problems. The DAG caching mechanism handles long-range dependencies naturally, tracking intermediate computations across digit positions just like the human multiplication algorithm.</p>',
      5: '<p><strong>Implicit chain-of-thought</strong> continues to perform well at 5 digits. The learned computational structure scales because it mirrors the actual algorithm: cache pairwise products, propagate carries, combine results systematically.</p>'
    },
    'auxiliary': {
      2: '<p><strong>Auxiliary loss training</strong> predicts the "running sum" at intermediate steps via linear regression probes. This supervision provides an inductive bias that guides the model away from local optima, even for simple 2-digit cases.</p>',
      3: '<p><strong>Auxiliary loss training</strong> leverages the running sum prediction to learn proper long-range dependencies. By supervising intermediate computational states, the model learns to organize information algorithmically rather than memorizing patterns.</p>',
      4: '<p><strong>Auxiliary loss training</strong> maintains strong performance at 4 digits because the auxiliary supervision prevents convergence to local optima. The model learns to track partial sums, which enforces the compositional structure needed for multi-digit multiplication.</p>',
      5: '<p><strong>Auxiliary loss training</strong> shows robust generalization to 5-digit problems. The inductive bias from predicting intermediate states guides the model toward solutions that properly encode long-range dependencies and algorithmic composition.</p>'
    }
  };

  // Mechanism visualizations for each approach
  const MECHANISMS = {
    'standard': {
      title: 'Local optimum: Pattern matching',
      content: `
        <div class="space-y-3">
          <div class="panel panel-neutral-soft p-3 space-y-2">
            <div class="text-xs font-semibold panel-muted">What the model learns:</div>
            <ul class="text-xs text-body space-y-1 ml-4 list-disc">
              <li>Memorizes common digit pair patterns</li>
              <li>Lacks explicit partial product caching</li>
              <li>Cannot systematically handle carries across positions</li>
              <li>Encodes information but doesn't organize it algorithmically</li>
            </ul>
          </div>
          <div class="text-xs panel-muted">
            <strong>Why it fails:</strong> Converges to a local optimum that works for training distribution but lacks the long-range dependency structure needed for systematic generalization.
          </div>
        </div>
      `
    },
    'implicit-cot': {
      title: 'DAG caching: Algorithmic structure',
      content: `
        <div class="space-y-3">
          <div class="panel panel-neutral-soft p-3 space-y-2">
            <div class="text-xs font-semibold panel-muted">Attention mechanism:</div>
            <div class="grid grid-cols-3 gap-2 text-xs font-mono">
              <div class="p-2 rounded bg-surface border border-divider text-center">
                <div class="text-accent-strong font-semibold">Layer 1-2</div>
                <div class="text-muted mt-1">Cache partial products</div>
                <div class="mt-1 text-body">3×7 → 21</div>
                <div class="text-body">2×4 → 8</div>
              </div>
              <div class="p-2 rounded bg-surface border border-divider text-center">
                <div class="text-accent-strong font-semibold">Layer 3-4</div>
                <div class="text-muted mt-1">Build DAG structure</div>
                <div class="mt-1 text-body">Link dependencies</div>
                <div class="text-body">Track carries</div>
              </div>
              <div class="p-2 rounded bg-surface border border-divider text-center">
                <div class="text-accent-strong font-semibold">Layer 5-6</div>
                <div class="text-muted mt-1">Retrieve & combine</div>
                <div class="mt-1 text-body">Sum products</div>
                <div class="text-body">Output result</div>
              </div>
            </div>
          </div>
          <div class="panel panel-neutral-soft p-3 space-y-1">
            <div class="text-xs font-semibold panel-muted">Representations:</div>
            <ul class="text-xs text-body space-y-1 ml-4 list-disc">
              <li><strong>Fourier basis:</strong> Digits represented as periodic functions</li>
              <li><strong>Minkowski sums:</strong> Partial products computed geometrically</li>
              <li><strong>DAG structure:</strong> Dependencies tracked via attention patterns</li>
            </ul>
          </div>
        </div>
      `
    },
    'auxiliary': {
      title: 'Auxiliary supervision: Running sum guidance',
      content: `
        <div class="space-y-3">
          <div class="panel panel-neutral-soft p-3 space-y-2">
            <div class="text-xs font-semibold panel-muted">Training signal:</div>
            <div class="text-xs text-body space-y-1">
              <p>In addition to predicting the final answer, the model is trained to predict the <strong>running sum</strong> at intermediate positions using a linear regression probe.</p>
            </div>
            <div class="font-mono text-xs mt-2 p-2 rounded bg-surface border border-divider">
              <div class="text-muted">Example: 23 × 47</div>
              <div class="mt-1 space-y-1">
                <div><span class="text-accent-strong">Step 1:</span> 3×7=21, sum=21</div>
                <div><span class="text-accent-strong">Step 2:</span> 2×7=14, sum=161</div>
                <div><span class="text-accent-strong">Step 3:</span> 3×4=12, sum=281</div>
                <div><span class="text-accent-strong">Step 4:</span> 2×4=8, sum=1081 ✓</div>
              </div>
            </div>
          </div>
          <div class="text-xs panel-muted">
            <strong>Why it works:</strong> Supervising intermediate states provides an inductive bias that guides the model toward learning proper long-range dependencies and compositional structure, avoiding the local optimum trap.
          </div>
        </div>
      `
    }
  };

  function init() {
    const digitCountSlider = document.getElementById('p55-digit-count');
    const digitCountLabel = document.getElementById('p55-digit-count-label');
    const approachSelect = document.getElementById('p55-approach');
    const showMechanismCheckbox = document.getElementById('p55-show-mechanism');
    const mechanismPanel = document.getElementById('p55-mechanism-panel');
    const accuracyLabel = document.getElementById('p55-accuracy-label');
    const accuracyBar = document.getElementById('p55-accuracy-bar');
    const explanationDiv = document.getElementById('p55-explanation');
    const exampleProblem = document.getElementById('p55-example-problem');
    const exampleAnswer = document.getElementById('p55-example-answer');
    const mechanismContent = document.getElementById('p55-mechanism-content');
    const takeawayDiv = document.getElementById('p55-takeaway');

    if (!digitCountSlider || !approachSelect) {
      console.warn('P55 interactive elements not found');
      return;
    }

    function generateExample(digits) {
      // Generate random multiplication problem
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;
      return { a, b, result: a * b };
    }

    function updateUI() {
      const digitCount = parseInt(digitCountSlider.value);
      const approach = approachSelect.value;
      const showMechanism = showMechanismCheckbox.checked;

      // Update digit count label
      if (digitCountLabel) {
        digitCountLabel.textContent = digitCount;
      }

      // Get accuracy for this configuration
      const accuracy = ACCURACY_MODELS[approach][digitCount];
      const accuracyPercent = Math.round(accuracy * 100);

      // Update accuracy display
      if (accuracyLabel) {
        accuracyLabel.textContent = accuracyPercent + '%';
        // Color code based on accuracy using Tailwind classes
        accuracyLabel.classList.remove('text-success', 'text-warning', 'text-error');
        if (accuracy >= 0.9) {
          accuracyLabel.classList.add('text-success');
        } else if (accuracy >= 0.6) {
          accuracyLabel.classList.add('text-warning');
        } else {
          accuracyLabel.classList.add('text-error');
        }
      }

      // Update accuracy bar
      if (accuracyBar) {
        accuracyBar.style.width = accuracyPercent + '%';
        // Color code based on accuracy using Tailwind classes
        accuracyBar.classList.remove('bg-success', 'bg-warning', 'bg-error');
        if (accuracy >= 0.9) {
          accuracyBar.classList.add('bg-success');
        } else if (accuracy >= 0.6) {
          accuracyBar.classList.add('bg-warning');
        } else {
          accuracyBar.classList.add('bg-error');
        }
      }

      // Update example problem
      const example = generateExample(digitCount);
      if (exampleProblem) {
        exampleProblem.textContent = `${example.a} × ${example.b} = ?`;
      }

      // Simulate whether model gets it right based on accuracy
      const isCorrect = Math.random() < accuracy;
      if (exampleAnswer) {
        if (isCorrect) {
          exampleAnswer.innerHTML = `
            <span class="panel-muted">Model predicts:</span> <span class="font-semibold text-heading">${example.result}</span>
            <span class="text-success ml-2">✓</span>
          `;
        } else {
          const wrongAnswer = example.result + Math.floor(Math.random() * 200) - 100;
          exampleAnswer.innerHTML = `
            <span class="panel-muted">Model predicts:</span> <span class="font-semibold text-heading">${wrongAnswer}</span>
            <span class="text-error ml-2">✗</span>
            <span class="text-xs panel-muted ml-2">(correct: ${example.result})</span>
          `;
        }
      }

      // Update explanation
      if (explanationDiv) {
        explanationDiv.innerHTML = EXPLANATIONS[approach][digitCount];
      }

      // Show/hide mechanism panel
      if (mechanismPanel) {
        if (showMechanism) {
          mechanismPanel.classList.remove('hidden');
        } else {
          mechanismPanel.classList.add('hidden');
        }
      }

      // Update mechanism content
      if (showMechanism && mechanismContent) {
        const mechanism = MECHANISMS[approach];
        mechanismContent.innerHTML = `
          <div class="text-sm font-semibold text-heading mb-2">${mechanism.title}</div>
          ${mechanism.content}
        `;
      }

      // Update takeaway based on approach
      if (takeawayDiv) {
        if (approach === 'standard') {
          takeawayDiv.textContent = 'Standard fine-tuning converges to local optima for compositional tasks. Even with sufficient capacity, it fails to learn the long-range dependencies needed for systematic generalization.';
        } else if (approach === 'implicit-cot') {
          takeawayDiv.textContent = 'Implicit chain-of-thought learns algorithmic structure without explicit verbalization. By building DAG attention patterns and using efficient representations (Fourier basis, Minkowski sums), it achieves systematic compositional generalization.';
        } else {
          takeawayDiv.textContent = 'Auxiliary losses provide inductive biases that guide models away from local optima. Supervising intermediate computational states (like running sums) helps models learn proper long-range dependencies and compositional structure.';
        }
      }
    }

    // Event listeners
    digitCountSlider.addEventListener('input', updateUI);
    approachSelect.addEventListener('change', updateUI);
    showMechanismCheckbox.addEventListener('change', updateUI);

    // Initial render
    updateUI();
  }

  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paperXXInteractive = interactiveScript;
}
