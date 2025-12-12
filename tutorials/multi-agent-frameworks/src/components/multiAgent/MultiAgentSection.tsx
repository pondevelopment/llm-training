import { Panel } from '../shared/Panel';

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
      </Panel>
    </div>
  );
}
