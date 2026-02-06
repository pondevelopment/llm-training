import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../shared';
import { slmModels, domainExamples, DATA_LAST_UPDATED } from '../../data';

export function SLMsSection() {
  const [selectedModel, setSelectedModel] = useState(slmModels[2]); // Mistral 7B default
  const [comparisonMetric, setComparisonMetric] = useState<'performance' | 'cost' | 'speed'>('performance');

  // Sort models by selected metric
  const sortedModels = [...slmModels].sort((a, b) => {
    switch (comparisonMetric) {
      case 'performance':
        return b.performanceVsGPT4 - a.performanceVsGPT4;
      case 'cost':
        return a.costPerMToken - b.costPerMToken;
      case 'speed':
        return b.inferenceSpeed - a.inferenceSpeed;
      default:
        return 0;
    }
  });

  const maxPerformance = Math.max(...slmModels.map(m => m.performanceVsGPT4));
  const maxSpeed = Math.max(...slmModels.map(m => m.inferenceSpeed));
  const maxCost = Math.max(...slmModels.map(m => m.costPerMToken));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
          🧠 Small Language Models
        </h1>
        <p className="text-body text-lg">
          Bigger isn't always better. Learn when a 7B model outperforms GPT-4.
        </p>
      </div>

      {/* Introduction */}
      <Panel variant="info" className="p-6">
        <h2 className="text-xl font-bold text-heading mb-3">What You'll Learn</h2>
        <p className="text-body mb-4">
          <strong>Small Language Models (SLMs)</strong> are models with 1-17 billion parameters—compared to 
          GPT-4's rumored 1.7 trillion. The surprising finding: when fine-tuned on domain-specific data, 
          these smaller models often <em>outperform</em> general-purpose giants on specialized tasks.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">💰 Cost</p>
            <p className="text-muted">Run at 5% of GPT-4 cost</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">🔒 Privacy</p>
            <p className="text-muted">Deploy on your own infrastructure</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">⚡ Speed</p>
            <p className="text-muted">Lower latency, edge deployment</p>
          </div>
        </div>
      </Panel>

      {/* Key Insight */}
      <Panel variant="success" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-heading mb-2">Why SLMs Win in Domains</h3>
            <p className="text-body mb-3">
              General models know a little about everything. Domain-tuned SLMs know <em>a lot</em> about 
              your specific area—legal terminology, medical protocols, your codebase patterns. This focused 
              knowledge beats generic intelligence for specialized tasks.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="chip chip-success">Legal AI</span>
              <span className="chip chip-success">Medical diagnosis</span>
              <span className="chip chip-success">Financial analysis</span>
              <span className="chip chip-success">Custom code assistants</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Model Comparison */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-heading">Model Comparison</h2>
          <div className="flex gap-2">
            {[
              { id: 'performance', label: '📊 Performance', icon: '📊' },
              { id: 'cost', label: '💰 Cost', icon: '💰' },
              { id: 'speed', label: '⚡ Speed', icon: '⚡' },
            ].map((metric) => (
              <button
                key={metric.id}
                onClick={() => setComparisonMetric(metric.id as typeof comparisonMetric)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  comparisonMetric === metric.id
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-card'
                    : 'bg-card-secondary text-body hover:bg-card-tertiary'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {sortedModels.map((model, index) => {
            const isSelected = selectedModel.id === model.id;
            let barWidth = 0;
            let barColor = '';
            let metricValue = '';

            switch (comparisonMetric) {
              case 'performance':
                barWidth = (model.performanceVsGPT4 / maxPerformance) * 100;
                barColor = model.performanceVsGPT4 >= 60 ? '#22c55e' : model.performanceVsGPT4 >= 50 ? '#f59e0b' : '#6b7280';
                metricValue = `${model.performanceVsGPT4}% of GPT-4`;
                break;
              case 'cost':
                barWidth = ((maxCost - model.costPerMToken) / maxCost) * 100;
                barColor = model.costPerMToken <= 0.05 ? '#22c55e' : model.costPerMToken <= 0.10 ? '#f59e0b' : '#6b7280';
                metricValue = `$${model.costPerMToken}/M tokens`;
                break;
              case 'speed':
                barWidth = (model.inferenceSpeed / maxSpeed) * 100;
                barColor = model.inferenceSpeed >= 150 ? '#22c55e' : model.inferenceSpeed >= 100 ? '#f59e0b' : '#6b7280';
                metricValue = `${model.inferenceSpeed} tok/s`;
                break;
            }

            return (
              <motion.button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`panel p-4 text-left transition-all ${
                  isSelected ? 'ring-2 ring-accent' : 'hover:shadow-md'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-heading">{model.name}</h3>
                      <span className="chip text-xs">{model.params}</span>
                    </div>
                    <div className="h-2 bg-card-secondary rounded-full overflow-hidden mb-1">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      />
                    </div>
                    <p className="text-xs text-muted">{metricValue}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-muted">{model.family}</p>
                    <p className="text-xs text-muted">{model.contextWindow} context</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Selected Model Details */}
      <Panel variant="info" className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl">{selectedModel.icon}</span>
          <div>
            <h3 className="text-2xl font-bold text-heading">{selectedModel.name}</h3>
            <p className="text-muted">
              {selectedModel.family} • {selectedModel.params} parameters • {selectedModel.contextWindow} context
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-accent">{selectedModel.performanceVsGPT4}%</p>
            <p className="text-sm text-muted">of GPT-4 performance</p>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-success">${selectedModel.costPerMToken}</p>
            <p className="text-sm text-muted">per million tokens</p>
          </div>
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-3xl font-bold text-warning">{selectedModel.inferenceSpeed}</p>
            <p className="text-sm text-muted">tokens/sec (A100)</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-heading mb-2">Best For:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedModel.bestFor.map((use, i) => (
              <span key={i} className="chip chip-info">{use}</span>
            ))}
          </div>
        </div>
      </Panel>

      {/* Cost Savings Calculator */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">💰 Cost Savings vs GPT-4</h2>
        <Panel variant="neutral" className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-heading mb-3">Monthly Token Volume</h3>
              <div className="space-y-3">
                {[10, 50, 100].map((millions) => {
                  const gpt4Cost = millions * 30; // ~$30/M tokens for GPT-4
                  const slmCost = millions * selectedModel.costPerMToken;
                  const savingsAmount = gpt4Cost - slmCost;
                  
                  return (
                    <div key={millions} className="flex items-center gap-4">
                      <span className="text-sm text-muted w-20">{millions}M tokens:</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>GPT-4: <span className="text-error">${gpt4Cost.toLocaleString()}</span></span>
                          <span>{selectedModel.name}: <span className="text-success">${slmCost.toFixed(0)}</span></span>
                        </div>
                        <div className="h-2 bg-card-secondary rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-success rounded-full"
                            style={{ width: `${Math.max((slmCost / gpt4Cost) * 100, 2)}%` }}
                          />
                        </div>
                      </div>
                      <span className="chip chip-success text-xs whitespace-nowrap">
                        Save ${savingsAmount.toLocaleString()}/mo
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <h3 className="font-semibold text-heading mb-3">When to Choose SLMs</h3>
              <ul className="space-y-2 text-sm text-body">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  High volume, predictable workloads
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Privacy/compliance requirements (on-prem deployment)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Latency-sensitive applications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Domain-specific tasks (with fine-tuning)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning">⚠</span>
                  May need GPT-4 for complex reasoning or broad knowledge
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </section>

      {/* Domain Specialization */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">🎯 Domain Specialization Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {domainExamples.map((domain) => (
            <Panel key={domain.id} variant="neutral-soft" className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{domain.icon}</span>
                <div>
                  <h3 className="font-bold text-heading">{domain.domain}</h3>
                  <p className="text-xs text-muted">{domain.description}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">{domain.keyMetric}</span>
                  <span className="font-semibold text-success">{domain.improvement}</span>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {domain.benefits.map((benefit, i) => (
                  <p key={i} className="text-xs text-body flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {benefit}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {domain.exampleModels.map((model, i) => (
                  <span key={i} className="chip text-xs">{model}</span>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* Key Takeaway */}
      <Panel variant="warning" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎯</span>
          <div>
            <h3 className="font-bold text-heading mb-2">Key Takeaway</h3>
            <p className="text-body">
              The "bigger is better" era is over. With proper fine-tuning and domain specialization, 
              a 7B model can outperform a 70B model on specific tasks while costing 10x less. 
              The key is matching model size to task complexity and deploying strategically.
            </p>
          </div>
        </div>
      </Panel>

      {/* Data timestamp */}
      <p className="text-xs text-muted text-center">
        Data last updated: {DATA_LAST_UPDATED}. Performance vs GPT-4 is illustrative based on benchmark patterns. 
        Costs from Together AI/Google Vertex. Inference speeds approximate for A100.
      </p>
    </div>
  );
}
