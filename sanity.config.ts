import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
	name: 'default',
	title: 'Astro + Sanity Starter',
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID ?? '',
	dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
	plugins: [structureTool()],
	schema: {
		types: schemaTypes,
	},
});
