type LinkPage = {
	id: string;
	title: string;
	path: string;
};

export function toPagePath(slug: string): string {
	return `/${slug}/`;
}

export function createHomepageLinkAnchor(doc: Document, page: LinkPage): HTMLAnchorElement {
	const anchor = doc.createElement("a");
	anchor.href = page.path;
	anchor.textContent = page.title;
	anchor.setAttribute("data-page-id", page.id);
	return anchor;
}