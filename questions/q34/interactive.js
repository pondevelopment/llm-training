const interactiveScript = () => {
      const categories = [
        {
          key: 'language', label: 'Language', color: 'indigo',
          description: 'Autoregressive or masked token transformers for natural & programming language understanding and generation.',
          models: ['GPT‑5','GPT‑4.5','GPT‑4o','GPT‑4.1','Claude 3.5 (Opus/Sonnet/Haiku)','Gemini 2.5 Pro','Gemini 2.5 Flash','Llama 3 70B','Llama 3 8B','Mistral Large','Mixtral 8x7B','Qwen2 72B','DeepSeek-V2','Yi 34B','Phi-3 Medium','Command R+'],
          adaptation: ['Prompt engineering','RAG context injection','Instruction / preference tuning','LoRA / QLoRA','Distillation'],
          metrics: { maturity: 5, ecosystem: 5, dataBreadth: 5, alignmentNeed: 4 },
          insight: 'Language models are the base substrate—other modalities often route through text reasoning layers for tool use & control.'
        },
        {
          key: 'vision', label: 'Vision', color: 'purple',
            description: 'Image / visual embedding and joint text-image alignment; foundation for retrieval, captioning, grounding.',
            models: ['ViT','ConvNeXt','EVA','CLIP','SigLIP','SAM','Florence-2','Grounding DINO','Kosmos','LLaVA 1.6','InstructBLIP'],
            adaptation: ['Linear / LoRA head','Task-specific fine‑tune','Grounding w/ detection data','Multimodal fusion','Vision prompt tuning'],
            metrics: { maturity: 4, ecosystem: 4, dataBreadth: 4, alignmentNeed: 3 },
            insight: 'Vision encoders increasingly become <em>plug‑in features</em> inside multimodal LLM stacks.'
        },
        {
          key: 'imageGen', label: 'Image Gen', color: 'rose',
          description: 'Diffusion & flow models translate text / conditioning signals into pixel or latent images.',
          models: ['SDXL 1.0','Flux.1','Stable Cascade','Midjourney v6','DALL·E 3','Ideogram 2','Firefly 3','Imagen 3','Kandinsky 3'],
          adaptation: ['LoRA style adapters','Textual inversion','DreamBooth fine‑tuning','ControlNet conditioning','Safety / watermark filters'],
          metrics: { maturity: 4, ecosystem: 5, dataBreadth: 4, alignmentNeed: 5 },
          insight: 'Customization demand drives a thriving adapter & style injection ecosystem.'
        },
        {
          key: 'audio', label: 'Audio/Music', color: 'emerald',
          description: 'Speech recognition, TTS, music & sound generation with spectrogram or discrete token pipelines.',
          models: ['Whisper','MMS','NeMo Parakeet','Bark','WaveNet','XTTS','Suno v3','Udio','MusicGen','Lyria','AudioLM','Voicebox'],
          adaptation: ['Finetune on accent / domain','Voice cloning embeddings','LoRA pitch/timbre modules','Lyric conditioned prompting','RAG for lyrics/chords'],
          metrics: { maturity: 3, ecosystem: 3, dataBreadth: 3, alignmentNeed: 4 },
          insight: 'Latency & prosody control are emerging competitive dimensions beyond pure quality.'
        },
        {
          key: 'video', label: 'Video/World', color: 'amber',
          description: 'Temporal generative & world models predicting coherent multi-frame or simulated environments.',
          models: ['Sora','Veo','Runway Gen‑3','Gen‑3 Alpha','Kling','Pika Labs','Dream Machine','Genie','World Model (Runway)','GAIA-1'],
          adaptation: ['Caption / script conditioning','Frame-level LoRA','Temporal control tokens','Physics / camera prompts','Composable scene graphs'],
          metrics: { maturity: 2, ecosystem: 3, dataBreadth: 3, alignmentNeed: 5 },
          insight: 'World models trend toward interactive simulation + agent training, not just passive generation.'
        },
        {
          key: 'code', label: 'Code', color: 'fuchsia',
          description: 'Models specialized for synthesis, refactoring, reasoning over repositories and API/tool usage.',
          models: ['Code Llama','StarCoder2','DeepSeek-Coder V2','GPT‑4.1','Claude Code','Gemini Code Assist','Phind','WizardCoder','Granite'],
          adaptation: ['Repo RAG + symbol index','Function-level fine‑tune','Tool execution feedback','Unit test reinforcement','System prompt scaffolds'],
          metrics: { maturity: 4, ecosystem: 4, dataBreadth: 4, alignmentNeed: 4 },
          insight: 'Hybrid retrieval (AST + embeddings) increasingly rivals parameter scaling for quality gains.'
        },
        {
          key: 'science', label: 'Science/Bio', color: 'lime',
          description: 'Protein folding, molecular design, genomics & medical reasoning—structured + sequence modalities.',
          models: ['AlphaFold2','AF-Multimer','ESM-2','GNoME','Fractal','Med-PaLM 2','GenSLM','BioGPT','PubMedBERT','MolMistral','TimeGPT'],
          adaptation: ['Domain fine‑tune on curated sets','Structure-conditioned generation','Active learning loops','Knowledge graph integration','Safety filtering'],
          metrics: { maturity: 3, ecosystem: 3, dataBreadth: 2, alignmentNeed: 5 },
          insight: 'Data quality and provenance dominate performance more than raw parameter count.'
        },
        {
          key: 'multimodal', label: 'Unified', color: 'slate',
          description: 'Single backbone integrates text, vision, audio (and sometimes video) via shared tokenization or adapters.',
          models: ['Gemini 2.5 Pro','GPT‑5','GPT‑4.5','GPT‑4o','Claude 3.5 Sonnet','Qwen2-VL','InternVL 2','LLaVA 1.6','Fuyu','InstructBLIP','MiniCPM-V'],
          adaptation: ['Prompt routing','Cross-modal RAG','Low-rank fusion adapters','Task-specific instruction tuning','Tool-augmented reasoning'],
          metrics: { maturity: 4, ecosystem: 4, dataBreadth: 5, alignmentNeed: 5 },
          insight: 'Unified models enable emergent cross-modal grounding & reduce duplicated param budgets.'
        },
        {
          key: 'robotics', label: 'Robotics/VLA', color: 'teal',
          description: 'Vision-Language-Action models mapping perceptual streams to control tokens / trajectories.',
          models: ['RT‑2','RT‑X','OpenVLA','RoboCat','PaLM‑E','Octo','GR00T','ALOHA','Mobile ALOHA','MimicGen'],
          adaptation: ['Imitation fine‑tune','Sim2Real domain adaptation','Goal-conditioned prompts','Embodied RAG (scene memory)','Safety constraint layers'],
          metrics: { maturity: 2, ecosystem: 2, dataBreadth: 2, alignmentNeed: 5 },
          insight: 'Bottleneck: high-quality, diverse action datasets → scaling laws emerging for embodied tasks.'
        }
      ];

      // Elements
      const buttonsHost = document.getElementById('q34-category-buttons');
      const overviewEl = document.getElementById('q34-overview');
      const adaptEl = document.getElementById('q34-adaptation');
      const metricsEl = document.getElementById('q34-metrics');
      const insightEl = document.getElementById('q34-insight');

      if (!buttonsHost) return;

      function metricBar(label, value, color) {
        const pct = (value / 5) * 100;
  return `<div role=\"group\" aria-label=\"${label} score ${value} of 5\"><div class=\"flex justify-between text-xs mb-0.5\"><span>${label}</span><span>${value}/5</span></div><div class=\"w-full h-2 bg-gray-200 rounded\"><div class=\"h-2 rounded bg-${color}-500\" style=\"width:${pct}%\" aria-hidden=\"true\"></div></div></div>`;
      }

      function render(cat) {
        // Overview
        overviewEl.innerHTML = `
          <div><strong>Description:</strong> ${cat.description}</div>
          <div><strong>Representative Models:</strong> <span class=\"font-mono\">${cat.models.join(', ')}</span></div>
        `;
        // Adaptation
        adaptEl.innerHTML = `<ul class=\"list-disc ml-4 space-y-1\">${cat.adaptation.map(a => `<li>${a}</li>`).join('')}</ul>`;
        // Metrics
        metricsEl.innerHTML = `
          ${metricBar('Maturity', cat.metrics.maturity, cat.color)}
          ${metricBar('Ecosystem', cat.metrics.ecosystem, cat.color)}
          ${metricBar('Data Breadth', cat.metrics.dataBreadth, cat.color)}
          ${metricBar('Alignment Need', cat.metrics.alignmentNeed, cat.color)}
          <p class=\"text-[10px] text-gray-500 mt-2\">Qualitative 1–5 heuristic scores (higher = more / stronger). </p>
        `;
        insightEl.innerHTML = cat.insight;
      }

      const ringColors = ['indigo','purple','rose','emerald','amber','fuchsia','lime','slate','teal'];

      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-${cat.color}-50 transition flex items-center gap-1`;
        btn.innerHTML = `<span class=\"w-2.5 h-2.5 rounded-full bg-${cat.color}-500 inline-block\"></span>${cat.label}`;
        btn.addEventListener('click', () => {
          // Clear active state (remove ring classes for all colors)
          buttonsHost.querySelectorAll('button').forEach(b => {
            b.classList.remove('ring-2','ring-offset-1');
            ringColors.forEach(rc => b.classList.remove('ring-' + rc + '-400'));
          });
          btn.classList.add('ring-2','ring-offset-1','ring-' + cat.color + '-400');
          render(cat);
        });
        buttonsHost.appendChild(btn);
      });

      // Initial selection
      render(categories[0]);
      buttonsHost.querySelector('button')?.classList.add('ring-2','ring-offset-1','ring-' + categories[0].color + '-400');

      // MathJax refresh for any math (scaling laws snippet if added later)
      setTimeout(() => { if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise(); }, 50);
    };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question34Interactive = interactiveScript;
}
