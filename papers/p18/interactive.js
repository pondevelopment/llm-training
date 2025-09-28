const interactiveScript = () => {
  const root = document.getElementById('p18-budget');
  if (!root) return;

  const riskInput = document.getElementById('p18-risk');
  const phiInput = document.getElementById('p18-phi');
  const alphaInput = document.getElementById('p18-alpha');
  const yearsInput = document.getElementById('p18-years');
  const vslInput = document.getElementById('p18-vsl');

  const riskValue = document.getElementById('p18-risk-value');
  const phiValue = document.getElementById('p18-phi-value');
  const alphaValue = document.getElementById('p18-alpha-value');
  const yearsValue = document.getElementById('p18-years-value');
  const vslValue = document.getElementById('p18-vsl-value');

  const spendMetric = document.getElementById('p18-metric-spend');
  const riskMetric = document.getElementById('p18-metric-risk');
  const capitaMetric = document.getElementById('p18-metric-capita');
  const explanation = document.getElementById('p18-explanation');

  if (
    !riskInput ||
    !phiInput ||
    !alphaInput ||
    !yearsInput ||
    !vslInput ||
    !riskValue ||
    !phiValue ||
    !alphaValue ||
    !yearsValue ||
    !vslValue ||
    !spendMetric ||
    !riskMetric ||
    !capitaMetric ||
    !explanation
  ) {
    return;
  }

  const scenarioButtons = root.querySelectorAll('[data-scenario]');

  const GDP_PER_CAPITA = 90_000; // USD approximation for a high-income economy
  const GRID_STEP = 0.001; // 0.1 percentage point of GDP

  const computeOptimalSpend = (riskPercent, phiPercent, alpha, years, vslMillions) => {
    const risk = riskPercent / 100; // probability in the risk window
    const phi = Math.min(Math.max(phiPercent / 100, 0), 1);
    const vslValue = vslMillions * 1_000_000;
    const nonMitigable = risk * (1 - phi);
    const mitigable = risk * phi;

    let best = {
      net: -Infinity,
      share: 0,
      residual: risk,
      avoided: 0
    };

    for (let spend = 0; spend <= 0.5 + 1e-9; spend += GRID_STEP) {
      const effectiveMitigable = mitigable * Math.exp(-alpha * spend * years);
      const residual = nonMitigable + effectiveMitigable;
      const avoided = Math.max(risk - residual, 0);
      const benefit = avoided * vslValue;
      const cost = spend * GDP_PER_CAPITA;
      const net = benefit - cost;

      if (net > best.net) {
        best = {
          net,
          share: spend,
          residual,
          avoided
        };
      }
    }

    return {
      spendShare: best.share,
      residualRisk: best.residual,
      avoidedRisk: best.avoided,
      perCapitaSpend: best.share * GDP_PER_CAPITA,
      perCapitaBenefit: best.avoided * vslValue,
      nonMitigable,
      mitigable
    };
  };

  const formatPercent = (value) => `${value.toFixed(1)}%`;

  const render = () => {
    const risk = Number(riskInput.value);
    const phi = Number(phiInput.value);
    const alpha = Number(alphaInput.value);
    const years = Number(yearsInput.value);
    const vslMillions = Number(vslInput.value);

    riskValue.textContent = `${risk.toFixed(1)}%`;
    phiValue.textContent = `${phi.toFixed(0)}%`;
    alphaValue.textContent = alpha.toFixed(2);
    yearsValue.textContent = `${years}`;
    vslValue.textContent = vslMillions.toFixed(1);

    const {
      spendShare,
      residualRisk,
      avoidedRisk,
      perCapitaSpend,
      perCapitaBenefit,
      nonMitigable,
      mitigable
    } = computeOptimalSpend(risk, phi, alpha, years, vslMillions);

    spendMetric.textContent = `${(spendShare * 100).toFixed(1)}% GDP`;
    riskMetric.textContent = `${(residualRisk * 100).toFixed(2)}% / yr`;
    capitaMetric.textContent = `$${Math.round(perCapitaSpend).toLocaleString()}`;

    const benefitPerCapita = Math.round(perCapitaBenefit).toLocaleString();
    const mitigableFloor = formatPercent(nonMitigable * 100);
    const avoidedPercent = formatPercent(avoidedRisk * 100);

    const narratives = [
      `Under these inputs, the model pushes the optimal safety budget to ${(spendShare * 100).toFixed(1)}% of GDP per year. That reproduces Jones's equation (6): willingness-to-pay from the $${(vslMillions * 1_000_000).toLocaleString()} value of life times an effectiveness term governed by \u03b1 and the ${years}-year window.`,
      `Only ${mitigableFloor} of the annual hazard is truly non-mitigable. The policy spend eliminates ${avoidedPercent} of risk, leaving ${(residualRisk * 100).toFixed(2)}% residual per year.`,
      `Per person, society spends about $${Math.round(perCapitaSpend).toLocaleString()} to unlock $${benefitPerCapita} in expected lives saved &mdash; a net positive as long as mitigation remains within the calibrated effectiveness range.`
    ];

    explanation.innerHTML = narratives.map((text) => `<p>${text}</p>`).join('');
  };

  const applyScenario = (scenario) => {
    const presets = {
      baseline: { risk: 1, phi: 50, alpha: 1.2, years: 10, vsl: 10 },
      cautious: { risk: 0.5, phi: 40, alpha: 0.8, years: 12, vsl: 10 },
      bleak: { risk: 2.5, phi: 70, alpha: 1.6, years: 8, vsl: 12 }
    };

    const preset = presets[scenario];
    if (!preset) return;

    riskInput.value = preset.risk;
    phiInput.value = preset.phi;
    alphaInput.value = preset.alpha;
    yearsInput.value = preset.years;
    vslInput.value = preset.vsl;

    render();
  };

  [riskInput, phiInput, alphaInput, yearsInput, vslInput].forEach((input) => {
    input.addEventListener('input', render);
  });

  scenarioButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const scenario = button.getAttribute('data-scenario');
      applyScenario(scenario);
    });
  });

  render();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.paper18Interactive = interactiveScript;
}
