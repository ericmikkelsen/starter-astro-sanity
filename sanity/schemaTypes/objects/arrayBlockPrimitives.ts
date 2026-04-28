import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Hero-style block for array-driven pages.
 */
export const billboardType = defineType({
	name: 'billboard',
	title: 'Billboard',
	type: 'object',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'string',
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: { hotspot: true },
		}),
	],
});

/**
 * Horizontal list block intended for simple scroller-style sections.
 */
export const listScrollerType = defineType({
	name: 'listScroller',
	title: 'List Scroller',
	type: 'object',
	fields: [
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'string',
		}),
		defineField({
			name: 'items',
			title: 'Items',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
			validation: (rule) => rule.required().min(1),
		}),
	],
});

/**
 * Reference list for people-style entities used by profile/team sections.
 */
export const peopleRefsType = defineType({
	name: 'peopleRefs',
	title: 'People References',
	type: 'object',
	fields: [
		defineField({
			name: 'people',
			title: 'People',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'reference',
					to: [{ type: 'person' }],
				}),
			],
			validation: (rule) => rule.required().min(1),
		}),
	],
});

/**
 * Portable text wrapper for richer narrative blocks inside array content.
 */
export const richTextType = defineType({
	name: 'richText',
	title: 'Rich Text',
	type: 'object',
	fields: [
		defineField({
			name: 'richText',
			title: 'Body',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'block',
				}),
			],
			validation: (rule) => rule.required().min(1),
		}),
	],
});
