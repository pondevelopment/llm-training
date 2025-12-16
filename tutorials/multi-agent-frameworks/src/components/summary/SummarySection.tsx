import { Panel } from '../shared/Panel';
import { GOOGLE_BLOG_SOURCE_URL } from '../../data/sources';

export function SummarySection() {
  return (
    <div className="space-y-6">
      <Panel variant="success" className="p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">🎓 Key takeaways</h2>
        <ul className="list-disc ml-5 space-y-2 text-body">
          <li>Don’t scale by stuffing prompts; scale by changing how context is represented and managed.</li>
          <li>Separate durable state from the per-call working context.</li>
          <li>Build working context through an explicit processor pipeline.</li>
          <li>Keep large payloads as artifacts and load them on demand.</li>
          <li>In multi-agent systems, scope handoffs by default to prevent context explosion.</li>
        </ul>
      </Panel>

      <Panel className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">Further reading</h3>
        <p className="text-body">
          This tutorial is an educational, framework-agnostic walkthrough inspired by:
        </p>
        <p className="text-sm text-muted">
          <a
            className="link-primary hover:underline"
            href={GOOGLE_BLOG_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Architecting efficient context-aware multi-agent framework for production ↗
          </a>
        </p>
      </Panel>
    </div>
  );
}
