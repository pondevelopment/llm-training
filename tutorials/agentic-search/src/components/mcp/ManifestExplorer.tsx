import { useState } from 'react';
import { motion } from 'framer-motion';

// Example MCP manifest from pon.bike
const exampleManifest = {
  name: 'pon-bike-mcp',
  version: '1.0.0',
  description: 'MCP server for Pon.bike product catalog and inventory',
  tools: [
    {
      name: 'searchProducts',
      description: 'Search bike products with filters',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: ['road', 'mountain', 'gravel', 'electric'] },
          maxPrice: { type: 'number' },
          brand: { type: 'string' },
          sortBy: { type: 'string', enum: ['price', 'rating', 'newest'] }
        }
      }
    },
    {
      name: 'getInventory',
      description: 'Check real-time inventory for specific models',
      inputSchema: {
        type: 'object',
        properties: {
          modelId: { type: 'string', required: true },
          zipCode: { type: 'string' }
        }
      }
    },
    {
      name: 'compareModels',
      description: 'Compare specifications of multiple bike models',
      inputSchema: {
        type: 'object',
        properties: {
          modelIds: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 }
        }
      }
    }
  ],
  authentication: {
    type: 'api-key',
    header: 'X-API-Key'
  },
  rateLimit: {
    requests: 100,
    period: '1m'
  }
};

interface TooltipInfo {
  field: string;
  title: string;
  description: string;
}

const tooltips: Record<string, TooltipInfo> = {
  name: {
    field: 'name',
    title: 'Server Name',
    description: 'Unique identifier for this MCP server. Agents use this to reference the server.'
  },
  version: {
    field: 'version',
    title: 'API Version',
    description: 'Semantic version of the API. Helps agents handle breaking changes.'
  },
  tools: {
    field: 'tools',
    title: 'Available Tools',
    description: 'List of callable functions with their schemas. Agents parse these to understand capabilities.'
  },
  inputSchema: {
    field: 'inputSchema',
    title: 'Input Schema',
    description: 'JSON Schema defining required and optional parameters. Validates agent requests.'
  },
  authentication: {
    field: 'authentication',
    title: 'Auth Requirements',
    description: 'How agents should authenticate. Common types: api-key, oauth2, bearer-token.'
  },
  rateLimit: {
    field: 'rateLimit',
    title: 'Rate Limiting',
    description: 'Request limits to prevent abuse. Agents should respect these constraints.'
  }
};

