import test from 'node:test';
import assert from 'node:assert/strict';

import {
	billboardType,
	listScrollerType,
	peopleRefsType,
	richTextType,
} from '../sanity/schemaTypes/objects/arrayBlockPrimitives';
import { schemaTypes } from '../sanity/schemaTypes';

test('billboardType defines expected fields', () => {
	assert.equal(billboardType.name, 'billboard');
	assert.deepEqual(
		billboardType.fields?.map((field) => field.name),
		['heading', 'body', 'ctaLabel', 'ctaHref', 'image']
	);
});

test('listScrollerType defines expected fields', () => {
	assert.equal(listScrollerType.name, 'listScroller');
	assert.deepEqual(
		listScrollerType.fields?.map((field) => field.name),
		['title', 'items']
	);
});

test('peopleRefsType defines people reference array', () => {
	assert.equal(peopleRefsType.name, 'peopleRefs');
	assert.deepEqual(
		peopleRefsType.fields?.map((field) => field.name),
		['people']
	);

	const peopleField = peopleRefsType.fields?.find(
		(field) => field.name === 'people'
	);
	const referenceMember =
		peopleField?.type === 'array' ? peopleField.of?.[0] : undefined;

	assert.equal(referenceMember?.type, 'reference');
	assert.equal(referenceMember?.to?.[0]?.type, 'person');
});

test('richTextType defines portable content field', () => {
	assert.equal(richTextType.name, 'richText');
	assert.deepEqual(
		richTextType.fields?.map((field) => field.name),
		['content']
	);
});

test('schemaTypes registry includes array block primitives', () => {
	const schemaTypeNames = new Set(
		schemaTypes.map((schemaType) => schemaType.name)
	);

	assert.equal(schemaTypeNames.has('billboard'), true);
	assert.equal(schemaTypeNames.has('listScroller'), true);
	assert.equal(schemaTypeNames.has('peopleRefs'), true);
	assert.equal(schemaTypeNames.has('richText'), true);
});
