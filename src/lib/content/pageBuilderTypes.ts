/**
 * Narrow portable text block representation used by the scaffolded rich-text block.
 */
export type PortableTextBlock = {
	_type: string;
	[key: string]: unknown;
};

/**
 * Shared page-builder block union used by route mappers and block components.
 *
 * When Sanity typegen outputs are available, this file is the single place to
 * swap these definitions with generated query types.
 */
export type ArrayPageBuilderBlock =
	| {
			_type: 'billboard';
			heading?: string;
			body?: string;
	  }
	| {
			_type: 'listScroller';
			heading?: string;
			body?: string;
			items?: string[];
	  }
	| {
			_type: 'peopleRefs';
			heading?: string;
			body?: string;
			people?: Array<{ _id: string; name?: string }>;
	  }
	| {
			_type: 'richText';
			heading?: string;
			body?: string;
			richText?: PortableTextBlock[];
	  };

/**
 * Utility type to derive a specific block shape by `_type` key.
 */
export type ArrayPageBuilderBlockByType<
	TType extends ArrayPageBuilderBlock['_type'],
> = Extract<ArrayPageBuilderBlock, { _type: TType }>;
