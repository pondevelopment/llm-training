/**
 * Main Application Logic
 * Handles UI interactions, question navigation, dynamic loading, and deep linking
 */
class LLMQuestionApp {
    constructor() {
        this.questionLoader = new QuestionLoader();
        this.currentQuestionIndex = 0;
        // Only show questions that actually exist
    this.availableQuestions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
        this.totalQuestions = this.availableQuestions.length;
        this.isLoading = false;
        
        this.initializeDOM();
        this.setupEventListeners();
        this.populateQuestionDropdown();
        
        // Initialize with deep link or default to first question
        this.initializeFromURL();
    }
    
    /**
     * Initialize the app based on URL hash for deep linking
     */
    initializeFromURL() {
        const hash = window.location.hash;
        
        if (hash) {
            // Support multiple hash formats:
            // #question-27, #q27, #27, #Question-27, #Q27
            const questionMatch = hash.match(/#(?:question-?|q)?(\d+)/i);
            
            if (questionMatch) {
                const questionNumber = parseInt(questionMatch[1]);
                const questionIndex = this.availableQuestions.indexOf(questionNumber);
                
                if (questionIndex !== -1) {
                    this.currentQuestionIndex = questionIndex;
                    this.displayQuestion(questionIndex);
                    console.log(`Deep link: Navigated to Question ${questionNumber} (index ${questionIndex})`);
                    return;
                } else {
                    console.warn(`Deep link: Question ${questionNumber} not found. Available questions:`, this.availableQuestions);
                    // Show a notification about invalid question number
                    setTimeout(() => {
                        this.showShareNotification(`Question ${questionNumber} not found. Showing Question 1 instead.`, 'error');
                    }, 1000);
                }
            } else {
                console.warn(`Deep link: Invalid hash format: ${hash}`);
            }
        }
        
        // Default to first question if no valid hash
        this.displayQuestion(0);
    }
    
    /**
     * Update URL hash when question changes
     */
    updateURL(questionIndex) {
        const questionNumber = this.availableQuestions[questionIndex];
        const newHash = `#question-${questionNumber}`;
        
        // Update URL without triggering page reload
        if (window.location.hash !== newHash) {
            history.pushState(null, null, newHash);
        }
    }
    
    /**
     * Get shareable URL for current question
     */
    getShareableURL() {
        const questionNumber = this.availableQuestions[this.currentQuestionIndex];
        return `${window.location.origin}${window.location.pathname}#question-${questionNumber}`;
    }

    /**
     * Initialize DOM element references
     */
    initializeDOM() {
        this.elements = {
            questionTitle: document.getElementById('question-title'),
            questionAnswer: document.getElementById('question-answer'),
            progressIndicator: document.getElementById('progress-indicator'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            shareBtn: document.getElementById('share-btn'),
            questionViewer: document.getElementById('question-viewer'),
            questionNavDropdown: document.getElementById('question-nav-dropdown'),
            loadingIndicator: this.createLoadingIndicator()
        };
    }

    /**
     * Create loading indicator element
     */
    createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300';
        indicator.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Loading question...</span>
            </div>
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.elements.nextBtn.addEventListener('click', () => this.showNextQuestion());
        this.elements.prevBtn.addEventListener('click', () => this.showPrevQuestion());
        this.elements.shareBtn.addEventListener('click', () => this.copyShareableLink());
        this.elements.questionNavDropdown.addEventListener('change', () => this.jumpToQuestion());
        
        // Handle browser back/forward for deep linking
        window.addEventListener('popstate', () => {
            this.initializeFromURL();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) return; // Don't interfere with browser shortcuts
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.showPrevQuestion();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.showNextQuestion();
                    break;
                case 'KeyS':
                case 's':
                    if (e.ctrlKey || e.metaKey) return; // Don't interfere with save
                    e.preventDefault();
                    this.copyShareableLink();
                    break;
            }
        });

        // Preload adjacent questions when user pauses
        let navigationTimer;
        const preloadAdjacent = () => {
            clearTimeout(navigationTimer);
            navigationTimer = setTimeout(() => {
                this.preloadAdjacentQuestions();
            }, 1000);
        };

