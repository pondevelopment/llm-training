// Simple LLM glossary modal with search and tags
(function(){
  const TERMS = [
    { term: 'Attention', cat: 'Core', def: 'Mechanism that weights token interactions, enabling context-dependent representations in transformers.' },
    { term: 'Self-Attention', cat: 'Core', def: 'Attention where queries, keys, and values come from the same sequence (the model attends to itself).'},
    { term: 'Multi-Head Attention', cat: 'Core', def: 'Parallel attention heads capture different relational patterns and are concatenated.'},
    { term: 'Transformer', cat: 'Model', def: 'Architecture based on attention, layer norm, and MLP blocks; backbone of modern LLMs.'},
    { term: 'Layer Normalization', cat: 'Core', def: 'Normalization technique applied across features to stabilize and speed up training.'},
    { term: 'Residual Connection', cat: 'Core', def: 'Skip connection that adds input to block output, improving gradient flow and stability.'},
    { term: 'Decoder-only', cat: 'Model', def: 'Autoregressive transformer using only decoder blocks to predict next tokens.'},
    { term: 'Encoder–Decoder', cat: 'Model', def: 'Seq2seq transformer with encoder producing representations and decoder generating outputs (common in translation).'},
    { term: 'Encoder', cat: 'Model', def: 'Network that processes input to produce contextual representations (used in encoders or hybrid models).'},
    { term: 'Decoder', cat: 'Model', def: 'Autoregressive component that generates tokens, optionally attending to encoder outputs.'},
    { term: 'Embedding', cat: 'Representation', def: 'Dense vector representation of tokens or sequences capturing semantic similarity.'},
    { term: 'Positional Encoding', cat: 'Core', def: 'Adds position information so the model can distinguish token order.'},
    { term: 'Context Window', cat: 'Serving', def: 'Maximum number of tokens the model attends to in one pass.'},
    { term: 'KV Cache', cat: 'Serving', def: 'Caching of key/value tensors across steps to speed up autoregressive generation.'},
    { term: 'Quantization', cat: 'Efficiency', def: 'Representing weights/activations with fewer bits (e.g., INT8/4-bit) to reduce memory and latency.'},
    { term: 'Distillation', cat: 'Efficiency', def: 'Training a smaller student model to mimic a larger teacher, preserving quality while reducing cost.'},
    { term: 'Adapters', cat: 'Training', def: 'Small modules inserted into layers and trained while freezing most base weights (e.g., LoRA).'},
    { term: 'LoRA', cat: 'Training', def: 'Low-Rank Adaptation adds small trainable matrices to freeze most weights, enabling efficient fine-tuning.'},
    { term: 'QLoRA', cat: 'Training', def: 'LoRA techniques applied to quantized base models for even more efficient fine-tuning.'},
    { term: 'PEFT', cat: 'Training', def: 'Parameter-Efficient Fine-Tuning methods (e.g., LoRA, adapters) that train a small subset of parameters.'},
    { term: 'RLHF', cat: 'Alignment', def: 'Reinforcement Learning from Human Feedback aligns model behavior with human preferences.'},
    { term: 'Instruction Tuning', cat: 'Alignment', def: 'Supervised fine-tuning on instruction-following data to improve helpfulness and compliance.'},
    { term: 'Alignment', cat: 'Alignment', def: 'Methods to steer models toward desired behaviors and safety (e.g., instruction tuning, RLHF, policy filters).'},
    { term: 'RAG', cat: 'Retrieval', def: 'Retrieval-Augmented Generation: retrieve external documents to ground responses and reduce hallucination.'},
    { term: 'Hallucination', cat: 'Quality', def: 'Model generates plausible but incorrect or unsupported statements.'},
    { term: 'Perplexity', cat: 'Metric', def: 'Exponentiated average negative log-likelihood; lower is better for language models.'},
    { term: 'Logits', cat: 'Math', def: 'Pre-softmax scores output by a model; converted to probabilities with softmax.'},
    { term: 'Softmax', cat: 'Math', def: 'Function that maps logits to probabilities; used in attention and output layers.'},
    { term: 'Top-k / Top-p', cat: 'Decoding', def: 'Sampling strategies that limit candidate tokens by count (k) or cumulative probability (p).'},
    { term: 'Greedy Decoding', cat: 'Decoding', def: 'Takes the argmax token at each step; fast but can be myopic.'},
    { term: 'Beam Search', cat: 'Decoding', def: 'Keeps multiple candidate sequences and selects the best after exploring a limited breadth.'},
    { term: 'Temperature', cat: 'Decoding', def: 'Scales logits; higher temperature increases randomness and diversity.'},
    { term: 'MoE', cat: 'Scaling', def: 'Mixture of Experts sparsely activates a subset of experts per token to scale parameters efficiently.'},
    { term: 'Zero-shot Prompting', cat: 'Prompting', def: 'Performing tasks with no examples provided; relies on broad generalization.'},
    { term: 'Few-shot Prompting', cat: 'Prompting', def: 'Providing a handful of examples in the prompt to steer model behavior (in-context learning).'},
    { term: 'Chain-of-Thought (CoT)', cat: 'Prompting', def: 'Technique where the model explains intermediate reasoning steps to improve accuracy on complex tasks.'},
    { term: 'Tokenizer / BPE', cat: 'Preprocessing', def: 'Breaks text into tokens; BPE merges frequent character sequences to build a subword vocabulary.'},
    { term: 'Cross-Entropy', cat: 'Loss', def: 'Loss function measuring difference between predicted distribution and true next-token distribution.'},
    { term: 'KL Divergence', cat: 'Loss', def: 'Measure of how one distribution diverges from another; used in alignment and regularization.'},
    { term: 'Jensen–Shannon Divergence', cat: 'Loss', def: 'Symmetric, smoothed variant of KL divergence; bounded and often used for distribution similarity.'},
    { term: 'Backpropagation', cat: 'Math', def: 'Algorithm to compute gradients of loss w.r.t. parameters via chain rule through network layers.'},
    { term: 'Chain Rule', cat: 'Math', def: 'Calculus rule to compute derivatives of composed functions; core to backpropagation.'},
    { term: 'Gradient', cat: 'Math', def: 'Vector of partial derivatives indicating direction and rate of fastest increase of a function.'},
    { term: 'Jacobian', cat: 'Math', def: 'Matrix of all first-order partial derivatives of a vector-valued function.'},
    { term: 'Eigenvalues / Eigenvectors', cat: 'Math', def: 'Values/vectors characterizing linear transformations; used in dimensionality reduction and analysis.'},
    { term: 'Checkpoint', cat: 'Ops', def: 'Saved model weights and optimizer state allowing resume or deployment.'},
    { term: 'Latency / Throughput', cat: 'Serving', def: 'Response time per request and number of requests processed per unit time.'},
    { term: 'Context Length Extension', cat: 'Serving', def: 'Techniques like RoPE scaling or ALiBi to enable longer contexts.'},
    { term: 'Safety Filters / Guardrails', cat: 'Safety', def: 'Policies that block or reshape unsafe outputs at request or response time.'}
    ,{ term: 'Autoregressive', cat: 'Model', def: 'Generative modeling that predicts the next token conditioned on previous tokens.'}
    ,{ term: 'Masked Language Modeling (MLM)', cat: 'Training', def: 'Objective where some tokens are masked and the model predicts the masked tokens.'}
    ,{ term: 'Next Sentence Prediction (NSP)', cat: 'Training', def: 'Auxiliary task to predict whether one sentence logically follows another.'}
    ,{ term: 'Adaptive Softmax', cat: 'Efficiency', def: 'Factorizes the output layer to speed up training with very large vocabularies.'}
    ,{ term: 'Vanishing Gradient', cat: 'Training', def: 'Gradients shrink through deep networks, hindering learning; mitigated by residuals, normalization.'}
    ,{ term: 'Overfitting', cat: 'Training', def: 'Model memorizes training data patterns and fails to generalize; mitigated by regularization and data.'}
    ,{ term: 'Regularization', cat: 'Training', def: 'Techniques like dropout, weight decay to reduce overfitting and improve generalization.'}
    ,{ term: 'Dropout', cat: 'Training', def: 'Randomly zeroes activations during training to reduce co-adaptation and overfitting.'}
    ,{ term: 'Weight Decay', cat: 'Training', def: 'L2 regularization on weights encouraging smaller parameter norms.'}
    ,{ term: 'Learning Rate', cat: 'Training', def: 'Step size used by the optimizer to update parameters during training.'}
    ,{ term: 'Batch Size', cat: 'Training', def: 'Number of examples processed together before updating model parameters.'}
    ,{ term: 'Knowledge Graph (KG)', cat: 'Data', def: 'Graph-structured data representing entities and relations; can ground or retrieve knowledge for LLMs.'}
    ,{ term: 'Multimodal', cat: 'Model', def: 'Models that process multiple modalities (text, images, audio, video) either jointly or via adapters.'}
    ,{ term: 'N-gram', cat: 'Statistical', def: 'Traditional statistical language model using counts of n-length token sequences.'}
    ,{ term: 'Hidden Markov Model (HMM)', cat: 'Statistical', def: 'Probabilistic model with hidden states used for sequences; predecessor to neural LMs in some tasks.'}
  ];

  function initGlossary(){
    const openBtn = document.getElementById('glossary-open-btn');
    const modal = document.getElementById('glossary-modal');
    const closeBtn = document.getElementById('glossary-close-btn');
    const closeBtn2 = document.getElementById('glossary-close-btn-bottom');
    const search = document.getElementById('glossary-search');
    const clear = document.getElementById('glossary-clear');
    const list = document.getElementById('glossary-list');
    const tags = document.getElementById('glossary-tags');
    const count = document.getElementById('glossary-count');
    if (!openBtn || !modal || !closeBtn || !closeBtn2 || !search || !clear || !list || !tags || !count) return;

    const cats = Array.from(new Set(TERMS.map(t=>t.cat)));
    let activeCat = 'All';

    function renderTags(){
      const all = ['All', ...cats];
      tags.innerHTML = all.map(c => `<button data-cat="${c}" class="px-2 py-1 rounded border text-gray-700 bg-gray-50 hover:bg-gray-100 ${activeCat===c?'border-indigo-400 text-indigo-700 bg-indigo-50':''}">${c}</button>`).join('');
      tags.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { activeCat = btn.dataset.cat; render(); renderTags(); }));
    }

    function card(t){
      return `<div class="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between mb-1"><div class="font-medium text-gray-900">${t.term}</div><span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 border">${t.cat}</span></div>
        <div class="text-xs text-gray-700">${t.def}</div>
      </div>`;
    }

    function render(){
      const q = (search.value||'').trim().toLowerCase();
      const filtered = TERMS.filter(t => {
        const matchesCat = activeCat==='All' || t.cat===activeCat;
        const matchesText = !q || t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q);
        return matchesCat && matchesText;
      }).sort((a,b)=>a.term.localeCompare(b.term));
      list.innerHTML = filtered.map(card).join('');
      count.textContent = `${filtered.length} term${filtered.length===1?'':'s'}`;
    }

    function open(){ modal.classList.remove('hidden'); search.focus(); render(); }
    function close(){ modal.classList.add('hidden'); }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    closeBtn2.addEventListener('click', close);
    search.addEventListener('input', render);
    clear.addEventListener('click', () => { search.value=''; render(); });
    modal.addEventListener('click', (e)=>{ if (e.target===modal.firstElementChild) close(); });

    renderTags();
    render();
  }

  document.addEventListener('DOMContentLoaded', initGlossary);
})();
