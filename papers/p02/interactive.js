const interactiveScript = () => {
  const root = document.getElementById('p02-explorer');
  if (!root) return;

  const state = {
    delta: 0.02,
    baseBound: 0,
    singletonBound: 0,
    rule: 'binary',
    shouldGuess: true
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const formatPercent = value => `${Math.round(value * 100)}%`;

  const elements = {
    accuracy: document.getElementById('p02-accuracy'),
    accuracyLabel: document.getElementById('p02-accuracy-label'),
    structure: document.getElementById('p02-structure'),
    toggles: Array.from(root.querySelectorAll('.p02-toggle')),
    baseBound: document.getElementById('p02-base-bound'),
    baseNote: document.getElementById('p02-base-note'),
    singletons: document.getElementById('p02-singletons'),
    singletonsLabel: document.getElementById('p02-singletons-label'),
    samples: document.getElementById('p02-samples'),
    samplesLabel: document.getElementById('p02-samples-label'),
    singletonBound: document.getElementById('p02-singleton-bound'),
    singletonNote: document.getElementById('p02-singleton-note'),
    ruleRadios: Array.from(root.querySelectorAll('input[name="p02-rule"]')),
    ruleNote: document.getElementById('p02-rule-note'),
    confidence: document.getElementById('p02-confidence'),
    confidenceLabel: document.getElementById('p02-confidence-label'),
    summary: document.getElementById('p02-summary')
  };

  const selectDeltaButton = deltaValue => {
    state.delta = Number(deltaValue) || 0;
    elements.toggles.forEach(btn => {
      const isActive = Number(btn.dataset.delta) === state.delta;
      btn.classList.toggle('bg-indigo-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-indigo-600', isActive);
      btn.classList.toggle('shadow-sm', isActive);
    });
  };

  const updateBase = () => {
    const accuracyPercent = Number(elements.accuracy?.value || 0);
    const accuracy = accuracyPercent / 100;
    const misclassification = clamp(1 - accuracy, 0, 0.45);
    const ratioTerm = Number(elements.structure?.value || 0);
    let lowerBound = (2 * misclassification) - state.delta - ratioTerm;
    lowerBound = clamp(lowerBound, 0, 0.95);
    state.baseBound = lowerBound;

    if (elements.accuracyLabel) {
      elements.accuracyLabel.textContent = `${accuracyPercent}%`;
    }

    if (elements.baseBound) {
      elements.baseBound.textContent = formatPercent(lowerBound);
    }

    if (elements.baseNote) {
      if (lowerBound <= 0.05) {
        elements.baseNote.textContent = 'With this much accuracy and calibration, the theorem only guarantees a tiny error floor.';
      } else if (lowerBound <= 0.18) {
        elements.baseNote.textContent = 'Even strong base models keep a noticeable hallucination floor—the paper says calibration alone cannot remove it.';
      } else {
        elements.baseNote.textContent = 'Large misclassification or calibration drift guarantees a high hallucination floor, matching the paper\'s warning.';
      }
    }
  };

  const updateSingleton = () => {
    const singletonPercent = Number(elements.singletons?.value || 0);
    const samplesK = Number(elements.samples?.value || 0);
    const singletonsShare = singletonPercent / 100;
    const samples = Math.max(samplesK * 1000, 1);
    const adjustment = (35 + 6 * Math.log(samples)) / Math.sqrt(samples);
    const bound = clamp(singletonsShare - (adjustment / 100), 0, 0.95);
    state.singletonBound = bound;

    if (elements.singletonsLabel) {
      elements.singletonsLabel.textContent = `${singletonPercent}%`;
    }
    if (elements.samplesLabel) {
      elements.samplesLabel.textContent = `${samplesK}k`;
    }
    if (elements.singletonBound) {
      elements.singletonBound.textContent = formatPercent(bound);
    }
    if (elements.singletonNote) {
      if (singletonPercent === 0) {
        elements.singletonNote.textContent = 'If every fact appears often, the singleton bound vanishes.';
      } else if (bound <= 0.08) {
        elements.singletonNote.textContent = 'Good coverage keeps the inevitable misses under 10%.';
      } else {
        elements.singletonNote.textContent = 'Lots of once-seen facts force a big error floor—the paper proposes adding data rather than trusting the model.';
      }
    }
  };

  const scoringRules = {
    binary: {
      reward: 1,
      penalty: 0,
      blurb: confidence => `Binary grading rewards guessing—the expected score is higher when you answer even at ${Math.round(confidence * 100)}% confidence.`
    },
    'minus-one': {
      reward: 1,
      penalty: 1,
      blurb: confidence => confidence >= 0.75
        ? `Minus-one encourages caution but still lets confident answers through at ${Math.round(confidence * 100)}%.`
        : `Minus-one means abstain unless you are at least ${Math.round(confidence * 100)}% sure.`
    },
    confidence: {
      reward: 1,
      penalty: 0.5,
      blurb: confidence => confidence >= 0.8
        ? 'Confidence-target scoring approves this guess—confidence clears the bar.'
        : 'Confidence-target scoring would tell the model to abstain and ask for help.'
    }
  };

  const updateRule = () => {
    const confidencePercent = Number(elements.confidence?.value || 0);
    const confidence = confidencePercent / 100;
    const ruleKey = state.rule;
    const rule = scoringRules[ruleKey];

    if (elements.confidenceLabel) {
      elements.confidenceLabel.textContent = `${confidencePercent}%`;
    }

    if (!rule) {
      return;
    }

    const guessScore = (rule.reward * confidence) - (rule.penalty * (1 - confidence));
    state.shouldGuess = guessScore >= 0;

    if (elements.ruleNote) {
      elements.ruleNote.textContent = rule.blurb(confidence);
      elements.ruleNote.classList.toggle('bg-rose-50', guessScore >= 0);
      elements.ruleNote.classList.toggle('border-rose-200', guessScore >= 0);
      elements.ruleNote.classList.toggle('text-rose-700', guessScore >= 0);
      elements.ruleNote.classList.toggle('bg-emerald-50', guessScore < 0);
      elements.ruleNote.classList.toggle('border-emerald-200', guessScore < 0);
      elements.ruleNote.classList.toggle('text-emerald-700', guessScore < 0);
    }
  };

  const updateSummary = () => {
    if (!elements.summary) return;

    const accuracyPercent = Number(elements.accuracy?.value || 0);
    const singletonPercent = Number(elements.singletons?.value || 0);
    const samplesK = Number(elements.samples?.value || 0);
    const confidencePercent = Number(elements.confidence?.value || 0);

    const baseMsg = state.baseBound <= 0.05
      ? `With ${accuracyPercent}% accuracy and tight calibration, the generative lower bound shrinks to ${formatPercent(state.baseBound)}—but any drift bumps it back up.`
      : state.baseBound <= 0.18
        ? `The base-model theorem locks in ${formatPercent(state.baseBound)} error even before deployment tweaks.`
        : `Because the validity classifier still misses often or calibration slipped, the theory forces at least ${formatPercent(state.baseBound)} hallucinations.`;

    const singletonMsg = state.singletonBound === 0
      ? 'Pre-training covered every fact many times, so the singleton bound adds no extra risk.'
      : `With ${singletonPercent}% singleton facts (≈${samplesK}k samples), Good–Turing predicts at least ${formatPercent(state.singletonBound)} errors on rare facts.`;

    const evalMsg = state.rule === 'binary'
      ? `Binary leaderboards keep rewarding guesses, so a ${confidencePercent}% confident answer will still be attempted.`
      : state.shouldGuess
        ? `This scoring rule still prefers guessing at ${confidencePercent}% confidence—abstentions stay rare.`
        : 'This scoring rule would penalise bluffing here, pushing the model to abstain and align with the paper\'s recommendation.';

    elements.summary.innerHTML = `
      <ul class="list-disc ml-5 space-y-1">
        <li>${baseMsg}</li>
        <li>${singletonMsg}</li>
        <li>${evalMsg}</li>
      </ul>
    `;
  };

  const triggerAll = () => {
    updateBase();
    updateSingleton();
    updateRule();
    updateSummary();
  };

  if (elements.accuracy) {
    elements.accuracy.addEventListener('input', () => {
      updateBase();
      updateSummary();
    });
  }

  if (elements.structure) {
    elements.structure.addEventListener('change', () => {
      updateBase();
      updateSummary();
    });
  }

  elements.toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      selectDeltaButton(btn.dataset.delta);
      updateBase();
      updateSummary();
    });
  });

  if (elements.singletons) {
    elements.singletons.addEventListener('input', () => {
      updateSingleton();
      updateSummary();
    });
  }

  if (elements.samples) {
    elements.samples.addEventListener('input', () => {
      updateSingleton();
      updateSummary();
    });
  }

  elements.ruleRadios.forEach(radio => {
    radio.addEventListener('change', event => {
      if (event.target.checked) {
        state.rule = event.target.value;
        updateRule();
        updateSummary();
      }
    });
  });

  if (elements.confidence) {
    elements.confidence.addEventListener('input', () => {
      updateRule();
      updateSummary();
    });
  }

  if (elements.toggles.length) {
    selectDeltaButton(elements.toggles[0].dataset.delta);
  }

  triggerAll();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else {
  window.interactiveScript = interactiveScript;
}
