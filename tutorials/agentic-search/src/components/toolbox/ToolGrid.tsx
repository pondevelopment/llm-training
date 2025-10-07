import { ToolCard } from './ToolCard';
import type { Tool } from '../../data/tools';

interface ToolGridProps {
  tools: Tool[];
  onToolClick: (tool: Tool) => void;
}

export function ToolGrid({ tools, onToolClick }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard 
          key={tool.id} 
          tool={tool} 
          onClick={onToolClick}
        />
      ))}
    </div>
  );
}
