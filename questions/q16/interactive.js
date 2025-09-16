const interactiveScript = () => {
            // Ensure DOM is ready before initializing
            setTimeout(() => {
                initializeQuestion16();
            }, 100);
        };

if (typeof module !== 'undefined') {
  module.exports = interactiveScript;
} else if (typeof window !== 'undefined') {
  window.question16Interactive = interactiveScript;
}
