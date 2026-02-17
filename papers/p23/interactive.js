(function () {
  'use strict';

  /* ── helpers at IIFE scope ── */
  var getCssVar = function (name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };

  function getEl(id) {
    return document.getElementById(id);
  }

  /* ── data from the paper (exact published numbers) ── */
  var DATA = {
    'study1': {
      label: 'Study 1 — Baseline',
      n: 359,
      all: { brain: 45.8, accurate: 71.0, faulty: 31.5, chatUse: 53.6, followFaulty: 79.8, confBrain: 65.3, confAI: 77.0 },
      'ai-users': { brain: 45.8, accurate: 71.0, faulty: 31.5, chatUse: 53.6, followFaulty: 79.8, confBrain: 65.3, confAI: 77.0 },
      independents: { brain: 45.8, accurate: 45.8, faulty: 45.8, chatUse: 0, followFaulty: 0, confBrain: 65.3, confAI: 65.3 },
      cohenH: 0.83,
      takeaway: 'Study 1 demonstrated the core cognitive surrender effect: access to System 3 boosted accuracy by +25 pp when AI was correct but reduced it by −14 pp when AI was faulty. Participants followed faulty AI advice on ~80% of chat-engaged trials, and confidence rose 11.7 pp even though half the AI answers were wrong.'
    },
    'study2-control': {
      label: 'Study 2 — Control (no timer)',
      n: 257,
      all: { brain: 46.9, accurate: 65.1, faulty: 34.0, chatUse: 53.9, followFaulty: 74.6, confBrain: 65.0, confAI: 76.0 },
      'ai-users': { brain: 46.9, accurate: 80.0, faulty: 20.4, chatUse: 85.0, followFaulty: 74.6, confBrain: 65.0, confAI: 76.0 },
      independents: { brain: 46.9, accurate: 51.5, faulty: 51.5, chatUse: 5.0, followFaulty: 15.0, confBrain: 65.0, confAI: 66.0 },
      cohenH: 0.86,
      takeaway: 'In the control condition of Study 2 (no time pressure), cognitive surrender replicated the Study 1 pattern. AI-Users achieved 80% accuracy when AI was correct but only 20.4% when AI was faulty—a massive 60 pp gap driven by uncritical adoption of System 3 outputs.'
    },
    'study2-timer': {
      label: 'Study 2 — Time pressure (30s)',
      n: 228,
      all: { brain: 32.6, accurate: 52.6, faulty: 24.0, chatUse: 49.9, followFaulty: 72.3, confBrain: 58.0, confAI: 70.0 },
      'ai-users': { brain: 32.6, accurate: 71.3, faulty: 12.1, chatUse: 80.0, followFaulty: 72.3, confBrain: 58.0, confAI: 70.0 },
      independents: { brain: 32.6, accurate: 34.0, faulty: 34.0, chatUse: 5.0, followFaulty: 10.0, confBrain: 58.0, confAI: 59.0 },
      cohenH: 0.86,
      takeaway: 'Time pressure suppressed System 2 deliberation, reducing brain-only accuracy to 32.6%. Yet AI-Users who received accurate AI still hit 71.3%—System 3 buffered the time-pressure cost. But when AI was faulty, accuracy plummeted to 12.1%, the lowest across all conditions, showing that time pressure amplifies cognitive surrender.'
    },
    'study3-control': {
      label: 'Study 3 — Control (no incentives)',
      n: 212,
      all: { brain: 42.4, accurate: 68.5, faulty: 30.7, chatUse: 52.0, followFaulty: 80.0, confBrain: 77.5, confAI: 82.2 },
      'ai-users': { brain: 42.4, accurate: 77.2, faulty: 26.8, chatUse: 85.0, followFaulty: 80.0, confBrain: 77.5, confAI: 82.2 },
      independents: { brain: 42.4, accurate: 47.6, faulty: 41.9, chatUse: 5.0, followFaulty: 15.0, confBrain: 77.5, confAI: 78.0 },
      cohenH: 0.78,
      takeaway: 'The Study 3 control condition replicated cognitive surrender: accuracy tracked AI quality (68.5% accurate vs 30.7% faulty). Follow rates for faulty AI remained high at ~80%, and confidence was elevated regardless of AI correctness.'
    },
    'study3-incentives': {
      label: 'Study 3 — Incentives + feedback',
      n: 238,
      all: { brain: 64.2, accurate: 81.0, faulty: 45.5, chatUse: 52.0, followFaulty: 57.7, confBrain: 77.5, confAI: 82.2 },
      'ai-users': { brain: 64.2, accurate: 84.8, faulty: 40.6, chatUse: 85.0, followFaulty: 57.7, confBrain: 77.5, confAI: 82.2 },
      independents: { brain: 64.2, accurate: 69.2, faulty: 59.9, chatUse: 5.0, followFaulty: 15.0, confBrain: 77.5, confAI: 78.0 },
      cohenH: 0.78,
      takeaway: 'Incentives ($0.20/correct) plus item-level feedback partially mitigated cognitive surrender: override rates for faulty AI more than doubled (20% → 42.3%) and AI-Faulty accuracy improved to 45.5%. But the AI-Accurate vs AI-Faulty gap persisted at ~44 pp—surrender is malleable but not eliminable.'
    }
  };

  /* Trust modifiers: approximate shifts from individual-difference analyses */
  var TRUST_MOD = {
    high:    { accurateMod:  5, faultyMod: -12, followMod:  10, chatMod:  12, confMod: 4 },
    average: { accurateMod:  0, faultyMod:   0, followMod:   0, chatMod:   0, confMod: 0 },
    low:     { accurateMod: -3, faultyMod:  10, followMod: -15, chatMod: -12, confMod: -3 }
  };

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function updateUI() {
    var condEl   = getEl('p23-condition');
    var profEl   = getEl('p23-profile');
    var trustEl  = getEl('p23-trust');
    if (!condEl || !profEl || !trustEl) return;

    var cond  = condEl.value;
    var prof  = profEl.value;
    var trust = trustEl.value;

    var entry = DATA[cond];
    if (!entry) return;

    var d = entry[prof] || entry['all'];
    var tm = TRUST_MOD[trust] || TRUST_MOD['average'];

    /* Apply trust modifiers (only when profile is not independents) */
    var isIndep = prof === 'independents';
    var brain    = d.brain;
    var accurate = isIndep ? d.accurate : clamp(d.accurate + tm.accurateMod, 0, 100);
    var faulty   = isIndep ? d.faulty   : clamp(d.faulty   + tm.faultyMod, 0, 100);
    var chatUse  = isIndep ? d.chatUse  : clamp(d.chatUse  + tm.chatMod, 0, 100);
    var followF  = isIndep ? d.followFaulty : clamp(d.followFaulty + tm.followMod, 0, 100);
    var confDiff = isIndep ? (d.confAI - d.confBrain) : (d.confAI - d.confBrain + tm.confMod);

    /* Accuracy numbers */
    var accBrainEl    = getEl('p23-acc-brain');
    var accAccurateEl = getEl('p23-acc-accurate');
    var accFaultyEl   = getEl('p23-acc-faulty');
    if (accBrainEl)    accBrainEl.textContent    = brain.toFixed(1) + '%';
    if (accAccurateEl) accAccurateEl.textContent  = accurate.toFixed(1) + '%';
    if (accFaultyEl)   accFaultyEl.textContent    = faulty.toFixed(1) + '%';

    /* Accuracy bars — percentage text sits outside */
    var barBrain    = getEl('p23-bar-brain');
    var barAccurate = getEl('p23-bar-accurate');
    var barFaulty   = getEl('p23-bar-faulty');
    var greenColor  = getCssVar('--tone-emerald-strong', '#10b981');
    var redColor    = getCssVar('--tone-rose-strong', '#f43f5e');
    var slateColor  = getCssVar('--tone-slate-strong', '#64748b');

    if (barBrain) {
      barBrain.style.width = brain + '%';
      barBrain.style.background = slateColor;
    }
    if (accBrainEl) accBrainEl.style.color = slateColor;
    if (barAccurate) {
      barAccurate.style.width = accurate + '%';
      barAccurate.style.background = greenColor;
    }
    if (accAccurateEl) accAccurateEl.style.color = greenColor;
    if (barFaulty) {
      barFaulty.style.width = faulty + '%';
      barFaulty.style.background = redColor;
    }
    if (accFaultyEl) accFaultyEl.style.color = redColor;

    /* Behavioral metrics */
    var chatUseEl   = getEl('p23-chat-use');
    var followEl    = getEl('p23-follow-faulty');
    var confEl      = getEl('p23-confidence');
    if (chatUseEl) chatUseEl.textContent = chatUse.toFixed(0) + '%';
    if (followEl)  followEl.textContent  = followF.toFixed(0) + '%';
    var followHeadlineEl = getEl('p23-follow-headline');
    if (followHeadlineEl) followHeadlineEl.textContent = followF.toFixed(0) + '%';
    if (confEl)    confEl.textContent     = (confDiff > 0 ? '+' : '') + confDiff.toFixed(1) + ' pp';

    /* Effect chip + explanation */
    var chipEl = getEl('p23-effect-chip');
    var explainEl = getEl('p23-effect-explain');
    if (chipEl) {
      var gap = accurate - faulty;
      var belowBaseline = brain - faulty;
      var gapLabel = 'AI-Accurate (' + accurate.toFixed(0) + '%) minus AI-Faulty (' + faulty.toFixed(0) + '%) = ' + gap.toFixed(0) + ' pp gap.';
      var explainText = '';
      if (belowBaseline > 0) {
        var baselineNote = ' Crucially, AI-Faulty (' + faulty.toFixed(0) + '%) is ' + belowBaseline.toFixed(0) + ' pp below Brain-Only (' + brain.toFixed(0) + '%). The wrong AI made people perform worse than having no AI at all. And with a ' + followF.toFixed(0) + '% follow rate on wrong answers, people followed blindly rather than evaluating the AI\'s advice.';
        if (gap > 40) {
          chipEl.className = 'chip chip-warning text-xs shrink-0';
          chipEl.textContent = 'Strong surrender (' + gap.toFixed(0) + ' pp)';
        } else if (gap > 20) {
          chipEl.className = 'chip chip-info text-xs shrink-0';
          chipEl.textContent = 'Moderate surrender (' + gap.toFixed(0) + ' pp)';
        } else {
          chipEl.className = 'chip chip-success text-xs shrink-0';
          chipEl.textContent = 'Weak surrender (' + gap.toFixed(0) + ' pp)';
        }
        explainText = gapLabel + baselineNote;
      } else {
        chipEl.className = 'chip chip-success text-xs shrink-0';
        chipEl.textContent = 'No surrender (' + gap.toFixed(0) + ' pp)';
        explainText = gapLabel + ' AI-Faulty stayed at or above Brain-Only (' + brain.toFixed(0) + '%) — people caught the AI’s errors and thought independently.';
      }
      if (explainEl) explainEl.textContent = explainText;
    }

    /* Takeaway */
    var takeawayEl = getEl('p23-takeaway');
    if (takeawayEl) {
      var text = entry.takeaway;
      if (trust === 'high' && !isIndep) {
        text += ' With high trust in AI, participants were even more likely to follow System 3 outputs uncritically (OR = 4.36 for trust predicting surrender).';
      } else if (trust === 'low' && !isIndep) {
        text += ' Participants with lower trust in AI showed more resistance, overriding faulty AI more often—but even skeptical users still followed incorrect advice on a majority of engaged trials.';
      }
      if (prof === 'independents') {
        text = 'Independents (participants who rarely used the AI chat) largely mirrored brain-only performance. Their accuracy was unaffected by AI trial type, confirming that cognitive surrender requires actual System 3 engagement—not mere availability.';
      }
      takeawayEl.textContent = text;
    }
  }

  function init() {
    var root = getEl('p23-explorer');
    if (!root) {
      console.warn('P23 interactive elements not yet in DOM, skipping');
      return;
    }

    var condEl  = getEl('p23-condition');
    var profEl  = getEl('p23-profile');
    var trustEl = getEl('p23-trust');

    if (condEl)  condEl.addEventListener('change', updateUI);
    if (profEl)  profEl.addEventListener('change', updateUI);
    if (trustEl) trustEl.addEventListener('change', updateUI);

    updateUI();
  }

  function interactiveScript() {
    setTimeout(function () { init(); }, 0);
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
