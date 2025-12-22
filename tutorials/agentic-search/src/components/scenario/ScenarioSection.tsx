import { motion } from 'framer-motion';
import { ScenarioPlayer } from './ScenarioPlayer';

/**
 * Phase 4: Scenario Player
 * 
 * Shows real-world customer-facing agentic search workflows:
 * - Buying the right bike for specific needs
 * - Booking a test ride at nearby store
 * - Getting company information and support
 * - Finding accessories for their setup
 * 
 * Features:
 * - Step-by-step navigation
 * - Shows agent reasoning at each step
 * - Displays tool calls and data returned
 * - Highlights insights generated
 * - Multiple customer journey scenarios
 */
export function ScenarioSection() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="panel-surface p-8"
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl">🎬</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Watch Agentic Search in Action
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Experience how an agentic system helps real customers find exactly what they need. 
              Watch as the agent assists with common customer tasks like buying a bike, booking a test ride, 
              or getting support. See how it:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Understands customer needs and constraints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Searches products, checks inventory, and compares options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Books appointments and finds nearby locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Delivers personalized recommendations with clear reasoning</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transition to Next Section */}
        <div className="mt-6 panel-inset p-4 border-l-4 border-accent-primary">
          <p className="text-text-primary font-medium">
            👀 <span className="font-bold">Watch for:</span> As you step through each scenario, 
            notice the <span className="text-accent-primary font-semibold">tool calls</span> the agent makes. 
            You learned about these tools in the previous section—now see them working together 
            to solve real customer problems.
          </p>
        </div>

        {/* Ecommerce Micro-Case */}
        <div className="mt-4 panel-inset p-4 border-l-4 border-accent-primary">
          <p className="text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Ecommerce translation:</strong> the “bike shop” scenarios are a stand-in for any product catalog.
            The same flow applies to apparel, electronics, beauty, or B2B ordering: interpret needs → fetch structured product data → check constraints
            (inventory, shipping, policies) → explain a shortlist.
          </p>
        </div>
      </motion.div>

      {/* Scenario Player */}
      <ScenarioPlayer />
    </div>
  );
}
