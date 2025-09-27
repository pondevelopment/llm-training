const interactiveScript = () => {
  const taskEl = document.getElementById('q41-task');
  const textEl = document.getElementById('q41-text');
  const modeEl = document.getElementById('q41-mode');
  const tempEl = document.getElementById('q41-temp');
  const tempVal = document.getElementById('q41-temp-val');
  const promptEl = document.getElementById('q41-prompt');
  const scoresEl = document.getElementById('q41-scores');
  const outputEl = document.getElementById('q41-output');
  const explainEl = document.getElementById('q41-explain');
  if (!taskEl || !textEl || !modeEl || !tempEl || !promptEl || !scoresEl || !outputEl || !explainEl) return;

  let latestProbabilities = [];
  let latestLabels = [];

  const TASKS = {
    sentiment: {
      labels: ['Positive', 'Negative', 'Neutral'],
      words: {
        Positive: ['great', 'love', 'excellent', 'good', 'amazing', 'wonderful', 'fantastic', 'happy'],
        Negative: ['bad', 'terrible', 'awful', 'hate', 'poor', 'broken', 'sad', 'worst'],
        Neutral: ['okay', 'average', 'fine', 'neutral', 'ordinary', 'typical']
      },
      examples: [
        { x: 'I absolutely love this phone, the battery is amazing.', y: 'Positive' },
        { x: 'Worst service I have ever experienced.', y: 'Negative' },
        { x: 'Delivery time was okay and the packaging was fine.', y: 'Neutral' }
      ],
      candidates: [
        'The app is fantastic, I love the new UI.',
        'The product arrived broken and support was awful.',
        'It works okay for daily tasks.',
        'Amazing camera, but the battery is bad.'
      ],
      template(labels, text, mode) {
        if (mode === 'few') {
          return `You are a helpful classifier. Here are examples.\n\nExample 1:\nText: I absolutely love this phone, the battery is amazing.\nLabel: Positive\n\nExample 2:\nText: Worst service I have ever experienced.\nLabel: Negative\n\nNow classify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;
        }
        const instruction = mode === 'zero-inst' ? 'Classify the sentiment. Reply with exactly one of:' : 'Label:';
        return `${instruction} ${labels.join(', ')}.\nText: ${text}`;
      }
    },
    topic: {
      labels: ['Tech', 'Sports', 'Finance'],
      words: {
        Tech: ['software', 'ai', 'computer', 'chip', 'cloud', 'android', 'ios', 'gpu', 'model', 'data'],
        Sports: ['match', 'goal', 'team', 'league', 'coach', 'tournament', 'score', 'player'],
        Finance: ['market', 'stocks', 'bank', 'bond', 'revenue', 'profits', 'inflation', 'rate']
      },
      examples: [
        { x: 'The team scored a late goal to win the match.', y: 'Sports' },
        { x: 'New AI chip boosts model training speed.', y: 'Tech' },
        { x: 'The bank reported higher quarterly revenue.', y: 'Finance' }
      ],
      candidates: [
        'Cloud providers cut GPU prices for AI workloads.',
        'The player broke the league scoring record.',
        'Stocks rallied after the central bank decision.'
      ],
      template(labels, text, mode) {
        if (mode === 'few') {
          return `You are a topic classifier. Examples:\nText: The team scored a late goal to win the match.\nLabel: Sports\n\nText: New AI chip boosts model training speed.\nLabel: Tech\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;
        }
        return `Classify the topic as one of: ${labels.join(', ')}.\nText: ${text}`;
      }
    },
    spam: {
      labels: ['Spam', 'Not Spam'],
      words: {
        Spam: ['free', 'winner', 'credit', 'loan', 'click', 'offer', 'gift', 'prize', 'limited'],
        'Not Spam': ['meeting', 'project', 'schedule', 'report', 'update', 'invoice', 'agenda']
      },
      examples: [
        { x: 'Click now to claim your free gift prize!', y: 'Spam' },
        { x: 'Please review the project schedule update.', y: 'Not Spam' }
      ],
      candidates: [
        'Limited offer: winner gets a free credit bonus!',
        'Attached is the meeting agenda for tomorrow.'
      ],
      template(labels, text, mode) {
        if (mode === 'few') {
          return `Decide if the message is spam. Examples:\nText: Click now to claim your free gift prize!\nLabel: Spam\n\nText: Please review the project schedule update.\nLabel: Not Spam\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;
        }
        return `Is this Spam or Not Spam? Reply with one label.\nText: ${text}`;
      }
    }
  };

  function softmax(values, temperature) {
    const maxVal = Math.max(...values);
    const ex = values.map((v) => Math.exp((v - maxVal) / temperature));
    const sum = ex.reduce((acc, v) => acc + v, 0);
    return ex.map((v) => v / sum);
  }

  function bar(label, probability, tone, metaParts) {
    const pct = Math.round(probability * 100);
    const metaText = metaParts.filter(Boolean).join(' • ');
    const metaHtml = metaText ? `<div class="small-caption panel-muted">${metaText}</div>` : '';
    return `
      <div class="q41-score" data-tone="${tone}">
        <div class="q41-score-head"><span>${label}</span><span>${pct}%</span></div>
        <div class="q41-score-track" role="progressbar" aria-label="${label} probability" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="q41-score-fill" style="width:${pct}%"></div>
        </div>
        ${metaHtml}
      </div>
    `;
  }

  function score(text, labels, words) {
    const lower = text.toLowerCase();
    return labels.map((label) => (words[label] || []).reduce((acc, token) => acc + (lower.includes(token) ? 1 : 0), 0));
  }

  function sim(a, b) {
    const tokensA = new Set(a.toLowerCase().split(/[^a-z]+/).filter(Boolean));
    const tokensB = new Set(b.toLowerCase().split(/[^a-z]+/).filter(Boolean));
    const intersection = [...tokensA].filter((token) => tokensB.has(token)).length;
    const union = new Set([...tokensA, ...tokensB]).size || 1;
    return intersection / union;
  }

  function fewBoost(scores, text, labels, examples) {
    const alpha = 1.2;
    const boosts = labels.map((label) => {
      const sims = examples.filter((example) => example.y === label).map((example) => sim(text, example.x));
      const avg = sims.length ? sims.reduce((acc, val) => acc + val, 0) / sims.length : 0;
      return alpha * avg;
    });
    return scores.map((value, index) => value + boosts[index]);
  }

  function instrBias(scores) {
    const idx = scores.indexOf(Math.max(...scores));
    return {
      adjusted: scores.map((value, i) => (i === idx ? value + 0.4 : value)),
      idx,
      bias: 0.4
    };
  }

  function runStabilitySample() {
    const simOut = document.getElementById('q41-sim-out');
    if (!simOut || !latestProbabilities.length || !latestLabels.length) return;
    const draws = 20;
    const counts = latestLabels.map(() => 0);
    for (let i = 0; i < draws; i += 1) {
      const r = Math.random();
      let acc = 0;
      for (let j = 0; j < latestProbabilities.length; j += 1) {
        acc += latestProbabilities[j];
        if (r <= acc) {
          counts[j] += 1;
          break;
        }
      }
    }
    const rows = counts.map((count, idx) => `${latestLabels[idx]}:${count}`).join(' | ');
    const winner = latestLabels[counts.indexOf(Math.max(...counts))];
    simOut.innerHTML = `<div class="font-mono">${rows}</div><div class="small-caption panel-muted">Most frequent: <strong>${winner}</strong></div>`;
    simOut.classList.remove('hidden');
  }

  function fillExamples(task) {
    textEl.innerHTML = '';
    task.candidates.forEach((candidate, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = candidate;
      textEl.appendChild(option);
    });
    textEl.value = '0';
  }

  function render() {
    const temperature = parseFloat(tempEl.value);
    tempVal.textContent = temperature.toFixed(1);

    const task = TASKS[taskEl.value];
    if (!textEl.options.length) fillExamples(task);

    const text = task.candidates[parseInt(textEl.value || '0', 10)] || task.candidates[0];
    const labels = task.labels;
    const mode = modeEl.value;

    const prompt = task.template(labels, text, mode);
    promptEl.textContent = prompt;

    const raw = score(text, labels, task.words);
    let working = [...raw];
    let biasInfo = null;
    let boosts = null;

    if (mode === 'zero-inst') {
      biasInfo = instrBias(working);
      working = biasInfo.adjusted;
    }

    if (mode === 'few') {
      const before = [...working];
      working = fewBoost(working, text, labels, task.examples);
      boosts = working.map((value, index) => value - before[index]);
    }

    const probabilities = softmax(working, temperature);
    latestProbabilities = probabilities.slice();
    latestLabels = labels.slice();
    const entropy = -probabilities.reduce((acc, p) => acc + (p > 0 ? p * Math.log2(p) : 0), 0);

    const tones = ['indigo', 'purple', 'sky'];
    scoresEl.innerHTML = probabilities
      .map((probability, index) => {
        const tone = tones[index % tones.length];
        const meta = [`raw:${raw[index]}`];
        if (biasInfo && biasInfo.idx === index) meta.push(`+bias:${biasInfo.bias}`);
        if (boosts) meta.push(`+fs:${boosts[index].toFixed(2)}`);
        return bar(labels[index], probability, tone, meta);
      })
      .join('') + `<div class="small-caption panel-muted mt-2">Entropy H=${entropy.toFixed(2)}</div>`;

    const topIndex = probabilities.indexOf(Math.max(...probabilities));
    outputEl.innerHTML = `<div>Predicted label: <strong>${labels[topIndex]}</strong></div>`;

    let modeExplanation;
    if (mode === 'zero') {
      modeExplanation = 'Zero-shot uses only raw label word matches.';
    } else if (mode === 'zero-inst') {
      modeExplanation = `Instruction adds bias (+${biasInfo?.bias ?? 0}).`;
    } else {
      modeExplanation = 'Few-shot adds similarity boosts (+fs).';
    }

    explainEl.innerHTML = `${modeExplanation} Temperature <span class="font-mono">${temperature.toFixed(1)}</span> controls sharpness; entropy summarises uncertainty.`;
    tempEl.setAttribute('aria-valuenow', temperature.toFixed(1));

    const simBtn = document.getElementById('q41-sim');
    const simOut = document.getElementById('q41-sim-out');
    if (simOut) {
      simOut.classList.add('hidden');
      simOut.innerHTML = '';
    }
    if (simBtn && !simBtn.dataset.bound) {
      simBtn.dataset.bound = '1';
      simBtn.addEventListener('click', () => {
        runStabilitySample();
      });
    }
  }

  [taskEl, textEl, modeEl, tempEl].forEach((el) => {
    el.addEventListener('input', render);
    el.addEventListener('change', () => {
      if (el === taskEl) {
        fillExamples(TASKS[taskEl.value]);
      }
      render();
    });
  });

  fillExamples(TASKS[taskEl.value]);
  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question41Interactive = interactiveScript;
}
