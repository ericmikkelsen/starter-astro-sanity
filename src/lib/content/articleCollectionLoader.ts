import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

import {
	mapSanityArticleToCollectionEntry,
	SANITY_ARTICLE_COLLECTION_QUERY,
	type SanityArticleQueryResult
} from './articleCollection';
import { loadQuery } from './preview';

const articleCollectionSchema = z.object({
	title: z.string(),
	slug: z.string(),
	description: z.string().optional(),
	metaImage: z
		.object({
			assetRef: z.string(),
			alt: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional()
		})
		.optional(),
	metaImageAlt: z.string().optional(),
	body: z.array(z.record(z.unknown())),
	path: z.string()
});

export function createArticleCollectionLoader(): Loader {
	return {
		name: 'sanity-article-collection-loader',
		schema: articleCollectionSchema,
		load: async ({ store, parseData, generateDigest, logger }) => {
			logger.info(
				'Loading Sanity article entries into Astro content layer.'
			);

			let results: SanityArticleQueryResult[];
			try {
				results = await loadQuery<SanityArticleQueryResult[]>(
					SANITY_ARTICLE_COLLECTION_QUERY
				);
			} catch (err) {
				logger.warn(
					`Failed to load Sanity article entries - keeping previous store. Error: ${err instanceof Error ? err.message : String(err)}`
				);
				return;
			}

			store.clear();

			for (const result of results) {
				const mapped = mapSanityArticleToCollectionEntry(result);
				if (!mapped) continue;

				const data = await parseData({
					id: mapped.id,
					data: mapped.data
				});
				store.set({
					id: mapped.id,
					data,
					digest: generateDigest(data)
				});
			}
		}
	} satisfies Loader;
}
