import test from 'node:test';
import assert from 'node:assert/strict';

import { arrayPageType } from '../sanity/schemaTypes/documents/arrayPage';
import { schemaTypes } from '../sanity/schemaTypes';

/**
 * Verifies the new document reuses shared page fields and adds the builder array.
 */
test('arrayPageType defines expected fields', () => {
	assert.equal(arrayPageType.name, 'arrayPage');

	const fieldNames = arrayPageType.fields?.map((field) => field.name) ?? [];
	assert.equal(fieldNames.includes('title'), true);
	assert.equal(fieldNames.includes('slug'), true);
	assert.equal(fieldNames.includes('description'), true);
	assert.equal(fieldNames.includes('metaImage'), true);
	assert.equal(fieldNames.includes('metaImageAlt'), true);
	assert.equal(fieldNames.includes('pageBuilder'), true);
});

/**
 * Verifies author-selectable block primitives stay constrained to the chapter-3 set.
 */
test('arrayPageType pageBuilder allows expected primitive blocks', () => {
	const pageBuilderField = arrayPageType.fields?.find(
		(field) => field.name === 'pageBuilder'
	);
	const memberTypes =
		pageBuilderField && 'of' in pageBuilderField
			? pageBuilderField.of?.map((member) => member.type)
			: [];

	assert.deepEqual(memberTypes, [
		'billboard',
		'listScroller',
		'peopleRefs',
		'richText',
	]);
});

/**
 * Verifies Studio registration includes the new array page document.
 */
test('schemaTypes registry includes arrayPage document type', () => {
	const schemaTypeNames = new Set(
		schemaTypes.map((schemaType) => schemaType.name)
	);

	assert.equal(schemaTypeNames.has('arrayPage'), true);
});
