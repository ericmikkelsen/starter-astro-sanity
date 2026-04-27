import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './sanity/schemaTypes';

// Defaults keep the embedded studio bootable on a fresh clone.
const projectId =
	import.meta?.env?.PUBLIC_SANITY_PROJECT_ID ??
	process.env.PUBLIC_SANITY_PROJECT_ID ??
	'3do82whm';
const dataset =
	import.meta?.env?.PUBLIC_SANITY_DATASET ??
	process.env.PUBLIC_SANITY_DATASET ??
	'production';

/**
 * Embedded Studio configuration served through the Astro app.
 *
 * The shared schema type registry is imported from `sanity/schemaTypes` so
 * document and object definitions are composed in one place.
 */
export default defineConfig({
	name: 'astro-sanity-starter',
	title: 'Astro + Sanity Starter',
	projectId,
	dataset,
	plugins: [structureTool()],
	schema: {
		// Central registry keeps schema composition predictable as new types are added.
		types: schemaTypes,
	},
});
