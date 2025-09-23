Modernize Panels Plan to a centralized CSS to better support dark / light mode and ensure consistency in the site

Phase 1 - Inventory

Script/grep through questions/ and papers/ to list files still using raw color utilities (bg-*-50, border-*-200, inline hex).
Triage the list into logical batches (e.g., Q01-Q10, Q11-Q20, papers overview vs. interactive).
Status: completed 2025-09-23.
Findings:
- Questions: 56 directories still rely on Tailwind color utilities. q09 already uses the semantic helpers.
- Inline hex hotspots:
  - Q01-Q10: q02, q04, q06, q07, q10
  - Q11-Q20: q11, q12, q18
  - Q21-Q30: q21, q22, q24, q30
  - Q31-Q40: q31, q32, q33, q40
  - Q41-Q50: q42, q46, q47, q48, q49, q50
  - Q51-Q57: q51
- Papers: p-template and p01-p20 all use bg-*-50/border-*-200 combinations; no inline hex detected yet.
- Templates: papers/p-template/* mirrors the same raw utilities and will need to be updated alongside the papers batch.

Phase 2 - Questions

Batch-by-batch replace HTML classes with the semantic helpers (panel ..., chip ..., view-toggle).
Update companion JS to drop inline colors in favour of the new tokens.
Smoke-check each batch (light/dark, share page, interactive behaviour).
Status:
- Q01 migrated on 2025-09-23 (panels + chips + token-aware legend). Manual smoke check pending until more of Q01-Q10 are complete.
- Q02 migrated on 2025-09-23 (attention explorer uses tokens + themed legend/indicator). Smoke-check still pending for combined Q01-Q02 set.
- Next batch: Q03-Q10 (pending).

Phase 3 - Papers

Apply the same refactor to papers/pXX/overview.html and interactive.html/js.
Verify cards/metrics honor the semantic tokens in both themes.

Phase 4 - Share Pages & Templates

Ensure all _template and /q/XX.html pages use the shared theme + semantic helpers (already started; just confirm consistency).

Phase 5 - Regression Pass

Spot-check representative questions/papers in light/dark mode.
Run through all.html, learning paths, and updates.html to confirm cards pick up the new tokens.
