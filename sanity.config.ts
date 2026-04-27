import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";

function requireEnv(name: "PUBLIC_SANITY_PROJECT_ID" | "PUBLIC_SANITY_DATASET"): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

const projectId = requireEnv("PUBLIC_SANITY_PROJECT_ID");
const dataset = requireEnv("PUBLIC_SANITY_DATASET");
export default defineConfig({
	name: "astro-sanity-starter",
	title: "Astro + Sanity Starter",
	projectId,
	dataset,
	plugins: [structureTool()],
	schema: {
		types: schemaTypes,
	},
});