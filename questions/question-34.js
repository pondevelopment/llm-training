// Question 34: What types of foundation models exist?
// Created: 2025-08-11
// Educational Focus: Foundation model taxonomy, modalities, adaptation patterns, representative examples

const question = {
  title: "34. What types of foundation models exist?",
  answer: `<div class="space-y-6">
    <!-- Recommended Reading (Cross-links) -->
    <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
      <h4 class="font-semibold text-indigo-900 mb-2">📚 Recommended reading</h4>
      <ul class="list-disc ml-5 text-xs text-indigo-800 space-y-1">
        <li><a class="underline hover:text-indigo-900" href="#question-2">2. How do attention mechanisms work?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-16">16. What is transfer learning in LLMs?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-22">22. What is multi‑head attention?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-32">32. How are attention scores calculated?</a></li>
        <li><a class="underline hover:text-indigo-900" href="#question-33">33. How do multimodal training strategies differ?</a></li>
      </ul>
      <p class="text-[11px] text-indigo-700 mt-2">These provide prerequisites on attention, transfer, and multimodal integration that inform foundation model taxonomy.</p>
    </div>
    <!-- Definition / Overview -->
    <div class="bg-blue-50 p-5 rounded-xl border border-blue-200">
      <h4 class="font-semibold text-blue-900 mb-2">🧱 What is a Foundation Model?</h4>
      <p class="text-sm text-blue-800 leading-relaxed">A <strong>foundation model</strong> is a very large, broadly trained model (usually self-supervised) that learns general representations and can be <em>adapted</em> to many downstream tasks via prompting, fine‑tuning, retrieval, tools, or lightweight parameter updates (e.g., LoRA). They span multiple <strong>modalities</strong> (text, images, audio, video, 3D, code, bio, robotics) and often unify them inside Transformer or hybrid attention architectures.</p>
      <div class="mt-3 grid md:grid-cols-4 gap-3 text-xs">
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Training</span><br>Massive unlabeled corpora + self / weak supervision</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Adaptation</span><br>Prompting · RAG · Fine‑tune · LoRA · Distillation</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Economics</span><br>High pretrain cost → Low marginal task cost</div>
        <div class="bg-white rounded p-3 border border-blue-100"><span class="font-semibold">Scaling Law</span><br>Perplexity ↓ ≈ power‑law in (Parameters, Data, Compute)</div>
      </div>
    </div>

    <!-- Taxonomy Summary Grid -->
    <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <h4 class="font-semibold text-gray-900 mb-4 flex items-center">📚 Major Foundation Model Categories</h4>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-sm">
        <div class="bg-gradient-to-br from-indigo-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-indigo-800 mb-1">1. Language / Multilingual</h5>
          <p class="text-indigo-700 text-xs mb-1">Autoregressive or masked Transformers over tokenized text.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-indigo-700">
            <li>GPT‑5, GPT‑4o / 4.1 / 4.5 family</li>
            <li>Claude 3 / 3.5 (Opus, Sonnet, Haiku)</li>
            <li>Gemini 2.5 (Pro / Flash / Flash‑Lite)</li>
            <li>Llama 3 (8B / 70B), Mistral Large</li>
            <li>Mixtral 8x7B, Qwen2, DeepSeek‑V2</li>
            <li>Yi, Phi‑3, Command R+</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-purple-800 mb-1">2. Vision & Vision-Language</h5>
          <p class="text-purple-700 text-xs mb-1">Image / video encoders & joint visual-text reasoning.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-purple-700">
            <li>ViT, ConvNeXt, EVA (encoders)</li>
            <li>CLIP / SigLIP (align text–image)</li>
            <li>SAM, Florence‑2, Grounding DINO</li>
            <li>Kosmos, LLaVA, InstructBLIP</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-rose-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-rose-800 mb-1">3. Image Generation</h5>
            <p class="text-rose-700 text-xs mb-1">Diffusion, rectified flow & transformer decoders.</p>
            <ul class="list-disc ml-4 text-xs space-y-0.5 text-rose-700">
              <li>SDXL 1.0, Flux.1, Stable Cascade</li>
              <li>Midjourney v6, DALL·E 3</li>
              <li>Ideogram 2, Firefly 3</li>
              <li>Imagen 3, Kandinsky 3</li>
            </ul>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-emerald-800 mb-1">4. Audio / Speech / Music</h5>
          <p class="text-emerald-700 text-xs mb-1">Waveform, spectrogram & token based generative models.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-emerald-700">
            <li>Whisper, MMS, NeMo ASR</li>
            <li>Bark, WaveNet, XTTS</li>
            <li>Suno v3, Udio, MusicGen, Lyria</li>
            <li>AudioLM, LM‑based TTS (Voicebox)</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-amber-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-amber-800 mb-1">5. Video & World Models</h5>
          <p class="text-amber-700 text-xs mb-1">Temporal latent dynamics & 3D world simulation.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-amber-700">
            <li>Sora (text→video), Veo</li>
            <li>Runway Gen‑3 / Gen‑3 Alpha</li>
            <li>Kling, Pika Labs, Dream Machine</li>
            <li>Genie, World Model (Runway), GAIA‑1</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-fuchsia-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-fuchsia-800 mb-1">6. Code & Tool Models</h5>
          <p class="text-fuchsia-700 text-xs mb-1">Enhanced reasoning over structured syntax & repos.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-fuchsia-700">
            <li>Code Llama, StarCoder2</li>
            <li>DeepSeek‑Coder V2, GPT‑4.1</li>
            <li>Claude Code, Gemini Code Assist</li>
            <li>Phind, WizardCoder, Granite</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-lime-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-lime-800 mb-1">7. Scientific / Domain</h5>
          <p class="text-lime-700 text-xs mb-1">Specialized biological, medical & chemical modeling.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-lime-700">
            <li>AlphaFold2 / AF-Multimer, ESM‑2</li>
            <li>GNoME (materials), Fractal</li>
            <li>Med-PaLM 2, BioGPT, PubMedBERT</li>
            <li>GenSLM, TimeGPT (forecast)</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-slate-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-slate-800 mb-1">8. Multimodal Unified</h5>
          <p class="text-slate-700 text-xs mb-1">Single model with shared token space across modalities.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-slate-700">
            <li>Gemini 2.5 (native multi), GPT‑5, GPT‑4o</li>
            <li>Claude 3.5 Sonnet, Qwen2-VL</li>
            <li>InternVL 2, LLaVA 1.6</li>
            <li>Fuyu, InstructBLIP, MiniCPM‑V</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-teal-50 to-white border rounded-lg p-4">
          <h5 class="font-semibold text-teal-800 mb-1">9. Robotics / VLA</h5>
          <p class="text-teal-700 text-xs mb-1">Vision‑Language‑Action grounding & policy generation.</p>
          <ul class="list-disc ml-4 text-xs space-y-0.5 text-teal-700">
            <li>RT‑2 / RT‑X, OpenVLA</li>
            <li>RoboCat, PaLM‑E, Octo</li>
            <li>GR00T, ALOHA, Mobile ALOHA</li>
            <li>MimicGen, Generalist VLA stacks</li>
          </ul>
        </div>
      </div>
  <p class="text-[11px] text-gray-500 mt-2">Model lists are illustrative (mixed open / closed, 2023–2025). Presence ≠ endorsement; update periodically as families evolve.</p>
  </div>

    <!-- Adaptation Patterns -->
    <div class="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
      <h4 class="font-semibold text-yellow-900 mb-2">🔧 Common Adaptation & Extension Patterns</h4>
      <div class="grid md:grid-cols-3 gap-4 text-xs">
        <div class="bg-white rounded p-3 border border-yellow-100">
          <h6 class="font-semibold mb-1">Prompt & In‑Context</h6>
          <ul class="list-disc ml-4 space-y-0.5 text-yellow-800">
            <li>Task encoding via instructions / exemplars</li>
            <li>Augment context length (RAG, memory)</li>
            <li>No weight updates → instant iteration</li>
          </ul>
        </div>
        <div class="bg-white rounded p-3 border border-yellow-100">
          <h6 class="font-semibold mb-1">Parameter Efficient</h6>
          <ul class="list-disc ml-4 space-y-0.5 text-yellow-800">
            <li>LoRA / IA³ / QLoRA adapters</li>
            <li>Prefix / P‑tuning v2 / Side modules</li>
            <li>Low compute fine‑tunes</li>
          </ul>
        </div>
        <div class="bg-white rounded p-3 border border-yellow-100">
          <h6 class="font-semibold mb-1">Retrieval & Tool Use</h6>
          <ul class="list-disc ml-4 space-y-0.5 text-yellow-800">
            <li>Structured indexes (vector / graph)</li>
            <li>Grounding via APIs, databases, search</li>
            <li>External execution (code / agents)</li>
          </ul>
        </div>
      </div>
      <p class="text-[11px] text-yellow-700 mt-3">Other extensions: Distillation → smaller student models; Mixture‑of‑Experts for routing; Guardrails & safety filters for alignment.</p>
    </div>

    <!-- Why It Matters -->
    <div class="bg-green-50 p-5 rounded-xl border border-green-200">
      <h4 class="font-semibold text-green-900 mb-2">🎯 Why This Taxonomy Matters</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• <strong>Strategic Alignment:</strong> Helps decide whether to prompt, retrieve, or fine‑tune for a given task.</li>
        <li>• <strong>Cost Optimization:</strong> High pretrain cost justifies reuse—adapters & RAG reduce duplication.</li>
        <li>• <strong>Capability Planning:</strong> Understanding modality coverage guides product roadmaps.</li>
        <li>• <strong>Risk & Governance:</strong> Different categories pose distinct safety / bias / IP profiles.</li>
      </ul>
    </div>
  </div>`,
  interactive: {
    title: "🧭 Foundation Model Taxonomy Explorer",
    html: `<div class=\"space-y-6\">
      <div class=\"bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200\">
        <label class=\"block text-sm font-medium text-gray-700 mb-2\">🔍 Select a Category</label>
        <div class=\"grid md:grid-cols-5 gap-2\" id=\"q34-category-buttons\"></div>
        <p class=\"text-[11px] text-gray-600 mt-2\">Compare modality focus, representative models, adaptation strategies & maturity.</p>
      </div>

      <div class=\"grid md:grid-cols-3 gap-4\">
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📌 Overview</h5>
          <div id=\"q34-overview\" class=\"text-xs text-gray-700 space-y-2\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">🧪 Adaptation Profile</h5>
          <div id=\"q34-adaptation\" class=\"text-xs text-gray-700 space-y-2\"></div>
        </div>
        <div class=\"bg-white border rounded-lg p-4\">
          <h5 class=\"font-semibold text-gray-800 mb-2\">📈 Capability Indicators</h5>
          <div id=\"q34-metrics\" class=\"text-xs text-gray-700 space-y-3\"></div>
        </div>
      </div>

      <div class=\"bg-yellow-50 border border-yellow-200 rounded-lg p-4\">
        <h5 class=\"font-semibold text-yellow-900 mb-2\">💡 Insight</h5>
        <div id=\"q34-insight\" class=\"text-sm text-yellow-800\"></div>
      </div>
    </div>` ,
    script: () => {
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
        return `<div role=\"group\" aria-label=\"${label} score ${value} of 5\"><div class=\"flex justify-between text-[11px] mb-0.5\"><span>${label}</span><span>${value}/5</span></div><div class=\"w-full h-2 bg-gray-200 rounded\"><div class=\"h-2 rounded bg-${color}-500\" style=\"width:${pct}%\" aria-hidden=\"true\"></div></div></div>`;
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
    }
  }
};

// Optional export for tooling
if (typeof module !== 'undefined') { module.exports = question; }
