import { defineCliConfig } from "sanity/cli";

function requireEnv(name: string): string {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(
			`Missing required environment variable: ${name}. Set it before running Sanity CLI commands.`,
		);
	}

	return value;
}

const projectId = requireEnv("PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("PUBLIC_SANITY_DATASET");
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