import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = '2024-01-01';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
	perspective: 'published',
});

export const previewClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	perspective: 'previewDrafts',
	token: import.meta.env.SANITY_API_TOKEN,
});

export function getClient(preview = false) {
	return preview ? previewClient : client;
}
