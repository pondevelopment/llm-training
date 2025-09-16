const interactiveScript = () => {
      const $ = id => document.getElementById(id);
      const logitsSelect = $("q54-logits-select");
      const shift = $("q54-shift");
      const scale = $("q54-scale");
      const temp = $("q54-temp");
      const biasIndex = $("q54-bias-index");
      const biasSize = $("q54-bias-size");
      const table = $("q54-table");
      const insight = $("q54-insight");
      const mathBox = $("q54-math");
  const help = $("q54-help"); // static help panel
      if(!logitsSelect||!shift||!scale||!temp||!biasIndex||!biasSize||!table) return;

  const shiftVal = $("q54-shift-val");
  const scaleVal = $("q54-scale-val");
  const tempVal = $("q54-temp-val");
  const biasSizeVal = $("q54-bias-size-val");
  // Help panel is static; no toggle logic
      function parse(){
        return logitsSelect.value.split(/[\s,]+/).filter(Boolean).map(Number).filter(v=>Number.isFinite(v));
      }
      function softmax(arr){
        if(!arr.length) return [];
        const m = Math.max(...arr);
        const exps = arr.map(z=>Math.exp(z-m));
        const s = exps.reduce((a,b)=>a+b,0);
        return exps.map(e=>e/s);
      }
      function entropy(p){ return -p.reduce((a,b)=> a + (b>0? b*Math.log2(b):0),0); }

      function ensureBiasOptions(base){
        if(!biasIndex) return;
        const current = parseInt(biasIndex.value,10);
        const len = base.length;
        // Always rebuild so labels reflect current base logits
        biasIndex.innerHTML = base.map((v,i)=>`<option value="${i}">Token ${i} (${v.toFixed(2)})</option>`).join('');
        if(isNaN(current) || current >= len){
          biasIndex.value = '0';
        } else {
          biasIndex.value = String(current);
        }
      }

      function recompute(){
        shiftVal.textContent = Number(shift.value).toFixed(1);
        scaleVal.textContent = Number(scale.value).toFixed(2);
        tempVal.textContent = Number(temp.value).toFixed(1);
        biasSizeVal.textContent = Number(biasSize.value).toFixed(2);
        const base = parse();
        if(!base.length){ table.innerHTML='<div class="text-red-600">Enter logits.</div>'; return; }
        ensureBiasOptions(base);
        const bi = Math.min(Math.max(parseInt(biasIndex.value,10)||0,0), base.length-1);
        const biased = base.map((z,i)=> (i===bi ? z + Number(biasSize.value): z));
        const transformed = biased.map(z=> (z + Number(shift.value)) * Number(scale.value) / Number(temp.value));
        // Baseline (no bias) for delta comparison
        const transformedNoBias = base.map(z=> (z + Number(shift.value)) * Number(scale.value) / Number(temp.value));
        const probs = softmax(transformed);
        const probsNoBias = softmax(transformedNoBias);
        const H = entropy(probs);
        const maxP = Math.max(...probs);
        const winner = probs.indexOf(maxP);
        renderTable(base, biased, transformed, probs, probsNoBias, winner, bi);
        const deltaWinner = ((probs[winner]-probsNoBias[winner])*100).toFixed(2);
        mathBox.innerHTML = `Shift adds c to all logits (no effect after softmax); scale / temperature modify gaps; bias locally raises a token; final normalization ensures ∑p=1.`;
        const isBiasWinner = bi === winner;
        const biasP = (probs[bi]*100).toFixed(2);
        const biasDelta = ((probs[bi]-probsNoBias[bi])*100).toFixed(2);
        insight.innerHTML = `
          <div><b>Winner:</b> <span class="font-mono ${isBiasWinner?'text-blue-700 font-semibold':''}">${winner}</span> (p=${(maxP*100).toFixed(1)}%)</div>
          <div><b>Entropy:</b> ${H.toFixed(3)} bits</div>
          <div><b>Bias target:</b> <span class="font-mono">${bi}</span> (p=${biasP}% Δ=${biasDelta}%)</div>
          <div><b>Δp (winner vs baseline):</b> ${deltaWinner}%</div>
        `;
      }

      // (Removed obsolete collapsible help logic)

      function renderTable(base, biased, transformed, probs, probsNoBias, winner, biasedIndex){
        const maxP = Math.max(...probs) || 1;
        const header = `<table class="w-full text-[11px] border-separate border-spacing-y-1"><thead>
            <tr class="text-gray-600 font-semibold">
              <th class="text-left px-2">#</th>
              <th class="text-right px-2">Base</th>
              <th class="text-right px-2">Biased</th>
              <th class="text-right px-2">Transformed</th>
              <th class="text-right px-2">p</th>
              <th class="text-right px-2">Δp</th>
              <th class="text-left px-2 w-[140px]">Distribution</th>
            </tr></thead><tbody>`;
        const rows = base.map((b,i)=>{
          const p = probs[i];
          const dp = (p - (probsNoBias[i]||0));
          const bar = Math.round((p/maxP)*100);
          const isWinner = i===winner;
          const changed = biased[i] !== b;
          const rowCls = isWinner ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'bg-white border border-gray-100';
          const probTxt = (p*100).toFixed(1)+'%';
          const deltaTxt = (dp*100).toFixed(2)+'%';
          const deltaCls = dp>0.0001? 'text-green-600' : (dp<-0.0001? 'text-rose-600':'text-gray-400');
          return `<tr class="${rowCls} hover:bg-gray-50 transition-colors">
              <td class="px-2 py-1 font-mono text-xs ${isWinner?'font-bold text-blue-700':''}">${i}</td>
              <td class="px-2 py-1 text-right font-mono">${b.toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono ${changed?'text-indigo-600 font-semibold':''}" title="${changed?'+ bias applied':''}">${biased[i].toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono">${transformed[i].toFixed(2)}</td>
              <td class="px-2 py-1 text-right font-mono ${isWinner?'font-bold text-blue-700':''}">${probTxt}</td>
              <td class="px-2 py-1 text-right font-mono ${deltaCls}">${deltaTxt}</td>
              <td class="px-2 py-1">
                <div class="relative h-4 bg-gray-200/70 rounded overflow-hidden">
                  <div class="absolute inset-y-0 left-0 ${isWinner?'bg-blue-600':'bg-gray-500'}" style="width:${bar}%"></div>
                  <div class="absolute inset-0 flex items-center pl-1 text-[10px] font-mono text-gray-800 mix-blend-plus-lighter">${bar>18?probTxt:''}</div>
                </div>
              </td>
            </tr>`;
        }).join('');
        const footer = `</tbody></table>
          <div class="text-[10px] text-gray-500 mt-2 flex flex-wrap gap-3">
            <span><span class="inline-block w-3 h-3 bg-blue-600 rounded-sm align-middle mr-1"></span>Winner</span>
            <span><span class="inline-block w-3 h-3 bg-indigo-600 rounded-sm align-middle mr-1"></span>Bias affected</span>
            <span>Transformed = (biased + shift) * scale / T</span>
            <span>Δp = change vs no-bias baseline</span>
          </div>`;
        table.innerHTML = header + rows + footer;
      }

      [logitsSelect, shift, scale, temp, biasIndex, biasSize].forEach(el=> { el.addEventListener('input', recompute); el.addEventListener('change', recompute); });
      $("q54-reset")?.addEventListener('click', ()=>{ logitsSelect.selectedIndex=1; shift.value='0'; scale.value='1'; temp.value='1'; biasIndex.value='0'; biasSize.value='0'; recompute(); });
      $("q54-random")?.addEventListener('click', ()=>{ const n=5+Math.floor(Math.random()*3); const arr = Array.from({length:n},()=> (Math.random()*4-2).toFixed(1)); const opt=document.createElement('option'); opt.textContent='Random: '+arr.join(','); opt.value=arr.join(','); logitsSelect.appendChild(opt); logitsSelect.selectedIndex=logitsSelect.options.length-1; recompute(); });

      recompute();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question54Interactive = interactiveScript;
}
