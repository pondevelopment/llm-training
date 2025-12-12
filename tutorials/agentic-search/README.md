# Agentic Search Interactive Tutorial

An interactive deep-dive tutorial teaching marketers and developers how AI agents discover and use tools through the Model Context Protocol (MCP).

**Live Demo:** [https://pondevelopment.github.io/llm-training/tutorials/agentic-search/dist/](https://pondevelopment.github.io/llm-training/tutorials/agentic-search/dist/)

## 📚 What You'll Learn

- **Traditional vs. Agentic Search** - Interactive comparison showing the fundamental shift
- **Tool Discovery** - How AI agents find tools through `.well-known/ai-plugin.json` manifests
- **Model Context Protocol (MCP)** - The standard for tool discovery and integration
- **Real-World Scenarios** - 6 customer-facing scenarios with step-by-step agent reasoning
- **Optimization Strategies** - FEED framework with real conversion data (15.9% vs 1.8%)
- **Limitations & Solutions** - Common challenges and how to address them

## 🎯 Tutorial Sections

1. **Search Comparison** - Traditional keyword search vs. agentic reasoning
2. **Tool Discovery** - Interactive toolbox with 8 tools (weather, inventory, email, etc.)
3. **MCP Protocol** - Manifest viewer showing tool discovery mechanics
4. **Scenario Player** - 6 realistic bike shop scenarios with live step tracking
5. **Optimization** - FEED framework, conversion metrics, and best practices
6. **Takeaways** - Key lessons and actionable insights

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 7
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS + semantic design tokens
- **Theme:** Light/dark mode with system preference detection

## 🚀 Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

\`\`\`bash
# Navigate to tutorial directory
cd tutorials/agentic-search

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The dev server will start at \`http://localhost:5173\` (or next available port).

### Development Commands

\`\`\`bash
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
\`\`\`

## 📁 Project Structure

\`\`\`
tutorials/agentic-search/
├── src/
│   ├── components/
│   │   ├── intro/           # Section 1: Search comparison
│   │   ├── toolbox/         # Section 2: Tool discovery
│   │   ├── mcp/             # Section 3: MCP protocol
│   │   ├── scenario/        # Section 4: Scenario player
│   │   ├── optimization/    # Section 5: FEED framework
│   │   ├── summary/         # Section 6: Takeaways
│   │   ├── landing/         # Landing page
│   │   └── tutorial/        # Tutorial shell & navigation
│   ├── data/
│   │   ├── tools.ts         # Tool definitions (8 tools)
│   │   ├── searchScenarios.ts  # 6 customer-facing scenarios
│   │   ├── optimizationTips.ts # FEED framework data
│   │   └── takeaways.ts     # Key lessons
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── dist/                    # Production build (committed for GH Pages)
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
\`\`\`

## 🎨 Component Architecture

### Core Components

- **\`LandingPage\`** - Tutorial introduction with objectives and section previews
- **\`TutorialPage\`** - Main tutorial shell with section navigation and progress tracking
- **\`IntroSection\`** - Comparison view with toggle between traditional/agentic search
- **\`ToolboxSection\`** - Interactive tool cards with modal details
- **\`MCPSection\`** - Manifest viewer with syntax highlighting
- **\`ScenarioSection\`** - Step-by-step scenario player with traceability
- **\`OptimizationSection\`** - FEED cards, metrics panel, limitations analysis
- **\`SummarySection\`** - Key takeaways with expandable details

### Data Flow

1. Static data defined in \`/src/data/\` files (tools, scenarios, tips)
2. Components import and render data with interactive overlays
3. State managed with React hooks (useState, useEffect)
4. Animations handled by Framer Motion with semantic variants

## 🎭 Theming

The tutorial uses a semantic design token system that inherits from the main site:

- **Colors:** \`panel-bg\`, \`panel-border\`, \`chip-bg\`, \`accent-*\`
- **Typography:** System font stack with proper hierarchy
- **Spacing:** Consistent padding/margin scale
- **Responsive:** Mobile-first with breakpoints at 640px, 768px, 1024px

Theme toggle syncs with system preferences and persists to localStorage.

## 📦 Building for Production

\`\`\`bash
# Build with GitHub Pages base path
npm run build

# The dist/ folder is committed for deployment
# Base path is configured in vite.config.ts
\`\`\`

**Important:** The build output in \`dist/\` is committed to the repository for GitHub Pages deployment.

## 🚢 Deployment

The tutorial is deployed to GitHub Pages as part of the main repository:

**URL:** \`https://pondevelopment.github.io/llm-training/tutorials/agentic-search/\`

### Deployment Process

1. Build production version: \`npm run build\`
2. Commit \`dist/\` folder to \`agentic-search\` branch
3. Merge to \`main\` branch
4. GitHub Pages automatically serves from \`main\` branch

## 🧪 Testing Checklist

Before deployment, verify:

- [ ] All 6 sections load without console errors
- [ ] Section navigation works (clicking section buttons)
- [ ] Progress indicator updates as user scrolls
- [ ] Theme toggle works (light/dark mode)
- [ ] All interactive elements respond to clicks
- [ ] Scenario player advances through steps correctly
- [ ] FEED cards expand/collapse smoothly
- [ ] Mobile responsive (test at 320px, 768px, 1024px)
- [ ] Deep-linking works (direct URL to specific section)
- [ ] Back button navigation works correctly

## 📚 Learning Path Integration

The tutorial is accessible from:

1. **Main site header** - "🤖 Tutorials" button on all pages
2. **Tutorials landing page** - \`/tutorials/index.html\`
3. **Direct URL** - \`/tutorials/agentic-search/\`

## 🤝 Contributing

When adding new sections or features:

1. Follow existing component patterns in \`/src/components/\`
2. Add data to appropriate files in \`/src/data/\`
3. Use semantic design tokens (avoid raw Tailwind colors)
4. Test on mobile and desktop
5. Ensure keyboard accessibility
6. Update this README if structure changes

## 📝 Content Sources

- **FEED Framework:** Based on ChatGPT Shopping analysis (Search Engine Land, Oct 2025)
- **Conversion Data:** Real-world metrics from ChatGPT Shopping case study
- **MCP Protocol:** Model Context Protocol specification
- **Tool Manifests:** \`.well-known/ai-plugin.json\` standard

## 🐛 Known Issues

None currently. Report issues in the main repository.

## 📄 License

This tutorial is part of the [llm-training](https://github.com/pondevelopment/llm-training) repository and is licensed under the MIT License.

---

**Built for the LLM community** | [Main Repository](https://github.com/pondevelopment/llm-training)
