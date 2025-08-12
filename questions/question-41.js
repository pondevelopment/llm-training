// Question 41: What is zero-shot learning, and how do LLMs implement it?
// Created: August 12, 2025
// Interactive focus: Compare Zero-shot vs Zero-shot+Instruction vs Few-shot (2-shot)

const question = {
  title: "41. What is zero-shot learning, and how do LLMs implement it?",
  answer: `
    <div class="space-y-6">
      <!-- Main Concept -->
      <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Key Idea</h4>
        <p class="text-sm text-blue-800">Zero-shot learning lets an LLM perform a task <b>without task-specific examples</b>, by relying on its pretrained knowledge and a well-phrased <b>natural-language prompt</b>. The prompt defines the task and label space (via a <i>verbalizer</i> such as “positive/negative”).</p>
        <div class="text-xs mt-2 text-blue-800">
          Formal view: the prompt acts as conditioning. We choose a label by maximizing the conditional likelihood:
          <div class="math-display mt-2">$$\\hat y = \\arg\\max_y\\; P(y \\mid x, p), \\quad P(y \\mid x, p) = \\text{softmax}\\!\\left( \\frac{s_y(x,p)}{T} \\right)$$</div>
        </div>
      </div>

      <!-- Comparison Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h5 class="font-semibold text-green-900">🟢 Zero-shot</h5>
          <ul class="text-sm text-green-800 mt-2 space-y-1">
            <li>• No examples in the prompt</li>
            <li>• Uses label words (verbalizer)</li>
            <li>• Fast, but brittle if task is ambiguous</li>
          </ul>
        </div>
        <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h5 class="font-semibold text-purple-900">🟣 Zero-shot + Instruction</h5>
          <ul class="text-sm text-purple-800 mt-2 space-y-1">
            <li>• Clear instruction and constraints</li>
            <li>• Better calibration of labels</li>
          </ul>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h5 class="font-semibold text-orange-900">🟠 Few-shot (k-shot)</h5>
          <ul class="text-sm text-orange-800 mt-2 space-y-1">
            <li>• Adds k labeled examples</li>
            <li>• Helps pattern induction and reduces ambiguity</li>
          </ul>
        </div>
      </div>

      <!-- Why This Matters -->
      <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
        <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
        <ul class="text-sm text-yellow-800 space-y-1">
          <li>• Deploy tasks <b>without training</b></li>
          <li>• Rapid iteration via prompt design</li>
          <li>• Few-shot gives quick accuracy boosts when labels are subtle</li>
          <li>• Great for prototyping classifiers and routing policies</li>
        </ul>
      </div>
    </div>
  `,
  interactive: {
    title: "🧪 Zero-shot vs Few-shot Prompting Playground",
    html: `
      <div class=\"space-y-6\">
        <div class=\"bg-gradient-to-r from-indigo-50 to-sky-50 p-4 rounded-lg border border-indigo-200\">
          <div class=\"grid md:grid-cols-4 gap-4 text-xs\">
            <div>
              <label class=\"font-semibold text-gray-700\">Task</label>
              <select id=\"q41-task\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"sentiment\" selected>Sentiment (pos/neg/neutral)</option>
                <option value=\"topic\">Topic (tech/sports/finance)</option>
                <option value=\"spam\">Spam detection</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Example text</label>
              <select id=\"q41-text\" class=\"w-full border rounded p-1 text-xs\"></select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Mode</label>
              <select id=\"q41-mode\" class=\"w-full border rounded p-1 text-xs\">
                <option value=\"zero\" selected>Zero-shot</option>
                <option value=\"zero-inst\">Zero-shot + Instruction</option>
                <option value=\"few\">Few-shot (k=2)</option>
              </select>
            </div>
            <div>
              <label class=\"font-semibold text-gray-700\">Temperature</label>
              <input id=\"q41-temp\" type=\"range\" min=\"0.1\" max=\"1.5\" step=\"0.1\" value=\"0.7\" class=\"w-full\" />
              <div class=\"text-center mt-1\"><span id=\"q41-temp-val\" class=\"font-mono\">0.7</span></div>
            </div>
          </div>
          <p class=\"text-[11px] text-gray-600 mt-2\">Toy simulator: scores use label-word matches; instruction adds a bias; few-shot adds similarity to labeled examples.</p>
        </div>

        <div class=\"grid md:grid-cols-3 gap-4\">
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🧾 Prompt Preview</h5>
            <pre id=\"q41-prompt\" class=\"text-xs bg-gray-50 border rounded p-2 overflow-x-auto\"></pre>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">📊 Model Scores</h5>
            <div id=\"q41-scores\" class=\"text-xs text-gray-700 space-y-2\"></div>
          </div>
          <div class=\"bg-white border rounded-lg p-4\">
            <h5 class=\"font-semibold text-gray-800 mb-2\">🗣️ Output</h5>
            <div id=\"q41-output\" class=\"text-sm text-gray-800 space-y-2\"></div>
          </div>
        </div>

        <div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-4\">
          <h5 class=\"font-semibold text-emerald-900 mb-1\">🔎 Explanation</h5>
          <div id=\"q41-explain\" class=\"text-xs text-emerald-800\"></div>
        </div>
      </div>
    `,
    script: () => {
      const taskEl = document.getElementById('q41-task');
      const textEl = document.getElementById('q41-text');
      const modeEl = document.getElementById('q41-mode');
      const tempEl = document.getElementById('q41-temp');
      const tempVal = document.getElementById('q41-temp-val');
      const promptEl = document.getElementById('q41-prompt');
      const scoresEl = document.getElementById('q41-scores');
      const outputEl = document.getElementById('q41-output');
      const explainEl = document.getElementById('q41-explain');
      if (!taskEl) return;

      const TASKS = {
        sentiment: {
          labels: ['Positive','Negative','Neutral'],
          words: {
            Positive: ['great','love','excellent','good','amazing','wonderful','fantastic','happy'],
            Negative: ['bad','terrible','awful','hate','poor','broken','sad','worst'],
            Neutral:  ['okay','average','fine','neutral','ordinary','typical']
          },
          examples: [
            {x: 'I absolutely love this phone, the battery is amazing.', y: 'Positive'},
            {x: 'Worst service I have ever experienced.', y: 'Negative'},
            {x: 'Delivery time was okay and the packaging was fine.', y: 'Neutral'}
          ],
          candidates: [
            'The app is fantastic, I love the new UI.',
            'The product arrived broken and support was awful.',
            'It works okay for daily tasks.',
            'Amazing camera, but the battery is bad.'
          ],
          template(labels, text, mode){
            const instr = mode==='zero-inst' ? 'Classify the sentiment. Reply with exactly one of: ' : 'Label:';
            const lab = labels.join(', ');
            if (mode==='few') {
              return `You are a helpful classifier. Here are examples.\n\nExample 1:\nText: I absolutely love this phone, the battery is amazing.\nLabel: Positive\n\nExample 2:\nText: Worst service I have ever experienced.\nLabel: Negative\n\nNow classify:\nText: ${text}\nLabels: ${lab}\nInstruction: Reply with exactly one label.`;
            }
            return `${instr} ${lab}.\nText: ${text}`;
          }
        },
        topic: {
          labels: ['Tech','Sports','Finance'],
          words: {
            Tech: ['software','ai','computer','chip','cloud','android','ios','gpu','model','data'],
            Sports: ['match','goal','team','league','coach','tournament','score','player'],
            Finance: ['market','stocks','bank','bond','revenue','profits','inflation','rate']
          },
          examples: [
            {x: 'The team scored a late goal to win the match.', y: 'Sports'},
            {x: 'New AI chip boosts model training speed.', y: 'Tech'},
            {x: 'The bank reported higher quarterly revenue.', y: 'Finance'}
          ],
          candidates: [
            'Cloud providers cut GPU prices for AI workloads.',
            'The player broke the league scoring record.',
            'Stocks rallied after the central bank decision.'
          ],
          template(labels, text, mode){
            if (mode==='few') {
              return `You are a topic classifier. Examples:\nText: The team scored a late goal to win the match.\nLabel: Sports\n\nText: New AI chip boosts model training speed.\nLabel: Tech\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;
            }
            return `Classify the topic as one of: ${labels.join(', ')}.\nText: ${text}`;
          }
        },
        spam: {
          labels: ['Spam','Not Spam'],
          words: {
            Spam: ['free','winner','credit','loan','click','offer','gift','prize','limited'],
            'Not Spam': ['meeting','project','schedule','report','update','invoice','agenda']
          },
          examples: [
            {x: 'Click now to claim your free gift prize!', y: 'Spam'},
            {x: 'Please review the project schedule update.', y: 'Not Spam'}
          ],
          candidates: [
            'Limited offer: winner gets a free credit bonus!',
            'Attached is the meeting agenda for tomorrow.'
          ],
          template(labels, text, mode){
            if (mode==='few') {
              return `Decide if the message is spam. Examples:\nText: Click now to claim your free gift prize!\nLabel: Spam\n\nText: Please review the project schedule update.\nLabel: Not Spam\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;
            }
            return `Is this Spam or Not Spam? Reply with one label.\nText: ${text}`;
          }
        }
      };

      function softmax(arr, T){
        const m = Math.max(...arr);
        const exps = arr.map(v => Math.exp((v - m) / T));
        const sum = exps.reduce((a,b)=>a+b,0);
        return exps.map(v=>v/sum);
      }

      function scoreZeroShot(text, labels, words){
        const txt = text.toLowerCase();
        return labels.map(l => (words[l]||[]).reduce((acc,w)=> acc + (txt.includes(w)?1:0), 0));
      }

      function similarity(a,b){
        const A = new Set(a.toLowerCase().split(/[^a-z]+/).filter(Boolean));
        const B = new Set(b.toLowerCase().split(/[^a-z]+/).filter(Boolean));
        const inter = [...A].filter(x=>B.has(x)).length;
        const uni = new Set([...A,...B]).size || 1;
        return inter/uni;
      }

      function addFewShot(scores, text, labels, examples){
        const alpha = 1.2; // boost from few-shot similarity
        const boosts = labels.map(l => {
          const sims = examples.filter(e=>e.y===l).map(e=> similarity(text, e.x));
          const avg = sims.length? sims.reduce((a,b)=>a+b,0)/sims.length : 0;
          return alpha * avg;
        });
        return scores.map((s,i)=> s + boosts[i]);
      }

      function instructionBias(scores){
        // Add a small margin between best and others to simulate clearer instruction
        const maxIdx = scores.indexOf(Math.max(...scores));
        return scores.map((s,i)=> i===maxIdx? s+0.4 : s);
      }

      function renderExamples(task){
        textEl.innerHTML = '';
        task.candidates.forEach((c, idx)=>{
          const opt = document.createElement('option');
          opt.value = String(idx);
          opt.textContent = c;
          textEl.appendChild(opt);
        });
        textEl.value = '0';
      }

      function render(){
        tempVal.textContent = parseFloat(tempEl.value).toFixed(1);
        const task = TASKS[taskEl.value];
        if (!textEl.options.length) renderExamples(task);
        const text = task.candidates[parseInt(textEl.value||'0',10)] || task.candidates[0];
        const labels = task.labels;
        const words = task.words;
        const mode = modeEl.value;
        const T = parseFloat(tempEl.value);

        // Build prompt preview
        const prompt = task.template(labels, text, mode);
        promptEl.textContent = prompt;

        // Scoring
        let scores = scoreZeroShot(text, labels, words);
        if (mode==='zero-inst') scores = instructionBias(scores);
        if (mode==='few') scores = addFewShot(scores, text, labels, task.examples);
        const probs = softmax(scores, T);

        // Scores panel
        const bars = probs.map((p,i)=>{
          const color = i===0? 'indigo' : (i===1? 'violet' : 'sky');
          const pct = Math.round(p*100);
          return `<div>
            <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${labels[i]}</span><span>${pct}%</span></div>
            <div class=\"w-full h-3 bg-${color}-200 rounded\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\"></div></div>
          </div>`;
        }).join('');
        scoresEl.innerHTML = bars;

        // Output
        const topIdx = probs.indexOf(Math.max(...probs));
        outputEl.innerHTML = `<div>Predicted label: <b>${labels[topIdx]}</b></div>`;

        // Explanation
        explainEl.innerHTML = `The zero-shot score counts matches to <i>label words</i>. Clear instructions slightly increase separation between labels. Few-shot adds similarity to examples, often improving calibration. We then compute probabilities with softmax at temperature <span class=\"font-mono\">${T.toFixed(1)}</span>.`;

        if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
      }

      [taskEl, textEl, modeEl, tempEl].forEach(el=>{ el.addEventListener('input', render); el.addEventListener('change', ()=>{ if(el===taskEl){ renderExamples(TASKS[taskEl.value]); } render(); }); });
      renderExamples(TASKS[taskEl.value]);
      render();
    }
  }
};

// Export pattern
if (typeof module !== 'undefined') { module.exports = question; }
