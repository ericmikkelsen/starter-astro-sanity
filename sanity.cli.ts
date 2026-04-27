import { defineCliConfig } from 'sanity/cli';

// Uses SANITY_PROJECT_ID (server-side, no PUBLIC_ prefix) because the CLI is
// a build/dev tool that runs server-side only and never exposes values to the
// client bundle. The matching PUBLIC_SANITY_PROJECT_ID in .env.example is for
// the Studio embed and Astro's client-side env access.
export default defineCliConfig({
	api: {
		projectId: process.env.SANITY_PROJECT_ID,
		dataset: process.env.SANITY_DATASET ?? 'production',
	},
});
