import { useState, useCallback } from 'react';

/**
 * SimpleBayesDemo - An interactive "Wet Grass" Bayesian Network demo
 * 
 * This classic example helps build intuition for Bayesian reasoning:
 * - Rain and Sprinkler can both cause Wet Grass
 * - Given wet grass, we reason backwards to figure out what caused it
 * - This demonstrates "explaining away" - once we know it rained,
 *   the sprinkler becomes less likely as an explanation
 */

// Conditional Probability Tables (CPTs) for the Wet Grass network
const PRIORS = {
  rain: 0.2,      // 20% chance of rain
  sprinkler: 0.4, // 40% chance sprinkler was on
};

// P(Wet Grass | Rain, Sprinkler)
const CPT_WET_GRASS = {
  'rain:true,sprinkler:true': 0.99,   // Both: almost certainly wet
  'rain:true,sprinkler:false': 0.9,   // Just rain: very likely wet
  'rain:false,sprinkler:true': 0.8,   // Just sprinkler: likely wet
  'rain:false,sprinkler:false': 0.01, // Neither: very unlikely wet
};

/**
 * Compute posteriors using Bayes' theorem with enumeration
 * This is a simple exact inference for this small network
 */
function computePosteriors(evidence) {
  // If no evidence, return priors + marginal for wetGrass
  if (Object.keys(evidence).length === 0) {
    // Compute P(Wet Grass) by marginalization
    const pWetGrass = 
      CPT_WET_GRASS['rain:true,sprinkler:true'] * PRIORS.rain * PRIORS.sprinkler +
      CPT_WET_GRASS['rain:true,sprinkler:false'] * PRIORS.rain * (1 - PRIORS.sprinkler) +
      CPT_WET_GRASS['rain:false,sprinkler:true'] * (1 - PRIORS.rain) * PRIORS.sprinkler +
      CPT_WET_GRASS['rain:false,sprinkler:false'] * (1 - PRIORS.rain) * (1 - PRIORS.sprinkler);
    
    return {
      rain: PRIORS.rain,
      sprinkler: PRIORS.sprinkler,
      wetGrass: pWetGrass,
    };
  }

  // Enumerate all combinations and compute joint probabilities
  const combinations = [
    { rain: true, sprinkler: true },
    { rain: true, sprinkler: false },
    { rain: false, sprinkler: true },
    { rain: false, sprinkler: false },
  ];

  let totalProb = 0;
  let rainProb = 0;
  let sprinklerProb = 0;
  let wetGrassProb = 0;

  for (const combo of combinations) {
    // Check if this combination is consistent with evidence
    let consistent = true;
    if ('rain' in evidence && evidence.rain !== combo.rain) consistent = false;
    if ('sprinkler' in evidence && evidence.sprinkler !== combo.sprinkler) consistent = false;

    if (!consistent) continue;

    // Compute joint probability P(Rain, Sprinkler, WetGrass)
    const pRain = combo.rain ? PRIORS.rain : (1 - PRIORS.rain);
    const pSprinkler = combo.sprinkler ? PRIORS.sprinkler : (1 - PRIORS.sprinkler);
    const key = `rain:${combo.rain},sprinkler:${combo.sprinkler}`;
    const pWetGrassGivenParents = CPT_WET_GRASS[key];

    // If wetGrass is in evidence
    let pWetGrassTerm;
    if ('wetGrass' in evidence) {
      pWetGrassTerm = evidence.wetGrass ? pWetGrassGivenParents : (1 - pWetGrassGivenParents);
    } else {
      pWetGrassTerm = 1; // Marginalize
    }

    const jointProb = pRain * pSprinkler * pWetGrassTerm;
    totalProb += jointProb;

    if (combo.rain) rainProb += jointProb;
    if (combo.sprinkler) sprinklerProb += jointProb;

    // For wetGrass marginal when not observed
    if (!('wetGrass' in evidence)) {
      wetGrassProb += pRain * pSprinkler * pWetGrassGivenParents;
    }
  }

  // Normalize
  if (totalProb === 0) totalProb = 1; // Avoid division by zero

  return {
    rain: rainProb / totalProb,
    sprinkler: sprinklerProb / totalProb,
    wetGrass: 'wetGrass' in evidence ? (evidence.wetGrass ? 1 : 0) : wetGrassProb / totalProb,
  };
}

