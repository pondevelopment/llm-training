(function() {
  var storageKey = 'llm-theme';
  var className = 'dark';
  try {
    var stored = localStorage.getItem(storageKey);
    if (stored === 'dark') {
      document.documentElement.classList.add(className);
    } else if (stored === 'light') {
      document.documentElement.classList.remove(className);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add(className);
    }
  } catch (err) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add(className);
    }
  }
})();
