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
    high: 'chip-success',
    medium: 'chip-warning',
    low: 'chip-danger'
  };

  const exampleSets = {
    classification: [
      `Instruction: Label each review as POSITIVE or NEGATIVE.
---
Input: The battery lasts all week.
Label: POSITIVE
---
Input: Support never replied and I am upset.
Label: NEGATIVE
---
Input: {user_text}
Label:`,
      `Instruction: Route tickets to the right queue.
Example 1
Issue: Forgot password and need a reset.
Queue: AUTH
Example 2
Issue: Invoice shows duplicate charge.
Queue: BILLING
Example 3
Issue: {ticket}
Queue:`,
      `Instruction: Classify user feedback as BUG, FEATURE, or PRAISE.
---
Text: The export button does nothing when clicked.
Label: BUG
---
Text: Could you add dark mode to the dashboard?
Label: FEATURE
---
Text: Love how fast the new release is.
Label: PRAISE
---
Text: {feedback}
Label:`,
      `Instruction: Detect customer emotion (HAPPY, FRUSTRATED, NEUTRAL).
---
Transcript: Agent fixed my problem in two minutes.
Emotion: HAPPY
---
Transcript: I have been on hold for 20 minutes!
Emotion: FRUSTRATED
---
Transcript: Please confirm the meeting time.
Emotion: NEUTRAL
---
Transcript: {message}
Emotion:`,
      `Instruction: Set ticket priority to LOW, MEDIUM, or HIGH. Answer "Priority: <label>".
---
Ticket: Payment failed for the enterprise account renewal. Customer finance is blocked from downloading invoices.
Priority: HIGH
---
Ticket: Tooltip misaligned on the profile page, but customers can still complete the flow.
Priority: LOW
---
Ticket: {ticket}
Priority:`,
      `Instruction: Tag product feedback as UX, PERFORMANCE, or RELIABILITY.
---
Feedback: Search results take 12 seconds to load even on fast wifi.
Label: PERFORMANCE
---
Feedback: The toggle doesn't explain what "smart sync" actually changes.
Label: UX
---
Feedback: {feedback}
Label:`
    ],
    reasoning: [
      `Instruction: Solve the word problem. Show steps, then ANSWER.
---
Problem: A box holds 6 apples. You buy 3 boxes. How many apples?
Steps:
1. Apples per box = 6
2. Total boxes = 3
3. Multiply: 6 * 3 = 18
Answer: 18
---
Problem: {question}
Steps:`,
      `Task: Decide if the statement is supported. Reason first.
Context: The team shipped version 2.0 in April.
Claim: The release happened before March.
Reasoning: Version 2.0 shipped in April which is after March -> claim unsupported.
Verdict: CONTRADICTED
---
Context: {context}
Claim: {claim}
Reasoning:`,
      `Instruction: Provide chain-of-thought before the final decision.
---
Scenario: The store closes at 9pm. It is currently 8:40pm and the bus ride takes 30 minutes. Will I make it?
Reasoning: Travel time 30 minutes. 8:40pm + 30 minutes = 9:10pm which is after closing.
Answer: NO
---
Scenario: {scenario}
Reasoning:`,
      `Instruction: Analyze argument validity. Present logic then verdict (VALID / INVALID).
---
Premise: If it rains, the streets are wet. It rained tonight.
Reasoning: Rain implies wet streets; premise satisfied; conclusion follows.
Verdict: VALID
---
Premise: All birds can fly. Penguins are birds.
Reasoning: Premise false (penguins cannot fly); conclusion unsound.
Verdict: INVALID
---
Premise: {premise}
Reasoning:`,
      `Instruction: Check if the work can finish before the deadline. List steps, then Verdict (ON TRACK / AT RISK).
---
Plan: Draft script (4h), record walkthrough (2h), edit video (3h). Team has 1 workday (8h) remaining.
Steps:
1. Total effort = 4 + 2 + 3 = 9h.
2. Available time = 8h.
3. Effort exceeds time -> can't finish in one day.
Verdict: AT RISK
---
Plan: {plan}
Steps:`,
      `Task: Choose the safer remediation plan. Think aloud, then Decision (PLAN A or PLAN B).
---
Context: PLAN A patches tonight with 30 minutes of downtime. PLAN B waits until the weekend with no downtime but leaves a critical vulnerability exposed for 3 days.
Reasoning: Critical risk outweighs brief downtime; patching tonight keeps users safe.
Decision: PLAN A
---
Context: {context}
Reasoning:`
    ],
    extraction: [
      `Instruction: Extract fields as JSON. Use null if missing.
---
Text: Order 552 shipped to Paris with tracking ZX12.
Output: {"order_id":"552","city":"Paris","tracking":"ZX12","priority":false}
---
Text: {record}
Output:`,
      `Guideline: Fill slots. Keep empty slots as "N/A".
Example
Email: We met on Tuesday to review contract AC-44. No blockers.
Slots:
- MeetingDate: Tuesday
- ContractId: AC-44
- Blockers: N/A
---
Email: {email}
Slots:`,
      `Instruction: Parse meeting notes into JSON.
---
Notes: Kickoff call with BetaCorp on May 12. Alice owns follow-up. Budget target $45k.
Output: {"company":"BetaCorp","date":"May 12","owner":"Alice","budget":45000}
---
Notes: {notes}
Output:`,
      `Guideline: Extract product returns with status, reason, and refund flag. Use false if unclear.
---
Text: Customer mailed back headset because microphone was dead. Issued store credit.
Output: {"item":"headset","status":"returned","reason":"microphone dead","refunded":true}
---
Text: {return_entry}
Output:`,
      `Instruction: Summarize incident reports into JSON with fields incident_id, impact, root_cause, mitigation.
---
Report: Incident INC-2045 caused checkout failures for EU users for 35 minutes because of a caching misconfiguration. Mitigation: rolled back config.
Output: {"incident_id":"INC-2045","impact":"checkout failures for EU users (35m)","root_cause":"caching misconfiguration","mitigation":"rolled back config"}
---
Report: {report}
Output:`,
      `Guideline: Capture call outcomes as JSON with intent, sentiment, next_step. Use "none" if unknown.
---
Call: Customer wants to downgrade to the starter plan. Agent scheduled a follow-up to confirm billing tomorrow. Caller sounded anxious about costs.
Output: {"intent":"downgrade request","sentiment":"anxious","next_step":"agent follow-up tomorrow"}
---
Call: {call}
Output:`
    ]
  };

  const exampleLabels = {
    classification: [
      'Sentiment labels (POS/NEG)',
      'Ticket routing queues',
      'Feedback triage (bug/feature/praise)',
      'Emotion detection (call center)',
      'Priority triage (low/med/high)',
      'Feedback theme tagging'
    ],
    reasoning: [
      'Math word problem (steps + answer)',
      'Claim verification (contradiction)',
      'Scenario feasibility check',
      'Argument validity review',
      'Deadline feasibility (on track?)',
      'Remediation choice (plan A/B)'
    ],
    extraction: [
      'JSON order extraction',
      'Slot filling email summary',
      'Meeting notes to JSON',
      'Product return audit',
      'Incident summary JSON',
      'Call outcome summary'
    ]
  };


  let exampleIndex = 0;

  const clamp = (value) => Math.min(1, Math.max(0, value));

  const barRow = (label, value) => {
    const pct = Math.round(value * 100);
    const tone = value > 0.75 ? 'var(--tone-emerald-strong)' : value > 0.5 ? 'var(--tone-sky-strong)' : 'var(--color-path-scaling-strong)';
    return `<div class="space-y-1"><div class="flex items-center justify-between text-xs text-muted"><span>${label}</span><span class="font-mono text-heading">${pct}%</span></div><div class="h-2 rounded bg-surface border border-divider overflow-hidden"><div class="h-full" style="width:${pct}%;background:${tone};"></div></div></div>`;
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
    indicator.className = `chip ${indicatorClasses[tier]} text-xs font-medium`;
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

    output.innerHTML = `<p class="mb-2 text-body">${detail.description}</p><ul class="list-disc ml-5 space-y-1">${suggestions.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    legend.innerHTML = `<div class="space-y-2">${barRow('Shot fit', shotScore)}${barRow('Example fidelity', fidelityScore)}${barRow('Coverage', coverageScore)}${barRow('Format match', formatScore)}</div><p class="mt-2 text-[11px] text-muted">Sweet spot ~ ${detail.recommendedShots} shots. Adjust sliders to see trade-offs.</p>`;
    explanation.innerHTML = `<p class="mb-1 text-body">${detail.messages[tier]}</p><p class="text-xs panel-muted">${detail.baseline}</p>`;
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
