// Paper 35: GenAI Impact on Academic Performance
// Interactive calculator for estimating productivity and quality gains

(function() {
  'use strict';

  function calculateImpact() {
    // Get researcher profile
    const careerStage = document.getElementById('careerStage')?.value || 'mid';
    const languageBackground = document.getElementById('languageBackground')?.value || 'native';
    const fieldComplexity = document.getElementById('fieldComplexity')?.value || 'mixed';
    const baselineProductivity = parseFloat(document.getElementById('baselineProductivity')?.value || 2.5);
    const adoptionYear = document.getElementById('adoptionYear')?.value || '2024';

    // Base effect sizes from the paper
    // Year 1: +15% productivity, +1.3% quality
    // Year 2: +36% productivity, +2.0% quality
    let productivityY1 = 0.15;
    let productivityY2 = 0.36;
    let qualityY1 = 0.013;
    let qualityY2 = 0.020;

    // Career stage multipliers (early-career shows strongest gains)
    const careerMultipliers = {
      early: 1.4,      // +40% relative to baseline
      mid: 1.0,        // baseline
      established: 0.7 // -30% (established researchers have less room to grow)
    };

    // Language background multipliers (non-English speakers benefit most)
    const languageMultipliers = {
      native: 0.8,    // -20% (already proficient)
      close: 1.1,     // +10% (moderate language barrier)
      distant: 1.5    // +50% (significant language barrier removed)
    };

    // Field complexity multipliers (technical fields show larger gains)
    const fieldMultipliers = {
      qualitative: 0.9,   // -10% (less technical bottleneck)
      mixed: 1.0,         // baseline
      quantitative: 1.3   // +30% (technical writing accelerated)
    };

    // Apply multipliers
    const careerMult = careerMultipliers[careerStage];
    const langMult = languageMultipliers[languageBackground];
    const fieldMult = fieldMultipliers[fieldComplexity];
    const totalMultiplier = careerMult * langMult * fieldMult;

    // Calculate adjusted effects
    productivityY1 = Math.min(0.65, productivityY1 * totalMultiplier); // cap at 65%
    productivityY2 = Math.min(0.85, productivityY2 * totalMultiplier); // cap at 85%
    qualityY1 = Math.min(0.05, qualityY1 * (totalMultiplier * 0.7)); // quality gains more modest
    qualityY2 = Math.min(0.08, qualityY2 * (totalMultiplier * 0.7));

    // Calculate projected papers
    const papersY1 = baselineProductivity * (1 + productivityY1);
    const papersY2 = baselineProductivity * (1 + productivityY2);

    // Calculate cumulative gain over 2 years
    const baseline2Year = baselineProductivity * 2;
    const projected2Year = papersY1 + papersY2;
    const cumulativeGain = projected2Year - baseline2Year;
    const cumulativePercent = (cumulativeGain / baseline2Year) * 100;

    return {
      productivityY1: productivityY1,
      productivityY2: productivityY2,
      qualityY1: qualityY1,
      qualityY2: qualityY2,
      baselineProductivity: baselineProductivity,
      papersY1: papersY1,
      papersY2: papersY2,
      cumulativeGain: cumulativeGain,
      cumulativePercent: cumulativePercent,
      careerStage: careerStage,
      languageBackground: languageBackground,
      fieldComplexity: fieldComplexity,
      adoptionYear: adoptionYear
    };
  }

  function generateInsights(metrics) {
    const insights = [];

    // Career stage insights
    if (metrics.careerStage === 'early') {
      insights.push('✅ <strong>Early-career advantage:</strong> You\'re in the demographic showing strongest GenAI gains. The study found early-career researchers benefit most, likely because they face steeper learning curves in academic writing conventions and have less access to established co-author networks. GenAI acts as a force multiplier for building publication portfolios quickly.');
    } else if (metrics.careerStage === 'established') {
      insights.push('⚠️ <strong>Diminishing returns for established researchers:</strong> Your demographic shows smaller gains—established authors already have writing infrastructure (co-authors, templates, institutional support). GenAI primarily helps with speed rather than unlocking new capabilities. Focus use cases on rapid literature reviews and first-draft acceleration.');
    } else {
      insights.push('📊 <strong>Mid-career baseline:</strong> Your profile matches the study\'s median researcher. Expect gains close to the reported averages: 15% year one, 36% year two. Most value comes from reducing revision cycles and speeding up response to reviewer comments.');
    }

    // Language background insights
    if (metrics.languageBackground === 'distant') {
      insights.push('🌍 <strong>Language barrier reduction:</strong> Non-English speakers from linguistically distant countries show the largest productivity gains in the study. GenAI effectively subsidizes language editing costs—what previously required expensive professional editing or exhausting self-revision now happens in minutes. This is structural advantage, not incremental improvement.');
    } else if (metrics.languageBackground === 'native') {
      insights.push('💬 <strong>Limited language advantage:</strong> As a native English speaker, you won\'t benefit from GenAI\'s language polishing as much as non-native speakers. Your gains will come from speed (drafting, literature synthesis) rather than quality improvements. Consider focusing GenAI use on ideation and structural organization.');
    } else {
      insights.push('🔤 <strong>Moderate language benefits:</strong> Speakers of Germanic/Romance languages still face linguistic friction in academic English. GenAI helps with idiomatic phrasing and register consistency, but gains are less dramatic than for linguistically distant authors.');
    }

    // Field complexity insights
    if (metrics.fieldComplexity === 'quantitative') {
      insights.push('🔬 <strong>Technical field acceleration:</strong> Quantitative and computational researchers show amplified gains—GenAI helps translate statistical results into clear prose, generate boilerplate methods sections, and draft technical appendices. The study suggests this is where productivity gains compound fastest.');
    } else if (metrics.fieldComplexity === 'qualitative') {
      insights.push('📝 <strong>Qualitative field nuance:</strong> Gains in qualitative research are more modest. GenAI struggles with interpretive depth and theoretical nuance that define qualitative excellence. Use it for literature reviews and structural scaffolding, but don\'t expect it to replace close reading or thick description.');
    }

    // Quality interpretation
    if (metrics.qualityY2 > 0.03) {
      insights.push('📈 <strong>Quality gains detected:</strong> Your profile predicts journal impact factor improvements alongside productivity gains. This suggests GenAI may help you target higher-tier venues—perhaps by improving manuscript polish or enabling more ambitious scope. Monitor submission/acceptance patterns to validate.');
    } else {
      insights.push('⚖️ <strong>Quality neutral:</strong> Expect minimal impact on journal quality metrics. Productivity gains come from speed, not from dramatically improving research quality. This is actually reassuring—it rules out the "quantity over quality" concern.');
    }

    // Cumulative impact interpretation
    if (metrics.cumulativeGain > 3.0) {
      insights.push(`🚀 <strong>High impact trajectory:</strong> Your profile projects ${metrics.cumulativeGain.toFixed(1)} extra papers over 2 years—equivalent to adding ${(metrics.cumulativeGain / 2).toFixed(1)} papers per year. For early-career academics, this could mean the difference between competitive and non-competitive tenure cases.`);
    } else if (metrics.cumulativeGain < 1.5) {
      insights.push(`💡 <strong>Modest gains expected:</strong> ${metrics.cumulativeGain.toFixed(1)} extra papers over 2 years is meaningful but not transformative. Focus on using GenAI strategically for high-leverage tasks (responses to reviewers, revisions) rather than treating it as a general productivity multiplier.`);
    }

    return insights;
  }

  function generateTimeline(metrics) {
    const adoptionYear = parseInt(metrics.adoptionYear);
    const years = [2023, 2024, 2025, 2026];
    const timeline = [];

    years.forEach(year => {
      const yearsSinceAdoption = year - adoptionYear;
      let papers, label, effect;

      if (yearsSinceAdoption < 0) {
        // Pre-adoption
        papers = metrics.baselineProductivity;
        label = 'Baseline (no GenAI)';
        effect = 'none';
      } else if (yearsSinceAdoption === 0) {
        // Adoption year (partial effect)
        papers = metrics.baselineProductivity * (1 + metrics.productivityY1 * 0.5);
        label = `Adoption year (+${(metrics.productivityY1 * 50).toFixed(0)}% partial)`;
        effect = 'partial';
      } else if (yearsSinceAdoption === 1) {
        // Year 1 full effect
        papers = metrics.papersY1;
        label = `Year 1 (+${(metrics.productivityY1 * 100).toFixed(0)}%)`;
        effect = 'year1';
      } else if (yearsSinceAdoption === 2) {
        // Year 2 full effect
        papers = metrics.papersY2;
        label = `Year 2 (+${(metrics.productivityY2 * 100).toFixed(0)}%)`;
        effect = 'year2';
      } else {
        // Plateau assumption (maintain year 2 gains)
        papers = metrics.papersY2;
        label = `Year ${yearsSinceAdoption} (sustained)`;
        effect = 'sustained';
      }

      timeline.push({ year, papers: papers.toFixed(1), label, effect });
    });

    return timeline;
  }

  function renderTimeline(timeline) {
    const container = document.getElementById('timeline');
    if (!container) return;

    const html = timeline.map(item => {
      const barWidth = Math.min(100, (item.papers / 10) * 100);
      let barColor = '#94a3b8'; // neutral gray
      
      // Use direct color values for reliability
      if (item.effect === 'year1') barColor = '#6366f1'; // indigo (accent)
      if (item.effect === 'year2') barColor = '#4f46e5'; // stronger indigo
      if (item.effect === 'sustained') barColor = '#10b981'; // green (success)
      if (item.effect === 'partial') barColor = '#0ea5e9'; // sky blue (info)

      return `
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="font-medium text-body">${item.year}: ${item.label}</span>
            <span class="font-bold text-heading">${item.papers} papers</span>
          </div>
          <div class="w-full bg-surface rounded h-2 overflow-hidden border border-divider">
            <div class="h-full transition-all duration-300" style="width: ${barWidth}%; background: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }

  function updateUI() {
    const metrics = calculateImpact();

    // Update productivity metrics
    const prodY1El = document.getElementById('productivityYear1');
    const prodY2El = document.getElementById('productivityYear2');
    if (prodY1El) prodY1El.textContent = `+${(metrics.productivityY1 * 100).toFixed(0)}%`;
    if (prodY2El) prodY2El.textContent = `+${(metrics.productivityY2 * 100).toFixed(0)}%`;

    // Update quality metrics
    const qualY1El = document.getElementById('qualityYear1');
    const qualY2El = document.getElementById('qualityYear2');
    if (qualY1El) qualY1El.textContent = `+${(metrics.qualityY1 * 100).toFixed(1)}%`;
    if (qualY2El) qualY2El.textContent = `+${(metrics.qualityY2 * 100).toFixed(1)}%`;

    // Update paper counts
    const baseY1El = document.getElementById('baselinePapersY1');
    const baseY2El = document.getElementById('baselinePapersY2');
    const projY1El = document.getElementById('projectedPapersY1');
    const projY2El = document.getElementById('projectedPapersY2');
    if (baseY1El) baseY1El.textContent = metrics.baselineProductivity.toFixed(1);
    if (baseY2El) baseY2El.textContent = metrics.baselineProductivity.toFixed(1);
    if (projY1El) projY1El.textContent = metrics.papersY1.toFixed(1);
    if (projY2El) projY2El.textContent = metrics.papersY2.toFixed(1);

    // Update cumulative gain
    const cumulativeEl = document.getElementById('cumulativeGain');
    const impactBarEl = document.getElementById('impactBar');
    if (cumulativeEl) cumulativeEl.textContent = `+${metrics.cumulativeGain.toFixed(1)} papers`;
    if (impactBarEl) {
      const barWidth = Math.min(100, (metrics.cumulativePercent / 50) * 100);
      impactBarEl.style.width = `${barWidth}%`;
    }

    // Update baseline label
    const baselineLabelEl = document.getElementById('baselineLabel');
    if (baselineLabelEl) baselineLabelEl.textContent = metrics.baselineProductivity.toFixed(1);

    // Generate and render timeline
    const timeline = generateTimeline(metrics);
    renderTimeline(timeline);

    // Generate and display insights
    const insights = generateInsights(metrics);
    const insightsEl = document.getElementById('insights');
    if (insightsEl) {
      insightsEl.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
    }
  }

  function init() {
    // Attach event listeners
    const controls = [
      'careerStage',
      'languageBackground',
      'fieldComplexity',
      'baselineProductivity',
      'adoptionYear'
    ];

    controls.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', updateUI);
        el.addEventListener('input', updateUI);
      }
    });

    // Initial render
    updateUI();
  }

  // Export for browser global access
  if (typeof window !== 'undefined') {
    window.interactiveScript = init;
  }

  // CommonJS export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { interactiveScript: init };
  }
})();
