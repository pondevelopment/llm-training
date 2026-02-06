import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/shared/ThemeProvider';
import { Chip } from './components/shared/Chip';
import { LandingPage } from './components/landing/LandingPage';
import { MethodsSection } from './components/methods/MethodsSection';
import { SLMsSection } from './components/slms/SLMsSection';
import { ForgettingSection } from './components/forgetting/ForgettingSection';
import { PricingSection } from './components/pricing/PricingSection';
import { CompletionSection } from './components/CompletionSection';
import '../../../css/theme.css'; // Import main site theme directly
import './styles/tutorial.css'; // Tutorial-specific additions

type ViewType = 'landing' | 'methods' | 'slms' | 'forgetting' | 'pricing' | 'completion';

const sections: { id: ViewType; title: string; icon: string }[] = [
  { id: 'methods', title: 'Fine-Tuning Methods', icon: '🔧' },
  { id: 'slms', title: 'Small Language Models', icon: '🧠' },
  { id: 'forgetting', title: 'Catastrophic Forgetting', icon: '📉' },
  { id: 'pricing', title: 'Pricing Calculator', icon: '💰' },
];

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  // Handle URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as ViewType;
      if (['methods', 'slms', 'forgetting', 'pricing', 'completion'].includes(hash)) {
        setCurrentView(hash);
      } else {
        setCurrentView('landing');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: ViewType) => {
    window.location.hash = view === 'landing' ? '' : `#${view}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    navigateTo('landing');
  };

  const currentIndex = sections.findIndex(s => s.id === currentView);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  const renderSection = () => {
    switch (currentView) {
      case 'methods':
        return <MethodsSection />;
      case 'slms':
        return <SLMsSection />;
      case 'forgetting':
        return <ForgettingSection />;
      case 'pricing':
        return <PricingSection />;
      case 'completion':
        return (
          <CompletionSection
            onRestart={() => navigateTo('landing')}
            onGoToTutorials={() => { window.location.href = '../index.html'; }}
          />
        );
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

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
                  LLM Fine-Tuning
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {currentView !== 'landing' && (
                  <button
                    onClick={handleBackToOverview}
                    className="text-sm text-muted hover:text-heading transition-colors"
                  >
                    ← Overview
                  </button>
                )}
                <Chip variant="info">Interactive</Chip>
              </div>
            </div>
          </div>
        </header>

        {/* Section Navigation (when in a section) */}
        {currentView !== 'landing' && currentView !== 'completion' && (
          <nav className="bg-card-secondary border-b border-divider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => navigateTo(section.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        currentView === section.id
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-heading hover:bg-card'
                      }`}
                    >
                      {section.icon} {section.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {renderSection()}

            {/* Section Navigation Footer */}
            {currentView !== 'landing' && currentView !== 'completion' && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-divider">
                {prevSection ? (
                  <button
                    onClick={() => navigateTo(prevSection.id)}
                    className="flex items-center gap-2 text-muted hover:text-heading transition-colors"
                  >
                    <span>←</span>
                    <span>{prevSection.icon} {prevSection.title}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBackToOverview}
                    className="flex items-center gap-2 text-muted hover:text-heading transition-colors"
                  >
                    <span>←</span>
                    <span>Back to Overview</span>
                  </button>
                )}
                {nextSection ? (
                  <button
                    onClick={() => navigateTo(nextSection.id)}
                    className="flex items-center gap-2 text-accent hover:text-accent-strong transition-colors font-semibold"
                  >
                    <span>{nextSection.icon} {nextSection.title}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('completion')}
                    className="flex items-center gap-2 text-accent hover:text-accent-strong transition-colors font-semibold"
                  >
                    <span>✓ Complete Tutorial</span>
                  </button>
                )}
              </div>
            )}
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
