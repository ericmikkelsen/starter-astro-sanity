import { resolve } from 'node:path';
import { writeGeneratedFile, toPascalCase } from './scaffold-utils';

/**
 * Generates a preview route for a scaffolded content type.
 *
 * @param name       Sanity document type name (e.g. 'article').
 * @param urlPrefix  URL path prefix for generated routes (e.g. 'articles').
 * @param type       'block' | 'portable' — determines which template to use.
 */
export function generatePreviewRoute(
	name: string,
	urlPrefix: string,
	type: 'block' | 'portable'
) {
	const pascal = toPascalCase(name);
	if (type === 'block') {
		return `---
import { getAstro${pascal}BySlug } from '../../../lib/content/${name}';
import BlocksPage from '../../../layouts/BlocksPage.astro';
import HTML from '../../../layouts/html.astro';

export const prerender = false;

const slug = Astro.params.slug;
const page = slug ? await getAstro${pascal}BySlug(slug) : undefined;
if (!page) {
	Astro.response.status = 404;
}

const title = page?.title ?? 'Preview not found';
const description =
	page?.description ?? 'The requested preview page was not found.';
---

{
	page ? (
		<BlocksPage title={title} description={description} page={page} />
	) : (
		<HTML title={title} description={description}>
			<div class="mx-auto max-w-3xl px-6 py-14 text-stone-700">
				Preview page not found.
			</div>
		</HTML>
	)
}
`;
	}
	// Portable text preview route uses shared PortablePage layout for DRYness
	return `---
import { getAstro${pascal}BySlug } from '../../../lib/content/${name}';
import PortablePage from '../../../layouts/PortablePage.astro';
import HTML from '../../../layouts/html.astro';

export const prerender = false;

const slug = Astro.params.slug;
const entry = slug ? await getAstro${pascal}BySlug(slug) : undefined;
if (!entry) {
	Astro.response.status = 404;
}

const title = entry?.title ?? 'Preview not found';
const description =
	entry?.description ?? 'The requested preview page was not found.';
---

{
	entry ? (
		<PortablePage
			title={entry.title}
			description={entry.description}
			body={entry.body}
			urlPrefix={urlPrefix}
		/>
	) : (
		<HTML title={title} description={description}>
			<div class="mx-auto max-w-3xl px-6 py-14 text-stone-700">
				Preview page not found.
			</div>
		</HTML>
	)
}
`;
}

/**
 * Writes the preview route file for a scaffolded content type.
 */
export function writePreviewRoute(
	name: string,
	urlPrefix: string,
	type: 'block' | 'portable'
) {
	const previewPath = resolve(`src/pages/preview/${urlPrefix}/[slug].astro`);
	const content = generatePreviewRoute(name, urlPrefix, type);
	writeGeneratedFile(previewPath, content);
}
