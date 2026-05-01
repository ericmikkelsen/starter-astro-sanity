import type { TypedObject } from 'astro-portabletext/types';

import {
	projectObjectFields,
	SANITY_IMAGE_ASSET_REF_FIELDS
} from './groqProjections';
import type { WebDocumentCore } from './shared';

/**
 * Canonical query for article documents synced into Astro's content layer.
 */
export const SANITY_ARTICLE_COLLECTION_QUERY = `*[_type == "article" && defined(slug.current)]{
  _id,
  title,
  "slug": slug.current,
  description,
	${projectObjectFields('metaImage', SANITY_IMAGE_ASSET_REF_FIELDS)},
  metaImageAlt,
  richText
} | order(title asc)`;

export type SanityArticleQueryResult = {
	_id: string;
	title?: string;
	slug?: string;
	description?: string;
	metaImage?: {
		asset?: {
			_ref?: string;
		};
	};
	metaImageAlt?: unknown;
	richText?: TypedObject[];
};

export type ArticleCollectionEntryData = WebDocumentCore & {
	body: TypedObject[];
	path: string;
};

export type ArticleCollectionEntry = {
	id: string;
	data: ArticleCollectionEntryData;
};

/**
 * Maps a Sanity article document into the normalized Astro content-layer shape.
 */
export function mapSanityArticleToCollectionEntry(
	entry: SanityArticleQueryResult
): ArticleCollectionEntry | null {
	if (!entry._id || !entry.slug || !entry.title) {
		return null;
	}

	const metaImageAlt = normalizeTextField(entry.metaImageAlt);

	return {
		id: entry._id,
		data: {
			title: entry.title,
			slug: entry.slug,
			description: entry.description,
			metaImage: entry.metaImage?.asset?._ref
				? {
						assetRef: entry.metaImage.asset._ref,
						alt: metaImageAlt
					}
				: undefined,
			metaImageAlt,
			body: entry.richText ?? [],
			path: `/articles/${entry.slug}/`
		}
	};
}

function normalizeTextField(value: unknown): string | undefined {
	if (typeof value === 'string') {
		return value;
	}

	if (value && typeof value === 'object') {
		return JSON.stringify(value);
	}

	if (value != null) {
		return String(value);
	}

	return undefined;
}
