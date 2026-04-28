/**
 * Reusable field selection for Sanity image asset refs.
 */
export const SANITY_IMAGE_ASSET_REF_FIELDS = `
  asset {
    _ref
  }
`;

/**
 * Reusable field selection for legacy image objects that persist authored dimensions.
 */
export const SANITY_IMAGE_LEGACY_DIMENSION_FIELDS = `
  src,
  alt,
  width,
  height
`;

/**
 * Renders a reusable object projection block for GROQ query strings.
 */
export function projectObjectFields(fieldName: string, fields: string): string {
	return `${fieldName} {\n${fields}\n}`;
}
