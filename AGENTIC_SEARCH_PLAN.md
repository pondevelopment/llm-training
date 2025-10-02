# Agentic Search Tutorial - Implementation Plan

## Project Overview

**Goal:** Build an interactive tutorial teaching marketers about agentic search, agents, tools, MCP, and `.well-known` manifests.

**Approach:** 
- **Option A - Integrated** into existing site
- Reuse existing components, theme system, and patterns
- Educational-first simplified manifests (note real specs differ)
- Iterative development (section by section)

**Location:** `/tutorials/agentic-search/`

**Branch:** `agentic-search`

---

## Architecture Decisions

### Integration Strategy
- New `/tutorials/` directory for this and future interactive tutorials
- Add "Tutorials" navigation item to main site
- Reuse existing:
  - Theme system (semantic tokens, light/dark mode)
  - Component patterns (panels, chips, tooltips)
  - CSS variables and Tailwind utilities
  - Navigation structure

### Technical Stack
- **Framework:** React + Vite (sub-app within static site)
- **Animation:** Framer Motion (simpler than GSAP for component transitions)
- **Styling:** Existing Tailwind + semantic token system
- **Build:** Separate Vite build → outputs to `/tutorials/agentic-search/`
- **Base Path:** `/llm-training/tutorials/agentic-search/`

### Component Reuse Strategy
1. **Direct reuse:** Theme toggle, CSS variables, semantic classes
2. **Pattern reuse:** Panel structure, chip styling, tooltip behavior
3. **New React components:** Interactive simulations (toolbox, scenario player)

---

## Implementation Phases

### Phase 0: Setup & Infrastructure ✅ CURRENT
- [x] Create branch `agentic-search`
- [ ] Create `/tutorials/` directory structure
- [ ] Set up Vite + React project in `/tutorials/agentic-search/`
- [ ] Configure Vite base path for GH Pages
- [ ] Import existing theme CSS and semantic tokens
- [ ] Create shared component library (matching existing patterns)
- [ ] Set up mock data structure (manifestSamples, scenarioSteps, faq)

**Deliverable:** Working React dev environment with theme system integrated

---

### Phase 1: Section 1 - Intro (Traditional vs Agentic) 🎯 NEXT
**Content:**
- What is agentic search
- Why it matters for marketers
- Side-by-side comparison visualization

**Components:**
- `IntroSection.tsx` - Main container
- `SearchComparison.tsx` - Interactive side-by-side demo
  - Left: Traditional search (query → links animation)
  - Right: Agentic search (plan → tool → refine → synthesize)
- `AgentAvatar.tsx` - Reusable agent character
- Controls: Play/Pause/Reset buttons

**Interactions:**
- Toggle between views
- Step-through animation with timeline control
- Respect `prefers-reduced-motion`

**Mock Data:**
```ts
// traditionalSearchSteps.ts
// agenticSearchSteps.ts
```

**Deliverable:** Functional intro section with comparison demo

---

### Phase 2: Section 2 - Agents & Toolbox
**Content:**
- Agents extend themselves via tools
- What each tool does
- How tools plug into agents

**Components:**
- `ToolboxSection.tsx` - Main container
- `ToolGrid.tsx` - Interactive grid of tool cards
- `ToolModal.tsx` - Detail view with manifest snippet
- Tool icons (Search, Analytics, CRM, Social, etc.)

**Interactions:**
- Click tool → open modal/panel
- Show tool capabilities + example output
- Optional: simplified manifest snippet peek
- "Plug-in" animation when tool selected

**Mock Data:**
```ts
// tools.ts - { id, name, description, icon, capabilities, manifestSnippet }
```

**Deliverable:** Interactive toolbox explorer

---

### Phase 3: Section 3 - MCP & `.well-known`
**Content:**
- How agents discover tool capabilities
- MCP protocol basics (educational version)
- `.well-known` convention

**Components:**
- `MCPSection.tsx` - Main container
- `DiscoverySim.tsx` - Animated discovery simulation
  - Button: "Scan for Tools"
  - Animate: Request to `/.well-known/mcp/manifest.json`
  - Display: Returned capabilities
- `ManifestExplorer.tsx` - Pretty JSON viewer
  - Syntax highlighting
  - Hover tooltips explaining each field
  - Collapsible sections

