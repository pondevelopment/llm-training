// Catastrophic forgetting data
// Sources: Research papers (arXiv, NeurIPS 2025, EMNLP 2025)
// Last updated: February 2026

export interface ForgettingDataPoint {
  epoch: number;
  domainKnowledge: number; // FG score (higher = more forgetting)
  reasoning: number;
  readingComprehension: number;
  taskPerformance: number; // target task accuracy
}

// Baseline forgetting curve without mitigation
export const baselineForgetting: ForgettingDataPoint[] = [
  { epoch: 0, domainKnowledge: 0, reasoning: 0, readingComprehension: 0, taskPerformance: 10 },
  { epoch: 1, domainKnowledge: 2, reasoning: 1, readingComprehension: 2, taskPerformance: 35 },
  { epoch: 2, domainKnowledge: 5, reasoning: 4, readingComprehension: 6, taskPerformance: 55 },
  { epoch: 3, domainKnowledge: 15, reasoning: 12, readingComprehension: 18, taskPerformance: 72 },
  { epoch: 4, domainKnowledge: 28, reasoning: 24, readingComprehension: 32, taskPerformance: 82 },
  { epoch: 5, domainKnowledge: 42, reasoning: 38, readingComprehension: 48, taskPerformance: 88 },
  { epoch: 6, domainKnowledge: 55, reasoning: 50, readingComprehension: 60, taskPerformance: 91 },
  { epoch: 7, domainKnowledge: 65, reasoning: 60, readingComprehension: 70, taskPerformance: 93 },
  { epoch: 8, domainKnowledge: 72, reasoning: 68, readingComprehension: 76, taskPerformance: 94 },
  { epoch: 9, domainKnowledge: 78, reasoning: 74, readingComprehension: 81, taskPerformance: 94.5 },
  { epoch: 10, domainKnowledge: 82, reasoning: 78, readingComprehension: 85, taskPerformance: 95 },
];

export interface MitigationTechnique {
  id: string;
  name: string;
  shortName: string;
  description: string;
  mechanism: string;
  forgettingReduction: number; // percentage reduction vs baseline
  taskRetention: number; // percentage of task performance retained
  computeOverhead: string;
  icon: string;
  pros: string[];
  cons: string[];
}

