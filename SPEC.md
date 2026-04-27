# Spec: Astro + Sanity Starter

## Objective

Build a production-ready Astro starter that ships with Sanity CMS wired up out of the box.
A developer who clones this repo should be able to add their Sanity project credentials, run
`npm run dev`, and immediately have:

- A working Sanity Studio embedded at `/studio`
- A `page` document type in Sanity with content authoring UI
- Astro content collection backed by live Sanity data
- One generated static HTML page per Sanity `page` document
- Shared TypeScript types flowing from Sanity schema → codegen → Astro — no duplicate type definitions
- Tailwind CSS wired up and ready for styling

### User Stories

1. **As a content author** I can open `/studio`, create a Page with a title, slug, description,
   and rich-text body, hit Publish, and see a new page appear on the site at `/<slug>`.
2. **As a developer** I can add a new Sanity document type and its matching Astro collection
   by following a single documented pattern without duplicating field definitions.
3. **As a developer** I always have TypeScript types for my GROQ query results — they are
   generated automatically and never hand-written.

---

## Tech Stack

| Concern | Package / Version |
|---|---|
| Framework | Astro (latest stable — `npm create astro@latest`, currently v5.x) |
| CMS | Sanity v3 (`sanity`, `@sanity/client`) |
| Studio embed | `@sanity/astro` |
| Type generation | `@sanity/codegen` + `sanity typegen generate` |
| Styling | Tailwind CSS v4 (via `@astrojs/tailwind` or native Vite plugin) |
| Language | TypeScript (strict) |
| Testing | Vitest (unit); no E2E in v1 |
| Linting / format | Prettier (already configured in this repo) |

---

## Commands

```bash
# Install dependencies
npm install

# Start Astro dev server (also serves /studio)
npm run dev

# Generate Sanity TypeScript types from schema + queries
npm run typegen

# Type-check
npm run typecheck

# Build static site
npm run build

# Preview built site
npm run preview

# Run unit tests
npm test
```

---

## Project Structure

```
/
├── src/
│   ├── content/
│   │   └── config.ts              # Astro content collection definitions (uses generated types)
│   ├── pages/
│   │   ├── index.astro            # Home page — lists all pages
│   │   ├── [slug].astro           # Dynamic page route — one per Sanity page document
│   │   └── studio/
│   │       └── [...index].astro   # Embedded Sanity Studio (client-only island)
│   ├── sanity/
│   │   ├── schema/
│   │   │   ├── shared/
│   │   │   │   └── webDocument.ts # Common field arrays: title, slug, description, metaImage, metaImageAlt
│   │   │   ├── documents/
│   │   │   │   └── page.ts        # Page document type (composes webDocument fields)
│   │   │   └── index.ts           # Schema registry — add new types here
│   │   ├── lib/
│   │   │   ├── client.ts          # Sanity client (reads SANITY_PROJECT_ID, SANITY_DATASET)
│   │   │   └── queries.ts         # All GROQ queries (typed via codegen)
│   │   └── types/
│   │       └── index.ts           # Re-exports generated types from sanity-codegen output
│   ├── components/
│   │   ├── PageCard.astro          # Reusable card component for page listings
│   │   └── Layout.astro            # Base HTML layout with Tailwind resets
│   └── env.d.ts                   # Astro env types + import.meta.env declarations
├── sanity.config.ts               # Sanity Studio config (imports schema from src/sanity/schema)
├── sanity.cli.ts                  # Sanity CLI config (project ID, dataset)
├── sanity-typegen.json            # Codegen config (schema path, output path, GROQ sources)
├── astro.config.mjs               # Astro config (integrations: sanity, tailwind)
├── tailwind.config.mjs            # Tailwind config (content paths)
├── tsconfig.json                  # TypeScript config (strict, path aliases)
├── .env.example                   # Template for SANITY_PROJECT_ID, SANITY_DATASET, etc.
└── README.md                      # Getting-started guide
```

---

## Core Design Decisions

### 1. Shared Fields via `webDocument.ts`

Every Sanity document type that becomes a web page composes the same base field array
rather than repeating field definitions. Astro receives the TypeScript types for free via
codegen — no parallel Zod schema is maintained.

```ts
// src/sanity/schema/shared/webDocument.ts
import { defineField } from 'sanity'

export const webDocumentFields = [
  defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
  defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: Rule => Rule.required() }),
  defineField({ name: 'description', type: 'text', rows: 3 }),
  defineField({ name: 'metaImage', type: 'image', options: { hotspot: true } }),
  defineField({ name: 'metaImageAlt', type: 'string' }),
]
```

### 2. Type Generation Flow

