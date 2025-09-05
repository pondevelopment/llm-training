// Question 38: What is Chain-of-Thought (CoT) prompting, and how does it aid reasoning?
// Created: August 12, 2025
// Educational Focus: Step-by-step reasoning, self-consistency, accuracy vs. cost trade-offs

const question = {
  title: "38. What is Chain-of-Thought (CoT) prompting, and how does it aid reasoning?",
  answer: `<div class="space-y-6">
    <!-- Recommended Reading -->
    <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
      <ul class="text-xs text-indigo-800 list-disc ml-5 space-y-1">
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-12">Question 12: Prompt engineering basics</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-31">Question 31: Temperature & sampling</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-36">Question 36: Retrieval-Augmented Generation</a></li>
        <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-37">Question 37: Mixture of Experts</a></li>
      </ul>
    </div>
    <!-- Core Concept -->
  <div class="bg-blue-50 p-4 rounded-xl border border-blue-200">
      <h4 class="font-semibold text-blue-900 mb-2">🧩 Key Idea</h4>
      <p class="text-sm text-blue-800">Chain‑of‑Thought (CoT) prompting asks the model to <b>show intermediate steps</b> rather than jumping straight to the final answer. This structured reasoning improves results on multi‑step tasks (math word problems, logic, program synthesis).</p>
  <div id="q38-key-math" class="text-xs bg-white border border-blue-100 p-3 rounded font-mono text-center mt-3 tex2jax_process">
          \[ \begin{aligned}
            t &= \lceil m/2 \rceil \\
            P_{\mathrm{SC}} &= \sum_{k=t}^{m} \binom{m}{k} \, p^{k} (1-p)^{m-k}
          \end{aligned} \]
        </div>
      <p class="text-xs text-blue-800 mt-2">Here \(p\) is the probability a single CoT sample is correct. Sampling multiple CoT chains at higher temperature and <i>voting</i> often boosts accuracy.</p>
    </div>

    <!-- Strategy Comparison Cards -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <h5 class="font-semibold text-green-900 mb-1">Direct Answer</h5>
        <p class="text-xs text-green-800">Model outputs an answer immediately. <b>Lowest cost</b>, but can fail on multi‑step logic.</p>
  <div class="text-xs bg-white border p-2 mt-2 rounded overflow-x-auto whitespace-nowrap">$$ y = f(\text{prompt}) $$</div>
  <ul class="mt-2 text-xs text-green-900 space-y-0.5">
          <li>• Fast, cheap</li>
          <li>• No transparency</li>
        </ul>
      </div>
      <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h5 class="font-semibold text-purple-900 mb-1">Single CoT</h5>
        <p class="text-xs text-purple-800">Ask the model to “think step by step.” Increases accuracy by decomposing reasoning.</p>
  <div class="text-xs bg-white border p-2 mt-2 rounded overflow-x-auto whitespace-nowrap">$$ y = g(s_1, s_2, \dots, s_T) $$</div>
  <ul class="mt-2 text-xs text-purple-900 space-y-0.5">
          <li>• Better reasoning</li>
          <li>• More tokens</li>
        </ul>
      </div>
      <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h5 class="font-semibold text-orange-900 mb-1">Self‑Consistency</h5>
        <p class="text-xs text-orange-800">Sample multiple diverse CoT chains and <b>vote</b> on the final answer. Robust to a bad chain.</p>
        <!-- Escaped LaTeX for MathJax inside JS template string -->
    <div class="text-xs bg-white border p-2 mt-2 rounded overflow-x-auto whitespace-nowrap">$$ P_{\mathrm{SC}} = \\sum_{k=t}^{m} \\binom{m}{k} p^{k} (1-p)^{m-k} $$</div>
  <ul class="mt-2 text-xs text-orange-900 space-y-0.5">
          <li>• Higher accuracy</li>
          <li>• Higher cost</li>
        </ul>
      </div>
    </div>

    <!-- Why it matters -->
  <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
      <h4 class="font-semibold text-yellow-900 mb-2">🎯 Why This Matters</h4>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>• <b>Decomposes</b> complex problems into smaller steps.</li>
        <li>• <b>Improves reliability</b> on math/logic tasks vs. direct answers.</li>
        <li>• <b>Self‑consistency</b> boosts accuracy by sampling diverse chains and voting.</li>
        <li>• <b>Trade‑off:</b> CoT uses more tokens (cost/latency) for better accuracy.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
  title: "🧪 CoT Reasoning Playground (Direct vs CoT vs Self‑Consistency)",
  html: `<div class=\"space-y-6\">\n      <div class=\"bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200\">\n        <div class=\"grid md:grid-cols-4 gap-4 text-xs\">\n          <div>\n            <label class=\"font-semibold text-gray-700\" for=\"q38-problem\">Problem</label>\n            <select id=\"q38-problem\" class=\"w-full border rounded p-1 text-xs\" aria-label=\"Select problem type\">\n              <option value=\"sum\">Add numbers</option>\n              <option value=\"apples\">Word problem (apples)</option>\n              <option value=\"units\">Units conversion</option>\n            </select>\n          </div>\n          <div>\n            <label class=\"font-semibold text-gray-700\" for=\"q38-strategy\">Strategy</label>\n            <select id=\"q38-strategy\" class=\"w-full border rounded p-1 text-xs\" aria-label=\"Select reasoning strategy\">\n              <option value=\"direct\">Direct answer</option>\n              <option value=\"cot\">CoT (1 sample)</option>\n              <option value=\"sc\">CoT + Self‑Consistency</option>\n            </select>\n          </div>\n            <div>\n              <label class=\"font-semibold text-gray-700\" for=\"q38-temp\">Temperature</label>\n              <input id=\"q38-temp\" aria-label=\"Sampling temperature\" type=\"range\" min=\"0\" max=\"1\" step=\"0.05\" value=\"0.4\" class=\"w-full\" />\n              <div class=\"text-center mt-1\"><span id=\"q38-temp-val\" class=\"font-mono\">0.40</span></div>\n            </div>\n            <div>\n              <label class=\"font-semibold text-gray-700\" for=\"q38-m\">Samples (m)</label>\n              <input id=\"q38-m\" aria-label=\"Number of self-consistency samples\" type=\"range\" min=\"1\" max=\"15\" step=\"1\" value=\"5\" class=\"w-full\" />\n              <div class=\"text-center mt-1\"><span id=\"q38-m-val\" class=\"font-mono\">5</span></div>\n            </div>\n        </div>\n        <p class=\"text-[11px] text-gray-600 mt-2\">For self‑consistency, sample \\(m\\) CoT chains at moderate temperature and vote on the final answer.</p>\n      </div>\n\n      <div class=\"grid md:grid-cols-3 gap-4\">\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">📝 Problem</h5>\n          <div id=\"q38-problem-text\" class=\"text-sm text-gray-700\"></div>\n          <button id=\"q38-rand\" class=\"mt-3 text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border\" aria-label=\"Shuffle numbers for new problem instance\">Shuffle numbers</button>\n        </div>\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">📌 Metrics</h5>\n          <div id=\"q38-metrics\" class=\"text-xs space-y-2\" aria-live=\"polite\"></div>\n        </div>\n        <div class=\"bg-white border rounded-lg p-4\">\n          <h5 class=\"font-semibold text-gray-800 mb-2\">📣 Output</h5>\n          <div id=\"q38-output\" class=\"text-sm text-gray-800 space-y-2\" aria-live=\"polite\"></div>\n        </div>\n      </div>\n\n      <div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-4\">\n        <h5 class=\"font-semibold text-indigo-900 mb-1\">🔎 Explanation</h5>\n        <div id=\"q38-explain\" class=\"text-xs text-indigo-800\" aria-live=\"polite\"></div>\n      </div>\n    </div>`,
    script: () => {
      const problemEl = document.getElementById('q38-problem');
      const stratEl = document.getElementById('q38-strategy');
      const tempEl = document.getElementById('q38-temp');
      const mEl = document.getElementById('q38-m');
      const tempVal = document.getElementById('q38-temp-val');
      const mVal = document.getElementById('q38-m-val');
      const probText = document.getElementById('q38-problem-text');
      const metricsEl = document.getElementById('q38-metrics');
      const outputEl = document.getElementById('q38-output');
      const explainEl = document.getElementById('q38-explain');
      const randBtn = document.getElementById('q38-rand');
      if (!problemEl) return;

      // Small dataset with templates that support randomization
      let seed = 1; const rng = () => (seed = (seed*1664525 + 1013904223) % 4294967296) / 4294967296;
      function randInt(a,b){return a + Math.floor(rng()*(b-a+1));}

      function genProblems() {
        const a = randInt(10,99), b = randInt(10,99), c = randInt(1,9);
        const sum = a + b; const apples = sum - c; // keep it consistent so both are solvable
        return {
          sum: {
            text: `Add the numbers: ${a} + ${b}.`,
            steps: [
              `Break into tens and ones: ${a} = ${(a/10|0)}0 + ${a%10}, ${b} = ${(b/10|0)}0 + ${b%10}.`,
              `Add tens: ${(a/10|0)}0 + ${(b/10|0)}0 = ${(a/10|0)+(b/10|0)}0.`,
              `Add ones: ${a%10} + ${b%10} = ${(a%10)+(b%10)}.`,
              `Combine: ${a} + ${b} = ${sum}.`
            ],
            answer: `${sum}`,
            baseTokens: 12, stepTokens: 14
          },
          apples: {
            text: `Sam picked ${a} apples and Lee picked ${b}. They ate ${c}. How many apples are left?`,
            steps: [
              `Compute total apples: ${a} + ${b} = ${sum}.`,
              `Subtract eaten: ${sum} - ${c} = ${apples}.`,
              `Therefore, ${apples} apples remain.`
            ],
            answer: `${apples}`,
            baseTokens: 22, stepTokens: 18
          },
          units: {
            text: `Convert ${a} centimeters to meters.`,
            steps: [
              `Recall: 100 centimeters = 1 meter.`,
              `Divide by 100: ${a} / 100 = ${(a/100).toFixed(2)}.`,
              `So, ${(a/100).toFixed(2)} meters.`
            ],
            answer: `${(a/100).toFixed(2)} m`,
            baseTokens: 14, stepTokens: 12
          }
        };
      }
      let problems = genProblems();

      function binom(n,k){ if(k<0||k>n) return 0; k=Math.min(k,n-k); let num=1,den=1; for(let i=1;i<=k;i++){ num*= (n - (k - i)); den*=i; } return num/den; }

      function selfConsistencyProb(p,m){
        // Majority vote with tie handled as 0.5 credit (prevents accuracy dips at even m)
        const majority = Math.floor(m/2) + 1; // first strictly greater than half
        let sum = 0;
        for(let k=majority;k<=m;k++){
          sum += binom(m,k) * Math.pow(p,k) * Math.pow(1-p,m-k);
        }
        if (m % 2 === 0) { // add half the tie probability mass
          const tieK = m/2;
            sum += 0.5 * binom(m, tieK) * Math.pow(p, tieK) * Math.pow(1-p, tieK);
        }
        return sum;
      }

      function estimate(p0, temp, m, strategy){
        // p0: base direct answer correctness for the chosen task
        // Strategy modifiers: CoT boosts base; temperature increases diversity but can lower single‑sample accuracy
        const tempPenalty = Math.max(0.7, 1 - 0.25*(temp)); // 1.0 at 0.0 temp, ~0.75 at high temp
        const cotBoost = 0.15; // CoT single‑sample boost
        if (strategy === 'direct') {
          const factor = 1.10 - 0.20 * (temp); // stronger temp effect for direct: 1.10 → 0.90
          return { p: Math.max(0, Math.min(1, p0 * factor)) };
        }
        if (strategy === 'cot')    return { p: Math.max(0, Math.min(1, (p0 + cotBoost) * tempPenalty)) };
        // self‑consistency: single sample p1, then vote over m
        const p1 = Math.max(0, Math.min(1, (p0 + cotBoost) * tempPenalty));
        const psc = selfConsistencyProb(p1, m);
        return { p: psc, p1 };
      }

      function tokenCost(baseTokens, stepTokens, strategy, m){
        if (strategy === 'direct') return baseTokens + 10; // prompt + short answer
        if (strategy === 'cot')    return baseTokens + stepTokens*3 + 20; // steps + conclusion
        return baseTokens + (stepTokens*3 + 20) * m; // m samples
      }

  function render(){
        tempVal.textContent = parseFloat(tempEl.value).toFixed(2);
        mVal.textContent = mEl.value;
        mEl.disabled = stratEl.value !== 'sc';

        problems = problems || genProblems();
        const p = problems[problemEl.value];
        probText.textContent = p.text;

        // Base task difficulty → direct accuracy
        const baseAcc = problemEl.value === 'sum' ? 0.78 : problemEl.value === 'apples' ? 0.70 : 0.85;

        const est = estimate(baseAcc, parseFloat(tempEl.value), parseInt(mEl.value,10), stratEl.value);
        const acc = est.p;
        const tokens = tokenCost(p.baseTokens, p.stepTokens* p.steps.length, stratEl.value, parseInt(mEl.value,10));

        metricsEl.innerHTML = `
          <div><strong>Strategy:</strong> ${stratEl.options[stratEl.selectedIndex].text}</div>
          <div><strong>Estimated accuracy:</strong> ${(acc*100).toFixed(2)}%</div>
          <div><strong>Token estimate:</strong> ~${Math.round(tokens)} tokens</div>
          <div><strong>Temp:</strong> ${parseFloat(tempEl.value).toFixed(2)} ${stratEl.value==='sc'?` • <strong>Samples m:</strong> ${mEl.value}`:''}</div>
        `;

        // Output section
        const bars = (label,val,color='indigo') => {
          const pct = Math.max(0, Math.min(100, val*100));
          return `<div role=\"group\" aria-label=\"${label} ${pct.toFixed(0)} percent\">
            <div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${pct.toFixed(0)}%</span></div>
            <div class=\"w-full h-3 bg-${color}-200 rounded\" aria-hidden=\"true\"><div class=\"h-3 bg-${color}-600\" style=\"width:${pct}%\" role=\"progressbar\" aria-valuenow=\"${pct.toFixed(0)}\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"${label}\"></div></div>
          </div>`;
        };

        const explain = `
          <p>CoT reveals intermediate steps. Self‑consistency samples multiple chains and takes a majority (ties count half) to reduce variance from any single flawed chain.</p>
          <div id="q38-explain-math" class="text-center bg-white border p-2 rounded font-mono text-[12px] mt-1 overflow-x-auto whitespace-nowrap"></div>
          <div class="text-[11px] text-gray-600 mt-1">We treat chains as independent with single‑chain correctness <span class="font-mono">p</span>. For even <span class="font-mono">m</span>, a tie contributes half its probability mass so accuracy is non‑decreasing as <span class="font-mono">m</span> grows.</div>
        `;

        explainEl.innerHTML = explain;

        // Render explanation math via MathJax API to avoid scanning issues
        const explainMathEl = document.getElementById('q38-explain-math');
        if (explainMathEl && window.MathJax?.tex2svgPromise) {
          const texExplain = String.raw`\begin{aligned} t &= \lfloor m/2 \rfloor + 1 \\ P_{\mathrm{SC}} &= \sum_{k=t}^{m} \binom{m}{k} p^{k} (1-p)^{m-k} + \mathbb{1}_{m\,\text{even}}\tfrac{1}{2} \binom{m}{m/2} p^{m/2}(1-p)^{m/2} \end{aligned}`;
          window.MathJax.tex2svgPromise(texExplain, { display: true }).then((node) => {
            explainMathEl.innerHTML = '';
            explainMathEl.appendChild(node);
          }).catch(() => {
            if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]);
          });
        } else if (window.MathJax?.typesetPromise) {
          window.MathJax.typesetPromise([explainEl]);
        }

        const showSteps = stratEl.value !== 'direct';
        const stepsHtml = showSteps ? `<ol class=\"list-decimal list-inside space-y-1\">${p.steps.map(s=>`<li>${s}</li>`).join('')}</ol>` : '';
        const finalLine = `<div class=\"mt-2\"><span class=\"font-semibold\">Answer:</span> <span class=\"font-mono\">${p.answer}</span></div>`;

        outputEl.innerHTML = `
          ${bars('Estimated accuracy', acc, 'emerald')}
          ${bars('Diversity (temp)', Math.min(1, parseFloat(tempEl.value)), 'purple')}
          <div class=\"mt-3\">${stepsHtml}${finalLine}</div>
        `;

        // Typeset math in this section
        setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([explainEl]); }, 30);
      }

  [problemEl, stratEl, tempEl, mEl].forEach(el => { if(!el) return; el.addEventListener('input', render); el.addEventListener('change', render); });
      randBtn.addEventListener('click', () => { problems = genProblems(); render(); });
      render();

      // Render the static Key Idea math via MathJax API to avoid scanning issues
      const renderKeyMath = () => {
        const keyMath = document.getElementById('q38-key-math');
        if (!keyMath) return;
  const tex = String.raw`\begin{aligned} t &= \lfloor m/2 \rfloor + 1 \\ P_{\mathrm{SC}} &= \sum_{k=t}^{m} \binom{m}{k} \, p^{k} (1-p)^{m-k} + \mathbb{1}_{m\,\text{even}}\tfrac{1}{2} \binom{m}{m/2} p^{m/2}(1-p)^{m/2} \end{aligned}`;
        if (window.MathJax?.tex2svgPromise) {
          window.MathJax.tex2svgPromise(tex, { display: true }).then((node) => {
            keyMath.innerHTML = '';
            keyMath.appendChild(node);
          }).catch(() => {
            if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([keyMath]);
          });
        } else if (window.MathJax?.typesetPromise) {
          window.MathJax.typesetPromise([keyMath]);
        }
      };

      // Initial render for Key Idea math
      setTimeout(renderKeyMath, 60);
    }
  }
};

// Optional export for tooling/tests
if (typeof module !== 'undefined') { module.exports = question; }
