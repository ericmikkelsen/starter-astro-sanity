type LinkPage = {
	id: string;
	title: string;
	path: string;
};

/**
 * Converts a slug into the canonical trailing-slash route used by this starter.
 */
export function toPagePath(slug: string): string {
	return `/${slug}/`;
}

/**
 * Creates a DOM anchor element for homepage page-link rendering.
 */
export function createHomepageLinkAnchor(doc: Document, page: LinkPage): HTMLAnchorElement {
	const anchor = doc.createElement("a");
	anchor.href = page.path;
	anchor.textContent = page.title;
	anchor.setAttribute("data-page-id", page.id);
	return anchor;
}