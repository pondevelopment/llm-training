(function() {
  'use strict';

  // Example misconceptions and problems for each task
  const taskExamples = {
    'algebra': [
      {
        misconception: '"When distributing, only multiply the first term inside the parenthesis"',
        problem: 'Expand 3(x + 2)',
        incorrectAnswer: '3x + 2',
        correctAnswer: '3x + 6'
      },
      {
        misconception: '"The equals sign means \'write the answer\' not \'both sides are equal\'"',
        problem: 'Solve x + 5 = 12',
        incorrectAnswer: '17',
        correctAnswer: 'x = 7'
      },
      {
        misconception: '"Negative times negative gives negative"',
        problem: 'Simplify -2(-3)',
        incorrectAnswer: '-6',
        correctAnswer: '6'
      }
    ],
    'fractions': [
      {
        misconception: '"To add fractions, add numerators and add denominators"',
        problem: 'Calculate 1/2 + 1/3',
        incorrectAnswer: '2/5',
        correctAnswer: '5/6'
      },
      {
        misconception: '"Larger denominator means larger fraction"',
        problem: 'Which is bigger: 1/3 or 1/4?',
        incorrectAnswer: '1/4',
        correctAnswer: '1/3'
      },
      {
        misconception: '"To multiply fractions, multiply straight across then simplify"',
        problem: 'Calculate 2/3 × 3/4',
        incorrectAnswer: '6/12 = 1/2',
        correctAnswer: '1/2 (but via cross-cancellation or direct: 2×3=6, 3×4=12, then simplify)'
      }
    ],
    'geometry': [
      {
        misconception: '"Perimeter and area formulas are interchangeable"',
        problem: 'Find perimeter of 5×3 rectangle',
        incorrectAnswer: '15 units',
        correctAnswer: '16 units'
      },
      {
        misconception: '"Area of triangle is base times height"',
        problem: 'Find area of triangle: base=6, height=4',
        incorrectAnswer: '24 square units',
        correctAnswer: '12 square units'
      },
      {
        misconception: '"Doubling dimensions doubles the area"',
        problem: 'Square has side 3. If side doubles to 6, how much does area increase?',
        incorrectAnswer: 'Doubles (from 9 to 18)',
        correctAnswer: 'Quadruples (from 9 to 36)'
      }
    ]
  };

  function init() {
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const taskEl = document.getElementById('p43-task');
    const trainingSizeEl = document.getElementById('p43-training-size');
    const consistencyEl = document.getElementById('p43-consistency');

    if (!taskEl || !trainingSizeEl || !consistencyEl) {
      console.warn('P43: Interactive elements not yet in DOM, skipping');
      return;
    }

    taskEl.addEventListener('change', updateUI);
    trainingSizeEl.addEventListener('input', updateUI);
    consistencyEl.addEventListener('input', updateUI);

    updateUI();
  }

  function updateUI() {
    const taskEl = document.getElementById('p43-task');
    const trainingSizeEl = document.getElementById('p43-training-size');
    const consistencyEl = document.getElementById('p43-consistency');

    if (!taskEl || !trainingSizeEl || !consistencyEl) return;

    const task = taskEl.value;
    const trainingSize = parseInt(trainingSizeEl.value);
    const consistency = parseFloat(consistencyEl.value);

    // Update labels
    const trainingLabelEl = document.getElementById('p43-training-label');
    const consistencyLabelEl = document.getElementById('p43-consistency-label');
    
    if (trainingLabelEl) trainingLabelEl.textContent = trainingSize;
    if (consistencyLabelEl) consistencyLabelEl.textContent = consistency.toFixed(2);

    // Calculate synthetic data generation
    // Fixed number of candidate examples generated (independent of seed size)
    // In practice, you'd generate many candidates and filter by cycle consistency
    const candidateGenerated = 5000;
    
    // Filter rate based ONLY on consistency threshold
    // Higher threshold = more examples filtered out (stricter quality filter)
    // Pass rate decreases as threshold increases
    const passRate = consistency < 0.60 ? 0.85 :
                     consistency < 0.70 ? 0.75 :
                     consistency < 0.80 ? 0.65 :
                     consistency < 0.90 ? 0.50 : 0.35;
    
    const filteredCount = Math.round(candidateGenerated * passRate);
    const totalTraining = trainingSize + filteredCount;

    // Update generation metrics
    updateMetric('generated', candidateGenerated, 100, getCssVar('--tone-indigo-strong', '#6366f1'));
    updateMetric('filtered', filteredCount, passRate * 100, getCssVar('--tone-emerald-strong', '#10b981'));
    
    const totalCountEl = document.getElementById('p43-total-count');
    if (totalCountEl) {
      totalCountEl.textContent = totalTraining.toLocaleString();
    }

    // Update example cycle consistency
    const examples = taskExamples[task];
    const exampleIdx = Math.floor(Math.random() * examples.length);
    const example = examples[exampleIdx];

    const misconceptionEl = document.getElementById('p43-misconception');
    const problemEl = document.getElementById('p43-problem');
    const answerEl = document.getElementById('p43-answer');
    const inferredEl = document.getElementById('p43-inferred');
    const roundtripEl = document.getElementById('p43-roundtrip');

    if (misconceptionEl) misconceptionEl.textContent = example.misconception;
    if (problemEl) problemEl.textContent = example.problem;
    if (answerEl) answerEl.textContent = example.incorrectAnswer;
    if (inferredEl) inferredEl.textContent = example.misconception;
    
    // Round-trip accuracy (for pedagogical examples, assume 100% match)
    if (roundtripEl) roundtripEl.textContent = '100%';

    // Update task performance metrics
    // IMPORTANT: The paper reports fixed results (+9%, +15%, +64.6%) from one specific configuration
    // The scaling below is an EDUCATIONAL ESTIMATE showing how performance might vary—not from the paper
    // We model how results could plausibly change with different data quality/quantity
    
    // More training data and higher consistency both improve performance
    // Scale more aggressively so users see meaningful changes
    const dataQualityFactor = Math.min(1.5, 0.5 + (totalTraining / 10000) * 1.0); // 0.5x to 1.5x
    const consistencyFactor = Math.min(1.6, 0.6 + consistency * 1.0); // 0.6x to 1.6x
    
    // Paper's actual results as baseline, scaled by configuration
    // Ranges are plausible estimates, not empirically validated
    const simulationImprovement = Math.max(3, Math.min(15, Math.round(9 * dataQualityFactor * consistencyFactor)));
    const inferenceImprovement = Math.max(5, Math.min(25, Math.round(15 * dataQualityFactor * consistencyFactor)));
    const distractorImprovement = Math.max(15, Math.min(100, Math.round(64.6 * dataQualityFactor * consistencyFactor)));

    updateTaskMetric('simulation', simulationImprovement);
    updateTaskMetric('inference', inferenceImprovement);
    updateTaskMetric('distractor', distractorImprovement);

    // Update insights
    updateInsights(trainingSize, consistency, passRate, totalTraining, simulationImprovement);
  }

  function updateMetric(type, value, percentage, color) {
    const countEl = document.getElementById(`p43-${type}-count`);
    const barEl = document.getElementById(`p43-${type}-bar`);

    if (countEl) {
      if (type === 'filtered') {
        countEl.textContent = `${value.toLocaleString()} (${Math.round(percentage)}%)`;
      } else {
        countEl.textContent = value.toLocaleString();
      }
    }

    if (barEl) {
      barEl.style.width = `${percentage}%`;
      barEl.style.backgroundColor = color;
    }
  }

  function updateTaskMetric(task, improvement) {
    const accEl = document.getElementById(`p43-${task}-acc`);
    const barEl = document.getElementById(`p43-${task}-bar`);

    if (accEl) accEl.textContent = `+${improvement}%`;
    
    // Bar width directly represents the improvement percentage
    // This matches other bars on the page (e.g., "70% pass rate" = 70% bar width)
    // +9% improvement = 9% bar width
    // +15% improvement = 15% bar width
    // +64.6% improvement = 64.6% bar width
    const barWidth = improvement;
    
    if (barEl) {
      barEl.style.width = `${barWidth}%`;
      barEl.style.backgroundColor = getCssVar('--tone-emerald-strong', '#10b981');
    }
  }

  function updateInsights(trainingSize, consistency, passRate, totalTraining, simulationImprovement) {
    const insightsEl = document.getElementById('p43-insights');
    if (!insightsEl) return;

    let setupText, whyText;

    const passPercent = Math.round(passRate * 100);
    const syntheticCount = totalTraining - trainingSize;

    if (consistency < 0.65) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (LOW), you accept ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} synthetic examples for ${totalTraining.toLocaleString()} total training pairs.`;
      whyText = 'Low consistency thresholds maximize training data quantity but risk including pedagogically unrealistic examples. This works when you need large-scale coverage but have strong manual validation downstream. Models show +${simulationImprovement}% improvement in simulation accuracy, though some generated errors may not reflect actual student thinking patterns.';
    } else if (consistency < 0.75) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (OPTIMAL), you generate ${syntheticCount.toLocaleString()} high-quality synthetic examples for a total training set of ${totalTraining.toLocaleString()} misconception-answer pairs.`;
      whyText = 'Cycle consistency acts as an automated quality filter. This sweet spot (0.65-0.75) balances data quantity with quality—accepting enough examples to cover misconception diversity while filtering out incoherent error patterns. Models show +${simulationImprovement}% improvement with strong pedagogical validity.';
    } else if (consistency < 0.85) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (HIGH), you keep only ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} highly coherent synthetic examples for ${totalTraining.toLocaleString()} total training pairs.`;
      whyText = 'High consistency thresholds prioritize pedagogical realism over data quantity. Only the most coherent misconception-answer cycles pass, reducing coverage but increasing expert alignment. Best when you have strong seed examples and need high confidence in generated errors for student-facing applications.';
    } else {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (VERY HIGH), you accept only ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} extremely coherent examples for ${totalTraining.toLocaleString()} total pairs.`;
      whyText = 'Very high thresholds (0.85+) approach expert-only quality but drastically reduce synthetic data volume. Use when deploying in high-stakes contexts (assessment generation, teacher training) where every generated example must match expert patterns. Models show +${simulationImprovement}% improvement but may undercover edge-case misconceptions.';
    }

    whyText = whyText.replace('${simulationImprovement}', simulationImprovement);

    insightsEl.innerHTML = `
      <p><strong>Current setup:</strong> ${setupText}</p>
      <p><strong>Why this matters:</strong> ${whyText}</p>
    `;
  }

  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach helper for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
