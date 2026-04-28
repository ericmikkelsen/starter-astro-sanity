import test from 'node:test';
import assert from 'node:assert/strict';

import { webContentType } from '../sanity/schemaTypes/documents/webContent';
import { schemaTypes } from '../sanity/schemaTypes';

/**
 * Verifies the webContent document includes shared web page fields and a portable text body.
 */
test('webContentType defines expected fields', () => {
	assert.equal(webContentType.name, 'webContent');

	const fieldNames = webContentType.fields?.map((field) => field.name) ?? [];
	assert.equal(fieldNames.includes('title'), true);
	assert.equal(fieldNames.includes('slug'), true);
	assert.equal(fieldNames.includes('description'), true);
	assert.equal(fieldNames.includes('metaImage'), true);
	assert.equal(fieldNames.includes('metaImageAlt'), true);
	assert.equal(fieldNames.includes('body'), true);
});

/**
 * Verifies the body field is a portable text array of block members.
 */
test('webContentType body is a portable text array', () => {
	const bodyField = webContentType.fields?.find(
		(field) => field.name === 'body'
	);

	assert.ok(bodyField, 'body field should exist');
	assert.equal(bodyField.type, 'array');

	const members = 'of' in bodyField ? bodyField.of : [];
	assert.ok(
		Array.isArray(members) && members.length > 0,
		'body should have array members'
	);
	assert.equal(members[0]?.type, 'block');
});

/**
 * Verifies the schema registry includes the webContent document type.
 */
test('schemaTypes registry includes webContent', () => {
	const schemaTypeNames = new Set(
		schemaTypes.map((schemaType) => schemaType.name)
	);

	assert.equal(schemaTypeNames.has('webContent'), true);
});

/**
 * Verifies Studio preview selects title and slug for the webContent document.
 */
test('webContentType preview selects title and slug', () => {
	const selectFields = webContentType.preview?.select ?? {};

	assert.ok('title' in selectFields, 'preview should select title');
	assert.ok('subtitle' in selectFields, 'preview should select subtitle');
});
