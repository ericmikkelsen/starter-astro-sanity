# Story: The Big Content Story

## Motivation

Evolve the starter from a single-page-content pipeline into a reusable content platform.
This story adds two real content models plus scaffolding workflows so new content types
and reusable components can be created quickly with aligned Sanity + Astro contracts.

## Acceptance Criteria

- [ ] Array-based page-builder document type works end-to-end.
- [ ] Portable-text web content document type works end-to-end.
- [ ] `npm run scaffold:web-block` generates schema + content-layer module + Astro template.
- [ ] `npm run scaffold:web-portable` generates schema + content-layer module + Astro template.
- [ ] `npm run scaffold:component` generates Sanity object schema + Astro component.
- [ ] Scaffold CLI prompts include URL prefix handling for document routes.
- [ ] Scaffolds print one-line import/registration instructions after generation.
- [ ] Visual editing works for both array-based and portable-text flows.
- [ ] Studio preview links are available for supported documents.
- [ ] `docs/scaffolds.md` documents usage, prompts, outputs, and required wiring.

## Execution Mode

- Sequential (default): chapters are dependency-ordered and should land in order.

## Chapters

| #   | Branch                                                                  | Scope (one sentence)                                                                                         |
| --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 01  | `chapter/the-big-content-story/01-content-layer-loader-core`            | Add Astro Content Layer Sanity loader core path for published content and typed result contracts.            |
| 02  | `chapter/the-big-content-story/02-content-layer-preview-mode`           | Add draft/preview loader behavior parity with token guardrails.                                              |
| 03  | `chapter/the-big-content-story/03-array-block-primitives-schema`        | Add array block primitive schema modules (Billboard, List Scroller, People refs, RichText).                  |
| 04  | `chapter/the-big-content-story/04-array-page-builder-document`          | Add array-based page-builder document schema and registration wiring.                                        |
| 05  | `chapter/the-big-content-story/05-array-page-builder-routes`            | Add route/query mapping and rendering path for array-based page-builder documents.                           |
| 06  | `chapter/the-big-content-story/06-portable-text-document-schema`        | Add portable-text-first web document schema and registration wiring.                                         |
| 07  | `chapter/the-big-content-story/07-portable-text-routes`                 | Add route/query mapping and rendering path for portable-text web documents.                                  |
| 08  | `chapter/the-big-content-story/08-shared-rendering-primitives`          | Add shared Astro rendering primitives and stable prop contracts for generated templates/components.          |
| 09  | `chapter/the-big-content-story/09-scaffold-web-block`                   | Implement block web-content scaffold command with URL-prefix prompt and post-run registration guidance.      |
| 10  | `chapter/the-big-content-story/10-scaffold-web-portable`                | Implement portable-text web-content scaffold command with matching output conventions and guidance line.     |
| 11  | `chapter/the-big-content-story/11-scaffold-component`                   | Implement component scaffold with prompt-selectable body type and fixed output dirs (`atom`/`molecule`/etc). |
| 12  | `chapter/the-big-content-story/12-studio-preview-links`                 | Add Studio preview link generation for supported document types.                                             |
| 13  | `chapter/the-big-content-story/13-visual-editing-integration`           | Wire visual editing behavior for array-based and portable-text content types.                                |
| 14  | `chapter/the-big-content-story/14-docs-and-generator-contract-tests`    | Add `docs/scaffolds.md` plus tests for scaffold outputs, route-prefix behavior, and loader preview behavior. |
| 15  | `chapter/the-big-content-story/15-story-hardening-and-regression-guard` | Add final polish, migration-safety checks, and regression validation for existing page behavior.             |

## Out of Scope

- Full design-system polish for generated templates/components.
- New auth models beyond existing preview-token strategy.
- Agent Action production rollout (only backlog candidate capture in this story).

## Dependencies

- Existing Astro + Sanity starter foundation remains intact and passing.
- Sanity project credentials and preview token values available for local validation.
- Astro Content Layer API available in current project version.

## Chapter Approval Questions

1. For chapter 05 routing, should prefix validation reject pluralization mismatches (`campaign` vs `campaigns`) or just enforce URL-safe kebab-case?
2. For chapter 14 tests, do you want snapshot-style generator tests, or explicit file-structure assertions only?
3. Do you want chapter 15 to include optional performance checks (build time impact of generated modules), or keep it strictly functional regression/safety?
