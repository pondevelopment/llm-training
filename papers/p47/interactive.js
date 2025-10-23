(function() {
  'use strict';
  
  // Data from SeeTok paper (Tables 2, 3, 7, Figure 3)
  const languageData = {
    // High-resource languages
    en: {
      name: 'English',
      category: 'high-resource',
      textFertility: 1.88,
      visualFertility: 0.42,
      compression: 4.43,
      description: 'High-resource language with extensive BPE vocabulary coverage. Still shows 4.43× compression with vision tokenization due to patch-based efficiency.'
    },
    de: {
      name: 'German',
      category: 'high-resource',
      textFertility: 2.15,
      visualFertility: 0.38,
      compression: 5.66,
      description: 'Compound words increase text token count. Vision tokenization treats compounds uniformly, yielding 5.66× compression.'
    },
    zh: {
      name: 'Chinese',
      category: 'high-resource',
      textFertility: 2.42,
      visualFertility: 0.34,
      compression: 7.12,
      description: 'Logographic script; BPE struggles with character combinations. Vision tokenization excels: 7.12× compression, strong translation quality gains (+31.45 COMET).'
    },
    ru: {
      name: 'Russian',
      category: 'high-resource',
      textFertility: 2.28,
      visualFertility: 0.39,
      compression: 5.85,
      description: 'Cyrillic script with rich morphology. Vision tokenization achieves 5.85× compression and outperforms text tokenization on translation tasks.'
    },
    cs: {
      name: 'Czech',
      category: 'high-resource',
      textFertility: 2.54,
      visualFertility: 0.36,
      compression: 7.06,
      description: 'Highly inflected language. BPE fragments morphological variations; vision tokenization achieves 7.06× compression with uniform treatment.'
    },
    is: {
      name: 'Icelandic',
      category: 'high-resource',
      textFertility: 2.61,
      visualFertility: 0.37,
      compression: 7.05,
      description: 'Complex morphology and compound words. Vision tokenization compresses 7.05×, avoiding BPE over-segmentation of rare word forms.'
    },
    
    // Low-resource languages
    ka: {
      name: 'Georgian',
      category: 'low-resource',
      textFertility: 8.33,
      visualFertility: 0.64,
      compression: 13.05,
      description: 'Extreme over-segmentation with text tokenization (8.33 tokens/word, nearly character-level). Vision tokenization achieves 13.05× compression—largest gain in paper.'
    },
    ky: {
      name: 'Kyrgyz',
      category: 'low-resource',
      textFertility: 4.95,
      visualFertility: 0.50,
      compression: 9.91,
      description: 'Turkic language with limited BPE coverage. Vision tokenization achieves 9.91× compression, treating Kyrgyz script with same efficiency as English.'
    },
    uz: {
      name: 'Uzbek',
      category: 'low-resource',
      textFertility: 5.97,
      visualFertility: 0.48,
      compression: 12.46,
      description: 'Latin-script Turkic language. BPE fragments into 5.97 tokens/word; vision tokenization compresses 12.46× with 0.48 fertility.'
    },
    lt: {
      name: 'Lithuanian',
      category: 'low-resource',
      textFertility: 3.45,
      visualFertility: 0.44,
      compression: 7.84,
      description: 'Baltic language with complex declension. Vision tokenization achieves 7.84× compression, avoiding morphological fragmentation.'
    },
    lv: {
      name: 'Latvian',
      category: 'low-resource',
      textFertility: 3.28,
      visualFertility: 0.42,
      compression: 7.81,
      description: 'Related to Lithuanian; similar compression gains (7.81×) with vision tokenization treating morphological variants uniformly.'
    },
    bg: {
      name: 'Bulgarian',
      category: 'low-resource',
      textFertility: 2.94,
      visualFertility: 0.41,
      compression: 7.17,
      description: 'Cyrillic script with limited vocabulary coverage. Vision tokenization achieves 7.17× compression with script-agnostic processing.'
    },
    mk: {
      name: 'Macedonian',
      category: 'low-resource',
      textFertility: 3.12,
      visualFertility: 0.43,
      compression: 7.26,
      description: 'South Slavic language using Cyrillic. Vision tokenization compresses 7.26×, avoiding BPE bias toward high-resource Cyrillic (Russian).'
    },
    mg: {
      name: 'Malagasy',
      category: 'low-resource',
      textFertility: 3.67,
      visualFertility: 0.46,
      compression: 7.98,
      description: 'Austronesian language with Latin script. Vision tokenization achieves 7.98× compression despite limited BPE vocabulary allocation.'
    }
  };

  // Perturbation impact data (approximated from paper Section 4.4)
  const perturbationImpact = {
    none: {
      textTokenIncrease: 0,
      textPerformanceDrop: 0,
      visualTokenIncrease: 0,
      visualPerformanceDrop: 0
    },
    light: {
      textTokenIncrease: 0.08, // 8% more tokens due to typo fragmentation
      textPerformanceDrop: 0.12, // 12% performance drop
      visualTokenIncrease: 0.01, // 1% token increase (minimal)
      visualPerformanceDrop: 0.03 // 3% performance drop (maintains word shape)
    },
    moderate: {
      textTokenIncrease: 0.22, // 22% more tokens
      textPerformanceDrop: 0.28, // 28% performance drop
      visualTokenIncrease: 0.02, // 2% token increase
      visualPerformanceDrop: 0.07 // 7% performance drop
    },
    heavy: {
      textTokenIncrease: 0.45, // 45% more tokens (severe fragmentation)
      textPerformanceDrop: 0.52, // 52% performance drop
      visualTokenIncrease: 0.04, // 4% token increase
      visualPerformanceDrop: 0.15 // 15% performance drop (holistic shape preserved)
    }
  };

  function init() {
    const languageSelect = document.getElementById('p47-language');
    const textLengthSlider = document.getElementById('p47-text-length');
    const perturbationSelect = document.getElementById('p47-perturbation');

    if (!languageSelect || !textLengthSlider || !perturbationSelect) {
      console.warn('Paper 47 interactive elements not yet in DOM, skipping initialization');
      return;
    }

    languageSelect.addEventListener('change', updateUI);
    textLengthSlider.addEventListener('input', updateUI);
    perturbationSelect.addEventListener('change', updateUI);

    updateUI();
  }

  function updateUI() {
    const languageSelect = document.getElementById('p47-language');
    const textLengthSlider = document.getElementById('p47-text-length');
    const perturbationSelect = document.getElementById('p47-perturbation');

    if (!languageSelect || !textLengthSlider || !perturbationSelect) {
      return;
    }

    const language = languageSelect.value;
    const textLength = parseInt(textLengthSlider.value);
    const perturbation = perturbationSelect.value;

    const langData = languageData[language];
    const perturbData = perturbationImpact[perturbation];
    
    // Calculate base token counts
    const baseTextTokens = Math.round(textLength * langData.textFertility);
    const baseVisualTokens = Math.round(textLength * langData.visualFertility);
    
    // Apply perturbation impact
    const textTokens = Math.round(baseTextTokens * (1 + perturbData.textTokenIncrease));
    const visualTokens = Math.round(baseVisualTokens * (1 + perturbData.visualTokenIncrease));
    
    const compression = (textTokens / visualTokens).toFixed(2);

    // Update slider label
    const textLengthValueEl = document.getElementById('p47-text-length-value');
    if (textLengthValueEl) {
      textLengthValueEl.textContent = `${textLength} words`;
    }

    // Update language description
    const langDescEl = document.getElementById('p47-language-description');
    if (langDescEl) {
      langDescEl.textContent = langData.description;
    }

    // Update token counts
    const textTokensEl = document.getElementById('p47-text-tokens');
    const visualTokensEl = document.getElementById('p47-visual-tokens');
    const compressionEl = document.getElementById('p47-compression');

    if (textTokensEl) textTokensEl.textContent = textTokens.toLocaleString();
    if (visualTokensEl) visualTokensEl.textContent = visualTokens.toLocaleString();
    if (compressionEl) compressionEl.textContent = `${compression}×`;

    // Update fertility displays
    const textFertilityEl = document.getElementById('p47-text-fertility');
    const visualFertilityEl = document.getElementById('p47-visual-fertility');
    const efficiencyGainEl = document.getElementById('p47-efficiency-gain');

    if (textFertilityEl) {
      const adjustedTextFertility = (langData.textFertility * (1 + perturbData.textTokenIncrease)).toFixed(2);
      textFertilityEl.textContent = `Fertility: ${adjustedTextFertility} tokens/word`;
    }
    if (visualFertilityEl) {
      const adjustedVisualFertility = (langData.visualFertility * (1 + perturbData.visualTokenIncrease)).toFixed(2);
      visualFertilityEl.textContent = `Fertility: ${adjustedVisualFertility} tokens/word`;
    }
    if (efficiencyGainEl) {
      efficiencyGainEl.textContent = `70.5% lower FLOPs, 33.5% faster latency`;
    }

    // Update robustness analysis
    updateRobustness(perturbData, langData.category);

    // Update insights
    updateInsights(langData, textLength, textTokens, visualTokens, parseFloat(compression), perturbation, perturbData);
  }

  function updateRobustness(perturbData, category) {
    const textRobustnessEl = document.getElementById('p47-text-robustness');
    const visualRobustnessEl = document.getElementById('p47-visual-robustness');

    if (!textRobustnessEl || !visualRobustnessEl) return;

    const textTokenIncreasePct = (perturbData.textTokenIncrease * 100).toFixed(0);
    const textPerfDropPct = (perturbData.textPerformanceDrop * 100).toFixed(0);
    const visualTokenIncreasePct = (perturbData.visualTokenIncrease * 100).toFixed(0);
    const visualPerfDropPct = (perturbData.visualPerformanceDrop * 100).toFixed(0);

    textRobustnessEl.innerHTML = `
      <p><strong>Token count increase:</strong> +${textTokenIncreasePct}%</p>
      <p><strong>Performance drop:</strong> -${textPerfDropPct}%</p>
      <p class="text-muted mt-2">Typos fragment words into unpredictable subword sequences. Single-character edits can completely change tokenization, disrupting embeddings and attention patterns.</p>
    `;

    visualRobustnessEl.innerHTML = `
      <p><strong>Token count increase:</strong> +${visualTokenIncreasePct}%</p>
      <p><strong>Performance drop:</strong> -${visualPerfDropPct}%</p>
      <p class="text-muted mt-2">Minor character edits affect only local visual features. Overall word shape and salient letter patterns remain intact, enabling robust perception like human reading.</p>
    `;
  }

  function updateInsights(langData, textLength, textTokens, visualTokens, compression, perturbation, perturbData) {
    const insightsContent = document.getElementById('p47-insights-content');
    if (!insightsContent) return;

    const insights = [];

    // Insight 1: Compression magnitude
    if (langData.category === 'low-resource') {
      insights.push(`<strong>Low-resource language advantage:</strong> ${langData.name} achieves ${compression}× compression (${langData.textFertility}→${langData.visualFertility} fertility). BPE vocabulary bias forces near-character-level segmentation (${langData.textFertility} tokens/word), while vision tokenization treats all scripts uniformly (~0.4-0.6 tokens/word regardless of language).`);
    } else {
      insights.push(`<strong>High-resource efficiency:</strong> Even with extensive BPE coverage, ${langData.name} gains ${compression}× compression through vision tokenization. Patch-based processing avoids vocabulary bottlenecks and morphological fragmentation.`);
    }

    // Insight 2: Computational savings
    const flopSavings = ((1 - (visualTokens / textTokens)) * 100).toFixed(1);
    insights.push(`<strong>Inference cost reduction:</strong> ${flopSavings}% fewer tokens translates to ~70% lower FLOPs (attention is O(n²), MLP is O(n)). For ${textLength}-word inputs processed at scale, this compounds to substantial GPU savings. Latency improves 33.5% due to shorter sequences.`);

    // Insight 3: Perturbation robustness
    if (perturbation !== 'none') {
      const robustnessGap = ((perturbData.textPerformanceDrop - perturbData.visualPerformanceDrop) * 100).toFixed(0);
      insights.push(`<strong>Noise robustness:</strong> Under ${perturbation} perturbations, vision tokenization shows ${robustnessGap}pp smaller performance drop than text tokenization. Holistic visual processing mimics human reading—scrambled letters ("typoglycemia") remain recognizable because overall word shape is preserved.`);
    } else {
      insights.push(`<strong>Robustness mechanism:</strong> Try adding input noise (5-30% typos) to see vision tokenization's advantage. Text tokenizers fragment unpredictably on character edits; vision encoders maintain stable representations by processing continuous visual patterns.`);
    }

    // Insight 4: Cross-lingual fairness
    insights.push(`<strong>Multilingual fairness:</strong> Vision tokenization achieves 86% lower fertility across 13 languages (0.34-0.64 range vs 1.88-8.33 for text). No vocabulary engineering required—patch extraction is script-agnostic. Eliminates the painful choice between inadequate low-resource coverage and impractically large vocabularies.`);

    // Insight 5: Practical deployment
    if (langData.category === 'low-resource' && compression > 10) {
      insights.push(`<strong>Deployment viability:</strong> ${compression}× compression makes ${langData.name} economically viable for LLM serving. Context window pressure drops from ${textTokens} to ${visualTokens} tokens; batch throughput increases proportionally. One-time cost: vision-centric instruction tuning on 658K samples (LoRA, 4 epochs, <1 day on 8×A100).`);
    } else {
      insights.push(`<strong>Adoption path:</strong> Start with pretrained MLLM (Qwen2.5-VL 3B/7B or JanusPro). Render text at 224×224 (7px Noto Sans), apply vision-centric instruction tuning on domain corpus (LoRA rank=16, few thousand samples). Measure token count, latency, and task accuracy vs text tokenization baseline.`);
    }

    insightsContent.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
  }

  // Export for paperLoader
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
