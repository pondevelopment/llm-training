(function() {
  'use strict';

  // Workflow configurations from paper experiments
  const WORKFLOW_CONFIGS = {
    chatbot: {
      name: 'Pre-Sale Service Chatbot',
      description: '<strong>24/7 AI customer service agent</strong> responding to pre-purchase questions in all languages. Baseline was no customer support—customers received an auto-reply saying service was unavailable.',
      baseSalesLift: 16.3,
      baseConversionLift: 22,
      mechanism: 'Reduces information asymmetry by providing 24/7 multilingual customer support. Addresses critical friction of unanswered pre-purchase questions.',
      baselineNote: 'Baseline was no customer support—largest GenAI marginal contribution.'
    },
    search: {
      name: 'Search Query Refinement',
      description: '<strong>AI-powered search improvement</strong> that understands, refines, and translates multilingual queries to match consumers with relevant products. Baseline was standard machine learning search algorithms.',
      baseSalesLift: 2.5,
      baseConversionLift: 8,
      mechanism: 'Lowers search friction by understanding, refining, and translating multilingual queries to improve consumer-product matching.',
      baselineNote: 'Baseline was standard ML search algorithms—moderate GenAI marginal contribution.'
    },
    descriptions: {
      name: 'Product Description Generation',
      description: '<strong>Automated product content creation</strong> generating comprehensive, structured descriptions for millions of products across multiple languages and markets. Baseline: nearly half of products had no or limited descriptions.',
      baseSalesLift: 2.5,
      baseConversionLift: 6,
      mechanism: 'Enhances product understanding by generating comprehensive, structured, market-localized descriptions for millions of SKUs.',
      baselineNote: 'Baseline: ~50% products had no/limited descriptions—high GenAI value add.'
    },
    push: {
      name: 'Marketing Push Messages',
      description: '<strong>Personalized messaging at scale</strong> generating millions of customized push notifications tailored to individual user preferences and behavior. Baseline was limited personalization capabilities.',
      baseSalesLift: 3.0,
      baseConversionLift: 5,
      mechanism: 'Improves personalization at scale by generating millions of customized messages, closing targeting inefficiencies.',
      baselineNote: 'Baseline: limited personalization capabilities—GenAI enables precision targeting.'
    },
    ads: {
      name: 'Google Advertising Titles',
      description: '<strong>Ad copy optimization</strong> for Google Shopping campaigns, automatically generating and testing product titles to improve click-through. Baseline was human-created titles with existing ML optimization.',
      baseSalesLift: 0,
      baseConversionLift: 0,
      mechanism: 'No measurable effect in this context. When existing ML or human processes are already effective, GenAI augmentation may not move the needle.',
      baselineNote: 'Baseline was already strong—GenAI marginal contribution near zero.'
    },
    chargeback: {
      name: 'Chargeback Defense',
      description: '<strong>Automated dispute resolution</strong> helping sellers defend against payment chargebacks across borders, languages, and regulatory frameworks. Baseline: over half of disputes went unaddressed due to complexity.',
      baseSalesLift: 0, // Not consumer-facing sales metric
      baseConversionLift: 15, // Success rate instead
      mechanism: 'Automates legal defense by streamlining cross-border chargeback processes. Addresses complexity, language barriers, and regulatory diversity.',
      baselineNote: 'Seller-side workflow: 15% higher success rate, not direct consumer sales.'
    },
    translation: {
      name: 'Live Chat Translation',
      description: '<strong>Real-time multilingual support</strong> enabling customer service agents to communicate with customers in any language through instant AI translation integrated into live chat.',
      baseSalesLift: 0, // Satisfaction metric, not direct sales
      baseConversionLift: 5.2, // Satisfaction increase
      mechanism: 'Breaks language barriers through real-time multilingual translation in customer service, enabling native-language support.',
      baselineNote: 'Satisfaction metric: 5.2% increase, indirect conversion impact.'
    }
  };

  // Segment multipliers based on heterogeneity findings
  const SEGMENT_MULTIPLIERS = {
    new: 1.4,        // Newer users benefit disproportionately
    intermediate: 1.0, // Baseline multiplier
    experienced: 0.7  // Experienced users see smaller gains
  };

  function init() {
    const root = document.getElementById('p40-explorer');
    if (!root) {
      console.warn('Paper 40 interactive elements not found, skipping initialization');
      return;
    }

    const workflowSelect = document.getElementById('p40-workflow');
    const baselineSlider = document.getElementById('p40-baseline');
    const baselineValue = document.getElementById('p40-baseline-value');
    const segmentRadios = document.querySelectorAll('input[name="p40-segment"]');
    
    // Preset buttons
    const presetChatbot = document.getElementById('p40-preset-chatbot');
    const presetSearch = document.getElementById('p40-preset-search');
    const presetAds = document.getElementById('p40-preset-ads');
    const presetHeterogeneity = document.getElementById('p40-preset-heterogeneity');

    // Output elements
    const salesLiftEl = document.getElementById('p40-sales-lift');
    const conversionDeltaEl = document.getElementById('p40-conversion-delta');
    const annualValueEl = document.getElementById('p40-annual-value');
    const mechanismEl = document.getElementById('p40-mechanism');
    const interpretationEl = document.getElementById('p40-interpretation');
    const workflowDescriptionEl = document.getElementById('p40-workflow-description');

    if (!workflowSelect || !baselineSlider || !salesLiftEl) {
      console.warn('Required Paper 40 elements not found');
      return;
    }

    // Calculate adjusted gains based on baseline capability
    function calculateBaselineAdjustment(baselinePercent) {
      // Higher baseline (80-100%) reduces GenAI marginal contribution to ~50% of base effect
      // Lower baseline (0-20%) keeps GenAI contribution near 100%
      // Linear interpolation between these bounds
      if (baselinePercent >= 80) {
        return 0.5 + (100 - baselinePercent) / 40 * 0.3; // 0.5 to 0.8
      } else if (baselinePercent <= 20) {
        return 0.9 + baselinePercent / 20 * 0.1; // 0.9 to 1.0
      } else {
        return 0.8 + (80 - baselinePercent) / 60 * 0.1; // 0.8 to 0.9
      }
    }

    // Calculate annual value per user (simplified model)
    function calculateAnnualValue(salesLift) {
      // Paper reports ~$5/consumer for aggregate positive workflows
      // Assume average user spending $90/year, conversion impact drives value
      const avgSpending = 90;
      return (salesLift / 100) * avgSpending;
    }

    // Get selected segment multiplier
    function getSegmentMultiplier() {
      const selectedSegment = document.querySelector('input[name="p40-segment"]:checked');
      return selectedSegment ? SEGMENT_MULTIPLIERS[selectedSegment.value] : 1.0;
    }

    // Update simulation based on current selections
    function updateSimulation() {
      const workflow = workflowSelect.value;
      const baseline = parseInt(baselineSlider.value);
      const config = WORKFLOW_CONFIGS[workflow];
      
      if (!config) return;

      // Update workflow description
      if (workflowDescriptionEl && config.description) {
        workflowDescriptionEl.innerHTML = config.description;
      }

      const baselineAdj = calculateBaselineAdjustment(baseline);
      const segmentMult = getSegmentMultiplier();
      
      // Calculate adjusted sales lift and conversion delta
      const adjustedSalesLift = config.baseSalesLift * baselineAdj * segmentMult;
      const adjustedConversionLift = config.baseConversionLift * baselineAdj * segmentMult;
      const annualValue = calculateAnnualValue(adjustedSalesLift);

      // Update displays
      if (workflow === 'chargeback') {
        salesLiftEl.textContent = 'N/A';
        conversionDeltaEl.textContent = `+${adjustedConversionLift.toFixed(1)}%`;
        annualValueEl.textContent = 'Seller-side';
      } else if (workflow === 'translation') {
        salesLiftEl.textContent = 'Indirect';
        conversionDeltaEl.textContent = `+${adjustedConversionLift.toFixed(1)}%`;
        annualValueEl.textContent = 'Satisfaction';
      } else {
        salesLiftEl.textContent = `${adjustedSalesLift.toFixed(1)}%`;
        conversionDeltaEl.textContent = `+${adjustedConversionLift.toFixed(0)}%`;
        annualValueEl.textContent = `$${annualValue.toFixed(2)}`;
      }

      mechanismEl.textContent = config.mechanism;

      // Update interpretation
      updateInterpretation(workflow, baseline, config, adjustedSalesLift);
    }

    // Update interpretation text
    function updateInterpretation(workflow, baseline, config, adjustedSalesLift) {
      let text = '';

      if (workflow === 'chatbot') {
        if (baseline <= 20) {
          text = `<p>The chatbot workflow shows the largest gains (16.3%) because the baseline was no customer support—GenAI's marginal contribution is highest where existing capabilities are weakest. At ${baseline}% baseline, gains remain near maximum.</p>`;
        } else if (baseline >= 80) {
          text = `<p>At ${baseline}% baseline capability, you already have strong customer support. GenAI augments rather than replaces, so gains drop to ~${adjustedSalesLift.toFixed(1)}%. The paper shows zero-baseline scenarios capture maximum value.</p>`;
        } else {
          text = `<p>With ${baseline}% baseline capability (partial support), GenAI drives ${adjustedSalesLift.toFixed(1)}% sales lift. As baseline improves, marginal GenAI contribution diminishes—prioritize deployment where gaps are largest.</p>`;
        }
      } else if (workflow === 'ads') {
        text = `<p>Google Advertising workflows showed 0% effect regardless of baseline. When existing ML or human processes are already effective, GenAI augmentation may not move the needle. This workflow-dependent pattern is a key finding: not all applications benefit equally.</p>`;
      } else if (workflow === 'chargeback') {
        text = `<p>Chargeback Defense is a seller-side workflow showing 15% higher success rate, not direct consumer sales impact. This demonstrates GenAI's versatility across the business—reducing costs (fewer lost disputes) rather than increasing revenue.</p>`;
      } else if (workflow === 'translation') {
        text = `<p>Live Chat Translation increased consumer satisfaction by 5.2%, an indirect conversion driver. While not a direct sales metric, satisfaction improvements typically correlate with retention and lifetime value—harder to measure but still valuable.</p>`;
      } else {
        text = `<p>This workflow (${config.name}) achieved ${config.baseSalesLift}% sales lift in the paper's experiments. ${config.baselineNote}</p>`;
        if (baseline >= 80) {
          text += `<p>Your ${baseline}% baseline reduces GenAI gains to ~${adjustedSalesLift.toFixed(1)}% because the marginal contribution shrinks when starting from a strong position.</p>`;
        } else {
          text += `<p>At ${baseline}% baseline, GenAI drives ${adjustedSalesLift.toFixed(1)}% lift through ${config.mechanism.toLowerCase()}</p>`;
        }
      }

      text += `<p>Conversion rate increases drive sales, not cart value changes. GenAI expands the market by reducing frictions that previously prevented purchases, rather than extracting more from existing buyers.</p>`;

      interpretationEl.innerHTML = text;
    }

    // Event listeners
    baselineSlider.addEventListener('input', () => {
      baselineValue.textContent = baselineSlider.value;
      updateSimulation();
    });

    workflowSelect.addEventListener('change', updateSimulation);
    
    segmentRadios.forEach(radio => {
      radio.addEventListener('change', updateSimulation);
    });

    // Preset button handlers
    if (presetChatbot) {
      presetChatbot.addEventListener('click', () => {
        workflowSelect.value = 'chatbot';
        baselineSlider.value = 0;
        baselineValue.textContent = '0';
        document.querySelector('input[name="p40-segment"][value="new"]').checked = true;
        updateSimulation();
      });
    }

    if (presetSearch) {
      presetSearch.addEventListener('click', () => {
        workflowSelect.value = 'search';
        baselineSlider.value = 80;
        baselineValue.textContent = '80';
        document.querySelector('input[name="p40-segment"][value="intermediate"]').checked = true;
        updateSimulation();
      });
    }

    if (presetAds) {
      presetAds.addEventListener('click', () => {
        workflowSelect.value = 'ads';
        baselineSlider.value = 90;
        baselineValue.textContent = '90';
        document.querySelector('input[name="p40-segment"][value="intermediate"]').checked = true;
        updateSimulation();
      });
    }

    if (presetHeterogeneity) {
      presetHeterogeneity.addEventListener('click', () => {
        workflowSelect.value = 'descriptions';
        baselineSlider.value = 50;
        baselineValue.textContent = '50';
        document.querySelector('input[name="p40-segment"][value="new"]').checked = true;
        updateSimulation();
      });
    }

    // Initial render
    updateSimulation();
  }

  // Export for paperLoader (do NOT auto-initialize)
  function interactiveScript() {
    setTimeout(() => init(), 0); // Wait a tick for DOM
  }

  // Attach helpers for testing
  interactiveScript.init = init;
  
  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
