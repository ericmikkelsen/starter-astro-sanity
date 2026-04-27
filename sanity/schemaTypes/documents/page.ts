import { defineField, defineType } from "sanity";

import { WEB_PAGE_FIELD_NAMES } from "../../../src/lib/content/shared";

export const pageType = defineType({
	name: "page",
	title: "Page",
	type: "document",
	fields: [
		defineField({
			name: WEB_PAGE_FIELD_NAMES.title,
			title: "Title",
			type: "string",
			validation: (rule) => rule.required().min(2),
		}),
		defineField({
			name: WEB_PAGE_FIELD_NAMES.slug,
			title: "Slug",
			type: "slug",
			options: {
				source: WEB_PAGE_FIELD_NAMES.title,
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: WEB_PAGE_FIELD_NAMES.description,
			title: "Description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: WEB_PAGE_FIELD_NAMES.metaImage,
			title: "Meta Image",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: WEB_PAGE_FIELD_NAMES.metaImageAlt,
			title: "Meta Image Alt",
			type: "string",
			description: "Alternative text used when meta image is present.",
		}),
	],
	preview: {
		select: {
			title: WEB_PAGE_FIELD_NAMES.title,
			subtitle: `${WEB_PAGE_FIELD_NAMES.slug}.current`,
		},
	},
});