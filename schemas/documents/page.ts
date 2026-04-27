import { defineField, defineType } from 'sanity';

export const page = defineType({
	name: 'page',
	title: 'Page',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title' },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'metaImage',
			title: 'Meta Image',
			type: 'image',
		}),
		defineField({
			name: 'metaImageAlt',
			title: 'Meta Image Alt',
			type: 'string',
		}),
	],
});
