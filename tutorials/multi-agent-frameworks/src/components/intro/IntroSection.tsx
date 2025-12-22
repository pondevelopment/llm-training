import { Panel } from '../shared/Panel';
import { GOOGLE_BLOG_SOURCE_URL } from '../../data/sources';

export function IntroSection() {
  return (
    <div className="space-y-6">
      <div className="panel panel-info p-6 space-y-3">
        <h2 className="text-2xl font-bold text-heading">📉 The scaling bottleneck</h2>
        <p className="text-body">
          Multi-agent systems tend to run longer and touch more tools, files, and intermediate state.
          A naive pattern—pasting everything into one giant prompt—quickly becomes too slow,
          too expensive, and too noisy.
        </p>
        <p className="text-sm text-muted">
          Source (inspiration):{' '}
          <a
            className="link-primary hover:underline"
            href={GOOGLE_BLOG_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Architecting efficient context-aware multi-agent framework for production ↗
          </a>
        </p>
      </div>

      <Panel variant="info" className="p-6 space-y-3">
        <h3 className="text-lg font-semibold text-heading">Real-world business example</h3>
        <p className="text-body">
          Imagine a retail ops copilot handling <strong>“late delivery”</strong> tickets.
          A robust workflow touches order state, shipment tracking, carrier SLAs, inventory, refund policy,
          and customer history—often across multiple internal tools.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="panel panel-warning p-4">
            <p className="text-sm font-semibold text-heading mb-1">Naive (giant prompt)</p>
            <p className="text-sm text-body">
              Paste the full order JSON, tracking logs, policy docs, and chat history into one prompt.
              It’s slow, costly, and the model misses the important bits.
            </p>
          </div>
          <div className="panel panel-success p-4">
            <p className="text-sm font-semibold text-heading mb-1">Production pattern (structured context)</p>
            <p className="text-sm text-body">
              Store facts as state (order summary, exceptions, policy constraints), then compile a small,
              task-specific view for each step (triage → recommend → execute).
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel variant="warning" className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">1) Cost + latency</h3>
          <p className="text-sm text-body">
            Token-heavy prompts increase time-to-first-token and per-call cost.
          </p>
        </Panel>
        <Panel variant="warning" className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">2) Signal degradation</h3>
          <p className="text-sm text-body">
            Important instructions get buried (“lost in the middle”), leading to brittle behavior.
          </p>
        </Panel>
        <Panel variant="warning" className="p-5 space-y-2">
          <h3 className="text-sm font-semibold text-heading">3) Hard limits</h3>
          <p className="text-sm text-body">
            Tool payloads, retrieved documents, and artifacts eventually exceed any fixed window.
          </p>
        </Panel>
      </div>

      <Panel className="p-6 space-y-2">
        <h3 className="text-lg font-semibold text-heading">What we’ll do instead</h3>
        <p className="text-body">
          Treat context as a system: store structured state, then compile a minimal working view per model call.
        </p>
      </Panel>
    </div>
  );
}
