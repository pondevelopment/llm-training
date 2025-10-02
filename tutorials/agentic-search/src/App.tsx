import { ThemeProvider } from './components/shared/ThemeProvider';
import { Panel } from './components/shared/Panel';
import { Chip } from './components/shared/Chip';
import './styles/theme.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-body">
        {/* Header */}
        <header className="bg-card border-b border-divider sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <a href="../../index.html" className="text-heading hover:text-accent transition-colors">
                <span className="text-xl font-bold">← LLM Training</span>
              </a>
              <span className="text-muted">|</span>
              <h1 className="text-2xl font-bold text-heading">Agentic Search Tutorial</h1>
              <Chip variant="info">Interactive</Chip>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-12">
            {/* Welcome Section */}
            <section>
              <h2 className="text-3xl font-bold text-heading mb-4">
                Welcome to Agentic Search
              </h2>
              <p className="text-lg text-body mb-6">
                Discover how AI agents plan, discover tools, and synthesize answers through multi-step workflows.
              </p>
              <Panel variant="info">
                <p className="text-body">
                  <strong>🚀 Phase 0 Complete!</strong> The foundation is set up with:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-body">
                  <li>Vite + React + TypeScript environment</li>
                  <li>Existing theme system integrated (light/dark mode)</li>
                  <li>Shared components (Panel, Chip, ThemeProvider)</li>
                  <li>Mock data structures ready</li>
                  <li>Configured for GitHub Pages deployment</li>
                </ul>
                <p className="mt-4 panel-muted text-sm">
                  Next up: Phase 1 - Building the Intro section with side-by-side comparison!
                </p>
              </Panel>
            </section>

            {/* Coming Soon Sections */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Panel variant="info">
                <h3 className="text-xl font-bold text-heading mb-2">Section 1</h3>
                <p className="text-body mb-2">Traditional vs Agentic Search</p>
                <Chip>Coming in Phase 1</Chip>
              </Panel>

              <Panel variant="info">
                <h3 className="text-xl font-bold text-heading mb-2">Section 2</h3>
                <p className="text-body mb-2">Agents & Toolbox</p>
                <Chip>Coming in Phase 2</Chip>
              </Panel>

              <Panel variant="info">
                <h3 className="text-xl font-bold text-heading mb-2">Section 3</h3>
                <p className="text-body mb-2">MCP & .well-known</p>
                <Chip>Coming in Phase 3</Chip>
              </Panel>

              <Panel variant="info">
                <h3 className="text-xl font-bold text-heading mb-2">Section 4</h3>
                <p className="text-body mb-2">Scenario Player</p>
                <Chip>Coming in Phase 4</Chip>
              </Panel>

              <Panel variant="info">
                <h3 className="text-xl font-bold text-heading mb-2">Section 5</h3>
                <p className="text-body mb-2">Takeaways & FAQ</p>
                <Chip>Coming in Phase 5</Chip>
              </Panel>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-divider mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-muted">
              <a href="../index.html" className="link-primary hover:underline">Tutorials</a>
              <span className="mx-2">•</span>
              <a href="../../index.html" className="link-primary hover:underline">Home</a>
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
