const interactiveScript = () => {
  const root = document.getElementById('p19-tracker');
  if (!root) return;
  const scenarioSelect = document.getElementById('p19-scenario');
  const householdInput = document.getElementById('p19-household');
  const inputsInput = document.getElementById('p19-inputs');
  const qualityInput = document.getElementById('p19-quality');
  const energyToggle = document.getElementById('p19-energy');
  const timeToggle = document.getElementById('p19-time');
  const dataToggle = document.getElementById('p19-data');
  const fairnessToggle = document.getElementById('p19-fairness');
  const visibilityEl = document.getElementById('p19-visibility');
  const lagEl = document.getElementById('p19-lag');
  const actionEl = document.getElementById('p19-action');
  const explanationEl = document.getElementById('p19-explanation');
  if (!scenarioSelect || !householdInput || !inputsInput || !qualityInput || !energyToggle || !timeToggle || !dataToggle || !fairnessToggle || !visibilityEl || !lagEl || !actionEl || !explanationEl) {
    return;
  }
  const scenarios = {
    today: {
      household: 15,
      inputs: 25,
      quality: 10,
      energy: false,
      time: false,
      data: false,
      fairness: false
    },
    sprint: {
      household: 35,
      inputs: 55,
      quality: 40,
      energy: true,
      time: false,
      data: true,
      fairness: false
    },
    ahead: {
      household: 60,
      inputs: 75,
      quality: 65,
      energy: true,
      time: true,
      data: true,
      fairness: true
    }
  };
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const setScenario = key => {
    const config = scenarios[key];
    if (!config) return;
    householdInput.value = config.household;
    inputsInput.value = config.inputs;
    qualityInput.value = config.quality;
    energyToggle.checked = Boolean(config.energy);
    timeToggle.checked = Boolean(config.time);
    dataToggle.checked = Boolean(config.data);
    fairnessToggle.checked = Boolean(config.fairness);
    render();
  };
  const formatLag = score => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Moderate';
    if (score >= 40) return 'High';
    return 'Severe';
  };
  const render = () => {
    const household = Number(householdInput.value);
    const inputs = Number(inputsInput.value);
    const quality = Number(qualityInput.value);
    const energy = energyToggle.checked;
    const timeFeeds = timeToggle.checked;
    const dataShare = dataToggle.checked;
    const fairnessAudit = fairnessToggle.checked;
    const baseScore = 0.4 * household + 0.35 * inputs + 0.25 * quality;
    // Weight telemetry bonuses so energy/time/data/fairness coverage tracks the paper's measurement agenda.
    const bonus = (energy ? 8 : 0) + (timeFeeds ? 10 : 0) + (dataShare ? 7 : 0) + (fairnessAudit ? 6 : 0);
    const visibilityScore = clamp(Math.round(baseScore + bonus), 0, 100);
    const lagLabel = formatLag(visibilityScore);
    const deficits = [];
    const addDeficit = (priority, message) => {
      deficits.push({ priority, message });
    };
    if (!dataShare) {
      addDeficit(95, 'Secure platform data-sharing MOUs for anonymised usage metrics');
    }
    if (!energy) {
      addDeficit(90, 'Wire datacentre power and water telemetry into environmental accounts');
    }
    if (!timeFeeds) {
      addDeficit(85, 'Launch continuous time-use panels to evidence workplace and household automation gains');
    }
    if (!fairnessAudit) {
      addDeficit(75, 'Instrument fairness telemetry so algorithmic discrimination is visible before regulators escalate');
    }
    if (household < 30) {
      addDeficit(80, 'Run valuation surveys and shadow-price free-tier AI use so GDP captures household consumption');
    } else if (household < 55) {
      addDeficit(60, 'Blend stated-preference and platform telemetry to firm up household AI consumption estimates');
    } else if (household < 80) {
      addDeficit(45, 'Publish quarterly household AI consumption sat-accounts so signals reach fiscal teams');
    }
    if (inputs < 35) {
      addDeficit(78, 'Stand up compute/data/labour satellite accounts with suppliers and customs feeds');
    } else if (inputs < 60) {
      addDeficit(58, 'Integrate MRIO + visa data to trace cross-border AI supply-chain exposure');
    } else if (inputs < 85) {
      addDeficit(42, 'Audit AI input ledgers against energy, chip, and specialist labour pipelines to close residual gaps');
    }
    if (quality < 25) {
      addDeficit(76, 'Pair service revenues with outcome metrics to build quality-adjusted AI deflators');
    } else if (quality < 55) {
      addDeficit(56, 'Expand matched-model price scrapes and outcome audits for AI-enabled services');
    } else if (quality < 80) {
      addDeficit(38, 'Roll out personalised price audits and service SLAs into the deflator toolkit');
    }
    let recommendedAction = 'Maintain and publish the AI measurement dashboard to keep stakeholders aligned';
    if (deficits.length) {
      deficits.sort((a, b) => b.priority - a.priority);
      recommendedAction = deficits[0].message;
    }
    visibilityEl.textContent = `${visibilityScore}`;
    lagEl.textContent = lagLabel;
    actionEl.textContent = recommendedAction;
    const narrative = [
      `Only ${household}% of household-side AI usage is monetised or shadow-priced, so most free copilots stay invisible to GDP tallies.`,
      `${inputs}% input coverage leaves blind spots across compute imports, data assets, and specialist labour - exactly the supply chain the chapter urges agencies to map.`,
      `Quality-adjusted deflators cover ${quality}% of services; ${lagLabel.toLowerCase()} lag risk means policy will react late unless organisations ${recommendedAction.toLowerCase()}.`,
      fairnessAudit
        ? 'Fairness telemetry is live, so discrimination and personalised pricing impacts feed compliance dashboards in real time.'
        : 'Without fairness telemetry, discrimination in personalised pricing stays invisible to compliance teams and regulators.'
    ];
    explanationEl.innerHTML = narrative.map(sentence => `<p>${sentence}</p>`).join('');
  };
  scenarioSelect.addEventListener('change', event => setScenario(event.target.value));
  householdInput.addEventListener('input', render);
  inputsInput.addEventListener('input', render);
  qualityInput.addEventListener('input', render);
  energyToggle.addEventListener('change', render);
  timeToggle.addEventListener('change', render);
  dataToggle.addEventListener('change', render);
  fairnessToggle.addEventListener('change', render);
  setScenario(scenarioSelect.value || 'today');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper19Interactive = interactiveScript;
}


