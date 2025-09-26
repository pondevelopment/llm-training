const interactiveScript = () => {
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

        // Base task difficulty -> direct accuracy
        const baseAcc = problemEl.value === 'sum' ? 0.78 : problemEl.value === 'apples' ? 0.70 : 0.85;

        const est = estimate(baseAcc, parseFloat(tempEl.value), parseInt(mEl.value, 10), stratEl.value);
        const acc = est.p;
        const tokens = tokenCost(p.baseTokens, p.stepTokens * p.steps.length, stratEl.value, parseInt(mEl.value, 10));

        metricsEl.innerHTML = `
          <dl class="space-y-2 text-sm" role="group" aria-label="Strategy metrics">
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-xs text-muted">Strategy</dt>
              <dd class="font-medium text-heading">${stratEl.options[stratEl.selectedIndex].text}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-xs text-muted">Estimated accuracy</dt>
              <dd class="font-mono text-heading">${(acc * 100).toFixed(2)}%</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-xs text-muted">Token estimate</dt>
              <dd class="font-mono text-heading">~${Math.round(tokens)} tokens</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-xs text-muted">Temperature</dt>
              <dd class="font-mono text-heading">${parseFloat(tempEl.value).toFixed(2)}${stratEl.value === 'sc' ? ` (m=${mEl.value})` : ''}</dd>
            </div>
          </dl>
        `;

        // Output section
        const bars = (label, val, tone = 'emerald') => {
          const pct = Math.max(0, Math.min(100, val * 100));
          const rounded = pct.toFixed(0);
          return `<div class="space-y-1">
            <div class="flex justify-between text-xs text-muted"><span>${label}</span><span class="font-mono text-heading">${rounded}%</span></div>
            <div class="context-meter" data-tone="${tone}" role="progressbar" aria-label="${label}" aria-valuenow="${rounded}" aria-valuemin="0" aria-valuemax="100">
              <div class="context-meter-fill" style="width:${pct}%"></div>
            </div>
          </div>`;
        };

        const explain = `
          <p class="text-sm text-body">Chain-of-thought reveals intermediate steps. Self-consistency samples multiple chains and takes a majority (ties count half) to reduce variance from any single flawed chain.</p>
          <div id="q38-explain-math" class="math-display text-xs font-mono mt-1"></div>
          <p class="text-xs panel-muted mt-1">We treat chains as independent with single-chain correctness <span class="font-mono">p</span>. For even <span class="font-mono">m</span>, a tie contributes half its probability mass so accuracy is non-decreasing as <span class="font-mono">m</span> grows.</p>
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
        const stepsHtml = showSteps ? `<ol class="list-decimal list-inside space-y-1">${p.steps.map((s) => `<li>${s}</li>`).join('')}</ol>` : '';
        const finalLine = `<div class="mt-2"><span class="font-semibold">Answer:</span> <span class="font-mono">${p.answer}</span></div>`;


        outputEl.innerHTML = `
          ${bars('Estimated accuracy', acc, 'emerald')}
          ${bars('Diversity (temp)', Math.min(1, parseFloat(tempEl.value)), 'purple')}
          <div class="mt-3">${stepsHtml}${finalLine}</div>
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
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question38Interactive = interactiveScript;
}
