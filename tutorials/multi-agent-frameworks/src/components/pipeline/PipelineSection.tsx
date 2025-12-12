import { Panel } from '../shared/Panel';

const exampleProcessors = [
  { name: 'instructions', desc: 'Insert stable system instructions.' },
  { name: 'identity', desc: 'Add agent identity / role information.' },
  { name: 'contents', desc: 'Select + format session events into model roles.' },
  { name: 'compaction/filtering', desc: 'Summarize or drop irrelevant historical events.' },
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

      <Panel variant="warning" className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Design tip: cache-friendly prompts</h3>
        <p className="text-body">
          Keep stable content (instructions, identity, summaries) at the front, and highly variable content (latest user turn,
          fresh tool outputs) at the end.
        </p>
      </Panel>
    </div>
  );
}
