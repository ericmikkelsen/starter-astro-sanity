import { defineCliConfig } from "sanity/cli";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "3do82whm";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
	api: {
		projectId,
		dataset,
	},
	typegen: {
		path: "./src/**/*.{ts,tsx,js,jsx,astro}",
		schema: "./src/sanity/extract.json",
		generates: "./src/sanity/types.ts",
	},
});