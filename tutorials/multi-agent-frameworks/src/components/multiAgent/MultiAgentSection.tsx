import { Panel } from '../shared/Panel';
import {
  AGENTS_COMPANION_CITATION,
  AGENTS_COMPANION_SOURCE_URL,
  SCALING_AGENT_SYSTEMS_PAPER_CITATION,
  SCALING_AGENT_SYSTEMS_PAPER_URL,
} from '../../data/sources';

export function MultiAgentSection() {
  return (
    <div className="space-y-6">
      <div className="panel panel-info p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">🤝 Multi-agent context: who sees what, when</h2>
        <p className="text-body">
          Multi-agent systems can amplify context bloat.
          If every agent forwards full history to every sub-agent, token usage explodes and specialists get distracted.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">Pattern 1: Agents-as-tools</h3>
          <p className="text-body">
            Treat a specialist agent like a function call: pass only the narrow input and artifacts it needs,
            get a result back, and continue.
          </p>
        </Panel>

        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">Pattern 2: Agent transfer</h3>
          <p className="text-body">
            Hand off control to a sub-agent to continue the workflow. Use explicit scoping rules so the callee inherits
            only the relevant slice of context.
          </p>
        </Panel>
      </div>

      <Panel variant="warning" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Translation during handoff</h3>
        <p className="text-body">
          When transferring, the framework may need to reframe prior agent messages so the new agent doesn’t assume
          it performed those past actions.
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Narrative casting</span>: recast prior assistant messages as “for context” notes</li>
          <li><span className="font-semibold">Action attribution</span>: tag/summarize tool calls so the new agent won’t misattribute execution</li>
        </ul>
        <p className="text-sm text-muted">
          Practical knob: handoffs often support “include full contents” vs “none/minimal” history transfer.
          Defaulting to minimal reduces context explosion.
        </p>
      </Panel>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">AgentOps: measure success beyond “good answers”</h3>
        <p className="text-body">
          In production, treat the agent like any other system: define success, instrument it, and monitor regressions.
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">North-star metric</span>: business impact (e.g., task completion, revenue proxy, time saved)</li>
          <li><span className="font-semibold">Agent KPIs</span>: goal completion rate, attempts vs successes, latency, errors</li>
          <li><span className="font-semibold">Human feedback</span>: simple thumbs up/down is already a strong signal</li>
          <li><span className="font-semibold">Traces</span>: keep step-by-step traces to debug when metrics drift</li>
        </ul>
        <p className="text-sm text-muted">
          Source:{' '}
          <a className="link-primary hover:underline" href={AGENTS_COMPANION_SOURCE_URL} target="_blank" rel="noreferrer">
            {AGENTS_COMPANION_CITATION} ↗
          </a>
        </p>
      </Panel>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Evaluate the trajectory, not only the final output</h3>
        <p className="text-body">
          For agents, it’s often more informative to evaluate the <span className="font-semibold">path</span> (tool use + decisions)
          than just grading the final response.
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Capabilities</span>: does the agent follow instructions and reason coherently?</li>
          <li><span className="font-semibold">Trajectory</span>: are tool calls appropriate, efficient, and well-justified?</li>
          <li><span className="font-semibold">Final response</span>: is it correct, grounded, and usable for the user?</li>
        </ul>
        <p className="text-sm text-muted">
          Source:{' '}
          <a className="link-primary hover:underline" href={AGENTS_COMPANION_SOURCE_URL} target="_blank" rel="noreferrer">
            {AGENTS_COMPANION_CITATION} ↗
          </a>
        </p>
      </Panel>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Budgeted coordination: evaluate multi-agent like a system</h3>
        <p className="text-body">
          Multi-agent setups can look better or worse depending on what you hold constant.
          For production decisions, treat coordination as a <span className="font-semibold">budgeted resource</span>.
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Fair comparisons</span>: match tools, prompts, and total token/compute budgets</li>
          <li><span className="font-semibold">Process metrics</span>: track coordination overhead, error propagation, and information flow</li>
          <li><span className="font-semibold">Cost-normalized outcomes</span>: report success per 1,000 tokens (and consider latency)</li>
          <li><span className="font-semibold">Communication caps</span>: more messages can plateau into redundancy—optimize for signal, not volume</li>
          <li><span className="font-semibold">Expect variance</span>: multi-agent is situational; some tasks win big, others degrade sharply</li>
        </ul>
        <p className="text-sm text-muted">
          Source:{' '}
          <a className="link-primary hover:underline" href={SCALING_AGENT_SYSTEMS_PAPER_URL} target="_blank" rel="noreferrer">
            {SCALING_AGENT_SYSTEMS_PAPER_CITATION} ↗
          </a>
        </p>
      </Panel>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Additional multi-agent patterns (practical)</h3>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Hierarchical routing</span>: an orchestrator routes to specialists based on intent</li>
          <li><span className="font-semibold">Diamond</span>: specialist output passes through a moderation/rephraser step</li>
          <li><span className="font-semibold">Peer-to-peer handoff</span>: a specialist forwards to another specialist when routing is wrong</li>
          <li><span className="font-semibold">Collaborative + response mixer</span>: multiple specialists contribute; a mixer merges the best parts</li>
        </ul>
        <p className="text-sm text-muted">
          Source:{' '}
          <a className="link-primary hover:underline" href={AGENTS_COMPANION_SOURCE_URL} target="_blank" rel="noreferrer">
            {AGENTS_COMPANION_CITATION} ↗
          </a>
        </p>
      </Panel>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">From “agent prompts” to contracts (high-stakes work)</h3>
        <p className="text-body">
          One way to reduce ambiguity is to treat the request as a <span className="font-semibold">contract</span>:
          clear deliverables, acceptance criteria, and a feedback cadence.
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Deliverables & specs</span>: what “done” means and how to verify it</li>
          <li><span className="font-semibold">Scope</span>: what’s in vs out</li>
          <li><span className="font-semibold">Reporting</span>: how often the agent should check in / request clarification</li>
          <li><span className="font-semibold">Negotiation loop</span>: surface risks, underspecification, and missing inputs early</li>
        </ul>
        <p className="text-sm text-muted">
          Source:{' '}
          <a className="link-primary hover:underline" href={AGENTS_COMPANION_SOURCE_URL} target="_blank" rel="noreferrer">
            {AGENTS_COMPANION_CITATION} ↗
          </a>
        </p>
      </Panel>
    </div>
  );
}