**Interactions:**
- Trigger discovery animation
- Hover JSON fields for explanations
- Toggle between different manifest examples

**Mock Data:**
```ts
// manifestSamples.ts - KeywordTool, TrendsAPI, CompetitorLens
```

**Deliverable:** MCP discovery simulator + manifest explorer

---

### Phase 4: Section 4 - Scenario Player (Q4 Content Planning)
**Content:**
- Realistic marketing scenario walkthrough
- Full agentic search workflow
- Traceability from insights back to steps

**Components:**
- `ScenarioSection.tsx` - Main container
- `ScenarioPlayer.tsx` - Step-by-step timeline
  - Stepper navigation (Next/Back)
  - Progress indicator
  - Current step visualization
- `StepCard.tsx` - Individual step display
  - Why tool was chosen
  - What it returned
  - Data flowing animation
- `TraceToggle.tsx` - Map insights back to steps

**Interactions:**
- Navigate through 6 steps
- Pause/play animations
- Toggle trace view
- See data flow between steps

**Mock Data:**
```ts
// scenarioSteps.ts - 6-step Q4 content planning workflow
/*
  1. Plan sub-tasks
  2. Call TrendsAPI
  3. Call KeywordTool
  4. Analyze Competitors
  5. Refine & Iterate
  6. Synthesize Plan
*/
```

**Deliverable:** Full scenario walkthrough with animations

---

### Phase 5: Section 5 - Takeaways & FAQ
**Content:**
- Key concept recap
- Action prompts (make services agent-friendly)
- Collapsible FAQ

**Components:**
- `SummarySection.tsx` - Main container
- `TakeawayCards.tsx` - Icon-based summary cards
- `FAQ.tsx` - Collapsible Q&A list

**Interactions:**
- Expand/collapse FAQ items
- Optional: Copy snippet for manifest template

**Mock Data:**
```ts
// faq.ts - Common questions about agentic search
// takeaways.ts - Key learning points
```

**Deliverable:** Summary section with FAQ

---

### Phase 6: Navigation & Integration
**Components:**
- Tutorial landing page (`/tutorials/index.html`)
- Navigation integration (add "Tutorials" to main menu)
- Progress indicator (section scroll spy)
- Mobile navigation

**Tasks:**
- [ ] Add "Tutorials" link to main site navigation
- [ ] Create tutorials landing page listing available tutorials
- [ ] Add section navigation within tutorial
- [ ] Ensure deep-linking works with GH Pages routing
- [ ] Mobile-responsive adjustments

**Deliverable:** Fully integrated tutorial accessible from main site

---

### Phase 7: Polish & Optimization
**Tasks:**
- [ ] Accessibility audit (keyboard nav, ARIA labels, focus management)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Animation refinement (timing, easing, transitions)
- [ ] Content review (copy editing, tone consistency)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, mobile)
- [ ] Reduced-motion mode testing
- [ ] Touch interaction testing (mobile/tablet)

**Deliverable:** Production-ready tutorial

---

### Phase 8: Documentation & Deployment
**Tasks:**
- [ ] Update main README with tutorial info
- [ ] Create tutorial-specific README
- [ ] Document component API and patterns
- [ ] Build & deploy to GH Pages
- [ ] Verify asset paths and routing
- [ ] Smoke test all interactions

**Deliverable:** Deployed tutorial at `https://pondevelopment.github.io/llm-training/tutorials/agentic-search/`

---

## File Structure (Planned)

```
/tutorials/
  index.html                      # Tutorials landing page
  /agentic-search/
    package.json
    vite.config.ts
    tsconfig.json
    index.html                    # Tutorial entry point
    /src/
      main.tsx
      App.tsx
      /components/
        /shared/                  # Reusable components
          AgentAvatar.tsx
          ThemeProvider.tsx
          Panel.tsx
          Chip.tsx
          Tooltip.tsx
        /intro/
          IntroSection.tsx
          SearchComparison.tsx
        /toolbox/
          ToolboxSection.tsx
          ToolGrid.tsx
          ToolModal.tsx
        /mcp/
          MCPSection.tsx
          DiscoverySim.tsx
          ManifestExplorer.tsx
        /scenario/
          ScenarioSection.tsx
          ScenarioPlayer.tsx
          StepCard.tsx
          TraceToggle.tsx
        /summary/
          SummarySection.tsx
          TakeawayCards.tsx
          FAQ.tsx
      /data/
        tools.ts
        manifestSamples.ts
        scenarioSteps.ts
        faq.ts
        takeaways.ts
      /styles/
        theme.css                 # Import existing theme
        tutorial.css              # Tutorial-specific styles
      /assets/
        /icons/
        /animations/
    /public/
      # Static assets
```

