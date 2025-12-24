(function () {
  'use strict';

  function getEl(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  const DEMANDS = {
    shallow: {
      label: 'Text meaning only (summary-level)',
      evidence: { label: 'Usually “easy mode”', chipClass: 'chip chip-neutral' },
      destinations: [
        { name: 'Language understanding (text)', note: 'Turn words into a coherent summary. Often enough for paraphrasing and basic Q&A.' }
      ],
      behavior: 'Check: can it restate accurately, extract key facts, and stay consistent across paraphrases?',
      neural: 'Researchers would expect mostly “language” processing here, without needing other specialist systems.',
      llm: [
        'Text-only models can be strong here: fluent answers often match what you need.',
        'If the decision is high-stakes, still add verification (policies, databases, citations).' 
      ]
    },
    tom: {
      label: 'People & intent (social reasoning)',
      evidence: { label: 'Often needs “people model”', chipClass: 'chip chip-success' },
      destinations: [
        { name: 'Social reasoning', note: 'Track what each person believes, wants, and expects (especially across multiple messages).' },
        { name: 'Language understanding (text)', note: 'Extracts the story from the words before anything else can happen.' }
      ],
      behavior: 'Check: does it keep roles straight (customer vs agent), and avoid blaming/overpromising when facts are unclear?',
      neural: 'Researchers would look for engagement of brain regions known to support social reasoning during normal reading.',
      llm: [
        'If your product is customer-facing, this is where tone + intent + “who knows what” matter.',
        'Structured state (actors, goals, timeline) helps reduce confident-but-wrong replies.'
      ]
    },
    physics: {
      label: 'Cause & effect (what will happen next)',
      evidence: { label: 'Needs a world model', chipClass: 'chip chip-info' },
      destinations: [
        { name: 'Cause-and-effect reasoning', note: 'Work out consequences: if X happened, what must be true next?' },
        { name: 'Language understanding (text)', note: 'Extracts objects, constraints, and sequence from the words.' }
      ],
      behavior: 'Check: does the answer stay consistent when you change one detail (“what if the return was after the cutoff”)?',
      neural: 'Researchers would compare “cause & effect” sentences vs “people” sentences and see different specialist patterns.',
      llm: [
        'For high-stakes decisions, add verification steps (calculators, simulators, rule engines).',
        'Beware: fluent answers can hide broken reasoning.'
      ]
    },
    space: {
      label: 'Locations & routes (maps / where things are)',
      evidence: { label: 'Needs spatial state', chipClass: 'chip chip-info' },
      destinations: [
        { name: 'Spatial reasoning', note: 'Keep track of locations, paths, and “where” relations across steps.' },
        { name: 'Language understanding (text)', note: 'Turns location words into a usable representation.' }
      ],
      behavior: 'Check: can it keep directions consistent (left/right), and not contradict earlier locations?',
      neural: 'Researchers would test whether location-rich text recruits navigation/scene systems during passive comprehension.',
      llm: [
        'If there\'s a real map/state, connect the assistant to it (APIs, inventory locations, delivery routes).',
        'Treat “deep” as stateful + verifiable, not just descriptive.'
      ]
    },
    vision: {
      label: 'Visual details (what it looks like)',
      evidence: { label: 'Hard without seeing', chipClass: 'chip chip-warning' },
      destinations: [
        { name: 'Visual processing', note: 'Recognize and reason about what something looks like (shape, layout, appearance).' },
        { name: 'Language understanding (text)', note: 'Reads the description, but may not reliably “see” it.' }
      ],
      behavior: 'Check: can it answer visual questions without hallucinating details (colors, locations, layouts)?',
      neural: 'Researchers would separate “imagine this” tasks from normal reading to see when vision systems are actually recruited.',
      llm: [
        'If the task is visual (damage claims, forms, screenshots), multimodal inputs are usually best.',
        'Text-only descriptions can work, but are brittle and easy to overconfidently hallucinate.'
      ]
    },
    motor: {
      label: 'How-to steps (doing actions correctly)',
      evidence: { label: 'Needs procedure checking', chipClass: 'chip chip-info' },
      destinations: [
        { name: 'Procedural reasoning', note: 'Turn instructions into correct step-by-step actions and constraints.' },
        { name: 'Language understanding (text)', note: 'Extract the steps from the description.' }
      ],
      behavior: 'Check: does it produce steps that actually work, in the right order, with the right safety constraints?',
      neural: 'Researchers would test whether action language recruits action-related systems without telling people to imagine actions.',
      llm: [
        'For real-world actions, connect to tooling (checklists, validation rules, runbooks) instead of relying on free-form text.',
        'When possible, verify by executing steps in a safe sandbox or using structured forms.'
      ]
    },
    memory: {
      label: 'Background knowledge (rules, history, context)',
      evidence: { label: 'Often needs lookup', chipClass: 'chip chip-warning' },
      destinations: [
        { name: 'Memory & knowledge', note: 'Use prior facts: policies, product history, account history, what happened last time.' },
        { name: 'Language understanding (text)', note: 'Uses cues in text to decide what to retrieve.' }
      ],
      behavior: 'Check: does it pull the right policy/version/account history, and avoid “making up” missing details?',
      neural: 'Researchers would test long-context stories and see whether memory-related systems track story-level meaning.',
      llm: [
        'RAG and internal search are practical versions of this: retrieve the right facts, then answer.',
        'If freshness matters, prefer retrieval over relying on the model\'s memory.'
      ]
    }
  };

  function render() {
    const root = getEl('p65-explorer');
    if (!root) return;

    const selectEl = getEl('p65-demand');
    const destinationsEl = getEl('p65-destinations');
    const behaviorEl = getEl('p65-behavior');
    const neuralEl = getEl('p65-neural');
    const llmEl = getEl('p65-llm');
    const evidenceChipEl = getEl('p65-evidence-chip');

    if (!selectEl || !destinationsEl || !behaviorEl || !neuralEl || !llmEl || !evidenceChipEl) return;

    const key = selectEl.value;
    const config = DEMANDS[key] || DEMANDS.shallow;

    evidenceChipEl.className = `${config.evidence.chipClass} text-xs`;
    evidenceChipEl.textContent = config.evidence.label;

    destinationsEl.innerHTML = `
      <div class="space-y-2">
        <div class="text-sm font-semibold text-heading">${escapeHtml(config.label)}</div>
        <div class="flex flex-wrap gap-2">
          ${config.destinations
            .map(d => `<span class="chip chip-muted text-xs">${escapeHtml(d.name)}</span>`)
            .join('')}
        </div>
        <ul class="list-disc ml-5 space-y-1 text-sm text-body">
          ${config.destinations
            .map(d => `<li><strong>${escapeHtml(d.name)}:</strong> ${escapeHtml(d.note)}</li>`)
            .join('')}
        </ul>
      </div>
    `;

    behaviorEl.textContent = config.behavior;
    neuralEl.textContent = config.neural;

    llmEl.innerHTML = `
      <p>Some systems can look correct while staying “shallow”: fluent answers that don’t reliably connect to the right world model.</p>
      <ul class="list-disc ml-5 space-y-1">
        ${config.llm.map(line => `<li>${escapeHtml(line)}</li>`).join('')}
      </ul>
    `;
  }

  function init() {
    const root = getEl('p65-explorer');
    if (!root) return;

    const selectEl = getEl('p65-demand');
    if (!selectEl) return;

    selectEl.addEventListener('change', render);
    render();
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.render = render;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
