const interactiveScript = () => {
  const root = document.getElementById('p34-explorer');
    const getCssVar = (name, fallback) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

  if (!root) return;

  // DOM element references
  const conditionSelect = document.getElementById('p34-condition');
  const conditionDescEl = document.getElementById('p34-condition-desc');
  const agentsInput = document.getElementById('p34-agents');
  const agentsLabel = document.getElementById('p34-agents-label');
  const roundsInput = document.getElementById('p34-rounds');
  const roundsLabel = document.getElementById('p34-rounds-label');
  const simulateBtn = document.getElementById('p34-simulate');

  const temporalEl = document.getElementById('p34-temporal');
  const differentiationEl = document.getElementById('p34-differentiation');
  const synergyEl = document.getElementById('p34-synergy');
  const coordinationPercentEl = document.getElementById('p34-coordination-percent');
  const coordinationBarEl = document.getElementById('p34-coordination-bar');
  const coordinationNoteEl = document.getElementById('p34-coordination-note');

  const timelineEl = document.getElementById('p34-timeline');
  const redundantEl = document.getElementById('p34-redundant');
  const uniqueEl = document.getElementById('p34-unique');
  const synergisticEl = document.getElementById('p34-synergistic');
  const performanceEl = document.getElementById('p34-performance');
  const performanceDetailEl = document.getElementById('p34-performance-detail');
  const insightContentEl = document.getElementById('p34-insight-content');

  const taskSelect = document.getElementById('p34-task');
  const taskDescEl = document.getElementById('p34-task-desc');

  // Task scenarios
  const tasks = {
    guessing: {
      name: "Number guessing (paper baseline)",
      description: "Agents independently guess a target number based on minimal group feedback. Simple task from the paper used to isolate coordination patterns without confounding domain complexity.",
      baselineSuccess: 0.3,
      personaBoost: 0.15,
      tomBoost: 0.25
    },
    research: {
      name: "Research + critique + synthesis",
      description: "Three-agent workflow: researcher gathers information, critic identifies gaps, synthesizer produces final output. High complementarity requirement—roles must coordinate to avoid redundancy.",
      baselineSuccess: 0.25,
      personaBoost: 0.25,
      tomBoost: 0.35
    },
    support: {
      name: "Customer support routing",
      description: "Multi-agent triage: routing agent classifies tickets, specialist agents handle domain-specific queries. Requires alignment on classification taxonomy and handoff protocols.",
      baselineSuccess: 0.4,
      personaBoost: 0.2,
      tomBoost: 0.25
    },
    analysis: {
      name: "Data extraction + validation",
      description: "Two-stage pipeline: extractor pulls structured data from documents, validator checks accuracy and consistency. Coordination needed to align on schema and error handling.",
      baselineSuccess: 0.35,
      personaBoost: 0.18,
      tomBoost: 0.22
    }
  };

  // Condition descriptions
  const conditionDescriptions = {
    control: "Agents respond to shared group feedback but don't see each other's actions. Expect high temporal coupling (everyone reacts to the same signal) but minimal cross-agent coordination.",
    personas: "Each agent assigned a role identity (e.g., 'Agent Alpha', 'Agent Beta'). Creates stable differentiation—agents develop unique behavioral patterns tied to their identity.",
    "personas-tom": "Personas plus theory-of-mind instruction: 'Think about what other agents might do.' Unlocks goal-directed complementarity—agents actively coordinate to avoid redundancy and fill gaps."
  };

  // Initialize UI
  const updateLabels = () => {
    if (agentsLabel) agentsLabel.textContent = agentsInput.value;
    if (roundsLabel) roundsLabel.textContent = roundsInput.value;
    if (conditionDescEl) conditionDescEl.textContent = conditionDescriptions[conditionSelect.value] || conditionDescriptions.control;
  };

  const updateTaskDescription = () => {
    const task = tasks[taskSelect.value] || tasks.guessing;
    if (taskDescEl) {
      taskDescEl.textContent = task.description;
    }
  };

  // Simulation logic: approximate information-theoretic measures
  const simulateCoordination = () => {
    const condition = conditionSelect.value;
    const numAgents = Number(agentsInput.value);
    const numRounds = Number(roundsInput.value);
    const task = tasks[taskSelect.value] || tasks.guessing;

    // Base metrics influenced by condition (as percentages)
    // Paper shows: Control = strong temporal coupling but minimal synergy
    // Personas = adds differentiation, moderate synergy increase
    // ToM = strong differentiation + goal-directed complementarity, but still modest synergy ~5-15%
    let temporal = 68; // All conditions show strong temporal coupling from shared feedback
    let differentiation = 6; // Very low in control
    let synergy = 2; // Minimal in control (~2-5% from paper)

    // Adjust based on intervention - calibrated to paper's actual findings
    if (condition === 'personas') {
      temporal = 62 + Math.random() * 8; // Slightly lower temporal coupling
      differentiation = 25 + Math.random() * 10; // Personas create stable identity differentiation
      synergy = 5 + Math.random() * 5; // Moderate synergy increase (~5-10%)
    } else if (condition === 'personas-tom') {
      temporal = 55 + Math.random() * 10; // Lower temporal as agents actively coordinate
      differentiation = 30 + Math.random() * 10; // Strong identity-linked differentiation
      synergy = 8 + Math.random() * 7; // Goal-directed complementarity (~8-15%)
    } else {
      temporal = 68 + Math.random() * 8;
      differentiation = 6 + Math.random() * 6;
      synergy = 2 + Math.random() * 3; // Control: 2-5%
    }

    // Modest scaling with complexity (paper used 3 agents, 10 rounds baseline)
    const agentFactor = 1.0 + (numAgents - 3) * 0.03; // Very small bonus per additional agent
    const roundsFactor = 1.0 + Math.max(0, numRounds - 10) * 0.005; // Tiny bonus for longer runs
    
    // Apply minimal scaling to preserve paper-realistic ranges
    synergy = Math.min(synergy * agentFactor * roundsFactor, 18); // Hard cap at 18%
    differentiation = Math.min(differentiation * Math.sqrt(agentFactor), 42); // Cap at 42%

    // TDMI decomposition (simplified approximation) - as proportions
    const totalTDMI = temporal + differentiation + synergy;
    const redundant = (temporal / totalTDMI) * 100;
    const unique = (differentiation / totalTDMI) * 100;
    const synergistic = (synergy / totalTDMI) * 100;

    // Task performance
    let taskSuccess = task.baselineSuccess;
    if (condition === 'personas') {
      taskSuccess += task.personaBoost;
    } else if (condition === 'personas-tom') {
      taskSuccess += task.tomBoost;
    }
    taskSuccess = Math.min(0.95, taskSuccess + (Math.random() - 0.5) * 0.1); // Add noise

    // Overall coordination strength (synergy is already a percentage 0-60)
    const coordination = synergy; // Use synergy directly as percentage

    return {
      temporal,
      differentiation,
      synergy,
      redundant,
      unique,
      synergistic,
      taskSuccess,
      coordination,
      numAgents,
      numRounds,
      condition,
      task
    };
  };

  // Generate timeline visualization
  const generateTimeline = (metrics) => {
    const { numAgents, numRounds, condition } = metrics;
    let html = '<div class="space-y-2">';
    
    for (let agent = 0; agent < numAgents; agent++) {
      html += `<div class="flex items-center gap-2">`;
      html += `<div class="text-xs font-mono panel-muted w-16 flex-shrink-0">Agent ${agent + 1}</div>`;
      html += `<div class="flex-1 flex gap-0.5 overflow-hidden">`;
      
      for (let round = 0; round < numRounds; round++) {
        // Generate behavior pattern based on condition with wider intensity range
        let intensity;
        if (condition === 'control') {
          // Random, little differentiation but wider range
          intensity = 0.2 + Math.random() * 0.7;
        } else if (condition === 'personas') {
          // Agent-specific patterns with dramatic variation
          const agentBias = (agent * 0.2);
          const randomVar = Math.random() * 0.6;
          intensity = 0.15 + agentBias + randomVar;
        } else {
          // Complementary patterns (anti-correlated) with dramatic swings
          const phase = (agent / numAgents) * Math.PI * 2;
          const wave = (Math.sin(round / numRounds * Math.PI * 4 + phase) + 1) / 2;
          intensity = 0.1 + wave * 0.85;
        }
        
        // Color differentiation emerges over time (rounds)
        // Early rounds: similar colors; later rounds: distinct per agent
        let hue, saturation, lightness;
        let borderColor = '';
        
        const progressRatio = round / Math.max(1, numRounds - 1); // 0 at start, 1 at end
        
        if (condition === 'personas-tom') {
          // Theory-of-mind: starts similar, rapidly differentiates with coordination
          // Use golden ratio to space final hues for maximum perceptual difference
          const goldenAngle = 137.5; // degrees
          const baseHue = 200; // Start all agents at similar blue
          const targetHue = (agent * goldenAngle) % 360; // Each agent's unique color
          
          // Rapid differentiation (square root for fast early change)
          const diffProgress = Math.pow(progressRatio, 0.5);
          hue = baseHue + (targetHue - baseHue) * diffProgress;
          
          saturation = 40 + diffProgress * 45; // 40% → 85% saturation as coordination emerges
          lightness = 45 + intensity * 30; // 45-75% lightness based on activity
          
          // Add sparkle with border on high intensity
          if (intensity > 0.65) {
            borderColor = '2px solid rgba(255,255,255,0.3)';
          }
        } else if (condition === 'personas') {
          // Personas: moderate differentiation emerges over time (role identity stabilizes)
          const goldenAngle = 137.5;
          const baseHue = 210; // Start similar
          const targetHue = (agent * goldenAngle) % 360;
          
          // Linear differentiation over time
          hue = baseHue + (targetHue - baseHue) * progressRatio;
          
          saturation = 35 + progressRatio * 35; // 35% → 70% saturation
          lightness = 50 + intensity * 25; // 50-75% lightness
          
          if (intensity > 0.65) {
            borderColor = '2px solid rgba(255,255,255,0.2)';
          }
        } else {
          // Control: minimal differentiation throughout (agents remain similar)
          hue = 220 + agent * 5 + Math.random() * 10; // All bluish-gray, barely different
          saturation = 15 + Math.random() * 10; // 15-25% saturation (muted)
          lightness = 45 + intensity * 20; // 45-65% lightness
        }
        
        const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Wide opacity range for dramatic color variation
        const opacity = Math.max(0.35, Math.min(1.0, intensity));
        const boxShadow = intensity > 0.7 ? `0 0 16px ${backgroundColor}60` : (intensity > 0.5 ? `0 0 8px ${backgroundColor}30` : '');
        
        // Uniform block styling with consistent border (transparent when no highlight)
        const border = borderColor || '2px solid transparent';
        html += `<div class="flex-1 h-6 rounded" style="background:${backgroundColor}; opacity:${opacity}; min-width:0; max-width:100%; box-shadow:${boxShadow}; border:${border}; filter:saturate(1.3); box-sizing:border-box;"></div>`;
      }
      
      html += `</div></div>`;
    }
    
    html += '</div>';
    return html;
  };

  // Update UI with simulation results
  const updateUI = (metrics) => {
    // Metrics display (already in percentage form)
    temporalEl.textContent = metrics.temporal.toFixed(1) + '%';
    differentiationEl.textContent = metrics.differentiation.toFixed(1) + '%';
    synergyEl.textContent = metrics.synergy.toFixed(1) + '%';

    // Coordination bar
    const coordPercent = Math.round(metrics.coordination);
    coordinationPercentEl.textContent = coordPercent + '%';
    coordinationBarEl.style.width = coordPercent + '%';
    
    // Color coordination bar
    let barColor;
    if (coordPercent >= 35) {
      barColor = 'var(--tone-emerald-strong)';
    } else if (coordPercent >= 15) {
      barColor = 'var(--tone-indigo-strong)';
    } else {
      barColor = 'var(--tone-neutral-strong)';
    }
    coordinationBarEl.style.background = barColor;

    // Coordination note
    if (coordPercent >= 35) {
      coordinationNoteEl.textContent = 'Strong emergent coordination detected. Agents show goal-directed complementarity.';
    } else if (coordPercent >= 15) {
      coordinationNoteEl.textContent = 'Moderate coordination. Agents differentiate but may not fully complement.';
    } else {
      coordinationNoteEl.textContent = 'Minimal coordination. Agents act largely independently despite temporal coupling.';
    }

    // Timeline visualization
    if (timelineEl) {
      timelineEl.innerHTML = generateTimeline(metrics);
    }

    // TDMI breakdown (already in percentage form)
    redundantEl.textContent = metrics.redundant.toFixed(1) + '%';
    uniqueEl.textContent = metrics.unique.toFixed(1) + '%';
    synergisticEl.textContent = metrics.synergistic.toFixed(1) + '%';

    // Performance
    performanceEl.textContent = (metrics.taskSuccess * 100).toFixed(1) + '%';
    performanceDetailEl.innerHTML = `
      <p class="text-xs"><strong>Baseline:</strong> ${(metrics.task.baselineSuccess * 100).toFixed(0)}% (control condition)</p>
      <p class="text-xs"><strong>Observed:</strong> ${(metrics.taskSuccess * 100).toFixed(1)}% (current condition)</p>
      <p class="text-xs panel-muted mt-1">Higher coordination typically correlates with better task outcomes, though the relationship depends on task structure.</p>
    `;

    // Insight panel
    let insight = '';
    if (metrics.condition === 'control') {
      insight = `
        <p>Control condition shows <strong>high temporal coupling</strong> (${metrics.temporal.toFixed(0)}%) as all agents react to shared feedback, but minimal synergistic coordination (${metrics.synergy.toFixed(0)}%). This is the expected baseline: agents work in parallel without truly coordinating.</p>
        <p class="mt-2">Task success rate of ${(metrics.taskSuccess * 100).toFixed(0)}% represents what independent agents can achieve. Try adding personas to see differentiation emerge.</p>
      `;
    } else if (metrics.condition === 'personas') {
      insight = `
        <p>Personas introduce <strong>stable identity-linked differentiation</strong> (${metrics.differentiation.toFixed(0)}%). Agents develop unique behavioral patterns, raising synergy to ${metrics.synergy.toFixed(0)}% compared to ~5% in control.</p>
        <p class="mt-2">Task performance improves to ${(metrics.taskSuccess * 100).toFixed(0)}% as agents avoid redundancy. However, complementarity remains limited—agents differentiate but don't actively coordinate. Add theory-of-mind for the full effect.</p>
      `;
    } else {
      insight = `
        <p>Personas + theory-of-mind unlock <strong>goal-directed complementarity</strong>. Synergistic coordination reaches ${metrics.synergy.toFixed(0)}%—agents actively think about what others might do and adjust their contributions accordingly.</p>
        <p class="mt-2">Timeline shows anti-correlated patterns: when one agent is highly active, others modulate their behavior. Task success climbs to ${(metrics.taskSuccess * 100).toFixed(0)}%, demonstrating that coordination translates to performance gains.</p>
        <p class="mt-2 text-xs panel-muted"><strong>Key insight from paper:</strong> This matches principles from human collective intelligence—effective groups need both alignment on shared goals (temporal coupling) and complementary contributions (synergy).</p>
      `;
    }
    insightContentEl.innerHTML = insight;
  };

  // Auto-update simulation on any control change
  const runSimulation = () => {
    const metrics = simulateCoordination();
    updateUI(metrics);
  };

  // Event listeners with auto-update
  if (agentsInput) {
    agentsInput.addEventListener('input', () => {
      updateLabels();
      runSimulation();
    });
  }
  if (roundsInput) {
    roundsInput.addEventListener('input', () => {
      updateLabels();
      runSimulation();
    });
  }
  if (conditionSelect) {
    conditionSelect.addEventListener('change', () => {
      updateLabels();
      runSimulation();
    });
  }
  if (taskSelect) {
    taskSelect.addEventListener('change', () => {
      updateTaskDescription();
      runSimulation();
    });
  }

  // Initialize
  updateLabels();
  updateTaskDescription();
  
  // Run initial simulation
  runSimulation();
};

// Export for CommonJS and browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interactiveScript };
}
if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paperXXInteractive = interactiveScript;
}
