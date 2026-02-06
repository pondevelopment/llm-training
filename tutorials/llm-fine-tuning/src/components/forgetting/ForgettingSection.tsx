import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../shared';
import {
  baselineForgetting,
  mitigationTechniques,
  getMitigatedForgetting,
  forgettingPhases,
  DATA_LAST_UPDATED,
} from '../../data';

export function ForgettingSection() {
  const [currentEpoch, setCurrentEpoch] = useState(5);
  const [selectedTechnique, setSelectedTechnique] = useState('none');
  const [showComparison, setShowComparison] = useState(true);

  const technique = mitigationTechniques.find(t => t.id === selectedTechnique);
  const mitigatedData = useMemo(
    () => getMitigatedForgetting(selectedTechnique),
    [selectedTechnique]
  );

  const baselinePoint = baselineForgetting[currentEpoch];
  const mitigatedPoint = mitigatedData[currentEpoch];

  // Determine current phase
  const currentPhase = forgettingPhases.find(p => {
    const [start, end] = p.epochRange.split('-').map(s => parseInt(s) || 10);
    return currentEpoch >= start && currentEpoch <= end;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
          📉 Catastrophic Forgetting
        </h1>
        <p className="text-body text-lg">
          The hidden danger of fine-tuning: your model gets better at one thing by forgetting everything else.
        </p>
      </div>

      {/* Introduction */}
      <Panel variant="info" className="p-6">
        <h2 className="text-xl font-bold text-heading mb-3">What You'll Learn</h2>
        <p className="text-body mb-4">
          <strong>Catastrophic forgetting</strong> happens when fine-tuning overwrites the model's general knowledge. 
          A model trained on legal documents might forget how to do basic math. One trained on code might lose 
          its ability to write natural prose. This section shows you <em>why</em> it happens and <em>how</em> to prevent it.
        </p>
        
        {/* Epoch explainer */}
        <div className="bg-indigo-950/50 border-l-4 border-indigo-500 rounded-lg p-4 mb-4">
          <p className="text-sm text-heading font-medium mb-1">📖 What's an "epoch"?</p>
          <p className="text-sm text-muted">
            An <strong>epoch</strong> is one complete pass through your training data. If you have 1,000 examples and train 
            for 5 epochs, the model sees each example 5 times. More epochs = more learning, but also more risk of 
            forgetting (and overfitting).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">📊 Visualize the Curve</p>
            <p className="text-muted">See exactly when forgetting accelerates during training</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">🛡️ Mitigation Techniques</p>
            <p className="text-muted">Compare STM, FAPM, PNN, and rehearsal methods</p>
          </div>
        </div>
      </Panel>

      {/* Key Insight */}
      <Panel variant="warning" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">⚠️</span>
          <div>
            <h3 className="font-bold text-heading mb-2">The Danger Zone: Epochs 3-5</h3>
            <p className="text-body">
              Research shows forgetting follows a predictable pattern. The first 2 epochs are safe—the model 
              explores without damaging existing knowledge. But between epochs 3-5, forgetting <strong>accelerates 
              dramatically</strong> as the model commits to the new task. By epoch 10, naive fine-tuning destroys 
              80%+ of general capabilities. Use the simulator below to see this in action.
            </p>
          </div>
        </div>
      </Panel>

      {/* Interactive Forgetting Visualizer */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">🎛️ Forgetting Curve Visualizer</h2>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <Panel variant="neutral" className="p-6 lg:col-span-1">
            <h3 className="font-semibold text-heading mb-4">Controls</h3>
            
            {/* Epoch Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-heading mb-2">
                Training Epoch: <span className="font-mono text-accent">{currentEpoch}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={currentEpoch}
                onChange={(e) => setCurrentEpoch(parseInt(e.target.value))}
                className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0 (start)</span>
                <span>10 (converged)</span>
              </div>
            </div>

            {/* Mitigation Technique */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-heading mb-2">
                Mitigation Technique <span className="text-muted font-normal">(click to compare)</span>
              </label>
              <div className="space-y-2">
                {mitigationTechniques.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnique(tech.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all cursor-pointer border ${
                      selectedTechnique === tech.id
                        ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400 ring-offset-1 ring-offset-card'
                        : 'bg-card-secondary text-body border-white/10 hover:border-indigo-400/50 hover:bg-card-tertiary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${selectedTechnique === tech.id ? '' : 'opacity-70'}`}>{tech.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{tech.shortName}</p>
                        <p className="text-xs opacity-75">
                          {tech.id === 'none' ? 'No mitigation' : `${tech.forgettingReduction}% reduction`}
                        </p>
                      </div>
                      <span className={`text-lg transition-opacity ${selectedTechnique === tech.id ? 'opacity-100' : 'opacity-0'}`}>▶</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Comparison */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="rounded"
              />
              <span>Show baseline comparison</span>
            </label>
          </Panel>

          {/* Visualization */}
          <Panel variant="neutral-soft" className="p-6 lg:col-span-2">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="font-semibold text-heading">Knowledge Loss by Category</h3>
              <span className="text-xs text-muted">Shorter bars = less forgetting = better</span>
            </div>
            
            {/* Bar Chart */}
            <div className="space-y-4 mb-6">
              {[
                { key: 'domainKnowledge', label: 'Domain Knowledge', color: '#3b82f6' },
                { key: 'reasoning', label: 'Reasoning', color: '#8b5cf6' },
                { key: 'readingComprehension', label: 'Reading Comprehension', color: '#06b6d4' },
              ].map((category) => {
                const baselineValue = baselinePoint[category.key as keyof typeof baselinePoint] as number;
                const mitigatedValue = mitigatedPoint[category.key as keyof typeof mitigatedPoint] as number;
                
                return (
                  <div key={category.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-body">{category.label}</span>
                      <span className="font-mono">
                        {showComparison && selectedTechnique !== 'none' && (
                          <span className="text-muted line-through mr-2">{baselineValue}%</span>
                        )}
                        <span className={mitigatedValue > 30 ? 'text-error' : mitigatedValue > 15 ? 'text-warning' : 'text-success'}>
                          {mitigatedValue}%
                        </span>
                      </span>
                    </div>
                    <div className="h-6 bg-card-secondary rounded-full overflow-hidden relative">
                      {showComparison && selectedTechnique !== 'none' && (
                        <div
                          className="absolute h-full bg-error/30 rounded-full"
                          style={{ width: `${baselineValue}%` }}
                        />
                      )}
                      <motion.div
                        className="h-full rounded-full relative z-10"
                        style={{ backgroundColor: category.color }}
                        animate={{ width: `${mitigatedValue}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task Performance */}
            <div className="bg-card p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted">Target Task Performance</p>
                  <p className="text-2xl font-bold text-success">{mitigatedPoint.taskPerformance}%</p>
                  <p className="text-xs text-success">↑ Higher is better</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Knowledge Loss (Avg)</p>
                  <p className={`text-2xl font-bold ${
                    (mitigatedPoint.domainKnowledge + mitigatedPoint.reasoning + mitigatedPoint.readingComprehension) / 3 > 30
                      ? 'text-error'
                      : (mitigatedPoint.domainKnowledge + mitigatedPoint.reasoning + mitigatedPoint.readingComprehension) / 3 < 15
                        ? 'text-success'
                        : 'text-warning'
                  }`}>
                    {Math.round((mitigatedPoint.domainKnowledge + mitigatedPoint.reasoning + mitigatedPoint.readingComprehension) / 3)}%
                  </p>
                  <p className="text-xs text-error">↓ Lower is better</p>
                </div>
              </div>
              
              {/* Severity explanation */}
              {(() => {
                const avgLoss = (mitigatedPoint.domainKnowledge + mitigatedPoint.reasoning + mitigatedPoint.readingComprehension) / 3;
                if (avgLoss > 60) {
                  return (
                    <div className="mt-3 p-3 bg-red-950/50 border border-red-500/30 rounded-lg text-sm">
                      <p className="text-red-400 font-medium">⚠️ Severe overfitting</p>
                      <p className="text-muted text-xs mt-1">
                        The model excels at your specific task but has forgotten most general capabilities. 
                        Good for narrow use cases, but won't generalize. Try a mitigation technique or fewer epochs.
                      </p>
                    </div>
                  );
                } else if (avgLoss > 30) {
                  return (
                    <div className="mt-3 p-3 bg-amber-950/50 border border-amber-500/30 rounded-lg text-sm">
                      <p className="text-amber-400 font-medium">⚡ Significant forgetting</p>
                      <p className="text-muted text-xs mt-1">
                        The model trades general knowledge for task performance. 
                        Consider applying a mitigation technique to preserve more capabilities.
                      </p>
                    </div>
                  );
                } else if (avgLoss > 15) {
                  return (
                    <div className="mt-3 p-3 bg-blue-950/50 border border-blue-500/30 rounded-lg text-sm">
                      <p className="text-blue-400 font-medium">✓ Acceptable trade-off</p>
                      <p className="text-muted text-xs mt-1">
                        Moderate forgetting with good task performance. This is often the sweet spot for specialized models.
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <div className="mt-3 p-3 bg-emerald-950/50 border border-emerald-500/30 rounded-lg text-sm">
                      <p className="text-emerald-400 font-medium">✓ Excellent retention</p>
                      <p className="text-muted text-xs mt-1">
                        The model maintains most general capabilities while learning the new task. Ideal outcome.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Current Phase */}
            {currentPhase && (
              <div className="p-4 bg-card rounded-lg border-l-4 border-accent">
                <h4 className="font-semibold text-heading text-sm mb-1">
                  📍 {currentPhase.name} (Epochs {currentPhase.epochRange})
                </h4>
                <p className="text-sm text-body mb-1">{currentPhase.description}</p>
                <p className="text-xs text-muted">{currentPhase.mechanism}</p>
              </div>
            )}
          </Panel>
        </div>
      </section>

      {/* Technique Details - Baseline */}
      {technique && technique.id === 'none' && (
        <Panel variant="warning" className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{technique.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-heading mb-2">{technique.name}</h3>
              <p className="text-body mb-4">{technique.description}</p>
              
              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-400 text-sm mb-2">💡 Why consider mitigation?</h4>
                <p className="text-sm text-body mb-3">
                  Standard fine-tuning is fast and simple, but often destroys the general capabilities that made the model useful in the first place. 
                  If you need your model to still handle diverse tasks after fine-tuning, try one of the mitigation techniques above.
                </p>
                <p className="text-xs text-muted">
                  Click on STM, FAPM, PNN, or Rehearsal in the controls to see how they reduce forgetting.
                </p>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* Technique Details - Mitigation */}
      {technique && technique.id !== 'none' && (
        <Panel variant="info" className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{technique.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-heading mb-2">{technique.name}</h3>
              <p className="text-body mb-4">{technique.description}</p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">{technique.forgettingReduction}%</p>
                  <p className="text-xs text-muted">Forgetting Reduction</p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-accent">{technique.taskRetention}%</p>
                  <p className="text-xs text-muted">Task Retention</p>
                </div>
                <div className="bg-card p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-warning">{technique.computeOverhead}</p>
                  <p className="text-xs text-muted">Compute Overhead</p>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-heading text-sm mb-2">⚙️ How it works:</h4>
                <p className="text-sm text-body">{technique.mechanism}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2">✓ Pros</h4>
                  <ul className="text-sm text-body space-y-1">
                    {technique.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-400 text-sm mb-2">✗ Cons</h4>
                  <ul className="text-sm text-body space-y-1">
                    {technique.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* Forgetting Phases Timeline */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">📅 Forgetting Phases</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {forgettingPhases.map((phase, index) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Panel 
                variant={index === 0 ? 'success' : index === 1 ? 'warning' : 'neutral'} 
                className="p-4 h-full"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {index === 0 ? '🟢' : index === 1 ? '🟡' : '🔴'}
                  </span>
                  <div>
                    <h3 className="font-bold text-heading">{phase.name}</h3>
                    <p className="text-xs text-muted">Epochs {phase.epochRange}</p>
                  </div>
                </div>
                <p className="text-sm text-body mb-2">{phase.description}</p>
                <p className="text-xs text-muted italic">{phase.mechanism}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Three Coupled Processes */}
      <Panel variant="neutral" className="p-6">
        <h3 className="font-semibold text-heading mb-2">🔬 Three Coupled Forgetting Mechanisms</h3>
        <p className="text-sm text-muted mb-6">
          Research shows catastrophic forgetting happens through three distinct but interconnected processes. 
          Understanding each helps you choose the right mitigation strategy.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Gradient Interference */}
          <div className="bg-card p-5 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-heading">Gradient Interference</h4>
                <span className="chip chip-warning text-xs">Epochs 1-3</span>
              </div>
            </div>
            <p className="text-sm text-body mb-3">
              <strong>What happens:</strong> New task gradients "collide" with the gradients that would maintain 
              old knowledge. The model can't simultaneously minimize loss on both, so old patterns get disrupted.
            </p>
            <p className="text-sm text-body mb-3">
              <strong>Where it occurs:</strong> Primarily in lower layers (attention mechanisms, early embeddings). 
              These layers encode fundamental linguistic patterns that the model built during pretraining.
            </p>
            <p className="text-sm text-muted">
              <strong>Why it matters:</strong> This is the earliest and most reversible form of forgetting. 
              Techniques like <span className="text-accent">STM</span> specifically target this phase by masking 
              conflicting gradients.
            </p>
          </div>

          {/* Representational Drift */}
          <div className="bg-card p-5 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-semibold text-heading">Representational Drift</h4>
                <span className="chip chip-info text-xs">Epochs 3-6</span>
              </div>
            </div>
            <p className="text-sm text-body mb-3">
              <strong>What happens:</strong> The model's internal "concept space" rotates. Imagine all knowledge 
              stored as vectors in a high-dimensional space—fine-tuning rotates this space so old concepts are 
              no longer accessible via their original coordinates.
            </p>
            <p className="text-sm text-body mb-3">
              <strong>Where it occurs:</strong> Intermediate layers where abstract reasoning and domain knowledge 
              are encoded. The model hasn't "deleted" old knowledge—it's just moved it to inaccessible locations.
            </p>
            <p className="text-sm text-muted">
              <strong>Why it matters:</strong> This is partially reversible if caught early. 
              <span className="text-accent">Rehearsal</span> prevents drift by continuously anchoring the 
              representation space to general knowledge.
            </p>
          </div>

          {/* Landscape Flattening */}
          <div className="bg-card p-5 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📉</span>
              <div>
                <h4 className="font-semibold text-heading">Landscape Flattening</h4>
                <span className="chip chip-neutral text-xs">Epochs 5+</span>
              </div>
            </div>
            <p className="text-sm text-body mb-3">
              <strong>What happens:</strong> The loss landscape (imagine a mountain range where lower = better) 
              "flattens" around where old knowledge lived. The model no longer has clear gradient signals pointing 
              back to its original capabilities.
            </p>
            <p className="text-sm text-body mb-3">
              <strong>Where it occurs:</strong> Across all layers, but especially in the output projections and 
              task-specific heads. The model has effectively "paved over" the paths back to general knowledge.
            </p>
            <p className="text-sm text-muted">
              <strong>Why it matters:</strong> This is <span className="text-error">largely irreversible</span>. 
              Once flattening occurs, you'd need to retrain from scratch. <span className="text-accent">PNN</span> 
              avoids this entirely by never modifying original parameters.
            </p>
          </div>
        </div>
      </Panel>

      {/* Practical Recommendation */}
      <Panel variant="success" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-heading mb-2">Practical Recommendations</h3>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Use early stopping</strong> — Monitor validation loss on held-out general tasks, not just target task
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Start with LoRA</strong> — Parameter-efficient methods naturally reduce forgetting by updating fewer weights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Mix in general data</strong> — Even 5-10% rehearsal data can significantly reduce forgetting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Consider STM for production</strong> — 15% compute overhead for 65% forgetting reduction is often worth it
              </li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* Data timestamp */}
      <p className="text-xs text-muted text-center">
        Data last updated: {DATA_LAST_UPDATED}. Based on research from NeurIPS 2025 and EMNLP 2025.
      </p>
    </div>
  );
}
