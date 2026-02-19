(function () {
  'use strict';

  /* ── Shared helpers (IIFE top scope) ── */
  var getCssVar = function (name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  function getEl(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  /* ── Strategy data ──
     Each strategy has:
       tokenCost  – relative % of baseline (100 = full cost, lower = better)
       latency    – relative % of baseline
       effectiveness – % task success (higher = better)
       note       – short explanation
     Numbers are illustrative, derived from survey patterns (§3–§5).
  */
  var MEMORY = {
    full:          { label: 'Full context',      tokenCost: 100, latency: 100, effectiveness: 95, note: 'Every previous message and observation is kept verbatim in the prompt. Gives the model maximum recall but token cost grows linearly with conversation length, making it impractical for sessions beyond a few thousand tokens. Best suited for short, high-stakes tasks where missing any detail is unacceptable.' },
    textual:       { label: 'Textual compress.',  tokenCost: 45,  latency: 60,  effectiveness: 88, note: 'Methods like COMEDY and MemAgent rewrite or summarize older turns into shorter text, significantly reducing prompt size. The model retains the gist of past interactions while losing some verbatim detail. A strong default for most production pipelines where moderate recall loss is acceptable.' },
    latent:        { label: 'Latent memory',      tokenCost: 30,  latency: 45,  effectiveness: 85, note: 'Techniques such as Activation Beacon and Memory\u00b3 compress history into compact hidden-state representations rather than text using progressive compression ratios. The compressed memory is opaque \u2014 harder to inspect, debug, or audit \u2014 but achieves substantial token savings. Best for long-context tasks like document analysis or extended coding sessions.' },
    hierarchical:  { label: 'Hierarchical',       tokenCost: 35,  latency: 55,  effectiveness: 90, note: 'Multi-tier architectures like MemoryOS maintain separate stores: short-term memory (recent turns), mid-term memory (session summaries), and long-term memory (persistent knowledge). Automatically promotes or forgets information based on recency and relevance. More complex to implement but provides a good balance of cost and recall across varied session lengths.' },
    item:          { label: 'Item-based external', tokenCost: 50,  latency: 70,  effectiveness: 89, note: 'The largest category in the survey (18+ methods). Systems like MemoryBank, Mem0, A-MEM, and Expel store discrete memory items (facts, reflections, experiences) in an external database and retrieve them via similarity search. Flexible and interpretable \u2014 you can inspect and edit individual memories. Retrieval latency and relevance ranking quality are the main trade-offs. Well-suited for personalized assistants and long-running agents.' },
    graph:         { label: 'Knowledge graph',    tokenCost: 40,  latency: 65,  effectiveness: 87, note: 'Systems like Zep and AriGraph extract entities and relationships into a structured graph, then retrieve relevant subgraphs at query time. Excels in entity-rich domains (e.g., customer support with product catalogs) where relational reasoning matters. Requires upfront schema design and ongoing graph maintenance, adding operational complexity.' }
  };

  var TOOL = {
    direct:    { label: 'Direct invocation',    tokenCost: 100, latency: 100, effectiveness: 90, note: 'Every available tool description is included in every prompt, and the model picks which to call. Simple to implement but the prompt grows linearly with the number of tools — with 50+ tools this can consume thousands of tokens per turn. Works fine for small tool sets (fewer than 10) but becomes a bottleneck at scale.' },
    retriever: { label: 'Smart selection',      tokenCost: 55,  latency: 65,  effectiveness: 88, note: 'Approaches like ProTIP use semantic similarity to retrieve only the most relevant tools for each query, while TinyAgent uses multi-label classification to select tools \u2014 both reduce prompt size to only the tools needed for each turn. Requires building and maintaining a tool index or classifier, but avoids the linear scaling problem of direct invocation. A practical middle ground for medium-to-large tool sets.' },
    vocab:     { label: 'Tool-as-token',        tokenCost: 35,  latency: 50,  effectiveness: 85, note: 'Methods like ToolkenGPT and ToolGen embed each tool as a special token in the model\'s vocabulary, enabling tool selection in a single decoding step rather than through prompt engineering. Extremely fast selection with minimal prompt overhead, but requires fine-tuning the model on tool-use data — making it less flexible when tools change frequently.' },
    parallel:  { label: 'Parallel calling',     tokenCost: 80,  latency: 40,  effectiveness: 92, note: 'Systems like LLMCompiler and LLM-Tool Compiler analyze the task DAG and dispatch independent tool calls concurrently rather than sequentially. Significant latency improvements for parallelizable tasks (e.g., fetching data from multiple APIs simultaneously). Token cost stays similar since all tools still need descriptions, but wall-clock time improves dramatically for multi-step workflows.' },
    tir:       { label: 'Tool-integrated reason.', tokenCost: 45,  latency: 50,  effectiveness: 93, note: 'Tool-Integrated Reasoning (\u00a74.3) weaves tool calls into the reasoning path itself rather than treating them as separate steps. Methods like ReTool, SMART, AutoTIR, and PORTool enable the model to selectively invoke tools during chain-of-thought \u2014 calling tools only when reasoning alone is insufficient. Achieves high effectiveness with moderate cost because the model learns when NOT to call a tool, reducing unnecessary invocations.' },
    rl:        { label: 'RL-optimized',         tokenCost: 40,  latency: 55,  effectiveness: 91, note: 'Reinforcement learning methods like OTC-PO and ToolOrchestra train the model to minimize unnecessary tool calls by penalizing redundant invocations. Separately, in-place methods like CoA (Chain of Abstractions) use symbolic abstractions to reduce inference time by >30% compared to Toolformer. Together these approaches produce agents that are inherently cost-aware at deployment time, though they require either RL training or specialized fine-tuning.' }
  };

  var PLANNING = {
    sequential:   { label: 'Naive sequential',    tokenCost: 100, latency: 100, effectiveness: 75, note: 'The agent reasons one step at a time, appending each observation to the prompt before deciding the next action (classic ReAct-style). Simple to implement but carries full history forward, leading to high token cost and frequent retries on multi-step tasks. Effectiveness drops significantly as task complexity grows because errors compound without lookahead.' },    adaptive:     { label: 'Adaptive control',     tokenCost: 70,  latency: 65,  effectiveness: 84, note: 'Dual-process systems like SwiftSage use a fast System-1 module for simple steps and a slow System-2 module (full LLM reasoning) only when needed. Budget-aware variants allocate compute budgets per step and switch strategies based on difficulty. Effective at reducing average cost while maintaining effectiveness on hard cases. Reflexion adds verbal self-reflection to learn from failures without retraining.' },    decompose:    { label: 'Decompose+execute',   tokenCost: 60,  latency: 55,  effectiveness: 85, note: 'Frameworks like ReWOO and HuggingGPT first generate a complete plan (sub-task list), then execute each step independently. This avoids the redundant token accumulation of sequential approaches — each executor only sees its own sub-task context. Reduces both cost and latency, though plan quality depends heavily on the decomposition step.' },
    tree:         { label: 'Tree search',         tokenCost: 120, latency: 130, effectiveness: 92, note: 'Methods like LATS and ToolChain* explore multiple candidate action paths using tree search (MCTS, A*, beam search), backtracking from dead ends. Achieves high effectiveness on complex reasoning tasks but at significant cost — each branch requires separate LLM calls. Cost-aware variants like CATS prune unpromising branches early to control expenses.' },
    'rl-policy':  { label: 'RL-trained policy',   tokenCost: 50,  latency: 45,  effectiveness: 90, note: 'Approaches like QLASS, ETO, and Planner-R1 train a policy network offline using reinforcement learning to guide action selection, replacing expensive runtime search with learned heuristics. Front-loads compute into the training phase so inference is fast and cheap. Requires task-specific training data and reward design, but produces highly efficient agents at deployment.' },
    'multi-agent':{ label: 'Multi-agent coord.',  tokenCost: 150, latency: 140, effectiveness: 94, note: 'Multiple specialized agents collaborate through debate, reflection, or role-based delegation (e.g., a planner agent + executor agent + critic agent). Achieves the highest task success rates through diverse perspectives and self-correction, but message complexity scales O(N²) with agent count. Structured topologies (star, hierarchy) help manage communication overhead.' },
    distilled:    { label: 'Distilled single',    tokenCost: 55,  latency: 50,  effectiveness: 89, note: 'Methods like MAGDI and Debate-then-Refine distill the collective reasoning of a multi-agent system into a single student model. The student learns to internalize debate and reflection patterns, achieving near multi-agent quality at single-agent cost. An attractive option when you want multi-agent effectiveness but can\'t afford the runtime overhead in production.' }
  };

  /* ── Combination insights ── */
  function getInsight(mem, tool, plan) {
    var insights = [];

    // Memory-specific
    if (mem === 'full' && (plan === 'multi-agent' || plan === 'tree')) {
      insights.push('Full context with ' + PLANNING[plan].label + ' compounds token cost rapidly. Consider textual or latent compression to keep trajectory history manageable.');
    }
    if (mem === 'latent' && tool === 'direct') {
      insights.push('Latent memory compresses history efficiently, but passing all tool descriptions wastes those savings. Pair with retriever-based or vocabulary-based tool selection.');
    }
    if (mem === 'hierarchical') {
      insights.push('Hierarchical memory (MemoryOS-style) is a strong default: it balances recency (STM) with durable knowledge (LTM) and handles forgetting automatically.');
    }

    // Tool-specific
    if (tool === 'parallel' && plan === 'sequential') {
      insights.push('Parallel tool calling is most effective when the planner can identify independent sub-tasks upfront. Sequential planning may miss parallelism opportunities.');
    }
    if (tool === 'rl' && plan === 'rl-policy') {
      insights.push('RL-optimized tools paired with RL-trained planning creates a tightly integrated system. Both components learn to minimize cost jointly\u2014this is near the Pareto frontier.');
    }

    // Planning-specific
    if (plan === 'multi-agent' && mem === 'full') {
      insights.push('Multi-agent coordination with full context is the most expensive configuration. Each agent maintains its own full history, leading to O(N\u00b2) token growth.');
    }
    if (plan === 'distilled') {
      insights.push('Distilled single-agent retains most multi-agent reasoning quality at single-agent cost. MAGDI achieves this by distilling interaction graphs into student models.');
    }

    // New strategy insights
    if (mem === 'item') {
      insights.push('Item-based memory is the most popular approach in the survey (18+ methods). Its key advantage is interpretability \u2014 you can inspect and edit individual memories, which matters for debugging and compliance.');
    }
    if (tool === 'tir') {
      insights.push('Tool-Integrated Reasoning lets the model decide during chain-of-thought whether a tool call is needed, avoiding the fixed overhead of separate tool-selection steps. Works especially well for math and data analysis tasks.');
    }
    if (plan === 'adaptive') {
      insights.push('Adaptive control (SwiftSage-style) applies the right amount of compute per step \u2014 fast for easy sub-tasks, deep reasoning only when needed. This mirrors human problem-solving and can cut average cost significantly.');
    }
    if (tool === 'tir' && plan === 'adaptive') {
      insights.push('TIR + adaptive control is a strong pairing: the planner routes easy steps to fast mode, and TIR weaves tool calls into reasoning only for hard steps. Both minimize unnecessary compute.');
    }
    if (mem === 'item' && plan === 'multi-agent') {
      insights.push('Item-based memory shared across agents provides a simple coordination mechanism \u2014 agents read/write discrete facts rather than passing full conversation histories.');
    }

    // Cross-pillar synergies
    if ((mem === 'textual' || mem === 'latent') && (tool === 'retriever' || tool === 'vocab') && (plan === 'decompose' || plan === 'rl-policy' || plan === 'distilled')) {
      insights.push('This combination hits the efficiency sweet spot: compressed context + selective tool use + structured planning. Each pillar reinforces the others\u2019 savings.');
    }
    if (mem === 'full' && tool === 'direct' && plan === 'sequential') {
      insights.push('This is the naive baseline \u2014 no optimization on any pillar. It works for simple tasks with few tools, but costs scale poorly with complexity.');
    }

    if (insights.length === 0) {
      insights.push('A reasonable combination. Check the cost and latency numbers above to see if the trade-offs fit your deployment budget.');
    }

    return insights;
  }

  /* ── Pareto classification ── */
  function classifyPareto(cost, effectiveness) {
    // Simplified Pareto frontier classification
    // Frontier: low cost AND high effectiveness
    // Near-frontier: moderate on both
    // Dominated: high cost OR low effectiveness without compensating benefit
    var efficiency = effectiveness / Math.max(cost, 1);
    if (efficiency >= 1.4) return { label: 'Frontier', chipClass: 'chip chip-success', color: getCssVar('--tone-emerald-strong', '#10b981') };
    if (efficiency >= 0.9) return { label: 'Near frontier', chipClass: 'chip chip-info', color: getCssVar('--tone-sky-strong', '#0ea5e9') };
    if (efficiency >= 0.6) return { label: 'Moderate', chipClass: 'chip chip-neutral', color: getCssVar('--tone-amber-strong', '#f59e0b') };
    return { label: 'Dominated', chipClass: 'chip chip-warning', color: getCssVar('--tone-rose-strong', '#f43f5e') };
  }

  /* ── Render ── */
  function render() {
    var root = getEl('p66-explorer');
    if (!root) return;

    var memSel = getEl('p66-memory');
    var toolSel = getEl('p66-tool');
    var planSel = getEl('p66-planning');
    if (!memSel || !toolSel || !planSel) return;

    var mem = MEMORY[memSel.value] || MEMORY.full;
    var tool = TOOL[toolSel.value] || TOOL.direct;
    var plan = PLANNING[planSel.value] || PLANNING.sequential;

    // Update strategy explanation notes
    var memNote = getEl('p66-memory-note');
    var toolNote = getEl('p66-tool-note');
    var planNote = getEl('p66-planning-note');
    if (memNote) memNote.innerHTML = '<strong>' + escapeHtml(mem.label) + ':</strong> ' + escapeHtml(mem.note);
    if (toolNote) toolNote.innerHTML = '<strong>' + escapeHtml(tool.label) + ':</strong> ' + escapeHtml(tool.note);
    if (planNote) planNote.innerHTML = '<strong>' + escapeHtml(plan.label) + ':</strong> ' + escapeHtml(plan.note);

    // Composite scores (weighted blend: memory 30%, tool 30%, planning 40%)
    var tokenCost = Math.round(mem.tokenCost * 0.3 + tool.tokenCost * 0.3 + plan.tokenCost * 0.4);
    var latency = Math.round(mem.latency * 0.3 + tool.latency * 0.3 + plan.latency * 0.4);
    // Effectiveness: multiplicative (weakest link matters)
    var effectiveness = Math.round((mem.effectiveness / 100) * (tool.effectiveness / 100) * (plan.effectiveness / 100) * 100);

    // Pareto classification
    var pareto = classifyPareto(tokenCost, effectiveness);

    // Update metric boxes
    var tokenEl = getEl('p66-token-cost');
    var latencyEl = getEl('p66-latency');
    var effEl = getEl('p66-effectiveness');
    var paretoLabelEl = getEl('p66-pareto-label');
    var paretoChipEl = getEl('p66-pareto-chip');

    if (tokenEl) {
      tokenEl.textContent = tokenCost + '%';
      tokenEl.style.color = tokenCost <= 50 ? getCssVar('--tone-emerald-strong', '#10b981') : tokenCost <= 80 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#f43f5e');
    }
    if (latencyEl) {
      latencyEl.textContent = latency + '%';
      latencyEl.style.color = latency <= 50 ? getCssVar('--tone-emerald-strong', '#10b981') : latency <= 80 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#f43f5e');
    }
    if (effEl) {
      effEl.textContent = effectiveness + '%';
      effEl.style.color = effectiveness >= 80 ? getCssVar('--tone-emerald-strong', '#10b981') : effectiveness >= 65 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#f43f5e');
    }
    if (paretoLabelEl) {
      paretoLabelEl.textContent = pareto.label;
      paretoLabelEl.style.color = pareto.color;
    }
    if (paretoChipEl) {
      paretoChipEl.className = pareto.chipClass + ' text-xs';
      paretoChipEl.textContent = pareto.label;
    }

    // Render cost bars
    var barsEl = getEl('p66-bars');
    if (barsEl) {
      var barData = [
        { label: 'Memory: ' + mem.label, cost: mem.tokenCost, note: mem.note },
        { label: 'Tools: ' + tool.label, cost: tool.tokenCost, note: tool.note },
        { label: 'Planning: ' + plan.label, cost: plan.tokenCost, note: plan.note }
      ];
      barsEl.innerHTML = barData.map(function (d) {
        var barColor = d.cost <= 50 ? getCssVar('--tone-emerald-strong', '#10b981') : d.cost <= 80 ? getCssVar('--tone-amber-strong', '#f59e0b') : getCssVar('--tone-rose-strong', '#f43f5e');
        var barWidth = Math.min(d.cost, 100); // Cap visual bar at 100%
        return '<div class="space-y-1">' +
          '<div class="flex items-center justify-between text-xs">' +
            '<span class="font-medium text-heading">' + escapeHtml(d.label) + '</span>' +
            '<span class="font-mono panel-muted">' + d.cost + '%</span>' +
          '</div>' +
          '<div class="w-full rounded-full h-2" style="background:' + getCssVar('--color-bg-soft', '#f1f5f9') + '">' +
            '<div class="h-2 rounded-full transition-all duration-300" style="width:' + barWidth + '%;background:' + barColor + '"></div>' +
          '</div>' +
          '<p class="text-xs panel-muted">' + escapeHtml(d.note) + '</p>' +
        '</div>';
      }).join('');
    }

    // Render insight
    var insightEl = getEl('p66-insight');
    if (insightEl) {
      var insights = getInsight(memSel.value, toolSel.value, planSel.value);
      insightEl.innerHTML = insights.map(function (line) {
        return '<p>' + escapeHtml(line) + '</p>';
      }).join('');
    }
  }

  /* ── Init ── */
  function init() {
    var root = getEl('p66-explorer');
    if (!root) {
      console.warn('P66 interactive: elements not yet in DOM, skipping');
      return;
    }

    var memSel = getEl('p66-memory');
    var toolSel = getEl('p66-tool');
    var planSel = getEl('p66-planning');

    if (memSel) memSel.addEventListener('change', render);
    if (toolSel) toolSel.addEventListener('change', render);
    if (planSel) planSel.addEventListener('change', render);

    render();
  }

  /* ── Export ── */
  function interactiveScript() {
    setTimeout(function () { init(); }, 0);
  }

  interactiveScript.init = init;
  interactiveScript.render = render;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
