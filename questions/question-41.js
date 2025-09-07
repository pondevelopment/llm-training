// Question 41: What is zero-shot learning, and how do LLMs implement it?
// Clean restored version

const question = {
  title: "41. What is zero-shot learning, and how do LLMs implement it?",
  answer: `
    <div class="space-y-4">
      <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
        <h4 class="font-semibold text-indigo-900 mb-1">📚 Recommended reading</h4>
        <ul class="list-disc ml-5 text-sm text-indigo-800 space-y-1">
          <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-6">Question 6: Temperature & decoding</a></li>
            <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-15">Question 15: Prompt engineering patterns</a></li>
            <li><a class="text-indigo-700 underline hover:text-indigo-900" href="#question-38">Question 38: Chain-of-Thought prompting</a></li>
        </ul>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
        <h4 class="font-semibold text-blue-900 mb-2">🧠 Key Idea</h4>
        <p class="text-sm text-blue-800">Zero-shot learning lets an LLM perform a task <b>without task-specific examples</b>, by relying on its pretrained knowledge and a natural-language <b>prompt</b> that defines the task + label words (verbalizer).</p>
        <div class="text-xs mt-2 text-blue-800">Formal view: choose label via conditional likelihood:
          <div class="math-display mt-2 overflow-x-auto whitespace-nowrap bg-white border rounded p-2">$$\\hat y = \\arg\\max_y P(y|x,p),\\; P(y|x,p)=\\operatorname{softmax}_y(s_y(x,p)/T)$$</div>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
          <h5 class="font-semibold text-green-900 mb-1">🟢 Zero-shot</h5>
          <ul class="text-sm text-green-800 space-y-1">
            <li>• No examples in prompt</li>
            <li>• Uses label words only</li>
            <li>• Fast; brittle if ambiguous</li>
          </ul>
        </div>
        <div class="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
          <h5 class="font-semibold text-purple-900 mb-1">🟣 Zero-shot + Instruction</h5>
          <ul class="text-sm text-purple-800 space-y-1">
            <li>• Adds explicit instruction</li>
            <li>• Better label calibration</li>
            <li>• Cheap improvement</li>
          </ul>
        </div>
        <div class="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
          <h5 class="font-semibold text-orange-900 mb-1">🟠 Few-shot (k-shot)</h5>
          <ul class="text-sm text-orange-800 space-y-1">
            <li>• Provides k labeled examples</li>
            <li>• Shows format & decision boundary</li>
            <li>• Higher token + curation cost</li>
          </ul>
        </div>
      </div>
      <p class="text-xs text-gray-600">Mechanism: prompt tokens condition internal representations; label tokens compete through next-token probabilities. Instructions bias distribution; few-shot examples steer via pattern completion.</p>
    </div>
  `,
  interactive: {
    title: "🧪 Zero-shot vs Few-shot Prompting Playground",
    html: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-indigo-50 to-sky-50 p-4 rounded-lg border border-indigo-200">
          <div class="grid md:grid-cols-4 gap-4 text-xs">
            <div>
              <label class="font-semibold text-gray-700">Task</label>
              <select id="q41-task" class="w-full border rounded p-1 text-xs">
                <option value="sentiment" selected>Sentiment (pos/neg/neutral)</option>
                <option value="topic">Topic (tech/sports/finance)</option>
                <option value="spam">Spam detection</option>
              </select>
            </div>
            <div>
              <label class="font-semibold text-gray-700">Example text</label>
              <select id="q41-text" class="w-full border rounded p-1 text-xs"></select>
            </div>
            <div>
              <label class="font-semibold text-gray-700">Mode</label>
              <select id="q41-mode" class="w-full border rounded p-1 text-xs">
                <option value="zero" selected>Zero-shot</option>
                <option value="zero-inst">Zero-shot + Instruction</option>
                <option value="few">Few-shot (k=2)</option>
              </select>
            </div>
            <div>
              <label class="font-semibold text-gray-700">Temperature</label>
              <input id="q41-temp" type="range" min="0.1" max="1.5" step="0.1" value="0.7" class="w-full" aria-label="Sampling temperature" aria-valuemin="0.1" aria-valuemax="1.5" aria-valuenow="0.7" />
              <div class="text-center mt-1"><span id="q41-temp-val" class="font-mono">0.7</span></div>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-2">Pipeline: word-match counts → (optional) instruction bias → (optional) few-shot similarity boosts → softmax(T).</p>
        </div>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white border rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">🧾 Prompt Preview</h5>
            <pre id="q41-prompt" class="text-xs bg-gray-50 border rounded p-2 whitespace-pre-wrap break-words leading-snug"></pre>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">📊 Model Scores</h5>
            <div id="q41-scores" class="text-xs text-gray-700 space-y-2" aria-live="polite"></div>
            <button id="q41-sim" type="button" class="mt-2 text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50" aria-label="Run sampling stability simulation">Stability sample (20 draws)</button>
            <div id="q41-sim-out" class="mt-2 text-xs text-gray-600 space-y-1" aria-live="polite"></div>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h5 class="font-semibold text-gray-800 mb-2">🗣️ Output</h5>
            <div id="q41-output" class="text-sm text-gray-800 space-y-2"></div>
          </div>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h5 class="font-semibold text-emerald-900 mb-1">🔎 Explanation</h5>
          <div id="q41-explain" class="text-xs text-emerald-800" aria-live="polite"></div>
        </div>
      </div>
    `,
    script: () => {
      const taskEl=document.getElementById('q41-task');
      const textEl=document.getElementById('q41-text');
      const modeEl=document.getElementById('q41-mode');
      const tempEl=document.getElementById('q41-temp');
      const tempVal=document.getElementById('q41-temp-val');
      const promptEl=document.getElementById('q41-prompt');
      const scoresEl=document.getElementById('q41-scores');
      const outputEl=document.getElementById('q41-output');
      const explainEl=document.getElementById('q41-explain');
      if(!taskEl) return;

      const TASKS={
        sentiment:{labels:['Positive','Negative','Neutral'],words:{Positive:['great','love','excellent','good','amazing','wonderful','fantastic','happy'],Negative:['bad','terrible','awful','hate','poor','broken','sad','worst'],Neutral:['okay','average','fine','neutral','ordinary','typical']},examples:[{x:'I absolutely love this phone, the battery is amazing.',y:'Positive'},{x:'Worst service I have ever experienced.',y:'Negative'},{x:'Delivery time was okay and the packaging was fine.',y:'Neutral'}],candidates:['The app is fantastic, I love the new UI.','The product arrived broken and support was awful.','It works okay for daily tasks.','Amazing camera, but the battery is bad.'],template(labels,text,mode){const instr=mode==='zero-inst'? 'Classify the sentiment. Reply with exactly one of: ':'Label:'; const lab=labels.join(', '); if(mode==='few'){return `You are a helpful classifier. Here are examples.\n\nExample 1:\nText: I absolutely love this phone, the battery is amazing.\nLabel: Positive\n\nExample 2:\nText: Worst service I have ever experienced.\nLabel: Negative\n\nNow classify:\nText: ${text}\nLabels: ${lab}\nInstruction: Reply with exactly one label.`;} return `${instr} ${lab}.\nText: ${text}`;} } ,
        topic:{labels:['Tech','Sports','Finance'],words:{Tech:['software','ai','computer','chip','cloud','android','ios','gpu','model','data'],Sports:['match','goal','team','league','coach','tournament','score','player'],Finance:['market','stocks','bank','bond','revenue','profits','inflation','rate']},examples:[{x:'The team scored a late goal to win the match.',y:'Sports'},{x:'New AI chip boosts model training speed.',y:'Tech'},{x:'The bank reported higher quarterly revenue.',y:'Finance'}],candidates:['Cloud providers cut GPU prices for AI workloads.','The player broke the league scoring record.','Stocks rallied after the central bank decision.'],template(labels,text,mode){if(mode==='few'){return `You are a topic classifier. Examples:\nText: The team scored a late goal to win the match.\nLabel: Sports\n\nText: New AI chip boosts model training speed.\nLabel: Tech\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;} return `Classify the topic as one of: ${labels.join(', ')}.\nText: ${text}`;}},
        spam:{labels:['Spam','Not Spam'],words:{Spam:['free','winner','credit','loan','click','offer','gift','prize','limited'],'Not Spam':['meeting','project','schedule','report','update','invoice','agenda']},examples:[{x:'Click now to claim your free gift prize!',y:'Spam'},{x:'Please review the project schedule update.',y:'Not Spam'}],candidates:['Limited offer: winner gets a free credit bonus!','Attached is the meeting agenda for tomorrow.'],template(labels,text,mode){if(mode==='few'){return `Decide if the message is spam. Examples:\nText: Click now to claim your free gift prize!\nLabel: Spam\n\nText: Please review the project schedule update.\nLabel: Not Spam\n\nClassify:\nText: ${text}\nLabels: ${labels.join(', ')}\nInstruction: Reply with exactly one label.`;} return `Is this Spam or Not Spam? Reply with one label.\nText: ${text}`;}}
      };

      function softmax(a,T){const m=Math.max(...a); const ex=a.map(v=>Math.exp((v-m)/T)); const s=ex.reduce((x,y)=>x+y,0); return ex.map(v=>v/s);} 
      function bar(label,p,color,meta){const pct=Math.round(p*100);return `<div><div class="flex justify-between text-xs mb-0.5"><span>${label}</span><span>${pct}%</span></div><div class="w-full h-3 bg-${color}-200 rounded relative overflow-hidden" role="progressbar" aria-label="${label} probability" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="h-3 bg-${color}-600" style="width:${pct}%"></div></div><div class="text-xs text-gray-500 mt-0.5">${meta}</div></div>`;}
      function score(text,labels,words){const t=text.toLowerCase();return labels.map(l=> (words[l]||[]).reduce((a,w)=>a+(t.includes(w)?1:0),0));}
      function sim(a,b){const A=new Set(a.toLowerCase().split(/[^a-z]+/).filter(Boolean)); const B=new Set(b.toLowerCase().split(/[^a-z]+/).filter(Boolean)); const inter=[...A].filter(x=>B.has(x)).length; const uni=new Set([...A,...B]).size||1; return inter/uni;}
      function fewBoost(scores,text,labels,examples){const alpha=1.2; const boosts=labels.map(l=>{const sims=examples.filter(e=>e.y===l).map(e=>sim(text,e.x)); const avg=sims.length? sims.reduce((x,y)=>x+y,0)/sims.length:0; return alpha*avg;}); return scores.map((s,i)=>s+boosts[i]);}
      function instrBias(scores){const m=scores.indexOf(Math.max(...scores)); return {adjusted:scores.map((s,i)=> i===m? s+0.4:s), idx:m, bias:0.4};}
      function fillExamples(task){textEl.innerHTML=''; task.candidates.forEach((c,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=c;textEl.appendChild(o);}); textEl.value='0';}
      function render(){tempVal.textContent=parseFloat(tempEl.value).toFixed(1); const task=TASKS[taskEl.value]; if(!textEl.options.length) fillExamples(task); const text=task.candidates[parseInt(textEl.value||'0',10)]||task.candidates[0]; const labels=task.labels; const mode=modeEl.value; const T=parseFloat(tempEl.value); const prompt=task.template(labels,text,mode); promptEl.textContent=prompt; const raw=score(text,labels,task.words); let working=[...raw]; let biasInfo=null; let boosts=null; if(mode==='zero-inst'){biasInfo=instrBias(working); working=biasInfo.adjusted;} if(mode==='few'){const before=[...working]; working=fewBoost(working,text,labels,task.examples); boosts=working.map((v,i)=>v-before[i]);} const probs=softmax(working,T); const entropy=-probs.reduce((a,p)=> a+(p>0? p*Math.log2(p):0),0); scoresEl.innerHTML=probs.map((p,i)=>{const color=['indigo','violet','sky'][i%3]; const meta=[`raw:${raw[i]}`]; if(biasInfo && biasInfo.idx===i) meta.push(`+bias:${biasInfo.bias}`); if(boosts) meta.push(`+fs:${boosts[i].toFixed(2)}`); return bar(labels[i],p,color,meta.join(' '));}).join('')+`<div class="text-xs text-gray-500 mt-1">Entropy H=${entropy.toFixed(2)}</div>`; const top=probs.indexOf(Math.max(...probs)); outputEl.innerHTML=`<div>Predicted label: <b>${labels[top]}</b></div>`; let modeExp= mode==='zero' ? 'Zero-shot uses only raw label word matches.' : mode==='zero-inst' ? `Instruction adds bias (+${biasInfo.bias}).` : 'Few-shot adds similarity boosts (+fs).'; explainEl.innerHTML=`${modeExp} Temperature <span class="font-mono">${T.toFixed(1)}</span> controls sharpness; entropy summarizes uncertainty.`; tempEl.setAttribute('aria-valuenow',T.toFixed(1)); const simBtn=document.getElementById('q41-sim'); const simOut=document.getElementById('q41-sim-out'); if(simBtn && !simBtn.dataset.bound){simBtn.dataset.bound='1'; simBtn.addEventListener('click',()=>{const draws=20; const counts=labels.map(()=>0); for(let i=0;i<draws;i++){const r=Math.random(); let acc=0; for(let j=0;j<probs.length;j++){acc+=probs[j]; if(r<=acc){counts[j]++; break;}}} const rows=counts.map((c,i)=>`${labels[i]}:${c}`).join(' | '); simOut.innerHTML=`<div class="font-mono">${rows}</div><div class="text-xs">Most frequent: <b>${labels[counts.indexOf(Math.max(...counts))]}</b></div>`;});}}
      [taskEl,textEl,modeEl,tempEl].forEach(el=>{el.addEventListener('input',render); el.addEventListener('change',()=>{if(el===taskEl){fillExamples(TASKS[taskEl.value]);} render();});}); fillExamples(TASKS[taskEl.value]); render();
    }
  }
};

if(typeof module !== 'undefined'){ module.exports = question; }
