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
    ]
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
    ]
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
    ]
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
    ]
  },
  "techqa": {
    "label": "TechQA",
    "summary": "Technical support docs with long explanation-heavy answers.",
    "recall": {
      "stella": {
        "64": 0.0486,
        "128": 0.165,
        "256": 0.3995,
        "512": 0.6138,
        "1024": 0.6192
      },
      "snowflake": {
        "64": 0.0445,
        "128": 0.1838,
        "256": 0.4284,
        "512": 0.5811,
        "1024": 0.7154
      }
    },
    "meta": [
      {
        "label": "Doc length",
        "value": "~7.6k tokens",
        "note": "Enterprise KB articles stitched into long dossiers."
      },
      {
        "label": "Answer length",
        "value": "~47 tokens",
        "note": "Multi-step procedures and rationale."
      },
      {
        "label": "Domain",
        "value": "Support / troubleshooting",
        "note": "Expect references to logs, configs, versions."
      }
    ],
    "actions": [
      "Jump directly to 512\u20131024 token chunks; anything smaller loses the resolution needed.",
      "Backfill with tool-based retrieval (e.g., config filters) to reduce irrelevant paragraphs.",
      "Budget for higher latency\u2014large chunks increase index size and scoring cost."
    ]
  },
  "narrativeqa": {
    "label": "NarrativeQA",
    "summary": "Movie/novel summaries; answers scatter across long narratives.",
    "recall": {
      "stella": {
        "64": 0.042,
        "128": 0.0571,
        "256": 0.079,
        "512": 0.0894,
        "1024": 0.1071
      },
      "snowflake": {
        "64": 0.0343,
        "128": 0.0469,
        "256": 0.0616,
        "512": 0.0894,
        "1024": 0.1041
      }
    },
    "meta": [
      {
        "label": "Doc length",
        "value": "~52k tokens",
        "note": "Full narrative summaries\u2014very long context."
      },
      {
        "label": "Answer length",
        "value": "~13 tokens",
        "note": "Descriptive answers referencing multiple scenes."
      },
      {
        "label": "Q per doc",
        "value": "~2",
        "note": "Sparse supervision; retrieval must scan widely."
      }
    ],
    "actions": [
      "Adopt 1024-token chunks plus aggressive reranking to surface narrative-wide spans.",
      "Cache intermediate embeddings\u2014documents are huge and costly to index.",
      "Audit hallucinations: long narratives tempt models to fabricate connecting details."
    ]
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

  const formatPercent = value => (Math.round(value * 1000) / 10) + '%';

  const setActiveEmbed = embed => {
    currentEmbed = embed;
    embedButtons.forEach(btn => {
      const isActive = btn.dataset.embed === embed;
      btn.classList.toggle('bg-indigo-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-indigo-600', isActive);
      btn.classList.toggle('shadow-sm', isActive);
    });
  };

  const buildChart = (dataset, embed, selectedChunk) => {
    const recalls = dataset.recall[embed];
    chartEl.innerHTML = CHUNK_SIZES.map(size => {
      const value = recalls[String(size)] || 0;
      const percent = Math.round(value * 1000) / 10;
      const width = Math.max(6, percent);
      const active = size === selectedChunk;
      return '<div class="flex items-center gap-3">'
        + '<span class="w-14 font-mono text-indigo-800">' + size + '</span>'
        + '<div class="flex-1 h-3 rounded-full bg-indigo-200 overflow-hidden">'
        + '<div class="h-full ' + (active ? 'bg-indigo-600' : 'bg-indigo-400') + ' transition-all duration-300" style="width:' + width + '%"></div>'
        + '</div>'
        + '<span class="w-16 text-right font-mono text-indigo-900">' + percent.toFixed(1) + '%</span>'
        + '</div>';
    }).join('');
  };

  const renderMeta = dataset => {
    metaEl.innerHTML = dataset.meta.map(item => {
      return ['<div class="bg-slate-100 border border-slate-200 rounded-md p-3 space-y-1">',
        '<p class="text-[11px] font-semibold text-slate-600 uppercase">' + item.label + '</p>',
        '<p class="text-sm text-slate-900 font-medium">' + item.value + '</p>',
        '<p class="text-[11px] text-slate-600">' + item.note + '</p>',
      '</div>'].join('');
    }).join('');
  };

  const renderActions = dataset => {
    actionsEl.innerHTML = dataset.actions.map(text => '<li>' + text + '</li>').join('');
  };

  const update = () => {
    const dataset = datasets[currentDatasetKey];
    const chunkSize = CHUNK_SIZES[currentChunkIndex];
    const recalls = dataset.recall[currentEmbed];
    const recall = recalls[String(chunkSize)] || 0;
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
    recallEl.textContent = formatPercent(recall);

    buildChart(dataset, currentEmbed, chunkSize);
    renderMeta(dataset);
    renderActions(dataset);

    const statements = [];
    statements.push(dataset.label + ' • ' + EMBED_LABELS[currentEmbed] + ' → ' + formatPercent(recall) + ' recall@1 at ' + chunkSize + ' tokens.');

    if (chunkSize === bestChunk) {
      statements.push('You are at the paper’s peak for this embedder: ' + formatPercent(bestRecall) + ' recall with ' + bestChunk + '-token chunks.');
    } else {
      const delta = Math.round((bestRecall - recall) * 1000) / 10;
      statements.push('Peak recall is ' + formatPercent(bestRecall) + ' at ' + bestChunk + ' tokens, so this setting sits ' + delta.toFixed(1) + ' points lower.');
    }

    if (otherBestRecall > 0) {
      statements.push(EMBED_LABELS[otherEmbed] + ' peaks at ' + formatPercent(otherBestRecall) + ' with ' + otherBestChunk + ' tokens—use that when swapping retrievers.');
    }

    statements.push(dataset.summary);

    observationsEl.innerHTML = statements.map(sentence => '<p>' + sentence + '</p>').join('');
  };

  datasetSelect.addEventListener('change', event => {
    currentDatasetKey = event.target.value;
    update();
  });

  embedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveEmbed(btn.dataset.embed);
      update();
    });
  });

  chunkSlider.addEventListener('input', event => {
    currentChunkIndex = Number(event.target.value);
    update();
  });

  setActiveEmbed(currentEmbed);
  chunkSlider.value = currentChunkIndex;
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
