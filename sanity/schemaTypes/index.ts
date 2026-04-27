import type { SchemaTypeDefinition } from 'sanity';

import { pageType } from './documents/page';
import {
	bodyTextType,
	headingType,
	imageObjectType,
	linkType,
	listType,
	subheadingType,
} from './objects/bodyBlocks';

export const schemaTypes: SchemaTypeDefinition[] = [
	pageType,
	headingType,
	subheadingType,
	bodyTextType,
	linkType,
	listType,
	imageObjectType,
];
