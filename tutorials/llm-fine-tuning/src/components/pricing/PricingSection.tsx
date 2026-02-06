import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../shared';
import {
  providers,
  tokenPricing,
  gpuPricing,
  breakEvenData,
  calculateTokenCost,
  calculateHourlyCost,
  PRICING_DISCLAIMER,
  DATA_LAST_UPDATED,
} from '../../data';

export function PricingSection() {
  // Token-based pricing state
  const [modelSizeB, setModelSizeB] = useState(7);
  const [tokensM, setTokensM] = useState(10);
  const [method, setMethod] = useState<'lora' | 'full' | 'dpo'>('lora');

  // Hourly pricing state
  const [selectedGpu, setSelectedGpu] = useState('NVIDIA A10G');
  const [hours, setHours] = useState(24);
  const [selectedProvider, setSelectedProvider] = useState('modal');

  // Track which calculator was just loaded from an example
  const [highlightCalc, setHighlightCalc] = useState<'token' | 'hourly' | 'both' | null>(null);

  // Calculate costs
  const tokenCost = useMemo(
    () => calculateTokenCost(modelSizeB, tokensM, method),
    [modelSizeB, tokensM, method]
  );

  const hourlyCost = useMemo(
    () => calculateHourlyCost(selectedGpu, hours, selectedProvider),
    [selectedGpu, hours, selectedProvider]
  );

  const selectedGpuData = gpuPricing.find(g => g.gpu === selectedGpu);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
          💰 Pricing Calculator
        </h1>
        <p className="text-body text-lg">
          Fine-tuning costs range from $5 to $50,000. Know where your project falls.
        </p>
      </div>

      {/* Introduction */}
      <Panel variant="info" className="p-6">
        <h2 className="text-xl font-bold text-heading mb-3">What You'll Learn</h2>
        <p className="text-body mb-4">
          Fine-tuning pricing comes in two flavors: <strong>token-based</strong> (pay per data processed, like Together AI) 
          and <strong>hourly</strong> (rent GPUs by the hour, like Modal or RunPod). The right choice depends on your 
          dataset size, model size, and how often you'll retrain.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">📊 Token Pricing</p>
            <p className="text-muted">$0.48-$3.20 per million tokens</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">⏱️ Hourly Pricing</p>
            <p className="text-muted">$0.40-$10/hr depending on GPU</p>
          </div>
          <div className="panel panel-neutral-soft p-3">
            <p className="font-semibold text-heading mb-1">🏠 Buy vs Rent</p>
            <p className="text-muted">Break-even at ~14 months for H100</p>
          </div>
        </div>
      </Panel>

      {/* Disclaimer */}
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-center">
        <p className="text-sm text-warning">
          ⚠️ {PRICING_DISCLAIMER}
        </p>
      </div>

      {/* Real-World Examples */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-2">🎯 Real-World Fine-Tuning Examples</h2>
        <p className="text-sm text-muted mb-4">Click an example to load it into the calculator below</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '✍️',
              title: 'Marketing Copy Generator',
              dataset: '500 product descriptions',
              tokensDisplay: '~2M (3 epochs)',
              tokensM: 2,
              modelDisplay: 'Llama 8B + LoRA',
              modelSizeB: 8,
              method: 'lora' as const,
              gpu: 'NVIDIA A10G',
              hours: 1,
              costTier: '$',
              costClass: 'text-success',
              variant: 'info' as const,
              result: 'Model learns your brand voice, product naming conventions, and call-to-action style.',
            },
            {
              icon: '💬',
              title: 'Customer Support Bot',
              dataset: '5,000 support tickets + resolutions',
              tokensDisplay: '~15M (3 epochs)',
              tokensM: 15,
              modelDisplay: 'Qwen 7B + LoRA',
              modelSizeB: 7,
              method: 'lora' as const,
              gpu: 'NVIDIA A10G',
              hours: 2,
              costTier: '$',
              costClass: 'text-success',
              variant: 'success' as const,
              result: 'Handles 80% of tier-1 tickets automatically. Learns company policies, product specifics, and escalation patterns.',
            },
            {
              icon: '👨‍💻',
              title: 'Internal Code Assistant',
              dataset: 'Your codebase + docs (~50K files)',
              tokensDisplay: '~100M (2 epochs)',
              tokensM: 100,
              modelDisplay: 'CodeLlama 34B + LoRA',
              modelSizeB: 34,
              method: 'lora' as const,
              gpu: 'NVIDIA L40S',
              hours: 24,
              costTier: '$$',
              costClass: 'text-warning',
              variant: 'neutral' as const,
              result: 'Understands your APIs, coding conventions, and internal libraries. Suggests code in your team\'s style.',
            },
            {
              icon: '⚖️',
              title: 'Legal Document Drafter',
              dataset: '1,000 contracts + clauses',
              tokensDisplay: '~50M (5 epochs)',
              tokensM: 50,
              modelDisplay: 'Llama 70B + QLoRA',
              modelSizeB: 70,
              method: 'lora' as const,
              gpu: 'NVIDIA A100 80GB',
              hours: 12,
              costTier: '$$',
              costClass: 'text-warning',
              variant: 'warning' as const,
              result: 'Generates jurisdiction-specific clauses, understands your firm\'s precedent library. Still needs human review.',
            },
            {
              icon: '🎨',
              title: 'Brand Image Style (SDXL)',
              dataset: '200 brand images + captions',
              tokensDisplay: '~4 hours on A100',
              tokensM: 0,
              modelDisplay: 'SDXL + LoRA',
              modelSizeB: 0,
              method: 'lora' as const,
              gpu: 'NVIDIA A100 80GB',
              hours: 4,
              costTier: '$',
              costClass: 'text-success',
              variant: 'neutral-soft' as const,
              result: 'Generates images in your brand\'s visual style—color palette, composition, product placement.',
              isImageModel: true,
            },
            {
              icon: '🏢',
              title: 'Enterprise Knowledge Base',
              dataset: 'All internal docs (100K pages)',
              tokensDisplay: '~500M (2 epochs)',
              tokensM: 100,
              modelDisplay: 'Llama 70B + QLoRA + DPO',
              modelSizeB: 70,
              method: 'dpo' as const,
              gpu: 'NVIDIA H100',
              hours: 72,
              costTier: '$$$',
              costClass: 'text-error',
              variant: 'info' as const,
              result: 'Answers employee questions about policies, processes, and institutional knowledge. DPO aligns to HR-approved responses.',
            },
          ].map((example) => (
            <button
              key={example.title}
              onClick={() => {
                // Always set GPU hours calculator
                setSelectedGpu(example.gpu);
                setHours(example.hours);
                setSelectedProvider('modal');
                
                if (example.isImageModel) {
                  // Image models: only highlight hourly calculator
                  setHighlightCalc('hourly');
                } else if (example.tokensM > 0) {
                  // LLM models: also set token calculator
                  setModelSizeB(example.modelSizeB);
                  setTokensM(example.tokensM);
                  setMethod(example.method);
                  setHighlightCalc('both');
                }
                
                setTimeout(() => setHighlightCalc(null), 2000);
                document.getElementById('pricing-calculator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left transition-all border rounded-lg p-4 hover:ring-2 hover:ring-indigo-400/50 cursor-pointer bg-card border-white/10 hover:border-indigo-400/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{example.icon}</span>
                <h3 className="font-bold text-heading">{example.title}</h3>
                <span className="ml-auto text-xs text-accent">▶ Load</span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted">Dataset:</span>
                  <span>{example.dataset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{example.isImageModel ? 'Training:' : 'Tokens:'}</span>
                  <span className="font-mono">{example.tokensDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Model:</span>
                  <span>{example.modelDisplay}</span>
                </div>
                <div className="flex justify-between border-t border-divider pt-2">
                  <span className="text-heading font-medium">Cost:</span>
                  <span className={`font-bold text-lg tracking-wider ${example.costClass}`}>{example.costTier}</span>
                </div>
              </div>
              <p className="text-xs text-muted bg-card-secondary p-2 rounded">
                💡 Result: {example.result}
              </p>
              {example.isImageModel && (
                <p className="text-xs text-accent mt-2">⏱️ Loads into GPU hourly calculator</p>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-4 text-center">
          <span className="text-success">$</span> = under $20 · <span className="text-warning">$$</span> = $20–$500 · <span className="text-error">$$$</span> = $500+
          <br />Click any example to load into calculators below.
        </p>
      </section>

      {/* Pricing Model Tabs */}
      <div id="pricing-calculator" className="grid lg:grid-cols-2 gap-6">
        {/* Token-Based Pricing */}
        <Panel 
          variant="info" 
          className={`p-6 transition-all duration-500 ${
            (highlightCalc === 'token' || highlightCalc === 'both') ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-card' : ''
          }`}
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>📝</span> Token-Based Pricing
            {(highlightCalc === 'token' || highlightCalc === 'both') && (
              <span className="ml-auto text-xs bg-indigo-500 text-white px-2 py-1 rounded animate-pulse">✓ Loaded</span>
            )}
          </h2>
          <p className="text-sm text-muted mb-4">
            Pay per million tokens processed (Together AI model)
          </p>

          {/* Model Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-heading mb-2">
              Model Size: <span className="font-mono text-accent">{modelSizeB}B parameters</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={modelSizeB}
              onChange={(e) => setModelSizeB(parseInt(e.target.value))}
              className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1B</span>
              <span>16B</span>
              <span>70B</span>
              <span>100B</span>
            </div>
          </div>

          {/* Token Volume */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-heading mb-2">
              Token Volume: <span className="font-mono text-accent">{tokensM}M tokens</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={tokensM}
              onChange={(e) => setTokensM(parseInt(e.target.value))}
              className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-heading mb-2">
              Fine-Tuning Method
            </label>
            <div className="flex gap-2">
              {[
                { id: 'lora', label: 'LoRA', multiplier: '1x' },
                { id: 'full', label: 'Full FT', multiplier: '1.1x' },
                { id: 'dpo', label: 'DPO', multiplier: '2.5x' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as typeof method)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all border ${
                    method === m.id
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400 ring-offset-1 ring-offset-card'
                      : 'bg-card-secondary text-body border-white/10 hover:border-indigo-400/50 hover:bg-card-tertiary'
                  }`}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-xs opacity-75">{m.multiplier}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">
              DPO costs 2.5x more because it requires processing preference pairs (chosen + rejected) and running comparison forward passes.
            </p>
          </div>

          {/* Result */}
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-sm text-muted mb-1">Estimated Cost</p>
            <p className="text-4xl font-bold text-accent">${tokenCost.toFixed(2)}</p>
            <p className="text-xs text-muted mt-1">
              for {tokensM}M tokens on {modelSizeB}B model
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-heading mb-2">Pricing Tiers (Together AI)</h4>
            <div className="space-y-2 text-xs">
              {tokenPricing.map((tier) => (
                <div 
                  key={tier.modelSize}
                  className={`flex justify-between p-2 rounded ${
                    modelSizeB >= tier.minParams && modelSizeB <= tier.maxParams
                      ? 'bg-accent/10 border border-accent/30'
                      : 'bg-card-secondary'
                  }`}
                >
                  <span>{tier.modelSize}</span>
                  <span className="font-mono">
                    LoRA: ${tier.loraPerMToken}/M • Full: ${tier.fullFtPerMToken}/M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Hourly GPU Pricing */}
        <Panel 
          variant="neutral" 
          className={`p-6 transition-all duration-500 ${
            (highlightCalc === 'hourly' || highlightCalc === 'both') ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-card' : ''
          }`}
        >
          <h2 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
            <span>⏱️</span> Hourly GPU Pricing
            {(highlightCalc === 'hourly' || highlightCalc === 'both') && (
              <span className="ml-auto text-xs bg-indigo-500 text-white px-2 py-1 rounded animate-pulse">✓ Loaded</span>
            )}
          </h2>
          <p className="text-sm text-muted mb-4">
            Rent dedicated GPU instances by the hour
          </p>

          {/* GPU Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-heading mb-2">
              GPU Model <span className="text-muted font-normal">(click to compare)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gpuPricing.slice(0, 6).map((gpu) => (
                <button
                  key={gpu.gpu}
                  onClick={() => setSelectedGpu(gpu.gpu)}
                  className={`p-2 rounded-lg text-left text-sm transition-all border ${
                    selectedGpu === gpu.gpu
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400 ring-offset-1 ring-offset-card'
                      : 'bg-card-secondary text-body border-white/10 hover:border-indigo-400/50 hover:bg-card-tertiary'
                  }`}
                >
                  <div className="font-medium truncate">{gpu.gpu.replace('NVIDIA ', '')}</div>
                  <div className="text-xs opacity-75">{gpu.vram}GB VRAM</div>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-heading mb-2">
              Provider
            </label>
            <div className="flex flex-wrap gap-2">
              {providers.filter(p => p.id !== 'together').map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
                    selectedProvider === provider.id
                      ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400 ring-offset-1 ring-offset-card'
                      : 'bg-card-secondary text-body border-white/10 hover:border-indigo-400/50 hover:bg-card-tertiary'
                  }`}
                >
                  {provider.icon} {provider.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-heading mb-2">
              Duration: <span className="font-mono text-accent">{hours} hours</span>
            </label>
            <input
              type="range"
              min="1"
              max="168"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-card-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 hour</span>
              <span>1 day (24h)</span>
              <span>1 week (168h)</span>
            </div>
          </div>

          {/* Result */}
          <div className="bg-card p-4 rounded-lg text-center">
            <p className="text-sm text-muted mb-1">Estimated Cost</p>
            <p className="text-4xl font-bold text-accent">
              ${hourlyCost > 0 ? hourlyCost.toFixed(2) : 'N/A'}
            </p>
            <p className="text-xs text-muted mt-1">
              {selectedGpu} for {hours} hours on {providers.find(p => p.id === selectedProvider)?.name}
            </p>
          </div>

          {/* Hourly Rate */}
          {selectedGpuData && (
            <div className="mt-4 text-sm">
              <h4 className="font-medium text-heading mb-2">Hourly Rates Comparison</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-card-secondary p-2 rounded">
                  <span className="text-muted">Modal:</span>{' '}
                  <span className="font-mono">${selectedGpuData.modalPerHour.toFixed(2)}/hr</span>
                </div>
                <div className="bg-card-secondary p-2 rounded">
                  <span className="text-muted">RunPod:</span>{' '}
                  <span className="font-mono">
                    {selectedGpuData.runpodPerHour ? `$${selectedGpuData.runpodPerHour.toFixed(2)}/hr` : 'N/A'}
                  </span>
                </div>
                <div className="bg-card-secondary p-2 rounded">
                  <span className="text-muted">Anyscale:</span>{' '}
                  <span className="font-mono">${selectedGpuData.anyscalePerHour.toFixed(2)}/hr</span>
                </div>
                <div className="bg-card-secondary p-2 rounded">
                  <span className="text-muted">Oxen:</span>{' '}
                  <span className="font-mono">
                    {selectedGpuData.oxenPerHour ? `$${selectedGpuData.oxenPerHour.toFixed(2)}/hr` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* GPU Comparison Table */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">📊 Full GPU Pricing Comparison</h2>
        <Panel variant="neutral-soft" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left p-3 font-semibold text-heading">GPU</th>
                <th className="text-center p-3 font-semibold text-heading">VRAM</th>
                <th className="text-center p-3 font-semibold text-heading">Modal</th>
                <th className="text-center p-3 font-semibold text-heading">RunPod</th>
                <th className="text-center p-3 font-semibold text-heading">Anyscale</th>
                <th className="text-left p-3 font-semibold text-heading">Best For</th>
              </tr>
            </thead>
            <tbody>
              {gpuPricing.map((gpu, i) => (
                <motion.tr
                  key={gpu.gpu}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border-b border-divider/50 ${
                    selectedGpu === gpu.gpu ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="p-3 font-medium text-heading">{gpu.gpu}</td>
                  <td className="p-3 text-center">{gpu.vram} GB</td>
                  <td className="p-3 text-center font-mono">${gpu.modalPerHour.toFixed(2)}</td>
                  <td className="p-3 text-center font-mono">
                    {gpu.runpodPerHour ? `$${gpu.runpodPerHour.toFixed(2)}` : '—'}
                  </td>
                  <td className="p-3 text-center font-mono">${gpu.anyscalePerHour.toFixed(2)}</td>
                  <td className="p-3 text-muted text-xs">{gpu.bestFor}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </section>

      {/* Cloud vs Buy Analysis */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-2">☁️ Cloud vs Buy: Break-Even Analysis</h2>
        <p className="text-sm text-muted mb-4">
          Assumes 24/7 GPU utilization. If you run jobs &lt;8 hours/day, multiply break-even months by 3.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {breakEvenData.map((item) => (
            <Panel key={item.gpuModel} variant="neutral" className="p-4">
              <h3 className="font-bold text-heading mb-2">{item.gpuModel}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Purchase price:</span>
                  <span className="font-mono">${item.purchasePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Cloud rate:</span>
                  <span className="font-mono">${item.cloudHourlyRate}/hr</span>
                </div>
                <div className="flex justify-between border-t border-divider pt-2">
                  <span className="text-heading font-medium">Break-even:</span>
                  <span className="font-bold text-accent">{item.breakEvenMonths} months</span>
                </div>
              </div>
              <p className="text-xs text-muted mt-3 p-2 bg-card rounded">
                💡 {item.recommendation}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Provider Comparison */}
      <section>
        <h2 className="text-xl font-bold text-heading mb-4">🏢 Provider Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <Panel key={provider.id} variant="neutral-soft" className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{provider.icon}</span>
                <div>
                  <h3 className="font-bold text-heading">{provider.name}</h3>
                  <span className="chip text-xs">{provider.type}</span>
                </div>
              </div>
              <p className="text-sm text-body mb-3">{provider.description}</p>
              
              {/* Pros */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-success mb-1">✓ Pros</h4>
                <ul className="text-xs text-muted space-y-1">
                  {provider.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-success shrink-0">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Cons */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-error mb-1">✗ Cons</h4>
                <ul className="text-xs text-muted space-y-1">
                  {provider.cons.slice(0, 2).map((con, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-error shrink-0">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Best For */}
              <div className="bg-card-secondary rounded p-2">
                <p className="text-xs">
                  <span className="font-semibold text-accent">Best for:</span>{' '}
                  <span className="text-body">{provider.bestFor}</span>
                </p>
              </div>
              
              <p className="text-xs text-muted mt-2 pt-2 border-t border-divider">
                <strong>Pricing:</strong> {provider.pricingModel}
              </p>
            </Panel>
          ))}
        </div>
      </section>

      {/* Key Recommendations */}
      <Panel variant="success" className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-heading mb-2">Cost Optimization Tips</h3>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Start serverless</strong> — Modal and RunPod let you pay per second, ideal for experimentation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Use LoRA for prototyping</strong> — At 0.48$/M tokens vs $0.54 for full FT, savings add up fast
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Consider QLoRA for large models</strong> — Run 70B on 24GB GPUs, 10x cheaper hardware tier
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Cloud for {"<"}12 months</strong> — Break-even on H100 purchase is ~14 months of 24/7 usage
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <strong>Watch spot pricing</strong> — RunPod spot instances can be 50-70% cheaper than on-demand
              </li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* Data timestamp */}
      <p className="text-xs text-muted text-center">
        Data last updated: {DATA_LAST_UPDATED}. {PRICING_DISCLAIMER}
      </p>
    </div>
  );
}
