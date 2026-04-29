import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/**
 * Converts a camelCase or lowercase string to PascalCase.
 * Used for code identifiers such as type names and function names.
 *
 * @param name The identifier to convert (e.g. 'campaign').
 * @returns The PascalCase form (e.g. 'Campaign').
 */
export function toPascalCase(name: string): string {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Converts a camelCase document type identifier into a human-readable
 * Studio-facing title shown in the Sanity Studio UI.
 *
 * @param name A camelCase or lowercase document name (e.g. 'landingPage').
 * @returns A spaced, title-cased label (e.g. 'Landing Page').
 */
export function toStudioTitle(name: string): string {
	const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Sanity document type names must start with a lowercase letter and contain
// only alphanumeric characters. This prevents path traversal in generated
// file names, which are derived directly from the user-supplied name.
export const NAME_RE = /^[a-z][a-zA-Z0-9]*$/;

// URL prefixes are restricted to lowercase letters, digits, and hyphens to
// produce clean, slug-safe route paths (e.g. 'my-articles').
export const URL_PREFIX_RE = /^[a-z0-9-]+$/;

/**
 * Validates scaffold CLI inputs before any files are generated.
 * Rejects values that would produce invalid file names or unsafe URL paths.
 *
 * @param name       Sanity document type name (e.g. 'article').
 * @param urlPrefix  URL segment prefix for routes (e.g. 'articles').
 * @throws Error when either value is invalid.
 */
export function validateScaffoldInputs(name: string, urlPrefix: string): void {
	if (!NAME_RE.test(name)) {
		throw new Error(
			'Invalid document type name. Use /^[a-z][a-zA-Z0-9]*$/ (example: article).'
		);
	}

	if (!URL_PREFIX_RE.test(urlPrefix)) {
		throw new Error(
			'Invalid URL prefix. Use /^[a-z0-9-]+$/ (example: articles).'
		);
	}
}

/**
 * Prints the generated file list and copy-pasteable registration instructions
 * that a developer needs to wire the scaffold into existing config files.
 *
 * @param name      Sanity document type name (e.g. 'article').
 * @param urlPrefix URL path prefix for generated routes (e.g. 'articles').
 */
export function printScaffoldGuidance(name: string, urlPrefix: string): void {
	const pascal = toPascalCase(name);
	const pink = '\x1b[95m';
	const reset = '\x1b[0m';
	console.log(`
✔  Generated 4 files for "${name}".
→  Schema:     sanity/schemaTypes/documents/${name}.ts
→  Collection: src/lib/content/${name}Collection.ts
→  Loader:     src/lib/content/${name}CollectionLoader.ts
→  Route:      src/pages/${urlPrefix}/[slug].astro

Next — copy and paste these into your config files:

  sanity/schemaTypes/index.ts
${pink}  import { ${name}Type } from './documents/${name}';
  // add ${name}Type to the types array${reset}

  src/content.config.ts
${pink}  import { create${pascal}CollectionLoader } from './lib/content/${name}CollectionLoader';
  const ${name} = defineCollection({ loader: create${pascal}CollectionLoader() });
  // add ${name} to the collections export${reset}
  `);
}

/**
 * Opens a readline session for sequential CLI prompts.
 * Caller is responsible for calling `.close()` when all prompts are done.
 *
 * @returns An object with `ask(question)` and `close()`.
 */
export function createPromptSession() {
	const rl = createInterface({ input, output });
	return {
		ask(question: string): Promise<string> {
			return rl.question(question).then((a) => a.trim());
		},
		close() {
			rl.close();
		}
	};
}

/**
 * Writes content to a file, creating parent directories as needed.
 *
 * @param filePath Absolute or cwd-relative path for the output file.
 * @param content  File content to write (UTF-8).
 */
export function writeGeneratedFile(filePath: string, content: string): void {
	mkdirSync(dirname(filePath), { recursive: true });
	writeFileSync(filePath, content, 'utf-8');
}
