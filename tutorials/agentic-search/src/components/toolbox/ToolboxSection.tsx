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
          <div className="grid gap-3 sm:grid-cols-2 mt-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">📡</span>
              <div>
                <p className="font-semibold text-heading">Data Tools</p>
                <p className="text-xs text-muted">APIs, search engines, databases</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📊</span>
              <div>
                <p className="font-semibold text-heading">Analysis Tools</p>
                <p className="text-xs text-muted">Analytics, keyword research, CRM</p>
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
                <p className="font-semibold text-heading">Manifests</p>
                <p className="text-xs text-muted">Describe capabilities & parameters</p>
              </div>
            </div>
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
