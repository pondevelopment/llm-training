import { useState } from 'react';
import { DiscoverySimulator } from './DiscoverySimulator';
import { ManifestExplorer } from './ManifestExplorer';

type TabType = 'discovery' | 'manifest';

export function MCPSection() {
  const [activeTab, setActiveTab] = useState<TabType>('discovery');

  return (
    <section id="mcp" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
          MCP & Tool Discovery
        </h2>
        <p className="text-lg text-body leading-relaxed">
          Learn how agents discover and use tools through the Model Context Protocol (MCP) 
          and the .well-known convention.
        </p>
      </div>

      {/* What is MCP Panel */}
      <div className="panel panel-info p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🤝</div>
          <div>
            <h3 className="text-xl font-bold text-heading mb-3">
              What is MCP?
            </h3>
            <p className="text-body leading-relaxed mb-3">
              <strong>Model Context Protocol (MCP)</strong> is a standardized way for AI agents 
              to discover and interact with external tools and APIs. Think of it as a universal 
              "language" that lets agents understand what tools are available and how to use them—without 
              needing custom code for every integration.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-accent font-bold">🔍</span>
                <p>
                  <strong>Discovery:</strong> Agents check <code className="text-xs bg-card-secondary px-2 py-1 rounded">/.well-known/mcp.json</code> to find available tools
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent font-bold">📋</span>
                <p>
                  <strong>Schema:</strong> Each tool includes a JSON schema describing inputs and outputs
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent font-bold">⚡</span>
                <p>
                  <strong>Execution:</strong> Agents call tools programmatically based on the manifest
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('discovery')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'discovery'
              ? 'bg-accent text-white shadow-lg scale-105'
              : 'bg-card-secondary text-body hover:bg-card-tertiary'
          }`}
        >
          🔍 Discovery Flow
        </button>
        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'manifest'
              ? 'bg-accent text-white shadow-lg scale-105'
              : 'bg-card-secondary text-body hover:bg-card-tertiary'
          }`}
        >
          📋 Manifest Explorer
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'discovery' && (
          <div>
            <div className="panel p-6 mb-4">
              <h3 className="text-lg font-bold text-heading mb-2 flex items-center gap-2">
                <span>🎬</span>
                <span>How Agents Discover Tools</span>
              </h3>
              <p className="text-body text-sm leading-relaxed">
                Watch step-by-step as an agent discovers the pon.bike MCP server, 
                fetches the manifest, and learns what tools are available. 
                Click "Play Auto" to see the full flow, or step through manually.
              </p>
            </div>
            <DiscoverySimulator />
          </div>
        )}

        {activeTab === 'manifest' && <ManifestExplorer />}
      </div>

      {/* .well-known Convention */}
      <div className="panel panel-warning p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📍</div>
          <div>
            <h3 className="text-xl font-bold text-heading mb-3">
              The .well-known Convention
            </h3>
            <p className="text-body leading-relaxed mb-3">
              The <code className="text-sm bg-card-secondary px-2 py-1 rounded">/.well-known/</code> path 
              is a web standard (RFC 8615) for hosting metadata and configuration files. 
              It's like a "front desk" where services publish information that's meant to be easily discovered.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">✅</span>
                <span>
                  <strong>Predictable:</strong> Agents always know where to look: <code className="text-xs bg-card-secondary px-2 py-1 rounded">https://domain.com/.well-known/mcp.json</code>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">✅</span>
                <span>
                  <strong>Standard:</strong> Used by many protocols (OpenID, security.txt, change-password, etc.)
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-accent font-bold">✅</span>
                <span>
                  <strong>Cacheable:</strong> Manifests can be cached, reducing repeated lookups
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className="panel p-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
          <span>🌍</span>
          <span>Real-World MCP Examples</span>
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="panel panel-info p-4">
            <p className="font-semibold text-heading text-sm mb-2">🚴 E-commerce (pon.bike)</p>
            <ul className="text-xs text-body space-y-1">
              <li>• Product search & filters</li>
              <li>• Inventory availability</li>
              <li>• Model comparisons</li>
            </ul>
          </div>
          <div className="panel panel-info p-4">
            <p className="font-semibold text-heading text-sm mb-2">📊 Analytics Platforms</p>
            <ul className="text-xs text-body space-y-1">
              <li>• Traffic metrics</li>
              <li>• Conversion tracking</li>
              <li>• A/B test results</li>
            </ul>
          </div>
          <div className="panel panel-info p-4">
            <p className="font-semibold text-heading text-sm mb-2">💼 CRM Systems</p>
            <ul className="text-xs text-body space-y-1">
              <li>• Customer profiles</li>
              <li>• Sales pipeline data</li>
              <li>• Activity timelines</li>
            </ul>
          </div>
          <div className="panel panel-info p-4">
            <p className="font-semibold text-heading text-sm mb-2">📰 Content APIs</p>
            <ul className="text-xs text-body space-y-1">
              <li>• Article search</li>
              <li>• Publishing workflows</li>
              <li>• Media assets</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
