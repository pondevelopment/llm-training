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
      </motion.div>

      {/* Scenario Player */}
      <ScenarioPlayer />

      {/* Transition to Next Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="panel-surface p-6 border-l-4 border-accent-primary"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔮</div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-text-primary mb-2">
              Coming Up Next: How Agents Discover These Tools
            </h4>
            <p className="text-text-secondary leading-relaxed">
              You just watched agents call tools like <code className="px-2 py-0.5 bg-surface-secondary rounded text-accent-primary text-sm">product-search</code> and{' '}
              <code className="px-2 py-0.5 bg-surface-secondary rounded text-accent-primary text-sm">inventory-check</code>. 
              But how did the agent <em>know</em> these tools existed? How did it learn what parameters to send?
            </p>
            <p className="text-text-secondary leading-relaxed mt-2">
              <strong className="text-text-primary">Next section:</strong> Discover the <strong>Model Context Protocol (MCP)</strong>—the 
              standard that lets agents dynamically find and use tools without hardcoded integrations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
