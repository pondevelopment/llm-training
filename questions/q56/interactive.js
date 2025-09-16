const interactiveScript = () => {
      const $ = id => document.getElementById(id);
      const inputs = {
        domain: $('q56-domain'), domainVal: $('q56-domain-val'),
        prop: $('q56-prop'), propVal: $('q56-prop-val'),
        hit: $('q56-hit'), hitVal: $('q56-hit-val'),
        ground: $('q56-ground'), groundVal: $('q56-ground-val'),
        latency: $('q56-latency'), update: $('q56-update'),
  personal: $('q56-personal'), format: $('q56-format'), volume: $('q56-volume')
      };
      const pressuresEl = $('q56-pressures');
      const recoEl = $('q56-reco');
      const nextEl = $('q56-next');
      const rationaleEl = $('q56-rationale');
  // copy button removed for simplicity

      function mapLatency(v){ return v==='fast'?0.8: v==='moderate'?0.5:0.2; }
      function mapFormat(v){ return v==='strict'?0.8: v==='semi'?0.5:0.2; }
      function mapPersonal(v){ return v==='user'?0.8: v==='cohort'?0.5:0.1; }
      function mapVolume(v){ return v==='high'?0.7: v==='med'?0.5:0.3; }
      function mapUpdate(v){ return v==='hourly'?0.1: v==='daily'?0.25: v==='weekly'?0.4: v==='monthly'?0.55:0.7; }

      function computePressures(){
        const domainGap = parseInt(inputs.domain.value,10)/100;
        const proprietary = parseInt(inputs.prop.value,10)/100;
        const hit = parseInt(inputs.hit.value,10)/100;
        const ground = parseInt(inputs.ground.value,10)/100;
        const retrievalAdequacy = (hit*0.6 + ground*0.4); // quality of current RAG
        return {
          domainGap,
          proprietary,
          structure: mapFormat(inputs.format.value),
          latency: mapLatency(inputs.latency.value),
            personalization: mapPersonal(inputs.personal.value),
          volume: mapVolume(inputs.volume.value),
          updateStability: mapUpdate(inputs.update.value), // higher = less frequent updates
          retrievalAdequacy
        };
      }

      function bar(label,val){ const pct=Math.round(val*100); const color = val>0.66?'bg-indigo-600': val>0.4?'bg-indigo-400':'bg-indigo-200'; return `<div><div class=\"flex justify-between\"><span>${label}</span><span class=\"font-mono\">${pct}%</span></div><div class=\"h-2 bg-gray-200 rounded overflow-hidden\"><div class=\"h-full ${color}\" style=\"width:${pct}%\"></div></div></div>`; }

      function recommend(p){
        const reasons=[]; let primary='RAG Optimization'; let secondary='Prompt + Retrieval'; const next=[]; const trace=[];
        // Threshold booleans
        const retrievalWeak = p.retrievalAdequacy < 0.6; trace.push({id:'retrievalWeak', fired: retrievalWeak, detail:`retrievalAdequacy ${pct(p.retrievalAdequacy)} < 60%`});
        const highStructure = p.structure > 0.7; trace.push({id:'highStructure', fired: highStructure, detail:`structure ${pct(p.structure)} > 70%`});
        const highProprietary = p.proprietary > 0.7; trace.push({id:'highProprietary', fired: highProprietary, detail:`proprietary ${pct(p.proprietary)} > 70%`});
        const highDomain = p.domainGap > 0.6; trace.push({id:'highDomain', fired: highDomain, detail:`domainGap ${pct(p.domainGap)} > 60%`});
        const highPersonal = p.personalization > 0.6; trace.push({id:'highPersonal', fired: highPersonal, detail:`personalization ${pct(p.personalization)} > 60%`});
        const lowUpdate = p.updateStability > 0.55; trace.push({id:'lowUpdate', fired: lowUpdate, detail:`updateStability ${pct(p.updateStability)} > 55% (infrequent updates)`});
        const latencyHigh = p.latency>0.7; trace.push({id:'latencyHigh', fired: latencyHigh, detail:`latency pressure ${pct(p.latency)} > 70%`});

        if(retrievalWeak){ reasons.push('Retrieval adequacy low → improve RAG first (chunking, rerank, filters).'); next.push('Tune retriever embeddings','Improve chunk segmentation','Add reranker','Instrument hit rate'); }
        if(highStructure && !retrievalWeak){ primary='Adapter (LoRA) + RAG'; reasons.push('High format rigidity → structured adapters helpful.'); next.push('Add output schema validator','Train format LoRA'); }
        if(highProprietary && highDomain && lowUpdate && !retrievalWeak){ primary='Targeted Fine-tune'; secondary='Hybrid (RAG + Adapter)'; reasons.push('Stable, high proprietary + domain gap → fine-tune justified.'); next.push('Assemble high-quality SFT set','Add eval harness pre/post'); }
        else if(highProprietary && lowUpdate && !retrievalWeak){
          // Proprietary alone (stable) still a driver for internalization when retrieval already decent
          if(primary==='RAG Optimization') primary='Selective Fine-tune (Focus Proprietary Segments)';
          reasons.push('High stable proprietary share → internalization can reduce per-query retrieval overhead.');
          next.push('Quantify cost vs latency benefit of internalization','Sample proprietary examples for SFT set curation');
        }
        if(highProprietary && retrievalWeak){
          reasons.push('High proprietary share but retrieval weak → postpone fine-tune until retrieval adequacy improves.');
        }
        if(highPersonal){ if(primary==='RAG Optimization') primary='Hybrid (Personalized Adapter + RAG)'; reasons.push('High personalization need → lightweight per-cohort adapters.'); next.push('Segment users into cohorts','Collect preference signals'); }
        if(highDomain && !highProprietary && !retrievalWeak){ if(primary==='RAG Optimization') primary='Hybrid (RAG + Adapter)'; reasons.push('Domain language shift but not proprietary heavy → style adapter + RAG.'); }
        if(latencyHigh && primary.startsWith('RAG')){ reasons.push('Latency pressure → consider caching / partial fine-tune for hot paths.'); next.push('Cache frequent answers','Distill latency-critical path'); }

        // Multi high pressure combination
        const highCount = [p.structure,p.proprietary,p.domainGap,p.personalization].filter(v=>v>0.6).length;
        if(highCount>=3 && !retrievalWeak){ primary='Hybrid (RAG + Adapter + Selective FT)'; secondary='Phased fine-tune roadmap'; reasons.push('Multiple high-intensity drivers → layered hybrid strategy.'); trace.push({id:'comboHigh', fired:true, detail:`${highCount} high-pressure drivers ≥3`}); }
        else { trace.push({id:'comboHigh', fired:false, detail:`${highCount} high-pressure drivers <3`}); }

        if(reasons.length===0){ reasons.push('Inputs do not cross escalation thresholds → stay with prompt + RAG tuning.'); next.push('Refine system prompt','Add few-shot exemplars'); }

        // Deduplicate next steps
        const uniqNext=[...new Set(next)].slice(0,6);

        return { primary, secondary, reasons, next: uniqNext, trace };
      }

      function pct(v){ return Math.round(v*100)+'%'; }
      function classify(v){ return v>0.66?{label:'High',color:'bg-rose-100 text-rose-700 border-rose-200'}: v>0.4?{label:'Med',color:'bg-amber-100 text-amber-700 border-amber-200'}:{label:'Low',color:'bg-gray-100 text-gray-600 border-gray-200'}; }
      const pressureLabels = {domainGap:'Domain Gap', proprietary:'Proprietary', structure:'Structure', latency:'Latency', personalization:'Personalization', volume:'Volume', updateStability:'Update Stability', retrievalAdequacy:'Retrieval Adequacy'};

      function refresh(){
        // sync value labels
        inputs.domainVal.textContent = inputs.domain.value+"%";
        inputs.propVal.textContent = inputs.prop.value+"%";
        inputs.hitVal.textContent = inputs.hit.value+"%";
        inputs.groundVal.textContent = inputs.ground.value+"%";
        const p = computePressures();
        pressuresEl.innerHTML = [
          bar('Domain Gap',p.domainGap),
          bar('Proprietary',p.proprietary),
          bar('Structure',p.structure),
          bar('Latency',p.latency),
          bar('Personalization',p.personalization),
          bar('Volume',p.volume),
          bar('Update Stability',p.updateStability),
          bar('Retrieval Adequacy',p.retrievalAdequacy)
        ].join('');
        const rec = recommend(p);
        recoEl.innerHTML = `<div class=\"text-indigo-700 font-semibold\">${rec.primary}</div>` + (rec.secondary? `<div class=\"text-[11px] text-gray-600\">Secondary: ${rec.secondary}</div>`:'') +
          `<div class=\"mt-2 text-[11px] leading-snug text-gray-700\"><strong>Why:</strong> ${rec.reasons.map(r=>`<span class=\"block\">• ${r}</span>`).join('')}</div>`;
        nextEl.innerHTML = rec.next.map(n=>`<li>${n}</li>`).join('');
        // Build reasoning trace table
        const chips = Object.keys(p).map(key=>{
          if(!(key in pressureLabels)) return ''; const cls=classify(p[key]);
          return `<div class=\"flex items-center justify-between text-[10px] px-2 py-1 border rounded ${cls.color}\"><span>${pressureLabels[key]}</span><span>${cls.label}</span></div>`;
        }).join('');
        const fired = rec.trace.filter(t=>t.fired).map(t=>`<li class=\"mb-0.5\"><code class=\"bg-gray-100 px-1 rounded\">${t.id}</code> → ${t.detail}</li>`).join('') || '<li>No escalation rules fired.</li>';
        const notFired = rec.trace.filter(t=>!t.fired).map(t=>`<li class=\"opacity-60\"><code class=\"bg-gray-50 px-1 rounded\">${t.id}</code> (${t.detail})</li>`).join('');
        rationaleEl.innerHTML = `<div class=\"font-semibold text-gray-800 mb-1\">Reasoning Trace</div><div class=\"grid md:grid-cols-4 gap-1 mb-3\">${chips}</div><div class=\"mb-2\"><span class=\"font-medium text-gray-700\">Triggered Rules</span><ul class=\"list-disc ml-5 mt-1\">${fired}</ul></div><details class=\"mt-2\"><summary class=\"cursor-pointer text-gray-600 text-[11px]\">Show non-triggered rules</summary><ul class=\"list-disc ml-5 mt-1 text-[11px] text-gray-500\">${notFired}</ul></details>`;
        latest = { inputs: collectRaw(), pressures: p, recommendation: { primary: rec.primary, secondary: rec.secondary }, rationale: rec.reasons, trace: rec.trace, next_steps: rec.next };
      }

      function collectRaw(){ return {
        domain_shift: parseInt(inputs.domain.value,10),
        proprietary_pct: parseInt(inputs.prop.value,10),
        retrieval_hit_rate: parseInt(inputs.hit.value,10),
        grounded_rate: parseInt(inputs.ground.value,10),
        latency: inputs.latency.value,
        update_frequency: inputs.update.value,
        personalization: inputs.personal.value,
        format: inputs.format.value,
        query_volume: inputs.volume.value
      }; }

      let latest=null;
  Object.values(inputs).forEach(el=>{ if(el && el.tagName){ el.addEventListener('input',refresh); el.addEventListener('change',refresh);} });
  // (copy removed)
      refresh();
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question56Interactive = interactiveScript;
}
