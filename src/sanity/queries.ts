import { defineQuery } from 'groq';

export const allPagesQuery = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_createdAt asc) {
    _id,
    title,
    slug,
    description
  }
`);

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    metaImage,
    metaImageAlt
  }
`);