export const mitigationTechniques: MitigationTechnique[] = [
  {
    id: 'none',
    name: 'No Mitigation (Baseline)',
    shortName: 'Baseline',
    description: 'Standard fine-tuning without any forgetting mitigation. This is the typical approach where you simply train on your new task data. While it achieves high task performance quickly, it often causes severe knowledge loss—especially after epoch 3-5 when the model starts "overwriting" general capabilities with task-specific patterns.',
    mechanism: 'Direct gradient updates on all parameters, no protection for general knowledge.',
    forgettingReduction: 0,
    taskRetention: 100,
    computeOverhead: 'None',
    icon: '📉',
    pros: ['Simplest to implement', 'Fastest training', 'Maximum task performance'],
    cons: ['Severe knowledge loss', 'Poor generalization', 'Model becomes overly specialized'],
  },
  {
    id: 'stm',
    name: 'Selective Token Masking',
    shortName: 'STM',
    description: 'Masks high-perplexity tokens during fine-tuning to preserve general knowledge. When the model encounters a token it finds "surprising" (high perplexity), STM excludes that token from gradient updates. The intuition: if the model already struggles with a token, forcing new task learning through it risks damaging existing knowledge. This is lightweight and easy to implement.',
    mechanism: 'Calculates per-token perplexity, masks tokens above threshold from loss computation. Preserves learning signal for familiar tokens while protecting uncertain predictions.',
    forgettingReduction: 65,
    taskRetention: 94,
    computeOverhead: '+15%',
    icon: '🎭',
    pros: ['Low compute overhead', 'Easy to implement', 'Works with any architecture'],
    cons: ['Moderate forgetting reduction', 'Threshold tuning required', 'Less effective for domain shift'],
  },
  {
    id: 'fapm',
    name: 'Forgetting-aware Pruning',
    shortName: 'FAPM',
    description: 'Surgically identifies and protects parameters crucial for general capabilities. FAPM computes the "task vector" (difference between fine-tuned and original weights), then analyzes which parameter changes hurt general performance. It prunes harmful changes while keeping beneficial ones—achieving near-perfect task retention with minimal forgetting. Best balance of preservation and performance.',
    mechanism: 'Computes Δweights = W_finetuned - W_original. Identifies Δ components that decrease general benchmark scores. Zeroes out harmful components while retaining task-beneficial ones.',
    forgettingReduction: 85,
    taskRetention: 99.67,
    computeOverhead: '+25%',
    icon: '✂️',
    pros: ['Best preservation-performance balance', 'Near-perfect task retention', 'No model size increase'],
    cons: ['Requires evaluation on general benchmarks', 'More complex implementation', 'Post-hoc analysis needed'],
  },
  {
    id: 'pnn',
    name: 'Progressive Neural Networks',
    shortName: 'PNN',
    description: 'Grows the network with new branches for each task while completely freezing previous parameters. Original weights never change, so original capabilities are perfectly preserved. New "columns" of neurons handle new tasks, with lateral connections to access old knowledge. Eliminates forgetting entirely but increases model size with each task.',
    mechanism: 'Freezes all original parameters. Adds new neural network columns with lateral connections to existing frozen layers. New learning happens only in new parameters.',
    forgettingReduction: 95,
    taskRetention: 92,
    computeOverhead: '+50% params',
    icon: '🌳',
    pros: ['Near-zero forgetting', 'Perfect knowledge preservation', 'Theoretically sound'],
    cons: ['Model size grows with each task', 'Higher inference cost', 'Complex architecture changes'],
  },
  {
    id: 'rehearsal',
    name: 'Experience Rehearsal',
    shortName: 'Rehearsal',
    description: 'Mixes original pretraining-style data with your fine-tuning data during training. By periodically "rehearsing" general knowledge examples, the model maintains broad capabilities while learning new tasks. Simple to implement if you have access to diverse data. Trade-off: requires curating a rehearsal dataset and increases training time.',
    mechanism: 'Each training batch contains mix of new task data and samples from general distribution (e.g., 80% task, 20% general). Gradients from both sources update the model simultaneously.',
    forgettingReduction: 70,
    taskRetention: 96,
    computeOverhead: '+30%',
    icon: '🔄',
    pros: ['Conceptually simple', 'Good retention of both old and new', 'Works with any training setup'],
    cons: ['Requires access to pretraining-style data', 'Longer training time', 'Data curation effort'],
  },
];

// Calculate mitigated forgetting curve
export function getMitigatedForgetting(
  techniqueId: string
): ForgettingDataPoint[] {
  const technique = mitigationTechniques.find(t => t.id === techniqueId);
  if (!technique || techniqueId === 'none') {
    return baselineForgetting;
  }

  const reductionFactor = 1 - technique.forgettingReduction / 100;
  const taskFactor = technique.taskRetention / 100;

  return baselineForgetting.map(point => ({
    epoch: point.epoch,
    domainKnowledge: Math.round(point.domainKnowledge * reductionFactor),
    reasoning: Math.round(point.reasoning * reductionFactor),
    readingComprehension: Math.round(point.readingComprehension * reductionFactor),
    taskPerformance: Math.round(point.taskPerformance * taskFactor * 10) / 10,
  }));
}

// Forgetting phases explanation
export interface ForgettingPhase {
  name: string;
  epochRange: string;
  description: string;
  mechanism: string;
}

export const forgettingPhases: ForgettingPhase[] = [
  {
    name: 'Stability Phase',
    epochRange: '0-2',
    description: 'Model explores new task with minimal impact on existing knowledge.',
    mechanism: 'Gradient updates are small and distributed; no concentrated disruption.',
  },
  {
    name: 'Acceleration Phase',
    epochRange: '3-5',
    description: 'Forgetting accelerates dramatically as model optimizes for new objective.',
    mechanism: 'Gradient interference disrupts attention patterns; representational drift begins.',
  },
  {
    name: 'Saturation Phase',
    epochRange: '6+',
    description: 'Forgetting rate slows as model converges; damage is largely done.',
    mechanism: 'Loss landscape around original solutions flattens; recovery becomes difficult.',
  },
];

export const DATA_LAST_UPDATED = '2026-02';
