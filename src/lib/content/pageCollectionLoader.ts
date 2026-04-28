import { createClient } from '@sanity/client';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

import {
	mapSanityPageToCollectionEntry,
	SANITY_PAGE_COLLECTION_QUERY,
	type SanityPageQueryResult,
} from './pageCollection';

// Defaults keep the loader usable on fresh clones before a local Sanity project is configured.
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '3do82whm';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.PUBLIC_SANITY_API_VERSION || '2026-01-01';

/**
 * Shared schema for published page entries persisted in Astro's content store.
 */
const pageCollectionSchema = z.object({
	title: z.string(),
	slug: z.string(),
	description: z.string().optional(),
	metaImage: z
		.object({
			assetRef: z.string(),
			alt: z.string().optional(),
			width: z.number().optional(),
			height: z.number().optional(),
		})
		.optional(),
	metaImageAlt: z.string().optional(),
	path: z.string(),
});

/**
 * Loads published Sanity pages into Astro's build-time content layer.
 *
 * Preview behavior is intentionally deferred so this loader can focus on the
 * build-time published path in isolation.
 *
 * @returns An Astro build-time loader for the `pages` collection.
 */
export function createSanityPageCollectionLoader() {
	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		// Published content can use CDN-backed reads during static generation.
		useCdn: true,
	});

	return {
		name: 'sanity-page-collection-loader',
		schema: pageCollectionSchema,
		load: async ({ store, parseData, generateDigest, logger }) => {
			logger.info(
				'Loading published Sanity pages into Astro content layer.'
			);
			store.clear();

			const results = await client.fetch<SanityPageQueryResult[]>(
				SANITY_PAGE_COLLECTION_QUERY
			);

			for (const result of results) {
				const mapped = mapSanityPageToCollectionEntry(result);

				if (!mapped) {
					// Invalid records are dropped here so the collection API only exposes typed entries.
					continue;
				}

				const data = await parseData({
					id: mapped.id,
					data: mapped.data,
				});

				store.set({
					id: mapped.id,
					data,
					// Digests let Astro skip rewrites when entry data has not changed between syncs.
					digest: generateDigest(data),
				});
			}
		},
	} satisfies Loader;
}
