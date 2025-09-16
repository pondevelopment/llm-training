const interactiveScript = () => {
  const root = document.getElementById('qXX-interactive-root');
  const input = document.getElementById('qXX-input');
  const output = document.getElementById('qXX-output');
  const indicator = document.getElementById('qXX-indicator');
  const legend = document.getElementById('qXX-legend');
  const modeRadios = document.querySelectorAll('input[name="qXX-mode"]');

  if (!root || !input || !output || !indicator || !legend) {
    console.warn('qXX template: missing expected DOM nodes. Ensure ids are updated.');
    return;
  }

  const modeConfig = {
    'mode-a': {
      label: 'Balanced',
      summary: 'Explain what users should expect in this configuration.',
      legend: ['Key factor A: 70%', 'Key factor B: 30%']
    },
    'mode-b': {
      label: 'Aggressive',
      summary: 'Use this state description to highlight a contrasting output.',
      legend: ['Key factor A: 30%', 'Key factor B: 70%']
    },
    'mode-c': {
      label: 'Safe',
      summary: 'Document any guardrails or fallback behaviour.',
      legend: ['Key factor A: 50%', 'Key factor B: 50%']
    }
  };

  const render = () => {
    const selected = document.querySelector('input[name="qXX-mode"]:checked');
    const mode = selected ? selected.value : 'mode-a';
    const config = modeConfig[mode] || modeConfig['mode-a'];
    const text = input.value.trim();

    indicator.textContent = config.label;
    output.innerHTML = text ? `<p class="mb-2">${text}</p><p>${config.summary}</p>` : '<p class="text-gray-600">Provide an input to see the walkthrough.</p>';
    legend.innerHTML = `<ul class="list-disc ml-4 space-y-1">${config.legend.map(item => `<li>${item}</li>`).join('')}</ul>`;
  };

  input.addEventListener('input', render);
  modeRadios.forEach(radio => radio.addEventListener('change', render));

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.questionXXInteractive = interactiveScript;
}
