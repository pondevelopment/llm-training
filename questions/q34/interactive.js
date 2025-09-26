const interactiveScript = () => {
  const categories = [
    {
      key: 'language',
      label: 'Language',
      accent: 'foundations',
      description:
        'Autoregressive or masked token transformers for natural & programming language understanding and generation.',
      models: [
        'GPT‑5',
        'GPT‑4.5',
        'GPT‑4o',
        'GPT‑4.1',
        'Claude 3.5 (Opus/Sonnet/Haiku)',
        'Gemini 2.5 Pro',
        'Gemini 2.5 Flash',
        'Llama 3 70B',
        'Llama 3 8B',
        'Mistral Large',
        'Mixtral 8x7B',
        'Qwen2 72B',
        'DeepSeek-V2',
        'Yi 34B',
        'Phi-3 Medium',
        'Command R+'
      ],
      adaptation: [
        'Prompt engineering',
        'RAG context injection',
        'Instruction / preference tuning',
        'LoRA / QLoRA',
        'Distillation'
      ],
      metrics: { maturity: 5, ecosystem: 5, dataBreadth: 5, alignmentNeed: 4 },
      insight:
        'Language models are the base substrate—other modalities often route through text reasoning layers for tool use & control.'
    },
    {
      key: 'vision',
      label: 'Vision',
      accent: 'training',
      description:
        'Image / visual embedding and joint text-image alignment; foundation for retrieval, captioning, grounding.',
      models: [
        'ViT',
        'ConvNeXt',
        'EVA',
        'CLIP',
        'SigLIP',
        'SAM',
        'Florence-2',
        'Grounding DINO',
        'Kosmos',
        'LLaVA 1.6',
        'InstructBLIP'
      ],
      adaptation: [
        'Linear / LoRA head',
        'Task-specific fine‑tune',
        'Grounding w/ detection data',
        'Multimodal fusion',
        'Vision prompt tuning'
      ],
      metrics: { maturity: 4, ecosystem: 4, dataBreadth: 4, alignmentNeed: 3 },
      insight: 'Vision encoders increasingly become <em>plug‑in features</em> inside multimodal LLM stacks.'
    },
    {
      key: 'imageGen',
      label: 'Image Gen',
      accent: 'generation',
      description: 'Diffusion & flow models translate text / conditioning signals into pixel or latent images.',
      models: [
        'SDXL 1.0',
        'Flux.1',
        'Stable Cascade',
        'Midjourney v6',
        'DALL·E 3',
        'Ideogram 2',
        'Firefly 3',
        'Imagen 3',
        'Kandinsky 3'
      ],
      adaptation: [
        'LoRA style adapters',
        'Textual inversion',
        'DreamBooth fine‑tuning',
        'ControlNet conditioning',
        'Safety / watermark filters'
      ],
      metrics: { maturity: 4, ecosystem: 5, dataBreadth: 4, alignmentNeed: 5 },
      insight: 'Customization demand drives a thriving adapter & style injection ecosystem.'
    },
    {
      key: 'audio',
      label: 'Audio/Music',
      accent: 'alignment',
      description:
        'Speech recognition, TTS, music & sound generation with spectrogram or discrete token pipelines.',
      models: [
        'Whisper',
        'MMS',
        'NeMo Parakeet',
        'Bark',
        'WaveNet',
        'XTTS',
        'Suno v3',
        'Udio',
        'MusicGen',
        'Lyria',
        'AudioLM',
        'Voicebox'
      ],
      adaptation: [
        'Finetune on accent / domain',
        'Voice cloning embeddings',
        'LoRA pitch/timbre modules',
        'Lyric conditioned prompting',
        'RAG for lyrics/chords'
      ],
      metrics: { maturity: 3, ecosystem: 3, dataBreadth: 3, alignmentNeed: 4 },
      insight: 'Latency & prosody control are emerging competitive dimensions beyond pure quality.'
    },
    {
      key: 'video',
      label: 'Video/World',
      accent: 'scaling',
      description:
        'Temporal generative & world models predicting coherent multi-frame or simulated environments.',
      models: [
        'Sora',
        'Veo',
        'Runway Gen‑3',
        'Gen‑3 Alpha',
        'Kling',
        'Pika Labs',
        'Dream Machine',
        'Genie',
        'World Model (Runway)',
        'GAIA-1'
      ],
      adaptation: [
        'Caption / script conditioning',
        'Frame-level LoRA',
        'Temporal control tokens',
        'Physics / camera prompts',
        'Composable scene graphs'
      ],
      metrics: { maturity: 2, ecosystem: 3, dataBreadth: 3, alignmentNeed: 5 },
      insight: 'World models trend toward interactive simulation + agent training, not just passive generation.'
    },
    {
      key: 'code',
      label: 'Code',
      accent: 'training',
      description: 'Models specialized for synthesis, refactoring, reasoning over repositories and API/tool usage.',
      models: [
        'Code Llama',
        'StarCoder2',
        'DeepSeek-Coder V2',
        'GPT‑4.1',
        'Claude Code',
        'Gemini Code Assist',
        'Phind',
        'WizardCoder',
        'Granite'
      ],
      adaptation: [
        'Repo RAG + symbol index',
        'Function-level fine‑tune',
        'Tool execution feedback',
        'Unit test reinforcement',
        'System prompt scaffolds'
      ],
      metrics: { maturity: 4, ecosystem: 4, dataBreadth: 4, alignmentNeed: 4 },
      insight: 'Hybrid retrieval (AST + embeddings) increasingly rivals parameter scaling for quality gains.'
    },
    {
      key: 'science',
      label: 'Science/Bio',
      accent: 'alignment',
      description:
        'Protein folding, molecular design, genomics & medical reasoning—structured + sequence modalities.',
      models: [
        'AlphaFold2',
        'AF-Multimer',
        'ESM-2',
        'GNoME',
        'Fractal',
        'Med-PaLM 2',
        'GenSLM',
        'BioGPT',
        'PubMedBERT',
        'MolMistral',
        'TimeGPT'
      ],
      adaptation: [
        'Domain fine‑tune on curated sets',
        'Structure-conditioned generation',
        'Active learning loops',
        'Knowledge graph integration',
        'Safety filtering'
      ],
      metrics: { maturity: 3, ecosystem: 3, dataBreadth: 2, alignmentNeed: 5 },
      insight: 'Data quality and provenance dominate performance more than raw parameter count.'
    },
    {
      key: 'multimodal',
      label: 'Unified',
      accent: 'foundations',
      description:
        'Single backbone integrates text, vision, audio (and sometimes video) via shared tokenization or adapters.',
      models: [
        'Gemini 2.5 Pro',
        'GPT‑5',
        'GPT‑4.5',
        'GPT‑4o',
        'Claude 3.5 Sonnet',
        'Qwen2-VL',
        'InternVL 2',
        'LLaVA 1.6',
        'Fuyu',
        'InstructBLIP',
        'MiniCPM-V'
      ],
      adaptation: [
        'Prompt routing',
        'Cross-modal RAG',
        'Low-rank fusion adapters',
        'Task-specific instruction tuning',
        'Tool-augmented reasoning'
      ],
      metrics: { maturity: 4, ecosystem: 4, dataBreadth: 5, alignmentNeed: 5 },
      insight: 'Unified models enable emergent cross-modal grounding & reduce duplicated param budgets.'
    },
    {
      key: 'robotics',
      label: 'Robotics/VLA',
      accent: 'scaling',
      description:
        'Vision-Language-Action models mapping perceptual streams to control tokens / trajectories.',
      models: [
        'RT‑2',
        'RT‑X',
        'OpenVLA',
        'RoboCat',
        'PaLM‑E',
        'Octo',
        'GR00T',
        'ALOHA',
        'Mobile ALOHA',
        'MimicGen'
      ],
      adaptation: [
        'Imitation fine‑tune',
        'Sim2Real domain adaptation',
        'Goal-conditioned prompts',
        'Embodied RAG (scene memory)',
        'Safety constraint layers'
      ],
      metrics: { maturity: 2, ecosystem: 2, dataBreadth: 2, alignmentNeed: 5 },
      insight: 'Bottleneck: high-quality, diverse action datasets → scaling laws emerging for embodied tasks.'
    }
  ];

  const buttonsHost = document.getElementById('q34-category-buttons');
  const overviewEl = document.getElementById('q34-overview');
  const adaptEl = document.getElementById('q34-adaptation');
  const metricsEl = document.getElementById('q34-metrics');
  const insightEl = document.getElementById('q34-insight');

  if (!buttonsHost || !overviewEl || !adaptEl || !metricsEl || !insightEl) {
    return;
  }

  const metricBar = (label, value, accent) => {
    const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
    return `
      <div class="q34-metric" data-accent="${accent}" role="group" aria-label="${label} score ${value} of 5">
        <div class="q34-metric-header"><span>${label}</span><span>${value}/5</span></div>
        <div class="q34-track"><div class="q34-fill" style="--metric-value:${pct}%;" aria-hidden="true"></div></div>
      </div>
    `;
  };

  const render = (cat) => {
    overviewEl.innerHTML = `
      <div class="space-y-2">
        <div><strong>Description:</strong> ${cat.description}</div>
        <div><strong>Representative models:</strong> <span class="font-mono text-xs">${cat.models.join(', ')}</span></div>
      </div>
    `;

    adaptEl.innerHTML = `<ul class="list-disc ml-5 space-y-1">${cat.adaptation
      .map((item) => `<li>${item}</li>`)
      .join('')}</ul>`;

    metricsEl.innerHTML = `
      ${metricBar('Maturity', cat.metrics.maturity, cat.accent)}
      ${metricBar('Ecosystem', cat.metrics.ecosystem, cat.accent)}
      ${metricBar('Data breadth', cat.metrics.dataBreadth, cat.accent)}
      ${metricBar('Alignment need', cat.metrics.alignmentNeed, cat.accent)}
      <p class="q34-footnote mt-2">Qualitative 1–5 heuristic scores (higher = more / stronger).</p>
    `;

    insightEl.innerHTML = cat.insight;
  };

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'q34-option';
    btn.dataset.accent = cat.accent;
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = `<span class="q34-dot" aria-hidden="true"></span><span>${cat.label}</span>`;
    btn.addEventListener('click', () => {
      buttonsHost.querySelectorAll('button').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      render(cat);
    });
    buttonsHost.appendChild(btn);
  });

  render(categories[0]);
  const first = buttonsHost.querySelector('button');
  if (first) {
    first.classList.add('is-active');
    first.setAttribute('aria-pressed', 'true');
  }

  setTimeout(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, 50);
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question34Interactive = interactiveScript;
}
