import { motion } from 'framer-motion';
import type { Takeaway } from '../../data/takeaways';

interface TakeawayCardProps {
  takeaway: Takeaway;
  index: number;
}

/**
 * TakeawayCard
 * 
 * Displays a single key takeaway with icon, title, and description.
 * Animated entrance based on index for staggered effect.
 */
export function TakeawayCard({ takeaway, index }: TakeawayCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="panel-surface p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl shrink-0">
          {takeaway.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-text-primary mb-2">
            {takeaway.title}
          </h4>
          <p className="text-text-secondary leading-relaxed">
            {takeaway.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
