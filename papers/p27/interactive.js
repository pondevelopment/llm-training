const interactiveScript = () => {
  const root = document.getElementById("p27-lab");
  if (!root) return;

  const getEl = (id) => document.getElementById(id);

  const inputs = {
    tasks: getEl("p27-tasks"),
    humanHours: getEl("p27-human-hours"),
    humanWage: getEl("p27-human-wage"),
    modelMinutes: getEl("p27-model-minutes"),
    winRate: getEl("p27-win-rate"),
    resamples: getEl("p27-resamples"),
    reviewMinutes: getEl("p27-review"),
    oversightWage: getEl("p27-oversight-wage"),
    modelCost: getEl("p27-model-cost"),
    context: getEl("p27-context"),
    scaffolding: getEl("p27-scaffolding"),
    scenarioSelect: getEl("p27-scenario"),
    applyScenario: getEl("p27-apply-scenario")
  };

  const labels = {
    tasks: getEl("p27-tasks-label"),
    humanHours: getEl("p27-human-hours-label"),
    humanWage: getEl("p27-human-wage-label"),
    modelMinutes: getEl("p27-model-minutes-label"),
    winRate: getEl("p27-win-rate-label"),
    resamples: getEl("p27-resamples-label"),
    review: getEl("p27-review-label"),
    oversightWage: getEl("p27-oversight-wage-label"),
    modelCost: getEl("p27-model-cost-label"),
    context: getEl("p27-context-label")
  };

  const outputs = {
    timeSavingsLabel: getEl("p27-time-savings-label"),
    timeSavingsBar: getEl("p27-time-savings-bar"),
    outlookNote: getEl("p27-outlook-note"),
    speedMultiplier: getEl("p27-speed-multiplier"),
    costMultiplier: getEl("p27-cost-multiplier"),
    successProb: getEl("p27-success-prob"),
    humanTime: getEl("p27-human-time"),
    assistedTime: getEl("p27-assisted-time"),
    humanCost: getEl("p27-human-cost"),
    assistedCost: getEl("p27-assisted-cost"),
    totalHumanHours: getEl("p27-total-human-hours"),
    totalAssistedHours: getEl("p27-total-assisted-hours"),
    totalHumanCost: getEl("p27-total-human-cost"),
    totalAssistedCost: getEl("p27-total-assisted-cost"),
    diagnosis: getEl("p27-diagnosis"),
    scenarioJobs: getEl("p27-scenario-jobs"),
    scenarioNotes: getEl("p27-scenario-notes"),
    scenarioSummary: getEl("p27-scenario-summary")
  };

  const scenarios = {
    finance: {
      label: "Finance & insurance",
      tasks: 60,
      humanHours: 6.5,
      humanWage: 150,
      modelMinutes: 9,
      winRate: 42,
      resamples: 3,
      reviewMinutes: 20,
      oversightWage: 180,
      modelCost: 6.5,
      context: 95,
      scaffolding: true,
      jobs: "Financial managers, customer service reps, securities sales, personal advisors",
      notes: "Regulated outputs demand senior reviewers; scaffold prompts to reference policy binders explicitly."
    },
    healthcare: {
      label: "Health care & social assistance",
      tasks: 80,
      humanHours: 7.5,
      humanWage: 135,
      modelMinutes: 10,
      winRate: 38,
      resamples: 3,
      reviewMinutes: 25,
      oversightWage: 160,
      modelCost: 5.5,
      context: 90,
      scaffolding: true,
      jobs: "Registered nurses, medical managers, nurse practitioners, medical secretaries",
      notes: "Ensure PHI is scrubbed before benchmarking; reviewers double-check clinical terminology and coding."
    },
    government: {
      label: "Government",
      tasks: 70,
      humanHours: 6,
      humanWage: 105,
      modelMinutes: 8,
      winRate: 36,
      resamples: 4,
      reviewMinutes: 18,
      oversightWage: 140,
      modelCost: 4.5,
      context: 85,
      scaffolding: false,
      jobs: "Compliance officers, admin services managers, social workers, police supervisors",
      notes: "Documentation quality varies; invest in context packaging to avoid under-specified prompts."
    },
    professional: {
      label: "Professional & technical services",
      tasks: 90,
      humanHours: 6.8,
      humanWage: 165,
      modelMinutes: 9,
      winRate: 45,
      resamples: 3,
      reviewMinutes: 15,
      oversightWage: 175,
      modelCost: 7,
      context: 95,
      scaffolding: true,
      jobs: "Software developers, lawyers, accountants, CIS managers, PM specialists",
      notes: "Most deliverables are already digitized; combine prompt checklists with best-of-N sampling."
    },
    retail: {
      label: "Retail trade",
      tasks: 100,
      humanHours: 5.5,
      humanWage: 80,
      modelMinutes: 7,
      winRate: 40,
      resamples: 2,
      reviewMinutes: 12,
      oversightWage: 95,
      modelCost: 3.5,
      context: 88,
      scaffolding: false,
      jobs: "Operations managers, retail supervisors, pharmacists, investigators",
      notes: "Blend structured SKU data with policy memos; reviewers can be regional leads instead of HQ executives."
    },
    realestate: {
      label: "Real estate & leasing",
      tasks: 50,
      humanHours: 6.2,
      humanWage: 95,
      modelMinutes: 6,
      winRate: 41,
      resamples: 3,
      reviewMinutes: 14,
      oversightWage: 110,
      modelCost: 3,
      context: 90,
      scaffolding: false,
      jobs: "Property managers, rental clerks, brokers, concierges",
      notes: "Success depends on supplying local regulations and amenity sheets alongside marketing briefs."
    }
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const formatCurrency = (value) => {
    if (!Number.isFinite(value)) return "$0";
    const rounded = Math.round(value);
    return `$${rounded.toLocaleString()}`;
  };

  const formatHours = (value) => {
    if (!Number.isFinite(value)) return "0.0 h";
    return `${value.toFixed(1)} h`;
  };

  const formatMultiplier = (value) => {
    if (!Number.isFinite(value) || value <= 0) return "1.00x";
    return `${value.toFixed(2)}x`;
  };

  const formatPercent = (value) => {
    if (!Number.isFinite(value)) return "0%";
    return `${(clamp(value, 0, 1) * 100).toFixed(0)}%`;
  };

  const getInputs = () => ({
    tasks: Number(inputs.tasks.value),
    humanHours: Number(inputs.humanHours.value),
    humanWage: Number(inputs.humanWage.value),
    modelMinutes: Number(inputs.modelMinutes.value),
    winRate: Number(inputs.winRate.value),
    resamples: Number(inputs.resamples.value),
    reviewMinutes: Number(inputs.reviewMinutes.value),
    oversightWage: Number(inputs.oversightWage.value),
    modelCost: Number(inputs.modelCost.value),
    context: Number(inputs.context.value),
    scaffolding: Boolean(inputs.scaffolding.checked)
  });

  const calculateMetrics = (config) => {
    const tasks = clamp(Number(config.tasks) || 0, 1, 1000);
    const humanHours = clamp(Number(config.humanHours) || 0, 0, 40);
    const humanWage = clamp(Number(config.humanWage) || 0, 0, 500);
    const modelMinutes = clamp(Number(config.modelMinutes) || 0, 0, 120);
    const winRate = clamp(Number(config.winRate) || 0, 0, 100);
    const resamples = clamp(Math.round(Number(config.resamples) || 1), 1, 10);
    const reviewMinutes = clamp(Number(config.reviewMinutes) || 0, 0, 120);
    const oversightWage = clamp(Number(config.oversightWage) || 0, 0, 500);
    const modelCost = clamp(Number(config.modelCost) || 0, 0, 100);
    const context = clamp(Number(config.context) || 0, 0, 100);
    const scaffolding = Boolean(config.scaffolding);

    const perAttemptBase = clamp(winRate / 100, 0, 0.95);
    const contextRatio = clamp(context / 100, 0, 1);
    let perAttemptSuccess = clamp(perAttemptBase * contextRatio, 0, 0.95);
    if (scaffolding) {
      perAttemptSuccess = clamp(perAttemptSuccess + 0.05, 0, 0.95);
    }

    let expectedAttempts = 0;
    for (let i = 0; i < resamples; i += 1) {
      expectedAttempts += Math.pow(1 - perAttemptSuccess, i);
    }

    const failProbability = Math.pow(1 - perAttemptSuccess, resamples);
    const successProbability = clamp(1 - failProbability, 0, 1);

    const attemptMinutes = modelMinutes + reviewMinutes;
    const attemptHours = attemptMinutes / 60;

    const reviewHours = (reviewMinutes / 60) * expectedAttempts;
    const fallbackHours = failProbability * humanHours;

    const assistedTimePerTask = expectedAttempts * attemptHours + fallbackHours;
    const baselineTimePerTask = humanHours;

    const modelCostPerTask = modelCost * expectedAttempts;
    const reviewCostPerTask = reviewHours * oversightWage;
    const fallbackCostPerTask = fallbackHours * humanWage;

    const assistedCostPerTask = modelCostPerTask + reviewCostPerTask + fallbackCostPerTask;
    const baselineCostPerTask = humanHours * humanWage;

    const baselineTotalTime = baselineTimePerTask * tasks;
    const assistedTotalTime = assistedTimePerTask * tasks;

    const baselineTotalCost = baselineCostPerTask * tasks;
    const assistedTotalCost = assistedCostPerTask * tasks;

    const speedMultiplier = assistedTotalTime > 0 ? baselineTotalTime / assistedTotalTime : 1;
    const costMultiplier = assistedTotalCost > 0 ? baselineTotalCost / assistedTotalCost : 1;
    const timeSavedPct = baselineTotalTime > 0 ? (1 - assistedTotalTime / baselineTotalTime) * 100 : 0;

    return {
      tasks,
      humanHours,
      humanWage,
      modelMinutes,
      resamples,
      reviewMinutes,
      oversightWage,
      modelCost,
      context,
      scaffolding,
      perAttemptSuccess,
      expectedAttempts,
      failProbability,
      successProbability,
      attemptHours,
      reviewHours,
      fallbackHours,
      assistedTimePerTask,
      baselineTimePerTask,
      assistedCostPerTask,
      baselineCostPerTask,
      baselineTotalTime,
      assistedTotalTime,
      baselineTotalCost,
      assistedTotalCost,
      speedMultiplier,
      costMultiplier,
      timeSavedPct,
      timeSavingsLabel: `${timeSavedPct >= 0 ? timeSavedPct.toFixed(0) : Math.abs(timeSavedPct).toFixed(0)}% ${timeSavedPct >= 0 ? "saved" : "slower"}`,
      moneySaved: baselineTotalCost - assistedTotalCost
    };
  };

  const updateLabels = (state) => {
    labels.tasks.textContent = `${state.tasks} tasks`;
    labels.humanHours.textContent = `${state.humanHours.toFixed(1)} h`;
    labels.humanWage.textContent = `$${Math.round(state.humanWage)}/h`;
    labels.modelMinutes.textContent = `${Math.round(state.modelMinutes)} min`;
    labels.winRate.textContent = `${Math.round(state.winRate)}%`;
    labels.resamples.textContent = `${Math.round(state.resamples)} tries`;
    labels.review.textContent = `${Math.round(state.reviewMinutes)} min`;
    labels.oversightWage.textContent = `$${Math.round(state.oversightWage)}/h`;
    labels.modelCost.textContent = `$${state.modelCost.toFixed(2)}`;
    labels.context.textContent = `${Math.round(state.context)}%`;
  };

  const diagnose = (metrics) => {
    const guidance = [];
    if (metrics.successProbability < 0.4) {
      guidance.push("Win rate is low; capture more context or add scaffolding before scaling.");
    }
    if (metrics.timeSavedPct < 0) {
      guidance.push("Assisted workflow is slower than baseline. Reduce review cycles or raise the success bar before rollout.");
    } else if (metrics.timeSavedPct < 10) {
      guidance.push("Time savings are modest. Increase best-of-N attempts or triage which tasks enter the automation lane.");
    }
    if (metrics.costMultiplier <= 1) {
      guidance.push("Costs exceed or match the human baseline. Lower API spend, trim retries, or reserve experts for the highest-value tasks.");
    }
    if (metrics.successProbability >= 0.65 && metrics.timeSavedPct >= 20 && metrics.costMultiplier > 1.1) {
      guidance.push("You have headroom to widen deployment. Codify review checklists and expand to adjacent teams.");
    }

    if (guidance.length === 0) {
      guidance.push("Current settings deliver faster and cheaper outputs than the human baseline. Pilot with real briefs and monitor failure categories.");
    }

    outputs.diagnosis.innerHTML = `
      <h4 class="text-sm font-semibold text-heading mb-2">Where to focus</h4>
      <ul class="list-disc ml-5 text-xs panel-muted space-y-1">
        ${guidance.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  };

  const updateScenarioDisplay = () => {
    const scenarioKey = inputs.scenarioSelect.value;
    const scenario = scenarios[scenarioKey];
    if (!scenario) {
      outputs.scenarioJobs.textContent = "-";
      outputs.scenarioNotes.textContent = "-";
      outputs.scenarioSummary.textContent = "Select a sector to explore its automation posture.";
      return;
    }

    outputs.scenarioJobs.textContent = scenario.jobs;
    outputs.scenarioNotes.textContent = scenario.notes;

    const metrics = calculateMetrics(scenario);
    const timePhrase = metrics.timeSavedPct >= 0
      ? `${metrics.timeSavedPct.toFixed(0)}% faster`
      : `${Math.abs(metrics.timeSavedPct).toFixed(0)}% slower`;
    const moneyPhrase = metrics.moneySaved >= 0
      ? `saves ${formatCurrency(metrics.moneySaved)}`
      : `costs ${formatCurrency(Math.abs(metrics.moneySaved))}`;

    outputs.scenarioSummary.textContent = `Using GDPval defaults for ${scenario.label} (${scenario.tasks} tasks) yields ${formatPercent(metrics.successProbability)} success, roughly ${timePhrase}, and ${moneyPhrase} per batch.`;
  };

  const updateUI = () => {
    const state = getInputs();
    updateLabels(state);
    const metrics = calculateMetrics(state);

    outputs.timeSavingsLabel.textContent = metrics.timeSavingsLabel;
    const boundedWidth = clamp(Math.abs(metrics.timeSavedPct), 0, 100);
    outputs.timeSavingsBar.style.width = `${Math.round(boundedWidth)}%`;
    let barColor = "var(--tone-indigo-strong)";
    if (metrics.timeSavedPct >= 25) {
      barColor = "var(--tone-emerald-strong)";
    } else if (metrics.timeSavedPct >= 10) {
      barColor = "var(--tone-amber-strong)";
    } else if (metrics.timeSavedPct < 0) {
      barColor = "var(--color-path-scaling-strong)";
    }
    outputs.timeSavingsBar.style.background = barColor;

    outputs.outlookNote.textContent = metrics.timeSavedPct >= 0
      ? "You are ahead of the human baseline. Run a pilot with real briefs to validate failure patterns."
      : "Assisted workflow is slower. Reduce oversight load or increase success probability before deployment.";

    outputs.speedMultiplier.textContent = formatMultiplier(metrics.speedMultiplier);
    outputs.costMultiplier.textContent = formatMultiplier(metrics.costMultiplier);
    outputs.successProb.textContent = formatPercent(metrics.successProbability);

    outputs.humanTime.textContent = formatHours(metrics.baselineTimePerTask);
    outputs.assistedTime.textContent = formatHours(metrics.assistedTimePerTask);
    outputs.humanCost.textContent = formatCurrency(metrics.baselineCostPerTask);
    outputs.assistedCost.textContent = formatCurrency(metrics.assistedCostPerTask);

    outputs.totalHumanHours.textContent = formatHours(metrics.baselineTotalTime);
    outputs.totalAssistedHours.textContent = formatHours(metrics.assistedTotalTime);
    outputs.totalHumanCost.textContent = formatCurrency(metrics.baselineTotalCost);
    outputs.totalAssistedCost.textContent = formatCurrency(metrics.assistedTotalCost);

    diagnose(metrics);
    updateScenarioDisplay();
  };

  Object.values(inputs).forEach((el) => {
    if (!el) return;
    const event = el.type === "checkbox" ? "change" : "input";
    if (el === inputs.scenarioSelect || el === inputs.applyScenario) return;
    el.addEventListener(event, () => {
      window.requestAnimationFrame(updateUI);
    });
  });

  if (inputs.scenarioSelect) {
    Object.entries(scenarios).forEach(([key, scenario]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = scenario.label;
      inputs.scenarioSelect.appendChild(option);
    });
    inputs.scenarioSelect.addEventListener("change", () => {
      updateScenarioDisplay();
    });
  }

  if (inputs.applyScenario) {
    inputs.applyScenario.addEventListener("click", () => {
      const scenarioKey = inputs.scenarioSelect.value;
      const scenario = scenarios[scenarioKey];
      if (!scenario) return;

      inputs.tasks.value = scenario.tasks;
      inputs.humanHours.value = scenario.humanHours;
      inputs.humanWage.value = scenario.humanWage;
      inputs.modelMinutes.value = scenario.modelMinutes;
      inputs.winRate.value = scenario.winRate;
      inputs.resamples.value = scenario.resamples;
      inputs.reviewMinutes.value = scenario.reviewMinutes;
      inputs.oversightWage.value = scenario.oversightWage;
      inputs.modelCost.value = scenario.modelCost;
      inputs.context.value = scenario.context;
      inputs.scaffolding.checked = Boolean(scenario.scaffolding);

      updateUI();
    });
  }

  updateUI();
};

if (typeof module !== "undefined") {
  module.exports = { interactiveScript };
}
