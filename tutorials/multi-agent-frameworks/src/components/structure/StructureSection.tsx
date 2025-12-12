import { Panel } from '../shared/Panel';

export function StructureSection() {
  return (
    <div className="space-y-6">
      <div className="panel panel-info p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">🗂️ Tiered context (storage vs presentation)</h2>
        <p className="text-body">
          Production frameworks separate durable state from the per-call prompt.
          You keep the full truth in storage, and compute a scoped “working context” for each invocation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">Working context (per call)</h3>
          <p className="text-sm text-body">
            The prompt view for this invocation: instructions, selected history, tool outputs, optional memory snippets,
            and lightweight references to artifacts.
          </p>
        </Panel>
        <Panel className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">Session (durable event log)</h3>
          <p className="text-sm text-body">
            Structured events: user messages, agent outputs, tool calls/results, control signals, and errors.
            This is the ground truth.
          </p>
        </Panel>
        <Panel className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">Memory (long-lived knowledge)</h3>
          <p className="text-sm text-body">
            Searchable preferences and past decisions that outlive a single session.
          </p>
        </Panel>
        <Panel className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">Artifacts (large payloads)</h3>
          <p className="text-sm text-body">
            Files/large tool outputs stored by handle (name + summary), loaded into working context only when needed.
          </p>
        </Panel>
      </div>

      <Panel variant="success" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Why this matters</h3>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li>Prompts stay small and relevant.</li>
          <li>You can evolve storage schema and prompt formatting independently.</li>
          <li>It becomes easier to debug, test, and observe context transformations.</li>
        </ul>
      </Panel>
    </div>
  );
}