// Probability bar component
function ProbBar({ label, prob, color, isEvidence }) {
  const percentage = Math.round(prob * 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className={`font-medium ${isEvidence ? 'text-yellow-300' : 'text-slate-300'}`}>
          {label} {isEvidence && <span className="text-xs">(observed)</span>}
        </span>
        <span className={`font-mono ${isEvidence ? 'text-yellow-300' : 'text-white'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Node button component
function NodeButton({ label, emoji, isTrue, isFalse, onClick, color }) {
  let bgClass = 'bg-slate-700 hover:bg-slate-600';
  let textClass = 'text-slate-300';
  let ringClass = '';
  
  if (isTrue) {
    bgClass = `${color} hover:opacity-90`;
    textClass = 'text-white';
    ringClass = 'ring-2 ring-white/50';
  } else if (isFalse) {
    bgClass = 'bg-slate-800 hover:bg-slate-700';
    textClass = 'text-slate-500';
    ringClass = 'ring-2 ring-red-500/50';
  }

  return (
    <button
      onClick={onClick}
      className={`${bgClass} ${textClass} ${ringClass} px-4 py-3 rounded-xl transition-all duration-200 flex flex-col items-center gap-1 min-w-[100px]`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs opacity-70">
        {isTrue ? 'Yes' : isFalse ? 'No' : 'Unknown'}
      </span>
    </button>
  );
}

export default function SimpleBayesDemo() {
  const [evidence, setEvidence] = useState({});
  const posteriors = computePosteriors(evidence);

  // Cycle through: unknown -> true -> false -> unknown
  const cycleEvidence = useCallback((variable) => {
    setEvidence(prev => {
      const current = prev[variable];
      if (current === undefined) {
        return { ...prev, [variable]: true };
      } else if (current === true) {
        return { ...prev, [variable]: false };
      } else {
        const newEvidence = { ...prev };
        delete newEvidence[variable];
        return newEvidence;
      }
    });
  }, []);

  const resetEvidence = () => setEvidence({});

  // Generate explanation based on current evidence
  const getExplanation = () => {
    const e = evidence;
    
    if (Object.keys(e).length === 0) {
      return {
        title: "🌤️ No observations yet",
        text: "Click on the nodes above to observe whether it rained, whether the sprinkler was on, or whether the grass is wet. Watch how the probabilities update!",
        highlight: null,
      };
    }

    if (e.wetGrass === true && !('rain' in e) && !('sprinkler' in e)) {
      return {
        title: "🔍 Backward reasoning (diagnosis)",
        text: `The grass is wet! Both rain (${Math.round(posteriors.rain * 100)}%) and sprinkler (${Math.round(posteriors.sprinkler * 100)}%) become more likely as potential causes. This is Bayesian inference going from effect to cause.`,
        highlight: 'backward',
      };
    }

    if (e.wetGrass === true && e.rain === true && !('sprinkler' in e)) {
      return {
        title: "⚡ Explaining Away",
        text: `We see wet grass AND it rained. Now the sprinkler probability drops to ${Math.round(posteriors.sprinkler * 100)}%! Since rain explains the wet grass, we don't need the sprinkler as an explanation. This is called "explaining away."`,
        highlight: 'explaining-away',
      };
    }

    if (e.rain === true && !('wetGrass' in e) && !('sprinkler' in e)) {
      return {
        title: "➡️ Forward reasoning (prediction)",
        text: `It's raining! The probability of wet grass jumps to ${Math.round(posteriors.wetGrass * 100)}%. Notice the sprinkler probability is unchanged—rain doesn't affect whether the sprinkler is on.`,
        highlight: 'forward',
      };
    }

    if (e.sprinkler === true && !('wetGrass' in e) && !('rain' in e)) {
      return {
        title: "➡️ Forward reasoning (prediction)",
        text: `The sprinkler is on! Wet grass probability rises to ${Math.round(posteriors.wetGrass * 100)}%. Rain probability is unchanged since the sprinkler doesn't cause rain.`,
        highlight: 'forward',
      };
    }

    if (e.rain === false && e.wetGrass === true) {
      return {
        title: "🎯 Process of elimination",
        text: `Wet grass but no rain? The sprinkler must be the cause! Its probability jumps to ${Math.round(posteriors.sprinkler * 100)}%. When one explanation is ruled out, the other becomes more certain.`,
        highlight: 'elimination',
      };
    }

    if (e.wetGrass === false) {
      return {
        title: "🏜️ Dry grass constrains possibilities",
        text: `The grass is dry. This makes both rain (${Math.round(posteriors.rain * 100)}%) and sprinkler (${Math.round(posteriors.sprinkler * 100)}%) less likely, since either would have made the grass wet.`,
        highlight: 'constraint',
      };
    }

    // Generic explanation for other combinations
    return {
      title: "📊 Updated beliefs",
      text: `Given what you've observed, the network has updated all probabilities. Rain: ${Math.round(posteriors.rain * 100)}%, Sprinkler: ${Math.round(posteriors.sprinkler * 100)}%, Wet Grass: ${Math.round(posteriors.wetGrass * 100)}%.`,
      highlight: null,
    };
  };

  const explanation = getExplanation();

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-slate-900/50 rounded-xl border border-indigo-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🌧️</span>
          Try It: The Classic "Wet Grass" Problem
        </h3>
        <button
          onClick={resetEvidence}
          className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Problem Explanation */}
      <div className="mb-6 p-4 bg-slate-800/60 rounded-lg border border-slate-700">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <span>📖</span> The Scenario
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          You wake up and look outside: <strong className="text-green-400">the grass is wet</strong>. 
          Why? There are two possible causes: it might have <strong className="text-blue-400">rained</strong> overnight, 
          or the <strong className="text-cyan-400">sprinkler</strong> might have run. Maybe both!
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          This simple scenario demonstrates the core power of Bayesian networks: 
          <em className="text-purple-300"> reasoning backwards from effects to causes</em>, and understanding how 
          one explanation can "explain away" another.
        </p>
      </div>

      {/* How to Use */}
      <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
          <span>🎮</span> How to Use This Demo
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-300 mb-2"><strong>Click the nodes</strong> to set what you observe:</p>
            <ul className="text-slate-400 space-y-1 ml-4">
              <li>• <span className="text-slate-300">Gray</span> = Unknown (no observation)</li>
              <li>• <span className="text-green-400">Colored</span> = Yes (you observed this)</li>
              <li>• <span className="text-red-400">Dark + red ring</span> = No (definitely didn't happen)</li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 mb-2"><strong>Try these experiments:</strong></p>
            <ol className="text-slate-400 space-y-1 ml-4 list-decimal list-inside">
              <li>Click <span className="text-green-400">Wet Grass → Yes</span> (watch causes increase!)</li>
              <li>Then click <span className="text-blue-400">Rain → Yes</span> (watch sprinkler drop!)</li>
              <li>Reset and try <span className="text-green-400">Wet Grass → Yes</span> + <span className="text-blue-400">Rain → No</span></li>
            </ol>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="mb-6">
        <div className="text-center mb-3">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Interactive Bayesian Network</span>
          <p className="text-slate-400 text-xs mt-1">Click nodes to toggle observations</p>
        </div>
        <div className="flex flex-col items-center gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          {/* Causes label */}
          <span className="text-xs text-slate-500 uppercase tracking-wide">Possible Causes</span>
          {/* Cause nodes */}
          <div className="flex gap-8">
            <NodeButton
              label="Rain"
              emoji="🌧️"
              isTrue={evidence.rain === true}
              isFalse={evidence.rain === false}
              isUnknown={!('rain' in evidence)}
              onClick={() => cycleEvidence('rain')}
              color="bg-blue-600"
            />
          <NodeButton
            label="Sprinkler"
            emoji="💦"
            isTrue={evidence.sprinkler === true}
            isFalse={evidence.sprinkler === false}
            isUnknown={!('sprinkler' in evidence)}
            onClick={() => cycleEvidence('sprinkler')}
            color="bg-cyan-600"
          />
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-4 text-slate-500">
          <svg className="w-6 h-6 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-xs text-slate-500">can cause</span>
          <svg className="w-6 h-6 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Effect label */}
        <span className="text-xs text-slate-500 uppercase tracking-wide">Observable Effect</span>
        
        {/* Effect node */}
        <NodeButton
          label="Wet Grass"
          emoji="🌿"
          isTrue={evidence.wetGrass === true}
          isFalse={evidence.wetGrass === false}
          isUnknown={!('wetGrass' in evidence)}
          onClick={() => cycleEvidence('wetGrass')}
          color="bg-green-600"
        />
        </div>
      </div>

      {/* Probability Bars */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Current Probabilities</h4>
          <ProbBar 
            label="Rain" 
            prob={posteriors.rain} 
            color="bg-blue-500"
            isEvidence={'rain' in evidence}
          />
          <ProbBar 
            label="Sprinkler" 
            prob={posteriors.sprinkler} 
            color="bg-cyan-500"
            isEvidence={'sprinkler' in evidence}
          />
          <ProbBar 
            label="Wet Grass" 
            prob={posteriors.wetGrass} 
            color="bg-green-500"
            isEvidence={'wetGrass' in evidence}
          />
        </div>

        {/* Explanation */}
        <div className={`rounded-lg p-4 border ${
          explanation.highlight === 'explaining-away' ? 'bg-amber-900/30 border-amber-600/50' :
          explanation.highlight === 'backward' ? 'bg-purple-900/30 border-purple-600/50' :
          explanation.highlight === 'forward' ? 'bg-blue-900/30 border-blue-600/50' :
          explanation.highlight === 'elimination' ? 'bg-green-900/30 border-green-600/50' :
          'bg-slate-800/50 border-slate-700'
        }`}>
          <h4 className="font-semibold text-white mb-2">{explanation.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{explanation.text}</p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <span className="text-purple-400 font-medium">Backward Reasoning:</span>
          <span className="text-slate-400 ml-1">Observe wet grass → infer it probably rained</span>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <span className="text-blue-400 font-medium">Forward Reasoning:</span>
          <span className="text-slate-400 ml-1">Know it's raining → predict wet grass</span>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <span className="text-amber-400 font-medium">Explaining Away:</span>
          <span className="text-slate-400 ml-1">Rain explains wet grass → sprinkler less likely</span>
        </div>
      </div>
    </div>
  );
}
