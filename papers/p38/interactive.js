/**
 * Paper 38 Interactive: AITL Deployment Simulator
 * Models annotation volume, quality, model improvements, and ROI
 */

(function() {
  'use strict';

  // Baseline metrics from Airbnb production pilot
  const BASELINE_METRICS = {
    // Annotation agreement rates
    preferenceImmediate: 0.832,
    preferenceDelayed: 0.827,
    adoptionImmediate: 0.775,
    adoptionDelayed: 0.769,
    knowledgeImmediate: 0.923,
    knowledgeDelayed: 0.918,
    missingImmediate: 0.765,
    missingDelayed: 0.639,
    
    // Offline annotation agreement (for comparison)
    preferenceOffline: 0.635,
    adoptionOffline: 0.721,
    knowledgeOffline: 0.436,
    
    // Model performance improvements (AITL vs baseline)
    recallImprovement: 0.117,      // +11.7%
    precisionImprovement: 0.148,   // +14.8%
    helpfulnessImprovement: 0.084, // +8.4%
    citationImprovement: 0.381,    // +38.1%
    
    // Agent adoption rate improvement
    adoptionRateBoost: 0.045,      // +4.5pp
    
    // Airbnb pilot specifics
    agentsInPilot: 40,
    casesPerAgentPerDay: 11,
    workDaysPerWeek: 5
  };

  /**
   * Calculate weekly annotation volume
   */
  function calculateAnnotationVolume(teamSize, casesPerDay) {
    const weeklyVolume = teamSize * casesPerDay * BASELINE_METRICS.workDaysPerWeek;
    return {
      weekly: weeklyVolume,
      monthly: weeklyVolume * 4,
      yearly: weeklyVolume * 52
    };
  }

  /**
   * Calculate annotation agreement rates based on timing strategy
   */
  function calculateAgreementRates(timing) {
    if (timing === 'immediate') {
      return {
        preference: BASELINE_METRICS.preferenceImmediate,
        adoption: BASELINE_METRICS.adoptionImmediate,
        knowledge: BASELINE_METRICS.knowledgeImmediate,
        missing: BASELINE_METRICS.missingImmediate
      };
    } else if (timing === 'delayed') {
      return {
        preference: BASELINE_METRICS.preferenceDelayed,
        adoption: BASELINE_METRICS.adoptionDelayed,
        knowledge: BASELINE_METRICS.knowledgeDelayed,
        missing: BASELINE_METRICS.missingDelayed
      };
    } else {
      // Hybrid: immediate missing, delayed rest
      return {
        preference: BASELINE_METRICS.preferenceDelayed,
        adoption: BASELINE_METRICS.adoptionDelayed,
        knowledge: BASELINE_METRICS.knowledgeDelayed,
        missing: BASELINE_METRICS.missingImmediate
      };
    }
  }

  /**
   * Calculate quality filtering impact
   * Filter strictness: 0-100 scale
   * - 0 = lenient (filter 10% of data)
   * - 50 = medium (filter 20% of data)
   * - 100 = strict (filter 40% of data)
   */
  function calculateFiltering(weeklyVolume, filterStrictness) {
    const filterRate = 0.10 + (filterStrictness / 100) * 0.30; // 10-40%
    const filteredOut = Math.round(weeklyVolume * filterRate);
    const usedForTraining = weeklyVolume - filteredOut;
    
    return {
      collected: weeklyVolume,
      filteredOut,
      usedForTraining,
      filterRate
    };
  }

  /**
   * Calculate update frequency impact
   * updateFreqWeeks: 1 (weekly), 2 (bi-weekly), 4 (monthly), 12 (quarterly)
   */
  function calculateUpdateFrequency(updateFreqWeeks) {
    const updatesPerYear = Math.round(52 / updateFreqWeeks);
    const traditionalUpdates = 4; // Quarterly
    const speedup = updatesPerYear / traditionalUpdates;
    
    return {
      updatesPerYear,
      speedup
    };
  }

  /**
   * Calculate ROI
   */
  function calculateROI(params) {
    const {
      weeklyVolume,
      annotationTimeMinutes,
      agentHourlyCost,
      weeklyInfraCost,
      adoptionValue,
      baselineAdoptionRate,
      totalWeeklyCases
    } = params;
    
    // Cost calculation
    const annotationHours = (weeklyVolume * annotationTimeMinutes) / 60;
    const annotationCost = annotationHours * agentHourlyCost;
    const totalCost = annotationCost + weeklyInfraCost;
    
    // Benefit calculation
    // AITL improves adoption rate by 4.5pp
    const improvedAdoptionRate = baselineAdoptionRate + BASELINE_METRICS.adoptionRateBoost * 100;
    const additionalAdoptions = totalWeeklyCases * (improvedAdoptionRate - baselineAdoptionRate) / 100;
    const weeklyBenefit = additionalAdoptions * adoptionValue;
    
    // Net calculations
    const weeklyNet = weeklyBenefit - totalCost;
    const annualNet = weeklyNet * 52;
    const roiMultiple = totalCost > 0 ? (weeklyBenefit / totalCost) : 0;
    
    return {
      weeklyCost: Math.round(totalCost),
      weeklyBenefit: Math.round(weeklyBenefit),
      weeklyNet: Math.round(weeklyNet),
      annualNet: Math.round(annualNet),
      roiMultiple
    };
  }

  /**
   * Get filter label
   */
  function getFilterLabel(value) {
    if (value < 25) return 'Lenient';
    if (value < 50) return 'Medium-Lenient';
    if (value < 75) return 'Medium-Strict';
    return 'Strict';
  }

  /**
   * Update all UI elements
   */
  function updateUI() {
    // Check if elements exist
    const teamSizeEl = document.getElementById('p38-team-size');
    if (!teamSizeEl) {
      console.warn('Interactive elements not yet in DOM, skipping updateUI');
      return;
    }
    
    // Get configuration values
    const teamSize = parseInt(teamSizeEl.value);
    const casesPerDay = parseInt(document.getElementById('p38-cases-per-day').value);
    const timing = document.getElementById('p38-timing').value;
    const filterStrictness = parseInt(document.getElementById('p38-filter').value);
    const updateFreqWeeks = parseInt(document.getElementById('p38-update-freq').value);
    
    // ROI inputs
    const annotationTimeMinutes = parseFloat(document.getElementById('p38-annotation-time').value);
    const agentHourlyCost = parseFloat(document.getElementById('p38-agent-cost').value);
    const weeklyInfraCost = parseFloat(document.getElementById('p38-infra-cost').value);
    const adoptionValue = parseFloat(document.getElementById('p38-adoption-value').value);
    const baselineAdoptionRate = parseFloat(document.getElementById('p38-adoption-rate').value);
    const totalWeeklyCases = parseFloat(document.getElementById('p38-total-cases').value);
    
    // Update display labels
    document.getElementById('p38-team-size-display').textContent = `${teamSize} agents`;
    document.getElementById('p38-cases-display').textContent = `${casesPerDay} cases/day`;
    document.getElementById('p38-filter-display').textContent = getFilterLabel(filterStrictness);
    
    // Calculate annotation volume
    const volume = calculateAnnotationVolume(teamSize, casesPerDay);
    document.getElementById('p38-weekly-volume').textContent = volume.weekly.toLocaleString();
    document.getElementById('p38-monthly-volume').textContent = volume.monthly.toLocaleString();
    document.getElementById('p38-yearly-volume').textContent = volume.yearly.toLocaleString();
    
    // Calculate agreement rates
    const agreements = calculateAgreementRates(timing);
    
    // Update agreement displays and bars
    const agreementPercent = (val) => (val * 100).toFixed(1) + '%';
    
    document.getElementById('p38-pref-agreement').textContent = agreementPercent(agreements.preference);
    document.getElementById('p38-pref-bar').style.width = agreementPercent(agreements.preference);
    
    document.getElementById('p38-adopt-agreement').textContent = agreementPercent(agreements.adoption);
    document.getElementById('p38-adopt-bar').style.width = agreementPercent(agreements.adoption);
    
    document.getElementById('p38-knowledge-agreement').textContent = agreementPercent(agreements.knowledge);
    document.getElementById('p38-knowledge-bar').style.width = agreementPercent(agreements.knowledge);
    
    document.getElementById('p38-missing-agreement').textContent = agreementPercent(agreements.missing);
    document.getElementById('p38-missing-bar').style.width = agreementPercent(agreements.missing);
    
    // Calculate filtering impact
    const filtering = calculateFiltering(volume.weekly, filterStrictness);
    document.getElementById('p38-collected').textContent = filtering.collected.toLocaleString();
    document.getElementById('p38-filtered').textContent = filtering.filteredOut.toLocaleString();
    document.getElementById('p38-training').textContent = filtering.usedForTraining.toLocaleString();
    document.getElementById('p38-filter-rate').textContent = (filtering.filterRate * 100).toFixed(0) + '%';
    
    // Calculate update frequency
    const updateFreq = calculateUpdateFrequency(updateFreqWeeks);
    document.getElementById('p38-updates-per-year').textContent = updateFreq.updatesPerYear;
    document.getElementById('p38-speedup').textContent = updateFreq.speedup.toFixed(0) + '×';
    
    // Calculate ROI
    const roi = calculateROI({
      weeklyVolume: volume.weekly,
      annotationTimeMinutes,
      agentHourlyCost,
      weeklyInfraCost,
      adoptionValue,
      baselineAdoptionRate,
      totalWeeklyCases
    });
    
    document.getElementById('p38-roi-cost').textContent = roi.weeklyCost.toLocaleString();
    document.getElementById('p38-roi-benefit').textContent = roi.weeklyBenefit.toLocaleString();
    document.getElementById('p38-roi-net').textContent = roi.weeklyNet.toLocaleString();
    document.getElementById('p38-roi-annual').textContent = '$' + roi.annualNet.toLocaleString();
    document.getElementById('p38-roi-multiple').textContent = ((roi.roiMultiple - 1) * 100).toFixed(0) + '%';
  }

  /**
   * Initialize interactive controls
   */
  function init() {
    // Attach event listeners to all controls
    const controls = [
      'p38-team-size',
      'p38-cases-per-day',
      'p38-timing',
      'p38-filter',
      'p38-update-freq',
      'p38-annotation-time',
      'p38-agent-cost',
      'p38-infra-cost',
      'p38-adoption-value',
      'p38-adoption-rate',
      'p38-total-cases'
    ];
    
    controls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', updateUI);
        element.addEventListener('change', updateUI);
      }
    });
    
    // Initial render
    updateUI();
  }

  // Export function to be called by paperLoader
  function interactiveScript() {
    setTimeout(() => {
      init();
    }, 0);
  }

  // Export helper functions for testing
  interactiveScript.init = init;
  interactiveScript.calculateAnnotationVolume = calculateAnnotationVolume;
  interactiveScript.calculateAgreementRates = calculateAgreementRates;
  interactiveScript.calculateFiltering = calculateFiltering;
  interactiveScript.calculateUpdateFrequency = calculateUpdateFrequency;
  interactiveScript.calculateROI = calculateROI;
  interactiveScript.BASELINE_METRICS = BASELINE_METRICS;

  // Export to window and module
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }

})();
