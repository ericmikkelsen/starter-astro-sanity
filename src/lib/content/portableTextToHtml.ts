export type PortableTextSpan = {
	_type: 'span';
	text: string;
	marks?: string[];
};

export type PortableTextMarkDef = {
	_type: string;
	_key: string;
	href?: string;
	[key: string]: unknown;
};

export type PortableTextBlock = {
	_type: 'block';
	style?: string;
	children?: PortableTextSpan[];
	markDefs?: PortableTextMarkDef[];
};

/** Represents any block that may appear in a Sanity portable text array. */
export type SanityPortableTextBlock =
	| PortableTextBlock
	| { _type: string; [key: string]: unknown };

/** Escapes HTML special characters to prevent XSS when rendering text content. */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

const STYLE_TO_TAG: Record<string, string> = {
	normal: 'p',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	blockquote: 'blockquote',
};

function renderSpan(
	span: PortableTextSpan,
	markDefs: PortableTextMarkDef[]
): string {
	let text = escapeHtml(span.text);

	for (const mark of [...(span.marks ?? [])].reverse()) {
		const markDef = markDefs.find((def) => def._key === mark);

		if (markDef) {
			if (markDef._type === 'portableTextLink' && markDef.href) {
				text = `<a href="${escapeHtml(markDef.href)}">${text}</a>`;
			}
			continue;
		}

		switch (mark) {
			case 'strong':
				text = `<strong>${text}</strong>`;
				break;
			case 'em':
				text = `<em>${text}</em>`;
				break;
			case 'underline':
				text = `<u>${text}</u>`;
				break;
			case 'strike-through':
				text = `<s>${text}</s>`;
				break;
			case 'code':
				text = `<code>${text}</code>`;
				break;
		}
	}

	return text;
}

/**
 * Converts a Sanity portable text block array into an HTML string.
 * Only standard `block` types are rendered; custom types are skipped.
 * All text content is HTML-escaped to prevent XSS.
 *
 * @param blocks The portable text blocks from a Sanity document.
 * @returns An HTML string safe for use with `set:html`.
 */
export function portableTextToHtml(blocks: SanityPortableTextBlock[]): string {
	return blocks
		.map((block) => {
			if (block._type !== 'block') return '';

			const b = block as PortableTextBlock;
			const tag = STYLE_TO_TAG[b.style ?? 'normal'] ?? 'p';
			const children = (b.children ?? [])
				.map((child) => renderSpan(child, b.markDefs ?? []))
				.join('');

			return `<${tag}>${children}</${tag}>`;
		})
		.filter(Boolean)
		.join('\n');
}
