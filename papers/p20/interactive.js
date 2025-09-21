const interactiveScript = () => {
  const root = document.getElementById('p20-lab');
  if (!root) return;

  const scenarioSelect = document.getElementById('p20-scenario');
  const capabilityInput = document.getElementById('p20-capability');
  const opennessInput = document.getElementById('p20-openness');
  const governanceInput = document.getElementById('p20-governance');
  const volumeInput = document.getElementById('p20-volume');
  const platformToggle = document.getElementById('p20-platform');
  const identityToggle = document.getElementById('p20-identity');

  const adoptionMetric = document.getElementById('p20-metric-adoption');
  const leverageMetric = document.getElementById('p20-metric-leverage');
  const stageMetric = document.getElementById('p20-metric-stage');
  const congestionMetric = document.getElementById('p20-metric-congestion');
  const regMetric = document.getElementById('p20-metric-reg');
  const explanationEl = document.getElementById('p20-explanation');
  const actionsEl = document.getElementById('p20-actions');

  if (
    !scenarioSelect ||
    !capabilityInput ||
    !opennessInput ||
    !governanceInput ||
    !volumeInput ||
    !platformToggle ||
    !identityToggle ||
    !adoptionMetric ||
    !leverageMetric ||
    !stageMetric ||
    !congestionMetric ||
    !regMetric ||
    !explanationEl ||
    !actionsEl
  ) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const scenarios = {
    jobs: {
      capability: 55,
      openness: 35,
      governance: 45,
      volume: 65,
      platform: false,
      identity: false
    },
    retail: {
      capability: 70,
      openness: 40,
      governance: 35,
      volume: 80,
      platform: true,
      identity: false
    },
    procurement: {
      capability: 65,
      openness: 55,
      governance: 60,
      volume: 55,
      platform: true,
      identity: true
    }
  };

  const formatRegLabel = score => {
    if (score >= 85) return 'Critical';
    if (score >= 65) return 'High';
    if (score >= 40) return 'Moderate';
    return 'Low';
  };

  const formatCongestion = score => {
    if (score >= 70) return 'High';
    if (score >= 45) return 'Moderate';
    return 'Low';
  };

  const applyScenario = key => {
    const config = scenarios[key] || scenarios.jobs;
    capabilityInput.value = config.capability;
    opennessInput.value = config.openness;
    governanceInput.value = config.governance;
    volumeInput.value = config.volume;
    platformToggle.checked = Boolean(config.platform);
    identityToggle.checked = Boolean(config.identity);
    render();
  };

  const render = () => {
    const capability = Number(capabilityInput.value);
    const openness = Number(opennessInput.value);
    const governanceRaw = Number(governanceInput.value);
    const volume = Number(volumeInput.value);
    const platform = platformToggle.checked;
    const identity = identityToggle.checked;

    const effectiveGovernance = identity ? Math.max(governanceRaw, 70) : governanceRaw;

    const delegated = clamp(
      0.45 * capability +
      0.2 * openness +
      0.15 * effectiveGovernance +
      0.2 * volume +
      (platform ? 12 : 0),
      5,
      95
    );

    const platformPower = clamp(
      (100 - openness) * 0.6 +
      (platform ? 22 : 0) +
      volume * 0.15,
      0,
      100
    );

    const regPressure = clamp(
      delegated * 0.55 +
      (100 - effectiveGovernance) * 0.75 +
      (platform ? 6 : 0),
      0,
      100
    );

    const congestionScore = clamp(
      0.6 * volume +
      0.3 * delegated -
      0.4 * openness +
      (platform ? 8 : 0),
      0,
      100
    );

    const stage = delegated < 45 ? 'Deployment' : delegated < 70 ? 'Redistribution' : 'Reconstruction';

    adoptionMetric.textContent = `${Math.round(delegated)}%`;
    leverageMetric.textContent = `${Math.round(platformPower)}%`;
    stageMetric.textContent = stage;
    congestionMetric.textContent = formatCongestion(congestionScore);
    regMetric.textContent = formatRegLabel(regPressure);

    const oversightDelta = Math.round(effectiveGovernance - governanceRaw);

    const narrative = [
      `Agent capability set at ${capability}% with openness at ${openness}% delivers roughly ${Math.round(delegated)}% of transactions handled end-to-end by software agents, putting this market in the ${stage.toLowerCase()} stage.`,
      platform
        ? `A platform-native agent is live, pushing leverage up to ${Math.round(platformPower)}%. Without counterweights, the marketplace can steer discovery, pricing, and reputation.`
        : `No native platform agent keeps leverage near ${Math.round(platformPower)}%, so bring-your-own bots still broker most matches.`,
      identity
        ? `Proof-of-personhood lifts oversight by ${oversightDelta}% points, yet regulators would still rate this environment ${formatRegLabel(regPressure).toLowerCase()} because ${Math.round(100 - effectiveGovernance)}% of the risk surface depends on continuous audits.`
        : `Oversight remains at ${Math.round(effectiveGovernance)}%, leaving ${Math.round(regPressure)} on the regulator pressure index. Identity or liability upgrades are next if agent adoption keeps climbing.`,
      `Congestion risk is ${formatCongestion(congestionScore).toLowerCase()}, driven by an agent volume index of ${volume} and openness set at ${openness}%.`
    ];

    explanationEl.innerHTML = narrative.map(text => `<p>${text}</p>`).join('');

    const actions = [];

    if (delegated > 70 && effectiveGovernance < 65) {
      actions.push('Stand up stronger identity, audit logging, or spending caps before bots overwhelm frontline reviewers.');
    }
    if (platformPower > 60 && openness < 50) {
      actions.push('Publish API fairness commitments or agent access scorecards to blunt lock-in concerns.');
    }
    if (delegated < 45 && capability < 60) {
      actions.push('Invest in capability benchmarks plus human-in-the-loop pilots to build trust before scaling automation.');
    }
    if (regPressure >= 65 && !identity) {
      actions.push('Mandate verifiable credentials or kill-switch hooks so regulators do not impose blanket throttles.');
    }
    if (congestionScore >= 70) {
      actions.push('Introduce congestion pricing, batching, or queueing so agent swarms do not drown human or bot reviewers.');
    }
    if (platformPower >= 55 && delegated >= 55) {
      actions.push('Pilot compute-metered or tiered agent pricing so incentives stay aligned as automation scales.');
    }
    if (effectiveGovernance < 50 && !identity) {
      actions.push('Tighten privacy and IP guardrails with provenance logging and cross-context data sharing limits.');
    }
    if (!actions.length) {
      actions.push('Keep iterating on openness, pricing, and governance to balance agent coverage with credible guardrails.');
    }

    actionsEl.innerHTML = actions.map(item => `<li>${item}</li>`).join('');
  };

  scenarioSelect.addEventListener('change', event => applyScenario(event.target.value));
  capabilityInput.addEventListener('input', render);
  opennessInput.addEventListener('input', render);
  governanceInput.addEventListener('input', render);
  volumeInput.addEventListener('input', render);
  platformToggle.addEventListener('change', render);
  identityToggle.addEventListener('change', render);

  applyScenario(scenarioSelect.value || 'jobs');
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper20Interactive = interactiveScript;
}
