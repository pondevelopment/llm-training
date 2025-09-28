const interactiveScript = () => {
  const root = document.getElementById('p03-explorer');
  if (!root) return;

  const CHUNK_SIZES = [64, 128, 256, 512, 1024];
  const EMBED_LABELS = {
    stella: 'Stella (decoder)',
    snowflake: 'Snowflake (encoder)'
  };

  const datasets = {
    "squad": {
      "label": "SQuAD",
      "summary": "Short factoid answers in structured Wikipedia passages; answer spans stay local.",
      "recall": {
        "stella": {
          "64": 0.6419,
          "128": 0.6162,
          "256": 0.5662,
          "512": 0.4979,
          "1024": 0.3855
        },
        "snowflake": {
          "64": 0.6087,
          "128": 0.6,
          "256": 0.5388,
          "512": 0.4621,
          "1024": 0.4294
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~8k tokens",
          "note": "Wikipedia sections stitched to ~8k tokens per doc."
        },
        {
          "label": "Answer length",
          "value": "~4 tokens",
          "note": "Entity-level answers; expect tight spans."
        },
        {
          "label": "Questions per doc",
          "value": "\u224844",
          "note": "High density means many similar snippets."
        }
      ],
      "actions": [
        "Default to 64\u2013128 token chunks; larger windows add noise and drop recall ~20 points.",
        "If recall dips, add overlap or lexical filters instead of expanding chunk size.",
        "Audit latency\u2014small windows keep embedding batches cheap."
      ],
      "tweaks": {
        "vectorMultiplier": 0.025,
        "rerankerBonus": 0.055,
        "retentionPenalty": 0.06
      }
    },
    "covidqa": {
      "label": "COVID-QA",
      "summary": "Biomedical abstracts with moderate answers; terminology is dense and multi-sentence.",
      "recall": {
        "stella": {
          "64": 0.5212,
          "128": 0.4181,
          "256": 0.4242,
          "512": 0.406,
          "1024": 0.3075
        },
        "snowflake": {
          "64": 0.3899,
          "128": 0.5324,
          "256": 0.4087,
          "512": 0.4318,
          "1024": 0.5421
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~10k tokens",
          "note": "Long biomedical articles with technical prose."
        },
        {
          "label": "Answer length",
          "value": "~11 tokens",
          "note": "Definitions and findings span multiple clauses."
        },
        {
          "label": "Q per doc",
          "value": "\u22482",
          "note": "Low density; answers may be scattered."
        }
      ],
      "actions": [
        "Pair embedder choice with chunking: Stella prefers 64 tokens, Snowflake peaks at 1024.",
        "Enable passage overlap or rerankers when using large chunks to combat noise.",
        "Track biomedical synonym recall\u2014string matching underrates true relevance."
      ],
      "tweaks": {
        "vectorMultiplier": 0.045,
        "rerankerBonus": 0.035,
        "retentionPenalty": 0.045
      }
    },
    "newsqa": {
      "label": "NewsQA",
      "summary": "News articles with medium-length answers; questions cluster around key events.",
      "recall": {
        "stella": {
          "64": 0.378,
          "128": 0.4395,
          "256": 0.4906,
          "512": 0.5595,
          "1024": 0.5202
        },
        "snowflake": {
          "64": 0.3204,
          "128": 0.4156,
          "256": 0.4448,
          "512": 0.5734,
          "1024": 0.6668
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~8.5k tokens",
          "note": "Multi-paragraph news stories stitched to long docs."
        },
        {
          "label": "Answer length",
          "value": "~5 tokens",
          "note": "Entity + short phrase answers."
        },
        {
          "label": "Q per doc",
          "value": "\u224812",
          "note": "Multiple questions hit similar regions\u2014overlap helps."
        }
      ],
      "actions": [
        "Start at 512-token chunks; both models improve steadily up to that range.",
        "Consider dual-chunk indexing (128 + 512) if precision vs. recall trade-offs matter.",
        "Log recall per desk/topic\u2014event-heavy pieces may need larger windows."
      ],
      "tweaks": {
        "vectorMultiplier": 0.05,
        "rerankerBonus": 0.04,
        "retentionPenalty": 0.05
      }
    },
    "nq": {
      "label": "Natural Questions",
      "summary": "Real search queries over web documents; answer locality varies widely.",
      "recall": {
        "stella": {
          "64": 0.1718,
          "128": 0.222,
          "256": 0.3228,
          "512": 0.3854,
          "1024": 0.3493
        },
        "snowflake": {
          "64": 0.15,
          "128": 0.204,
          "256": 0.2634,
          "512": 0.3895,
          "1024": 0.4774
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~6.9k tokens",
          "note": "Heterogeneous web pages with markup noise."
        },
        {
          "label": "Answer length",
          "value": "~7 tokens",
          "note": "Mix of short factoids and longer descriptions."
        },
        {
          "label": "Q per doc",
          "value": "~1",
          "note": "Single question per document\u2014low redundancy."
        }
      ],
      "actions": [
        "Benchmark both 512 and 1024 token chunks\u2014the sweet spot differs per embedder.",
        "Route low-confidence retrievals to fallback search; variance is high across pages.",
        "Monitor crawl freshness; stitched pages may age poorly."
      ],
      "tweaks": {
        "vectorMultiplier": 0.06,
        "rerankerBonus": 0.03,
        "retentionPenalty": 0.045
      }
    },
    "techqa": {
      "label": "TechQA",
      "summary": "Internal support tickets with long-form answers across multiple systems.",
      "recall": {
        "stella": {
          "64": 0.0571,
          "128": 0.0914,
          "256": 0.219,
          "512": 0.7152,
          "1024": 0.7058
        },
        "snowflake": {
          "64": 0.0408,
          "128": 0.0768,
          "256": 0.1428,
          "512": 0.6128,
          "1024": 0.6778
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~11k tokens",
          "note": "Multi-system investigations frequently span several pages."
        },
        {
          "label": "Answer length",
          "value": "~18 tokens",
          "note": "Resolutions recap steps, logs, and mitigations."
        },
        {
          "label": "Support pressure",
          "value": "High",
          "note": "Analysts expect the first pass to surface the full root cause."
        }
      ],
      "actions": [
        "Jump directly to 512-token windows; smaller chunks miss multi-system context.",
        "Blend embeddings with metadata filters so platform/team tags cut down search space.",
        "Cache intermediate embeddings\u2014documents are huge and costly to index.",
        "Audit hallucinations: long narratives tempt models to fabricate connecting details."
      ],
      "tweaks": {
        "vectorMultiplier": 0.07,
        "rerankerBonus": 0.025,
        "retentionPenalty": 0.05
      }
    },
    "narrativeqa": {
      "label": "NarrativeQA",
      "summary": "Novel-like plot summaries where answers can span paragraphs.",
      "recall": {
        "stella": {
          "64": 0.045,
          "128": 0.0639,
          "256": 0.081,
          "512": 0.1071,
          "1024": 0.1318
        },
        "snowflake": {
          "64": 0.0401,
          "128": 0.0597,
          "256": 0.0796,
          "512": 0.1054,
          "1024": 0.1098
        }
      },
      "meta": [
        {
          "label": "Doc length",
          "value": "~12k tokens",
          "note": "Plot synopses stitched from multiple sources."
        },
        {
          "label": "Answer length",
          "value": "~23 tokens",
          "note": "Narrative answers recap scenes across paragraphs."
        },
        {
          "label": "Support / troubleshooting",
          "value": "Story arcs",
          "note": "Expect the answer span to cross multiple adjacent windows."
        }
      ],
      "actions": [
        "Keep chunk windows wide (512–1024 tokens) to capture whole story beats.",
        "Use overlap so adjacent passages still contain the full scene.",
        "Index plot summaries and character sheets separately to anchor retrieval.",
        "Ask downstream QA to cite offsets; hallucinated bridges are a known failure mode."
      ],
      "tweaks": {
        "vectorMultiplier": 0.08,
        "rerankerBonus": 0.02,
        "retentionPenalty": 0.035
      }
    }
  };

  let currentDatasetKey = 'squad';
  let currentEmbed = 'stella';
  let currentChunkIndex = 0;

  const datasetSelect = document.getElementById('p03-dataset');
  const embedButtons = Array.from(document.querySelectorAll('.p03-embed-toggle'));
  const chunkSlider = document.getElementById('p03-chunk');
  const chunkLabel = document.getElementById('p03-chunk-label');
  const recallEl = document.getElementById('p03-recall');
  const chartEl = document.getElementById('p03-chart');
  const observationsEl = document.getElementById('p03-observations');
  const metaEl = document.getElementById('p03-dataset-meta');
  const actionsEl = document.getElementById('p03-actions');
  const vectorsInput = document.getElementById('p03-vectors');
  const vectorsLabel = document.getElementById('p03-vectors-label');
  const rerankerInput = document.getElementById('p03-reranker');
  const retentionInput = document.getElementById('p03-retention');
  const retentionLabel = document.getElementById('p03-retention-label');

  const formatVectorsLabel = value => value === 1 ? '1 vector' : value + ' vectors';
  const formatRetentionLabel = value => value + '%';
  const formatPercent = value => (Math.round(value * 1000) / 10) + '%';

  const setActiveEmbed = embed => {
    currentEmbed = embed;
    embedButtons.forEach(btn => {
      const isActive = btn.dataset.embed === embed;
      btn.classList.toggle('bg-indigo-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-indigo-500', isActive);
      btn.classList.toggle('shadow-sm', isActive);
      btn.classList.toggle('hover:bg-indigo-500', isActive);
      btn.classList.toggle('bg-card', !isActive);
      btn.classList.toggle('text-secondary', !isActive);
      btn.classList.toggle('border-subtle', !isActive);
      btn.classList.toggle('hover:bg-subtle', !isActive);
    });
  };

  const buildChart = (dataset, embed, selectedChunk) => {
    const recalls = dataset.recall[embed];
    chartEl.innerHTML = CHUNK_SIZES.map(size => {
      const value = recalls[String(size)] || 0;
      const percent = Math.round(value * 1000) / 10;
      const width = Math.min(100, Math.max(6, percent));
      const active = size === selectedChunk;
      const barClass = active
        ? 'bg-indigo-600 dark:bg-indigo-400'
        : 'bg-indigo-400 dark:bg-indigo-500/50';
      return [
        '<div class="flex items-center gap-3">',
        '<span class="w-14 font-mono text-indigo-700 dark:text-indigo-200">' + size + '</span>',
        '<div class="flex-1 h-3 rounded-full bg-indigo-200 dark:bg-indigo-950/40 overflow-hidden">',
        '<div class="h-full ' + barClass + ' transition-all duration-300" style="width:' + width + '%"></div>',
        '</div>',
        '<span class="w-16 text-right font-mono text-indigo-900 dark:text-indigo-100">' + percent.toFixed(1) + '%</span>',
        '</div>'
      ].join('');
    }).join('');
  };

  const renderMeta = dataset => {
    metaEl.innerHTML = dataset.meta.map(item => {
      return ['<div class="bg-card border border-subtle dark:border-slate-700 rounded-lg p-3 space-y-2 transition-colors">',
        '<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">' + item.label + '</p>',
        '<p class="text-sm font-medium text-heading">' + item.value + '</p>',
        '<p class="text-[11px] text-muted-soft">' + item.note + '</p>',
      '</div>'].join('');
    }).join('');
  };

  const renderActions = dataset => {
    actionsEl.innerHTML = dataset.actions.map(text => '<li class="leading-snug">' + text + '</li>').join('');
  };

  const applyTweaks = (baseRecall, dataset, controls) => {
    // Heuristic adjustments that mirror the paper's qualitative findings.
    const config = dataset.tweaks || {};
    const vectors = controls.vectors || 1;
    const rerankerOn = Boolean(controls.reranker);
    const retention = controls.retention || 100;

    let adjusted = baseRecall;

    const extraVectors = Math.max(0, vectors - 1);
    if (extraVectors > 0 && config.vectorMultiplier) {
      adjusted += baseRecall * extraVectors * config.vectorMultiplier;
    }

    if (rerankerOn && config.rerankerBonus) {
      adjusted += config.rerankerBonus;
    }

    if (retention < 100 && config.retentionPenalty) {
      const penaltySteps = (100 - retention) / 5; // Slider moves in 5% increments.
      adjusted -= baseRecall * penaltySteps * config.retentionPenalty;
    }

    return Math.max(0, Math.min(adjusted, 0.98));
  };

  const update = () => {
    const dataset = datasets[currentDatasetKey];
    const chunkSize = CHUNK_SIZES[currentChunkIndex];
    const recalls = dataset.recall[currentEmbed];
    const recall = recalls[String(chunkSize)] || 0;
    const vectors = vectorsInput ? Number(vectorsInput.value) : 1;
    const rerankerOn = rerankerInput ? rerankerInput.checked : false;
    const retention = retentionInput ? Number(retentionInput.value) : 100;
    const controls = { vectors, reranker: rerankerOn, retention };
    const tunedRecall = applyTweaks(recall, dataset, controls);

    const bestChunk = CHUNK_SIZES.reduce((best, size) => {
      const bestVal = recalls[String(best)] || -Infinity;
      const currentVal = recalls[String(size)] || -Infinity;
      return currentVal > bestVal ? size : best;
    }, CHUNK_SIZES[0]);
    const bestRecall = recalls[String(bestChunk)] || 0;
    const otherEmbed = currentEmbed === 'stella' ? 'snowflake' : 'stella';
    const otherRecalls = dataset.recall[otherEmbed];
    const otherBestChunk = CHUNK_SIZES.reduce((best, size) => {
      const bestVal = otherRecalls[String(best)] || -Infinity;
      const currentVal = otherRecalls[String(size)] || -Infinity;
      return currentVal > bestVal ? size : best;
    }, CHUNK_SIZES[0]);
    const otherBestRecall = otherRecalls[String(otherBestChunk)] || 0;

    chunkLabel.textContent = chunkSize;
    const baseDisplay = formatPercent(recall);
    const tunedDisplay = formatPercent(tunedRecall);

    if (Math.abs(tunedRecall - recall) > 0.0005) {
      recallEl.textContent = baseDisplay + ' \u2192 ' + tunedDisplay;
    } else {
      recallEl.textContent = baseDisplay;
    }

    buildChart(dataset, currentEmbed, chunkSize);
    renderMeta(dataset);
    renderActions(dataset);

    const statements = [];
    statements.push(dataset.label + ' • ' + EMBED_LABELS[currentEmbed] + ' → ' + baseDisplay + ' recall@1 at ' + chunkSize + ' tokens.');

    if (chunkSize === bestChunk) {
      statements.push('You are at the paper’s peak for this embedder: ' + formatPercent(bestRecall) + ' recall with ' + bestChunk + '-token chunks.');
    } else {
      const delta = Math.round((bestRecall - recall) * 1000) / 10;
      statements.push('Peak recall is ' + formatPercent(bestRecall) + ' at ' + bestChunk + ' tokens, so this setting sits ' + delta.toFixed(1) + ' points lower.');
    }

    if (otherBestRecall > 0) {
      statements.push(EMBED_LABELS[otherEmbed] + ' peaks at ' + formatPercent(otherBestRecall) + ' with ' + otherBestChunk + ' tokens—use that when swapping retrievers.');
    }

    const tunedDelta = Math.round((tunedRecall - recall) * 1000) / 10;
    if (Math.abs(tunedDelta) >= 0.1) {
      const tweakParts = [];
      if (vectors > 1) tweakParts.push(formatVectorsLabel(vectors));
      if (rerankerOn) tweakParts.push('reranker on');
      if (retention < 100) tweakParts.push(formatRetentionLabel(retention));
      if (tweakParts.length === 0) tweakParts.push('baseline controls');
      const direction = tunedDelta > 0 ? '+' : '';
      statements.push('Current tweaks (' + tweakParts.join(', ') + ') project ' + tunedDisplay + ' recall — ' + direction + tunedDelta.toFixed(1) + ' pts vs. base.');
    } else if (vectors > 1 || rerankerOn || retention < 100) {
      statements.push('Tweaks barely shift this configuration; the base recall still dominates.');
    }

    statements.push(dataset.summary);

    observationsEl.innerHTML = statements.map(sentence => '<p class="leading-relaxed">' + sentence + '</p>').join('');
  };

  datasetSelect?.addEventListener('change', event => {
    currentDatasetKey = event.target.value;
    update();
  });

  embedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveEmbed(btn.dataset.embed);
      update();
    });
  });

  chunkSlider?.addEventListener('input', event => {
    currentChunkIndex = Number(event.target.value);
    update();
  });

  if (vectorsInput && vectorsLabel) {
    const syncVectors = value => {
      vectorsLabel.textContent = formatVectorsLabel(value);
    };
    syncVectors(Number(vectorsInput.value));
    vectorsInput.addEventListener('input', event => {
      const value = Number(event.target.value);
      syncVectors(value);
      update();
    });
  }

  if (retentionInput && retentionLabel) {
    const syncRetention = value => {
      retentionLabel.textContent = formatRetentionLabel(value);
    };
    syncRetention(Number(retentionInput.value));
    retentionInput.addEventListener('input', event => {
      const value = Number(event.target.value);
      syncRetention(value);
      update();
    });
  }

  rerankerInput?.addEventListener('change', () => {
    update();
  });

  setActiveEmbed(currentEmbed);
  if (chunkSlider) {
    chunkSlider.value = currentChunkIndex;
  }
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
