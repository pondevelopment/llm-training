/**
 * Paper 24 Interactive: AI Skill Formation Simulator
 * Models how different AI interaction patterns affect learning outcomes
 * Based on Shen & Tamkin (2026) experimental data (n=52)
 */

(function() {
  'use strict';

  // ── Shared helpers (IIFE top scope) ──
  const getCssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  // ── Constants from paper (Figure 11, Table 4, Figures 6-8) ──

  // Six AI interaction patterns + control group
  // Quiz scores as fractions of 27 points, completion times in minutes
  const PATTERNS = {
    none: {
      label: 'No AI (Control)',
      quizPct: 0.65,       // ~65% average control group (Figure 6)
      timeMin: 23.5,       // ~23.5 min average control (Figure 6)
      medianErrors: 3,     // Table 4: median 3 errors (Q1-Q3: 2-5)
      debugSkill: 0.72,    // Higher — independent debugging (Figure 8)
      conceptSkill: 0.68,  // Higher — self-guided learning
      readingSkill: 0.60,  // Similar baseline across groups
      desc: 'No AI assistance. Learning happens through independent problem-solving, encountering errors, and reading documentation.',
      scoring: 'high',
      n: 26
    },
    conceptual: {
      label: 'Conceptual Inquiry',
      quizPct: 0.86,       // Figure 11: 86%
      timeMin: 24,         // Figure 11: 24 min
      medianErrors: 2,     // Higher errors than other AI patterns — independent resolution
      debugSkill: 0.82,    // Highest — resolved errors independently
      conceptSkill: 0.90,  // Highest — asked conceptual questions only
      readingSkill: 0.78,  // Good code comprehension from engagement
      desc: 'Only asked conceptual questions; resolved all errors independently. Highest quiz scores — cognitive engagement preserved learning.',
      scoring: 'high',
      n: 7
    },
    'gen-then-comprehend': {
      label: 'Generation-Then-Comprehension',
      quizPct: 0.68,       // Figure 11: 68%
      timeMin: 24,         // Figure 11: 24 min
      medianErrors: 1,
      debugSkill: 0.55,
      conceptSkill: 0.72,  // Follow-up questions improved understanding
      readingSkill: 0.68,  // Manually copied code
      desc: 'Generated code first, then asked follow-up questions to understand it. Looks like delegation initially but the comprehension step preserves learning.',
      scoring: 'high',
      n: 2
    },
    hybrid: {
      label: 'Hybrid Code-Explanation',
      quizPct: 0.65,       // Figure 11: 65%
      timeMin: 22,         // Figure 11: 22 min
      medianErrors: 1,
      debugSkill: 0.52,
      conceptSkill: 0.68,  // Asked for explanations alongside code
      readingSkill: 0.65,
      desc: 'Requested code generation with explanations simultaneously. Reading and understanding explanations took more time but preserved learning.',
      scoring: 'high',
      n: 3
    },
    progressive: {
      label: 'Progressive AI Reliance',
      quizPct: 0.39,       // Figure 11: 39%
      timeMin: 19.5,       // Figure 11: 19.5 min
      medianErrors: 1,
      debugSkill: 0.30,    // Low — delegated debugging for task 2
      conceptSkill: 0.42,  // Partial — task 1 concepts retained
      readingSkill: 0.35,
      desc: 'Asked questions for Task 1, relied on AI for Task 2. Scored poorly largely due to not mastering concepts in the second task.',
      scoring: 'low',
      n: 4
    },
    delegation: {
      label: 'AI Delegation',
      quizPct: 0.24,       // Figure 11: 24%
      timeMin: 31,         // Figure 11: 31 min — slowest due to debugging loops
      medianErrors: 0,     // Fewest errors — code was AI-generated
      debugSkill: 0.15,    // Lowest — never debugged independently
      conceptSkill: 0.20,  // Minimal conceptual understanding
      readingSkill: 0.30,
      desc: 'Wholly relied on AI to write and debug code. Completed tasks but encountered few errors and gained minimal understanding.',
      scoring: 'low',
      n: 4
    },
    'iterative-debug': {
      label: 'Iterative AI Debugging',
      quizPct: 0.35,       // Figure 11: 35%
      timeMin: 22,         // Figure 11: 22 min
      medianErrors: 1,
      debugSkill: 0.25,    // Low — AI handled debugging
      conceptSkill: 0.35,
      readingSkill: 0.38,
      desc: 'Repeatedly asked AI to fix or verify code (5-15 queries). Higher fraction of debugging queries correlates with lower quiz scores.',
      scoring: 'low',
      n: 4
    }
  };

  // Experience modifiers (from Figure 7 patterns)
  const EXPERIENCE_MOD = {
    junior: { quizMod: -0.06, timeMod: 1.15 },  // Slightly lower scores, slower
    mid:    { quizMod: 0,     timeMod: 1.0 },    // Baseline
    senior: { quizMod: 0.04,  timeMod: 0.90 }    // Slightly higher scores, faster
  };

  // Domain familiarity modifiers
  const NOVELTY_MOD = {
    new:      { quizMod: 0,     timeMod: 1.0 },    // Baseline (study used new library)
    adjacent: { quizMod: 0.05,  timeMod: 0.90 },   // Some transfer learning
    familiar: { quizMod: 0.10,  timeMod: 0.80 }    // Less new to learn
  };

  // Key paper statistics for insights
  const PAPER_STATS = {
    treatmentEffect: 0.738,    // Cohen's d
    pValue: 0.010,
    quizDiffPP: 17,            // 17 percentage-point gap
    gradePointDiff: 2,         // 2 grade points difference
    explanationQueries: 79,    // Most common query type
    generationQueries: 51,
    debuggingQueries: 9,
    sampleSize: 52,
    controlMedianErrors: 3,
    treatmentMedianErrors: 1
  };

  // ── DOM references (populated in init) ──
  let els = {};

  // ── Core calculation ──

  function calculateOutcomes(pattern, experience, novelty) {
    const p = PATTERNS[pattern];
    const eMod = EXPERIENCE_MOD[experience];
    const nMod = NOVELTY_MOD[novelty];

    // Apply modifiers to pattern baseline
    const quizScore = Math.min(1, Math.max(0, p.quizPct + eMod.quizMod + nMod.quizMod));
    const completionTime = p.timeMin * eMod.timeMod * nMod.timeMod;

    // Skill breakdowns with same modifier adjustments
    const clamp = v => Math.min(1, Math.max(0, v));
    const modTotal = eMod.quizMod + nMod.quizMod;
    const debugging = clamp(p.debugSkill + modTotal);
    const conceptual = clamp(p.conceptSkill + modTotal);
    const reading = clamp(p.readingSkill + modTotal);

    // Speed comparison vs control group
    const controlTime = PATTERNS.none.timeMin * eMod.timeMod * nMod.timeMod;
    const speedDiff = ((controlTime - completionTime) / controlTime) * 100;

    // Quiz gap vs control group
    const controlQuiz = Math.min(1, PATTERNS.none.quizPct + eMod.quizMod + nMod.quizMod);
    const quizGap = (quizScore - controlQuiz) * 100;

    return {
      quizScore,
      completionTime,
      debugging,
      conceptual,
      reading,
      speedDiff,   // positive = faster than control
      quizGap,     // negative = worse than control
      controlQuiz,
      controlTime,
      medianErrors: p.medianErrors
    };
  }

  // ── Insights generator ──

  function generateInsights(pattern, outcomes) {
    const p = PATTERNS[pattern];
    const insights = [];

    if (pattern === 'none') {
      insights.push('Without AI, developers encounter a median of <strong>3 errors</strong> during the task — and resolving them independently is what builds debugging skill.');
      insights.push('The control group reported <strong>higher self-rated learning</strong> on a 7-point scale, even though they found the task more difficult.');
    } else {
      // Quiz performance insight
      if (outcomes.quizGap < -20) {
        insights.push('This pattern shows a <strong>severe learning deficit</strong> — over 20 percentage points below the no-AI group. The paper found a Cohen\'s d of 0.738 (p=0.010) for the overall AI effect.');
      } else if (outcomes.quizGap < -5) {
        insights.push('This pattern results in <strong>measurably lower skill formation</strong> compared to the no-AI group, consistent with the paper\'s 17 percentage-point gap.');
      } else if (outcomes.quizGap >= 0) {
        insights.push('This is one of the <strong>three high-scoring patterns</strong> that preserve or exceed learning outcomes. The key: maintaining cognitive engagement while using AI.');
      }

      // Speed insight
      if (outcomes.speedDiff > 10) {
        insights.push('Faster completion (' + Math.round(outcomes.speedDiff) + '% faster) looks productive, but the paper warns this speed may come from <strong>cognitive offloading</strong> rather than genuine efficiency.');
      } else if (outcomes.speedDiff < -10) {
        insights.push('Slower than no-AI — the paper found some participants spent up to <strong>11 minutes</strong> composing AI queries in a 35-minute window, including up to 6 minutes on a single query.');
      } else {
        insights.push('Similar pace to no-AI developers. The paper found <strong>no significant speed improvement</strong> overall (p=0.391), largely because AI interaction time offset coding time.');
      }

      // Error-based insight
      if (p.medianErrors <= 1) {
        insights.push('Few errors encountered (median ' + p.medianErrors + '). The paper found the control group\'s median of <strong>3 errors</strong> and the process of resolving them independently drove debugging skill development.');
      }

      // Pattern-specific insights
      if (pattern === 'conceptual') {
        insights.push('7 of 25 AI participants used this pattern — the most popular high-scoring approach. They asked questions like <em>"Can trio.sleep use partial seconds?"</em> and <em>"Give me a brief overview of the general idea behind this."</em>');
      } else if (pattern === 'delegation') {
        insights.push('Only 4 participants relied solely on AI generation. Three of the 8 lowest-scoring participants asked <strong>only</strong> for code generation with no explanation queries — suggesting pure delegation is the riskiest pattern.');
      } else if (pattern === 'gen-then-comprehend') {
        insights.push('This pattern looks identical to AI delegation at first glance — but the <strong>follow-up comprehension queries</strong> make the difference. It separates "I got code" from "I understand the code."');
      } else if (pattern === 'iterative-debug') {
        insights.push('A <strong>higher fraction of debugging queries</strong> correlates with lower quiz scores (Figure 19). Asking AI to fix problems repeatedly without understanding prevents skill formation.');
      } else if (pattern === 'progressive') {
        insights.push('This group mastered Task 1 concepts (where they asked questions) but <strong>failed Task 2</strong> concepts (where they delegated). The pattern directly shows how delegation timing affects specific skill gaps.');
      }
    }

    return insights;
  }

  // ── UI rendering ──

  function updateUI() {
    const patternEl = document.getElementById('p24-pattern');
    const expEl = document.getElementById('p24-experience');
    const noveltyEl = document.getElementById('p24-novelty');
    const teamEl = document.getElementById('p24-team-size');
    if (!patternEl || !expEl || !noveltyEl || !teamEl) return;

    const pattern = patternEl.value;
    const experience = expEl.value;
    const novelty = noveltyEl.value;
    const teamSize = parseInt(teamEl.value);

    const outcomes = calculateOutcomes(pattern, experience, novelty);
    const p = PATTERNS[pattern];

    // Update pattern description
    const descLabel = document.getElementById('p24-pattern-label');
    const descDetail = document.getElementById('p24-pattern-detail');
    if (descLabel) descLabel.textContent = p.label;
    if (descDetail) descDetail.textContent = p.desc;

    // Update pattern indicator
    const indicator = document.getElementById('p24-pattern-indicator');
    if (indicator) indicator.textContent = p.label;

    // Core metrics
    const speedEl = document.getElementById('p24-speed');
    const quizEl = document.getElementById('p24-quiz');
    const gapEl = document.getElementById('p24-gap');
    const speedLabel = document.getElementById('p24-speed-label');
    const quizLabel = document.getElementById('p24-quiz-label');
    const gapLabel = document.getElementById('p24-gap-label');

    if (speedEl) {
      speedEl.textContent = outcomes.completionTime.toFixed(1) + ' min';
      const diff = outcomes.speedDiff;
      if (speedLabel) {
        if (Math.abs(diff) < 2) {
          speedLabel.textContent = 'similar to control';
        } else {
          speedLabel.textContent = (diff > 0 ? '' : '+') + Math.abs(diff).toFixed(0) + '% ' + (diff > 0 ? 'faster' : 'slower') + ' than control';
        }
      }
    }

    if (quizEl) {
      quizEl.textContent = Math.round(outcomes.quizScore * 100) + '%';
      if (quizLabel) {
        quizLabel.textContent = 'concept mastery (' + Math.round(outcomes.quizScore * 27) + '/27 pts)';
      }
    }

    if (gapEl) {
      const gap = outcomes.quizGap;
      if (pattern === 'none') {
        gapEl.textContent = 'Baseline';
        if (gapLabel) gapLabel.textContent = 'reference group';
      } else if (Math.abs(gap) < 2) {
        gapEl.textContent = '≈ 0 pp';
        if (gapLabel) gapLabel.textContent = 'on par with baseline';
      } else {
        gapEl.textContent = (gap > 0 ? '+' : '') + Math.round(gap) + ' pp';
        if (gapLabel) gapLabel.textContent = gap > 0 ? 'above no-AI baseline' : 'below no-AI baseline';
      }
    }

    // Color the quiz score based on quality
    const quizScoreColor = outcomes.quizScore >= 0.65
      ? getCssVar('--tone-emerald-strong', '#10b981')
      : outcomes.quizScore >= 0.40
        ? getCssVar('--tone-amber-strong', '#f59e0b')
        : getCssVar('--tone-red-strong', '#ef4444');
    if (quizEl) quizEl.style.color = quizScoreColor;

    // Color the gap
    if (gapEl && pattern !== 'none') {
      const gapColor = outcomes.quizGap >= 0
        ? getCssVar('--tone-emerald-strong', '#10b981')
        : outcomes.quizGap >= -10
          ? getCssVar('--tone-amber-strong', '#f59e0b')
          : getCssVar('--tone-red-strong', '#ef4444');
      gapEl.style.color = gapColor;
    } else if (gapEl) {
      gapEl.style.color = '';
    }

    // Skill bars — show retention vs control baseline
    const controlOutcomes = calculateOutcomes('none', experience, novelty);
    updateBar('p24-debug', outcomes.debugging, controlOutcomes.debugging, pattern === 'none');
    updateBar('p24-concept', outcomes.conceptual, controlOutcomes.conceptual, pattern === 'none');
    updateBar('p24-reading', outcomes.reading, controlOutcomes.reading, pattern === 'none');

    // Team-aggregate metrics (slider-responsive)
    renderTeamMetrics(pattern, outcomes, teamSize);

    // Team narrative
    renderTeamImpact(pattern, outcomes, teamSize);

    // Insights
    const insights = generateInsights(pattern, outcomes);
    const insightsList = document.getElementById('p24-insights-list');
    if (insightsList) {
      insightsList.innerHTML = insights.map(i => '<p>' + i + '</p>').join('');
    }

    // Team size display (both in Step 3 and results header)
    const teamDisplay = document.getElementById('p24-team-display');
    if (teamDisplay) teamDisplay.textContent = teamSize;
    const teamDisplayHeader = document.getElementById('p24-team-display-header');
    if (teamDisplayHeader) teamDisplayHeader.textContent = teamSize;

    // Pattern comparison grid
    renderPatternGrid(pattern, experience, novelty);
  }

  function updateBar(prefix, value, baseline, isControl) {
    const bar = document.getElementById(prefix + '-bar');
    const pct = document.getElementById(prefix + '-pct');
    if (!bar || !pct) return;

    // Show as % retained vs control baseline
    let retention, displayText;
    if (isControl) {
      retention = 1.0; // Control IS the baseline
      displayText = 'Baseline (100%)';
    } else {
      retention = baseline > 0 ? Math.min(value / baseline, 1.5) : 0;
      const retentionPct = Math.round(retention * 100);
      if (retentionPct >= 100) {
        displayText = retentionPct + '% — exceeds baseline';
      } else if (retentionPct >= 80) {
        displayText = retentionPct + '% retained — minor loss';
      } else if (retentionPct >= 50) {
        displayText = retentionPct + '% retained — moderate loss';
      } else {
        displayText = retentionPct + '% retained — significant loss';
      }
    }

    const barWidth = Math.min(Math.round(retention * 100), 100);
    bar.style.width = barWidth + '%';
    pct.textContent = displayText;

    // Color based on retention
    const color = retention >= 0.80
      ? getCssVar('--tone-emerald-strong', '#10b981')
      : retention >= 0.50
        ? getCssVar('--tone-amber-strong', '#f59e0b')
        : getCssVar('--tone-red-strong', '#ef4444');
    bar.style.backgroundColor = color;
  }

  function renderTeamMetrics(pattern, outcomes, teamSize) {
    const totalTimeEl = document.getElementById('p24-total-time');
    const totalTimeLabel = document.getElementById('p24-total-time-label');
    const devsGapEl = document.getElementById('p24-devs-gap');
    const devsGapLabel = document.getElementById('p24-devs-gap-label');
    const timeDiffEl = document.getElementById('p24-time-diff');
    const timeDiffLabel = document.getElementById('p24-time-diff-label');

    // Total onboarding time
    const totalMinutes = outcomes.completionTime * teamSize;
    if (totalTimeEl) {
      if (totalMinutes >= 60) {
        totalTimeEl.textContent = (totalMinutes / 60).toFixed(1) + ' hrs';
      } else {
        totalTimeEl.textContent = Math.round(totalMinutes) + ' min';
      }
      if (totalTimeLabel) totalTimeLabel.textContent = teamSize + ' developer' + (teamSize > 1 ? 's' : '');
    }

    // Devs with skill gaps
    if (devsGapEl) {
      if (pattern === 'none') {
        devsGapEl.textContent = '0';
        devsGapEl.style.color = getCssVar('--tone-emerald-strong', '#10b981');
        if (devsGapLabel) devsGapLabel.textContent = 'baseline — full skill formation';
      } else {
        const quizDrop = outcomes.controlQuiz - outcomes.quizScore;
        const gapFraction = quizDrop > 0.10 ? 0.75 : quizDrop > 0 ? 0.5 : 0.2;
        const devsWithGap = Math.round(teamSize * gapFraction);
        const gapPct = Math.round(gapFraction * 100);
        devsGapEl.textContent = devsWithGap + ' / ' + teamSize + ' (' + gapPct + '%)';
        const gapColor = quizDrop > 0.15
          ? getCssVar('--tone-red-strong', '#ef4444')
          : quizDrop > 0.05
            ? getCssVar('--tone-amber-strong', '#f59e0b')
            : getCssVar('--tone-emerald-strong', '#10b981');
        devsGapEl.style.color = gapColor;
        if (devsGapLabel) {
          devsGapLabel.textContent = quizDrop > 0.15 ? 'significant gaps' : quizDrop > 0.05 ? 'moderate gaps' : 'minimal gaps';
        }
      }
    }

    // Time difference vs control
    if (timeDiffEl) {
      const totalTimeDiff = (outcomes.controlTime - outcomes.completionTime) * teamSize;
      if (Math.abs(totalTimeDiff) < 5) {
        timeDiffEl.textContent = '≈ same';
        timeDiffEl.style.color = '';
        if (timeDiffLabel) timeDiffLabel.textContent = 'no meaningful difference';
      } else {
        const hours = Math.abs(totalTimeDiff / 60).toFixed(1);
        const saved = totalTimeDiff > 0;
        timeDiffEl.textContent = (saved ? '-' : '+') + hours + ' hrs';
        timeDiffEl.style.color = saved
          ? getCssVar('--tone-emerald-strong', '#10b981')
          : getCssVar('--tone-amber-strong', '#f59e0b');
        if (timeDiffLabel) timeDiffLabel.textContent = saved ? 'faster than no-AI' : 'slower than no-AI';
      }
    }
  }

  function renderTeamImpact(pattern, outcomes, teamSize) {
    const container = document.getElementById('p24-team-summary');
    if (!container) return;

    if (pattern === 'none') {
      container.innerHTML = '<p>With <strong>' + teamSize + ' developer' + (teamSize > 1 ? 's' : '') + '</strong> onboarding without AI: each builds strong foundational skills through independent problem-solving. The trade-off: higher initial time investment per developer.</p>';
      return;
    }

    const controlQuiz = outcomes.controlQuiz;
    const quizDrop = controlQuiz - outcomes.quizScore;
    const devsWithGap = Math.round(teamSize * (quizDrop > 0.10 ? 0.75 : quizDrop > 0 ? 0.5 : 0.2));

    const lines = [];

    if (quizDrop > 0.15) {
      lines.push('<p><strong>' + teamSize + ' developers</strong> using this pattern: an estimated <strong>' + devsWithGap + '</strong> may have significant skill gaps in the new technology.</p>');
      lines.push('<p>In safety-critical domains, this means more code review burden and higher risk of undetected bugs in AI-generated code.</p>');
    } else if (quizDrop > 0.05) {
      lines.push('<p>With <strong>' + teamSize + ' developers</strong>: approximately <strong>' + devsWithGap + '</strong> may have moderate skill gaps. Consider supplementing with structured learning exercises.</p>');
    } else if (quizDrop > 0) {
      lines.push('<p>With <strong>' + teamSize + ' developers</strong>: minimal skill gap detected. This AI interaction pattern largely preserves learning outcomes.</p>');
    } else {
      lines.push('<p>With <strong>' + teamSize + ' developers</strong>: this pattern matches or exceeds no-AI learning outcomes while providing AI productivity benefits.</p>');
    }

    // Time impact
    const totalTimeDiff = (outcomes.controlTime - outcomes.completionTime) * teamSize;
    if (Math.abs(totalTimeDiff) > 5) {
      const hours = Math.abs(totalTimeDiff / 60).toFixed(1);
      lines.push('<p>Aggregate time ' + (totalTimeDiff > 0 ? 'saved' : 'added') + ': <strong>' + hours + ' hours</strong> across the team for this onboarding task.</p>');
    }

    container.innerHTML = lines.join('');
  }

  function renderPatternGrid(activePattern, experience, novelty) {
    var gridHigh = document.getElementById('p24-pattern-grid-high');
    var gridLow = document.getElementById('p24-pattern-grid-low');
    if (!gridHigh || !gridLow) return;

    var highKeys = ['conceptual', 'gen-then-comprehend', 'hybrid'];
    var lowKeys = ['progressive', 'delegation', 'iterative-debug'];

    function buildCard(key) {
      var p = PATTERNS[key];
      var outcomes = calculateOutcomes(key, experience, novelty);
      var isActive = key === activePattern;

      var borderCls = isActive ? 'border-2 shadow-md ring-2' : 'border';
      var activeLabel = isActive ? '<span class="chip chip-info text-xs">▶ Selected</span>' : '';

      // Short description from PATTERNS.desc, truncated to first sentence
      var shortDesc = p.desc.split('. ')[0] + '.';

      return '<div class="panel panel-neutral-soft p-3 space-y-2 ' + borderCls + '">'
        + '<div class="flex items-center justify-between gap-1 flex-wrap">'
        + '<span class="text-xs font-semibold text-heading">' + p.label + '</span>'
        + activeLabel
        + '</div>'
        + '<p class="text-xs text-muted leading-snug">' + shortDesc + '</p>'
        + '<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">'
        + '<div><span class="text-muted">Quiz: </span><strong>' + Math.round(outcomes.quizScore * 100) + '%</strong></div>'
        + '<div><span class="text-muted">Time: </span><strong>' + outcomes.completionTime.toFixed(1) + 'm</strong></div>'
        + '<div><span class="text-muted">Errors: </span><strong>' + p.medianErrors + '</strong></div>'
        + '<div><span class="text-muted">n = </span><strong>' + p.n + '</strong></div>'
        + '</div>'
        + '</div>';
    }

    gridHigh.innerHTML = highKeys.map(buildCard).join('');
    gridLow.innerHTML = lowKeys.map(buildCard).join('');
  }

  // ── Initialization ──

  function init() {
    // Verify DOM is ready
    const root = document.getElementById('p24-explorer');
    if (!root) {
      console.warn('P24: Interactive elements not yet in DOM, skipping');
      return;
    }

    // Attach event listeners
    const controls = ['p24-pattern', 'p24-experience', 'p24-novelty'];
    controls.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', updateUI);
    });

    const slider = document.getElementById('p24-team-size');
    if (slider) slider.addEventListener('input', updateUI);

    // Initial render
    updateUI();
  }

  // ── Export ──

  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
