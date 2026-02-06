import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../shared';
import { fineTuningMethods, loraConfigs, modelSizes, DATA_LAST_UPDATED } from '../../data';

export function MethodsSection() {
  const [selectedMethod, setSelectedMethod] = useState('lora');
  const [loraRank, setLoraRank] = useState(16);
  const [selectedModelSize, setSelectedModelSize] = useState(7);

  const currentLoraConfig = loraConfigs.find(c => c.rank === loraRank) || loraConfigs[4];
  const currentModel = modelSizes.find(m => m.paramsNum === selectedModelSize) || modelSizes[2];

  // Calculate actual VRAM based on model size and LoRA rank
  const baseVram = currentModel.fullVram;
  const loraVram = currentModel.loraVram * (loraRank / 16); // Scale by rank
  const qloraVram = currentModel.qloraVram * (loraRank / 16);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
          🔧 Fine-Tuning Methods
        </h1>
        <p className="text-body text-lg">
          Not all fine-tuning is created equal. Choose the right method for your budget, 
          hardware, and goals.
        </p>
      </div>

      {/* Introduction */}
      <Panel variant="info" className="p-6">
        <h2 className="text-xl font-bold text-heading mb-3">What You'll Learn</h2>
        <p className="text-body mb-4">
          Fine-tuning methods fall on a spectrum from <strong>full fine-tuning</strong> (update all parameters, 
          best results, highest cost) to <strong>parameter-efficient methods</strong> (update 0.1-1% of parameters, 
          nearly as good, fraction of the cost).
        </p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">🎯 Key Decision</p>
            <p className="text-muted">Which method matches your compute budget and quality requirements?</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">🎛️ Interactive Below</p>
            <p className="text-muted">Adjust LoRA rank and model size to see VRAM and quality trade-offs</p>
          </div>
        </div>
      </Panel>

      {/* Method Cards */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-2">Method Comparison</h2>
        <p className="text-body mb-4">
          Click any method to see detailed pros, cons, and when to use it. <strong>SFT</strong> updates 
          all weights (maximum quality). <strong>LoRA</strong> trains small "adapter" matrices (1-4% of 
          parameters). <strong>QLoRA</strong> adds 4-bit quantization for even less memory. <strong>DPO</strong> aligns 
          model outputs with human preferences without needing a reward model.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fineTuningMethods.map((method) => (
            <motion.button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`panel p-4 text-left transition-all ${
                selectedMethod === method.id
                  ? 'ring-2 ring-accent'
                  : 'hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h3 className="font-bold text-heading">{method.shortName}</h3>
                  <p className="text-xs text-muted">{method.trainableParams} params</p>
                </div>
              </div>
              <p className="text-sm text-body mb-3">{method.description}</p>
              <div className="flex flex-wrap gap-1">
                {method.bestFor.slice(0, 2).map((use, i) => (
                  <span key={i} className="chip chip-info text-xs">{use}</span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Method Details */}
      {selectedMethod && (
        <Panel variant="info" className="p-6">
          {(() => {
            const method = fineTuningMethods.find(m => m.id === selectedMethod);
            if (!method) return null;
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{method.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-heading">{method.name}</h3>
                    <p className="text-sm text-muted">
                      Trainable: {method.trainableParams} • Memory reduction: {method.memoryReduction}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-heading mb-2 flex items-center gap-2">
                      <span className="text-success">✓</span> Pros
                    </h4>
                    <ul className="space-y-1">
                      {method.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-body flex items-start gap-2">
                          <span className="text-success">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading mb-2 flex items-center gap-2">
                      <span className="text-warning">⚠</span> Cons
                    </h4>
                    <ul className="space-y-1">
                      {method.cons.map((con, i) => (
                        <li key={i} className="text-sm text-body flex items-start gap-2">
                          <span className="text-warning">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </Panel>
      )}

      {/* LoRA Rank Simulator */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-2">🎛️ LoRA Rank Simulator</h2>
        
        {/* What is LoRA Rank? */}
        <Panel variant="neutral-soft" className="p-4 mb-4">
          <h3 className="font-semibold text-heading mb-2">What is LoRA Rank?</h3>
          <p className="text-body text-sm mb-3">
            Instead of updating all 7 billion parameters in a model, LoRA adds two small matrices (A and B) to each 
            layer. These matrices multiply together to create the "update" the model needs to learn your task.
          </p>
          <p className="text-body text-sm mb-3">
            The <strong>rank</strong> (r) is the inner dimension of these matrices. A rank of 16 means each adapter 
            has 16 "channels" to encode new knowledge. Higher rank = more channels = more expressive power, but also 
            more memory and compute.
          </p>
          
          {/* Visual analogy */}
          <div className="bg-card-secondary rounded-lg p-4 mb-4">
            <p className="text-sm text-heading font-medium mb-2">📐 Math intuition (simplified):</p>
            <p className="text-xs text-muted font-mono mb-2">
              Original weight update: ΔW = huge 4096×4096 matrix (16M params)<br/>
              LoRA approximation: ΔW ≈ A × B where A is 4096×r and B is r×4096
            </p>
            <p className="text-xs text-body">
              With r=16: only 2 × 4096 × 16 = <strong>131K params</strong> instead of 16M. That's 99% fewer parameters!
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="panel panel-info p-3">
              <p className="font-semibold text-heading">Low rank (r=4-8)</p>
              <p className="text-muted text-xs">Minimal memory, fast training. Good for simple style or format changes. May underfit complex tasks.</p>
            </div>
            <div className="panel panel-success p-3">
              <p className="font-semibold text-heading">Medium rank (r=16-32)</p>
              <p className="text-muted text-xs">Sweet spot for most tasks. Enough capacity for domain adaptation without overfitting.</p>
            </div>
            <div className="panel panel-warning p-3">
              <p className="font-semibold text-heading">High rank (r=64-128)</p>
              <p className="text-muted text-xs">Near full fine-tuning expressiveness. Use for complex reasoning or multi-task learning.</p>
            </div>
          </div>
        </Panel>

        <p className="text-sm text-muted mb-4">
          Adjust the LoRA rank to see how it affects trainable parameters, memory usage, and quality.
          Lower ranks = faster & cheaper. Higher ranks = better quality.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Panel variant="neutral" className="p-6">
            <h3 className="font-semibold text-heading mb-4">Configuration</h3>
            
            {/* Model Size Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-heading mb-2">
                Model Size
              </label>
              <div className="flex flex-wrap gap-2">
                {modelSizes.map((model) => (
                  <button
                    key={model.paramsNum}
                    onClick={() => setSelectedModelSize(model.paramsNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedModelSize === model.paramsNum
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-card'
                        : 'bg-card-secondary text-body hover:bg-card-tertiary'
                    }`}
                  >
                    {model.params}
                  </button>
                ))}
              </div>
            </div>

            {/* LoRA Rank Slider */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-heading mb-2">
                LoRA Rank: <span className="font-mono text-accent">{loraRank}</span>
              </label>
              <input
                type="range"
                min="1"
                max="128"
                step="1"
                value={loraRank}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  // Snap to valid ranks
                  const validRanks = loraConfigs.map(c => c.rank);
                  const closest = validRanks.reduce((prev, curr) =>
                    Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
                  );
                  setLoraRank(closest);
                }}
                className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>1 (minimal)</span>
                <span>128 (maximum)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-heading mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { rank: 4, label: 'Minimal', desc: 'Fast prototyping' },
                  { rank: 16, label: 'Balanced', desc: 'Recommended' },
                  { rank: 64, label: 'Quality', desc: 'Best results' },
                ].map((preset) => (
                  <button
                    key={preset.rank}
                    onClick={() => setLoraRank(preset.rank)}
                    className={`px-3 py-2 rounded-lg text-left transition-colors ${
                      loraRank === preset.rank
                        ? 'bg-accent text-white'
                        : 'bg-card-secondary text-body hover:bg-card-tertiary'
                    }`}
                  >
                    <div className="text-sm font-medium">{preset.label} (r={preset.rank})</div>
                    <div className="text-xs opacity-75">{preset.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* Results */}
          <Panel variant="neutral-soft" className="p-6">
            <h3 className="font-semibold text-heading mb-4">Impact Analysis</h3>
            
            <div className="space-y-4">
              {/* Trainable Parameters */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-body">Trainable Parameters</span>
                  <span className="font-mono text-heading">
                    {currentLoraConfig.trainableParams}% 
                    <span className="text-muted ml-1">
                      (~{((currentModel.paramsNum * 1000 * currentLoraConfig.trainableParams) / 100).toFixed(0)}M)
                    </span>
                  </span>
                </div>
                <div className="h-3 bg-card-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(currentLoraConfig.trainableParams * 50, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  vs {(currentModel.paramsNum * 1000).toLocaleString()}M for full fine-tuning
                </p>
              </div>

              {/* VRAM Usage Comparison */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-body">VRAM Usage ({currentModel.params} model)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted w-16">Full FT:</span>
                    <div className="flex-1 h-4 bg-card-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-error rounded-full"
                        style={{ width: `${Math.min((baseVram / 300) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-16 text-right">{baseVram} GB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted w-16">LoRA:</span>
                    <div className="flex-1 h-4 bg-card-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent rounded-full"
                        animate={{ width: `${Math.min((loraVram / 300) * 100, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-mono w-16 text-right">{loraVram.toFixed(1)} GB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted w-16">QLoRA:</span>
                    <div className="flex-1 h-4 bg-card-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-success rounded-full"
                        animate={{ width: `${Math.min((qloraVram / 300) * 100, 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs font-mono w-16 text-right">{qloraVram.toFixed(1)} GB</span>
                  </div>
                </div>
              </div>

              {/* Training Time Estimate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-body">Estimated Training Time</span>
                  <span className="font-mono text-heading">
                    ~{Math.round((currentModel.paramsNum / 7) * (1 / currentLoraConfig.trainingSpeed) * 2)}h
                  </span>
                </div>
                <p className="text-xs text-muted">
                  For ~10K examples on 1× A100 (varies by dataset size)
                </p>
              </div>

              {/* Quality Score */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-body">Expected Quality</span>
                  <span className="font-mono text-heading">{currentLoraConfig.qualityScore}%</span>
                </div>
                <div className="h-3 bg-card-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: currentLoraConfig.qualityScore >= 90 ? '#22c55e' :
                        currentLoraConfig.qualityScore >= 70 ? '#f59e0b' : '#ef4444'
                    }}
                    animate={{ width: `${currentLoraConfig.qualityScore}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  Relative to full fine-tuning (quality doesn't scale with model size—rank matters more)
                </p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-6 p-4 bg-card rounded-lg border border-divider">
              <h4 className="font-semibold text-heading text-sm mb-2">💡 Recommendation</h4>
              <p className="text-sm text-body">
                {loraRank <= 4 && `With ${currentModel.params}, r=${loraRank} trains ${((currentModel.paramsNum * 1000 * currentLoraConfig.trainableParams) / 100).toFixed(0)}M params. Great for prototyping, may need higher rank for complex tasks.`}
                {loraRank > 4 && loraRank <= 16 && `Balanced choice: ${currentModel.params} at r=${loraRank} gives good quality-to-cost ratio with ${loraVram.toFixed(0)}GB VRAM.`}
                {loraRank > 16 && loraRank <= 32 && `High quality setup. At ${loraVram.toFixed(0)}GB VRAM for ${currentModel.params}, ensure you have the hardware.`}
                {loraRank > 32 && `Near full fine-tuning quality with ${((currentModel.paramsNum * 1000 * currentLoraConfig.trainableParams) / 100).toFixed(0)}M trainable params. Only needed for complex domain shifts.`}
              </p>
            </div>
          </Panel>
        </div>
      </section>

      {/* LoRA Math Explainer */}
      <Panel variant="info" className="p-6">
        <h3 className="font-semibold text-heading mb-3">📐 How LoRA Works</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-body mb-4">
              LoRA decomposes weight updates into low-rank matrices. Instead of updating 
              the full weight matrix W, it learns two smaller matrices B and A:
            </p>
            <div className="bg-card p-4 rounded-lg font-mono text-sm text-center mb-4">
              W₀ + ΔW = W₀ + BA
            </div>
            <p className="text-sm text-body">
              Where B ∈ ℝ<sup>d×r</sup> and A ∈ ℝ<sup>r×k</sup>, with rank r ≪ min(d,k).
            </p>
          </div>
          <div>
            <h4 className="font-medium text-heading mb-2">Why it works:</h4>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                Weight changes during fine-tuning have low "intrinsic rank"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                Only r × (d + k) parameters vs d × k for full update
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                Adapter files are tiny (MBs vs GBs)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                Can merge adapters back into base model for inference
              </li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* Conclusion & Next Step */}
      <Panel variant="success" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">🎯</span>
          <div>
            <h3 className="font-bold text-heading mb-2">Key Takeaways</h3>
            <ul className="text-body text-sm space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span><strong>LoRA with r=16-32</strong> covers 90% of use cases—start there</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span><strong>QLoRA</strong> lets you fine-tune 70B models on consumer GPUs (24GB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span><strong>Full fine-tuning</strong> only when you need maximum performance AND have the budget</span>
              </li>
            </ul>
            <div className="p-4 bg-card rounded-lg border border-divider">
              <p className="text-sm text-body mb-2">
                <strong>Next up:</strong> Now that you know <em>how</em> to fine-tune efficiently, the question becomes: 
                what model should you fine-tune? Surprisingly, smaller models often outperform giants on specialized tasks.
              </p>
              <p className="text-sm text-muted">
                → Continue to <strong>Small Language Models</strong> to learn when a 7B model beats GPT-4
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Data timestamp */}
      <p className="text-xs text-muted text-center">
        Data last updated: {DATA_LAST_UPDATED}
      </p>
    </div>
  );
}
