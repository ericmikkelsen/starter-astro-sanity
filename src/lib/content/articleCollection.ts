import type { WebDocumentCore } from './shared';
import type { TypedObject } from 'astro-portabletext/types';
import {
	projectObjectFields,
	SANITY_IMAGE_ASSET_REF_FIELDS
} from './groqProjections';

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
 * Maps a Sanity document into the generated Astro collection entry contract.
 * Invalid records are dropped by returning null when required values are missing.
 */
export function mapSanityArticleToCollectionEntry(
	entry: SanityArticleQueryResult
): ArticleCollectionEntry | null {
	if (!entry._id || !entry.slug || !entry.title) {
		return null;
	}

	// Ensure metaImageAlt is always a string (handle object/array/null)
	let metaImageAlt: string | undefined = undefined;
	if (typeof entry.metaImageAlt === 'string') {
		metaImageAlt = entry.metaImageAlt;
	} else if (entry.metaImageAlt && typeof entry.metaImageAlt === 'object') {
		metaImageAlt = JSON.stringify(entry.metaImageAlt);
	} else if (entry.metaImageAlt != null) {
		metaImageAlt = String(entry.metaImageAlt);
	}

	return {
		id: entry._id,
		data: {
			title: entry.title,
			slug: entry.slug,
			description: entry.description,
			metaImage:
				entry.metaImage &&
				entry.metaImage.asset &&
				entry.metaImage.asset._ref
					? {
							assetRef: entry.metaImage.asset._ref,
							alt: metaImageAlt
						}
					: undefined,
			metaImageAlt: metaImageAlt,
			body: entry.richText ?? [],
			path: '/' + 'articles/' + entry.slug + '/'
		}
	};
}
