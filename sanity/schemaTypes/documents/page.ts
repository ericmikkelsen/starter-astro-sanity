import { defineType } from 'sanity';

import { WEB_PAGE_FIELDS } from '../webPageFields';

export const pageType = defineType({
	name: 'page',
	title: 'Page',
	type: 'document',
	fields: Object.values(WEB_PAGE_FIELDS),
	preview: {
		select: {
			title: 'title',
			subtitle: 'slug.current',
		},
	},
});
