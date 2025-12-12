import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryStep {
  id: number;
  icon: string;
  title: string;
  description: string;
  code?: string;
  result?: string;
  isError?: boolean;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  outcome: 'success' | 'failure';
  steps: DiscoveryStep[];
}

const scenarios: Scenario[] = [
  {
    id: 'bike-search',
    name: '🚴 Bike Search (Success)',
    description: 'Agent discovers pon.bike MCP server and queries product data',
    outcome: 'success',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'User asks for road bike recommendations. Agent needs bike inventory data.',
        code: 'User: "Find me the best road bikes under $1500"',
        result: '🤔 Agent thinks: I need bike product data...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent looks for standardized tool manifest at .well-known endpoint',
        code: 'GET https://pon.bike/.well-known/mcp.json',
        result: '✅ 200 OK - MCP server found!'
      },
      {
        id: 3,
        icon: '📋',
        title: 'Parse Manifest',
        description: 'Agent discovers available tools, their capabilities, and how to call them',
        code: '{\n  "tools": [\n    "searchProducts",\n    "getInventory",\n    "compareModels"\n  ]\n}',
        result: '🔧 3 tools registered and ready to use'
      },
      {
        id: 4,
        icon: '🚀',
        title: 'Execute Research',
        description: 'Agent now knows how to query bike data programmatically',
        code: 'searchProducts({\n  category: "road-bikes",\n  maxPrice: 1500,\n  sortBy: "rating"\n})',
        result: '✅ Found 12 matching bikes with full specs'
      }
    ]
  },
  {
    id: 'weather-api',
    name: '🌤️ Weather Forecast (Success)',
    description: 'Agent discovers weather API via MCP and fetches location data',
    outcome: 'success',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'User needs weather forecast for cycling trip planning.',
        code: 'User: "What\'s the weather forecast for Amsterdam this week?"',
        result: '🤔 Agent thinks: I need weather API access...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent queries weather service for MCP manifest',
        code: 'GET https://api.weather.com/.well-known/mcp.json',
        result: '✅ 200 OK - MCP server found!'
      },
      {
        id: 3,
        icon: '📋',
        title: 'Parse Manifest',
        description: 'Agent discovers forecast, alerts, and historical data tools',
        code: '{\n  "tools": [\n    "getCurrentWeather",\n    "getForecast",\n    "getAlerts"\n  ]\n}',
        result: '🔧 Weather API tools registered'
      },
      {
        id: 4,
        icon: '🚀',
        title: 'Execute Query',
        description: 'Agent fetches 7-day forecast with hourly breakdowns',
        code: 'getForecast({\n  location: "Amsterdam, NL",\n  days: 7,\n  hourly: true\n})',
        result: '✅ Retrieved detailed 7-day forecast'
      }
    ]
  },
  {
    id: 'restaurant-review',
    name: '🍽️ Restaurant Reviews (Success)',
    description: 'Agent discovers restaurant review platform and aggregates ratings',
    outcome: 'success',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'User searching for highly-rated Italian restaurants nearby.',
        code: 'User: "Find top-rated Italian restaurants within 5km"',
        result: '🤔 Agent thinks: Need restaurant data and reviews...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent checks restaurant platform for MCP support',
        code: 'GET https://reviews.food.com/.well-known/mcp.json',
        result: '✅ 200 OK - MCP server found!'
      },
      {
        id: 3,
        icon: '📋',
        title: 'Parse Manifest',
        description: 'Agent discovers search, ratings, and menu tools',
        code: '{\n  "tools": [\n    "searchRestaurants",\n    "getReviews",\n    "getMenu"\n  ]\n}',
        result: '🔧 Restaurant API tools registered'
      },
      {
        id: 4,
        icon: '🚀',
        title: 'Execute Search',
        description: 'Agent queries with filters and aggregates ratings',
        code: 'searchRestaurants({\n  cuisine: "Italian",\n  radius: 5,\n  minRating: 4.0\n})',
        result: '✅ Found 8 restaurants with 4+ stars'
      }
    ]
  },
  {
    id: 'no-mcp-server',
    name: '❌ Legacy Site (No MCP)',
    description: 'Agent attempts MCP discovery but site doesn\'t support it',
    outcome: 'failure',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'User asks about product inventory from legacy e-commerce site.',
        code: 'User: "Check stock for hiking boots at OldGearShop.com"',
        result: '🤔 Agent thinks: Let me check for MCP support...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent queries .well-known endpoint but gets 404',
        code: 'GET https://oldgearshop.com/.well-known/mcp.json',
        result: '❌ 404 Not Found - No MCP server',
        isError: true
      },
      {
        id: 3,
        icon: '🔄',
        title: 'Fallback Strategy',
        description: 'Agent switches to web scraping or manual search',
        code: '// No programmatic API available\n// Fall back to web search',
        result: '⚠️ Using slower web scraping method',
        isError: true
      },
      {
        id: 4,
        icon: '📝',
        title: 'Limited Results',
        description: 'Agent extracts basic info but misses structured data',
        code: 'scrapeWebPage("oldgearshop.com/boots")',
        result: '⚠️ Found basic info, no real-time stock data',
        isError: true
      }
    ]
  },
  {
    id: 'mcp-wrong-data',
    name: '⚠️ Data Not Indexed (Poor Data Management)',
    description: 'MCP works but product data isn\'t searchable - teaches data governance importance',
    outcome: 'failure',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'User wants to compare specific women\'s bike models by geometry specs.',
        code: 'User: "Compare Trek Domane vs Specialized Ruby - stack/reach ratios"',
        result: '🤔 Agent thinks: Need bike geometry data...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent finds MCP endpoint successfully',
        code: 'GET https://bikeretail.com/.well-known/mcp.json',
        result: '✅ 200 OK - MCP server found!'
      },
      {
        id: 3,
        icon: '📋',
        title: 'Parse Manifest',
        description: 'Tools exist but support generic search only, not structured product data',
        code: '{\n  "tools": [\n    "searchSite",\n    "getPage",\n    "listCategories"\n  ]\n}',
        result: '⚠️ Tools found but no product specifications API',
        isError: true
      },
      {
        id: 4,
        icon: '🔎',
        title: 'Attempt Query',
        description: 'Agent tries search but gets unstructured results - geometry data not indexed',
        code: 'searchSite({\n  query: "Domane geometry stack reach"\n})',
        result: '❌ Returns blog posts, not structured specs',
        isError: true
      },
      {
        id: 5,
        icon: '📊',
        title: 'Root Cause: Poor Data Management',
        description: 'Product team never structured geometry data for programmatic access',
        code: '// Data exists in PDFs and images\n// But not in searchable database\n// Marketing/product data governance gap',
        result: '⚠️ Lesson: MCP needs clean, indexed data to work!',
        isError: true
      }
    ]
  },
  {
    id: 'missing-search-field',
    name: '🚲 Missing Search Parameter (Incomplete Schema)',
    description: 'User needs bikes for 2 children, but API has no "child_seats" filter field',
    outcome: 'failure',
    steps: [
      {
        id: 1,
        icon: '🎯',
        title: 'Agent Receives Task',
        description: 'Parent searching for cargo bike that can carry 2 children safely.',
        code: 'User: "Find cargo bikes with seating for 2 children, ages 3 and 5"',
        result: '🤔 Agent thinks: Need bikes with child seating capacity...'
      },
      {
        id: 2,
        icon: '🔍',
        title: 'Check for MCP Server',
        description: 'Agent discovers bike retailer MCP successfully',
        code: 'GET https://cargobikes.com/.well-known/mcp.json',
        result: '✅ 200 OK - MCP server found!'
      },
      {
        id: 3,
        icon: '📋',
        title: 'Parse Manifest & Check Parameters',
        description: 'Product search tool exists, but reviewing available filter fields...',
        code: '{\n  "searchProducts": {\n    "params": {\n      "category": "string",\n      "price_range": "object",\n      "frame_type": "string",\n      "weight_capacity": "number"\n    }\n  }\n}',
        result: '❌ No "child_seats" or "passenger_capacity" field!',
        isError: true
      },
      {
        id: 4,
        icon: '🔄',
        title: 'Workaround Attempt',
        description: 'Agent tries category filter and text search as fallback',
        code: 'searchProducts({\n  category: "cargo",\n  text_query: "2 children seats"\n})',
        result: '⚠️ Returns cargo bikes but can\'t filter by child capacity',
        isError: true
      },
      {
        id: 5,
        icon: '📊',
        title: 'Root Cause: Incomplete Product Schema',
        description: 'Product team didn\'t anticipate this common search parameter',
        code: '// Common use case not captured in schema\n// Marketing assumed "cargo" was enough\n// Missing: child_seats, passenger_age_range,\n//          safety_certification fields',
        result: '⚠️ Lesson: Schema must match real user needs!',
        isError: true
      }
    ]
  }
];

