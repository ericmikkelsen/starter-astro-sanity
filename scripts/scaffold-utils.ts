import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/**
 * Converts a camelCase or lowercase string to PascalCase.
 *
 * @param name The identifier to convert (e.g. 'campaign').
 * @returns The PascalCase form (e.g. 'Campaign').
 */
export function toPascalCase(name: string): string {
	return name.charAt(0).toUpperCase() + name.slice(1);
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
