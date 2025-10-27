#!/usr/bin/env python3
"""
Fix all paper share pages to use consistent template format.
Reads manifest.json and generates standardized p/N.html files.
"""

import json
from pathlib import Path

# Template for share pages
SHARE_PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Paper {num} • LLM Paper Explainers</title>
  <meta name="robots" content="noindex,follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
  <meta property="og:site_name" content="LLM Learning Hub">
  <meta property="og:url" content="https://pondevelopment.github.io/llm-training/p/{num}.html">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="https://pondevelopment.github.io/llm-training/og-image.png">
  <link rel="icon" href="../favicon.ico">
  <style>body{{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;margin:0;padding:2rem;background:#f8fafc;color:#111827}}
  .header{{max-width:720px;margin:0 auto 2rem;text-align:center}}
  .logo{{font-size:16px;font-weight:600;color:#4f46e5;text-decoration:none;transition:color .2s}}
  .logo:hover{{color:#6366f1}}
  .card{{max-width:720px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.06)}}
  .title{{font-weight:700;font-size:20px;margin:0 0 8px}}
  .desc{{font-size:14px;color:#374151;margin:0 0 16px}}
  .btn{{display:inline-block;background:#4f46e5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;transition:opacity .2s}}
  .btn:hover{{opacity:.9}}
  .muted{{font-size:12px;color:#6b7280;margin-top:12px}}
  .footer{{max-width:720px;margin:2rem auto 0;padding-top:2rem;border-top:1px solid #e5e7eb;font-size:11px;color:#6b7280;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}}
  .footer a{{color:#4f46e5;text-decoration:none}}
  .footer a:hover{{text-decoration:underline}}
  </style>
</head>
<body>
  <header class="header">
    <a href="../index.html" class="logo">← LLM Learning Hub</a>
  </header>
  <main class="card">
    <h1 class="title">{title}</h1>
    <p class="desc">{description}</p>
    <a class="btn" href="../index.html#paper-{num}">Open interactive explainer</a>
    <p class="muted">Direct link to the interactive summary of this paper.</p>
  </main>

  <footer class="footer">
    <div>
      <span>Last updated: <span id="build-timestamp">Loading...</span></span>
    </div>
    <div>
      <a href="https://github.com/pondevelopment/llm-training" target="_blank" rel="noopener">View on GitHub</a>
      <span> • </span>
      <span id="build-commit" style="font-family:monospace;font-size:10px"></span>
    </div>
  </footer>

  <script src="../js/build-info.js"></script>
  <script>
    (function() {{
      if (window.BUILD_INFO && window.BUILD_INFO.timestamp !== 'BUILD_TIMESTAMP_PLACEHOLDER') {{
        const timestampEl = document.getElementById('build-timestamp');
        const commitEl = document.getElementById('build-commit');
        if (timestampEl) {{
          const timestamp = new Date(window.BUILD_INFO.timestamp);
          timestampEl.textContent = timestamp.toLocaleDateString('en-US', {{
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
          }});
        }}
        if (commitEl && window.BUILD_INFO.commit !== 'dev') {{
          commitEl.textContent = window.BUILD_INFO.commit;
        }}
      }} else {{
        const timestampEl = document.getElementById('build-timestamp');
        if (timestampEl) timestampEl.textContent = 'Development';
      }}
    }})();
  </script>
</body>
</html>
"""

def main():
    # Read manifest
    manifest_path = Path('papers/manifest.json')
    if not manifest_path.exists():
        print(f"Error: {manifest_path} not found")
        return
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    
    p_dir = Path('p')
    if not p_dir.exists():
        print(f"Error: {p_dir} directory not found")
        return
    
    print(f"Updating {len(manifest)} paper share pages...")
    
    for paper_id, paper_data in manifest.items():
        num = int(paper_id)
        title = paper_data.get('title', 'Untitled Paper')
        summary = paper_data.get('summary', '')
        
        # Create concise description from summary (first sentence or first 200 chars)
        description = summary
        if len(description) > 200:
            # Try to cut at sentence boundary
            sentences = description.split('. ')
            if len(sentences) > 1:
                description = sentences[0] + '.'
            else:
                description = description[:197] + '...'
        
        # Generate HTML
        html = SHARE_PAGE_TEMPLATE.format(
            num=num,
            title=title,
            description=description
        )
        
        # Write file
        output_path = p_dir / f"{num}.html"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"  ✓ Updated p/{num}.html")
    
    print(f"\n✅ Successfully updated {len(manifest)} paper share pages!")
    print("\nKey fixes applied:")
    print("  • Consistent header with logo link")
    print("  • Correct OG image URL (og-image.png)")
    print("  • Proper back links (../index.html#paper-N)")
    print("  • Footer with build info")
    print("  • Unified inline CSS styling")

if __name__ == '__main__':
    main()
