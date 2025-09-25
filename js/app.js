/* global QuestionLoader, PaperLoader */
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
        this.paperLoader = new PaperLoader();
        this.availableQuestions = Array.from({ length: 57 }, (_, i) => i + 1);
        this.totalQuestions = this.availableQuestions.length;
        this.currentQuestionIndex = 0;
        this.currentPaperIndex = -1;
        this.isLoading = false;
        this.mode = "question";
        this.availablePapers = [];
        this.totalPapers = 0;
        this.paperMeta = {};
        this.pendingPaperId = null;
        this.papersReady = null;
        this.queuedIndex = null; // for queued navigation during in-flight load

        // Landing + path state
        this.landingRoot = document.getElementById('landing-root');
        this.mainElement = document.querySelector('main');
        this.activePath = null; // { key, sequence, pos, difficulty }
        // New structured path definitions with difficulty (>=3 questions each)
        this.pathDefinitions = {
            foundations: { label: 'Foundations', difficulty: 'beginner', questions: [1,2,3,57,7,21,54] },
            // Start generation path with the taxonomy (Q53) before individual techniques
            generation: { label: 'Generation Strategies', difficulty: 'intermediate', questions: [53,55,5,6,12,23,38] },
            training: { label: 'Training & Optimization', difficulty: 'intermediate', questions: [24,25,26,30,31] },
            scaling: { label: 'Scaling & Efficiency', difficulty: 'advanced', questions: [32,33,36,37,42] },
            alignment: { label: 'Alignment & Evaluation', difficulty: 'advanced', questions: [8,13,19,41,44,45,50] }
        };

        this.initDOM();
        if (this.elements.footerQuestionCount) {
            this.elements.footerQuestionCount.textContent = this.totalQuestions;
        }
        this.updateFooterPaperCount(0);
        this.syncModeUI();
        this.bindEvents();
        this.populateQuestionDropdown();
        this.setupLandingInteractions();
        this.papersReady = this.initPapers();
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
            navControls: document.getElementById('question-nav'),
            questionNavDropdown: document.getElementById('question-nav-dropdown'),
            paperViewer: document.getElementById('paper-viewer'),
            paperIdentifier: document.getElementById('paper-identifier'),
            paperVenue: document.getElementById('paper-venue'),
            paperTitle: document.getElementById('paper-title'),
            paperAuthors: document.getElementById('paper-authors'),
            paperTags: document.getElementById('paper-tags'),
            paperSummary: document.getElementById('paper-summary'),
            paperRelatedSection: document.getElementById('paper-related'),
            paperRelatedList: document.getElementById('paper-related-list'),
            paperOverview: document.getElementById('paper-overview'),
            paperInteractive: document.getElementById('paper-interactive'),
            paperInteractiveTitle: document.getElementById('paper-interactive-title'),
            paperInteractiveBody: document.getElementById('paper-interactive-body'),
            paperShareBtn: document.getElementById('paper-share-btn'),
            paperBackBtn: document.getElementById('paper-back-btn'),
            footerQuestionCount: document.getElementById('footer-total-count'),
            footerPaperCount: document.getElementById('footer-paper-count'),
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
        if(this.elements.nextBtn) this.elements.nextBtn.addEventListener('click', () => this.showNext());
        if(this.elements.prevBtn) this.elements.prevBtn.addEventListener('click', () => this.showPrev());
        if(this.elements.shareBtn) this.elements.shareBtn.addEventListener('click', () => this.copyShareableLink());
        if(this.elements.questionNavDropdown) this.elements.questionNavDropdown.addEventListener('change', () => this.jumpTo());
        if(this.elements.paperShareBtn) this.elements.paperShareBtn.addEventListener('click', () => this.copyPaperLink());
        if(this.elements.paperBackBtn) this.elements.paperBackBtn.addEventListener('click', () => this.exitPaperView());
        if(this.elements.paperRelatedList){
            this.elements.paperRelatedList.addEventListener('click', evt => {
                const target = evt.target.closest('[data-related-question]');
                if(!target) return;
                const q = Number(target.getAttribute('data-related-question'));
                if(!Number.isFinite(q) || q < 1) return;
                const idx = this.availableQuestions.indexOf(q);
                if(idx === -1){
                    this.notify(`Question ${q} not found`,'error');
                    return;
                }
                this.displayQuestion(idx,{ replace:false });
            });
        }
        window.addEventListener('hashchange', () => this.onHashChange());
        window.addEventListener('popstate', () => this.onHashChange());
        document.addEventListener('keydown', e => {
            if (e.ctrlKey || e.metaKey) return;
            const key = e.key.toLowerCase();
            if(this.mode === 'paper'){
                if(key === 's'){ e.preventDefault(); this.copyPaperLink(); }
                else if(e.key === 'Escape'){ e.preventDefault(); this.exitPaperView(); }
                return;
            }
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.showPrev(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); this.showNext(); }
            else if (key === 's') { e.preventDefault(); this.copyShareableLink(); }
        });
        let navTimer; const schedule = () => { clearTimeout(navTimer); navTimer = setTimeout(()=>this.preloadAdjacent(),800); };
        if(this.elements.nextBtn) this.elements.nextBtn.addEventListener('click', schedule);
        if(this.elements.prevBtn) this.elements.prevBtn.addEventListener('click', schedule);
    }

    /* -------------- Hash / Routing -------------- */
    canonicalHash(q){ return `#question-${q}`; }
    canonicalPaperHash(p){ return `#paper-${p}`; }
    parseHash(){
        const h = window.location.hash;
        if(!h || h==='#') return null;
        const paperMatch = h.match(/^#paper-?0*(\d{1,3})$/i);
        if(paperMatch){
            const id = parseInt(paperMatch[1],10);
            if(Number.isFinite(id) && id > 0){
                return { type:'paper', id };
            }
            return null;
        }
        const questionMatch = h.match(/^#(?:question-?|q)?0*(\d{1,3})$/i);
        if(!questionMatch) return null;
        const q = parseInt(questionMatch[1],10);
        if(!Number.isFinite(q) || q < 1) return null;
        return { type:'question', id:q };
    }
    initFromHash(){
        const route = this.parseHash();
        if(!route){ this.showLanding(); return; }
        if(route.type === 'paper'){
            const desiredPaper = this.canonicalPaperHash(route.id);
            if(window.location.hash !== desiredPaper){
                history.replaceState(null,'',desiredPaper);
            }
            this.hideLanding();
            this.showPaper(route.id,{replace:true});
            return;
        }
        const q = route.id;
        const desired = this.canonicalHash(q);
        if(window.location.hash !== desired){
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
    updatePaperURL(id,{replace=false}={}){
        const h = this.canonicalPaperHash(id);
        if(window.location.hash === h) return;
        if(replace){
            history.replaceState(null,'',h);
            if(window.location.hash !== h){ window.location.hash = h; }
        } else {
            window.location.hash = h;
        }
    }
    getShareableURL(){ const q=this.availableQuestions[this.currentQuestionIndex]; const base=`${window.location.origin}${window.location.pathname}`.replace(/[^/]+$/,''); return `${base}q/${q}.html`; }
    getQuestionTitle(q){
        if(this.questionTitleMap && this.questionTitleMap[q]){
            return this.questionTitleMap[q];
        }
        return `Question ${q}`;
    }

    syncModeUI(){
        const isQuestion = this.mode !== 'paper';
        if(this.elements.questionViewer){ this.elements.questionViewer.classList.toggle('hidden', !isQuestion); }
        if(this.elements.navControls){ this.elements.navControls.classList.toggle('hidden', !isQuestion); }
        if(this.elements.paperViewer){ this.elements.paperViewer.classList.toggle('hidden', isQuestion); }
    }
    setMode(mode){
        this.mode = mode === 'paper' ? 'paper' : 'question';
        this.syncModeUI();
    }

    /* -------------- Landing & Paths -------------- */
    showLanding(){ if(this.landingRoot) this.landingRoot.classList.remove('hidden'); if(this.mainElement) this.mainElement.classList.add('hidden'); this.setMode('question'); }
    hideLanding(){ if(this.landingRoot) this.landingRoot.classList.add('hidden'); if(this.mainElement) this.mainElement.classList.remove('hidden'); }
    setupLandingInteractions(){ if(!this.landingRoot) return; const pathButtons=this.landingRoot.querySelectorAll('[data-path]'); const heroBtn=document.getElementById('hero-foundations-btn'); const start=(key)=>{const def=this.pathDefinitions[key]; if(!def||!def.questions?.length) return; this.activePath={ key, sequence:def.questions.slice(), pos:0 }; window.location.hash=`#question-${def.questions[0]}`; this.updatePathUI();}; pathButtons.forEach(b=>b.addEventListener('click',()=>start(b.getAttribute('data-path')))); if(heroBtn) heroBtn.addEventListener('click',()=>start('foundations')); const titleEl=document.querySelector('header h1'); if(titleEl){ titleEl.style.cursor='pointer'; titleEl.title='Return to landing page'; titleEl.addEventListener('click',()=>{ history.pushState(null,'','#'); this.exitPath(); this.showLanding(); }); } }
    initPapers(){
        const section=document.getElementById('papers-section');
        const grid=document.getElementById('papers-grid');
        if(!section || !grid){
            this.updateFooterPaperCount(0);
            return Promise.resolve([]);
        }
        section.hidden = true;
        grid.innerHTML = '';
        this.updateFooterPaperCount(0);
        return this.paperLoader.getManifest()
            .then(manifest => {
                if(!manifest || typeof manifest !== 'object'){
                    this.updateFooterPaperCount(0);
                    return [];
                }
                const entries = Object.entries(manifest)
                    .map(([key,value]) => ({ id: Number(key), meta: value }))
                    .filter(item => Number.isFinite(item.id) && item.id > 0)
                    .sort((a,b) => b.id - a.id);
                this.availablePapers = entries.map(item => item.id);
                this.paperMeta = manifest;
                this.updateFooterPaperCount(entries.length);
                if(!entries.length){
                    return [];
                }
                grid.innerHTML = entries.map(entry => this.renderPaperCard(entry)).join('');
                section.hidden = false;
                return entries.map(entry => entry.id);
            })
            .catch(err => {
                console.error('Failed to initialize papers section', err);
                grid.innerHTML = '<div class="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">Paper explainers are temporarily unavailable.</div>';
                section.hidden = false;
                this.updateFooterPaperCount(0);
                return [];
            });
    }
    renderPaperCard(entry){
        const id = entry?.id ?? 0;
        const meta = entry?.meta || {};
        const safeId = Number.isFinite(id) && id > 0 ? id : 1;
        const niceId = safeId.toString().padStart(2,'0');
        const title = this.escapeHtml(meta.title || `Paper ${safeId}`);
        const summary = this.escapeHtml(meta.summary || 'Interactive overview coming soon.');
        const authors = Array.isArray(meta.authors) ? meta.authors.join(', ') : '';
        const authorHtml = authors ? `<p class="text-xs text-muted-soft">By ${this.escapeHtml(authors)}</p>` : '';
        const venueParts = [];
        if(meta.venue) venueParts.push(meta.venue);
        if(meta.year) venueParts.push(String(meta.year));
        const venueHtml = venueParts.length ? `<p class="text-xs text-muted-soft">${this.escapeHtml(venueParts.join(' &bull; '))}</p>` : '';
        const tags = Array.isArray(meta.tags) ? meta.tags.slice(0,3) : [];
        const tagChips = tags.map(tag => `<span class="tag-chip">${this.escapeHtml(tag)}</span>`).join('');
        const tagsHtml = tagChips ? `<div class="flex flex-wrap gap-1.5">${tagChips}</div>` : '';
        const shareHref = `p/${safeId}.html`;
        const routeHref = this.canonicalPaperHash(safeId);
        return `<article class="p-4 rounded-xl border border-divider bg-card flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-start justify-between gap-3">
    <div>
      <div class="text-xs font-mono text-muted-soft">#${niceId}</div>
      <h3 class="text-base font-semibold text-heading leading-snug">${title}</h3>
      ${venueHtml}
    </div>
    <a href="${shareHref}" class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-secondary border border-divider rounded-md hover:bg-subtle transition-colors" title="Open share page for this paper">Share</a>
  </div>
  <p class="text-sm text-muted leading-snug">${summary}</p>
  ${authorHtml}
  <div class="flex items-center justify-between gap-2 pt-2">
    <a href="${routeHref}" data-paper="${safeId}" class="px-3 py-1.5 text-xs font-medium btn-accent">Open overview</a>
    ${tagsHtml}
  </div>
</article>`;
    }
    escapeHtml(value){
        if(value === null || value === undefined){
            return '';
        }
        return String(value)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;');
    }
    exitPath(){ this.activePath=null; this.updatePathUI(); }
    syncActivePath(q){ if(!this.activePath) return; const i=this.activePath.sequence.indexOf(q); if(i===-1) this.activePath=null; else this.activePath.pos=i; }
        difficultyStars(level){
                if(level==='beginner') return 'â˜…â˜†â˜†';
                if(level==='intermediate') return 'â˜…â˜…â˜†';
                if(level==='advanced') return 'â˜…â˜…â˜…';
                return '';
        }
        buildBannerHTML(nice,pos,total,key){
                const def = this.pathDefinitions[key];
                const diff = def?.difficulty || '';
                const stars = this.difficultyStars(diff);
                const diffText = diff ? diff.charAt(0).toUpperCase() + diff.slice(1) : '';
                const diffLabel = diffText ? `<span class="path-chip">${diffText} ${stars}</span>` : '';
                const atStart=pos===0, atEnd=pos===total-1, pct=((pos+1)/total)*100;
                return `<div class="flex items-center justify-between flex-wrap gap-3">
                        <div class="flex items-center gap-2">
                            <div class="font-semibold tracking-wide uppercase text-xs text-accent">Learning Path</div>
                            ${diffLabel}
                        </div>
                        <button type="button" id="path-banner-exit" class="text-xs px-2 py-1 btn-soft">Exit Path</button>
                    </div>
                    <div class="flex items-center flex-wrap gap-3">
                        <h3 class="text-base font-bold text-heading">${nice} Path</h3>
                        <span class="path-chip font-mono">Step ${pos+1} / ${total}</span>
                        <div class="path-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${pos+1}" aria-label="${nice} path progress">
                            <div class="path-progress-bar" style="width:${pct}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center flex-wrap gap-2 pt-1">
                        <button id="path-prev" ${atStart?'disabled':''} class="text-xs px-3 py-1 btn-soft">Prev</button>
                        <button id="path-next" class="text-xs px-3 py-1 btn-accent">${atEnd?'Finish':'Next'}</button>
                        ${atEnd?'<span class="text-xs text-muted">End of path</span>':''}
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
                        indicator.dataset.pathTheme = '';
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
                indicator.dataset.pathTheme = key;
                this.elements.nextBtn.title= pos<total-1 ? `Next in ${nice} (${pos+2}/${total})` : 'End of path';
                this.elements.prevBtn.title= pos>0 ? `Prev in ${nice} (${pos}/${total})` : 'Start of path';
                if(banner){
                        banner.classList.remove('hidden');
                        banner.className='path-banner mb-5 p-4 rounded-lg text-sm flex flex-col gap-3';
                        banner.dataset.pathTheme = key;
                        banner.innerHTML=this.buildBannerHTML(nice,pos,total,key);
                        banner.querySelector('#path-banner-exit')?.addEventListener('click',()=>this.exitPath());
                        banner.querySelector('#path-prev')?.addEventListener('click',()=>{ if(pos>0) this.displayQuestion(this.availableQuestions.indexOf(sequence[pos-1])); });
                        banner.querySelector('#path-next')?.addEventListener('click',()=>{ if(pos<total-1) this.displayQuestion(this.availableQuestions.indexOf(sequence[pos+1])); else { this.notify(`${nice} path complete!`); this.exitPath(); }});
                }
        exitBtn.onclick=()=>this.exitPath();
    }

    /* -------------- Papers -------------- */
    preparePaperLoadingState(id){
        const nice = String(id).padStart(2,'0');
        if(this.elements.paperIdentifier) this.elements.paperIdentifier.textContent = `Paper #${nice}`;
        if(this.elements.paperTitle) this.elements.paperTitle.textContent = 'Loading paper...';
        if(this.elements.paperAuthors){
            this.elements.paperAuthors.textContent = '';
            this.elements.paperAuthors.classList.add('hidden');
        }
        if(this.elements.paperSummary){
            this.elements.paperSummary.textContent = 'Fetching overview and interactive...';
            this.elements.paperSummary.classList.remove('hidden');
        }
        if(this.elements.paperRelatedSection){
            this.elements.paperRelatedSection.classList.add('hidden');
            if(this.elements.paperRelatedList) this.elements.paperRelatedList.innerHTML = '';
        }
        if(this.elements.paperTags){
            this.elements.paperTags.innerHTML = '';
            this.elements.paperTags.classList.add('hidden');
        }
        if(this.elements.paperVenue){ this.elements.paperVenue.textContent = ''; this.elements.paperVenue.classList.add('hidden'); }
        if(this.elements.paperOverview) this.elements.paperOverview.innerHTML = '<p class="text-sm text-muted-soft">Loading...</p>';
        if(this.elements.paperInteractive){
            this.elements.paperInteractive.classList.add('hidden');
            if(this.elements.paperInteractiveTitle) this.elements.paperInteractiveTitle.textContent = '';
            if(this.elements.paperInteractiveBody) this.elements.paperInteractiveBody.innerHTML = '';
        }
    }
    async showPaper(paperId,{replace=false}={}){
        const id = Number(paperId);
        if(!Number.isFinite(id) || id < 1) return;
        if(this.isLoading){
            this.pendingPaperId = id;
            return;
        }
        if(this.availablePapers.length && !this.availablePapers.includes(id)){
            this.pendingPaperId = null;
            this.setMode('paper');
            this.hideLanding();
            this.preparePaperLoadingState(id);
            this.showPaperError(id);
            this.notify(`Paper ${id} not found`,'error');
            return;
        }
        this.pendingPaperId = null;
        this.setMode('paper');
        this.hideLanding();
        this.updatePaperURL(id,{ replace });
        this.preparePaperLoadingState(id);
        this.showLoading();
        this.isLoading = true;
        try {
            const paper = await this.paperLoader.loadPaper(id);
            this.currentPaperIndex = paper.index || id;
            this.updatePaperContent(paper);
        } catch (error) {
            console.error(`Display paper ${id} failed`, error);
            this.showPaperError(id);
        } finally {
            this.hideLoading();
            this.isLoading = false;
            if(this.queuedIndex !== null){
                const queued = this.queuedIndex;
                this.queuedIndex = null;
                this.pendingPaperId = null;
                this.displayQuestion(queued,{ replace:true });
                return;
            }
            this.pendingPaperId = null;
        }
    }
    updatePaperContent(paper){
        if(!paper) return;
        const id = Number(paper.index || parseInt(paper.id,10) || 0);
        const nice = paper.id || String(id).padStart(2,'0');
        if(id > 0 && !this.availablePapers.includes(id)){
            this.availablePapers.push(id);
            this.availablePapers.sort((a,b)=>a-b);
            this.updateFooterPaperCount(this.availablePapers.length);
        }
        if(this.elements.paperIdentifier) this.elements.paperIdentifier.textContent = `Paper #${nice}`;
        if(this.elements.paperTitle) this.elements.paperTitle.textContent = paper.title || `Paper ${id}`;
        const authorsArray = Array.isArray(paper.meta?.authors) ? paper.meta.authors.filter(Boolean) : [];
        const authorsText = authorsArray.length ? `By ${authorsArray.join(', ')}` : '';
        if(this.elements.paperAuthors){
            this.elements.paperAuthors.textContent = authorsText;
            this.elements.paperAuthors.classList.toggle('hidden', !authorsText);
        }
        const venueBits = [];
        if(paper.meta?.venue) venueBits.push(paper.meta.venue);
        if(paper.meta?.year) venueBits.push(String(paper.meta.year));
        if(this.elements.paperVenue){
            if(venueBits.length){
                this.elements.paperVenue.textContent = venueBits.join(' &bull; ');
                this.elements.paperVenue.classList.remove('hidden');
            } else {
                this.elements.paperVenue.textContent = '';
                this.elements.paperVenue.classList.add('hidden');
            }
        }
        const tags = Array.isArray(paper.meta?.tags) ? paper.meta.tags.slice(0,4) : [];
        if(this.elements.paperTags){
            this.elements.paperTags.innerHTML = tags.map(tag => `<span class="tag-chip">${this.escapeHtml(tag)}</span>`).join('');
            this.elements.paperTags.classList.toggle('hidden', tags.length === 0);
        }
        if(this.elements.paperSummary){
            const summary = paper.meta?.summary || '';
            this.elements.paperSummary.textContent = summary;
            this.elements.paperSummary.classList.toggle('hidden', !summary);
        }
        if(this.elements.paperRelatedSection){
            const related = Array.isArray(paper.meta?.relatedQuestions)
                ? paper.meta.relatedQuestions.filter(n => Number.isFinite(n) && n > 0)
                : [];
            if(related.length && this.elements.paperRelatedList){
                const items = related.map(q => {
                    const idx = this.availableQuestions.indexOf(q);
                    const nice = String(q).padStart(2,'0');
                    const title = this.escapeHtml(this.getQuestionTitle(q));
                    const disabled = idx === -1 ? 'disabled' : '';
                    const stateClasses = idx === -1 ? 'related-question-disabled' : '';
                    return `<li>
    <button type="button" data-related-question="${q}" class="related-question group w-full text-left px-3 py-2 text-sm rounded-md ${stateClasses}" ${disabled}>
        <span class="related-question-title">Question ${nice}</span>
        <span class="related-question-subtext">${title}</span>
    </button>
</li>`;
                }).join('');
                this.elements.paperRelatedList.innerHTML = items;
                this.elements.paperRelatedSection.classList.remove('hidden');
            } else {
                this.elements.paperRelatedSection.classList.add('hidden');
                if(this.elements.paperRelatedList) this.elements.paperRelatedList.innerHTML = '';
            }
        }
        if(this.elements.paperOverview){
            this.elements.paperOverview.innerHTML = paper.overview || '<p class="text-sm text-muted-soft">Overview unavailable.</p>';
        }
        if(this.elements.paperInteractive){
            if(paper.interactive && (paper.interactive.html || paper.interactive.title)){
                if(this.elements.paperInteractiveTitle) this.elements.paperInteractiveTitle.textContent = paper.interactive.title || 'Interactive';
                if(this.elements.paperInteractiveBody) this.elements.paperInteractiveBody.innerHTML = paper.interactive.html || '';
                this.elements.paperInteractive.classList.remove('hidden');
                try {
                    if(typeof paper.interactive.script === 'function'){
                        paper.interactive.script();
                    }
                } catch (err) {
                    console.error('Paper interactive error', err);
                    if(this.elements.paperInteractiveBody){
                        this.elements.paperInteractiveBody.innerHTML += '<p class="text-sm text-red-600">Interactive component failed to load.</p>';
                    }
                }
            } else {
                this.elements.paperInteractive.classList.add('hidden');
                if(this.elements.paperInteractiveTitle) this.elements.paperInteractiveTitle.textContent = '';
                if(this.elements.paperInteractiveBody) this.elements.paperInteractiveBody.innerHTML = '';
            }
        }
        this.renderMath();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    showPaperError(id){
        this.currentPaperIndex = id;
        if(this.elements.paperTitle) this.elements.paperTitle.textContent = `Paper ${id} unavailable`;
        if(this.elements.paperSummary) this.elements.paperSummary.textContent = 'Failed to load paper assets. Please try again later.';
        if(this.elements.paperOverview) this.elements.paperOverview.innerHTML = '<div class="p-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">Paper overview could not be loaded.</div>';
        if(this.elements.paperInteractive){
            this.elements.paperInteractive.classList.add('hidden');
            if(this.elements.paperInteractiveTitle) this.elements.paperInteractiveTitle.textContent = '';
            if(this.elements.paperInteractiveBody) this.elements.paperInteractiveBody.innerHTML = '';
        }
    }
    getPaperShareURL(id=this.currentPaperIndex){
        if(!Number.isFinite(id) || id < 1) return window.location.href;
        const base = `${window.location.origin}${window.location.pathname}`.replace(/[^/]+$/,'');
        return `${base}p/${id}.html`;
    }
    async copyPaperLink(){
        const url = this.getPaperShareURL();
        try {
            await navigator.clipboard.writeText(url);
            this.notify('Paper link copied to clipboard!');
        } catch {
            this.fallbackCopy(url);
        }
    }
    exitPaperView(){
        if(this.currentQuestionIndex < 0){
            history.replaceState(null,'','#');
            this.showLanding();
            this.setMode('question');
            this.pendingPaperId = null;
            this.currentPaperIndex = -1;
            return;
        }
        this.setMode('question');
        this.hideLanding();
        this.pendingPaperId = null;
        this.currentPaperIndex = -1;
        this.updateURL(this.currentQuestionIndex,{ replace:true });
        this.updatePathUI();
    }

    /* -------------- Questions -------------- */
    async displayQuestion(index,{replace=false}={}){
        // Always update URL immediately to reflect user intent
        try { this.updateURL(index,{ replace }); } catch(_) {}
        // Queue if already loading (URL already reflects target)
        if(this.isLoading){ this.queuedIndex = index; return; }
        this.setMode('question');
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
            if(this.pendingPaperId !== null){
                const targetPaper = this.pendingPaperId;
                this.pendingPaperId = null;
                this.showPaper(targetPaper,{ replace:true });
            }
        }
    }
    async showNext(){ if(this.activePath){ if(this.activePath.pos < this.activePath.sequence.length-1){ const nextQ=this.activePath.sequence[this.activePath.pos+1]; return this.displayQuestion(this.availableQuestions.indexOf(nextQ)); } else { const done=this.activePath.key; this.exitPath(); this.notify(`Completed ${done} path!`); }} if(this.currentQuestionIndex < this.totalQuestions-1) await this.displayQuestion(this.currentQuestionIndex+1); }
    async showPrev(){ if(this.activePath){ if(this.activePath.pos>0){ const prevQ=this.activePath.sequence[this.activePath.pos-1]; return this.displayQuestion(this.availableQuestions.indexOf(prevQ)); } else { this.exitPath(); }} if(this.currentQuestionIndex>0) await this.displayQuestion(this.currentQuestionIndex-1); }
    async jumpTo(){ if(!this.elements.questionNavDropdown) return; const newIdx=parseInt(this.elements.questionNavDropdown.value,10); if(newIdx!==this.currentQuestionIndex) await this.displayQuestion(newIdx); }
    async preloadAdjacent(){ const list=[]; if(this.currentQuestionIndex>0) list.push(this.availableQuestions[this.currentQuestionIndex-1]); if(this.currentQuestionIndex<this.totalQuestions-1) list.push(this.availableQuestions[this.currentQuestionIndex+1]); if(list.length) this.questionLoader.preloadQuestions(list); }

    /* -------------- UI Helpers -------------- */
    populateQuestionDropdown(){
        const titles={1:"What does tokenization entail, and why is it critical for LLMs?",2:"How does the attention mechanism function in transformer models?",3:"What is the context window in LLMs, and why does it matter?",4:"What distinguishes LoRA from QLoRA in fine-tuning LLMs?",5:"How does beam search improve text generation compared to greedy decoding?",6:"What is temperature in text generation and how does it affect output?",7:"What are embeddings and how do they enable LLMs to understand semantic meaning?",8:"What is RLHF and how does it improve LLM alignment with human preferences?",9:"How do autoregressive and masked models differ in LLM training?",10:"What are embeddings, and how are they initialized in LLMs?",11:"What is next sentence prediction, and how does it enhance LLMs?",12:"How do top-k and top-p sampling differ in text generation?",13:"Why is prompt engineering crucial for LLM performance?",14:"How can LLMs avoid catastrophic forgetting during fine-tuning?",15:"What is model distillation, and how does it benefit LLMs?",16:"How do LLMs manage out-of-vocabulary (OOV) words?",17:"How do transformers improve on traditional Seq2Seq models?",18:"What is overfitting, and how can it be mitigated in LLMs?",19:"What are generative versus discriminative models in NLP?",20:"How do GPT-3, GPT-4, and GPT-5 differ in features and applications?",21:"What are positional encodings, and why are they used?",22:"What is multi-head attention, and how does it enhance LLMs?",23:"How is the softmax function applied in attention mechanisms?",24:"How does the dot product contribute to self-attention?",25:"Why is cross-entropy loss used in language modeling?",26:"How are gradients computed for embeddings in LLMs?",27:"What is the Jacobian matrix's role in transformer backpropagation?",28:"How do eigenvalues and eigenvectors relate to dimensionality reduction?",29:"What is KL divergence, and how is it used in LLMs?",30:"What is the derivative of the ReLU function, and why is it significant?",31:"How does backpropagation work, and why is the chain rule critical?",32:"How are attention scores calculated in transformers?",33:"How does Gemini optimize multimodal LLM training?",34:"What types of foundation models exist?",35:"How does PEFT mitigate catastrophic forgetting?",36:"What are the steps in Retrieval-Augmented Generation (RAG)?",37:"How does Mixture of Experts (MoE) enhance LLM scalability?",38:"What is Chain-of-Thought (CoT) prompting, and how does it aid reasoning?",39:"How do discriminative and generative AI models differ?",40:"How does knowledge graph integration improve LLMs?",41:"What is zero-shot learning, and how do LLMs implement it?",42:"How does Adaptive Softmax optimize LLMs?",43:"How do transformers address the vanishing gradient problem?",44:"What is few-shot learning, and what are its benefits?",45:"How would you fix an LLM generating biased or incorrect outputs?",46:"How do encoders and decoders differ in transformers?",47:"How do LLMs differ from traditional statistical language models?",48:"What is a hyperparameter, and why is it important?",49:"What defines a Large Language Model (LLM)?",50:"What challenges do LLMs face in deployment?",51:"What is an LLM, and how are LLMs trained end-to-end?",52:"How do you estimate and compare SaaS vs self-host LLM costs?",53:"What are decoding strategies for selecting output tokens?",54:"What are logits, and why don't LLMs output probabilities directly?",55:"How do you decide when to stop generating text with an LLM?",56:"When should I use Fine-tuning instead of RAG?",57:"What are the fundamentals of in-context learning?"};
        this.questionTitleMap = titles;
        if(!this.elements.questionNavDropdown) return;
        this.elements.questionNavDropdown.innerHTML='';
        this.availableQuestions.forEach((q,i)=>{
            const o=document.createElement('option');
            o.value=i;
            o.textContent=`${q}. ${titles[q]}`;
            this.elements.questionNavDropdown.appendChild(o);
        });
    }
    updateQuestionContent(question,idx){
        this.elements.questionTitle.textContent=question.title;
        let html=question.answer;
        if(question.interactive){
            html+=`\n<div class="interactive-container mt-8 p-6 bg-card rounded-lg border-2 border-dashed border-subtle">\n  <h3 class="text-lg font-semibold text-heading mb-4">${question.interactive.title}</h3>\n  ${question.interactive.html}\n</div>`;
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
    updateFooterPaperCount(count){
        const safeCount = Number.isFinite(count) && count >= 0 ? count : 0;
        this.totalPapers = safeCount;
        if(this.elements.footerPaperCount){
            this.elements.footerPaperCount.textContent = safeCount;
        }
    }
    updateNavState(i){
        this.elements.prevBtn.disabled = i === 0;
        this.elements.nextBtn.disabled = i === this.totalQuestions - 1;
        this.elements.progressIndicator.textContent = `Question ${i+1} of ${this.totalQuestions} (${this.availableQuestions[i]})`;
        if (this.elements.questionNavDropdown) {
            this.elements.questionNavDropdown.value = i;
        }
    }
    updateDropdownOption(i,title){
        if(!this.elements.questionNavDropdown) return;
        const opt = this.elements.questionNavDropdown.children[i];
        if(opt){
            const qText = title.substring(title.indexOf(" ")+1);
            opt.textContent = `${i+1}. ${qText}`;
        }
    }
    showLoading(){ this.elements.loadingIndicator.style.opacity='1'; }
    hideLoading(){ this.elements.loadingIndicator.style.opacity='0'; }
    showInteractiveError(){ const el=this.elements.questionAnswer.querySelector('.interactive-container'); if(el) el.innerHTML='<div class="p-8 text-center bg-red-50 rounded-lg"><p class="text-red-600 mb-4">Interactive component failed to load</p><button onclick="location.reload()" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reload Page</button></div>'; }
    showQuestionError(q){ this.elements.questionTitle.textContent=`Question ${q} - Loading Error`; this.elements.questionAnswer.innerHTML=`<div class=\"p-8 text-center bg-red-50 rounded-lg\"><p class=\"text-red-600 mb-4\">Failed to load question ${q}</p><button onclick=\"app.displayQuestion(${q-1})\" class=\"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700\">Retry</button></div>`; this.elements.questionViewer.style.opacity='1'; }
    delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async renderMath(){ if(!window.MathJax?.typesetPromise) return; try{ await window.MathJax.typesetPromise(); }catch(e){ if(typeof window.retryMathJax==='function') await window.retryMathJax(); } }
    async copyShareableLink(){
        if(this.mode === 'paper') return this.copyPaperLink();
        const url=this.getShareableURL();
        try{ await navigator.clipboard.writeText(url); this.notify('Link copied to clipboard!'); }
        catch { this.fallbackCopy(url); }
    }
    fallbackCopy(text){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); this.notify('Link copied to clipboard!'); } catch { this.notify('Failed to copy link. Copy manually.','error'); } ta.remove(); }
    notify(msg,type='success'){ const el=document.createElement('div'); el.className=`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full ${type==='success'?'bg-green-600 text-white':'bg-red-600 text-white'}`; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>{el.style.transform='translateX(0)';},10); setTimeout(()=>{el.style.transform='translateX(120%)'; setTimeout(()=>el.remove(),300);},3000); }
    getStats(){ return { currentQuestion:this.availableQuestions[this.currentQuestionIndex], currentIndex:this.currentQuestionIndex+1, totalQuestions:this.totalQuestions, totalPapers:this.totalPapers, availableQuestions:this.availableQuestions, availablePapers:this.availablePapers, cacheStats:this.questionLoader.getCacheStats(), currentURL:this.getShareableURL() }; }
}

window.addEventListener('DOMContentLoaded',()=>{ window.app=new LLMQuestionApp(); const footerCount=document.getElementById('footer-total-count'); if(footerCount&&window.app) footerCount.textContent=window.app.totalQuestions; const footerPapers=document.getElementById('footer-paper-count'); if(footerPapers&&window.app?.papersReady){ window.app.papersReady.then(ids=>footerPapers.textContent=String(Array.isArray(ids)?ids.length:0)).catch(()=>footerPapers.textContent='0'); } });


