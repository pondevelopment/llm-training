// Small Language Models data
// Sources: Model documentation, benchmark papers, Together AI, Oxen.ai
// Last updated: February 2026
// Note: Performance vs GPT-4 is illustrative based on benchmark patterns.
// Inference speeds are approximate for A100 with standard settings.
// Cost estimates derived from Together AI/RunPod Feb 2026 rates.

export interface SLMModel {
  id: string;
  name: string;
  family: string;
  params: string;
  paramsNum: number; // billions
  contextWindow: string;
  contextNum: number; // thousands
  bestFor: string[];
  inferenceSpeed: number; // tokens/sec on A100 (approximate)
  costPerMToken: number; // $ per million tokens (Together AI Feb 2026)
  performanceVsGPT4: number; // percentage (illustrative)
  icon: string;
}

export const slmModels: SLMModel[] = [
  {
    id: 'gemini-3n',
    name: 'Gemini 3n E4B',
    family: 'Google',
    params: '~4B',
    paramsNum: 4,
    contextWindow: '128k',
    contextNum: 128,
    bestFor: ['On-device', 'Multimodal', 'Mobile apps'],
    inferenceSpeed: 180,
    costPerMToken: 0.04, // Google Vertex AI rate
    performanceVsGPT4: 52,
    icon: '🔷',
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    family: 'Microsoft',
    params: '3.8B',
    paramsNum: 3.8,
    contextWindow: '128k',
    contextNum: 128,
    bestFor: ['Privacy-first', 'Local reasoning', 'Edge deployment'],
    inferenceSpeed: 200,
    costPerMToken: 0.03, // Self-hosted estimate
    performanceVsGPT4: 48,
    icon: '🟢',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    family: 'Mistral AI',
    params: '7B',
    paramsNum: 7,
    contextWindow: '32k',
    contextNum: 32,
    bestFor: ['Enterprise chat', 'RAG systems', 'General tasks'],
    inferenceSpeed: 120,
    costPerMToken: 0.20, // Together AI: $0.20/M input
    performanceVsGPT4: 62, // Source: "over 60% of GPT-4 performance"
    icon: '🟠',
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    family: 'Meta',
    params: '3B',
    paramsNum: 3,
    contextWindow: '128k',
    contextNum: 128,
    bestFor: ['Mobile', 'Edge AI', 'Lightweight tasks'],
    inferenceSpeed: 220,
    costPerMToken: 0.06, // Together AI
    performanceVsGPT4: 45,
    icon: '🦙',
  },
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    family: 'Meta',
    params: '17B',
    paramsNum: 17,
    contextWindow: '128k',
    contextNum: 128,
    bestFor: ['Agentic apps', 'Coding', 'Complex reasoning'],
    inferenceSpeed: 85,
    costPerMToken: 0.18, // Together AI
    performanceVsGPT4: 75,
    icon: '🦙',
  },
  {
    id: 'qwen2.5-7b',
    name: 'Qwen 2.5 7B',
    family: 'Alibaba',
    params: '7B',
    paramsNum: 7,
    contextWindow: '128k',
    contextNum: 128,
    bestFor: ['Multilingual', 'Code generation', 'Enterprise'],
    inferenceSpeed: 115,
    costPerMToken: 0.07,
    performanceVsGPT4: 60,
    icon: '🔵',
  },
];

// Domain specialization examples
export interface DomainExample {
  id: string;
  domain: string;
  icon: string;
  description: string;
  benefits: string[];
  exampleModels: string[];
  keyMetric: string;
  improvement: string;
}

export const domainExamples: DomainExample[] = [
  {
    id: 'legal',
    domain: 'Legal',
    icon: '⚖️',
    description: 'Contract analysis, legal research, compliance checking',
    benefits: ['Understands legal terminology', 'Cites precedents accurately', 'Reduced hallucinations on case law'],
    exampleModels: ['Legal-BERT', 'CaseLaw-GPT'],
    keyMetric: 'Hallucination rate',
    improvement: '73% reduction',
  },
  {
    id: 'medical',
    domain: 'Medical',
    icon: '🏥',
    description: 'Diagnosis support, medical literature synthesis, patient communication',
    benefits: ['Clinical accuracy', 'Drug interaction awareness', 'HIPAA-compliant outputs'],
    exampleModels: ['Med-PaLM', 'BioMedLM'],
    keyMetric: 'Clinical accuracy',
    improvement: '89% vs 67% baseline',
  },
  {
    id: 'finance',
    domain: 'Finance',
    icon: '💹',
    description: 'Fraud detection, credit scoring, market analysis',
    benefits: ['Real-time processing', 'Regulatory compliance', 'Private deployment'],
    exampleModels: ['BloombergGPT', 'FinBERT'],
    keyMetric: 'Fraud detection F1',
    improvement: '0.94 vs 0.81',
  },
  {
    id: 'code',
    domain: 'Code',
    icon: '💻',
    description: 'Code completion, bug detection, documentation generation',
    benefits: ['Language-specific patterns', 'Framework awareness', 'Security scanning'],
    exampleModels: ['CodeLlama', 'StarCoder'],
    keyMetric: 'Pass@1 HumanEval',
    improvement: '67% vs 48%',
  },
];

// Cost comparison data
// GPT-4 pricing: ~$30/M tokens (input+output blended)
// SLM pricing: Based on Together AI Feb 2026 rates
export interface CostComparison {
  model: string;
  monthlyTokens: number; // millions
  gpt4Cost: number;
  slmCost: number;
  savings: number; // percentage
}

export const costComparisons: CostComparison[] = [
  // Mistral 7B at $0.20/M tokens
  { model: 'Mistral 7B', monthlyTokens: 10, gpt4Cost: 300, slmCost: 2, savings: 99 },
  { model: 'Mistral 7B', monthlyTokens: 100, gpt4Cost: 3000, slmCost: 20, savings: 99 },
  // Llama 4 Scout at $0.18/M tokens
  { model: 'Llama 4 Scout', monthlyTokens: 10, gpt4Cost: 300, slmCost: 1.8, savings: 99 },
  { model: 'Llama 4 Scout', monthlyTokens: 100, gpt4Cost: 3000, slmCost: 18, savings: 99 },
];

export const DATA_LAST_UPDATED = '2026-02';
