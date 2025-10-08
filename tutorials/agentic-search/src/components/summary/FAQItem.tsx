import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FAQItem } from '../../data/faqData';

interface FAQItemComponentProps {
  item: FAQItem;
  index: number;
}

/**
 * FAQItemComponent
 * 
 * Single collapsible FAQ item with smooth expand/collapse animation.
 * Clicking the question toggles the answer visibility.
 */
export function FAQItemComponent({ item, index }: FAQItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="panel-surface overflow-hidden"
    >
      {/* Question (Clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="text-accent-primary font-bold text-lg shrink-0">
            Q{item.id}
          </span>
          <h4 className="text-lg font-semibold text-text-primary">
            {item.question}
          </h4>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl text-accent-primary shrink-0"
        >
          ⌄
        </motion.div>
      </button>

      {/* Answer (Expandable) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-border-primary">
              <div className="flex items-start gap-3">
                <span className="text-accent-secondary font-bold text-lg shrink-0">
                  A
                </span>
                <p className="text-text-secondary leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
