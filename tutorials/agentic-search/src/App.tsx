import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/shared/ThemeProvider';
import { Chip } from './components/shared/Chip';
import { LandingPage } from './components/landing/LandingPage';
import { TutorialPage } from './components/tutorial/TutorialPage';
import '../../../css/theme.css'; // Import main site theme directly
import './styles/tutorial.css'; // Tutorial-specific additions

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'tutorial'>('landing');

  // Handle URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#tutorial') {
        setCurrentView('tutorial');
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

  const handleStartTutorial = () => {
    window.location.hash = '#tutorial';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {currentView === 'landing' ? (
              <LandingPage onStartTutorial={handleStartTutorial} />
            ) : (
              <TutorialPage onBackToOverview={handleBackToOverview} />
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
