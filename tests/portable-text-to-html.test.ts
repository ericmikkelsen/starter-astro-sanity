import test from 'node:test';
import assert from 'node:assert/strict';

import { portableTextToHtml } from '../src/lib/content/portableTextToHtml';

test('portableTextToHtml renders normal paragraph as <p>', () => {
	const html = portableTextToHtml([
		{
			_type: 'block',
			style: 'normal',
			children: [{ _type: 'span', text: 'Hello world', marks: [] }],
			markDefs: [],
		},
	]);
	assert.ok(html.includes('<p>Hello world</p>'));
});

test('portableTextToHtml renders h2 through h6 styles', () => {
	for (const style of ['h2', 'h3', 'h4', 'h5', 'h6'] as const) {
		const html = portableTextToHtml([
			{
				_type: 'block',
				style,
				children: [{ _type: 'span', text: 'Title', marks: [] }],
				markDefs: [],
			},
		]);
		assert.ok(
			html.includes(`<${style}>Title</${style}>`),
			`expected ${style} tag`
		);
	}
});

test('portableTextToHtml renders blockquote style', () => {
	const html = portableTextToHtml([
		{
			_type: 'block',
			style: 'blockquote',
			children: [{ _type: 'span', text: 'A quote', marks: [] }],
			markDefs: [],
		},
	]);
	assert.ok(html.includes('<blockquote>A quote</blockquote>'));
});

test('portableTextToHtml wraps strong and em marks', () => {
	const html = portableTextToHtml([
		{
			_type: 'block',
			style: 'normal',
			children: [
				{ _type: 'span', text: 'Bold', marks: ['strong'] },
				{ _type: 'span', text: ' italic', marks: ['em'] },
			],
			markDefs: [],
		},
	]);
	assert.ok(html.includes('<strong>Bold</strong>'));
	assert.ok(html.includes('<em> italic</em>'));
});

test('portableTextToHtml renders link annotations', () => {
	const html = portableTextToHtml([
		{
			_type: 'block',
			style: 'normal',
			children: [
				{ _type: 'span', text: 'Click here', marks: ['link-1'] },
			],
			markDefs: [
				{
					_type: 'portableTextLink',
					_key: 'link-1',
					href: 'https://example.com',
				},
			],
		},
	]);
	assert.ok(html.includes('<a href="https://example.com">Click here</a>'));
});

test('portableTextToHtml escapes HTML entities to prevent XSS', () => {
	const html = portableTextToHtml([
		{
			_type: 'block',
			style: 'normal',
			children: [
				{
					_type: 'span',
					text: '<script>alert("xss")</script>',
					marks: [],
				},
			],
			markDefs: [],
		},
	]);
	assert.ok(!html.includes('<script>'), 'raw <script> tag should not appear');
	assert.ok(html.includes('&lt;script&gt;'));
});

test('portableTextToHtml skips unknown block types', () => {
	const html = portableTextToHtml([
		{ _type: 'image', asset: { _ref: 'abc' } },
	]);
	assert.equal(html.trim(), '');
});

test('portableTextToHtml returns empty string for empty input', () => {
	assert.equal(portableTextToHtml([]), '');
});
