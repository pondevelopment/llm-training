import { useState } from 'react';
import { ToolGrid } from './ToolGrid';
import { ToolModal } from './ToolModal';
import { tools } from '../../data/tools';
import type { Tool } from '../../data/tools';

export function ToolboxSection() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  return (
    <section id="toolbox" className="space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
          The Agent's Toolbox
        </h2>
        <p className="text-lg text-body leading-relaxed">
          Agents extend their capabilities by connecting to tools and APIs. 
          Click any tool to see what it can do and how agents discover it.
        </p>
      </div>

      {/* What Are Tools? */}
      <div className="panel p-6 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-heading mb-3">Understanding Agent Tools</h3>
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>
            <strong>Tools are external capabilities</strong> that agents can use—like APIs, databases, 
            or search engines. Unlike traditional search (which just returns links), agents can actively 
            <em> call these tools</em> to gather data, analyze information, and take actions.
          </p>
          <p>
            <strong>The challenge:</strong> How does an agent discover what tools are available? 
            Traditional APIs require hardcoded integrations. But with <strong>Model Context Protocol (MCP)</strong>, 
            agents can dynamically discover tools, read their capabilities, and learn how to use them—all 
            automatically. We'll explore MCP in detail in Section 3.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">📡</span>
              <div>
                <p className="font-semibold text-heading">Data Tools</p>
                <p className="text-xs text-muted">APIs, search engines, product databases</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="font-semibold text-heading">Analysis Tools</p>
                <p className="text-xs text-muted">Analytics, reviews, comparisons</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔍</span>
              <div>
                <p className="font-semibold text-heading">Discovery via MCP</p>
                <p className="text-xs text-muted">Agents find tools automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📋</span>
              <div>
                <p className="font-semibold text-heading">Tool Manifests</p>
                <p className="text-xs text-muted">Describe capabilities & parameters</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecommerce Micro-Case */}
      <div className="panel panel-warning p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🛍️</div>
          <div>
            <h3 className="text-lg font-bold text-heading mb-2">Ecommerce micro-case: one question → many tool calls</h3>
            <p className="text-body text-sm leading-relaxed mb-3">
              Customer asks: <strong>“Which carry-on fits airline rules and has easy returns?”</strong>.
              A useful agent typically needs multiple tools—not just web search.
            </p>
            <ul className="text-xs text-body space-y-1">
              <li>• Catalog/variant lookup (dimensions, weights, materials)</li>
              <li>• Policy lookup (returns window, free returns, restocking fees)</li>
              <li>• Review summarization (durability complaints, zipper failures)</li>
              <li>• Inventory + ship dates (can it arrive before a trip?)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tool Grid */}
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm text-muted mb-6">
          👇 Click any tool below to explore its capabilities and manifest
        </p>
        <ToolGrid tools={tools} onToolClick={handleToolClick} />
      </div>

      {/* Info Panel */}
      <div className="panel panel-info p-6 max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔌</div>
          <div>
            <h3 className="text-lg font-bold text-heading mb-2">How It Works</h3>
            <p className="text-body leading-relaxed">
              Each tool exposes specific capabilities through a <strong>manifest</strong> that 
              describes what functions it offers and what parameters they need. Agents read these 
              manifests to understand what each tool can do, then call the right functions to 
              accomplish their goals.
            </p>
          </div>
        </div>
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal 
          tool={selectedTool} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  );
}
