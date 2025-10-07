import { ThemeProvider } from './components/shared/ThemeProvider';
import { Panel } from './components/shared/Panel';
import { Chip } from './components/shared/Chip';
import { IntroSection } from './components/intro/IntroSection';
import { ToolboxSection } from './components/toolbox/ToolboxSection';
import '../../../css/theme.css'; // Import main site theme directly
import './styles/tutorial.css'; // Tutorial-specific additions

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-body">
        {/* Header */}
        <header className="bg-card border-b border-divider sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <a href="../../index.html" className="text-heading hover:text-accent transition-colors whitespace-nowrap">
                  <span className="text-base sm:text-xl font-bold">← LLM Training</span>
                </a>
                <span className="text-muted hidden sm:inline">|</span>
                <h1 className="text-lg sm:text-2xl font-bold text-heading text-center sm:text-left">
                  Agentic Search Tutorial
                </h1>
              </div>
              <Chip variant="info">Interactive</Chip>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {/* Section 1: Traditional vs Agentic */}
              <IntroSection />

              {/* Section 2: Toolbox Explorer */}
              <ToolboxSection />

              {/* Progress Indicator */}
              <div className="max-w-3xl mx-auto">
                <Panel variant="success">
                  <p className="text-body text-sm sm:text-base">
                    <strong>✅ Sections 1-2 Complete!</strong> You've explored traditional vs agentic search and the agent's toolbox.
                  </p>
                  <p className="mt-2 panel-muted text-xs sm:text-sm">
                    Continue scrolling to learn about MCP manifests and see a real workflow (coming in future phases).
                  </p>
                </Panel>
              </div>

              {/* Coming Soon Sections */}
              <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </main>

        {/* Footer */}
      <footer className="bg-card border-t border-divider w-full mt-12 sm:mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-center text-muted text-sm sm:text-base">
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
