const interactiveScript = () => {
  const scenario = document.getElementById('q57-scenario');
  const exampleSelect = document.getElementById('q57-example-select');
  const exampleBox = document.getElementById('q57-example');
  const shots = document.getElementById('q57-shots');
  const shotsVal = document.getElementById('q57-shots-val');
  const fidelity = document.getElementById('q57-fidelity');
  const fidelityVal = document.getElementById('q57-fidelity-val');
  const coverage = document.getElementById('q57-coverage');
  const coverageVal = document.getElementById('q57-coverage-val');
  const formatRadios = document.querySelectorAll('input[name="q57-format"]');
  const indicator = document.getElementById('q57-indicator');
  const output = document.getElementById('q57-output');
  const legend = document.getElementById('q57-legend');
  const explanation = document.getElementById('q57-explanation');

  if (!scenario || !exampleSelect || !exampleBox || !shots || !fidelity || !coverage || !indicator || !output || !legend || !explanation) {
    return;
  }

  const scenarios = {
    classification: {
      label: 'Label routing',
      description: 'Map unlabeled text to consistent labels using contrastive examples.',
      recommendedShots: 4,
      weights: { shots: 0.35, fidelity: 0.3, coverage: 0.2, format: 0.15 },
      messages: {
        high: 'Examples span the label space and the model should confidently mirror the mapping.',
        medium: 'Pattern is emerging, but edge labels or conflicting tones may still wobble.',
        low: 'Model lacks enough balanced evidence - expect majority-class bias or label drift.'
      },
      baseline: 'Balance coverage across labels and reserve a clear answer slot like "Label:" or "Verdict:".'
    },
    reasoning: {
      label: 'Reasoning / chain-of-thought',
      description: 'Guide step-by-step thinking and final answers (math, QA, decisions).',
      recommendedShots: 3,
      weights: { shots: 0.3, fidelity: 0.3, coverage: 0.2, format: 0.2 },
      messages: {
        high: 'Clear scaffolding should elicit structured reasoning and final answers that mirror your template.',
        medium: 'Model can follow the format, but under-specified steps risk skipped justification.',
        low: 'Reasoning traces will be inconsistent - add more explicit thinking cues and final answer markers.'
      },
      baseline: 'Mark reasoning vs. answer blocks (e.g., "Steps:" then "Answer:") and include a solved variant for each reasoning style you expect.'
    },
    extraction: {
      label: 'Structured extraction',
      description: 'Fill JSON or slot templates from messy input text.',
      recommendedShots: 2,
      weights: { shots: 0.25, fidelity: 0.35, coverage: 0.25, format: 0.15 },
      messages: {
        high: 'Format discipline is strong - expect valid JSON or slot output with minimal repairs.',
        medium: 'Most fields align, but rare attributes may still fall back to free-form text.',
        low: 'Outputs will drift - tighten schemas and show negative/empty field handling explicitly.'
      },
      baseline: 'Demonstrate full objects, including null/empty fields, and fix schema typos before sending to the model.'
    }
  };

  const formatScores = {
    balanced: { classification: 0.7, reasoning: 0.8, extraction: 0.6 },
    structured: { classification: 0.85, reasoning: 0.6, extraction: 0.95 },
    minimal: { classification: 0.45, reasoning: 0.5, extraction: 0.3 }
  };

  const indicatorClasses = {
    high: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-rose-100 text-rose-700'
  };

  const exampleSets = {
    classification: [
      `Instruction: Label each review as POSITIVE or NEGATIVE.\n---\nInput: The battery lasts all week.\nLabel: POSITIVE\n---\nInput: Support never replied and I am upset.\nLabel: NEGATIVE\n---\nInput: {user_text}\nLabel:`,
      `Instruction: Route tickets to the right queue.\nExample 1\nIssue: Forgot password and need a reset.\nQueue: AUTH\nExample 2\nIssue: Invoice shows duplicate charge.\nQueue: BILLING\nExample 3\nIssue: {ticket}\nQueue:`,
      `Instruction: Classify user feedback as BUG, FEATURE, or PRAISE.\n---\nText: The export button does nothing when clicked.\nLabel: BUG\n---\nText: Could you add dark mode to the dashboard?\nLabel: FEATURE\n---\nText: Love how fast the new release is.\nLabel: PRAISE\n---\nText: {feedback}\nLabel:`,
      `Instruction: Detect customer emotion (HAPPY, FRUSTRATED, NEUTRAL).\n---\nTranscript: Agent fixed my problem in two minutes.\nEmotion: HAPPY\n---\nTranscript: I have been on hold for 20 minutes!\nEmotion: FRUSTRATED\n---\nTranscript: Please confirm the meeting time.\nEmotion: NEUTRAL\n---\nTranscript: {message}\nEmotion:`
    ],
    reasoning: [
      `Instruction: Solve the word problem. Show steps, then ANSWER.\n---\nProblem: A box holds 6 apples. You buy 3 boxes. How many apples?\nSteps:\n1. Apples per box = 6\n2. Total boxes = 3\n3. Multiply: 6 * 3 = 18\nAnswer: 18\n---\nProblem: {question}\nSteps:`,
      `Task: Decide if the statement is supported. Reason first.\nContext: The team shipped version 2.0 in April.\nClaim: The release happened before March.\nReasoning: Version 2.0 shipped in April which is after March -> claim unsupported.\nVerdict: CONTRADICTED\n---\nContext: {context}\nClaim: {claim}\nReasoning:`,
      `Instruction: Provide chain-of-thought before the final decision.\n---\nScenario: The store closes at 9pm. It is currently 8:40pm and the bus ride takes 30 minutes. Will I make it?\nReasoning: Travel time 30 minutes. 8:40pm + 30 minutes = 9:10pm which is after closing.\nAnswer: NO\n---\nScenario: {scenario}\nReasoning:`,
      `Instruction: Analyze argument validity. Present logic then verdict (VALID / INVALID).\n---\nPremise: If it rains, the streets are wet. It rained tonight.\nReasoning: Rain implies wet streets; premise satisfied; conclusion follows.\nVerdict: VALID\n---\nPremise: All birds can fly. Penguins are birds.\nReasoning: Premise false (penguins cannot fly); conclusion unsound.\nVerdict: INVALID\n---\nPremise: {premise}\nReasoning:`
    ],
    extraction: [
      `Instruction: Extract fields as JSON. Use null if missing.\n---\nText: Order 552 shipped to Paris with tracking ZX12.\nOutput: {"order_id":"552","city":"Paris","tracking":"ZX12","priority":false}\n---\nText: {record}\nOutput:`,
      `Guideline: Fill slots. Keep empty slots as "N/A".\nExample\nEmail: We met on Tuesday to review contract AC-44. No blockers.\nSlots:\n- MeetingDate: Tuesday\n- ContractId: AC-44\n- Blockers: N/A\n---\nEmail: {email}\nSlots:`,
      `Instruction: Parse meeting notes into JSON.\n---\nNotes: Kickoff call with BetaCorp on May 12. Alice owns follow-up. Budget target $45k.\nOutput: {"company":"BetaCorp","date":"May 12","owner":"Alice","budget":45000}\n---\nNotes: {notes}\nOutput:`,
      `Guideline: Extract product returns with status, reason, and refund flag. Use false if unclear.\n---\nText: Customer mailed back headset because microphone was dead. Issued store credit.\nOutput: {"item":"headset","status":"returned","reason":"microphone dead","refunded":true}\n---\nText: {return_entry}\nOutput:`
    ]
  };

  const exampleLabels = {
    classification: [
      'Sentiment labels (POS/NEG)',
      'Ticket routing queues',
      'Feedback triage (bug/feature/praise)',
      'Emotion detection (call center)'
    ],
    reasoning: [
      'Math word problem (steps + answer)',
      'Claim verification (contradiction)',
      'Scenario feasibility check',
      'Argument validity review'
    ],
    extraction: [
      'JSON order extraction',
      'Slot filling email summary',
      'Meeting notes to JSON',
      'Product return audit'
    ]
  };

  let exampleIndex = 0;

  const clamp = (value) => Math.min(1, Math.max(0, value));

  const barRow = (label, value) => {
    const pct = Math.round(value * 100);
    const color = value > 0.75 ? 'bg-indigo-600' : value > 0.5 ? 'bg-indigo-400' : 'bg-indigo-200';
    return `<div class="space-y-1"><div class="flex justify-between"><span>${label}</span><span class="font-mono">${pct}%</span></div><div class="h-2 bg-gray-200 rounded overflow-hidden"><div class="h-full ${color}" style="width:${pct}%"></div></div></div>`;
  };

  const getFormatKey = () => {
    let selected = 'balanced';
    formatRadios.forEach((radio) => {
      if (radio.checked) {
        selected = radio.value;
      }
    });
    return selected;
  };

  const updateExampleBox = () => {
    const examples = exampleSets[scenario.value] || [];
    if (!examples.length) {
      exampleBox.textContent = '';
      exampleSelect.innerHTML = '';
      return;
    }
    if (exampleIndex >= examples.length) {
      exampleIndex = 0;
    }
    exampleSelect.value = String(exampleIndex);
    exampleBox.textContent = examples[exampleIndex];
  };

  const populateExampleOptions = (key) => {
    const examples = exampleSets[key] || [];
    const labels = exampleLabels[key] || [];
    exampleSelect.innerHTML = '';
    if (!examples.length) {
      exampleIndex = 0;
      exampleBox.textContent = '';
      return;
    }
    examples.forEach((_, idx) => {
      const option = document.createElement('option');
      option.value = String(idx);
      option.textContent = labels[idx] || `Example ${idx + 1}`;
      exampleSelect.appendChild(option);
    });
    if (exampleIndex >= examples.length) {
      exampleIndex = 0;
    }
    exampleSelect.value = String(exampleIndex);
    exampleBox.textContent = examples[exampleIndex];
  };

  const update = () => {
    updateExampleBox();

    const key = scenario.value;
    const detail = scenarios[key];
    if (!detail) {
      return;
    }

    const shotCount = Number(shots.value);
    const fidelityScore = Number(fidelity.value) / 100;
    const coverageScore = Number(coverage.value) / 100;
    const formatKey = getFormatKey();
    const formatScore = (formatScores[formatKey] && formatScores[formatKey][key]) || 0.5;

    shotsVal.textContent = String(shotCount);
    fidelityVal.textContent = `${fidelity.value}%`;
    coverageVal.textContent = `${coverage.value}%`;

    let shotScore = shotCount === 0 ? 0 : shotCount / detail.recommendedShots;
    if (shotCount > detail.recommendedShots) {
      shotScore -= 0.05 * (shotCount - detail.recommendedShots);
    }
    shotScore = clamp(shotScore);

    const total = clamp(
      (shotScore * detail.weights.shots) +
      (fidelityScore * detail.weights.fidelity) +
      (coverageScore * detail.weights.coverage) +
      (formatScore * detail.weights.format)
    );

    const tier = total > 0.75 ? 'high' : (total > 0.5 ? 'medium' : 'low');
    indicator.className = `text-xs font-medium px-2 py-1 rounded ${indicatorClasses[tier]}`;
    indicator.textContent = tier === 'high' ? 'Confident pattern' : (tier === 'medium' ? 'Promising but risky' : 'Fragile prompt');

    const suggestions = [];
    if (shotCount === 0) {
      suggestions.push('Add at least two demonstrations before the query.');
    }
    if (shotCount > detail.recommendedShots + 2) {
      suggestions.push('Trim to the strongest exemplars - too many shots dilute the pattern.');
    }
    if (shotCount && shotCount < detail.recommendedShots) {
      suggestions.push(`Target roughly ${detail.recommendedShots} shots; you currently have ${shotCount}.`);
    }
    if (fidelityScore < 0.7) {
      suggestions.push('Polish outputs so they match the exact tone and structure you expect.');
    }
    if (coverageScore < 0.6) {
      suggestions.push('Add contrasting edge cases (what to do vs. what not to do).');
    }
    if (getFormatKey() === 'minimal') {
      suggestions.push('Introduce explicit separators or labels so the model recognizes slot boundaries.');
    }
    if (!suggestions.length) {
      suggestions.push('Looks balanced - run holdout queries and ablate examples to confirm necessity.');
    }

    output.innerHTML = `<p class="mb-2 text-gray-800">${detail.description}</p><ul class="list-disc ml-5 space-y-1">${suggestions.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    legend.innerHTML = `<div class="space-y-2">${barRow('Shot fit', shotScore)}${barRow('Example fidelity', fidelityScore)}${barRow('Coverage', coverageScore)}${barRow('Format match', formatScore)}</div><p class="mt-2 text-[11px] text-gray-500">Sweet spot ~ ${detail.recommendedShots} shots. Adjust sliders to see trade-offs.</p>`;
    explanation.innerHTML = `<p class="mb-1">${detail.messages[tier]}</p><p class="text-xs text-yellow-700">${detail.baseline}</p>`;
  };

  scenario.addEventListener('change', () => {
    exampleIndex = 0;
    populateExampleOptions(scenario.value);
    update();
  });

  [shots, fidelity, coverage].forEach((input) => {
    input.addEventListener('input', update);
  });

  formatRadios.forEach((radio) => {
    radio.addEventListener('change', update);
  });

  exampleSelect.addEventListener('change', () => {
    const nextIndex = Number(exampleSelect.value);
    exampleIndex = Number.isNaN(nextIndex) ? 0 : nextIndex;
    updateExampleBox();
  });

  populateExampleOptions(scenario.value);
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question57Interactive = interactiveScript;
}
