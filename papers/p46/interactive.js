(function() {
  'use strict';
  
  // Data from Humlum & Vestergaard (2025) Denmark field study
  const occupationData = {
    marketing: {
      name: 'Marketing professionals',
      timeSavingsNoEncouragement: 3.4,
      timeSavingsEncouraged: 6.8,
      timeSavingsTraining: 7.5,
      adoptionNoEncouragement: 58,
      adoptionEncouraged: 89,
      adoptionTraining: 93,
      description: 'High generative task load (copywriting, content creation, campaign ideation). Shows among strongest productivity gains in Denmark study.'
    },
    software: {
      name: 'Software developers',
      timeSavingsNoEncouragement: 3.6,
      timeSavingsEncouraged: 7.0,
      timeSavingsTraining: 7.8,
      adoptionNoEncouragement: 52,
      adoptionEncouraged: 85,
      adoptionTraining: 91,
      description: 'Code completion and debugging assistance. RCTs show 26–58% gains but real-world limited to 7% even with encouragement due to integration complexity.'
    },
    support: {
      name: 'Customer support',
      timeSavingsNoEncouragement: 3.0,
      timeSavingsEncouraged: 5.8,
      timeSavingsTraining: 6.5,
      adoptionNoEncouragement: 54,
      adoptionEncouraged: 84,
      adoptionTraining: 89,
      description: 'Response drafting and issue resolution. Well-suited to chatbot assistance but real gains (6%) far below RCT estimates (15%+).'
    },
    it: {
      name: 'IT support specialists',
      timeSavingsNoEncouragement: 2.8,
      timeSavingsEncouraged: 5.5,
      timeSavingsTraining: 6.2,
      adoptionNoEncouragement: 50,
      adoptionEncouraged: 82,
      adoptionTraining: 88,
      description: 'Troubleshooting scripts and documentation. Benefits similar to customer support but offset by time spent integrating AI into workflows.'
    },
    hr: {
      name: 'HR professionals',
      timeSavingsNoEncouragement: 2.5,
      timeSavingsEncouraged: 4.8,
      timeSavingsTraining: 5.5,
      adoptionNoEncouragement: 48,
      adoptionEncouraged: 80,
      adoptionTraining: 86,
      description: 'Job descriptions, policy drafting, communication templates. Moderate gains limited by need for human judgment and compliance review.'
    },
    office: {
      name: 'Office clerks',
      timeSavingsNoEncouragement: 2.2,
      timeSavingsEncouraged: 4.2,
      timeSavingsTraining: 4.8,
      adoptionNoEncouragement: 44,
      adoptionEncouraged: 76,
      adoptionTraining: 82,
      description: 'Administrative tasks, scheduling, basic correspondence. Lower complexity tasks show smaller absolute gains.'
    },
    journalists: {
      name: 'Journalists',
      timeSavingsNoEncouragement: 2.0,
      timeSavingsEncouraged: 4.0,
      timeSavingsTraining: 4.5,
      adoptionNoEncouragement: 46,
      adoptionEncouraged: 78,
      adoptionTraining: 84,
      description: 'Research assistance and draft generation. High originality requirements and fact-checking needs limit chatbot utility.'
    },
    legal: {
      name: 'Legal professionals',
      timeSavingsNoEncouragement: 1.8,
      timeSavingsEncouraged: 3.5,
      timeSavingsTraining: 4.0,
      adoptionNoEncouragement: 38,
      adoptionEncouraged: 70,
      adoptionTraining: 76,
      description: 'Document review and research. Strict accuracy requirements and ethical concerns limit aggressive adoption (6% workplaces ban use).'
    },
    accounting: {
      name: 'Accountants',
      timeSavingsNoEncouragement: 1.5,
      timeSavingsEncouraged: 3.0,
      timeSavingsTraining: 3.5,
      adoptionNoEncouragement: 40,
      adoptionEncouraged: 72,
      adoptionTraining: 78,
      description: 'Analysis and reporting assistance. Numerical precision requirements and regulatory constraints reduce applicability.'
    },
    finance: {
      name: 'Financial advisors',
      timeSavingsNoEncouragement: 1.4,
      timeSavingsEncouraged: 2.8,
      timeSavingsTraining: 3.2,
      adoptionNoEncouragement: 36,
      adoptionEncouraged: 68,
      adoptionTraining: 74,
      description: 'Client communication and research. Confidentiality concerns (highest ban rate) and fiduciary duties limit use cases.'
    },
    teachers: {
      name: 'Teachers',
      timeSavingsNoEncouragement: 0.6,
      timeSavingsEncouraged: 1.5,
      timeSavingsTraining: 2.0,
      adoptionNoEncouragement: 42,
      adoptionEncouraged: 74,
      adoptionTraining: 80,
      description: 'Lesson planning and grading. Lowest productivity gains; new workloads from AI detection and ethics education offset time savings.'
    }
  };

  // Pass-through rates from Denmark data
  const passThroughRates = {
    none: 0.03,        // 3% for no encouragement
    encouraged: 0.05,  // 5% for encouraged (midpoint)
    training: 0.07     // 7% for encouraged + training
  };

  function init() {
    const occupationSelect = document.getElementById('p46-occupation');
    const encouragementSelect = document.getElementById('p46-encouragement');
    const workforceSizeSlider = document.getElementById('p46-workforce-size');
    const avgSalarySlider = document.getElementById('p46-avg-salary');
    const monthsSlider = document.getElementById('p46-months');

    if (!occupationSelect || !encouragementSelect || !workforceSizeSlider || !avgSalarySlider || !monthsSlider) {
      console.warn('Paper 46 interactive elements not yet in DOM, skipping initialization');
      return;
    }

    occupationSelect.addEventListener('change', updateUI);
    encouragementSelect.addEventListener('change', updateUI);
    workforceSizeSlider.addEventListener('input', updateUI);
    avgSalarySlider.addEventListener('input', updateUI);
    monthsSlider.addEventListener('input', updateUI);

    updateUI();
  }

  function updateUI() {
    const occupation = document.getElementById('p46-occupation')?.value;
    const encouragement = document.getElementById('p46-encouragement')?.value;
    const workforceSize = parseInt(document.getElementById('p46-workforce-size')?.value || '100');
    const avgSalary = parseInt(document.getElementById('p46-avg-salary')?.value || '75000');
    const months = parseInt(document.getElementById('p46-months')?.value || '18');

    if (!occupation || !encouragement) return;

    const occData = occupationData[occupation];
    
    // Get metrics based on encouragement level
    let adoption, timeSavings;
    if (encouragement === 'none') {
      adoption = occData.adoptionNoEncouragement;
      timeSavings = occData.timeSavingsNoEncouragement;
    } else if (encouragement === 'encouraged') {
      adoption = occData.adoptionEncouraged;
      timeSavings = occData.timeSavingsEncouraged;
    } else { // training
      adoption = occData.adoptionTraining;
      timeSavings = occData.timeSavingsTraining;
    }

    const passThrough = passThroughRates[encouragement];
    const wageImpact = timeSavings * passThrough;
    
    // Economic impact: workforceSize × avgSalary × wageImpact × (months/12)
    const annualImpactPerWorker = avgSalary * wageImpact;
    const totalImpact = workforceSize * annualImpactPerWorker * (months / 12);

    // Update slider labels
    const workforceValueEl = document.getElementById('p46-workforce-value');
    const salaryValueEl = document.getElementById('p46-salary-value');
    const monthsValueEl = document.getElementById('p46-months-value');
    
    if (workforceValueEl) workforceValueEl.textContent = `(${workforceSize} employees)`;
    if (salaryValueEl) salaryValueEl.textContent = `(\$${avgSalary.toLocaleString()})`;
    if (monthsValueEl) monthsValueEl.textContent = `(${months} months)`;

    // Update occupation description
    const occDescEl = document.getElementById('p46-occupation-description');
    if (occDescEl) {
      occDescEl.textContent = occData.description;
    }

    // Update metric cards
    const adoptionRateEl = document.getElementById('p46-adoption-rate');
    const adoptionDescEl = document.getElementById('p46-adoption-description');
    const timeSavingsEl = document.getElementById('p46-time-savings');
    const timeDescEl = document.getElementById('p46-time-description');
    const wageImpactEl = document.getElementById('p46-wage-impact');
    const wageDescEl = document.getElementById('p46-wage-description');
    const economicImpactEl = document.getElementById('p46-economic-impact');
    const economicDescEl = document.getElementById('p46-economic-description');

    if (adoptionRateEl) adoptionRateEl.textContent = `${adoption}%`;
    if (adoptionDescEl) {
      let desc = `${adoption}% of ${occData.name} use AI chatbots for work`;
      if (encouragement === 'none') {
        desc += '. Without employer support, adoption is worker-driven and varies significantly by demographics (younger, male, higher-earning workers adopt more).';
      } else if (encouragement === 'encouraged') {
        desc += ' with active employer encouragement. Gender gap narrows from 12pp to 5pp, age gap reduces ~40%.';
      } else {
        desc += ' with training programs. Gender gap narrows to 3.6pp—training is most effective at closing demographic disparities.';
      }
      adoptionDescEl.textContent = desc;
    }

    if (timeSavingsEl) timeSavingsEl.textContent = `${timeSavings.toFixed(1)}%`;
    if (timeDescEl) {
      let desc = `${occData.name} report ${timeSavings.toFixed(1)}% average time savings`;
      if (encouragement === 'none') {
        desc += '. Without coordination, workers lack workflow integration and clear use cases. 80% reallocate saved time to other tasks but marginal productivity barely changes.';
      } else if (encouragement === 'encouraged') {
        desc += ' when encouraged. Employer support provides clearer use cases and enables some workflow adaptation, but most gains still go unrealized.';
      } else {
        desc += ' with training. Highest productivity gains—training helps workers identify high-value applications and overcome adoption barriers.';
      }
      timeDescEl.textContent = desc;
    }

    if (wageImpactEl) wageImpactEl.textContent = `${wageImpact.toFixed(1)}%`;
    if (wageDescEl) {
      const passThroughPct = Math.round(passThrough * 100);
      let desc = `Only ${passThroughPct}% of productivity gains pass through to wages (${timeSavings.toFixed(1)}% × ${passThroughPct}% = ${wageImpact.toFixed(1)}%). `;
      if (encouragement === 'none') {
        desc += 'Bottom-up adoption without employer recognition provides zero negotiating leverage. Principal-agent frictions block value capture.';
      } else if (encouragement === 'encouraged') {
        desc += 'Encouragement slightly improves pass-through as employers acknowledge benefits and may reward high performers.';
      } else {
        desc += 'Training creates most credentialable skills and strongest link between effort and rewards, yielding highest pass-through rate.';
      }
      wageDescEl.textContent = desc;
    }

    if (economicImpactEl) {
      if (totalImpact >= 1000000) {
        economicImpactEl.textContent = `\$${(totalImpact / 1000000).toFixed(2)}M`;
      } else if (totalImpact >= 1000) {
        economicImpactEl.textContent = `\$${Math.round(totalImpact / 1000)}K`;
      } else {
        economicImpactEl.textContent = `\$${Math.round(totalImpact)}`;
      }
    }
    if (economicDescEl) {
      const perWorkerImpact = (totalImpact / workforceSize).toFixed(0);
      let desc = `Total across ${workforceSize} workers over ${months} months: \$${Math.round(totalImpact).toLocaleString()} (\$${perWorkerImpact}/worker). `;
      
      if (months <= 18) {
        desc += 'Denmark study tracks effects through 18 months with zero detected wage impacts—this model shows theoretical upper bound if pass-through matched self-reports.';
      } else {
        desc += `Extended beyond 18-month study window—assumes constant pass-through rate, but actual effects may differ as workflows adapt or tools improve.`;
      }
      economicDescEl.textContent = desc;
    }

    // Update insights panel
    updateInsights(occData, encouragement, timeSavings, wageImpact, adoption, months, workforceSize, totalImpact);
  }

  function updateInsights(occData, encouragement, timeSavings, wageImpact, adoption, months, workforceSize, totalImpact) {
    const insightsContent = document.getElementById('p46-insights-content');
    if (!insightsContent) return;

    const insights = [];

    // Insight 1: Magnitude check
    if (wageImpact < 1.0) {
      insights.push(`<strong>Near-zero wage effects:</strong> At ${wageImpact.toFixed(1)}% wage impact, your organization would see changes well below Denmark study's confidence intervals (ruling out effects >1%). This aligns with 97% of workers reporting no earnings change.`);
    } else if (wageImpact >= 1.0 && wageImpact < 3.0) {
      insights.push(`<strong>Marginally detectable:</strong> ${wageImpact.toFixed(1)}% wage impact is at the edge of statistical detectability in large field studies. Denmark data rules out effects >1% on average, >6% by occupation.`);
    } else {
      insights.push(`<strong>Above observed ceiling:</strong> ${wageImpact.toFixed(1)}% wage impact exceeds what Denmark study detected (confidence intervals rule out >6% per occupation). Achieving this would require breakthrough changes in pass-through or productivity beyond current evidence.`);
    }

    // Insight 2: Encouragement effect
    if (encouragement === 'none') {
      const encouragedAdoption = occupationData[document.getElementById('p46-occupation').value].adoptionEncouraged;
      const adoptionGap = encouragedAdoption - adoption;
      insights.push(`<strong>Opportunity from encouragement:</strong> Active employer support could boost adoption by ${adoptionGap}pp and nearly double productivity gains. But Denmark data shows this still yields <1% wage effects—focus on long-term workflow transformation, not immediate ROI.`);
    } else if (encouragement === 'encouraged') {
      insights.push(`<strong>Encouragement benefits:</strong> Your parameters show 40-50% higher productivity than baseline, but pass-through remains weak (5%). Consider training programs (7% pass-through) or workflow redesign to capture more value.`);
    } else {
      insights.push(`<strong>Training premium:</strong> Training programs yield highest pass-through (7%) and narrowest demographic gaps (3.6pp gender gap vs. 12pp baseline). If investing in GenAI, prioritize structured learning over tool access.`);
    }

    // Insight 3: Occupation-specific
    if (timeSavings >= 6.0) {
      insights.push(`<strong>High-potential occupation:</strong> ${occData.name} show among strongest productivity gains (${timeSavings.toFixed(1)}%). Even here, Denmark study found zero wage effects—suggesting years-long lag before labor market impacts materialize.`);
    } else if (timeSavings >= 3.0) {
      insights.push(`<strong>Moderate applicability:</strong> ${occData.name} see middle-of-pack gains (${timeSavings.toFixed(1)}%), close to Denmark's 2.8% average. Representative of typical white-collar experience with chatbots.`);
    } else {
      insights.push(`<strong>Limited applicability:</strong> ${occData.name} show below-average gains (${timeSavings.toFixed(1)}%)—accuracy requirements, ethical constraints, or task complexity limit chatbot utility. Consider whether investment is justified.`);
    }

    // Insight 4: Time horizon
    if (months <= 18) {
      insights.push(`<strong>Within study window:</strong> ${months}-month horizon is covered by Denmark administrative data (through June 2024). Zero effects persisted with no trend changes—suggesting impacts are genuinely minimal, not just delayed.`);
    } else {
      insights.push(`<strong>Extrapolation caution:</strong> ${months} months exceeds Denmark's 18-month tracking window. Projections assume constant pass-through, but actual effects may improve (workflow adaptation) or worsen (novelty wears off).`);
    }

    // Insight 5: ROI reality check
    const annualInvestmentPerWorker = 360; // Rough annual cost for Copilot/chatbot access
    const totalInvestment = workforceSize * annualInvestmentPerWorker * (months / 12);
    const roi = ((totalImpact - totalInvestment) / totalInvestment * 100).toFixed(0);
    
    if (totalImpact < totalInvestment) {
      insights.push(`<strong>ROI warning:</strong> At ~\$360/worker/year for enterprise chatbot access, your ${months}-month investment (\$${Math.round(totalInvestment).toLocaleString()}) exceeds projected returns (\$${Math.round(totalImpact).toLocaleString()}). Denmark evidence suggests treating GenAI as multi-year capability building (R&D), not near-term margin expansion (COGS reduction).`);
    } else {
      insights.push(`<strong>Positive ROI scenario:</strong> Projected ${roi}% return assumes Denmark's weak pass-through (${Math.round(passThroughRates[encouragement] * 100)}%) holds in your context. However, study found zero actual wage effects—this model shows theoretical upper bound, not realized gains. Budget conservatively.`);
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
