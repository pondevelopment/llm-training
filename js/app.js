/**
 * LLM Questions App (clean refactor)
 * - Hash based navigation (#question-N, #qN, #N)
 * - Landing page shown when no hash
 * - Learning path navigation with banner + indicator
 * - Shareable link copying (/q/N.html)
 */
class LLMQuestionApp {
    constructor() {
        this.questionLoader = new QuestionLoader();
    this.availableQuestions = Array.from({ length: 56 }, (_, i) => i + 1);
        this.totalQuestions = this.availableQuestions.length;
        this.currentQuestionIndex = 0;
        this.isLoading = false;
    this.queuedIndex = null; // for queued navigation during in-flight load

        // Landing + path state
        this.landingRoot = document.getElementById('landing-root');
        this.mainElement = document.querySelector('main');
        this.activePath = null; // { key, sequence, pos, difficulty }
        // New structured path definitions with difficulty (>=3 questions each)
        this.pathDefinitions = {
            foundations: { label: 'Foundations', difficulty: 'beginner', questions: [1,2,3,7,21,54] },
            // Start generation path with the taxonomy (Q53) before individual techniques
            generation: { label: 'Generation Strategies', difficulty: 'intermediate', questions: [53,55,5,6,12,23,38] },
            training: { label: 'Training & Optimization', difficulty: 'intermediate', questions: [24,25,26,30,31] },
            scaling: { label: 'Scaling & Efficiency', difficulty: 'advanced', questions: [32,33,36,37,42] },
            alignment: { label: 'Alignment & Evaluation', difficulty: 'advanced', questions: [8,13,19,41,44,45,50] }
        };

        this.initDOM();
        this.bindEvents();
        this.populateQuestionDropdown();
        this.setupLandingInteractions();
        this.initFromHash();
        this.updatePathUI();
    }

