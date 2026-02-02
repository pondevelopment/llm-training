import { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import BayesianNetworkGraph from './components/BayesianNetworkGraph';
import BikeRecommendations from './components/BikeRecommendations';
import ComparisonPanel from './components/ComparisonPanel';
import ProbabilityDisplay from './components/ProbabilityDisplay';
import SimpleBayesDemo from './components/SimpleBayesDemo';
import { parseUserInput, generateResponse } from './utils/llmParser';
import { computePosteriors, getPriors } from './utils/inference';
import { getRecommendations } from './data/bikes';

function App() {
  const [messages, setMessages] = useState([]);
  const [evidence, setEvidence] = useState({});
  const [posteriors, setPosteriors] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [previousScores, setPreviousScores] = useState({});
  const [showComparison, setShowComparison] = useState(true);
  const [lastUserInput, setLastUserInput] = useState('');

  // Initialize with priors
  useEffect(() => {
    const priors = getPriors();
    setPosteriors(priors);
    setRecommendations(getRecommendations(priors, 5));
  }, []);

  const handleMessage = (text) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text }]);
    setLastUserInput(text);

    // Parse input to extract evidence
    const { evidence: newEvidence, matched } = parseUserInput(text);

    // Merge with existing evidence
    const combinedEvidence = { ...evidence, ...newEvidence };
    setEvidence(combinedEvidence);

    // Compute new posteriors
    const newPosteriors = computePosteriors(combinedEvidence);
    setPosteriors(newPosteriors);

    // Store previous scores for animation
    const currentScores = {};
    recommendations.forEach(bike => {
      currentScores[bike.id] = bike.score;
    });
    setPreviousScores(currentScores);

    // Get new recommendations
    const newRecs = getRecommendations(newPosteriors, 5);
    setRecommendations(newRecs);

    // Generate response
    const response = generateResponse(combinedEvidence, matched);

    // Add system response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'system',
        text: response.text,
        evidence: newEvidence,
      }]);
    }, 300);
  };

  const handleReset = () => {
    setMessages([]);
    setEvidence({});
    const priors = getPriors();
    setPosteriors(priors);
    setRecommendations(getRecommendations(priors, 5));
    setPreviousScores({});
    setLastUserInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🚲 BikeMatch AI
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                See how Bayesian Networks enhance LLM recommendations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                Show LLM-only comparison
              </label>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto p-4">
        {/* Introduction Section */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-700/50">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Combine LLMs with Bayesian Networks?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-slate-300 space-y-3">
              <p className="leading-relaxed">
                Large Language Models are amazing at understanding what you mean when you say things like 
                <em className="text-blue-300">"I have bad knees"</em> or <em className="text-blue-300">"money is no object"</em>. 
                But they have a critical weakness: <strong className="text-white">they can hallucinate products that don't exist</strong> and 
                can't reason precisely about trade-offs between multiple factors.
              </p>
              <p className="leading-relaxed">
                Bayesian Networks solve this by providing a <strong className="text-white">mathematically rigorous framework</strong> for 
                reasoning under uncertainty. When you combine them with an LLM, you get the best of both worlds:
                natural language understanding AND grounded, explainable recommendations.
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">In this tutorial, you'll see:</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>How an LLM extracts structured preferences from natural language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>How a Bayesian Network updates probabilities as you provide information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>How belief propagation infers preferences you never explicitly stated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Why this approach avoids hallucinations and provides confidence scores</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What is a Bayesian Network - Educational Section (moved to top) */}
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-700/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📚</span>
            What is a Bayesian Network?
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left column - Explanation */}
            <div className="space-y-4">
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">A Graph of Cause and Effect</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A Bayesian Network is a <strong className="text-white">probabilistic graphical model</strong> that represents 
                  variables and their conditional dependencies as a directed graph. Each node represents a variable 
                  (like "Terrain" or "Bike Type"), and arrows show how one variable influences another.
                </p>
              </div>
              
              <div>
                <h4 className="text-purple-300 font-semibold mb-2">The Magic: Belief Propagation</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When you provide evidence (e.g., "I have bad knees"), the network uses <strong className="text-white">Bayes' Theorem</strong> to 
                  update ALL related probabilities simultaneously. This is called <em>belief propagation</em>—information 
                  flows through the network, updating beliefs about variables you never mentioned.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h5 className="text-blue-300 font-medium mb-2 text-sm">🔬 Bayes' Theorem in Action</h5>
                <p className="text-slate-400 text-xs mb-2">When you say "bad knees", the network computes:</p>
                <code className="text-green-400 text-xs block bg-slate-900 p-2 rounded">
                  P(E-Bike | bad knees) = P(bad knees | E-Bike) × P(E-Bike) / P(bad knees)
                </code>
                <p className="text-slate-500 text-xs mt-2">
                  "What's the probability you need an E-Bike, given you have bad knees?"
                </p>
              </div>
            </div>

            {/* Right column - Why it's wise */}
            <div className="space-y-4">
              <h4 className="text-purple-300 font-semibold mb-2">Why Bayesian Networks are a "Wise" Choice</h4>
              
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h5 className="text-white font-medium text-sm">Perfect for Product Filtering</h5>
                    <p className="text-slate-400 text-xs">
                      E-commerce has many interdependent attributes. Bayesian networks naturally model that 
                      "if you want off-road AND have a low budget, then hardtail MTB is more likely than full-suspension."
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <h5 className="text-white font-medium text-sm">Handles Incomplete Information</h5>
                    <p className="text-slate-400 text-xs">
                      Users rarely specify everything. Bayesian networks gracefully handle missing data by 
                      marginalizing over unknown variables—giving sensible recommendations even with partial input.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h5 className="text-white font-medium text-sm">Principled Trade-off Resolution</h5>
                    <p className="text-slate-400 text-xs">
                      "Lightweight AND cheap" is hard to satisfy. Instead of showing "no results", Bayesian 
                      networks compute which bikes come closest, with confidence scores for transparency.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h5 className="text-white font-medium text-sm">Explainable AI</h5>
                    <p className="text-slate-400 text-xs">
                      Unlike black-box models, you can trace exactly WHY a recommendation was made. 
                      The network structure shows the reasoning path from your inputs to the suggestions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h5 className="text-white font-medium text-sm">LLM + Bayesian = Best of Both Worlds</h5>
                    <p className="text-slate-400 text-xs">
                      The LLM understands natural language ("bad knees" → needs comfort). The Bayesian network 
                      provides rigorous probabilistic reasoning over your actual inventory. Together: no hallucinations, real math.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-6 overflow-x-auto">
            <h4 className="text-purple-300 font-semibold mb-3">📊 Approach Comparison</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Capability</th>
                  <th className="text-center py-2 px-3 text-slate-400 font-medium">Traditional Filters</th>
                  <th className="text-center py-2 px-3 text-slate-400 font-medium">LLM Only</th>
                  <th className="text-center py-2 px-3 text-green-400 font-medium">Bayesian + LLM</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-3">Understands natural language</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-3">Handles uncertainty/partial info</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-yellow-400">~</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-3">Infers hidden preferences</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-yellow-400">~</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-3">Grounded in real inventory</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-2 px-3">Provides confidence scores</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Explainable reasoning</td>
                  <td className="text-center py-2 px-3 text-yellow-400">~</td>
                  <td className="text-center py-2 px-3 text-red-400">✗</td>
                  <td className="text-center py-2 px-3 text-green-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Bayes Demo - Interactive Learning */}
        <div className="mb-6">
          <SimpleBayesDemo />
        </div>

        {/* Interactive Demo Section Header */}
        <div className="mb-4 p-4 bg-green-900/30 border border-green-700/50 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="font-semibold text-green-300">Now Try the Full Bike Recommender!</h3>
              <p className="text-sm text-green-200/70 mt-1">
                Select a scenario below to see the Bayesian Network in action. Watch how the probabilities update 
                in real-time as the system extracts your preferences and computes the best bike matches.
              </p>
            </div>
          </div>
        </div>

        {/* Grid layout - 2 columns max for readability */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Chat Interface */}
          <div className="h-[500px]">
            <ChatInterface messages={messages} onMessage={handleMessage} />
          </div>

          {/* Bayesian Network Visualization */}
          <div className="h-[500px]">
            <BayesianNetworkGraph posteriors={posteriors} evidence={evidence} />
          </div>

          {/* Bike Recommendations */}
          <div className="h-[500px]">
            <BikeRecommendations 
              recommendations={recommendations} 
              previousScores={previousScores}
            />
          </div>

          {/* LLM-only Comparison */}
          {showComparison && (
            <div className="h-[500px]">
              <ComparisonPanel 
                userInput={lastUserInput} 
                showComparison={messages.length > 0}
              />
            </div>
          )}
        </div>

        {/* Probability display */}
        <div className="mt-4">
          <ProbabilityDisplay posteriors={posteriors} evidence={evidence} />
        </div>

        {/* Try these prompts */}
        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span>🎯</span>
            Try these scenarios to see Bayesian inference in action:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { text: "I have bad knees and need something comfortable", highlight: "Watch e-bike & comfort probabilities spike" },
              { text: "Budget is tight, under $800", highlight: "See price range shift to budget options" },
              { text: "I want to ride off-road trails", highlight: "Mountain bike probability increases" },
              { text: "I'm training for a race", highlight: "Road bike and sport focus emerge" },
            ].map((scenario, i) => (
              <button
                key={i}
                onClick={() => handleMessage(scenario.text)}
                className="text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors group"
              >
                <p className="text-sm text-slate-300 group-hover:text-white">"{scenario.text}"</p>
                <p className="text-xs text-blue-400 mt-2">→ {scenario.highlight}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer explanation */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <h3 className="font-semibold text-white mb-2">🧠 Key Takeaways</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-400">
            <div>
              <h4 className="text-slate-300 font-medium mb-1">Handles Uncertainty</h4>
              <p>Instead of binary yes/no filtering, probabilities express how confident the system is about each recommendation.</p>
            </div>
            <div>
              <h4 className="text-slate-300 font-medium mb-1">Infers Hidden Preferences</h4>
              <p>"Bad knees" → high comfort needed → e-bike probability increases. The network makes logical inferences you didn't explicitly state.</p>
            </div>
            <div>
              <h4 className="text-slate-300 font-medium mb-1">Grounded Recommendations</h4>
              <p>Unlike LLM-only, recommendations come from real inventory with computed match scores—no hallucinated products.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
