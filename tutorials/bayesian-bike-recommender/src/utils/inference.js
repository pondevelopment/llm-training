import { infer } from 'bayesjs';
import { bikeNetwork } from '../data/bayesianNetwork';

// Default assumptions for unset input variables
// These represent "typical" user profiles to make inference more meaningful
const defaultAssumptions = {
  TERRAIN: 'ROAD',           // Most users ride on roads/paved paths
  PHYSICAL_CONDITION: 'AVERAGE', // Assume average fitness unless specified
  EXPERIENCE: 'INTERMEDIATE',    // Assume some experience
};

// Compute posteriors for all nodes given evidence
export function computePosteriors(evidence = {}) {
  const posteriors = {};
  
  // Apply soft defaults for unset input variables to improve inference
  // This prevents the "everything is equal" problem when partial evidence is given
  const enhancedEvidence = { ...evidence };
  
  // Only apply defaults if user has provided SOME evidence (not initial state)
  // and the variable isn't already set
  if (Object.keys(evidence).length > 0) {
    for (const [key, defaultValue] of Object.entries(defaultAssumptions)) {
      if (!(key in enhancedEvidence)) {
        enhancedEvidence[key] = defaultValue;
      }
    }
  }

  // Get posteriors for each node
  for (const nodeId of Object.keys(bikeNetwork)) {
    const node = bikeNetwork[nodeId];
    posteriors[nodeId] = {};

    // For each possible state of this node
    for (const state of node.states) {
      try {
        // Compute P(node=state | evidence)
        // bayesjs API: infer(network, nodeQuery, givenEvidence)
        const result = infer(bikeNetwork, { [nodeId]: state }, enhancedEvidence);
        posteriors[nodeId][state] = result;
      } catch (e) {
        // If inference fails, use prior
        console.warn(`Inference failed for ${nodeId}=${state}:`, e.message);
        posteriors[nodeId][state] = 1 / node.states.length;
      }
    }

    // Normalize to sum to 1
    const sum = Object.values(posteriors[nodeId]).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      for (const state of node.states) {
        posteriors[nodeId][state] /= sum;
      }
    }
  }

  return posteriors;
}

// Get the prior probabilities (no evidence)
export function getPriors() {
  return computePosteriors({});
}

// Get the most likely state for each node
export function getMostLikelyStates(posteriors) {
  const mostLikely = {};

  for (const [nodeId, probs] of Object.entries(posteriors)) {
    let maxProb = 0;
    let maxState = null;

    for (const [state, prob] of Object.entries(probs)) {
      if (prob > maxProb) {
        maxProb = prob;
        maxState = state;
      }
    }

    mostLikely[nodeId] = { state: maxState, probability: maxProb };
  }

  return mostLikely;
}
