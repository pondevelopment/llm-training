/**
 * Paper Loader - fetches research paper overview + interactive assets on demand.
 */
class PaperLoader {
  constructor() {
    this.cache = new Map();
    this.loadingStates = new Map();
    this.manifest = null;
    this.manifestPromise = null;
  }

  async loadPaper(paperIndex) {
    const paperId = paperIndex.toString().padStart(2, '0');

    if (this.cache.has(paperId)) {
      return this.cache.get(paperId);
    }

    if (this.loadingStates.has(paperId)) {
      return this.loadingStates.get(paperId);
    }

    const loadingPromise = this._loadPaperContent(paperIndex, paperId);
    this.loadingStates.set(paperId, loadingPromise);

    try {
      const paper = await loadingPromise;
      this.cache.set(paperId, paper);
      this.loadingStates.delete(paperId);
      return paper;
    } catch (error) {
      this.loadingStates.delete(paperId);
      throw error;
    }
  }

  async listIds() {
    const manifest = await this._ensureManifest();
    return Object.keys(manifest || {})
      .map(id => Number(id))
      .filter(n => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b);
  }

  async getManifest() {
    return await this._ensureManifest();
  }

  async _loadPaperContent(paperIndex, paperId) {
    try {
      const manifestEntry = await this._getManifestEntry(paperIndex, paperId);
      if (!manifestEntry) {
        console.warn(`No manifest entry for paper ${paperIndex}`);
        return this._placeholderPaper(paperIndex, 'Missing manifest entry.');
      }

      const normalized = this._normalizeEntry(manifestEntry);
      const noCache = this._shouldBypassCache();

      const [overviewHtml, interactiveHtml, interactiveScript] = await Promise.all([
        normalized.overviewPath
          ? this._fetchText(normalized.overviewPath, noCache)
          : Promise.resolve(''),
        normalized.interactive.htmlPath
          ? this._fetchText(normalized.interactive.htmlPath, noCache)
          : Promise.resolve(''),
        normalized.interactive.scriptPath
          ? this._loadInteractiveScript(normalized.interactive.scriptPath, noCache)
          : Promise.resolve(() => {})
      ]);

      const interactive = {
        title: normalized.interactive.title || normalized.interactiveTitle || '',
        html: interactiveHtml || '',
        script: typeof interactiveScript === 'function' ? interactiveScript : () => {}
      };

      return {
        index: paperIndex,
        id: paperId,
        title: normalized.title || `Paper ${paperIndex}`,
        overview: overviewHtml || '',
        interactive,
        meta: {
          authors: Array.isArray(normalized.authors) ? normalized.authors : [],
          year: normalized.year || '',
          venue: normalized.venue || '',
          summary: normalized.summary || '',
          tags: Array.isArray(normalized.tags) ? normalized.tags : [],
          relatedQuestions: Array.isArray(normalized.relatedQuestions) ? normalized.relatedQuestions : []
        }
      };
    } catch (error) {
      console.error(`Failed to load paper ${paperIndex}:`, error);
      return this._placeholderPaper(paperIndex, 'Failed to load paper assets.');
    }
  }

  _normalizeEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      return { interactive: {} };
    }

    const normalized = JSON.parse(JSON.stringify(entry));
    normalized.interactive = normalized.interactive || {};

    if (normalized.dir) {
      const base = normalized.dir.replace(/[\\/]+$/, '');
      if (!normalized.overviewPath) {
        normalized.overviewPath = `${base}/overview.html`;
      }
      if (!normalized.interactive.htmlPath) {
        normalized.interactive.htmlPath = `${base}/interactive.html`;
      }
      if (!normalized.interactive.scriptPath) {
        normalized.interactive.scriptPath = `${base}/interactive.js`;
      }
    }

    if (normalized.interactiveTitle && !normalized.interactive.title) {
      normalized.interactive.title = normalized.interactiveTitle;
    }

    return normalized;
  }

  async _getManifestEntry(paperIndex, paperId) {
    const manifest = await this._ensureManifest();
    if (!manifest) return null;

    return manifest[String(paperIndex)] || manifest[paperId] || null;
  }

  async _ensureManifest() {
    if (this.manifest !== null) {
      return this.manifest;
    }

    if (!this.manifestPromise) {
      const baseUrl = './papers/manifest.json';
      const noCache = this._shouldBypassCache();
      const url = noCache ? `${baseUrl}?t=${Date.now()}` : baseUrl;
      this.manifestPromise = fetch(url, { cache: noCache ? 'no-store' : 'default' })
        .then(res => (res.ok ? res.json() : {}))
        .catch(err => {
          console.warn('Failed to load paper manifest:', err);
          return {};
        });
    }

    this.manifest = await this.manifestPromise;
    if (!this.manifest || typeof this.manifest !== 'object') {
      this.manifest = {};
    }

    return this.manifest;
  }

  async _loadInteractiveScript(path, noCache) {
    try {
      const code = await this._fetchText(path, noCache);
      const moduleContext = { exports: {}, module: { exports: {} } };
      const factory = new Function(
        'exports',
        'module',
        `${code}\n;return (typeof interactiveScript !== 'undefined') ? interactiveScript : module.exports;`
      );
      const result = factory(moduleContext.exports, moduleContext.module);
      return result || moduleContext.module.exports || moduleContext.exports || (() => {});
    } catch (error) {
      console.error(`Failed to evaluate interactive script at ${path}:`, error);
      return () => {};
    }
  }

  async _fetchText(path, noCache) {
    const url = noCache ? `${path}${path.includes('?') ? '&' : '?'}t=${Date.now()}` : path;
    const res = await fetch(url, { cache: noCache ? 'no-store' : 'default' });
    if (!res.ok) {
      throw new Error(`Failed to fetch resource ${path}: ${res.status}`);
    }
    return res.text();
  }

  _shouldBypassCache() {
    return typeof window !== 'undefined' && window.__DEV_NO_CACHE__;
  }

  _placeholderPaper(index, reason) {
    return {
      index,
      id: index.toString().padStart(2, '0'),
      title: `Paper ${index} unavailable`,
      overview: '<div class="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">Paper overview could not be loaded.</div>',
      interactive: {
        title: 'Content unavailable',
        html: '<div class="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">Interactive component could not be loaded.</div>',
        script: () => {}
      },
      meta: { authors: [], year: '', venue: '', summary: reason, tags: [] }
    };
  }
}

if (typeof module !== 'undefined') {
  module.exports = PaperLoader;
} else if (typeof window !== 'undefined') {
  window.PaperLoader = PaperLoader;
}
