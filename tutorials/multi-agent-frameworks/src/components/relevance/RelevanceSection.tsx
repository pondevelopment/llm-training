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
