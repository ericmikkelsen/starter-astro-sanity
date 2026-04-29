# Astro + Sanity Starter

Starter template for building static Astro sites powered by Sanity content, with:

- Sanity Studio integrated at `/studio`
- Page content model (`title`, `slug`, `description`, shared metadata fields)
- Astro page generation from Sanity content
- Story/chapter workflow and quality-gate automation

## Requirements

- Node.js 20+
- npm 10+
- A Sanity account and project

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Create your environment file.

```bash
cp .env.example .env
```

3. Fill in required environment values in `.env`.

```dotenv
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2026-01-01
PUBLIC_SITE_URL=http://localhost:4321
SANITY_API_READ_TOKEN=your_read_token_for_preview
SANITY_PREVIEW_SECRET=your_preview_secret
```

`PUBLIC_SITE_URL` is optional in local development, but setting it keeps Studio preview links aligned with the public site URL you expect editors to open.

4. Start development.

```bash
npm run dev
```

5. Visit:

- Site: `http://localhost:4321/`
- Studio: `http://localhost:4321/studio`

## Sanity Token Setup (Concrete UI Steps)

Use a read token for SSR preview and draft-aware queries.

1. Go to `https://www.sanity.io/manage` and sign in.
2. Open the project you are using with this starter.
3. In the project sidebar, click `API`.
4. Open the `Tokens` section.
5. Click `Add API token`.
6. Name it something like `astro-preview-read`.
7. Set permissions to `Viewer` (or lowest read-only scope that supports your queries).
8. Create the token and copy it immediately (Sanity only shows the full value once).
9. Put it in `.env` as `SANITY_API_READ_TOKEN`.
10. Restart the dev server after updating env values.

Security notes:

- Never commit tokens to git.
- Use read-only scope for preview tokens.
- Rotate the token if it is exposed.

## Scripts

- `npm run dev`: Run Astro in development mode.
- `npm run build`: Build the site.
- `npm run preview`: Serve the production build locally.
- `npm test`: Run Node test runner suites.
- `npm run test:dom`: Run DOM tests with Vitest.
- `npm run sanity:typegen`: Generate Sanity static types.

Recommended TypeGen file locations for this starter:

- Schema extract output: `src/sanity/extract.json`
- Generated TypeScript types: `src/sanity/types.ts`

This follows Sanity Learn guidance to keep generated files colocated with Sanity utilities under `src/sanity` rather than writing them to project root.

Generated file policy:

- Do not hand-edit `src/sanity/extract.json` or `src/sanity/types.ts`.
- Regenerate them through scripts whenever schema or GROQ queries change.
- Commit both generated files so CI/reviews use deterministic, versioned types.
- These generated files are excluded from chapter reviewability budget calculations (see `.github/review-config.json`).

Recommended script shape:

```json
{
	"scripts": {
		"sanity:schema:extract": "sanity schema extract --enforce-required-fields --path=./src/sanity/extract.json",
		"sanity:typegen": "npm run sanity:schema:extract && sanity typegen generate",
		"predev": "npm run sanity:typegen",
		"prebuild": "npm run sanity:typegen"
	}
}
```

## Story and Chapter Workflow

This repository is organized for narrative branch flow:

- Story branches: `story/<story-slug>`
- Chapter branches: `chapter/<story-slug>/<chapter-slug>`
- Chapter PR target: matching story branch
- Story PR target: `main`

See [docs/story-chapter-branch-policy.md](./docs/story-chapter-branch-policy.md).

## Developer Workflow Docs

If you are using Copilot chat modes and skills:

- [docs/developer-workflow.md](./docs/developer-workflow.md)
- `.github/chat-modes/` for mode-specific workflows
- `.github/skills/` for reusable skill references
