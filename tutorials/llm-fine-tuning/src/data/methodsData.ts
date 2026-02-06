// Fine-tuning methods data
// Sources: Together AI, Oxen.ai, research papers
// Last updated: February 2026

export interface FineTuningMethod {
  id: string;
  name: string;
  shortName: string;
  description: string;
  trainableParams: string;
  memoryReduction: string;
  bestFor: string[];
  pros: string[];
  cons: string[];
  icon: string;
}

export const fineTuningMethods: FineTuningMethod[] = [
  {
    id: 'full',
    name: 'Full Fine-Tuning',
    shortName: 'Full FT',
    description: 'Updates all model parameters during training. Maximum flexibility but highest resource requirements.',
    trainableParams: '100%',
    memoryReduction: '0%',
    bestFor: ['Maximum performance', 'Large training budgets', 'Complete domain shifts'],
    pros: ['Best possible task performance', 'Full model adaptation', 'No architectural constraints'],
    cons: ['Very high VRAM requirements', 'Slow training', 'Risk of catastrophic forgetting', 'Large checkpoint files'],
    icon: '🔥',
  },
  {
    id: 'sft',
    name: 'Supervised Fine-Tuning',
    shortName: 'SFT',
    description: 'Train on input-output pairs representing desired behavior. Foundation of instruction following.',
    trainableParams: '100%',
    memoryReduction: '0%',
    bestFor: ['Instruction alignment', 'Task-specific behavior', 'Domain expertise'],
    pros: ['Direct behavior shaping', 'Well-understood technique', 'Works with small datasets'],
    cons: ['Quality highly dependent on data', 'Can overfit to examples', 'May need preference tuning after'],
    icon: '📚',
  },
  {
    id: 'lora',
    name: 'Low-Rank Adaptation',
    shortName: 'LoRA',
    description: 'Freezes base weights, injects trainable low-rank matrices. Updates only 0.1-1% of parameters.',
    trainableParams: '0.1-1%',
    memoryReduction: '70-90%',
    bestFor: ['Resource-constrained environments', 'Multiple task adapters', 'Quick iterations'],
    pros: ['Dramatic memory savings', 'Fast training', 'Small adapter files', 'Easy to swap/share'],
    cons: ['May not match full FT performance', 'Rank selection matters', 'Some tasks need higher ranks'],
    icon: '🎯',
  },
  {
    id: 'qlora',
    name: 'Quantized LoRA',
    shortName: 'QLoRA',
    description: 'Combines LoRA with 4-bit quantization. Enables 70B models on consumer GPUs.',
    trainableParams: '0.1-1%',
    memoryReduction: '90-95%',
    bestFor: ['Consumer hardware', 'Very large models', 'Cost-sensitive projects'],
    pros: ['Run 70B models on 24GB GPUs', 'Near-LoRA performance', 'Extremely cost-effective'],
    cons: ['Slight quality loss vs full precision', 'Quantization overhead', 'Some instability risks'],
    icon: '💾',
  },
  {
    id: 'dpo',
    name: 'Direct Preference Optimization',
    shortName: 'DPO',
    description: 'Align model outputs with human preferences without separate reward model. 2026 staple for alignment.',
    trainableParams: 'Varies',
    memoryReduction: 'Varies',
    bestFor: ['Safety alignment', 'Tone/style control', 'Helpfulness improvement'],
    pros: ['No reward model needed', 'Stable training', 'Matches RLHF performance', 'Efficient compute'],
    cons: ['Needs preference pairs', '~2.5x compute vs SFT', 'Quality of rankings matters'],
    icon: '⚖️',
  },
];

// LoRA rank configurations for the simulator
export interface LoraConfig {
  rank: number;
  trainableParams: number; // percentage
  vramUsage: number; // GB for 7B model
  trainingSpeed: number; // relative, 1.0 = baseline
  qualityScore: number; // 0-100
}

export const loraConfigs: LoraConfig[] = [
  { rank: 1, trainableParams: 0.01, vramUsage: 4.2, trainingSpeed: 1.5, qualityScore: 45 },
  { rank: 2, trainableParams: 0.02, vramUsage: 4.4, trainingSpeed: 1.45, qualityScore: 55 },
  { rank: 4, trainableParams: 0.04, vramUsage: 4.8, trainingSpeed: 1.4, qualityScore: 65 },
  { rank: 8, trainableParams: 0.08, vramUsage: 5.5, trainingSpeed: 1.3, qualityScore: 75 },
  { rank: 16, trainableParams: 0.16, vramUsage: 6.8, trainingSpeed: 1.15, qualityScore: 85 },
  { rank: 32, trainableParams: 0.32, vramUsage: 9.2, trainingSpeed: 1.0, qualityScore: 92 },
  { rank: 64, trainableParams: 0.64, vramUsage: 14.5, trainingSpeed: 0.85, qualityScore: 96 },
  { rank: 128, trainableParams: 1.28, vramUsage: 22.0, trainingSpeed: 0.7, qualityScore: 98 },
];

// Model size data for VRAM calculations
export interface ModelSizeData {
  params: string;
  paramsNum: number; // billions
  fullVram: number; // GB
  loraVram: number; // GB at rank 16
  qloraVram: number; // GB at rank 16
}

export const modelSizes: ModelSizeData[] = [
  { params: '1B', paramsNum: 1, fullVram: 4, loraVram: 2.5, qloraVram: 1.5 },
  { params: '3B', paramsNum: 3, fullVram: 12, loraVram: 5, qloraVram: 3 },
  { params: '7B', paramsNum: 7, fullVram: 28, loraVram: 10, qloraVram: 6 },
  { params: '13B', paramsNum: 13, fullVram: 52, loraVram: 18, qloraVram: 10 },
  { params: '34B', paramsNum: 34, fullVram: 136, loraVram: 45, qloraVram: 22 },
  { params: '70B', paramsNum: 70, fullVram: 280, loraVram: 90, qloraVram: 40 },
];

export const DATA_LAST_UPDATED = '2026-02';
