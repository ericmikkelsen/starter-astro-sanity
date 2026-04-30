import react from '@astrojs/react';
import node from '@astrojs/node';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

/**
 * Returns a required environment value from Vite-loaded `.env` or process env.
 *
 * @param {string} key - Required env key.
 * @returns {string} The resolved env value.
 * @throws {Error} When the key is not defined in local runtime configuration.
 */
const requiredEnv = (key) => {
	const value = env[key] || process.env[key];
	if (!value) {
		throw new Error(
			`Missing required environment variable ${key}. Set it in .env before running Astro.`
		);
	}

	return value;
};

const projectId = requiredEnv('PUBLIC_SANITY_PROJECT_ID');
const dataset = requiredEnv('PUBLIC_SANITY_DATASET');
const apiVersion = env.PUBLIC_SANITY_API_VERSION || '2026-01-01';
const previewDataEnabled = env.PUBLIC_SANITY_ENABLE_PREVIEW === 'true';
const visualEditingEnabled =
	env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true' || previewDataEnabled;
const studioBasePath =
	process.env.NODE_ENV === 'production' ? undefined : '/studio';

/**
 * Astro runtime configuration for the starter template.
 *
 * Studio is intentionally disabled in production builds so deployed sites expose
 * only content pages while local development keeps `/studio` available.
 */
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone'
	}),
	integrations: [
		sanity({
			projectId,
			dataset,
			apiVersion,
			useCdn: false,
			studioBasePath,
			stega: visualEditingEnabled
				? {
						studioUrl: studioBasePath ?? '/studio'
					}
				: false
		}),
		react()
	],
	vite: {
		// Mirror required Studio values into the client bundle used by embedded Sanity Studio.
		define: {
			__SANITY_STUDIO_PROJECT_ID__: JSON.stringify(projectId),
			__SANITY_STUDIO_DATASET__: JSON.stringify(dataset)
		},
		// Keep Sanity, React compiler runtime, and visual-editing CJS modules pre-bundled for dev server.
		optimizeDeps: {
			include: [
				'sanity',
				'react/compiler-runtime',
				'@sanity/visual-editing/react',
				'@sanity/preview-url-secret/constants',
				'lodash/isObject.js',
				'lodash/groupBy.js',
				'lodash/keyBy.js',
				'lodash/partition.js',
				'lodash/sortedIndex.js'
			]
		},
		plugins: [tailwindcss()]
	}
});
