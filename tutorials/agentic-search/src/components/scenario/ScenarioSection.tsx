import { motion } from 'framer-motion';
import { ScenarioPlayer } from './ScenarioPlayer';

/**
 * Phase 4: Scenario Player
 * 
 * Shows a real-world agentic search workflow where an agent
 * helps plan Q4 content strategy for a bike shop by:
 * 1. Breaking down the goal
 * 2. Discovering and calling Trends API
 * 3. Discovering and calling Keyword Tool
 * 4. Analyzing competitors
 * 5. Refining based on data
 * 6. Synthesizing a complete content plan
 * 
 * Features:
 * - Step-by-step playback (manual or auto-play)
 * - Shows agent reasoning at each step
 * - Displays tool calls and data returned
 * - Highlights insights generated
 * - Traceability: trace final insights back to steps
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
              Let's see how an agentic system handles a real-world task: helping a bike shop 
              owner plan their Q4 content strategy. Watch as the agent:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Breaks down the goal into sub-tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Discovers and calls external tools (Trends API, Keyword Tool, Competitor Lens)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Iterates and refines based on data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary mt-1">•</span>
                <span>Synthesizes insights into an actionable plan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Highlight */}
        <div className="mt-6 panel-inset p-4 border-l-4 border-accent-primary">
          <p className="text-text-primary font-medium">
            💡 <span className="font-bold">Key Insight:</span> Notice how the agent makes 
            decisions at each step based on previous results. This is <span className="text-accent-primary font-semibold">agentic 
            search</span> — not just retrieving documents, but orchestrating a multi-step workflow 
            with reasoning, tool use, and iteration.
          </p>
        </div>
      </motion.div>

      {/* Scenario Player */}
      <ScenarioPlayer />
    </div>
  );
}
