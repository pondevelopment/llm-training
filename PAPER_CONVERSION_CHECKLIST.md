# Paper Conversion Checklist

Use Paper 1 as the EXACT reference. Check every single item below.

## Root & Header (lines 1-20)

```html
<section class="space-y-5">
  <section class="panel panel-info p-4 space-y-4">
    <div class="flex items-center justify-between gap-4">
      <div class="flex-1 min-w-0">
        <h2 class="text-xl font-semibold text-heading">Title</h2>
        <p class="text-sm panel-muted">Authors &bull; Venue</p>
      </div>
      <a href="..." class="btn-soft text-xs font-semibold flex-shrink-0" data-accent="foundations">
        <span>View paper</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
    <p class="text-sm leading-relaxed panel-muted">
      Summary paragraph.
    </p>
  </section>
```

**Checklist:**
- [ ] Root: `<section class="space-y-5">` (NOT div, NO paper-overview-card)
- [ ] Header: `panel panel-info p-4 space-y-4` (NO panel-emphasis, NOT p-5, NOT space-y-3)
- [ ] Layout: `flex items-center justify-between gap-4` (NOT flex-wrap, NO md:flex-nowrap)
- [ ] Title wrapper: `flex-1 min-w-0` (NO space-y-1, NO md:max-w-3xl)
- [ ] Button: `btn-soft text-xs font-semibold flex-shrink-0`
- [ ] Summary: `text-sm leading-relaxed panel-muted` (NOT text-body, order matters!)

## Plain-language explainer

```html
  <section class="panel panel-neutral-soft p-3 space-y-1 text-xs">
    <p class="font-semibold text-heading">Plain-language explainer</p>
    <p class="panel-muted">Analogy text...</p>
  </section>
```

**Checklist:**
- [ ] Class: `panel panel-neutral-soft p-3 space-y-1 text-xs` (NOT p-4, NOT space-y-1.5)
- [ ] Heading: "Plain-language explainer" (NOT "summary")
- [ ] Text: `panel-muted` (NOT text-body, NOT text-xs on paragraph)

## Executive quick take

```html
  <section class="panel panel-neutral p-5 space-y-3">
    <header class="flex items-center gap-2">
      <span aria-hidden="true" class="text-lg">🧭</span>
      <h3 class="text-sm font-semibold tracking-wide uppercase text-heading">Executive quick take</h3>
    </header>
    <p class="text-sm leading-relaxed text-body">
      Main paragraph.
    </p>
    <ul class="list-disc ml-5 space-y-1 text-sm panel-muted">
      <li><strong>Point:</strong> Detail</li>
    </ul>
  </section>
```

**Checklist:**
- [ ] Section: `panel panel-neutral p-5 space-y-3` (NO panel-emphasis, NOT p-4)
- [ ] Header: `<header>` with icon as `<span>`, emoji inline (NOT as separate element)
- [ ] h3 order: `text-sm font-semibold tracking-wide uppercase text-heading` (order matters!)
- [ ] Paragraph: `text-sm leading-relaxed text-body` (order matters!)
- [ ] List: `list-disc ml-5 space-y-1 text-sm panel-muted` (NOT text-body!)

## Business relevance

```html
  <section class="panel panel-success p-5 space-y-3">
    <h3 class="text-sm font-semibold text-heading">💼 Business relevance</h3>
    <ul class="list-disc ml-5 space-y-1 text-sm text-body">
      <li><strong>Audience:</strong> Action item</li>
    </ul>
    <div class="panel panel-neutral-soft p-3 mt-3 space-y-1 text-xs">
      <p class="font-semibold text-heading">Derivative example (...)</p>
      <p class="panel-muted">Example text</p>
    </div>
  </section>
```

**Checklist:**
- [ ] Section: `panel panel-success p-5 space-y-3` (NOT p-4, NOT space-y-2)
- [ ] Heading: `<h3>` with emoji INLINE (NO header wrapper!)
- [ ] List: `list-disc ml-5 space-y-1 text-sm text-body` (uses text-body, not panel-muted)
- [ ] Example box: `panel panel-neutral-soft p-3 mt-3 space-y-1 text-xs`

## Supporting callouts (2-column grid)

