import { defineCollection } from 'astro:content';

import { createSanityPageCollectionLoader } from './lib/content/pageCollectionLoader';

/**
 * Build-time content collections backed by Sanity remote data.
 *
 * This file currently registers only the existing page model so the
 * content-layer foundation can be validated before additional document types
 * are introduced.
 */
const pages = defineCollection({
	loader: createSanityPageCollectionLoader(),
});

export const collections = { pages };
