import { stateLabels } from '../data/bayesianNetwork';

export default function ProbabilityDisplay({ posteriors, evidence }) {
  // Key nodes to display
  const displayNodes = ['BIKE_TYPE', 'SUSPENSION', 'PRICE_RANGE', 'COMFORT_LEVEL'];

  const getBarColor = (nodeId) => {
    const colors = {
      BIKE_TYPE: 'bg-amber-500',
      SUSPENSION: 'bg-purple-500',
      PRICE_RANGE: 'bg-green-500',
      COMFORT_LEVEL: 'bg-pink-500',
    };
    return colors[nodeId] || 'bg-blue-500';
  };

  if (!posteriors) return null;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span>📊</span>
        Inferred Probabilities
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {displayNodes.map(nodeId => {
          const probs = posteriors[nodeId];
          const labels = stateLabels[nodeId] || {};
          
          if (!probs) return null;

          // Sort by probability
          const sorted = Object.entries(probs)
            .sort((a, b) => b[1] - a[1]);

          return (
            <div key={nodeId} className="space-y-2">
              <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {nodeId.replace('_', ' ')}
              </h4>
              <div className="space-y-1">
                {sorted.map(([state, prob]) => (
                  <div key={state} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-slate-400 truncate" title={labels[state] || state}>
                      {labels[state] || state}
                    </div>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(nodeId)} transition-all duration-500 prob-bar`}
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs text-slate-500">
                      {(prob * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current evidence */}
      {evidence && Object.keys(evidence).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-xs font-medium text-slate-400 mb-2">Current Evidence:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(evidence).map(([key, value]) => (
              <span
                key={key}
                className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30"
              >
                {key}: {stateLabels[key]?.[value] || value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
