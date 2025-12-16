import { motion } from 'framer-motion';

interface SectionPreviewCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  delay?: number;
}

export function SectionPreviewCard({ 
  icon, 
  title, 
  description, 
  features, 
  delay = 0 
}: SectionPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="panel p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-heading mb-2">{title}</h3>
      <p className="text-body text-sm leading-relaxed mb-4">{description}</p>
      
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-accent mt-0.5">✓</span>
            <span className="text-body">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
