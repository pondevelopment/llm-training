import { motion } from 'framer-motion';
import type { Tool } from '../../data/tools';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <motion.button
      onClick={() => onClick(tool)}
      className="panel p-6 text-left w-full transition-all hover:scale-[1.02] hover:shadow-lg"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <div className="text-5xl mb-4">{tool.icon}</div>

      {/* Name */}
      <h3 className="text-xl font-bold text-heading mb-2">{tool.name}</h3>

      {/* Description */}
      <p className="text-body text-sm leading-relaxed mb-4">
        {tool.description}
      </p>

      {/* Capabilities Badge */}
      <div className="flex items-center gap-2 text-xs">
        <span className="chip chip-info">
          {tool.capabilities.length} capabilities
        </span>
        {tool.manifestSnippet && (
          <span className="text-[var(--color-muted)] flex items-center gap-1">
            <span>📋</span>
            <span>Has manifest</span>
          </span>
        )}
      </div>
    </motion.button>
  );
}
