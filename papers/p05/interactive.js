const interactiveScript = () => {
  const root = document.getElementById('p05-explorer');
  if (!root) return;

  const tracks = {
    gaussian: {
      label: 'Gaussian (two-chaos fourth moment)',
      stages: [
        {
          title: '1 · Frame the goal',
          ai: 'Prompted GPT-5 with Basse-O’Connor et al.’s qualitative theorem and asked for a quantitative bound in total variation.',
          human: 'Checked GPT-5’s recollection of Malliavin–Stein basics, corrected notation, and insisted on explicit constants.'
        },
        {
          title: '2 · Malliavin–Stein reduction',
          ai: 'GPT-5 suggested applying the standard dTV ≤ 2 Var(⟨DZ, −DL⁻¹Z⟩)^{1/2} bound and decomposing ⟨DX, DY⟩.',
          human: 'Verified the derivative identities, expanded contractions, and ensured parity arguments nullify mixed odd moments.'
        },
        {
          title: '3 · Control cumulants + contractions',
          ai: 'Proposed bounding E⟨DX, DY⟩² via covariance of squares and linked κ₄(Z) = κ₄(X)+κ₄(Y)+6 Cov(X²,Y²).',
          human: 'Re-derived the exact contraction sums, confirmed non-negativity, and tightened constants to obtain √(6 κ₄(Z)).'
        },
        {
          title: '4 · Writing the theorem',
          ai: 'Offered a draft statement and sketch proof.',
          human: 'Rewrote the argument formally, inserted references, and added remarks on parity conditions and normalization.'
        }
      ],
      checklist: [
        'Parity requirement (p odd, q even) ensures mixed third moments vanish.',
        'Contractions bounded via Cov(X², Y²) ≤ κ₄(Z)/6.',
        'Final rate: dTV(Z,𝓝) ≤ √(6 κ₄(Z)) with κ₄(Z) ≥ 0.'
      ],
      actions: [
        'Store every AI step and cite the manual verification that accompanies it.',
        'Keep a symbolic CAS handy to double-check contraction coefficients.',
        'Ask GPT-5 to propose counterexamples; they surface missing assumptions.'
      ]
    },
    poisson: {
      label: 'Poisson extension',
      stages: [
        {
          title: '1 · Adapt definitions',
          ai: 'GPT-5 outlined multiple Poisson integrals and reminded that κ₄ ≥ 0 and Cov(F²,G²) ≥ 0 still hold.',
          human: 'Confirmed references (Last & Penrose) and ensured notation matched the Gaussian case.'
        },
        {
          title: '2 · Derive TV bound',
          ai: 'Suggested mirroring the Malliavin–Stein reduction with Poisson Malliavin derivative and generator.',
          human: 'Worked through compensation terms, verified the derivative formulas, and adapted constant factors.'
        },
        {
          title: '3 · Handle odd moments',
          ai: 'Initially missed that E[X³Y] may be non-zero; after prompting, proposed conditions to cancel mixed odd moments.',
          human: 'Found the precise parity-based condition and constructed a counterexample showing it is sharp.'
        },
        {
          title: '4 · Consolidate result',
          ai: 'Drafted a theorem analogous to the Gaussian case.',
          human: 'Finalized proof, documented the additional assumption, and added discussion on limitations.'
        }
      ],
      checklist: [
        'Odd-moment condition is necessary; otherwise Poisson chaos mix breaks the bound.',
        'Counterexample clarifies when the rate fails.',
        'Quantitative rate mirrors Gaussian structure under the new hypothesis.'
      ],
      actions: [
        'Probe LLM answers for hidden assumptions—ask “what if parity changes?”',
        'When GPT-5 gives a condition, try to break it; counterexamples validate sharpness.',
        'Document failure cases (Appendix B) as part of the research record.'
      ]
    },
    workflow: {
      label: 'Workflow & ethics',
      stages: [
        {
          title: '1 · Prompt engineering',
          ai: 'Used system prompts reminding GPT-5 to show intermediate steps and cite known identities.',
          human: 'Iteratively refined prompts, asked for concrete constants, and rejected hand-wavy arguments.'
        },
        {
          title: '2 · Transcript logging',
          ai: 'All conversations saved verbatim, including failures and retries.',
          human: 'Annotated transcripts, linked them to proof sections, and highlighted places where AI was wrong.'
        },
        {
          title: '3 · Human validation',
          ai: 'Provided algebraic manipulations but could not certify truth.',
          human: 'Ran independent derivations, cross-checked references, and handled LaTeX write-up.'
        },
        {
          title: '4 · Lessons learned',
          ai: 'Inspired discussion on doctoral training and research supervision.',
          human: 'Outlined best practices: transparency, combining AI with classical tools, and maintaining rigor.'
        }
      ],
      checklist: [
        'Keep AI outputs in version control or lab notebooks.',
        'Do not accept proofs without third-party derivation or reference.',
        'Use AI to brainstorm, not to replace verification.'
      ],
      actions: [
        'Adopt “prompt + transcript + proof” bundles for reproducibility.',
        'Teach students how to interrogate model outputs critically.',
        'Pair LLM sessions with traditional resources (books, CAS, peers).'
      ]
    }
  };

  const trackContainer = document.getElementById('p05-tracks');
  const stageHeading = document.getElementById('p05-stage-heading');
  const stageCount = document.getElementById('p05-stage-count');
  const stageContent = document.getElementById('p05-stage-content');
  const checklistEl = document.getElementById('p05-checklist');
  const actionsEl = document.getElementById('p05-actions');

  let currentTrack = 'gaussian';

  const renderTrackButtons = () => {
    const fragments = Object.entries(tracks).map(([key, track]) => {
      const isActive = key === currentTrack;
      const base = ['px-3','py-1.5','rounded-md','border','text-xs','font-medium','transition-colors'];
      if (isActive) {
        base.push('bg-indigo-600','border-indigo-600','text-white','shadow-sm');
      } else {
        base.push('bg-white','border-gray-300','text-gray-700','hover:border-indigo-400','hover:text-indigo-600');
      }
      return ;
    });
    trackContainer.innerHTML = fragments.join('');
    Array.from(trackContainer.querySelectorAll('button')).forEach(btn => {
      btn.addEventListener('click', () => {
        currentTrack = btn.dataset.track;
        renderTrackButtons();
        update();
      });
    });
  };

  const update = () => {
    const track = tracks[currentTrack];
    if (!track) {
      stageHeading.textContent = '';
      stageCount.textContent = '—';
      stageContent.innerHTML = '';
      checklistEl.innerHTML = '';
      actionsEl.innerHTML = '';
      return;
    }

    stageHeading.textContent = track.label;
    stageCount.textContent = ;

    stageContent.innerHTML = track.stages.map(stage => {
      return ;
    }).join('');

    checklistEl.innerHTML = (track.checklist || []).map(item => ).join('');
    actionsEl.innerHTML = (track.actions || []).map(item => ).join('');
  };

  renderTrackButtons();
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
const interactiveScript = () => {
  const root = document.getElementById('p05-explorer');
  if (!root) return;

  const tracks = {
    gaussian: {
      label: 'Gaussian (two-chaos fourth moment)',
      stages: [
        {
          title: '1 · Frame the goal',
          ai: 'Prompted GPT-5 with Basse-O’Connor et al.’s qualitative theorem and asked for a quantitative bound in total variation.',
          human: 'Checked GPT-5’s recollection of Malliavin–Stein basics, corrected notation, and insisted on explicit constants.'
        },
        {
          title: '2 · Malliavin–Stein reduction',
          ai: 'GPT-5 suggested applying the standard dTV ≤ 2 Var(⟨DZ, −DL⁻¹Z⟩)^{1/2} bound and decomposing ⟨DX, DY⟩.',
          human: 'Verified the derivative identities, expanded contractions, and ensured parity arguments nullify mixed odd moments.'
        },
        {
          title: '3 · Control cumulants + contractions',
          ai: 'Proposed bounding E⟨DX, DY⟩² via covariance of squares and linked κ₄(Z) = κ₄(X)+κ₄(Y)+6 Cov(X²,Y²).',
          human: 'Re-derived the exact contraction sums, confirmed non-negativity, and tightened constants to obtain √(6 κ₄(Z)).'
        },
        {
          title: '4 · Writing the theorem',
          ai: 'Offered a draft statement and sketch proof.',
          human: 'Rewrote the argument formally, inserted references, and added remarks on parity conditions and normalization.'
        }
      ],
      checklist: [
        'Parity requirement (p odd, q even) ensures mixed third moments vanish.',
        'Contractions bounded via Cov(X², Y²) ≤ κ₄(Z)/6.',
        'Final rate: dTV(Z,𝓝) ≤ √(6 κ₄(Z)) with κ₄(Z) ≥ 0.'
      ],
      actions: [
        'Store every AI step and cite the manual verification that accompanies it.',
        'Keep a symbolic CAS handy to double-check contraction coefficients.',
        'Ask GPT-5 to propose counterexamples; they surface missing assumptions.'
      ]
    },
    poisson: {
      label: 'Poisson extension',
      stages: [
        {
          title: '1 · Adapt definitions',
          ai: 'GPT-5 outlined multiple Poisson integrals and reminded that κ₄ ≥ 0 and Cov(F²,G²) ≥ 0 still hold.',
          human: 'Confirmed references (Last & Penrose) and ensured notation matched the Gaussian case.'
        },
        {
          title: '2 · Derive TV bound',
          ai: 'Suggested mirroring the Malliavin–Stein reduction with Poisson Malliavin derivative and generator.',
          human: 'Worked through compensation terms, verified the derivative formulas, and adapted constant factors.'
        },
        {
          title: '3 · Handle odd moments',
          ai: 'Initially missed that E[X³Y] may be non-zero; after prompting, proposed conditions to cancel mixed odd moments.',
          human: 'Found the precise parity-based condition and constructed a counterexample showing it is sharp.'
        },
        {
          title: '4 · Consolidate result',
          ai: 'Drafted a theorem analogous to the Gaussian case.',
          human: 'Finalized proof, documented the additional assumption, and added discussion on limitations.'
        }
      ],
      checklist: [
        'Odd-moment condition is necessary; otherwise Poisson chaos mix breaks the bound.',
        'Counterexample clarifies when the rate fails.',
        'Quantitative rate mirrors Gaussian structure under the new hypothesis.'
      ],
      actions: [
        'Probe LLM answers for hidden assumptions—ask “what if parity changes?”',
        'When GPT-5 gives a condition, try to break it; counterexamples validate sharpness.',
        'Document failure cases (Appendix B) as part of the research record.'
      ]
    },
    workflow: {
      label: 'Workflow & ethics',
      stages: [
        {
          title: '1 · Prompt engineering',
          ai: 'Used system prompts reminding GPT-5 to show intermediate steps and cite known identities.',
          human: 'Iteratively refined prompts, asked for concrete constants, and rejected hand-wavy arguments.'
        },
        {
          title: '2 · Transcript logging',
          ai: 'All conversations saved verbatim, including failures and retries.',
          human: 'Annotated transcripts, linked them to proof sections, and highlighted places where AI was wrong.'
        },
        {
          title: '3 · Human validation',
          ai: 'Provided algebraic manipulations but could not certify truth.',
          human: 'Ran independent derivations, cross-checked references, and handled LaTeX write-up.'
        },
        {
          title: '4 · Lessons learned',
          ai: 'Inspired discussion on doctoral training and research supervision.',
          human: 'Outlined best practices: transparency, combining AI with classical tools, and maintaining rigor.'
        }
      ],
      checklist: [
        'Keep AI outputs in version control or lab notebooks.',
        'Do not accept proofs without third-party derivation or reference.',
        'Use AI to brainstorm, not to replace verification.'
      ],
      actions: [
        'Adopt “prompt + transcript + proof” bundles for reproducibility.',
        'Teach students how to interrogate model outputs critically.',
        'Pair LLM sessions with traditional resources (books, CAS, peers).'
      ]
    }
  };

  const trackContainer = document.getElementById('p05-tracks');
  const stageHeading = document.getElementById('p05-stage-heading');
  const stageCount = document.getElementById('p05-stage-count');
  const stageContent = document.getElementById('p05-stage-content');
  const checklistEl = document.getElementById('p05-checklist');
  const actionsEl = document.getElementById('p05-actions');

  let currentTrack = 'gaussian';

  const renderTrackButtons = () => {
    const fragments = Object.entries(tracks).map(([key, track]) => {
      const isActive = key === currentTrack;
      const base = ['px-3','py-1.5','rounded-md','border','text-xs','font-medium','transition-colors'];
      if (isActive) {
        base.push('bg-indigo-600','border-indigo-600','text-white','shadow-sm');
      } else {
        base.push('bg-white','border-gray-300','text-gray-700','hover:border-indigo-400','hover:text-indigo-600');
      }
      return '<button type="button" class="' + base.join(' ') + '" data-track="' + key + '">' + track.label + '</button>';
    });
    trackContainer.innerHTML = fragments.join('');
    Array.from(trackContainer.querySelectorAll('button')).forEach(btn => {
      btn.addEventListener('click', () => {
        currentTrack = btn.dataset.track;
        renderTrackButtons();
        update();
      });
    });
  };

  const update = () => {
    const track = tracks[currentTrack];
    if (!track) {
      stageHeading.textContent = '';
      stageCount.textContent = '—';
      stageContent.innerHTML = '';
      checklistEl.innerHTML = '';
      actionsEl.innerHTML = '';
      return;
    }

    stageHeading.textContent = track.label;
    stageCount.textContent = track.stages.length + ' stages';

    stageContent.innerHTML = track.stages.map(stage => {
      return '<div class="bg-white border border-indigo-200 rounded-md p-3 space-y-2">' +
        '<p class="text-[11px] font-semibold text-indigo-700 uppercase">' + stage.title + '</p>' +
        '<div class="space-y-1">' +
          '<p><span class="font-semibold">GPT-5:</span> ' + stage.ai + '</p>' +
          '<p><span class="font-semibold">Humans:</span> ' + stage.human + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    checklistEl.innerHTML = (track.checklist || []).map(item => '• ' + item).join('<br>');
    actionsEl.innerHTML = (track.actions || []).map(item => '<li>' + item + '</li>').join('');
  };

  renderTrackButtons();
  update();
};

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.interactiveScript = interactiveScript;
}
