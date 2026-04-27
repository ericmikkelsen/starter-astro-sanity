import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

const extractPath = "./src/sanity/extract.json";
const typesPath = "./src/sanity/types.ts";

function ensurePlaceholderTypegenArtifacts() {
	mkdirSync("./src/sanity", { recursive: true });

	writeFileSync(
		extractPath,
		JSON.stringify(
			{
				_note: "Generated placeholder. Run npm run sanity:typegen with Sanity env vars to refresh.",
			},
			null,
			2,
		),
	);

	writeFileSync(
		typesPath,
		[
			"// Generated placeholder.",
			"// Run `npm run sanity:typegen` with Sanity env vars configured.",
			"export type SanityTypegenPlaceholder = never;",
			"",
		].join("\n"),
	);
}

if (!projectId || !dataset) {
	ensurePlaceholderTypegenArtifacts();
	console.log("Skipping sanity:typegen (set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET to enable).");
	process.exit(0);
}

const extractResult = spawnSync(
	"npx",
	[
		"sanity@latest",
		"schema",
		"extract",
		"--enforce-required-fields",
		"--path=./src/sanity/extract.json",
	],
	{ stdio: "inherit" },
);

if (extractResult.status !== 0) {
	process.exit(extractResult.status ?? 1);
}

const typegenResult = spawnSync("npx", ["sanity@latest", "typegen", "generate"], {
	stdio: "inherit",
});

process.exit(typegenResult.status ?? 1);