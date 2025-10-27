(function() {
  'use strict';

  // Sample ticket database with graph structure
  const ticketDB = {
    csv_upload: {
      id: 'ENT-22970',
      title: 'CSV upload fails when updating user email',
      sections: {
        description: 'Bulk user update via CSV upload returns error 400 when email field is modified',
        steps: '1. Navigate to Admin > Users\n2. Click "Bulk Upload"\n3. Upload CSV with changed email in column 3\n4. Submit form\n5. Error appears: "Invalid email format"',
        impact: 'Blocking 15 admins from batch user updates',
        resolution: 'Email validation regex requires lowercase domain. Convert emails to lowercase before upload or update validation rule'
      },
      relatedTickets: ['ENT-22801', 'ENT-23045'],
      metadata: {created: '2024-01-15', priority: 'P1', category: 'Data Import'}
    },
    auth_token: {
      id: 'ENG-18234',
      title: 'API authentication token expires prematurely',
      sections: {
        description: 'REST API tokens expire after 15 minutes instead of configured 24 hours',
        steps: '1. Generate API token via /auth/token endpoint\n2. Use token in Authorization header\n3. After 15 mins, requests return 401 Unauthorized\n4. Token refresh required',
        impact: 'Breaking automated workflows; 200+ failed jobs per day',
        resolution: 'Clock skew between auth service and token validator. Sync NTP across microservices. Updated token TTL to account for max 10-min skew'
      },
      relatedTickets: ['ENG-17990', 'ENG-18401'],
      metadata: {created: '2024-02-20', priority: 'P0', category: 'Authentication'}
    },
    data_sync: {
      id: 'DATA-9823',
      title: 'Nightly data sync job fails silently',
      sections: {
        description: 'Snowflake -> Redshift sync completes with 0 rows transferred, no error logs',
        steps: '1. Trigger nightly sync via cron\n2. Check Redshift target table\n3. Row count unchanged\n4. Snowflake source has 10K new rows\n5. Airflow DAG shows success status',
        impact: 'Analytics dashboard shows stale data; executives making decisions on 3-day-old metrics',
        resolution: 'Snowflake query timeout set to 30s, table scan takes 2 mins. Increased timeout to 5 mins. Added row count validation to fail DAG if mismatch detected'
      },
      relatedTickets: ['DATA-9654', 'DATA-9889'],
      metadata: {created: '2024-03-10', priority: 'P1', category: 'Data Pipeline'}
    },
    api_rate: {
      id: 'API-5621',
      title: 'Rate limit exceeded on partner API',
      sections: {
        description: 'Third-party geocoding API returns 429 Too Many Requests during peak hours',
        steps: '1. User submits address for validation\n2. App calls Geocode API\n3. During 9-11am PST, 30% of requests fail with 429\n4. Retry logic exhausts after 3 attempts',
        impact: 'Address validation fails for customer onboarding; 150 signups per day blocked',
        resolution: 'Implemented exponential backoff with jitter. Added local LRU cache for repeated addresses (85% hit rate). Negotiated higher rate limit with vendor (1000 -> 5000 req/min)'
      },
      relatedTickets: ['API-5502', 'API-5688'],
      metadata: {created: '2024-04-05', priority: 'P2', category: 'External Integration'}
    }
  };

  // Flat-text chunking simulation
  function flatTextChunking(ticket) {
    const chunks = [];
    const allText = `${ticket.title} ${Object.values(ticket.sections).join(' ')} ${ticket.metadata.category}`;
    // Simulate 512-token chunks (roughly 384 chars)
    for (let i = 0; i < allText.length; i += 384) {
      chunks.push({
        text: allText.substring(i, i + 384),
        ticketId: ticket.id,
        source: 'mixed'
      });
    }
    return chunks;
  }

  // Graph-based structured retrieval
  function graphRetrieval(ticket, query) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Check if query asks for specific section
    if (queryLower.includes('reproduce') || queryLower.includes('steps')) {
      results.push({
        text: ticket.sections.steps,
        ticketId: ticket.id,
        section: 'steps',
        score: 0.94
      });
    }
    
    if (queryLower.includes('fix') || queryLower.includes('resolution') || queryLower.includes('solve')) {
      results.push({
        text: ticket.sections.resolution,
        ticketId: ticket.id,
        section: 'resolution',
        score: 0.88
      });
    }
    
    if (queryLower.includes('impact') || queryLower.includes('affect')) {
      results.push({
        text: ticket.sections.impact,
        ticketId: ticket.id,
        section: 'impact',
        score: 0.85
      });
    }
    
    // Always include description
    if (results.length < 3) {
      results.push({
        text: ticket.sections.description,
        ticketId: ticket.id,
        section: 'description',
        score: 0.82
      });
    }
    
    return results.slice(0, 3);
  }

  // Simulate flat-text retrieval with noise
  function simulateFlatRetrieval(ticket, query) {
    const chunks = flatTextChunking(ticket);
    const results = [];
    
    // First result often correct but lower confidence
    results.push({
      text: chunks[0].text.substring(0, 150) + '...',
      score: 0.68,
      rank: 1,
      isCorrect: query.toLowerCase().includes('reproduce') ? false : true
    });
    
    // Mix in irrelevant chunks from metadata/title
    results.push({
      text: `Category: ${ticket.metadata.category}. Created ${ticket.metadata.created}. Related: ${ticket.relatedTickets.join(', ')}...`,
      score: 0.54,
      rank: 2,
      isCorrect: false
    });
    
    results.push({
      text: chunks[1] ? chunks[1].text.substring(0, 150) + '...' : ticket.title,
      score: 0.51,
      rank: 3,
      isCorrect: false
    });
    
    return results;
  }

  function updateUI() {
    const querySelect = document.getElementById('p53-query');
    if (!querySelect) return;
    
    const selectedQuery = querySelect.value;
    const ticket = ticketDB[selectedQuery];
    const queryText = querySelect.options[querySelect.selectedIndex].text;
    
    // Update flat-text results
    const flatResults = simulateFlatRetrieval(ticket, queryText);
    flatResults.forEach((result, i) => {
      const scoreEl = document.getElementById(`p53-flat-score-${i+1}`);
      const resultEl = document.getElementById(`p53-flat-result-${i+1}`);
      if (scoreEl) scoreEl.textContent = result.score.toFixed(2);
      if (resultEl) resultEl.textContent = result.text;
    });
    
    const flatCorrectEl = document.getElementById('p53-flat-correct');
    if (flatCorrectEl) {
      const hasCorrect = flatResults[0].isCorrect;
      flatCorrectEl.textContent = hasCorrect ? 'Yes ✓' : 'No';
      flatCorrectEl.className = hasCorrect ? 'font-semibold text-success' : 'font-semibold text-error';
    }
    
    // Update graph-based results
    const graphResults = graphRetrieval(ticket, queryText);
    graphResults.forEach((result, i) => {
      const scoreEl = document.getElementById(`p53-graph-score-${i+1}`);
      const resultEl = document.getElementById(`p53-graph-result-${i+1}`);
      if (scoreEl) scoreEl.textContent = result.score.toFixed(2);
      if (resultEl) resultEl.textContent = `[${result.section}] ${result.text}`;
    });
    
    // Update explanation
    const explanationEl = document.getElementById('p53-explanation');
    if (explanationEl) {
      explanationEl.innerHTML = `
        <p class="font-semibold text-heading">Why graph won this round</p>
        <p class="text-body">The query asked for "${queryText}". Flat-text RAG returned keyword-matched chunks mixing metadata, title fragments, and partial sections (score 0.68). Graph-based RAG parsed the query intent, executed a Cypher query targeting the <code class="text-xs bg-surface px-1 rounded">${graphResults[0].section}</code> node via HAS_${graphResults[0].section.toUpperCase()} edge, and returned the complete relevant section (score 0.94).</p>
      `;
    }
    
    // Update graph visualization
    updateGraphViz(ticket);
  }

  function updateGraphViz(ticket) {
    const vizEl = document.getElementById('p53-graph-viz');
    if (!vizEl) return;
    
    vizEl.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-start gap-3">
          <div class="w-32 px-3 py-2 bg-blue-50 dark:bg-blue-950 border-2 border-blue-500 rounded text-xs font-semibold text-center">
            Ticket<br/>${ticket.id}
          </div>
          <div class="flex-1 grid grid-cols-2 gap-2">
            <div class="px-2 py-1 bg-green-50 dark:bg-green-950 border border-green-500 rounded text-xs">
              <span class="font-semibold">HAS_DESCRIPTION →</span><br/>
              <span class="text-muted">${ticket.sections.description.substring(0, 60)}...</span>
            </div>
            <div class="px-2 py-1 bg-green-50 dark:bg-green-950 border border-green-500 rounded text-xs">
              <span class="font-semibold">HAS_STEPS →</span><br/>
              <span class="text-muted">${ticket.sections.steps.substring(0, 60)}...</span>
            </div>
            <div class="px-2 py-1 bg-green-50 dark:bg-green-950 border border-green-500 rounded text-xs">
              <span class="font-semibold">HAS_IMPACT →</span><br/>
              <span class="text-muted">${ticket.sections.impact.substring(0, 60)}...</span>
            </div>
            <div class="px-2 py-1 bg-green-50 dark:bg-green-950 border border-green-500 rounded text-xs">
              <span class="font-semibold">HAS_RESOLUTION →</span><br/>
              <span class="text-muted">${ticket.sections.resolution.substring(0, 60)}...</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-2 text-xs text-muted pl-32">
          <span class="font-semibold">RELATED_TO edges:</span>
          ${ticket.relatedTickets.map(id => `<span class="px-2 py-1 bg-purple-50 dark:bg-purple-950 border border-purple-500 rounded">${id}</span>`).join('')}
        </div>
        
        <div class="text-xs text-body pt-2 border-t border-divider">
          <p><strong>Cypher query example:</strong> <code class="text-xs bg-surface px-1 rounded">MATCH (t:Ticket {ID:'${ticket.id}'})-[:HAS_STEPS]->(s:Section) RETURN s.content</code></p>
          <p class="text-muted mt-1">Graph returns entire "steps" section as single coherent block, preserving numbered list structure. Flat-text RAG would split this across multiple 512-token chunks.</p>
        </div>
      </div>
    `;
  }

  function init() {
    const querySelect = document.getElementById('p53-query');
    if (!querySelect) {
      console.warn('P53 interactive elements not found, skipping init');
      return;
    }
    
    querySelect.addEventListener('change', updateUI);
    updateUI(); // Initial render
  }

  // Export for paperLoader to call
  function interactiveScript() {
    setTimeout(() => init(), 0);
  }

  // Attach helpers for testing
  interactiveScript.init = init;
  interactiveScript.updateUI = updateUI;

  if (typeof window !== 'undefined') {
    window.p53InteractiveScript = interactiveScript;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveScript;
  }
})();
