/**
 * Question Loader - Dynamically loads question content from separate files or manifest entries
 */
class QuestionLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
        this.manifest = null;
        this.manifestLoadPromise = null;
    }

    /**
     * Load a question by index (1-based)
     * @param {number} questionIndex
     * @returns {Promise<Object>}
     */
    async loadQuestion(questionIndex) {
        const questionId = `question-${questionIndex.toString().padStart(2, '0')}`;

        if (this.cache.has(questionId)) {
            return this.cache.get(questionId);
        }

        if (this.loadingStates.has(questionId)) {
            return this.loadingStates.get(questionId);
        }

        const loadingPromise = this._loadQuestionContent(questionId, questionIndex);
        this.loadingStates.set(questionId, loadingPromise);

        try {
            const question = await loadingPromise;
            this.cache.set(questionId, question);
            this.loadingStates.delete(questionId);
            return question;
        } catch (error) {
            this.loadingStates.delete(questionId);
            throw error;
        }
    }

    async _loadQuestionContent(questionId, questionIndex) {
        try {
            const manifestEntry = await this._getManifestEntry(questionIndex, questionId);
            if (manifestEntry) {
                return await this._loadFromManifest(questionId, questionIndex, manifestEntry);
            }
        } catch (error) {
            console.error(`Error loading manifest-backed question ${questionId}:`, error);
        }
        return this._fetchQuestion(questionId);
    }

    async _loadFromManifest(questionId, questionIndex, entry) {
        const normalized = this._normalizeManifestEntry(entry);
        const noCache = this._shouldBypassCache();
        try {
            const answerPromise = normalized.answerPath
                ? this._fetchText(normalized.answerPath, noCache)
                : Promise.resolve('');

            const interactiveEntry = normalized.interactive || {};

            const interactiveHtmlPromise = interactiveEntry.htmlPath
                ? this._fetchText(interactiveEntry.htmlPath, noCache)
                : Promise.resolve('');

            const interactiveScriptPromise = interactiveEntry.scriptPath
                ? this._loadInteractiveScript(interactiveEntry.scriptPath, noCache)
                : Promise.resolve(() => {});

            const [answerHtml, interactiveHtml, interactiveScript] = await Promise.all([
                answerPromise,
                interactiveHtmlPromise,
                interactiveScriptPromise
            ]);

            const interactiveTitle = interactiveEntry.title
                || normalized.interactiveTitle
                || '';

            const interactive = {
                title: interactiveTitle,
                html: interactiveHtml || '',
                script: typeof interactiveScript === 'function' ? interactiveScript : () => {}
            };

            return {
                title: normalized.title || `${questionIndex}. Question`,
                answer: answerHtml || '',
                interactive
            };
        } catch (error) {
            console.error(`Error constructing manifest-backed question ${questionId}:`, error);
            return this._createPlaceholderQuestion(questionId);
        }
    }

    _normalizeManifestEntry(entry) {
        if (!entry || typeof entry !== 'object') {
            return { interactive: {} };
        }
        const normalized = JSON.parse(JSON.stringify(entry));
        normalized.interactive = normalized.interactive || {};

        if (normalized.dir) {
            const base = normalized.dir.replace(/[\\\/]+$/, '');
            if (!normalized.answerPath) {
                normalized.answerPath = `${base}/answer.html`;
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

    async _getManifestEntry(questionIndex, questionId) {
        const manifest = await this._ensureManifest();
        if (!manifest) return null;
        const direct = manifest[String(questionIndex)] || manifest[questionId];
        return direct ? this._normalizeManifestEntry(direct) : null;
    }

    async _ensureManifest() {
        if (this.manifest !== null) {
            return this.manifest;
        }
        if (!this.manifestLoadPromise) {
            const noCache = this._shouldBypassCache();
            const baseUrl = './questions/manifest.json';
            const url = noCache ? `${baseUrl}?t=${Date.now()}` : baseUrl;
            this.manifestLoadPromise = fetch(url, { cache: noCache ? 'no-store' : 'default' })
                .then(response => {
                    if (!response.ok) {
                        return {};
                    }
                    return response.json();
                })
                .catch(error => {
                    console.warn('Failed to load question manifest:', error);
                    return {};
                });
        }
        this.manifest = await this.manifestLoadPromise;
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
            console.error(`Error evaluating interactive script at ${path}:`, error);
            return () => {};
        }
    }

    async _fetchText(path, noCache) {
        const url = noCache ? `${path}${path.includes('?') ? '&' : '?'}t=${Date.now()}` : path;
        const response = await fetch(url, { cache: noCache ? 'no-store' : 'default' });
        if (!response.ok) {
            throw new Error(`Failed to fetch resource ${path}: ${response.status}`);
        }
        return response.text();
    }

    _shouldBypassCache() {
        return typeof window !== 'undefined' && window.__DEV_NO_CACHE__;
    }

    async _fetchQuestion(questionId) {
        try {
            const noCache = this._shouldBypassCache();
            const url = `./questions/${questionId}.js${noCache ? `?t=${Date.now()}` : ''}`;
            const response = await fetch(url, { cache: noCache ? 'no-store' : 'default' });
            if (!response.ok) {
                throw new Error(`Failed to load question: ${response.status}`);
            }

            const questionCode = await response.text();
            const questionModule = this._executeQuestionModule(questionCode, questionId);
            return questionModule;
        } catch (error) {
            console.error(`Error loading question ${questionId}:`, error);
            return this._createPlaceholderQuestion(questionId);
        }
    }

    _executeQuestionModule(code, questionId) {
        const moduleContext = { exports: {}, module: { exports: {} } };
        try {
            const factory = new Function(
                'exports',
                'module',
                `${code}\n;return (typeof question !== 'undefined') ? question : module.exports;`
            );
            const result = factory(moduleContext.exports, moduleContext.module);
            return result || moduleContext.module.exports || moduleContext.exports;
        } catch (error) {
            console.error(`Error executing question module ${questionId}:`, error);
            throw error;
        }
    }

    _createPlaceholderQuestion(questionId) {
        const questionNumber = parseInt(questionId.split('-')[1], 10);
        return {
            title: `${questionNumber}. Question Loading Failed`,
            answer: `<p><b>Error:</b> Unable to load content for question ${questionNumber}. Please check your connection and try again.</p>`,
            interactive: {
                title: 'Content Unavailable',
                html: `<div class="p-8 text-center bg-red-50 rounded-lg">
                    <p class="text-red-600">Interactive content could not be loaded.</p>
                    <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Retry
                    </button>
                </div>`,
                script: () => {}
            }
        };
    }

    async preloadQuestions(questionIndices) {
        const preloadPromises = questionIndices.map(index =>
            this.loadQuestion(index).catch(error => {
                console.warn(`Failed to preload question ${index}:`, error);
            })
        );
        await Promise.allSettled(preloadPromises);
    }

    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
    }

    getCacheStats() {
        return {
            cached: this.cache.size,
            loading: this.loadingStates.size,
            cachedQuestions: Array.from(this.cache.keys())
        };
    }
}

window.QuestionLoader = QuestionLoader;
