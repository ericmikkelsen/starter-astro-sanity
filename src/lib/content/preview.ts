import { createClient, type QueryParams } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "3do82whm";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-01-01";

const previewEnabled = import.meta.env.PUBLIC_SANITY_ENABLE_PREVIEW === "true";
const token = import.meta.env.SANITY_API_READ_TOKEN;

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: !previewEnabled,
});

export function isPreviewEnabled(): boolean {
	return previewEnabled;
}

export async function loadQuery<QueryResult>(query: string, params?: QueryParams): Promise<QueryResult> {
	if (!previewEnabled) {
		return client.fetch<QueryResult>(query, params ?? {}, { perspective: "published" });
	}

	if (!token) {
		throw new Error("SANITY_API_READ_TOKEN is required when PUBLIC_SANITY_ENABLE_PREVIEW=true.");
	}

	return client.fetch<QueryResult>(query, params ?? {}, { perspective: "drafts", token });
}