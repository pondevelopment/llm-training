import { Panel } from '../shared/Panel';

const exampleProcessors = [
  { name: 'instructions', desc: 'Insert stable system instructions.' },
  { name: 'identity', desc: 'Add agent identity / role information.' },
  { name: 'contents', desc: 'Select + format session events into model roles.' },
  { name: 'compaction/filtering', desc: 'Summarize or drop irrelevant historical events (often at the session/event layer).' },
  { name: 'memory', desc: 'Optionally preload or fetch memory snippets.' },
  { name: 'artifacts', desc: 'Attach artifact references; load content only on demand.' },
];

export function PipelineSection() {
  return (
    <div className="space-y-6">
      <div className="panel panel-info p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">🧩 Flows & processors (context compilation)</h2>
        <p className="text-body">
          Instead of concatenating strings, a framework can build working context through a named, ordered pipeline.
          That makes the transformation observable and testable.
        </p>
      </div>

      <Panel className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">A simple pipeline view</h3>
        <div className="space-y-2">
          {exampleProcessors.map((p) => (
            <div key={p.name} className="flex items-start gap-3 panel panel-neutral-soft p-3">
              <div className="chip chip-info font-mono">{p.name}</div>
              <p className="text-sm text-body">{p.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">Request vs response processors</h3>
          <p className="text-body">
            A common pattern is two ordered pipelines: one that compiles the request (context build), and one that
            post-processes the response (e.g., extracting plans, validating schema, tool execution).
          </p>
          <p className="text-sm text-muted">
            Benefit: you can add, reorder, or test processors independently instead of rewriting giant prompt templates.
          </p>
        </Panel>

        <Panel className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-heading">The “contents” step (history compilation)</h3>
          <p className="text-body">
            When your ground truth is an event stream, you still need a compiler step to turn it into model-friendly
            roles (`user`/`assistant`/`tool`). That step typically does:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-body">
            <li><span className="font-semibold">Selection</span>: drop irrelevant/noisy framework events</li>
            <li><span className="font-semibold">Transformation</span>: map events into the model’s role schema</li>
            <li><span className="font-semibold">Injection</span>: write the formatted history into the request</li>
          </ul>
        </Panel>
      </div>

      <Panel variant="warning" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Compaction and filtering (keep sessions manageable)</h3>
        <p className="text-body">
          Long-running agents need lifecycle management. Two common approaches:
        </p>
        <ul className="list-disc ml-5 space-y-1 text-body">
          <li><span className="font-semibold">Compaction</span>: summarize older windows of events and store the summary back into the session</li>
          <li><span className="font-semibold">Filtering</span>: deterministic rules/plugins to drop or trim events before they ever reach the model</li>
        </ul>
        <p className="text-sm text-muted">
          The practical payoff: your per-call “contents” processor becomes simpler because it operates on already-cleaned history.
        </p>
      </Panel>

      <Panel variant="warning" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Design tip: cache-friendly prompts</h3>
        <p className="text-body">
          Keep stable content (instructions, identity, summaries) at the front, and highly variable content (latest user turn,
          fresh tool outputs) at the end.
        </p>
        <p className="text-sm text-muted">
          Many production stacks treat this as two zones: a <span className="font-semibold">stable prefix</span> (cacheable) and a
          <span className="font-semibold">variable suffix</span> (changes every call). Some frameworks add “static instruction”
          primitives to keep parts of the prefix immutable.
        </p>
      </Panel>
    </div>
  );
}
