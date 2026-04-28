import { defineArrayMember, defineField, defineType } from 'sanity';

import { WEB_PAGE_FIELDS } from '../webPageFields';

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
 * Portable-text-first web content document type.
 *
 * Use this type for long-form, narrative-style content where a rich body is
 * the primary authoring surface (articles, guides, editorial pages). Unlike
 * `page`, which is structured around reusable block primitives, `webContent`
 * puts a portable text body front and centre with optional supporting metadata.
 */
export const webContentType = defineType({
	name: 'webContent',
	title: 'Web Content',
	type: 'document',
	fields: [
		...Object.values(WEB_PAGE_FIELDS),
		defineField({
			name: 'body',
			title: 'Body',
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
			validation: (rule) => rule.required().min(1),
		}),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'slug.current',
		},
	},
});
