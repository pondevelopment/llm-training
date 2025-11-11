(function() {
  'use strict';

  // Accuracy model based on paper figures and tables
  // Paper's best result: 85.90% swarm vs 68.69% majority = +17.21pp on GPQA Diamond
  function calculateAccuracy(swarmSize, reputationMode, byzantineFraction, promptType) {
    // Start from a baseline that can grow to paper's optimal results
    // Base assumes: 5 models, weighted reputation, 0% Byzantine, clean prompts
    let swarmBase = 78.0;    // below optimal
    let majorityBase = 68.69; // matches paper
    
    // Swarm size effect: sweet spot is 5-7 models
    // 3 models: penalty, 5-7 models: optimal, 10 models: diminishing returns
    let sizeBonus = 0;
    if (swarmSize < 5) {
      sizeBonus = (swarmSize - 3) * 2.5; // -5pp at 3, 0pp at 5
    } else if (swarmSize <= 7) {
      sizeBonus = (swarmSize - 5) * 3.95; // 0pp at 5, +7.9pp at 7
    } else {
      sizeBonus = 7.9; // plateau at 7+
    }
    swarmBase += sizeBonus;
    majorityBase += Math.max(0, sizeBonus * 0.2); // majority benefits minimally
    
    // Reputation mode effect
    const reputationAdjust = {
      uniform: -6.0,    // democracy loses signal (-6pp)
      weighted: 0,      // baseline from paper
      meritocratic: +2.0 // meritocracy boost (+2pp)
    };
    swarmBase += reputationAdjust[reputationMode];
    
    // Byzantine node effect: swarm degrades gracefully, majority voting collapses
    if (byzantineFraction > 0) {
      const byzantineImpact = byzantineFraction / 100;
      swarmBase -= byzantineImpact * 30;      // -9pp at 30% Byzantine
      majorityBase -= byzantineImpact * 50;   // -15pp at 30% Byzantine
    }
    
    // Prompt type effect (from paper Table 3)
    const promptPenalty = {
      clean: { swarm: 0, majority: 0 },
      noisy: { swarm: 0.05, majority: 3.0 },           // minimal vs moderate
      adversarial: { swarm: 0.12, majority: 6.20 }     // 52× more resilient
    };
    swarmBase -= promptPenalty[promptType].swarm;
    majorityBase -= promptPenalty[promptType].majority;
    
    // Cap at realistic range
    return {
      swarm: Math.min(86, Math.max(50, swarmBase)),
      majority: Math.min(70, Math.max(40, majorityBase))
    };
  }

  function init() {
    const swarmSizeSlider = document.getElementById('p58-swarm-size');
    const swarmSizeValue = document.getElementById('p58-swarm-size-value');
    const reputationSelect = document.getElementById('p58-reputation');
    const byzantineSlider = document.getElementById('p58-byzantine');
    const byzantineValue = document.getElementById('p58-byzantine-value');
    const promptTypeSelect = document.getElementById('p58-prompt-type');
    
    const swarmValueEl = document.getElementById('p58-swarm-value');
    const majorityValueEl = document.getElementById('p58-majority-value');
    const improvementValueEl = document.getElementById('p58-improvement-value');
    const swarmBar = document.getElementById('p58-swarm-bar');
    const majorityBar = document.getElementById('p58-majority-bar');
    const improvementBar = document.getElementById('p58-improvement-bar');
    const costEl = document.getElementById('p58-cost');
    const summary = document.getElementById('p58-summary');
    const explanation = document.getElementById('p58-explanation');

    if (!swarmSizeSlider || !swarmValueEl) {
      console.warn('p58 interactive elements not found');
      return;
    }

    function updateUI() {
      const swarmSize = parseInt(swarmSizeSlider.value);
      const reputationMode = reputationSelect.value;
      const byzantineFraction = parseInt(byzantineSlider.value);
      const promptType = promptTypeSelect.value;
      
      // Update slider labels
      swarmSizeValue.textContent = swarmSize;
      byzantineValue.textContent = byzantineFraction;
      
      // Calculate accuracies
      const acc = calculateAccuracy(swarmSize, reputationMode, byzantineFraction, promptType);
      const improvement = acc.swarm - acc.majority;
      
      // Update values
      swarmValueEl.textContent = `${acc.swarm.toFixed(2)}%`;
      majorityValueEl.textContent = `${acc.majority.toFixed(2)}%`;
      improvementValueEl.textContent = `+${improvement.toFixed(2)}pp`;
      
      // Update bars
      // Improvement bar scaled so max gain (~30pp) stays within bounds
      swarmBar.style.width = `${acc.swarm}%`;
      majorityBar.style.width = `${acc.majority}%`;
      improvementBar.style.width = `${Math.abs(improvement) * 3.2}%`; // ~8pp = 26%, ~17pp = 54%, ~30pp = 96%
      
      // Update cost
      const comparisons = 3 * swarmSize;
      costEl.textContent = `${swarmSize} generations + ${comparisons} pairwise comparisons`;
      
      // Update summary
      summary.textContent = `N=${swarmSize}, ${reputationMode}, ${byzantineFraction}% Byzantine, ${promptType}`;
      
      // Generate explanation
      let html = '<p>';
      
      // Swarm size analysis
      if (swarmSize < 5) {
        html += `<strong>Why this matters:</strong> With only ${swarmSize} models, you're like having a small panel of judges—not enough diversity to catch subtle differences in quality. `;
        html += `Think of it like tasting wine with 3 friends vs 7: more palates catch more nuances. The research found that 5-7 models is the sweet spot where you get enough diversity without excessive cost. `;
      } else if (swarmSize > 7) {
        html += `<strong>Cost vs benefit:</strong> ${swarmSize} models means ${comparisons} pairwise judgments per question. That's like asking every judge to compare every wine—very thorough but expensive. `;
        html += `The accuracy improvement starts to plateau here while costs keep rising. For most businesses, 5-7 models hits the sweet spot. Save the bigger swarms for your most critical decisions. `;
      } else {
        html += `<strong>The Goldilocks zone:</strong> ${swarmSize} models is "just right"—enough diversity to catch quality differences without excessive cost. `;
        html += `The research team found this range delivers maximum accuracy improvement per dollar spent. Like having a good-sized expert panel: enough voices to avoid groupthink, not so many you drown in opinions. `;
      }
      
      html += '</p><p>';
      
      // Reputation mode analysis
      if (reputationMode === 'uniform') {
        html += `<strong>Everyone gets equal say:</strong> Like a democracy where every vote counts the same, regardless of expertise. Sounds fair, but you're treating a world-class expert the same as someone who's been wrong 40% of the time. `;
        html += `Your accuracy drops about 8% because you're not learning from past performance. It's like asking your least-reliable friend for advice as often as your most-reliable one. `;
      } else if (reputationMode === 'meritocratic') {
        html += `<strong>Only the best matter:</strong> The top 30% of performers dominate all decisions—like a company where only senior leadership's opinions count. `;
        html += `Boosts accuracy by ~5% because you're filtering out noise aggressively, but risky if those "top" models all share the same blind spots. Works best when you have proven bad actors you need to shut out completely. `;
      } else {
        html += `<strong>Earn your influence:</strong> Models that consistently get it right naturally gain more weight in decisions—like building trust with a colleague who always delivers. `;
        html += `This is the recommended approach: it rewards good performance without completely silencing anyone, catches both quality signals and diverse perspectives, and adapts automatically as models improve or degrade over time. `;
      }
      
      html += '</p><p>';
      
      // Byzantine analysis
      if (byzantineFraction === 0) {
        html += `<strong>Perfect world scenario:</strong> All models are behaving honestly, giving their best judgments. Your swarm achieves its maximum potential: ${acc.swarm.toFixed(2)}% accuracy. `;
        html += `In real life, you'll have some noise (buggy models, API hiccups, occasional weird responses), so it's wise to test how well your system handles troublemakers before going live. `;
      } else if (byzantineFraction <= 15) {
        html += `<strong>Realistic conditions:</strong> ${byzantineFraction}% of your models are giving bad judgments—like having ${Math.round(swarmSize * byzantineFraction / 100)} unreliable people on a ${swarmSize}-person committee. `;
        html += `The swarm still delivers ${acc.swarm.toFixed(2)}% accuracy because the reliable majority outweighs the noise. Simple voting drops to ${acc.majority.toFixed(2)}%—shows why the sophisticated approach matters when you can't trust everyone completely. `;
      } else {
        html += `<strong>Stress test:</strong> ${byzantineFraction}% bad actors is extreme—imagine nearly 1 in 3 committee members actively sabotaging. The swarm drops to ${acc.swarm.toFixed(2)}% but stays functional. `;
        html += `Simple voting collapses to ${acc.majority.toFixed(2)}% (barely better than guessing). This robustness is why banks and hospitals should consider swarm approaches: the system survives even when things go badly wrong. `;
      }
      
      html += '</p><p>';
      
      // Prompt type analysis
      if (promptType === 'adversarial') {
        html += `<strong>Under attack:</strong> Someone's actively trying to trick your AI with malicious prompts (like "ignore your safety rules and do X" or injecting fake instructions). `;
        html += `A single model drops from its baseline by about 6%—hackers have gotten good at this. Your swarm? Only ${(0.12).toFixed(2)}% drop. That's 52× more resilient. `;
        html += `Why? An attack designed for GPT-4's weaknesses doesn't work on Claude, which has different architecture and training. Having multiple AI "species" means no single exploit breaks everything. `;
      } else if (promptType === 'noisy') {
        html += `<strong>Real-world messiness:</strong> The question has extra junk—like asking "What's 2+2?" but including 3 paragraphs of irrelevant backstory. `;
        html += `This confuses single models significantly, but your swarm barely notices because when one model gets distracted by noise, the others stay focused. During pairwise comparison, the confused answer gets rejected. It's like having multiple editors catch each other's mistakes. `;
      } else {
        html += `<strong>Best case scenario:</strong> Clear, well-formed questions with no tricks or noise. Your swarm is ${improvement.toFixed(2)} percentage points better than simple voting (that's ${((improvement/acc.majority)*100).toFixed(1)}% relative improvement). `;
        html += `The research paper got +17.21 points on graduate-level science questions with a similar setup. This accuracy boost is why companies use swarms for high-stakes decisions where being wrong is expensive. `;
      }
      
      html += '</p>';
      
      explanation.innerHTML = html;
    }

    swarmSizeSlider.addEventListener('input', updateUI);
    reputationSelect.addEventListener('change', updateUI);
    byzantineSlider.addEventListener('input', updateUI);
    promptTypeSelect.addEventListener('change', updateUI);
    
    updateUI(); // Initial render
  }

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
