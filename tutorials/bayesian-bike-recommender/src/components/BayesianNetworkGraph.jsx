import { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { networkNodes, networkEdges, stateLabels } from '../data/bayesianNetwork';

export default function BayesianNetworkGraph({ posteriors, evidence }) {
  const cyRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Convert to Cytoscape format
  const elements = [
    // Nodes
    ...networkNodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        group: node.group,
        hasEvidence: evidence && evidence[node.id] !== undefined,
      },
      position: { x: node.x * 1.5, y: node.y * 0.8 },
    })),
    // Edges
    ...networkEdges.map((edge, i) => ({
      data: {
        id: `edge-${i}`,
        source: edge.source,
        target: edge.target,
      },
    })),
  ];

  // Get color based on posterior probability
  const getNodeColor = (nodeId) => {
    if (evidence && evidence[nodeId]) {
      return '#22c55e'; // Green for observed evidence
    }
    
    const group = networkNodes.find(n => n.id === nodeId)?.group;
    
    if (group === 'input') return '#3b82f6'; // Blue for input nodes
    if (group === 'inferred') return '#f59e0b'; // Amber for inferred
    if (group === 'output') return '#8b5cf6'; // Purple for output
    return '#64748b';
  };

  const stylesheet = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': (ele) => getNodeColor(ele.id()),
        'color': '#fff',
        'font-size': '11px',
        'font-weight': '500',
        'width': '90px',
        'height': '50px',
        'shape': 'roundrectangle',
        'border-width': (ele) => ele.data('hasEvidence') ? 3 : 1,
        'border-color': (ele) => ele.data('hasEvidence') ? '#22c55e' : '#475569',
        'padding': '8px',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#475569',
        'target-arrow-color': '#475569',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 0.8,
      },
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'border-color': '#fff',
      },
    },
  ];

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on('tap', 'node', (event) => {
        setSelectedNode(event.target.id());
      });

      cyRef.current.on('tap', (event) => {
        if (event.target === cyRef.current) {
          setSelectedNode(null);
        }
      });
    }
  }, []);

  // Format probabilities for display
  const formatProbs = (nodeId) => {
    if (!posteriors || !posteriors[nodeId]) return null;
    
    const probs = posteriors[nodeId];
    const labels = stateLabels[nodeId] || {};
    
    return Object.entries(probs)
      .sort((a, b) => b[1] - a[1])
      .map(([state, prob]) => ({
        state,
        label: labels[state] || state,
        prob: prob * 100,
      }));
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-xl border border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          Bayesian Network
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Watch beliefs update as you provide preferences
        </p>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b border-slate-700 flex gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500"></span>
          <span className="text-slate-400">Input</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-500"></span>
          <span className="text-slate-400">Inferred</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-purple-500"></span>
          <span className="text-slate-400">Output</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-2 border-green-500"></span>
          <span className="text-slate-400">Evidence set</span>
        </span>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <CytoscapeComponent
          elements={elements}
          stylesheet={stylesheet}
          cy={(cy) => { cyRef.current = cy; }}
          style={{ width: '100%', height: '100%' }}
          layout={{ name: 'preset' }}
          userZoomingEnabled={false}
          userPanningEnabled={true}
          boxSelectionEnabled={false}
        />

        {/* Node detail popup */}
        {selectedNode && posteriors && posteriors[selectedNode] && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900 rounded-lg p-4 border border-slate-600 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white">
                {networkNodes.find(n => n.id === selectedNode)?.label || selectedNode}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {formatProbs(selectedNode)?.map(({ state, label, prob }) => (
                <div key={state} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-slate-400 truncate" title={label}>
                    {label}
                  </div>
                  <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 prob-bar transition-all duration-500"
                      style={{ width: `${prob}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-xs text-slate-300">
                    {prob.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
