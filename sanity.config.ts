import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "3do82whm";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";

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