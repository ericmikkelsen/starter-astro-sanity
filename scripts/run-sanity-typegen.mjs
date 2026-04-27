import { spawnSync } from "node:child_process";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
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