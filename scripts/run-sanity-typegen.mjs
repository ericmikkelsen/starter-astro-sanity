import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;

// Fresh clones should still install, test, and build before Sanity credentials are configured.
if (!projectId || !dataset) {
	console.log(
		'Skipping sanity:typegen (set PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET to enable).'
	);
	process.exit(0);
}

// The generated outputs live under src so the Astro app and tests can import them consistently.
mkdirSync('./src/sanity', { recursive: true });

/**
 * Runs the repo-installed Sanity CLI and exits this script with the same status code.
 *
 * @param args The Sanity CLI arguments to pass through to `npx sanity`.
 * @returns The exit status reported by the child process.
 */
function runSanityCommand(args) {
	const result = spawnSync('npx', ['sanity', ...args], {
		stdio: 'inherit',
	});

	return result.status ?? 1;
}

const extractResult = spawnSync(
	'npx',
	[
		'sanity',
		'schema',
		'extract',
		'--enforce-required-fields',
		'--path=./src/sanity/extract.json',
	],
	{ stdio: 'inherit' }
);

if (extractResult.status !== 0) {
	process.exit(extractResult.status ?? 1);
}

// Extraction runs first so TypeGen reads the current schema snapshot from disk.
const typegenResult = runSanityCommand(['typegen', 'generate']);

process.exit(typegenResult);
