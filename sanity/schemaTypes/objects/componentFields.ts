import { defineArrayMember, defineField } from 'sanity';

const linkAnnotation = {
	name: 'link',
	title: 'Link',
	type: 'object',
	fields: [
		defineField({
			name: 'href',
			title: 'URL',
			type: 'url',
			validation: (rule) => rule.required(),
		}),
	],
};

/**
 * Reusable heading string field.
 */
export const HEADING_FIELD_ARGS = {
	name: 'heading',
	title: 'Heading',
	type: 'string',
	validation: (rule: any) => rule.required(),
};

/**
 * Reusable body string field.
 */
export const BODY_FIELD_ARGS = {
	name: 'body',
	title: 'Body',
	type: 'string',
};

/**
 * Reusable link object field with required display text and URL.
 */
export const LINK_FIELD_ARGS = {
	name: 'link',
	title: 'Link',
	type: 'object',
	fields: [
		defineField({
			name: 'text',
			title: 'Text',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'url',
			title: 'URL',
			type: 'url',
			validation: (rule) => rule.required(),
		}),
	],
};

/**
 * Reusable image object with both reference-style and URL-style fields.
 */
export const IMAGE_FIELD_ARGS = {
	name: 'image',
	title: 'Image',
	type: 'object',
	fields: [
		defineField({
			name: 'imageRef',
			title: 'Image Ref',
			type: 'string',
		}),
		defineField({
			name: 'src',
			title: 'Source URL',
			type: 'url',
		}),
		defineField({
			name: 'alt',
			title: 'Alt Text',
			type: 'string',
		}),
		defineField({
			name: 'width',
			title: 'Width',
			type: 'number',
			validation: (rule) => rule.positive().integer(),
		}),
		defineField({
			name: 'height',
			title: 'Height',
			type: 'number',
			validation: (rule) => rule.positive().integer(),
		}),
	],
};

/**
 * Reusable rich text field that excludes `h1` but keeps standard formatting controls.
 */
export const RICH_TEXT_FIELD_ARGS = {
	name: 'richText',
	title: 'Rich Text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'H2', value: 'h2' },
				{ title: 'H3', value: 'h3' },
				{ title: 'H4', value: 'h4' },
				{ title: 'Quote', value: 'blockquote' },
			],
			marks: {
				annotations: [linkAnnotation],
			},
		}),
	],
	validation: (rule: any) => rule.required().min(1),
};

/**
 * Reusable minimal rich text field that allows only links.
 */
export const RICH_TEXT_BASIC_FIELD_ARGS = {
	name: 'richTextBasic',
	title: 'Rich Text Basic',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [{ title: 'Normal', value: 'normal' }],
			lists: [],
			marks: {
				decorators: [],
				annotations: [linkAnnotation],
			},
		}),
	],
	validation: (rule: any) => rule.required().min(1),
};