        this.elements.nextBtn.addEventListener('click', preloadAdjacent);
        this.elements.prevBtn.addEventListener('click', preloadAdjacent);
    }

    /**
     * Populate the question navigation dropdown
     */
    populateQuestionDropdown() {
        // Clear existing options
        this.elements.questionNavDropdown.innerHTML = '';
        
        // Define question titles for available questions
        const questionTitles = {
            1: "What does tokenization entail, and why is it critical for LLMs?",
            2: "How does the attention mechanism function in transformer models?",
            3: "What is the context window in LLMs, and why does it matter?",
            4: "What distinguishes LoRA from QLoRA in fine-tuning LLMs?",
            5: "How does beam search improve text generation compared to greedy decoding?",
            6: "What is temperature in text generation and how does it affect output?",
            7: "What are embeddings and how do they enable LLMs to understand semantic meaning?",
            8: "What is RLHF and how does it improve LLM alignment with human preferences?",
            9: "How do autoregressive and masked models differ in LLM training?",
            10: "What are embeddings, and how are they initialized in LLMs?",
            11: "What is next sentence prediction, and how does it enhance LLMs?",
            12: "How do top-k and top-p sampling differ in text generation?",
            13: "Why is prompt engineering crucial for LLM performance?",
            14: "How can LLMs avoid catastrophic forgetting during fine-tuning?",
            15: "What is model distillation, and how does it benefit LLMs?",
            16: "How do LLMs manage out-of-vocabulary (OOV) words?",
            17: "How do transformers improve on traditional Seq2Seq models?",
            18: "What is overfitting, and how can it be mitigated in LLMs?",
            19: "What are generative versus discriminative models in NLP?",
            20: "How does GPT-4 differ from GPT-3 in features and applications?",
            21: "What are positional encodings, and why are they used?",
            22: "What is multi-head attention, and how does it enhance LLMs?",
            23: "How is the softmax function applied in attention mechanisms?",
            24: "How does the dot product contribute to self-attention?",
            25: "Why is cross-entropy loss used in language modeling?",
            26: "How are gradients computed for embeddings in LLMs?",
            27: "What is the Jacobian matrix's role in transformer backpropagation?",
            28: "How do eigenvalues and eigenvectors relate to dimensionality reduction?",
            29: "What is KL divergence, and how is it used in LLMs?",
            30: "What is the derivative of the ReLU function, and why is it significant?",
            31: "How does backpropagation work, and why is the chain rule critical?",
            32: "How are attention scores calculated in transformers?",
            33: "How does Gemini optimize multimodal LLM training?",
            34: "What types of foundation models exist?",
            35: "How does PEFT mitigate catastrophic forgetting?",
            36: "What are the steps in Retrieval-Augmented Generation (RAG)?",
            37: "How does Mixture of Experts (MoE) enhance LLM scalability?",
            38: "What is Chain-of-Thought (CoT) prompting, and how does it aid reasoning?"
        };
        
        this.availableQuestions.forEach((questionNum, index) => {
            const option = document.createElement('option');
            option.value = index; // Use array index for navigation
            option.textContent = `${questionNum}. ${questionTitles[questionNum]}`;
            this.elements.questionNavDropdown.appendChild(option);
        });
    }

    /**
     * Display a question by index
     */
    async displayQuestion(index) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingIndicator();
        
        try {
            // Fade out current content
            this.elements.questionViewer.style.opacity = '0';
            
            // Load question data
            const questionNumber = this.availableQuestions[index];
            const question = await this.questionLoader.loadQuestion(questionNumber);
            
            // Update dropdown option with actual title
            this.updateDropdownOption(index, question.title);
            
            // Wait for fade out to complete
            await this.delay(200);
            
            // Update content
            this.updateQuestionContent(question, index);
            this.updateNavigationState(index);
            
            // Execute interactive script if present
            if (question.interactive && question.interactive.script) {
                try {
                    question.interactive.script();
                } catch (error) {
                    console.error(`Error executing script for question ${index + 1}:`, error);
                    this.showInteractiveError();
                }
            }

            // Render MathJax content
            await this.renderMathJax();
            
            // Fade in new content
            this.elements.questionViewer.style.opacity = '1';
            
            // Update current index
            this.currentQuestionIndex = index;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update URL hash
            this.updateURL(index);
            
        } catch (error) {
            console.error(`Failed to display question ${this.availableQuestions[index]}:`, error);
            this.showQuestionError(this.availableQuestions[index]);
        } finally {
            this.hideLoadingIndicator();
            this.isLoading = false;
        }
    }

    /**
     * Update question content in DOM
     */
    updateQuestionContent(question, questionIndex = null) {
        this.elements.questionTitle.textContent = question.title;
        
        let answerHtml = question.answer;
        
        if (question.interactive) {
            answerHtml += `
                <div class="interactive-container mt-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 class="text-lg font-semibold text-indigo-700 mb-4">${question.interactive.title}</h3>
                    ${question.interactive.html}
                </div>
            `;
        }
        
        this.elements.questionAnswer.innerHTML = answerHtml;
        
        // Use the passed questionIndex or fall back to current index
        const displayIndex = questionIndex !== null ? questionIndex : this.currentQuestionIndex;
        
        // Re-render MathJax after content is loaded with a delay to ensure all content is ready
        setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([this.elements.questionAnswer]).then(() => {
                    console.log(`Question ${displayIndex + 1}: MathJax rendering complete`);
                }).catch((err) => {
                    console.error(`Question ${displayIndex + 1}: MathJax rendering error:`, err);
                    // Try to find specific error elements
                    const mathErrors = this.elements.questionAnswer.querySelectorAll('.MathJax_Error');
                    if (mathErrors.length > 0) {
                        console.error('Math errors found:', mathErrors);
                        mathErrors.forEach((error, errorIndex) => {
                            console.error(`Error ${errorIndex + 1}:`, error.textContent, error);
                        });
                    }
                });
            }
        }, 50);
    }

    /**
     * Update navigation button states and progress
     */
    updateNavigationState(index) {
        this.elements.prevBtn.disabled = index === 0;
        this.elements.nextBtn.disabled = index === this.totalQuestions - 1;
        this.elements.progressIndicator.textContent = `Question ${index + 1} of ${this.totalQuestions} (${this.availableQuestions[index]})`;
        this.elements.questionNavDropdown.value = index;
    }

    /**
     * Update dropdown option with loaded title
     */
    updateDropdownOption(index, title) {
        const option = this.elements.questionNavDropdown.children[index];
        if (option) {
            // Extract just the question text without the number
            const questionText = title.substring(title.indexOf(' ') + 1);
            option.textContent = `${index + 1}. ${questionText}`;
        }
    }

    /**
     * Show next question
     */
    async showNextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            await this.displayQuestion(this.currentQuestionIndex + 1);
        }
    }

    /**
     * Show previous question
     */
    async showPrevQuestion() {
        if (this.currentQuestionIndex > 0) {
            await this.displayQuestion(this.currentQuestionIndex - 1);
        }
    }

    /**
     * Jump to selected question from dropdown
     */
    async jumpToQuestion() {
        const newIndex = parseInt(this.elements.questionNavDropdown.value, 10);
        if (newIndex !== this.currentQuestionIndex) {
            await this.displayQuestion(newIndex);
        }
    }

    /**
     * Preload adjacent questions for better performance
     */
    async preloadAdjacentQuestions() {
        const indicesToPreload = [];
        
        if (this.currentQuestionIndex > 0) {
            const prevQuestionNum = this.availableQuestions[this.currentQuestionIndex - 1];
            indicesToPreload.push(prevQuestionNum);
        }
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            const nextQuestionNum = this.availableQuestions[this.currentQuestionIndex + 1];
            indicesToPreload.push(nextQuestionNum);
        }
        
        if (indicesToPreload.length > 0) {
            this.questionLoader.preloadQuestions(indicesToPreload);
        }
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        this.elements.loadingIndicator.style.opacity = '1';
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        this.elements.loadingIndicator.style.opacity = '0';
    }

    /**
     * Show error when interactive script fails
     */
    showInteractiveError() {
        const interactiveContainer = this.elements.questionAnswer.querySelector('.interactive-container');
        if (interactiveContainer) {
            interactiveContainer.innerHTML = `
                <div class="p-8 text-center bg-red-50 rounded-lg">
                    <p class="text-red-600 mb-4">Interactive component failed to load</p>
                    <button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * Show error when question fails to load
     */
    showQuestionError(questionNumber) {
        this.elements.questionTitle.textContent = `Question ${questionNumber} - Loading Error`;
        this.elements.questionAnswer.innerHTML = `
            <div class="p-8 text-center bg-red-50 rounded-lg">
                <p class="text-red-600 mb-4">Failed to load question ${questionNumber}</p>
                <button onclick="app.displayQuestion(${questionNumber - 1})" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Retry
                </button>
            </div>
        `;
        this.elements.questionViewer.style.opacity = '1';
    }

    /**
     * Utility function for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Render MathJax content with error handling and retry
     */
    async renderMathJax() {
        if (typeof window.MathJax === 'undefined' || !window.MathJax.typesetPromise) {
            console.warn('MathJax not available, skipping math rendering');
            return;
        }

        try {
            console.log('Rendering MathJax content...');
            await window.MathJax.typesetPromise();
            console.log('MathJax rendering completed successfully');
        } catch (error) {
            console.warn('MathJax rendering failed:', error);
            
            // Try the global retry mechanism
            if (typeof window.retryMathJax === 'function') {
                await window.retryMathJax();
            } else {
                // Fallback retry
                setTimeout(async () => {
                    try {
                        await window.MathJax.typesetPromise();
                        console.log('MathJax retry successful');
                    } catch (retryError) {
                        console.error('MathJax retry failed:', retryError);
                    }
                }, 500);
            }
        }
    }

    /**
     * Copy shareable link to clipboard
     */
    async copyShareableLink() {
        const url = this.getShareableURL();
        
        try {
            await navigator.clipboard.writeText(url);
            this.showShareNotification('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(url);
        }
    }
    
    /**
     * Fallback method for copying to clipboard in older browsers
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showShareNotification('Link copied to clipboard!');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showShareNotification('Failed to copy link. Please copy manually from the address bar.', 'error');
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Show share notification
     */
    showShareNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get application statistics
     */
    getStats() {
        return {
            currentQuestion: this.availableQuestions[this.currentQuestionIndex],
            currentIndex: this.currentQuestionIndex + 1,
            totalQuestions: this.totalQuestions,
            availableQuestions: this.availableQuestions,
            cacheStats: this.questionLoader.getCacheStats(),
            currentURL: this.getShareableURL()
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LLMQuestionApp();
    // Update footer question count dynamically
    const footerCount = document.getElementById('footer-total-count');
    if (footerCount && window.app) {
        footerCount.textContent = window.app.totalQuestions;
    }
});
