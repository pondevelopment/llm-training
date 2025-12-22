import { Panel } from '../shared/Panel';

export function RelevanceSection() {
  return (
    <div className="space-y-6">
      <div className="panel panel-info p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">🎯 Relevance: what belongs in the window?</h2>
        <p className="text-body">
          Once you have a tiered architecture, the key question becomes: what should the model see right now?
          The goal is to maximize signal density for the current step.
        </p>
      </div>

      <Panel variant="info" className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Real-world business example</h3>
        <p className="text-body">
          Imagine a customer support copilot answering: <strong>“Can I return this item?”</strong>
          The correct answer depends on the customer’s order, the SKU category, regional policy, and timing.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="panel panel-warning p-4">
            <p className="text-sm font-semibold text-heading mb-1">Naive (too much context)</p>
            <p className="text-sm text-body">
              Always include the full policy handbook, full customer history, and every past ticket.
              The model spends attention on irrelevant details and misses the one clause that matters.
            </p>
          </div>
          <div className="panel panel-success p-4">
            <p className="text-sm font-semibold text-heading mb-1">Relevance-first (right slice)</p>
            <p className="text-sm text-body">
              Retrieve only what’s needed for this step: order date, delivery date, SKU type, region, and the specific
              policy excerpt for that combination. Keep everything else as handles (expand on demand).
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">Artifacts</h3>
          <p className="text-body">
            Store large payloads outside the prompt. Include only references and short summaries.
            Load full content temporarily when needed.
          </p>
        </Panel>

        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">Memory</h3>
          <p className="text-body">
            Keep long-term knowledge searchable, not permanently pinned.
            Retrieval can be agent-driven (“reactive”) or system-assisted (“proactive”).
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-muted">
            <li><span className="font-semibold">Reactive</span>: the agent notices a gap and explicitly searches</li>
            <li><span className="font-semibold">Proactive</span>: a pre-processor runs retrieval and injects likely relevant snippets</li>
          </ul>
        </Panel>
      </div>

      <Panel variant="warning" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Common failure mode</h3>
        <p className="text-body">
          If you dump tool results into chat history permanently, every future turn pays that token and attention cost.
          Prefer handles + on-demand expansion.
        </p>
      </Panel>
    </div>
  );
}
