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
        <p className="text-sm text-muted">
          Key idea: the <span className="font-semibold">working context is a recomputed, ephemeral view</span>.
          You can change its formatting without migrating your stored history.
        </p>
      </div>

      <Panel variant="info" className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Real-world business example</h3>
        <p className="text-body">
          Consider a sales assistant that drafts quotes for enterprise renewals.
          The agent needs a lot of context: contract terms, pricing rules, discount approvals, customer usage,
          and prior negotiation history.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="panel panel-warning p-4">
            <p className="text-sm font-semibold text-heading mb-1">Naive (stuff everything)</p>
            <p className="text-sm text-body">
              Paste the full contract PDF text, the entire email thread, all usage exports, and every pricing rule into
              the prompt for every step. It’s slow, expensive, and important constraints get lost.
            </p>
          </div>
          <div className="panel panel-success p-4">
            <p className="text-sm font-semibold text-heading mb-1">Tiered context (storage vs working view)</p>
            <p className="text-sm text-body">
              Store the full deal timeline as <strong>session events + artifacts</strong> (contracts, emails, spreadsheets).
              For each action (draft quote, check guardrails, write rationale), compile a small working context:
              current SKUs, approved discount bands, customer constraints, and only the relevant contract excerpt.
            </p>
          </div>
        </div>
      </Panel>

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
          <ul className="list-disc ml-5 space-y-1 text-sm text-muted">
            <li>Model-agnostic storage (swap models without rewriting history)</li>
            <li>Rich operations (analytics, time-travel debugging, compaction)</li>
            <li>Better observability (inspect actions and state transitions)</li>
          </ul>
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