```
Sanity schema (TypeScript)
      │
      ▼  sanity typegen generate
Generated types in sanity-typegen.json output
      │
      ▼  import in src/sanity/types/index.ts
Astro pages and collections consume typed GROQ results
```

Run `npm run typegen` after adding or changing any schema or GROQ query.
CI should fail if committed generated types are stale.

### 3. Content Collection via Sanity Loader

The Astro content collection in `src/content/config.ts` uses the Sanity loader from
`@sanity/astro` to fetch all `page` documents at build time. This means no runtime
API calls for the rendered pages — they are fully static.

### 4. Adding a New Document Type (Developer Workflow)

1. Create `src/sanity/schema/documents/<name>.ts` — compose `webDocumentFields` plus
   any additional fields.
2. Register the type in `src/sanity/schema/index.ts`.
3. Add a GROQ query in `src/sanity/lib/queries.ts`.
4. Run `npm run typegen` to regenerate types.
5. Add an Astro content collection in `src/content/config.ts` using the Sanity loader.
6. Create the matching Astro page(s) in `src/pages/`.

This is the documented pattern — there is no generator script in v1.

---

## Code Style

```ts
// Prefer defineField / defineType for all Sanity schema definitions.
// Use named exports — no default exports in schema files.
// GROQ queries are tagged template literals stored in queries.ts, not inline.
// Astro components use TypeScript frontmatter; Props interface defined inline.
```

Formatting is enforced by Prettier (config already in repo).

---

## Environment Variables

```
SANITY_PROJECT_ID=       # Required — Sanity project ID
SANITY_DATASET=          # Required — e.g. "production"
SANITY_API_READ_TOKEN=   # Optional — needed for draft preview in future
PUBLIC_SANITY_PROJECT_ID= # Exposed to client for Studio embed
PUBLIC_SANITY_DATASET=    # Exposed to client for Studio embed
```

---

## Testing Strategy

- **Unit tests (Vitest)**: Schema helper functions (e.g. `webDocumentFields` shape),
  query string composition utilities.
- **No E2E in v1** — deferred to a future chapter.
- Tests live alongside source in `src/**/*.test.ts`.

---

## Boundaries

- **Always:** Run `npm run typegen` after schema changes. Follow conventional commits. Keep
  `webDocumentFields` as the single source for shared web document fields.
- **Ask first:** Adding a Yeoman/plop generator for new content types. Enabling SSR/preview
  draft mode. Adding a component library (shadcn, DaisyUI, etc.).
- **Never:** Hand-write TypeScript types that mirror Sanity schemas. Commit `.env` with real
  credentials. Skip type-checking in CI.

---

## Success Criteria

- [ ] `npm run dev` starts without errors; `/studio` loads Sanity Studio in the browser
- [ ] Creating a Page in the Studio with title, slug, and description, then rebuilding,
      produces a static HTML file at `/<slug>`
- [ ] `npm run typegen` generates TypeScript types from the schema and GROQ queries with no errors
- [ ] `npm run typecheck` passes with zero type errors
- [ ] `npm run build` produces a static site with zero errors
- [ ] `npm test` passes (unit tests for schema helpers)
- [ ] A new developer following the "Adding a New Document Type" steps can ship a second
      document type without touching existing code

---

## Open Questions

1. **Astro rendering mode**: Confirmed SSG (static) for v1? Or should there be an SSR mode
   option for preview drafts?
2. **Tailwind approach**: Minimal CSS custom properties / base reset only, or include a
   small set of pre-built utility classes for layout (e.g., a responsive grid for the index page)?
3. **Rich text / Portable Text**: Should the `page` document type include a
   Portable Text (`block` array) body field in addition to `description`? Rendering
   Portable Text in Astro requires `@portabletext/react` or `astro-portabletext`.
4. **Yeoman / Plop generator**: Defer to v2, or include a minimal `plop` scaffold for
   generating new document type files?
5. **Testing**: Is Vitest acceptable, or is there a preference for another test runner?
6. **Home page**: Should `index.astro` list all pages as a simple link list, or include
   a styled card grid?

---

## Story Branch Plan (proposed)

Once the spec is approved, implementation follows the narrative-branching pattern:

| Chapter | Scope |
|---|---|
| `ch1/project-scaffold` | `npm create astro` + Tailwind + TypeScript config + env setup |
| `ch2/sanity-schema` | `webDocument.ts` shared fields + `page` document type + Sanity config |
| `ch3/type-generation` | Sanity codegen config + `npm run typegen` + CI type-check step |
| `ch4/content-collection` | Astro content collection with Sanity loader |
| `ch5/page-routes` | `[slug].astro` dynamic route + index page |
| `ch6/studio-embed` | `/studio` route with embedded Sanity Studio |
| `ch7/polish` | README, `.env.example`, Tailwind base styles, final tests |
