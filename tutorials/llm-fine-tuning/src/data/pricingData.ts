// Pricing data for fine-tuning and inference
// Sources: Together AI, Oxen.ai, Modal, RunPod, Anyscale (Feb 2026)
// Last updated: February 2026

export interface Provider {
  id: string;
  name: string;
  type: 'serverless' | 'dedicated' | 'cloud';
  description: string;
  icon: string;
  pricingModel: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

export const providers: Provider[] = [
  {
    id: 'together',
    name: 'Together AI',
    type: 'serverless',
    description: 'Token-based pricing, serverless fine-tuning platform',
    icon: '🤝',
    pricingModel: 'Per million tokens',
    pros: [
      'Simple token-based pricing—easy to estimate costs',
      'No GPU management needed',
      'Fast iteration with hosted checkpoints',
      'Built-in evaluation and monitoring',
    ],
    cons: [
      'Less control over training hyperparameters',
      'Limited model architecture choices',
      'Data must be uploaded to their platform',
    ],
    bestFor: 'Teams wanting quick experiments without infra overhead',
  },
  {
    id: 'oxen',
    name: 'Oxen.ai',
    type: 'dedicated',
    description: 'Time-based pricing with data versioning integration',
    icon: '🐂',
    pricingModel: 'Per hour (dedicated)',
    pros: [
      'Built-in data versioning (like Git for ML data)',
      'Reproducible training runs',
      'Dataset diff and merge tools',
      'Enterprise data governance features',
    ],
    cons: [
      'Limited GPU selection',
      'Smaller community/ecosystem',
      'Higher minimum commitment',
    ],
    bestFor: 'Teams with complex data pipelines needing versioning',
  },
  {
    id: 'modal',
    name: 'Modal',
    type: 'serverless',
    description: 'Python-as-code infrastructure, sub-second cold starts',
    icon: '⚡',
    pricingModel: 'Per second',
    pros: [
      'Pay per second—no idle costs',
      'Python decorator-based—feels like local code',
      'Instant cold starts for inference',
      'Great for batch jobs and pipelines',
      'Generous free tier',
    ],
    cons: [
      'Learning curve for Modal-specific patterns',
      'Less suited for long-running interactive sessions',
      'Debugging distributed code can be tricky',
    ],
    bestFor: 'Developers who want infrastructure-as-code simplicity',
  },
  {
    id: 'runpod',
    name: 'RunPod',
    type: 'cloud',
    description: 'GPU cloud marketplace, spot and on-demand',
    icon: '🚀',
    pricingModel: 'Per hour',
    pros: [
      'Cheapest spot GPU prices',
      'Wide GPU selection (consumer to datacenter)',
      'Community templates for common setups',
      'Persistent storage across sessions',
      'Jupyter/SSH access—feels like local',
    ],
    cons: [
      'Spot instances can be preempted',
      'Less polished UI/UX than enterprise clouds',
      'Variable availability for popular GPUs',
    ],
    bestFor: 'Budget-conscious teams comfortable with raw GPU access',
  },
  {
    id: 'anyscale',
    name: 'Anyscale',
    type: 'cloud',
    description: 'Ray-based distributed computing, enterprise focus',
    icon: '📐',
    pricingModel: 'Per hour (managed)',
    pros: [
      'Native Ray integration—scales across GPUs easily',
      'Enterprise security and compliance',
      'Managed MLflow and experiment tracking',
      'Multi-cloud support',
    ],
    cons: [
      'Higher prices than raw cloud',
      'Ray learning curve if not already using it',
      'Overkill for single-GPU experiments',
    ],
    bestFor: 'Enterprise teams already using Ray for distributed ML',
  },
];

// Token-based fine-tuning pricing (Together AI style)
export interface TokenPricing {
  modelSize: string;
  minParams: number;
  maxParams: number;
  loraPerMToken: number;
  fullFtPerMToken: number;
  dpoMultiplier: number;
}

export const tokenPricing: TokenPricing[] = [
  { modelSize: 'Up to 16B', minParams: 0, maxParams: 16, loraPerMToken: 0.48, fullFtPerMToken: 0.54, dpoMultiplier: 2.5 },
  { modelSize: '17B - 69B', minParams: 17, maxParams: 69, loraPerMToken: 1.50, fullFtPerMToken: 1.65, dpoMultiplier: 2.5 },
  { modelSize: '70B - 100B', minParams: 70, maxParams: 100, loraPerMToken: 2.90, fullFtPerMToken: 3.20, dpoMultiplier: 2.5 },
];

// Hourly GPU pricing
export interface GpuPricing {
  gpu: string;
  vram: number;
  modalPerHour: number;
  runpodPerHour: number | null;
  anyscalePerHour: number;
  oxenPerHour: number | null;
  bestFor: string;
}

export const gpuPricing: GpuPricing[] = [
  { gpu: 'NVIDIA T4', vram: 16, modalPerHour: 0.59, runpodPerHour: 0.40, anyscalePerHour: 0.57, oxenPerHour: null, bestFor: 'Small model inference' },
  { gpu: 'NVIDIA L4', vram: 24, modalPerHour: 0.95, runpodPerHour: 0.68, anyscalePerHour: 0.95, oxenPerHour: null, bestFor: 'Efficient multimodal' },
  { gpu: 'NVIDIA A10G', vram: 24, modalPerHour: 1.37, runpodPerHour: 0.99, anyscalePerHour: 1.36, oxenPerHour: 1.65, bestFor: 'Standard LLM fine-tuning' },
  { gpu: 'NVIDIA L40S', vram: 48, modalPerHour: 1.95, runpodPerHour: 1.33, anyscalePerHour: 2.10, oxenPerHour: null, bestFor: 'Medium model training' },
  { gpu: 'NVIDIA A100 80GB', vram: 80, modalPerHour: 2.50, runpodPerHour: 2.18, anyscalePerHour: 4.96, oxenPerHour: null, bestFor: 'Large-scale training' },
  { gpu: 'NVIDIA H100', vram: 80, modalPerHour: 3.95, runpodPerHour: 4.47, anyscalePerHour: 9.29, oxenPerHour: 4.87, bestFor: 'Frontier models' },
  { gpu: 'NVIDIA H200', vram: 141, modalPerHour: 6.25, runpodPerHour: null, anyscalePerHour: 10.68, oxenPerHour: null, bestFor: 'Maximum memory bandwidth' },
];

// Dedicated instance pricing (Oxen.ai style)
export interface DedicatedInstance {
  model: string;
  hardware: string;
  hourlyRate: number;
  provider: string;
}

export const dedicatedInstances: DedicatedInstance[] = [
  { model: 'Llama 3.1 8B', hardware: '1x H100', hourlyRate: 4.87, provider: 'oxen' },
  { model: 'Qwen3-0.6B', hardware: '1x A10G', hourlyRate: 1.65, provider: 'oxen' },
  { model: 'Llama 4 Scout', hardware: '4x H100', hourlyRate: 15.00, provider: 'oxen' },
  { model: 'FLUX.1 [dev]', hardware: '1x H100', hourlyRate: 4.87, provider: 'oxen' },
];

// Break-even calculation
export interface BreakEvenData {
  gpuModel: string;
  purchasePrice: number; // including infrastructure
  cloudHourlyRate: number;
  breakEvenMonths: number;
  recommendation: string;
}

export const breakEvenData: BreakEvenData[] = [
  { gpuModel: 'NVIDIA A100 80GB', purchasePrice: 15000, cloudHourlyRate: 2.50, breakEvenMonths: 8, recommendation: 'Cloud for <6 months' },
  { gpuModel: 'NVIDIA H100', purchasePrice: 30000, cloudHourlyRate: 3.95, breakEvenMonths: 14, recommendation: 'Cloud for <12 months' },
  { gpuModel: 'NVIDIA H200', purchasePrice: 40000, cloudHourlyRate: 6.25, breakEvenMonths: 10, recommendation: 'Cloud for <8 months' },
];

// Calculate fine-tuning cost
export interface CostEstimate {
  provider: string;
  method: 'lora' | 'full' | 'dpo';
  modelSizeB: number;
  tokensM: number;
  hours: number;
  totalCost: number;
  breakdown: string;
}

export function calculateTokenCost(
  modelSizeB: number,
  tokensM: number,
  method: 'lora' | 'full' | 'dpo'
): number {
  const tier = tokenPricing.find(t => modelSizeB >= t.minParams && modelSizeB <= t.maxParams);
  if (!tier) return 0;

  let baseRate = method === 'lora' ? tier.loraPerMToken : tier.fullFtPerMToken;
  if (method === 'dpo') {
    baseRate = tier.loraPerMToken * tier.dpoMultiplier;
  }

  return baseRate * tokensM;
}

export function calculateHourlyCost(
  gpuModel: string,
  hours: number,
  provider: string
): number {
  const gpu = gpuPricing.find(g => g.gpu === gpuModel);
  if (!gpu) return 0;

  switch (provider) {
    case 'modal':
      return gpu.modalPerHour * hours;
    case 'runpod':
      return (gpu.runpodPerHour || 0) * hours;
    case 'anyscale':
      return gpu.anyscalePerHour * hours;
    case 'oxen':
      return (gpu.oxenPerHour || 0) * hours;
    default:
      return 0;
  }
}

export const DATA_LAST_UPDATED = '2026-02';
export const PRICING_DISCLAIMER = 'Pricing as of February 2026. Verify current rates directly with providers before making decisions.';
