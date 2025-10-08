import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Tool } from '../../data/tools';

interface ToolModalProps {
  tool: Tool;
  onClose: () => void;
}

export function ToolModal({ tool, onClose }: ToolModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Container - Flexbox Centering */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          className="w-full max-w-3xl max-h-[90vh] pointer-events-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
        <div className="panel h-full overflow-y-auto">
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{tool.icon}</div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-heading">
                    {tool.name}
                  </h2>
                  <p className="text-body mt-1">{tool.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-3xl hover:scale-110 transition-transform text-[var(--color-muted)] hover:text-[var(--color-text)]"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Detailed Description */}
            {tool.detailedDescription && (
              <div className="panel panel-info p-4">
                <p className="text-body leading-relaxed">{tool.detailedDescription}</p>
              </div>
            )}

            {/* Use Cases */}
            {tool.useCases && tool.useCases.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>Practical Use Cases</span>
                </h3>
                <ul className="space-y-2">
                  {tool.useCases.map((useCase, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-body"
                    >
                      <span className="text-[var(--color-success)] mt-1">✓</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Capabilities */}
            <div>
              <h3 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                <span>⚡</span>
                <span>Capabilities</span>
              </h3>
              <ul className="space-y-2">
                {tool.capabilities.map((capability, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-body"
                  >
                    <span className="text-[var(--color-primary)] mt-1">▸</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example Output */}
            {tool.exampleOutput && (
              <div>
                <h3 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                  <span>📊</span>
                  <span>Example Output</span>
                </h3>
                <div className="panel panel-info p-4">
                  <pre className="text-sm text-body whitespace-pre-wrap font-mono">
                    {tool.exampleOutput}
                  </pre>
                </div>
              </div>
            )}

            {/* Manifest Snippet */}
            {tool.manifestSnippet && (
              <div>
                <h3 className="text-xl font-bold text-heading mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>Manifest Snippet</span>
                </h3>
                <div className="bg-[var(--color-code-bg)] rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-[var(--color-text)]">
                    {JSON.stringify(tool.manifestSnippet, null, 2)}
                  </pre>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-2">
                  💡 This is a simplified example. Real manifests may include additional metadata 
                  like authentication schemes, rate limits, and detailed parameter schemas.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
              <button
                onClick={onClose}
                className="btn-secondary w-full py-2 px-4 rounded-lg font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </AnimatePresence>
  );
}
