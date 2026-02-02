import { useMemo } from 'react';

export default function BikeRecommendations({ recommendations, previousScores }) {
  // Compute which scores changed for animation styling
  const animatedScores = useMemo(() => {
    const animated = {};
    recommendations.forEach(bike => {
      if (previousScores[bike.id] !== undefined) {
        const diff = Math.abs(bike.score - previousScores[bike.id]);
        if (diff > 1) {
          animated[bike.id] = true;
        }
      }
    });
    return animated;
  }, [recommendations, previousScores]);

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🚲</span>
          Top Recommendations
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Bikes ranked by Bayesian match score
        </p>
      </div>

      {/* Bike list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {recommendations.map((bike, index) => (
          <div
            key={bike.id}
            className={`bike-card bg-slate-700/50 rounded-lg p-4 border border-slate-600 ${
              index === 0 ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Bike icon */}
              <div className="text-3xl">{bike.image}</div>

              {/* Bike info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate">{bike.name}</h3>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      Best Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {bike.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">
                    {bike.type}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">
                    ${bike.price.toLocaleString()}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-600 text-slate-300 text-xs rounded">
                    {bike.specs.weight || bike.specs.range || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-2xl font-bold ${getScoreColor(bike.score)} ${
                    animatedScores[bike.id] ? 'score-updated' : ''
                  }`}
                >
                  {Math.round(bike.score)}%
                </div>
                <div className="text-xs text-slate-500">match</div>
                <div className="w-12 h-2 bg-slate-600 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full ${getScoreBgColor(bike.score)} transition-all duration-500`}
                    style={{ width: `${bike.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded specs on hover/click */}
            <div className="mt-3 pt-3 border-t border-slate-600 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(bike.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{key}:</span>
                  <span className="text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