export function DiscoverySimulator() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [currentStep, setCurrentStep] = useState(0);
  
  const activeScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const discoverySteps = activeScenario.steps;

  const handleNext = () => {
    if (currentStep < discoverySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentStep(0);
  };

  const currentStepData = discoverySteps[currentStep];

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="panel p-4">
        <label className="block text-sm font-medium text-heading mb-3">
          Select Discovery Scenario:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioChange(scenario.id)}
              className={`p-3 rounded-lg text-left transition-all border-2 ${
                selectedScenario === scenario.id
                  ? scenario.outcome === 'success'
                    ? 'border-[var(--color-success)] bg-[var(--color-success)]/10'
                    : 'border-[var(--color-error)] bg-[var(--color-error)]/10'
                  : 'border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-subtle-bg)] hover:border-[var(--color-border-subtle)]'
              }`}
            >
              <div className="font-medium text-sm text-heading mb-1">
                {scenario.name}
              </div>
              <div className="text-xs text-muted leading-snug">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            🔄 Reset
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep >= discoverySteps.length - 1}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
        <p className="text-xs text-muted">
          Step {currentStep + 1} of {discoverySteps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-card-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            activeScenario.outcome === 'failure' 
              ? 'bg-[var(--color-error)]' 
              : 'bg-accent'
          }`}
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / discoverySteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`panel p-6 ${
            currentStepData.isError 
              ? 'panel-warning border-2 border-[var(--color-error)]' 
              : 'panel-info'
          }`}
        >
          {/* Step Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{currentStepData.icon}</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-heading mb-1">
                {currentStepData.title}
              </h3>
              <p className="text-body text-sm">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Code/Request */}
          {currentStepData.code && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-heading mb-2">
                {currentStep === 0 ? '💬 User Request:' : currentStep === 2 ? '📄 Manifest Response:' : '🔧 Request:'}
              </p>
              <div className="bg-[var(--color-code-bg)] rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-[var(--color-text)] whitespace-pre-wrap">
                  {currentStepData.code}
                </pre>
              </div>
            </div>
          )}

          {/* Result */}
          {currentStepData.result && (
            <div className="panel p-3 bg-card-secondary">
              <p className="text-sm text-body font-medium">
                {currentStepData.result}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step Timeline */}
      <div className="flex justify-between items-center">
        {discoverySteps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <button
              onClick={() => setCurrentStep(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer hover:scale-105 ${
                index === currentStep
                  ? step.isError
                    ? 'bg-[var(--color-error)] text-white scale-110 shadow-lg'
                    : 'bg-accent text-white scale-110 shadow-lg'
                  : index < currentStep
                  ? step.isError
                    ? 'bg-[var(--color-error)]/70 text-white'
                    : 'bg-[var(--color-success)] text-white'
                  : 'bg-card-secondary text-muted'
              }`}
            >
              {index < currentStep ? (step.isError ? '✗' : '✓') : step.icon}
            </button>
            <p className="text-xs text-center text-muted max-w-[80px] leading-tight">
              {step.title.split(' ').slice(0, 2).join(' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