```html
  <div class="grid md:grid-cols-2 gap-4">
    <div class="panel panel-info p-4 space-y-2">
      <h3 class="text-sm font-semibold text-heading">Title</h3>
      <p class="text-xs panel-muted">Explanation...</p>
      <ul class="list-disc ml-4 space-y-1 text-[11px] panel-muted">
        <li>Detail point</li>
      </ul>
    </div>
  </div>
```

**Checklist:**
- [ ] Wrapper: `<div class="grid md:grid-cols-2 gap-4">` (NOT section, NOT article)
- [ ] Cards: `<div class="panel panel-info p-4 space-y-2">` (NOT panel-accent!)
- [ ] Text: `text-xs panel-muted` (NOT text-body)
- [ ] Lists: `text-[11px] panel-muted` (stays text-[11px] if present)

## Key insight trio (3-column grid)

```html
  <div class="grid md:grid-cols-3 gap-4">
    <div class="panel panel-neutral p-4 space-y-2">
      <h3 class="text-sm font-semibold text-heading">Key insight</h3>
      <p class="text-xs panel-muted">Detail...</p>
    </div>
    <div class="panel panel-neutral p-4 space-y-2">
      <h3 class="text-sm font-semibold text-heading">Method</h3>
      <p class="text-xs panel-muted">Detail...</p>
    </div>
    <div class="panel panel-neutral p-4 space-y-2">
      <h3 class="text-sm font-semibold text-heading">Implication</h3>
      <p class="text-xs panel-muted">Detail...</p>
    </div>
  </div>
```

**Checklist:**
- [ ] Wrapper: `<div class="grid md:grid-cols-3 gap-4">` (NOT section!)
- [ ] Cards: `<div class="panel panel-neutral p-4 space-y-2">` (NOT article, NOT section)
- [ ] Text: `text-xs panel-muted` (NOT text-body)

## Evidence section

```html
  <section class="panel panel-neutral p-5 space-y-3">
    <h3 class="text-sm font-semibold text-heading">🧪 Evidence</h3>
    <ul class="list-disc ml-5 space-y-1 text-sm panel-muted">
      <li><strong>Finding:</strong> Detail</li>
    </ul>
  </section>
```

**Checklist:**
- [ ] Section: `panel panel-neutral p-5 space-y-3`
- [ ] Heading: emoji INLINE (NO header wrapper)
- [ ] List: `list-disc ml-5 space-y-1 text-sm panel-muted` (NOT text-body!)

## Roadmap section

```html
  <section class="panel panel-warning p-5 space-y-2">
    <h3 class="text-sm font-semibold text-heading">🔭 For your roadmap</h3>
    <ul class="list-disc ml-5 space-y-1 text-sm text-body">
      <li>Action item</li>
    </ul>
  </section>
```

**Checklist:**
- [ ] Section: `panel panel-warning p-5 space-y-2` (NOT space-y-3!)
- [ ] Heading: emoji INLINE (NO header wrapper)
- [ ] List: `list-disc ml-5 space-y-1 text-sm text-body` (uses text-body!)

## Common mistakes to AVOID

1. ❌ `panel-emphasis` on header (Paper 1 never uses it)
2. ❌ `<header>` wrappers with icons (only Executive quick take uses header)
3. ❌ `<article>` or `<section>` for grid cards (always `<div>`)
4. ❌ `text-body` in Executive quick take lists (should be `panel-muted`)
5. ❌ `panel-muted` in Business relevance lists (should be `text-body`)
6. ❌ `text-body` in Evidence lists (should be `panel-muted`)
7. ❌ `p-4` instead of `p-5` on major sections
8. ❌ `space-y-3` on Roadmap (should be `space-y-2`)
9. ❌ `text-sm text-body leading-relaxed` (wrong order! Should be `text-sm leading-relaxed text-body`)
10. ❌ `panel-accent` for supporting callouts (should be `panel-info`)

## Text token quick reference

- **Header summary**: `panel-muted`
- **Executive quick take paragraph**: `text-body`
- **Executive quick take list**: `panel-muted` ⚠️
- **Business relevance list**: `text-body`
- **Supporting callouts**: `panel-muted`
- **Trio cards**: `panel-muted`
- **Evidence list**: `panel-muted` ⚠️
- **Roadmap list**: `text-body`
