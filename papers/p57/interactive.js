(function() {
  'use strict';

  // Model data: stated belief shift, behavioral shift, divergence
  // Based on Tables 1-2 and Figure 2 from the paper
  const MODEL_DATA = {
    gpt5: {
      name: 'GPT-5',
      debate: { stated: 54.7, behavior: 40.6, divergence: 14.1 },
      'persuasion-info': { stated: 72.7, behavior: 58.0, divergence: 14.7 },
      'persuasion-empathy': { stated: 65.7, behavior: 52.0, divergence: 13.7 },
      'persuasion-emotional': { stated: 59.0, behavior: 46.0, divergence: 13.0 },
      'persuasion-authority': { stated: 57.8, behavior: 45.0, divergence: 12.8 },
      'persuasion-social': { stated: 59.0, behavior: 46.0, divergence: 13.0 },
      reading: { stated: 18.0, behavior: 12.0, divergence: 6.0 },
      research: { stated: 20.0, behavior: 14.0, divergence: 6.0 }
    },
    claude4: {
      name: 'Claude-4-Sonnet',
      debate: { stated: 26.0, behavior: 20.0, divergence: 6.0 },
      'persuasion-info': { stated: 38.0, behavior: 30.0, divergence: 8.0 },
      'persuasion-empathy': { stated: 35.0, behavior: 28.0, divergence: 7.0 },
      'persuasion-emotional': { stated: 32.0, behavior: 26.0, divergence: 6.0 },
      'persuasion-authority': { stated: 31.0, behavior: 25.0, divergence: 6.0 },
      'persuasion-social': { stated: 32.0, behavior: 26.0, divergence: 6.0 },
      reading: { stated: 27.2, behavior: 22.0, divergence: 5.2 },
      research: { stated: 24.9, behavior: 20.0, divergence: 4.9 }
    },
    grok4: {
      name: 'Grok-4',
      debate: { stated: 28.0, behavior: 22.0, divergence: 6.0 },
      'persuasion-info': { stated: 40.0, behavior: 32.0, divergence: 8.0 },
      'persuasion-empathy': { stated: 37.0, behavior: 30.0, divergence: 7.0 },
      'persuasion-emotional': { stated: 34.0, behavior: 28.0, divergence: 6.0 },
      'persuasion-authority': { stated: 33.0, behavior: 27.0, divergence: 6.0 },
      'persuasion-social': { stated: 34.0, behavior: 28.0, divergence: 6.0 },
      reading: { stated: 27.2, behavior: 22.0, divergence: 5.2 },
      research: { stated: 25.0, behavior: 20.0, divergence: 5.0 }
    },
    gemini25: {
      name: 'Gemini-2.5-Pro',
      debate: { stated: 33.8, behavior: 26.0, divergence: 7.8 },
      'persuasion-info': { stated: 48.0, behavior: 38.0, divergence: 10.0 },
      'persuasion-empathy': { stated: 44.0, behavior: 35.0, divergence: 9.0 },
      'persuasion-emotional': { stated: 40.0, behavior: 32.0, divergence: 8.0 },
      'persuasion-authority': { stated: 39.0, behavior: 31.0, divergence: 8.0 },
      'persuasion-social': { stated: 40.0, behavior: 32.0, divergence: 8.0 },
      reading: { stated: 15.0, behavior: 10.0, divergence: 5.0 },
      research: { stated: 17.0, behavior: 12.0, divergence: 5.0 }
    },
    opensource: {
      name: 'Open-source (avg)',
      debate: { stated: 34.4, behavior: 28.0, divergence: 6.4 },
      'persuasion-info': { stated: 50.0, behavior: 40.0, divergence: 10.0 },
      'persuasion-empathy': { stated: 46.0, behavior: 37.0, divergence: 9.0 },
      'persuasion-emotional': { stated: 42.0, behavior: 34.0, divergence: 8.0 },
      'persuasion-authority': { stated: 41.0, behavior: 33.0, divergence: 8.0 },
      'persuasion-social': { stated: 42.0, behavior: 34.0, divergence: 8.0 },
      reading: { stated: 4.9, behavior: 3.0, divergence: 1.9 },
      research: { stated: 6.0, behavior: 4.0, divergence: 2.0 }
    }
  };

  function init() {
    const modelSelect = document.getElementById('p57-model');
    const settingSelect = document.getElementById('p57-setting');
    const statedValue = document.getElementById('p57-stated-value');
    const behaviorValue = document.getElementById('p57-behavior-value');
    const divergenceValue = document.getElementById('p57-divergence-value');
    const statedBar = document.getElementById('p57-stated-bar');
    const behaviorBar = document.getElementById('p57-behavior-bar');
    const divergenceBar = document.getElementById('p57-divergence-bar');
    const summary = document.getElementById('p57-summary');
    const explanation = document.getElementById('p57-explanation');

    if (!modelSelect || !settingSelect || !statedValue) {
      console.warn('p57 interactive elements not found');
      return;
    }

    function updateUI() {
      const model = modelSelect.value;
      const setting = settingSelect.value;
      const data = MODEL_DATA[model][setting];

      // Update values
      statedValue.textContent = `${data.stated.toFixed(1)}%`;
      behaviorValue.textContent = `${data.behavior.toFixed(1)}%`;
      divergenceValue.textContent = `${data.divergence.toFixed(1)}pp`;

      // Update bars (max 100%)
      statedBar.style.width = `${Math.min(data.stated, 100)}%`;
      behaviorBar.style.width = `${Math.min(data.behavior, 100)}%`;
      divergenceBar.style.width = `${Math.min(data.divergence * 5, 100)}%`; // scale divergence for visibility

      // Update summary
      const modelName = MODEL_DATA[model].name;
      const settingLabel = settingSelect.options[settingSelect.selectedIndex].text;
      summary.textContent = `${modelName} · ${settingLabel}`;

      // Generate explanation
      const isIntentional = setting.startsWith('persuasion') || setting === 'debate';
      const isHighShift = data.stated > 40;
      const isHighDivergence = data.divergence > 10;

      let html = '<p>';
      
      if (isHighShift && isIntentional) {
        html += `<strong>High vulnerability:</strong> ${modelName} shows ${data.stated.toFixed(1)}% stated belief shift under ${settingLabel.toLowerCase()}. `;
        html += `This exceeds the 40% threshold for production concern. Users will perceive the model as consistent, but its underlying beliefs have substantially changed. `;
      } else if (isHighShift && !isIntentional) {
        html += `<strong>Exposure risk:</strong> ${modelName} exhibits ${data.stated.toFixed(1)}% shift from passive ${settingLabel.toLowerCase()}, with no intentional persuasion. `;
        html += `This indicates the model accumulates context biases even from neutral reading. `;
      } else {
        html += `<strong>Moderate drift:</strong> ${modelName} shows ${data.stated.toFixed(1)}% stated belief shift. `;
        html += `While lower than GPT-5's peak (72.7%), this still represents meaningful change over extended conversations. `;
      }

      html += '</p><p>';

      if (isHighDivergence) {
        html += `<strong>Reliability gap:</strong> The ${data.divergence.toFixed(1)} percentage point divergence between stated belief (${data.stated.toFixed(1)}%) and behavior (${data.behavior.toFixed(1)}%) indicates shallow integration. `;
        html += `The model's verbal positions update more than its decision-making circuits, creating consistency risks. `;
      } else {
        html += `<strong>Better alignment:</strong> The divergence (${data.divergence.toFixed(1)}pp) is relatively low, suggesting stated beliefs and behaviors shift together. `;
      }

      html += '</p><p><strong>Action:</strong> ';

      if (model === 'gpt5' && isIntentional) {
        html += 'Avoid GPT-5 for persistent systems with persuasion-heavy contexts. Implement drift detection (baseline snapshots every 10 interactions). Consider switching to Claude-4 or open-source models for lower persuasion vulnerability.';
      } else if ((model === 'claude4' || model === 'grok4') && !isIntentional) {
        html += `${modelName} is sensitive to passive exposure. For assistants that read documentation or browse content, implement memory pruning after 500 messages or 10 rounds. Monitor stated-behavioral divergence as a reliability metric.`;
      } else if (model === 'opensource' && !isIntentional) {
        html += 'Open-source models resist passive drift well (1.7-8.1%). For read-heavy workflows, they offer better consistency than frontier models. However, test debate vulnerability (24.4-44.4%) if users engage in extended arguments.';
      } else {
        html += 'Baseline your use case with 50 scenarios, re-test every 100 interactions. Document acceptable drift thresholds (e.g., <10% for safety-critical). Implement "refresh to baseline" mechanisms if drift exceeds limits.';
      }

      html += '</p>';
      explanation.innerHTML = html;
    }

    modelSelect.addEventListener('change', updateUI);
    settingSelect.addEventListener('change', updateUI);
    
    updateUI(); // Initial render
  }

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
