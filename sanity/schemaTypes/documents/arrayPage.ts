import { defineArrayMember, defineField, defineType } from 'sanity';

import { WEB_PAGE_FIELDS } from '../webPageFields';

/**
 * Array-based page-builder document using reusable primitive blocks.
 *
 * This change intentionally scopes the document to schema-level wiring only;
 * rendering and route integration are handled in a follow-up step.
 */
export const arrayPageType = defineType({
	name: 'arrayPage',
	title: 'Array Page',
	type: 'document',
	fields: [
		...Object.values(WEB_PAGE_FIELDS),
		defineField({
			name: 'pageBuilder',
			title: 'Page Builder',
			type: 'array',
			// Keep this list explicit so editor choices map one-to-one with
			// renderer switch cases as new primitives are introduced.
			of: [
				defineArrayMember({ type: 'billboard' }),
				defineArrayMember({ type: 'listScroller' }),
				defineArrayMember({ type: 'peopleRefs' }),
				defineArrayMember({ type: 'richText' }),
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
