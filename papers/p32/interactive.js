function interactiveScript() {
  'use strict';

  // Occupation data based on study findings
  const occupationData = {
    tech: {
      name: 'Technology & Engineering',
      occupations: [
        {
          name: 'Software Developer',
          type: 'performance',
          currentSupport: 42,
          superiorSupport: 71,
          wage: 110140,
          femalePercent: 25,
          careIntensity: 'low',
          factors: [
            'Technical complexity: Logical reasoning and pattern recognition where AI excels',
            'Low emotional stakes: Minimal interpersonal interaction reduces moral concerns',
            'Performance measurability: Clear metrics for code quality, speed, and correctness make AI superiority demonstrable'
          ]
        },
        {
          name: 'Data Analyst',
          type: 'performance',
          currentSupport: 45,
          superiorSupport: 73,
          wage: 68820,
          femalePercent: 38,
          careIntensity: 'low',
          factors: [
            'Analytical focus: Statistical analysis and pattern recognition are AI strengths',
            'Objective evaluation: Results can be validated against ground truth',
            'Cost sensitivity: Organizations prioritize efficiency in analytical work'
          ]
        },
        {
          name: 'Network Administrator',
          type: 'performance',
          currentSupport: 38,
          superiorSupport: 65,
          wage: 90520,
          femalePercent: 28,
          careIntensity: 'low',
          factors: [
            'Rule-based tasks: Network management follows structured protocols suitable for automation',
            'Performance measurability: Uptime, latency, and security metrics provide clear evaluation criteria',
            'Low interpersonal component: Technical focus reduces moral resistance'
          ]
        }
      ]
    },
    business: {
      name: 'Business & Finance',
      occupations: [
        {
          name: 'Financial Analyst',
          type: 'performance',
          currentSupport: 44,
          superiorSupport: 69,
          wage: 87850,
          femalePercent: 44,
          careIntensity: 'low',
          factors: [
            'Data-driven decisions: Financial modeling and forecasting suit AI capabilities',
            'Performance validation: Investment returns and forecast accuracy provide objective metrics',
            'Cost-effectiveness: Financial services firms highly responsive to automation cost benefits'
          ]
        },
        {
          name: 'Accountant',
          type: 'performance',
          currentSupport: 41,
          superiorSupport: 67,
          wage: 77250,
          femalePercent: 61,
          careIntensity: 'low',
          factors: [
            'Structured rules: Tax codes and accounting standards provide clear frameworks for AI',
            'Accuracy focus: Error reduction is primary concern, favoring AI performance claims',
            'Repetitive elements: Pattern recognition in transactions and compliance checks'
          ]
        },
        {
          name: 'Market Research Analyst',
          type: 'performance',
          currentSupport: 43,
          superiorSupport: 70,
          wage: 68230,
          femalePercent: 57,
          careIntensity: 'low',
          factors: [
            'Pattern analysis: Consumer behavior and market trends align with AI pattern recognition',
            'Scale advantages: AI can process vastly more data than human analysts',
            'Speed benefits: Real-time market analysis becomes feasible with automation'
          ]
        }
      ]
    },
    healthcare: {
      name: 'Healthcare (Clinical)',
      occupations: [
        {
          name: 'Radiologist',
          type: 'performance',
          currentSupport: 36,
          superiorSupport: 58,
          wage: 301720,
          femalePercent: 29,
          careIntensity: 'medium',
          factors: [
            'Image analysis: Pattern recognition in medical imaging is established AI strength',
            'Diagnostic accuracy: Performance can be measured against biopsy results and outcomes',
            'High stakes create skepticism: Medical context raises bar for AI performance proof'
          ]
        },
        {
          name: 'Medical Transcriptionist',
          type: 'performance',
          currentSupport: 47,
          superiorSupport: 74,
          wage: 35270,
          femalePercent: 77,
          careIntensity: 'low',
          factors: [
            'Speech-to-text task: Core AI capability with clear performance metrics',
            'Limited patient interaction: Administrative role reduces moral resistance',
            'Cost pressure: Healthcare organizations seek efficiency in documentation'
          ]
        },
        {
          name: 'Clinical Laboratory Technician',
          type: 'performance',
          currentSupport: 40,
          superiorSupport: 64,
          wage: 57380,
          femalePercent: 69,
          careIntensity: 'low',
          factors: [
            'Analytical procedures: Standardized testing protocols suit automation',
            'Accuracy priority: Error reduction in lab results is paramount concern',
            'Volume handling: AI can process higher sample volumes with consistency'
          ]
        }
      ]
    },
    care: {
      name: 'Caregiving & Therapy',
      occupations: [
        {
          name: 'Therapist / Counselor',
          type: 'principle',
          currentSupport: 18,
          superiorSupport: 15,
          wage: 51340,
          femalePercent: 73,
          careIntensity: 'high',
          factors: [
            'Emotional labor: Human empathy seen as irreplaceable and morally necessary',
            'Vulnerability of clients: Automation of care for vulnerable populations triggers moral repugnance',
            'Presence matters: Therapeutic relationship itself is seen as healing—cannot be outsourced to AI'
          ]
        },
        {
          name: 'Childcare Worker',
          type: 'principle',
          currentSupport: 12,
          superiorSupport: 9,
          wage: 28520,
          femalePercent: 94,
          careIntensity: 'high',
          factors: [
            'Sacred trust: Caring for children seen as fundamental human responsibility',
            'Moral repugnance: Automation described as "wrong" and "dehumanizing" regardless of capability',
            'Developmental needs: Children require human attachment and emotional attunement'
          ]
        },
        {
          name: 'Hospice Nurse',
          type: 'principle',
          currentSupport: 14,
          superiorSupport: 11,
          wage: 79200,
          femalePercent: 88,
          careIntensity: 'high',
          factors: [
            'End-of-life dignity: Presence during death seen as sacred human duty',
            'Existential support: Patients need human connection, not clinical efficiency',
            'Family support: Caregivers must support grieving families with genuine empathy'
          ]
        }
      ]
    },
    education: {
      name: 'Education & Training',
      occupations: [
        {
          name: 'University Professor',
          type: 'mixed',
          currentSupport: 28,
          superiorSupport: 42,
          wage: 80790,
          femalePercent: 49,
          careIntensity: 'medium',
          factors: [
            'Mixed resistance: Research tasks seen as automatable, teaching as requiring human connection',
            'Mentorship concern: Personal guidance and role modeling seen as core educational value',
            'Moderate performance sensitivity: Some support increase with capability, but moral floor exists'
          ]
        },
        {
          name: 'K-12 Teacher',
          type: 'mixed',
          currentSupport: 22,
          superiorSupport: 31,
          wage: 61350,
          femalePercent: 76,
          careIntensity: 'high',
          factors: [
            'Developmental role: Teaching young children involves emotional support and character formation',
            'Moral component: Children need human role models, not just information delivery',
            'Limited performance sensitivity: Some acceptance for administrative automation, strong resistance for teaching'
          ]
        },
        {
          name: 'Corporate Trainer',
          type: 'performance',
          currentSupport: 35,
          superiorSupport: 61,
          wage: 63490,
          femalePercent: 55,
          careIntensity: 'low',
          factors: [
            'Adult learners: Professional training context reduces moral concerns vs child education',
            'Performance focus: Organizations prioritize cost-effective skill development',
            'Scalability benefits: AI can deliver consistent training to large, distributed workforces'
          ]
        }
      ]
    },
    creative: {
      name: 'Creative & Media',
      occupations: [
        {
          name: 'Graphic Designer',
          type: 'performance',
          currentSupport: 33,
          superiorSupport: 57,
          wage: 53380,
          femalePercent: 54,
          careIntensity: 'low',
          factors: [
            'Tool perspective: AI seen as design tool rather than replacement for human creativity',
            'Performance demonstrability: Portfolio comparisons make capability differences visible',
            'Cost pressure: Organizations willing to automate routine design work'
          ]
        },
        {
          name: 'Technical Writer',
          type: 'performance',
          currentSupport: 39,
          superiorSupport: 66,
          wage: 78060,
          femalePercent: 55,
          careIntensity: 'low',
          factors: [
            'Structured content: Documentation follows templates and standards suitable for AI',
            'Clarity metrics: Readability and comprehension can be measured objectively',
            'Volume demand: AI can produce more documentation faster with consistency'
          ]
        },
        {
          name: 'Journalist',
          type: 'mixed',
          currentSupport: 29,
          superiorSupport: 44,
          wage: 48530,
          femalePercent: 49,
          careIntensity: 'medium',
          factors: [
            'Mixed views: Data journalism and fact-checking seen as automatable, investigative reporting as requiring human judgment',
            'Trust concerns: Public skeptical of AI-generated news due to misinformation risks',
            'Source relationships: Investigative journalism requires human trust-building'
          ]
        }
      ]
    },
    legal: {
      name: 'Legal Services',
      occupations: [
        {
          name: 'Paralegal',
          type: 'performance',
          currentSupport: 43,
          superiorSupport: 69,
          wage: 56230,
          femalePercent: 86,
          careIntensity: 'low',
          factors: [
            'Document review: Legal research and discovery tasks align with AI text analysis strengths',
            'Accuracy and thoroughness: AI can review more documents with fewer errors',
            'Cost pressure: Law firms highly motivated to reduce paralegal costs'
          ]
        },
        {
          name: 'Contract Analyst',
          type: 'performance',
          currentSupport: 41,
          superiorSupport: 68,
          wage: 74310,
          femalePercent: 61,
          careIntensity: 'low',
          factors: [
            'Pattern matching: Contract clauses and risk assessment suit AI capabilities',
            'Consistency benefits: AI can apply review standards uniformly across documents',
            'Efficiency gains: Organizations seek faster contract turnaround'
          ]
        },
        {
          name: 'Trial Lawyer',
          type: 'mixed',
          currentSupport: 24,
          superiorSupport: 36,
          wage: 126930,
          femalePercent: 37,
          careIntensity: 'medium',
          factors: [
            'Human judgment valued: Jury persuasion and courtroom strategy seen as requiring human insight',
            'Client relationships: Trust and representation raise moral concerns about AI lawyers',
            'Modest performance sensitivity: Some tasks automatable, but core advocacy role protected'
          ]
        }
      ]
    },
    spiritual: {
      name: 'Spiritual & Counseling',
      occupations: [
        {
          name: 'Clergy / Religious Leader',
          type: 'principle',
          currentSupport: 8,
          superiorSupport: 5,
          wage: 54610,
          femalePercent: 21,
          careIntensity: 'high',
          factors: [
            'Sacred role: Religious guidance seen as fundamentally human and divine calling',
            'Moral repugnance: Automation described as "sacrilege" and "missing the entire point"',
            'Spiritual authenticity: Congregants need human presence for genuine spiritual connection'
          ]
        },
        {
          name: 'Substance Abuse Counselor',
          type: 'principle',
          currentSupport: 16,
          superiorSupport: 13,
          wage: 49710,
          femalePercent: 69,
          careIntensity: 'high',
          factors: [
            'Vulnerability of clients: Addiction recovery requires human empathy and non-judgment',
            'Lived experience: Counselors often share recovery experiences, creating authentic connection',
            'Moral boundary: Automating care for vulnerable populations triggers categorical resistance'
          ]
        },
        {
          name: 'Life Coach',
          type: 'mixed',
          currentSupport: 25,
          superiorSupport: 34,
          wage: 48720,
          femalePercent: 72,
          careIntensity: 'medium',
          factors: [
            'Goal-setting automation: Tactical planning and accountability seen as partly automatable',
            'Emotional support boundary: Deep personal guidance requires human judgment and empathy',
            'Moderate moral concern: Less vulnerable than therapy clients, but still requires authentic human connection'
          ]
        }
      ]
    }
  };

  function getElements() {
    return {
      categorySelect: document.getElementById('p32-category'),
      occupationSelect: document.getElementById('p32-occupation'),
      currentSupport: document.getElementById('p32-current-support'),
      currentBar: document.getElementById('p32-current-bar'),
      superiorSupport: document.getElementById('p32-superior-support'),
      superiorBar: document.getElementById('p32-superior-bar'),
      delta: document.getElementById('p32-delta'),
      deltaInterpretation: document.getElementById('p32-delta-interpretation'),
      classification: document.getElementById('p32-classification'),
      wage: document.getElementById('p32-wage'),
      wageComparison: document.getElementById('p32-wage-comparison'),
      demographics: document.getElementById('p32-demographics'),
      care: document.getElementById('p32-care'),
      factors: document.getElementById('p32-factors'),
      recommendations: document.getElementById('p32-recommendations')
    };
  }

  function populateOccupations(category) {
    const els = getElements();
    const data = occupationData[category];
    
    if (!els.occupationSelect || !data) return;
    
    els.occupationSelect.innerHTML = '';
    data.occupations.forEach((occ, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = occ.name;
      els.occupationSelect.appendChild(option);
    });
    
    updateUI();
  }

  function updateUI() {
    const els = getElements();
    if (!els.categorySelect || !els.occupationSelect) return;
    
    const category = els.categorySelect.value;
    const occupationIndex = parseInt(els.occupationSelect.value) || 0;
    const occupation = occupationData[category].occupations[occupationIndex];
    
    if (!occupation) return;
    
    // Update support metrics
    const delta = occupation.superiorSupport - occupation.currentSupport;
    
    if (els.currentSupport) els.currentSupport.textContent = `${occupation.currentSupport}%`;
    if (els.currentBar) {
      els.currentBar.style.width = `${occupation.currentSupport}%`;
      els.currentBar.className = `h-3 rounded-full transition-all duration-300 ${
        occupation.currentSupport < 30 ? 'bg-red-500' : 
        occupation.currentSupport < 50 ? 'bg-amber-500' : 'bg-blue-500'
      }`;
    }
    
    if (els.superiorSupport) els.superiorSupport.textContent = `${occupation.superiorSupport}%`;
    if (els.superiorBar) {
      els.superiorBar.style.width = `${occupation.superiorSupport}%`;
      els.superiorBar.className = `h-3 rounded-full transition-all duration-300 ${
        occupation.superiorSupport < 30 ? 'bg-red-500' : 
        occupation.superiorSupport < 50 ? 'bg-amber-500' : 'bg-green-500'
      }`;
    }
    
    if (els.delta) {
      els.delta.textContent = delta > 0 ? `+${delta}%` : `${delta}%`;
      els.delta.className = `text-sm font-mono font-bold ${
        delta > 15 ? 'text-green-600' : 
        delta > 0 ? 'text-amber-600' : 'text-red-600'
      }`;
    }
    
    // Update delta interpretation and classification
    updateClassification(occupation, delta, els);
    
    // Update occupation characteristics
    if (els.wage) els.wage.textContent = `$${occupation.wage.toLocaleString()}`;
    if (els.wageComparison) {
      const avgWage = 40900;
      const ratio = (occupation.wage / avgWage).toFixed(2);
      els.wageComparison.textContent = ratio > 1 
        ? `${ratio}× higher than average` 
        : `${(1/ratio).toFixed(2)}× lower than average`;
      els.wageComparison.className = `text-xs ${ratio > 1 ? 'text-green-600' : 'panel-muted'}`;
    }
    
    if (els.demographics) {
      els.demographics.textContent = `${occupation.femalePercent}% Female`;
    }
    
    if (els.care) {
      const careLabels = {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      };
      const careDescriptions = {
        low: 'Minimal emotional labor',
        medium: 'Moderate interpersonal interaction',
        high: 'Intensive emotional support required'
      };
      els.care.textContent = careLabels[occupation.careIntensity] || 'Low';
      els.care.nextElementSibling.textContent = careDescriptions[occupation.careIntensity] || 'Minimal emotional labor';
    }
    
    // Update factors
    if (els.factors) {
      els.factors.innerHTML = occupation.factors.map(factor => `
        <div class="flex items-start gap-2">
          <span>•</span>
          <span>${factor}</span>
        </div>
      `).join('');
    }
    
    // Update recommendations
    updateRecommendations(occupation, els);
  }

  function updateClassification(occupation, delta, els) {
    if (!els.classification || !els.deltaInterpretation) return;
    
    let icon, title, description, objections, strategy;
    
    if (occupation.type === 'principle') {
      icon = '⛔';
      title = 'Resistance Classification: Principle-Based (Moral Boundary)';
      description = `This occupation faces <strong>principle-based resistance</strong> that persists regardless of AI capability. Support may actually <em>decrease</em> when AI is described as superior, triggering moral repugnance. Public concerns are existential, not technical.`;
      objections = '"This is wrong," "Dehumanizing," "Machines can\'t provide genuine care"';
      strategy = '<strong>Abandon replacement framing.</strong> Position AI as administrative support only (scheduling, documentation, logistics). Emphasize human primacy and oversight. Never claim AI can match or exceed human capabilities in core emotional labor—this triggers backlash.';
      
      if (els.deltaInterpretation) {
        els.deltaInterpretation.textContent = delta < 0 
          ? 'Support decreases when AI described as superior—moral repugnance activated. This is a categorical boundary.' 
          : 'Minimal or no support increase indicates principle-based resistance. Performance claims are irrelevant.';
        els.deltaInterpretation.className = 'text-xs text-red-600';
      }
    } else if (occupation.type === 'mixed') {
      icon = '⚖️';
      title = 'Resistance Classification: Mixed (Performance + Principle)';
      description = `This occupation shows <strong>hybrid resistance</strong> patterns. Some tasks face performance-based resistance (fades with better AI), others hit moral boundaries (permanent). Support increases modestly with capability improvements but plateaus before full acceptance.`;
      objections = 'Mix of "Not good enough yet" and "Some aspects require human judgment"';
      strategy = '<strong>Task decomposition approach.</strong> Identify and automate technical/administrative tasks while protecting human roles in judgment, relationships, and mentorship. Frame AI as augmentation for routine work, preserving human primacy for high-stakes decisions.';
      
      if (els.deltaInterpretation) {
        els.deltaInterpretation.textContent = 'Moderate support increase suggests mixed resistance. Some tasks automatable, others require human touch.';
        els.deltaInterpretation.className = 'text-xs text-amber-600';
      }
    } else {
      icon = '📊';
      title = 'Resistance Classification: Performance-Based';
      description = `This occupation faces <strong>performance-based resistance</strong> that decreases as AI capabilities improve. Public concerns focus on accuracy, reliability, and cost-effectiveness rather than moral objections.`;
      objections = '"Not accurate enough," "Too expensive," "Can\'t handle edge cases"';
      strategy = '<strong>Emphasize capability benchmarks and cost advantages.</strong> Resistance will fade with technical improvements. Invest in transparency reports, head-to-head comparisons, and case studies demonstrating superior performance.';
      
      if (els.deltaInterpretation) {
        els.deltaInterpretation.textContent = delta > 15 
          ? 'Large support increase indicates performance-based resistance. Better AI capabilities will overcome public skepticism.' 
          : 'Moderate support increase suggests some performance concerns remain. Continue improving capabilities.';
        els.deltaInterpretation.className = `text-xs ${delta > 15 ? 'text-green-600' : 'text-amber-600'}`;
      }
    }
    
    els.classification.innerHTML = `
      <div class="flex items-start gap-2">
        <span class="text-lg">${icon}</span>
        <div class="space-y-2">
          <h4 class="text-sm font-semibold text-heading">${title}</h4>
          <p class="text-xs text-body">${description}</p>
          <div class="text-xs panel-muted space-y-1">
            <p><strong>Typical objections:</strong> ${objections}</p>
            <p><strong>Strategy:</strong> ${strategy}</p>
          </div>
        </div>
      </div>
    `;
  }

  function updateRecommendations(occupation, els) {
    if (!els.recommendations) return;
    
    let framing, evidence, avoid;
    
    if (occupation.type === 'principle') {
      framing = '<strong>Augmentation only.</strong> Never claim AI can replace human caregivers. Position as "administrative assistant" or "documentation tool" that gives caregivers more time with clients. Emphasize human remains in control and primary decision-maker.';
      evidence = 'Time savings for human caregivers, reduced administrative burden, more capacity for human connection. Never showcase AI-client interactions or claim emotional understanding.';
      avoid = '<strong>Critical:</strong> Avoid any language suggesting AI can match human empathy, care, or emotional intelligence. Don\'t show AI interacting directly with vulnerable populations. Don\'t cite performance superiority—it triggers moral repugnance.';
    } else if (occupation.type === 'mixed') {
      framing = '<strong>Task decomposition messaging.</strong> Clearly separate routine/technical tasks (automatable) from judgment/relationship tasks (human-required). Frame AI as "handling the busywork so humans focus on what matters."';
      evidence = 'Efficiency gains in administrative work, time freed for human interaction, consistency in routine tasks. Include human testimonials about improved job satisfaction when freed from repetitive work.';
      avoid = 'Don\'t suggest AI can handle entire role. Don\'t minimize the importance of human judgment in core responsibilities. Acknowledge moral boundaries while demonstrating technical value.';
    } else {
      framing = '<strong>Performance and cost advantages.</strong> Lead with capability benchmarks, accuracy improvements, and cost reductions. Use comparative language: "faster," "more accurate," "more consistent" than human baselines.';
      evidence = 'Head-to-head performance comparisons, case studies showing ROI, testimonials from early adopters citing productivity gains. Quantify improvements in speed, accuracy, and cost.';
      avoid = 'Don\'t be overly aggressive about human replacement. Frame as "complementary" even for performance-sensitive roles. Acknowledge AI limitations and edge cases where human oversight remains valuable.';
    }
    
    els.recommendations.innerHTML = `
      <p><strong>Recommended framing:</strong> ${framing}</p>
      <p><strong>Evidence to showcase:</strong> ${evidence}</p>
      <p><strong>Messaging to avoid:</strong> ${avoid}</p>
    `;
  }

  function attachListeners() {
    const els = getElements();
    
    if (els.categorySelect) {
      els.categorySelect.addEventListener('change', () => {
        populateOccupations(els.categorySelect.value);
      });
    }
    
    if (els.occupationSelect) {
      els.occupationSelect.addEventListener('change', updateUI);
    }
  }

  // Initialize
  populateOccupations('tech');
  attachListeners();
}

// Export for both CommonJS and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { interactiveScript };
}
