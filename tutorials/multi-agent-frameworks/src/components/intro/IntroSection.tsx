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
