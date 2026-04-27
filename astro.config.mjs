import react from "@astrojs/react";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || "2026-01-01";

if (!projectId || !dataset) {
	throw new Error(
		"Missing required Sanity environment variables: PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set.",
	);
}

// Static builds do not need the embedded Studio route, so we only mount it during local development.
const studioBasePath = process.env.NODE_ENV === "production" ? undefined : "/studio";

/**
 * Astro runtime configuration for the starter's base toolchain.
 * It wires framework integrations together before content-specific behavior is layered on.
 */
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