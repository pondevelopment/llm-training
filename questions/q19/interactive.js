const interactiveScript = () => {
  const textSelect = document.getElementById('q19-text-select');
  const output = document.getElementById('q19-output');
  const modelTypeRadios = Array.from(document.querySelectorAll('input[name="q19-model-type"]'));
  const taskToggle = document.getElementById('q19-task-toggle');
  const taskButtons = taskToggle ? Array.from(taskToggle.querySelectorAll('button')) : [];
  const discriminativeTasks = document.getElementById('q19-discriminative-tasks');
  const exampleBtn = document.getElementById('q19-example-btn');
  const modelIndicator = document.getElementById('q19-model-indicator');
  const legend = document.getElementById('q19-legend');
  const explanation = document.getElementById('q19-explanation');

  if (!textSelect || !output) {
    console.error('q19 interactive: required DOM nodes are missing');
    return;
  }

  const modelData = {
    generative: {
      name: 'Generative model (GPT-style)',
      description: 'Generates new text by modelling P(X, Y) - the joint probability of input and output.',
      indicatorClass: 'chip chip-success text-xs font-medium'
    },
    discriminative: {
      name: 'Discriminative model (BERT-style)',
      description: 'Classifies text by modelling P(Y | X) - the conditional probability of output given input.',
      indicatorClass: 'chip chip-accent text-xs font-medium'
    }
  };

  const emotionResponses = ['Joy', 'Excitement', 'Satisfaction', 'Anger', 'Sadness', 'Fear', 'Surprise', 'Trust', 'Anticipation'];
  const topicResponses = ['Technology', 'Entertainment', 'Business', 'Sports', 'Politics', 'Science', 'Health', 'Education'];

  const taskCopy = {
    sentiment: 'Sentiment',
    emotion: 'Emotion',
    topic: 'Topic'
  };

  const toneToChipClass = {
    success: 'chip chip-success text-xs',
    accent: 'chip chip-accent text-xs',
    warning: 'chip chip-warning text-xs',
    info: 'chip chip-info text-xs',
    neutral: 'chip chip-neutral text-xs'
  };

  let currentTask = 'sentiment';

  function getCurrentModelType() {
    const selected = document.querySelector('input[name="q19-model-type"]:checked');
    return selected ? selected.value : 'generative';
  }

  function getCurrentTask() {
    return currentTask;
  }

  function generateText(inputText) {
    const text = inputText.toLowerCase();

    if (text.includes('breaking news: technology companies report')) {
      return `${inputText} record-breaking quarterly earnings, driven by increased demand for AI solutions and cloud services.`;
    }
    if (text.includes('scientists discover new treatment for')) {
      return `${inputText} Alzheimer's disease using advanced gene therapy techniques that show promising results in early trials.`;
    }
    if (text.includes('artificial intelligence will transform')) {
      return `${inputText} industries by automating complex tasks, enhancing decision-making, and creating new opportunities for innovation.`;
    }
    if (text.includes("the company's quarterly earnings exceeded")) {
      return `${inputText} analyst expectations by 15%, demonstrating strong performance across all business segments.`;
    }
    if (text.includes('love') && text.includes('product')) {
      return `${inputText} The innovative design and user-friendly interface make it a standout choice in the market.`;
    }
    if (text.includes('terrible') && text.includes('movie')) {
      return `${inputText} However, the cinematography was decent and some scenes showed potential for what could have been.`;
    }
    if (text.includes('weather') && text.includes('nice')) {
      return `${inputText} The clear skies and gentle breeze create perfect conditions for outdoor activities.`;
    }
    if (text.includes('excited') && text.includes('concert')) {
      return `${inputText} The venue is amazing and I've heard they put on an incredible live show.`;
    }
    if (text.includes('anxious') && text.includes('presentation')) {
      return `${inputText} But I've prepared thoroughly and practiced multiple times to build my confidence.`;
    }
    if (text.includes('restaurant') && text.includes('decent')) {
      return `${inputText} The atmosphere is cosy though, and the prices are reasonable for the portion sizes.`;
    }

    const templates = [
      'will likely continue to evolve with new innovations.',
      'represents a significant step forward in technology.',
      'brings exciting possibilities for the future.',
      'could revolutionise how we approach this domain.',
      'offers tremendous potential for improvement.',
      'demonstrates the power of modern innovation.'
    ];
    const template = templates[Math.floor(Math.random() * templates.length)];
    return `${inputText} ${template.charAt(0).toUpperCase()}${template.slice(1)}`;
  }

  function classifyText(inputText, task) {
    const text = inputText.toLowerCase();

    const makeResult = (label, confidence, tone) => ({ label, confidence, tone });

    switch (task) {
      case 'sentiment': {
        if (text.includes('love') || text.includes('amazing') || text.includes('excited')) {
          return makeResult('Positive', 0.95, 'success');
        }
        if (text.includes('terrible') || text.includes('boring') || text.includes('awful') || text.includes('hate')) {
          return makeResult('Negative', 0.92, 'warning');
        }
        return makeResult('Neutral', 0.82, 'neutral');
      }
      case 'emotion': {
        if (text.includes('love') || text.includes('amazing')) {
          return makeResult('Joy', 0.94, 'success');
        }
        if (text.includes('excited') || text.includes('concert')) {
          return makeResult('Excitement', 0.91, 'accent');
        }
        if (text.includes('terrible') || text.includes('boring')) {
          return makeResult('Anger', 0.89, 'warning');
        }
        if (text.includes('anxious') || text.includes('presentation')) {
          return makeResult('Anxiety', 0.88, 'warning');
        }
        return makeResult('Neutral', 0.78, 'neutral');
      }
      case 'topic': {
        if (text.includes('technology') || text.includes('ai') || text.includes('artificial intelligence')) {
          return makeResult('Technology', 0.93, 'info');
        }
        if (text.includes('movie') || text.includes('concert') || text.includes('show')) {
          return makeResult('Entertainment', 0.95, 'accent');
        }
        if (text.includes('company') || text.includes('earnings') || text.includes('business')) {
          return makeResult('Business', 0.9, 'success');
        }
        if (text.includes('scientists') || text.includes('treatment') || text.includes('discover')) {
          return makeResult('Science', 0.92, 'info');
        }
        if (text.includes('restaurant') || text.includes('food')) {
          return makeResult('Food & Dining', 0.89, 'accent');
        }
        if (text.includes('weather') || text.includes('walk')) {
          return makeResult('Lifestyle', 0.84, 'neutral');
        }
        return makeResult('General', 0.75, 'neutral');
      }
      default:
        return makeResult('Unknown', 0.5, 'neutral');
    }
  }

  function buildAlternatives(task, primaryLabel, primaryConfidence) {
    const remainder = Math.max(0.05, 1 - primaryConfidence);
    const randomConfidence = () => (remainder * (0.5 + Math.random() * 0.4) * 100).toFixed(1);

    if (task === 'sentiment') {
      return ['Positive', 'Negative', 'Neutral']
        .filter(label => label !== primaryLabel)
        .map(label => ({ label, percent: randomConfidence() }));
    }
    if (task === 'emotion') {
      return emotionResponses
        .filter(label => label !== primaryLabel)
        .slice(0, 3)
        .map(label => ({ label, percent: randomConfidence() }));
    }
    return topicResponses
      .filter(label => label !== primaryLabel)
      .slice(0, 3)
      .map(label => ({ label, percent: randomConfidence() }));
  }

  function updateModelIndicator(modelType) {
    if (!modelIndicator) return;
    const config = modelData[modelType];
    modelIndicator.className = config.indicatorClass;
    modelIndicator.textContent = config.name;
  }

  function updateModelTypeVisuals() {
    const modelType = getCurrentModelType();

    modelTypeRadios.forEach(radio => {
      const card = radio.closest('.question-strategy');
      if (!card) return;
      const isActive = radio.checked;
      card.classList.toggle('question-strategy-active', isActive);
      card.dataset.active = isActive ? 'true' : 'false';

      card.style.background = '';
      card.style.borderColor = '';
      card.style.boxShadow = '';

      if (isActive && card.dataset.tone === 'purple') {
        card.style.background = 'color-mix(in srgb, var(--tone-purple-strong) 32%, var(--color-card) 68%)';
        card.style.borderColor = 'color-mix(in srgb, var(--tone-purple-strong) 75%, var(--color-border) 25%)';
        card.style.boxShadow = '0 18px 38px -24px color-mix(in srgb, var(--tone-purple-strong) 60%, transparent)';
      }
    });

    if (discriminativeTasks) {
      if (modelType === 'discriminative') {
        discriminativeTasks.classList.remove('hidden');
      } else {
        discriminativeTasks.classList.add('hidden');
      }
    }

    updateModelIndicator(modelType);
  }

  function updateTaskVisuals() {
    if (!taskButtons.length) return;
    const activeTask = getCurrentTask();

    taskButtons.forEach(button => {
      const isActive = button.dataset.task === activeTask;
      button.classList.toggle('toggle-active', isActive);
      button.classList.toggle('toggle-inactive', !isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function renderGenerativeResults(text) {
    const generated = generateText(text);
    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-3';

    const inputCard = document.createElement('div');
    inputCard.className = 'panel panel-neutral p-3 space-y-2';
    inputCard.innerHTML = `
      <div class="text-sm font-medium text-heading">📝 Input text</div>
      <p class="text-sm text-body">${text}</p>
    `;
    wrapper.appendChild(inputCard);

    const outputCard = document.createElement('div');
    outputCard.className = 'panel panel-success p-3 space-y-2';
    outputCard.innerHTML = `
      <div class="text-sm font-medium text-heading">🎨 Generated continuation</div>
      <p class="text-sm text-body">${generated}</p>
    `;
    wrapper.appendChild(outputCard);

    const statsCard = document.createElement('div');
    statsCard.className = 'grid grid-cols-1 md:grid-cols-3 gap-3';
    const inputTokens = text.split(/\s+/).filter(Boolean).length;
    const totalTokens = generated.split(/\s+/).filter(Boolean).length;
    const generatedTokens = Math.max(0, totalTokens - inputTokens);
    const statItems = [
      { label: 'Input tokens', value: inputTokens },
      { label: 'Total tokens', value: totalTokens },
      { label: 'Generated', value: generatedTokens }
    ];

    statItems.forEach(({ label, value }) => {
      const stat = document.createElement('div');
      stat.className = 'panel panel-neutral p-3 text-center space-y-1';
      stat.innerHTML = `
        <div class="text-lg font-semibold text-heading">${value}</div>
        <div class="text-xs text-muted uppercase tracking-wide">${label}</div>
      `;
      statsCard.appendChild(stat);
    });

    wrapper.appendChild(statsCard);
    return wrapper;
  }

  function renderDiscriminativeResults(text, task) {
    const classification = classifyText(text, task);
    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-3';

    const inputCard = document.createElement('div');
    inputCard.className = 'panel panel-neutral p-3 space-y-2';
    inputCard.innerHTML = `
      <div class="text-sm font-medium text-heading">📝 Input text</div>
      <p class="text-sm text-body">${text}</p>
    `;
    wrapper.appendChild(inputCard);

    const resultCard = document.createElement('div');
    resultCard.className = 'panel panel-accent p-3 space-y-2';
    const chipClass = toneToChipClass[classification.tone] || toneToChipClass.neutral;
    resultCard.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="text-sm font-medium text-heading">🎯 ${taskCopy[task] || 'Classification'} result</div>
        <span class="${chipClass}">${classification.label}</span>
      </div>
      <p class="text-sm text-body">The model predicts <strong>${classification.label}</strong> with ${(classification.confidence * 100).toFixed(1)}% confidence.</p>
    `;
    wrapper.appendChild(resultCard);

    const alternatives = buildAlternatives(task, classification.label, classification.confidence);
    const alternativesCard = document.createElement('div');
    alternativesCard.className = 'panel panel-neutral p-3 space-y-2';
    alternativesCard.innerHTML = `
      <div class="text-sm font-medium text-heading">🔄 Alternative predictions</div>
      <div class="space-y-1">
        ${alternatives.map(item => `
          <div class="flex items-center justify-between text-xs text-body border border-subtle rounded px-2 py-1 bg-subtle">
            <span>${item.label}</span>
            <span>${item.percent}%</span>
          </div>
        `).join('')}
      </div>
    `;
    wrapper.appendChild(alternativesCard);

    return wrapper;
  }

  function updateLegend(modelType, task) {
    if (!legend) return;

    const description = modelData[modelType]?.description || '';

    if (modelType === 'generative') {
      legend.innerHTML = `
        <div class="panel panel-neutral p-3 space-y-2">
          <div class="font-semibold text-heading text-sm">How to read this</div>
          ${description ? `<p class="text-xs text-body">${description}</p>` : ''}
          <ul class="list-disc ml-4 text-xs text-body space-y-1">
            <li>Samples the next token from the joint distribution P(X, Y).</li>
            <li>Needs broad, diverse data and large compute budgets.</li>
            <li>Best for writing, translating, or summarising new content.</li>
          </ul>
        </div>
      `;
      return;
    }

    const taskDetails = {
      sentiment: 'Scores the tone of the text on a positive vs. negative scale.',
      emotion: 'Maps the text to common emotions such as joy, anger, or fear.',
      topic: 'Assigns the text to a coarse topic bucket (technology, business, etc.).'
    };

    legend.innerHTML = `
      <div class="panel panel-neutral p-3 space-y-2">
        <div class="font-semibold text-heading text-sm">How to read this</div>
        ${description ? `<p class="text-xs text-body">${description}</p>` : ''}
        <ul class="list-disc ml-4 text-xs text-body space-y-1">
          <li>Examines features of the input to predict ${taskCopy[task] || 'the label'}.</li>
          <li>${taskDetails[task] || 'Uses labelled examples to learn decision boundaries.'}</li>
          <li>Confidence reflects how strongly the model favours the predicted label.</li>
        </ul>
      </div>
    `;
  }

  function updateExplanation(modelType, task) {
    if (!explanation) return;

    if (modelType === 'generative') {
      explanation.innerHTML = `
        <p><strong>Generative models</strong> learn the joint probability P(X, Y) so they can sample new text token by token.</p>
        <ul class="list-disc ml-4 space-y-1">
          <li><strong>How it works:</strong> Predicts the next token given everything seen so far.</li>
          <li><strong>Training:</strong> Massive text corpora teach it grammar, facts, and style.</li>
          <li><strong>Strength:</strong> Creates coherent continuations, translations, or summaries.</li>
          <li><strong>Examples:</strong> GPT-4.1, Claude 3.7, Gemini 2.5, Llama 3.1, Mixtral.</li>
        </ul>
      `;
      return;
    }

    explanation.innerHTML = `
      <p><strong>Discriminative models</strong> learn the conditional probability P(Y | X) so they can classify existing text.</p>
      <ul class="list-disc ml-4 space-y-1">
        <li><strong>How it works:</strong> Learns decision boundaries that separate classes.</li>
        <li><strong>Training:</strong> Needs labelled examples for each category.</li>
        <li><strong>Strength:</strong> High accuracy on analysis tasks with clear labels.</li>
        <li><strong>Current task:</strong> ${taskCopy[task] || 'Classification'} - determining the ${task} of the input.</li>
        <li><strong>Examples:</strong> BERT, RoBERTa, DistilBERT, ELECTRA.</li>
      </ul>
    `;
  }

  function processAndDisplay() {
    const text = textSelect.value.trim();
    const modelType = getCurrentModelType();
    const task = getCurrentTask();

    output.innerHTML = '';
    if (legend) legend.innerHTML = '';

    updateModelTypeVisuals();
    updateTaskVisuals();
    updateLegend(modelType, task);
    updateExplanation(modelType, task);

    if (!text) {
      const placeholder = document.createElement('div');
      placeholder.className = 'panel panel-neutral p-4 text-center text-muted';
      placeholder.textContent = 'Select text to see how the model processes it.';
      output.appendChild(placeholder);
      return;
    }

    const results = modelType === 'generative'
      ? renderGenerativeResults(text)
      : renderDiscriminativeResults(text, task);

    output.appendChild(results);
  }

  textSelect.addEventListener('change', processAndDisplay);

  modelTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value !== 'discriminative') {
        currentTask = 'sentiment';
      }
      processAndDisplay();
    });
  });

  taskButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentTask = button.dataset.task || 'sentiment';
      processAndDisplay();
    });
  });

  const examples = [
    {
      value: 'This movie was terrible and completely boring.',
      modelType: 'discriminative',
      task: 'sentiment',
      note: 'Perfect for sentiment analysis - clear negative tone.'
    },
    {
      value: 'Breaking news: Technology companies report',
      modelType: 'generative',
      task: 'sentiment',
      note: 'Great for text generation - incomplete sentence to continue.'
    },
    {
      value: "I'm so excited about this upcoming concert!",
      modelType: 'discriminative',
      task: 'emotion',
      note: 'Shows strong positive emotion - useful for emotion classification.'
    },
    {
      value: 'Artificial intelligence will transform',
      modelType: 'generative',
      task: 'topic',
      note: 'AI topic starter - ideal for generative continuation.'
    },
    {
      value: 'Scientists discover new treatment for',
      modelType: 'generative',
      task: 'topic',
      note: 'Science headline starter - excellent for continuation.'
    }
  ];

  let exampleIndex = 0;
  if (exampleBtn) {
    exampleBtn.addEventListener('click', () => {
      const example = examples[exampleIndex % examples.length];
      exampleIndex += 1;

      textSelect.value = example.value;

      const targetRadio = document.querySelector(`input[name="q19-model-type"][value="${example.modelType}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
      }

      currentTask = example.task;

      const nextExample = examples[exampleIndex % examples.length];
      const shortText = nextExample.value.length > 30
        ? `${nextExample.value.slice(0, 30)}...`
        : nextExample.value;
      exampleBtn.textContent = `Try: "${shortText}"`;
      exampleBtn.title = nextExample.note;

      processAndDisplay();
    });
  }

  processAndDisplay();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question19Interactive = interactiveScript;
}