export function ManifestExplorer() {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set([0]));

  const toggleTool = (index: number) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTools(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="panel panel-info p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📋</div>
          <div>
            <h3 className="text-xl font-bold text-heading mb-2">
              Understanding MCP Manifests
            </h3>
            <p className="text-body text-sm leading-relaxed">
              An MCP manifest is like a menu that tells agents what "dishes" (tools) are available 
              and how to "order" them (parameters). Hover over field names to learn more.
            </p>
          </div>
        </div>
      </div>

      {/* Manifest Display */}
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h4 className="text-lg font-bold text-heading">
              Example: pon.bike/.well-known/mcp.json
            </h4>
          </div>
          <span className="chip chip-success text-xs">Live Endpoint</span>
        </div>

        <div className="bg-[var(--color-code-bg)] rounded-lg p-4 overflow-x-auto relative">
          <pre className="text-sm font-mono text-[var(--color-text)]">
            <code>
              {'{\n'}
              {'  '}
              <span
                className="cursor-help border-b-2 border-dotted border-accent/50"
                onMouseEnter={() => setHoveredField('name')}
                onMouseLeave={() => setHoveredField(null)}
              >
                "name"
              </span>
              {': "pon-bike-mcp",\n'}
              {'  '}
              <span
                className="cursor-help border-b-2 border-dotted border-accent/50"
                onMouseEnter={() => setHoveredField('version')}
                onMouseLeave={() => setHoveredField(null)}
              >
                "version"
              </span>
              {': "1.0.0",\n'}
              {'  "description": "MCP server for Pon.bike product catalog",\n'}
              {'  '}
              <span
                className="cursor-help border-b-2 border-dotted border-accent/50"
                onMouseEnter={() => setHoveredField('tools')}
                onMouseLeave={() => setHoveredField(null)}
              >
                "tools"
              </span>
              {': [...],  // 3 tools available\n'}
              {'  '}
              <span
                className="cursor-help border-b-2 border-dotted border-accent/50"
                onMouseEnter={() => setHoveredField('authentication')}
                onMouseLeave={() => setHoveredField(null)}
              >
                "authentication"
              </span>
              {': { "type": "api-key" },\n'}
              {'  '}
              <span
                className="cursor-help border-b-2 border-dotted border-accent/50"
                onMouseEnter={() => setHoveredField('rateLimit')}
                onMouseLeave={() => setHoveredField(null)}
              >
                "rateLimit"
              </span>
              {': { "requests": 100, "period": "1m" }\n'}
              {'}'}
            </code>
          </pre>

          {/* Tooltip */}
          {hoveredField && tooltips[hoveredField] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 max-w-xs panel panel-info p-3 shadow-lg z-10"
            >
              <p className="font-semibold text-heading text-sm mb-1">
                {tooltips[hoveredField].title}
              </p>
              <p className="text-body text-xs leading-relaxed">
                {tooltips[hoveredField].description}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tool Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-heading flex items-center gap-2">
          <span>🔧</span>
          <span>Available Tools (Click to expand)</span>
        </h4>

        {exampleManifest.tools.map((tool, index) => (
          <div key={index} className="panel p-4">
            <button
              onClick={() => toggleTool(index)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? '🔍' : index === 1 ? '📦' : '⚖️'}
                </span>
                <div>
                  <p className="font-semibold text-heading">
                    {tool.name}
                  </p>
                  <p className="text-xs text-muted">
                    {tool.description}
                  </p>
                </div>
              </div>
              <span className="text-2xl text-muted">
                {expandedTools.has(index) ? '▼' : '▶'}
              </span>
            </button>

            {expandedTools.has(index) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-divider"
              >
                <p className="text-xs font-semibold text-heading mb-2">
                  📋 Input Schema:
                </p>
                <div className="bg-[var(--color-code-bg)] rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-[var(--color-text)]">
                    {JSON.stringify(tool.inputSchema, null, 2)}
                  </pre>
                </div>

                {/* Example usage */}
                <div className="mt-3 panel panel-success p-3">
                  <p className="text-xs font-semibold text-heading mb-2">
                    💡 Example Agent Call:
                  </p>
                  <code className="text-xs font-mono text-body">
                    {index === 0 && 'searchProducts({ category: "road", maxPrice: 1500, sortBy: "rating" })'}
                    {index === 1 && 'getInventory({ modelId: "cannondale-caad-optimo", zipCode: "10001" })'}
                    {index === 2 && 'compareModels({ modelIds: ["cervelo-r2", "focus-izalco"] })'}
                  </code>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Key Takeaways */}
      <div className="panel panel-warning p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="text-lg font-bold text-heading mb-3">
              Why MCP Matters
            </h4>
            <ul className="space-y-2 text-sm text-body">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▸</span>
                <span><strong>Standardization:</strong> Agents don't need custom integration for every API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▸</span>
                <span><strong>Discoverability:</strong> .well-known convention makes tools easy to find</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▸</span>
                <span><strong>Self-Documenting:</strong> Schema tells agents exactly how to call each tool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">▸</span>
                <span><strong>Composability:</strong> Agents can chain multiple tools to solve complex tasks</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted italic p-4 bg-card-secondary rounded-lg">
        <strong>Note:</strong> This is a simplified example for educational purposes. 
        Real MCP manifests may include additional metadata like error schemas, webhook configurations, 
        pagination details, and more sophisticated authentication flows.
      </div>
    </div>
  );
}
