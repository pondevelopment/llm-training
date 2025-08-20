/**
 * Question Loader - Dynamically loads question content from separate files
 */
class QuestionLoader {
    constructor() {
        this.cache = new Map();
        this.loadingStates = new Map();
    }

    /**
     * Load a question by index (1-based)
     * @param {number} questionIndex - The question number (1-50)
     * @returns {Promise<Object>} Question object with title, answer, and interactive content
     */
    async loadQuestion(questionIndex) {
        const questionId = `question-${questionIndex.toString().padStart(2, '0')}`;
        
        // Return from cache if already loaded
        if (this.cache.has(questionId)) {
            return this.cache.get(questionId);
        }

        // Check if already loading to prevent duplicate requests
        if (this.loadingStates.has(questionId)) {
            return this.loadingStates.get(questionId);
        }

        // Create loading promise
        const loadingPromise = this._fetchQuestion(questionId);
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

    /**
     * Fetch question data from file
     * @private
     */
    async _fetchQuestion(questionId) {
        try {
            const noCache = typeof window !== 'undefined' && window.__DEV_NO_CACHE__;
            const url = `./questions/${questionId}.js${noCache ? `?t=${Date.now()}` : ''}`;
            const response = await fetch(url, { cache: noCache ? 'no-store' : 'default' });
            if (!response.ok) {
                throw new Error(`Failed to load question: ${response.status}`);
            }
            
            const questionCode = await response.text();
            
            // Create a safe execution context for the question module
            const questionModule = this._executeQuestionModule(questionCode, questionId);
            
            return questionModule;
        } catch (error) {
            console.error(`Error loading question ${questionId}:`, error);
            
            // Return placeholder question for failed loads
            return this._createPlaceholderQuestion(questionId);
        }
    }

    /**
     * Safely execute question module code
     * @private
     */
    _executeQuestionModule(code, questionId) {
        try {
            // Create isolated execution context
            const moduleContext = {
                exports: {},
                module: { exports: {} }
            };
            
            // Wrap the code in a function to isolate it
            const wrappedCode = `
                (function(exports, module) {
                    ${code}
                    return typeof question !== 'undefined' ? question : module.exports;
                })(moduleContext.exports, moduleContext.module);
            `;
            
            const result = eval(wrappedCode);
            return result || moduleContext.module.exports || moduleContext.exports;
        } catch (error) {
            console.error(`Error executing question module ${questionId}:`, error);
            throw error;
        }
    }

    /**
     * Create placeholder question for failed loads
     * @private
     */
    _createPlaceholderQuestion(questionId) {
        const questionNumber = parseInt(questionId.split('-')[1]);
        
        return {
            title: `${questionNumber}. Question Loading Failed`,
            answer: `<p><b>Error:</b> Unable to load content for question ${questionNumber}. Please check your connection and try again.</p>`,
            interactive: {
                title: "Content Unavailable",
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

    /**
     * Preload questions for better performance
     * @param {number[]} questionIndices - Array of question numbers to preload
     */
    async preloadQuestions(questionIndices) {
        const preloadPromises = questionIndices.map(index => 
            this.loadQuestion(index).catch(error => {
                console.warn(`Failed to preload question ${index}:`, error);
            })
        );
        
        await Promise.allSettled(preloadPromises);
    }

    /**
     * Clear cache (useful for development/testing)
     */
    clearCache() {
        this.cache.clear();
        this.loadingStates.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cached: this.cache.size,
            loading: this.loadingStates.size,
            cachedQuestions: Array.from(this.cache.keys())
        };
    }
}

// Export for use in main app
window.QuestionLoader = QuestionLoader;
