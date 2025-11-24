(function() {
  'use strict';

  function init() {
    // Reset state on init to ensure UI matches default HTML
    const state = {
      visibility: 'private', // 'private' | 'public'
      culture: 50, // 0 = Results, 100 = Optics
      decision: 'ai' // 'ai' | 'solo'
    };

    const btnPrivate = document.getElementById('btn-private');
    const btnPublic = document.getElementById('btn-public');
    const cultureInput = document.getElementById('culture-input');
    const switchEl = document.getElementById('decision-switch');

    if (btnPrivate && btnPublic) {
      btnPrivate.addEventListener('click', () => setVisibility('private'));
      btnPublic.addEventListener('click', () => setVisibility('public'));
    }

    if (cultureInput) {
      cultureInput.addEventListener('input', (e) => {
        state.culture = parseInt(e.target.value);
        update();
      });
    }

    if (switchEl) {
      switchEl.addEventListener('click', toggleDecision);
    }

    // Make icons clickable
    const pathSolo = document.getElementById('path-solo');
    const pathAi = document.getElementById('path-ai');
    if (pathSolo) pathSolo.addEventListener('click', () => { if(state.decision !== 'solo') toggleDecision(); });
    if (pathAi) pathAi.addEventListener('click', () => { if(state.decision !== 'ai') toggleDecision(); });

    update();

    function setVisibility(val) {
      state.visibility = val;
      const btnPrivate = document.getElementById('btn-private');
      const btnPublic = document.getElementById('btn-public');
      
      if (btnPrivate && btnPublic) {
        if (val === 'private') {
          btnPrivate.className = "flex-1 py-2 px-3 rounded-md text-sm font-medium bg-[var(--accent-strong)] text-white dark:text-slate-900 transition-colors shadow-sm";
          btnPublic.className = "flex-1 py-2 px-3 rounded-md text-sm font-medium bg-surface text-muted hover:bg-subtle transition-colors border border-transparent hover:border-subtle";
        } else {
          btnPublic.className = "flex-1 py-2 px-3 rounded-md text-sm font-medium bg-[var(--accent-strong)] text-white dark:text-slate-900 transition-colors shadow-sm";
          btnPrivate.className = "flex-1 py-2 px-3 rounded-md text-sm font-medium bg-surface text-muted hover:bg-subtle transition-colors border border-transparent hover:border-subtle";
        }
      }
      const visVal = document.getElementById('visibility-val');
      if (visVal) visVal.textContent = val === 'private' ? 'Private' : 'Public';
      update();
    }

    function toggleDecision() {
      state.decision = state.decision === 'ai' ? 'solo' : 'ai';
      update();
    }

    function update() {
      // 0. Manage Slider State (Disable in Private mode)
      const cultureInput = document.getElementById('culture-input');
      const culturePanel = cultureInput ? cultureInput.closest('.panel') : null;
      
      if (cultureInput && culturePanel) {
        if (state.visibility === 'private') {
          cultureInput.disabled = true;
          culturePanel.style.opacity = '0.5';
          culturePanel.title = "Culture only matters when your work is visible.";
        } else {
          cultureInput.disabled = false;
          culturePanel.style.opacity = '1';
          culturePanel.title = "";
        }
      }

      // 1. Update Culture Label
      const cultureVal = document.getElementById('culture-val');
      if (cultureVal) {
        if (state.visibility === 'private') {
          cultureVal.textContent = "N/A (Hidden)";
        } else {
          if (state.culture < 30) cultureVal.textContent = "Results Focused";
          else if (state.culture > 70) cultureVal.textContent = "Optics Focused";
          else cultureVal.textContent = "Balanced";
        }
      }

      // 2. Update Decision UI
      const knob = document.getElementById('decision-knob');
      const switchEl = document.getElementById('decision-switch');
      const pathSolo = document.getElementById('path-solo');
      const pathAi = document.getElementById('path-ai');

      if (!knob || !switchEl || !pathSolo || !pathAi) return;

      if (state.decision === 'ai') {
        knob.style.transform = 'translateX(32px)';
        switchEl.className = "relative w-16 h-8 bg-[var(--accent-strong)] rounded-full p-1 cursor-pointer transition-colors duration-300";
        
        // AI Path Active
        pathAi.className = "flex-1 flex flex-col items-center transition-all duration-300 transform scale-105 cursor-pointer hover:scale-110";
        const aiDiv = pathAi.querySelector('div');
        const aiSvg = pathAi.querySelector('svg');
        const aiSpan = pathAi.querySelector('span');
        if (aiDiv) aiDiv.className = "w-12 h-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mb-2 shadow-sm ring-2 ring-[var(--accent-strong)] ring-opacity-50";
        if (aiSvg) aiSvg.setAttribute('class', "w-6 h-6 text-[var(--accent-strong)]");
        if (aiSpan) aiSpan.className = "text-xs font-bold text-[var(--accent-strong)]";
        
        // Solo Path Inactive
        pathSolo.className = "flex-1 flex flex-col items-center transition-all duration-300 opacity-60 grayscale cursor-pointer hover:opacity-80";
        const soloDiv = pathSolo.querySelector('div');
        const soloSvg = pathSolo.querySelector('svg');
        const soloSpan = pathSolo.querySelector('span');
        if (soloDiv) soloDiv.className = "w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2 border border-subtle";
        if (soloSvg) soloSvg.setAttribute('class', "w-6 h-6 text-muted");
        if (soloSpan) soloSpan.className = "text-xs font-medium text-muted";

      } else {
        knob.style.transform = 'translateX(0px)';
        switchEl.className = "relative w-16 h-8 bg-[var(--color-border)] rounded-full p-1 cursor-pointer transition-colors duration-300";
        
        // AI Path Inactive
        pathAi.className = "flex-1 flex flex-col items-center transition-all duration-300 opacity-60 grayscale cursor-pointer hover:opacity-80";
        const aiDiv = pathAi.querySelector('div');
        const aiSvg = pathAi.querySelector('svg');
        const aiSpan = pathAi.querySelector('span');
        if (aiDiv) aiDiv.className = "w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-2 border border-subtle";
        if (aiSvg) aiSvg.setAttribute('class', "w-6 h-6 text-muted");
        if (aiSpan) aiSpan.className = "text-xs font-medium text-muted";

        // Solo Path Active
        pathSolo.className = "flex-1 flex flex-col items-center transition-all duration-300 transform scale-105 cursor-pointer hover:scale-110";
        const soloDiv = pathSolo.querySelector('div');
        const soloSvg = pathSolo.querySelector('svg');
        const soloSpan = pathSolo.querySelector('span');
        if (soloDiv) soloDiv.className = "w-12 h-12 rounded-full bg-subtle flex items-center justify-center mb-2 shadow-sm ring-2 ring-muted ring-opacity-30";
        if (soloSvg) soloSvg.setAttribute('class', "w-6 h-6 text-body");
        if (soloSpan) soloSpan.className = "text-xs font-bold text-body";
      }

      // 3. Calculate Scores
      let perfScore = 0;
      let imageScore = 0; // 0-100 scale roughly
      let imageLabel = "Neutral";
      let imageColor = "text-muted";

      // Performance
      if (state.decision === 'ai') {
        perfScore = 95;
      } else {
        perfScore = 60;
      }

      // Image
      // If Private: Image is unaffected by decision (assume baseline good)
      // If Public: 
      //    Using AI -> Penalty scales with Culture (Optics focus)
      //    Solo -> Bonus scales with Culture (Optics focus)
      
      if (state.visibility === 'private') {
        imageScore = 80; // Good baseline
        imageLabel = "Safe";
        imageColor = "text-success";
      } else {
        // Public
        const opticsFactor = state.culture / 100; // 0 to 1
        
        if (state.decision === 'ai') {
          // Penalty for using AI increases with optics focus
          // If optics=0 (Results only), score is 80 (Safe)
          // If optics=1 (Pure optics), score drops to 20 (Incompetent)
          imageScore = 80 - (60 * opticsFactor);
        } else {
          // Bonus for going solo increases with optics focus
          // If optics=0, score is 80
          // If optics=1, score is 95 (Confident/Genius)
          imageScore = 80 + (15 * opticsFactor);
        }

        if (imageScore > 85) {
          imageLabel = "Confident";
          imageColor = "text-success";
        } else if (imageScore > 70) {
          imageLabel = "Safe";
          imageColor = "text-success";
        } else if (imageScore > 50) {
          imageLabel = "Mixed";
          imageColor = "text-warning";
        } else {
          imageLabel = "Insecure";
          imageColor = "text-danger";
        }
      }

      // 4. Update Scoreboard
      const scorePerf = document.getElementById('score-perf');
      if (scorePerf) scorePerf.textContent = perfScore + "%";
      
      const imgEl = document.getElementById('score-image');
      if (imgEl) {
        imgEl.textContent = imageLabel;
        imgEl.className = `text-2xl font-bold ${imageColor}`;
      }

      // 5. Narrative
      const outcomeText = document.getElementById('outcome-text');
      if (outcomeText) {
        if (state.visibility === 'private') {
          if (state.decision === 'ai') {
            outcomeText.textContent = "✅ High performance (95%). Since usage is private, your boss just sees the good result.";
            outcomeText.className = "text-xs text-success font-medium";
          } else {
            outcomeText.textContent = "❌ Low performance (60%). You ignored the tool, and no one even knows you did it 'the hard way'.";
            outcomeText.className = "text-xs text-danger font-medium";
          }
        } else {
          // Public
          if (state.decision === 'ai') {
            if (state.culture > 60) {
              outcomeText.textContent = "⚠️ High performance (95%), but your boss thinks you're 'lazy' or 'insecure' for relying on AI.";
              outcomeText.className = "text-xs text-warning font-medium";
            } else {
              outcomeText.textContent = "✅ High performance (95%). In a results culture, using the best tool is smart.";
              outcomeText.className = "text-xs text-success font-medium";
            }
          } else {
            if (state.culture > 60) {
              outcomeText.textContent = "📉 Low performance (60%), but you successfully signaled 'confidence' and 'independence' to your boss.";
              outcomeText.className = "text-xs text-accent font-medium";
            } else {
              outcomeText.textContent = "❌ Low performance (60%). In a results culture, you just look inefficient.";
              outcomeText.className = "text-xs text-danger font-medium";
            }
          }
        }
      }
    }
  }

  function interactiveScript() {
    console.log("Paper 61 Interactive Script Loaded - v2");
    // Use requestAnimationFrame to ensure DOM is painted
    requestAnimationFrame(() => init());
  }

  if (typeof window !== 'undefined') {
    window.interactiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
