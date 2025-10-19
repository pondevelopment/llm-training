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
    // Base generation: 100x the training size (realistic for synthetic generation)
    const candidateGenerated = trainingSize * 100;
    
    // Filter rate based on consistency threshold
    // Higher threshold = more examples filtered out
    // Rough model: pass rate decreases as threshold increases
    const passRate = consistency < 0.60 ? 0.85 :
                     consistency < 0.70 ? 0.75 :
                     consistency < 0.80 ? 0.65 :
                     consistency < 0.90 ? 0.50 : 0.35;
    
    const filteredCount = Math.round(candidateGenerated * passRate);
    const totalTraining = trainingSize + filteredCount;

    // Update generation metrics
    updateMetric('generated', candidateGenerated, 100, '#6366f1');
    updateMetric('filtered', filteredCount, passRate * 100, '#10b981');
    
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
    // Performance improves with more training data and higher consistency threshold
    // Base accuracy + bonus from data size + bonus from high consistency
    const dataBonus = Math.min(20, Math.log10(totalTraining) * 5); // Diminishing returns
    const consistencyBonus = consistency > 0.75 ? 5 : consistency > 0.65 ? 2 : 0;

    const simulationAcc = Math.min(95, Math.round(70 + dataBonus + consistencyBonus));
    const inferenceAcc = Math.min(92, Math.round(65 + dataBonus + consistencyBonus));
    const distractorAcc = Math.min(88, Math.round(60 + dataBonus + consistencyBonus));

    updateTaskMetric('simulation', simulationAcc);
    updateTaskMetric('inference', inferenceAcc);
    updateTaskMetric('distractor', distractorAcc);

    // Update insights
    updateInsights(trainingSize, consistency, passRate, totalTraining, simulationAcc);
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

  function updateTaskMetric(task, accuracy) {
    const accEl = document.getElementById(`p43-${task}-acc`);
    const barEl = document.getElementById(`p43-${task}-bar`);

    if (accEl) accEl.textContent = `${accuracy}%`;
    if (barEl) {
      barEl.style.width = `${accuracy}%`;
      barEl.style.backgroundColor = '#10b981';
    }
  }

  function updateInsights(trainingSize, consistency, passRate, totalTraining, simulationAcc) {
    const insightsEl = document.getElementById('p43-insights');
    if (!insightsEl) return;

    let setupText, whyText;

    const passPercent = Math.round(passRate * 100);
    const syntheticCount = totalTraining - trainingSize;

    if (consistency < 0.65) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (LOW), you accept ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} synthetic examples for ${totalTraining.toLocaleString()} total training pairs.`;
      whyText = 'Low consistency thresholds maximize training data quantity but risk including pedagogically unrealistic examples. This works when you need large-scale coverage but have strong manual validation downstream. Models achieve ${simulationAcc}% simulation accuracy, though some generated errors may not reflect actual student thinking patterns.';
    } else if (consistency < 0.75) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (OPTIMAL), you generate ${syntheticCount.toLocaleString()} high-quality synthetic examples for a total training set of ${totalTraining.toLocaleString()} misconception-answer pairs.`;
      whyText = 'Cycle consistency acts as an automated quality filter. This sweet spot (0.65-0.75) balances data quantity with quality—accepting enough examples to cover misconception diversity while filtering out incoherent error patterns. Models achieve ${simulationAcc}% simulation accuracy with strong pedagogical validity.';
    } else if (consistency < 0.85) {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (HIGH), you keep only ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} highly coherent synthetic examples for ${totalTraining.toLocaleString()} total training pairs.`;
      whyText = 'High consistency thresholds prioritize pedagogical realism over data quantity. Only the most coherent misconception-answer cycles pass, reducing coverage but increasing expert alignment. Best when you have strong seed examples and need high confidence in generated errors for student-facing applications.';
    } else {
      setupText = `With ${trainingSize} expert seed examples and ${consistency.toFixed(2)} cycle consistency threshold (VERY HIGH), you accept only ${passPercent}% of candidates, generating ${syntheticCount.toLocaleString()} extremely coherent examples for ${totalTraining.toLocaleString()} total pairs.`;
      whyText = 'Very high thresholds (0.85+) approach expert-only quality but drastically reduce synthetic data volume. Use when deploying in high-stakes contexts (assessment generation, teacher training) where every generated example must match expert patterns. Models achieve ${simulationAcc}% accuracy but may undercover edge-case misconceptions.';
    }

    whyText = whyText.replace('${simulationAcc}', simulationAcc);

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
