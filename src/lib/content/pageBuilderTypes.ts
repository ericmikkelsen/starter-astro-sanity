import type ImageType from '../../types/image';

/**
 * Narrow portable text block representation used by the scaffolded rich-text block.
 */
export type PortableTextBlock = {
	_type: string;
	[key: string]: unknown;
};

/**
 * Shared rendering settings applied to all block components by the renderer.
 * Controls wrapper element type, heading level, index position, and image priority.
 */
export type BlockSettings = {
	as: 'header' | 'section';
	hLevel: 1 | 2 | 3 | 4 | 5 | 6;
	index: number;
	priority: boolean;
};

export type ArrayPageBuilderBlock =
	| {
			_type: 'billboard';
			heading?: string;
			body?: string;
			image?: ImageType;
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