---

## Progress Tracking

### Current Status: Phase 0 - Setup 🔄

**Completed:**
- [x] Created `agentic-search` branch
- [x] Created implementation plan

**In Progress:**
- [ ] Directory structure setup

**Next Steps:**
1. Create `/tutorials/` directory
2. Initialize Vite + React project
3. Configure build for GH Pages
4. Import theme system

---

## Design Decisions Log

### Theme Integration
- **Decision:** Reuse existing semantic token system completely
- **Rationale:** Maintains visual consistency, reduces maintenance, automatic dark mode
- **Implementation:** Import `theme.css`, use existing CSS variables

### Animation Library
- **Decision:** Framer Motion over GSAP
- **Rationale:** Better React integration, simpler API for component transitions, smaller bundle
- **Trade-off:** Less control than GSAP timelines, but sufficient for our needs

### Routing Strategy
- **Decision:** Single-page with scroll sections + hash anchors
- **Rationale:** Simpler deployment, works with GH Pages, maintains flow
- **Alternative considered:** React Router (overkill for linear tutorial)

### Manifest Format
- **Decision:** Simplified educational version with disclaimer
- **Rationale:** Real MCP specs complex; educational version clearer for target audience
- **Note:** Add "Real specs more detailed" callout in Section 3

---

## QA Checklist

### Accessibility
- [ ] All interactions keyboard accessible (Tab order works)
- [ ] ARIA labels on interactive elements
- [ ] Focus indicators visible
- [ ] `prefers-reduced-motion` respected
- [ ] Screen reader tested (narrator/NVDA/JAWS)
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on all images/icons

### Functionality
- [ ] All animations play/pause/reset correctly
- [ ] Scenario stepper Next/Back works
- [ ] Tool modal open/close works
- [ ] Manifest tooltips display correctly
- [ ] Trace toggle works
- [ ] FAQ expand/collapse works
- [ ] Deep links work (section anchors)

### Performance
- [ ] Animations smooth at 60fps
- [ ] Lazy loading works
- [ ] Bundle size reasonable (<500kb)
- [ ] Fast initial load
- [ ] No layout shifts (CLS)
- [ ] Works on mid-range devices

### Cross-Browser/Device
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Edge
- [ ] Touch interactions work (mobile/tablet)
- [ ] Responsive breakpoints work

### Deployment
- [ ] Build succeeds
- [ ] Assets load from correct paths
- [ ] Base path `/llm-training/tutorials/agentic-search/` works
- [ ] No console errors
- [ ] No 404s on resources

---

## Notes & Considerations

### Educational Simplifications
- MCP manifest format simplified (real spec has more fields)
- Tool capabilities simplified (real APIs more complex)
- Agent reasoning simplified (real LLMs more nuanced)
- **Always include:** "Real implementations have additional complexity"

### Future Enhancements (Out of Scope for V1)
- Mini-quiz interactions
- Downloadable PDF summary
- Real MCP manifest links
- Video walkthrough option
- Progress saving (requires backend)
- Certificate of completion (requires backend)

### Maintenance Notes
- Keep manifests in sync if MCP spec changes significantly
- Update tools list if new common tools emerge
- Refresh scenario if marketing practices evolve
- Monitor animation performance as browsers update

---

## Success Metrics (Qualitative)

**Done When:**
- ✅ User can complete full tutorial in ~15 minutes
- ✅ Non-technical marketer can explain agentic search concept
- ✅ User understands what `.well-known` manifests are
- ✅ All interactions work smoothly on desktop + mobile
- ✅ Integrated seamlessly into existing site
- ✅ Passes accessibility audit
- ✅ Deployed successfully on GitHub Pages

---

**Last Updated:** Oct 2, 2025  
**Current Phase:** 0 - Setup  
**Next Milestone:** Phase 0 complete → Begin Phase 1
