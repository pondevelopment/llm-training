const interactiveScript = () => {
      const $ = id => document.getElementById(id);
  const logitsSelect = $("q53-logits");
      const temp = $("q53-temp");
      const topk = $("q53-topk");
      const topp = $("q53-topp");
      const typical = $("q53-typical");
      const table = $("q53-table");
      const resultBox = $("q53-result");
      const explain = $("q53-explain");
  if(!logitsSelect||!temp||!topk||!topp||!typical||!table) return;

      const tempVal = $("q53-temp-val");
      const topkVal = $("q53-topk-val");
      const toppVal = $("q53-topp-val");
      const typicalVal = $("q53-typical-val");

      function parseLogits(){
        return logitsSelect.value.split(/[\,\s]+/).filter(Boolean).map(Number).filter(v=>Number.isFinite(v));
      }
      function softmax(arr, T){
        const m = Math.max(...arr);
        const exps = arr.map(z=>Math.exp((z - m)/T));
        const s = exps.reduce((a,b)=>a+b,0);
        return exps.map(e=>e/s);
      }
      function entropy(p){ return -p.reduce((a,b)=> a + (b>0 ? b*Math.log(b):0),0); }

      function choose(p){
        const r = Math.random();
        let c=0; for(let i=0;i<p.length;i++){ c+=p[i]; if(r<=c) return i; }
        return p.length-1;
      }

      function fmt(x){ return (x>=0?"":"") + x.toFixed(3); }
      function pct(x){ return (x*100).toFixed(1)+"%"; }

      function compute(){
        // Update inline display values
        tempVal.textContent = Number(temp.value).toFixed(1);
        topkVal.textContent = topk.value;
        toppVal.textContent = Number(topp.value).toFixed(2);
        typicalVal.textContent = Number(typical.value).toFixed(1);
        const raw = parseLogits();
        if(raw.length===0){ table.innerHTML='<div class="text-red-600">Enter at least one numeric logit.</div>'; return {raw, probs:[]}; }
        const T = Number(temp.value);
        const probs = softmax(raw, T);
        renderTable(raw, probs, []);
        return { raw, probs };
      }

      function renderTable(raw, probs, highlight){
        const max = Math.max(...probs, 0.000001);
        const header = `<table class="w-full text-[11px] border-separate border-spacing-y-1"><thead>
          <tr class="text-gray-600 font-semibold">
            <th class="px-2 text-left">#</th>
            <th class="px-2 text-right">Logit</th>
            <th class="px-2 text-right">p</th>
            <th class="px-2 text-left w-[140px]">Distribution</th>
          </tr></thead><tbody>`;
        const rows = raw.map((z,i)=>{
          const p = probs[i];
          const bar = Math.round((p/max)*100);
          const hl = highlight.includes(i);
          const rowCls = hl? 'bg-indigo-50 border border-indigo-200 shadow-sm' : 'bg-white border border-gray-100';
          const probTxt = pct(p);
          return `<tr class="${rowCls} hover:bg-gray-50 transition-colors">
            <td class="px-2 py-1 font-mono text-xs ${hl?'font-bold text-indigo-700':''}">${i}</td>
            <td class="px-2 py-1 text-right font-mono text-gray-600">${fmt(z)}</td>
            <td class="px-2 py-1 text-right font-mono ${hl?'font-semibold text-indigo-700':''}">${probTxt}</td>
            <td class="px-2 py-1">
              <div class="relative h-4 bg-gray-200/70 rounded overflow-hidden">
                <div class="absolute inset-y-0 left-0 ${hl?'bg-indigo-600':'bg-gray-500'}" style="width:${bar}%"></div>
                <div class="absolute inset-0 flex items-center pl-1 text-[10px] font-mono text-gray-800 mix-blend-plus-lighter">${bar>20?probTxt:''}</div>
              </div>
            </td>
          </tr>`;
        }).join('');
        const footer = `</tbody></table>
          <div class="text-[10px] text-gray-500 mt-2 flex flex-wrap gap-3">
            <span><span class="inline-block w-3 h-3 bg-indigo-600 rounded-sm mr-1"></span>Candidate set</span>
            <span>Bars scaled to max p</span>
          </div>`;
        table.innerHTML = header + rows + footer;
      }

      function strategyExplain(mode, meta){
        switch(mode){
          case 'greedy': return 'Greedy picks the argmax token — deterministic, fastest, but least diverse.';
          case 'topk': return `Top-k keeps the ${meta?.k||''} highest probability tokens then samples — truncates the tail.`;
          case 'topp': return `Nucleus keeps the smallest prefix whose cumulative probability ≥ ${(meta?.p||0).toFixed(2)} — adaptive set size.`;
          case 'typical': return `Typical sampling keeps tokens with information content near entropy H ≈ ${meta?.H?.toFixed(3)} — removes both very predictable and extremely rare tokens.`;
          default: return '';
        }
      }

      function applyStrategy(mode, raw, probs){
        let candidateIdx = [];
        let sampled = null;
        if(!probs.length) return;
        if(mode==='greedy'){
          const m = probs.indexOf(Math.max(...probs));
          candidateIdx=[m]; sampled=m;
        } else if(mode==='topk'){
          const k = Math.min(Number(topk.value), probs.length);
          const sorted = probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]).slice(0,k);
          candidateIdx = sorted.map(x=>x[1]);
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          const pickLocal = choose(norm);
            sampled = candidateIdx[pickLocal];
        } else if(mode==='topp'){
          const pTarget = Number(topp.value);
          const sorted = probs.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]);
          let cum=0; for(const [p,i] of sorted){ cum+=p; candidateIdx.push(i); if(cum>=pTarget) break; }
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          sampled = candidateIdx[choose(norm)];
        } else if(mode==='typical'){
          const tau = Number(typical.value);
          const H = entropy(probs);
          const info = probs.map(p=>Math.abs(-Math.log(p) - H));
          const pairs = info.map((d,i)=>[d,i]).sort((a,b)=>a[0]-b[0]);
          let acc=0; candidateIdx=[];
          for(const [d,i] of pairs){
            candidateIdx.push(i); acc += probs[i]; if(acc >= tau) break;
          }
          const restricted = candidateIdx.map(i=>probs[i]);
          const s = restricted.reduce((a,b)=>a+b,0);
          const norm = restricted.map(v=>v/s);
          sampled = candidateIdx[choose(norm)];
          return { candidateIdx, sampled, meta:{ H } };
        }
        return { candidateIdx, sampled, meta:{} };
      }

      function run(){
        const { raw, probs } = compute();
        const mode = (document.querySelector('input[name="q53-mode"]:checked')||{}).value;
        const out = applyStrategy(mode, raw, probs) || {candidateIdx:[], sampled:null, meta:{}};
        renderTable(raw, probs, out.candidateIdx);
        if(out.sampled!=null){
          resultBox.innerHTML = `<div><b>Chosen token index:</b> <span class="text-indigo-700 font-mono">${out.sampled}</span></div>`;
        } else {
          resultBox.textContent='—';
        }
        explain.textContent = strategyExplain(mode, {...out.meta, k:Number(topk.value), p:Number(topp.value)});
      }

      // Events
  [logitsSelect,temp,topk,topp,typical].forEach(el=> el.addEventListener('input', ()=> run()));
      document.querySelectorAll('input[name="q53-mode"]').forEach(r=> r.addEventListener('change', ()=> run()));
      $("q53-sample")?.addEventListener('click', e=>{ e.preventDefault(); run(); });
  $("q53-reset")?.addEventListener('click', ()=>{ logitsSelect.selectedIndex=0; temp.value='1.0'; topk.value='3'; topp.value='0.9'; typical.value='1.0'; run(); });

      run();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question53Interactive = interactiveScript;
}