    /* -------------- DOM -------------- */
    initDOM() {
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

    createLoadingIndicator() {
        const el = document.createElement('div');
        el.id = 'loading-indicator';
        el.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 opacity-0 transition-opacity duration-300';
        el.innerHTML = `<div class="flex items-center space-x-2"><div class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div><span>Loading...</span></div>`;
        document.body.appendChild(el);
        return el;
    }

    bindEvents() {
        this.elements.nextBtn.addEventListener('click', () => this.showNext());
        this.elements.prevBtn.addEventListener('click', () => this.showPrev());
        this.elements.shareBtn.addEventListener('click', () => this.copyShareableLink());
        this.elements.questionNavDropdown.addEventListener('change', () => this.jumpTo());
        window.addEventListener('hashchange', () => this.onHashChange());
        window.addEventListener('popstate', () => this.onHashChange());
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.metaKey) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.showPrev(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); this.showNext(); }
            else if (e.key.toLowerCase() === 's') { e.preventDefault(); this.copyShareableLink(); }
        });
        let navTimer; const schedule = () => { clearTimeout(navTimer); navTimer = setTimeout(()=>this.preloadAdjacent(),800); };
        this.elements.nextBtn.addEventListener('click', schedule);
        this.elements.prevBtn.addEventListener('click', schedule);
    }

    /* -------------- Hash / Routing -------------- */
    // Return canonical hash for a question number (no leading zeroes)
    canonicalHash(q){ return `#question-${q}`; }
    // Parse current hash, allow legacy forms: #question07, #question-07, #q7, #7
    parseHash(){
        const h = window.location.hash;
        if(!h || h==='#') return null;
        const m = h.match(/^#(?:question-?|q)?0*(\d{1,3})$/i);
        if(!m) return null;
        const q = parseInt(m[1],10);
        if(!Number.isFinite(q) || q < 1) return null;
        return q;
    }
    initFromHash(){
        const q = this.parseHash();
        if(!q){ this.showLanding(); return; }
        // Normalize hash immediately if non‑canonical (leading zeros or alt form)
        const desired = this.canonicalHash(q);
        if(window.location.hash !== desired){
            // Use replaceState so we don't bloat history for normalization
            history.replaceState(null,'',desired);
        }
        const idx = this.availableQuestions.indexOf(q);
        if(idx!==-1){ this.hideLanding(); this.displayQuestion(idx,{replace:true}); } else { this.showLanding(); this.notify(`Question ${q} not found`,'error'); }
    }
    onHashChange(){ this.initFromHash(); }
    updateURL(i, { replace=false } = {}){
        const q = this.availableQuestions[i];
        const h = this.canonicalHash(q);
        if(window.location.hash === h) return;
        if(replace){
            history.replaceState(null,'',h);
            // Fallback: if hash did not update (some browsers), force it
            if(window.location.hash !== h){ window.location.hash = h; }
        } else {
            window.location.hash = h; // pushes history (expected for explicit navigation)
        }
    }
    getShareableURL(){ const q=this.availableQuestions[this.currentQuestionIndex]; const base=`${window.location.origin}${window.location.pathname}`.replace(/[^/]+$/,''); return `${base}q/${q}.html`; }

    /* -------------- Landing & Paths -------------- */
    showLanding(){ if(this.landingRoot) this.landingRoot.classList.remove('hidden'); if(this.mainElement) this.mainElement.classList.add('hidden'); }
    hideLanding(){ if(this.landingRoot) this.landingRoot.classList.add('hidden'); if(this.mainElement) this.mainElement.classList.remove('hidden'); }
    setupLandingInteractions(){ if(!this.landingRoot) return; const pathButtons=this.landingRoot.querySelectorAll('[data-path]'); const heroBtn=document.getElementById('hero-foundations-btn'); const start=(key)=>{const def=this.pathDefinitions[key]; if(!def||!def.questions?.length) return; this.activePath={ key, sequence:def.questions.slice(), pos:0 }; window.location.hash=`#question-${def.questions[0]}`; this.updatePathUI();}; pathButtons.forEach(b=>b.addEventListener('click',()=>start(b.getAttribute('data-path')))); if(heroBtn) heroBtn.addEventListener('click',()=>start('foundations')); const titleEl=document.querySelector('header h1'); if(titleEl){ titleEl.style.cursor='pointer'; titleEl.title='Return to landing page'; titleEl.addEventListener('click',()=>{ history.pushState(null,'','#'); this.exitPath(); this.showLanding(); }); } }
    exitPath(){ this.activePath=null; this.updatePathUI(); }
    syncActivePath(q){ if(!this.activePath) return; const i=this.activePath.sequence.indexOf(q); if(i===-1) this.activePath=null; else this.activePath.pos=i; }
        getPathGradient(key){
                const diff = this.pathDefinitions[key]?.difficulty;
                switch(diff){
                        case 'beginner': return 'from-indigo-50 to-indigo-100 border-indigo-200';
                        case 'intermediate': return 'from-purple-50 to-purple-100 border-purple-200';
                        case 'advanced': return 'from-rose-50 to-rose-100 border-rose-200';
                        default: return 'from-slate-50 to-slate-100 border-slate-200';
                }
        }
        difficultyStars(level){
                if(level==='beginner') return '★☆☆';
                if(level==='intermediate') return '★★☆';
                if(level==='advanced') return '★★★';
                return '';
        }
        buildBannerHTML(nice,pos,total,key){
                const def = this.pathDefinitions[key];
                const diff = def?.difficulty || '';
                const stars = this.difficultyStars(diff);
                const atStart=pos===0, atEnd=pos===total-1, pct=((pos+1)/total)*100;
                return `<div class="flex items-center justify-between flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <div class="font-semibold tracking-wide uppercase text-xs">Learning Path</div>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/70 border">${diff} ${stars}</span>
                        </div>
                        <button type="button" id="path-banner-exit" class="text-xs px-2 py-1 rounded bg-white/70 hover:bg-white border">Exit Path</button>
                    </div>
                    <div class="flex items-center flex-wrap gap-3">
                        <h3 class="text-base font-bold">${nice} Path</h3>
                        <span class="text-xs font-mono px-2 py-0.5 rounded bg-white/70 border">${pos+1} / ${total}</span>
                        <div class="h-2 flex-1 rounded bg-white/40 overflow-hidden min-w-[140px]">
                            <div class="h-full bg-gray-800/50" style="width:${pct}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center flex-wrap gap-2 pt-1">
                        <button id="path-prev" ${atStart?'disabled':''} class="text-xs px-3 py-1 rounded border bg-white/70 hover:bg-white disabled:opacity-40">Prev</button>
                        <button id="path-next" class="text-xs px-3 py-1 rounded border bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">${atEnd?'Finish':'Next'}</button>
                        ${atEnd?'<span class="text-xs text-gray-600">End of path</span>':''}
                    </div>`;
        }
        updatePathUI(){
                const indicator=document.getElementById('path-indicator');
                const label=document.getElementById('path-indicator-label');
                const exitBtn=document.getElementById('path-exit-btn');
                const banner=document.getElementById('path-banner');
                if(!indicator||!label||!exitBtn) return;
                if(!this.activePath){
                        indicator.classList.add('hidden');
                        if(banner) banner.classList.add('hidden');
                        this.elements.nextBtn.title='Next question';
                        this.elements.prevBtn.title='Previous question';
                        return;
                }
                const {key,sequence,pos}=this.activePath; const def=this.pathDefinitions[key];
                const total=sequence.length; const nice=def?.label || (key[0].toUpperCase()+key.slice(1));
                const diff=def?.difficulty; const stars=this.difficultyStars(diff);
                label.textContent=`${nice} ${pos+1}/${total} ${stars}`;
                indicator.classList.remove('hidden');
                this.elements.nextBtn.title= pos<total-1 ? `Next in ${nice} (${pos+2}/${total})` : 'End of path';
                this.elements.prevBtn.title= pos>0 ? `Prev in ${nice} (${pos}/${total})` : 'Start of path';
                if(banner){
                        banner.classList.remove('hidden');
                        banner.className=`mb-5 p-4 rounded-lg border text-sm flex flex-col gap-3 bg-gradient-to-r ${this.getPathGradient(key)} text-gray-800 shadow-sm`;
                        banner.innerHTML=this.buildBannerHTML(nice,pos,total,key);
                        banner.querySelector('#path-banner-exit')?.addEventListener('click',()=>this.exitPath());
                        banner.querySelector('#path-prev')?.addEventListener('click',()=>{ if(pos>0) this.displayQuestion(this.availableQuestions.indexOf(sequence[pos-1])); });
                        banner.querySelector('#path-next')?.addEventListener('click',()=>{ if(pos<total-1) this.displayQuestion(this.availableQuestions.indexOf(sequence[pos+1])); else { this.notify(`${nice} path complete!`); this.exitPath(); }});
                }
                exitBtn.onclick=()=>this.exitPath();
        }

    /* -------------- Questions -------------- */
    async displayQuestion(index,{replace=false}={}){
        // Always update URL immediately to reflect user intent
        try { this.updateURL(index,{ replace }); } catch(_) {}
        // Queue if already loading (URL already reflects target)
        if(this.isLoading){ this.queuedIndex = index; return; }
        this.hideLanding();
        this.isLoading = true;
        this.showLoading();
    const qNum = this.availableQuestions[index];
        // (URL already updated above)
        let previousIndex = this.currentQuestionIndex;
        try {
            this.elements.questionViewer.style.opacity='0';
            const question = await this.questionLoader.loadQuestion(qNum);
            this.updateDropdownOption(index,question.title);
            await this.delay(80);
            this.updateQuestionContent(question,index);
            this.updateNavState(index);
            if(question.interactive?.script){
                try { question.interactive.script(); }
                catch(e){ console.error(e); this.showInteractiveError(); }
            }
            await this.renderMath();
            this.elements.questionViewer.style.opacity='1';
            this.currentQuestionIndex = index;
            this.syncActivePath(qNum);
            this.updatePathUI();
            window.scrollTo({top:0,behavior:'smooth'});
        } catch(e){
            console.error('Display failed', e);
            // Revert hash if load failed
            this.updateURL(previousIndex, { replace:true });
            this.showQuestionError(this.availableQuestions[index]);
        } finally {
            this.hideLoading();
            this.isLoading = false;
            // Process queued navigation if any (single-step coalescing)
            if(this.queuedIndex !== null && this.queuedIndex !== this.currentQuestionIndex){
                const next = this.queuedIndex; this.queuedIndex = null; this.displayQuestion(next,{replace:false});
            } else {
                this.queuedIndex = null;
            }
        }
    }
    async showNext(){ if(this.activePath){ if(this.activePath.pos < this.activePath.sequence.length-1){ const nextQ=this.activePath.sequence[this.activePath.pos+1]; return this.displayQuestion(this.availableQuestions.indexOf(nextQ)); } else { const done=this.activePath.key; this.exitPath(); this.notify(`Completed ${done} path!`); }} if(this.currentQuestionIndex < this.totalQuestions-1) await this.displayQuestion(this.currentQuestionIndex+1); }
    async showPrev(){ if(this.activePath){ if(this.activePath.pos>0){ const prevQ=this.activePath.sequence[this.activePath.pos-1]; return this.displayQuestion(this.availableQuestions.indexOf(prevQ)); } else { this.exitPath(); }} if(this.currentQuestionIndex>0) await this.displayQuestion(this.currentQuestionIndex-1); }
    async jumpTo(){ const newIdx=parseInt(this.elements.questionNavDropdown.value,10); if(newIdx!==this.currentQuestionIndex) await this.displayQuestion(newIdx); }
    async preloadAdjacent(){ const list=[]; if(this.currentQuestionIndex>0) list.push(this.availableQuestions[this.currentQuestionIndex-1]); if(this.currentQuestionIndex<this.totalQuestions-1) list.push(this.availableQuestions[this.currentQuestionIndex+1]); if(list.length) this.questionLoader.preloadQuestions(list); }

    /* -------------- UI Helpers -------------- */
    populateQuestionDropdown(){ const titles={1:"What does tokenization entail, and why is it critical for LLMs?",2:"How does the attention mechanism function in transformer models?",3:"What is the context window in LLMs, and why does it matter?",4:"What distinguishes LoRA from QLoRA in fine-tuning LLMs?",5:"How does beam search improve text generation compared to greedy decoding?",6:"What is temperature in text generation and how does it affect output?",7:"What are embeddings and how do they enable LLMs to understand semantic meaning?",8:"What is RLHF and how does it improve LLM alignment with human preferences?",9:"How do autoregressive and masked models differ in LLM training?",10:"What are embeddings, and how are they initialized in LLMs?",11:"What is next sentence prediction, and how does it enhance LLMs?",12:"How do top-k and top-p sampling differ in text generation?",13:"Why is prompt engineering crucial for LLM performance?",14:"How can LLMs avoid catastrophic forgetting during fine-tuning?",15:"What is model distillation, and how does it benefit LLMs?",16:"How do LLMs manage out-of-vocabulary (OOV) words?",17:"How do transformers improve on traditional Seq2Seq models?",18:"What is overfitting, and how can it be mitigated in LLMs?",19:"What are generative versus discriminative models in NLP?",20:"How do GPT-3, GPT-4, and GPT-5 differ in features and applications?",21:"What are positional encodings, and why are they used?",22:"What is multi-head attention, and how does it enhance LLMs?",23:"How is the softmax function applied in attention mechanisms?",24:"How does the dot product contribute to self-attention?",25:"Why is cross-entropy loss used in language modeling?",26:"How are gradients computed for embeddings in LLMs?",27:"What is the Jacobian matrix's role in transformer backpropagation?",28:"How do eigenvalues and eigenvectors relate to dimensionality reduction?",29:"What is KL divergence, and how is it used in LLMs?",30:"What is the derivative of the ReLU function, and why is it significant?",31:"How does backpropagation work, and why is the chain rule critical?",32:"How are attention scores calculated in transformers?",33:"How does Gemini optimize multimodal LLM training?",34:"What types of foundation models exist?",35:"How does PEFT mitigate catastrophic forgetting?",36:"What are the steps in Retrieval-Augmented Generation (RAG)?",37:"How does Mixture of Experts (MoE) enhance LLM scalability?",38:"What is Chain-of-Thought (CoT) prompting, and how does it aid reasoning?",39:"How do discriminative and generative AI models differ?",40:"How does knowledge graph integration improve LLMs?",41:"What is zero-shot learning, and how do LLMs implement it?",42:"How does Adaptive Softmax optimize LLMs?",43:"How do transformers address the vanishing gradient problem?",44:"What is few-shot learning, and what are its benefits?",45:"How would you fix an LLM generating biased or incorrect outputs?",46:"How do encoders and decoders differ in transformers?",47:"How do LLMs differ from traditional statistical language models?",48:"What is a hyperparameter, and why is it important?",49:"What defines a Large Language Model (LLM)?",50:"What challenges do LLMs face in deployment?",51:"What is an LLM, and how are LLMs trained end-to-end?",52:"How do you estimate and compare SaaS vs self-host LLM costs?",53:"What are decoding strategies for selecting output tokens?",54:"What are logits, and why don't LLMs output probabilities directly?",55:"How do you decide when to stop generating text with an LLM?",56:"When should I use Fine-tuning instead of RAG?"}; this.elements.questionNavDropdown.innerHTML=''; this.availableQuestions.forEach((q,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=`${q}. ${titles[q]}`; this.elements.questionNavDropdown.appendChild(o); }); }
    updateQuestionContent(question,idx){
        this.elements.questionTitle.textContent=question.title;
        let html=question.answer;
        if(question.interactive){
            html+=`\n<div class="interactive-container mt-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">\n  <h3 class="text-lg font-semibold text-indigo-700 mb-4">${question.interactive.title}</h3>\n  ${question.interactive.html}\n</div>`;
        }
        this.elements.questionAnswer.innerHTML=html;
        // Normalize internal anchors (#question-0N or #question0N -> #question-N)
        this.normalizeAnchors();
        setTimeout(()=>{ if(window.MathJax?.typesetPromise){ window.MathJax.typesetClear&&window.MathJax.typesetClear(); window.MathJax.typesetPromise([this.elements.questionAnswer]).catch(()=>{}); } },40);
    }
    normalizeAnchors(){
        const anchors = this.elements.questionAnswer.querySelectorAll('a[href^="#question"],a[href^="#q"],a[href^="#0"],a[href^="#question-0"],a[href^="#question0"]');
        anchors.forEach(a=>{
            const href = a.getAttribute('href');
            if(!href) return;
            const m = href.match(/^#(?:question-?|q)?0*(\d{1,3})$/i);
            if(m){
                const q = parseInt(m[1],10);
                if(q>=1 && q<=this.totalQuestions){
                    a.setAttribute('href', this.canonicalHash(q));
                    a.addEventListener('click', (e)=>{
                        e.preventDefault();
                        this.displayQuestion(this.availableQuestions.indexOf(q));
                    }, { once:true });
                }
            }
        });
    }
    updateNavState(i){ this.elements.prevBtn.disabled=i===0; this.elements.nextBtn.disabled=i===this.totalQuestions-1; this.elements.progressIndicator.textContent=`Question ${i+1} of ${this.totalQuestions} (${this.availableQuestions[i]})`; this.elements.questionNavDropdown.value=i; }
    updateDropdownOption(i,title){ const opt=this.elements.questionNavDropdown.children[i]; if(opt){ const qText=title.substring(title.indexOf(' ')+1); opt.textContent=`${i+1}. ${qText}`; } }
    showLoading(){ this.elements.loadingIndicator.style.opacity='1'; }
    hideLoading(){ this.elements.loadingIndicator.style.opacity='0'; }
    showInteractiveError(){ const el=this.elements.questionAnswer.querySelector('.interactive-container'); if(el) el.innerHTML='<div class="p-8 text-center bg-red-50 rounded-lg"><p class="text-red-600 mb-4">Interactive component failed to load</p><button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reload Page</button></div>'; }
    showQuestionError(q){ this.elements.questionTitle.textContent=`Question ${q} - Loading Error`; this.elements.questionAnswer.innerHTML=`<div class=\"p-8 text-center bg-red-50 rounded-lg\"><p class=\"text-red-600 mb-4\">Failed to load question ${q}</p><button onclick=\"app.displayQuestion(${q-1})\" class=\"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700\">Retry</button></div>`; this.elements.questionViewer.style.opacity='1'; }
    delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async renderMath(){ if(!window.MathJax?.typesetPromise) return; try{ await window.MathJax.typesetPromise(); }catch(e){ if(typeof window.retryMathJax==='function') await window.retryMathJax(); } }
    async copyShareableLink(){ const url=this.getShareableURL(); try{ await navigator.clipboard.writeText(url); this.notify('Link copied to clipboard!'); } catch { this.fallbackCopy(url); } }
    fallbackCopy(text){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); this.notify('Link copied to clipboard!'); } catch { this.notify('Failed to copy link. Copy manually.','error'); } ta.remove(); }
    notify(msg,type='success'){ const el=document.createElement('div'); el.className=`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${type==='success'?'bg-green-600 text-white':'bg-red-600 text-white'}`; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>{el.style.transform='translateX(0)';},10); setTimeout(()=>{el.style.transform='translateX(120%)'; setTimeout(()=>el.remove(),300);},3000); }
    getStats(){ return { currentQuestion:this.availableQuestions[this.currentQuestionIndex], currentIndex:this.currentQuestionIndex+1, totalQuestions:this.totalQuestions, availableQuestions:this.availableQuestions, cacheStats:this.questionLoader.getCacheStats(), currentURL:this.getShareableURL() }; }
}

window.addEventListener('DOMContentLoaded',()=>{ window.app=new LLMQuestionApp(); const footerCount=document.getElementById('footer-total-count'); if(footerCount&&window.app) footerCount.textContent=window.app.totalQuestions; });
