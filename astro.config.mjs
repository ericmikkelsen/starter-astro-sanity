import react from '@astrojs/react';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '3do82whm';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2026-01-01';
const studioBasePath =
	process.env.NODE_ENV === 'production' ? undefined : '/studio';

export default defineConfig({
	integrations: [
		sanity({
			projectId,
			dataset,
			apiVersion,
			useCdn: false,
			studioBasePath,
		}),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
