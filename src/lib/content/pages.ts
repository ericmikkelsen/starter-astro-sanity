import type { WebDocumentCore } from "./shared";
import { toPagePath } from "./pageHelpers";
import { loadQuery } from "./preview";

const PAGE_QUERY = `*[_type == "page" && defined(slug.current)]{
  _id,
  title,
  "slug": slug.current,
  description,
  metaImage,
  metaImageAlt
} | order(title asc)`;

type SanityPageQueryResult = {
	_id: string;
	title?: string;
	slug?: string;
	description?: string;
	metaImage?: {
		asset?: {
			_ref?: string;
		};
	};
	metaImageAlt?: string;
};

export type AstroPage = WebDocumentCore & {
	id: string;
	path: string;
};

export function mapSanityPageToAstroPage(entry: SanityPageQueryResult): AstroPage | null {
	if (!entry.slug || !entry.title) {
		return null;
	}

	return {
		id: entry._id,
		title: entry.title,
		slug: entry.slug,
		description: entry.description,
		metaImage: entry.metaImage?.asset?._ref
			? {
					assetRef: entry.metaImage.asset._ref,
					alt: entry.metaImageAlt,
			  }
			: undefined,
		metaImageAlt: entry.metaImageAlt,
		path: toPagePath(entry.slug),
	};
}

export async function getAstroPages(): Promise<AstroPage[]> {
	try {
		const results = await loadQuery<SanityPageQueryResult[]>(PAGE_QUERY);
		return results.map(mapSanityPageToAstroPage).filter((entry): entry is AstroPage => Boolean(entry));
	} catch {
		return [];
	}
}

export async function getAstroPageBySlug(slug: string): Promise<AstroPage | undefined> {
	const pages = await getAstroPages();
	return pages.find((page) => page.slug === slug);
}