import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { mapSanityPageToAstroPage } from '../src/lib/content/pages';

/**
 * Verifies the mapper preserves the fields the Astro routes depend on.
 */
test('mapSanityPageToAstroPage maps valid page records', () => {
	const mapped = mapSanityPageToAstroPage({
		_id: 'page-1',
		title: 'About',
		slug: 'about',
		description: 'About page',
		metaImage: {
			asset: {
				_ref: 'image-ref',
			},
		},
		metaImageAlt: 'Alt text',
	});

	assert.ok(mapped);
	assert.equal(mapped?.id, 'page-1');
	assert.equal(mapped?.slug, 'about');
	assert.equal(mapped?.path, '/about/');
	assert.equal(mapped?.metaImage?.assetRef, 'image-ref');
});

/**
 * Verifies incomplete Sanity records are rejected before they can reach route generation.
 */
test('mapSanityPageToAstroPage skips invalid entries', () => {
	const mapped = mapSanityPageToAstroPage({
		_id: 'page-2',
		title: 'Missing slug',
	});

	assert.equal(mapped, null);
});

/**
 * Verifies the typegen wrapper exits early on unconfigured clones without inventing fake outputs.
 */
test('sanity:typegen skip does not create placeholder artifacts', () => {
	const tempDir = mkdtempSync(join(tmpdir(), 'sanity-typegen-skip-'));
	const scriptPath = resolve(process.cwd(), 'scripts/run-sanity-typegen.mjs');

	try {
		// Running in a throwaway directory makes it obvious whether the script writes files on its own.
		const result = spawnSync(process.execPath, [scriptPath], {
			cwd: tempDir,
			env: {
				PATH: process.env.PATH,
			},
			encoding: 'utf8',
		});

		assert.equal(result.status, 0);
		assert.equal(
			existsSync(join(tempDir, 'src/sanity/extract.json')),
			false
		);
		assert.equal(existsSync(join(tempDir, 'src/sanity/types.ts')), false);
	} finally {
		rmSync(tempDir, { recursive: true, force: true });
	}
});
