import { getLLMOnlyResponse } from '../utils/llmParser';

export default function ComparisonPanel({ userInput, showComparison }) {
  if (!showComparison || !userInput) {
    return (
      <div className="h-full flex flex-col bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="px-4 py-3 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            LLM Only (Comparison)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            See what happens without Bayesian reasoning
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-slate-500 text-center text-sm">
            Start a conversation to see how an LLM-only approach compares
          </p>
        </div>
      </div>
    );
  }

  const llmResponse = getLLMOnlyResponse(userInput);

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">⚖️</span>
          LLM Only (Comparison)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Without Bayesian network grounding
        </p>
      </div>

      {/* LLM Response */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* The LLM-only response */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="text-sm font-medium text-orange-400">Generic LLM Response</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {llmResponse.response}
          </p>
        </div>

        {/* Issue callout */}
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-800/50">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <h4 className="text-sm font-medium text-red-400">Potential Issue</h4>
              <p className="text-sm text-red-300/80 mt-1">
                {llmResponse.issue}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison points */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Why Bayesian + LLM is better:</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Recommendations based on <strong className="text-slate-300">actual inventory</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Confidence scores show <strong className="text-slate-300">how well each bike matches</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Considers <strong className="text-slate-300">multiple factors simultaneously</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Handles <strong className="text-slate-300">uncertainty and partial information</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Updates beliefs <strong className="text-slate-300">as you provide more info</strong></span>
            </li>
          </ul>
        </div>

        {/* LLM limitations */}
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
          <h4 className="text-sm font-medium text-slate-300 mb-3">LLM-only limitations:</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>May recommend <strong className="text-red-300">non-existent products</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span><strong className="text-red-300">No confidence scores</strong> - just yes/no recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Can't properly weigh <strong className="text-red-300">trade-offs</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Generic responses that <strong className="text-red-300">ignore nuance</strong></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
