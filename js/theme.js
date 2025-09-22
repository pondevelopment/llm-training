(function(){
  const storageKey = 'llm-theme';
  const className = 'dark';
  const root = document.documentElement;

  const getStored = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (err) {
      return null;
    }
  };

  const setStored = (value) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch (err) {}
  };

  const isDark = () => root.classList.contains(className);

  const updateButtons = () => {
    const theme = isDark() ? 'dark' : 'light';
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const icon = theme === 'dark' ? '☀️' : '🌙';
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const iconEl = btn.querySelector('.theme-toggle-icon');
      if (iconEl) iconEl.textContent = icon;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  };

  const applyTheme = (theme, options = {}) => {
    const persist = options.persist !== false;
    if (theme === 'dark') {
      root.classList.add(className);
    } else {
      root.classList.remove(className);
      theme = 'light';
    }
    if (persist) {
      setStored(theme);
    }
    if (document.readyState !== 'loading') {
      updateButtons();
    }
  };

  const initToggles = () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(isDark() ? 'light' : 'dark');
        updateButtons();
      });
    });
    updateButtons();
  };

  const stored = getStored();
  if (stored === 'dark') {
    root.classList.add(className);
  } else if (stored === 'light') {
    root.classList.remove(className);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggles);
  } else {
    initToggles();
  }

  const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (media) {
    const listener = (event) => {
      if (getStored()) return;
      applyTheme(event.matches ? 'dark' : 'light', { persist: false });
      updateButtons();
    };
    try {
      media.addEventListener('change', listener);
    } catch (err) {
      if (media.addListener) media.addListener(listener);
    }
  }
})();
