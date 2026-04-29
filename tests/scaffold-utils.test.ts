import test from 'node:test';
import assert from 'node:assert/strict';

import { toPascalCase, writeGeneratedFile } from '../scripts/scaffold-utils';
import { mkdirSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// --- toPascalCase ---

test('toPascalCase capitalizes the first letter', () => {
	assert.equal(toPascalCase('campaign'), 'Campaign');
});

test('toPascalCase preserves subsequent characters unchanged', () => {
	assert.equal(toPascalCase('landingPage'), 'LandingPage');
	assert.equal(toPascalCase('a'), 'A');
	assert.equal(toPascalCase('myContentType'), 'MyContentType');
});

// --- writeGeneratedFile ---

test('writeGeneratedFile writes content to disk', () => {
	const dir = join(tmpdir(), `scaffold-utils-test-${Date.now()}`);
	const filePath = join(dir, 'output.ts');

	try {
		writeGeneratedFile(filePath, 'export const x = 1;\n');
		assert.equal(readFileSync(filePath, 'utf-8'), 'export const x = 1;\n');
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('writeGeneratedFile creates missing parent directories', () => {
	const rootDir = join(tmpdir(), `scaffold-utils-test-${Date.now()}`);
	const dir = join(rootDir, 'nested', 'deep');
	const filePath = join(dir, 'output.ts');

	try {
		writeGeneratedFile(filePath, 'const y = 2;\n');
		assert.ok(existsSync(filePath), 'file should exist after write');
	} finally {
		rmSync(rootDir, { recursive: true, force: true });
	}
});

test('writeGeneratedFile overwrites existing files', () => {
	const dir = join(tmpdir(), `scaffold-utils-test-${Date.now()}`);
	const filePath = join(dir, 'output.ts');

	try {
		mkdirSync(dir, { recursive: true });
		writeGeneratedFile(filePath, 'first\n');
		writeGeneratedFile(filePath, 'second\n');
		assert.equal(readFileSync(filePath, 'utf-8'), 'second\n');
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
