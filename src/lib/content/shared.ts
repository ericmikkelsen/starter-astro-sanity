/**
 * Shared field names keep schema definitions and frontend mapping aligned on the same keys.
 */
export const WEB_PAGE_FIELD_NAMES = {
	title: 'title',
	slug: 'slug',
	description: 'description',
	metaImage: 'metaImage',
	metaImageAlt: 'metaImageAlt',
} as const;

export type WebPageFieldName =
	(typeof WEB_PAGE_FIELD_NAMES)[keyof typeof WEB_PAGE_FIELD_NAMES];

export type WebDocumentImage = {
	assetRef: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type WebDocumentCore = {
	title: string;
	slug: string;
	description?: string;
	metaImage?: WebDocumentImage;
	metaImageAlt?: string;
};

export type BodyHeadingBlock = {
	_type: 'heading';
	text: string;
};

export type BodySubheadingBlock = {
	_type: 'subheading';
	text: string;
};

export type BodyTextBlock = {
	_type: 'bodyText';
	text: string;
};

export type BodyLinkBlock = {
	_type: 'link';
	url: string;
	text: string;
};

export type BodyListBlock = {
	_type: 'list';
	items: string[];
};

export type BodyImageBlock = {
	_type: 'imageObject';
	image: WebDocumentImage;
};

/**
 * The body union stays narrow and explicit so renderers can switch on `_type` without fallback cases.
 */
export type WebDocumentBodyBlock =
	| BodyHeadingBlock
	| BodySubheadingBlock
	| BodyTextBlock
	| BodyLinkBlock
	| BodyListBlock
	| BodyImageBlock;
