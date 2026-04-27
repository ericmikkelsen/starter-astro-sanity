import { createClient, type QueryParams } from "@sanity/client";

// Supports both Astro runtime (import.meta.env) and Node test runtime (process.env).
const runtimeEnv = ((import.meta as { env?: Record<string, string | undefined> }).env ??
	process.env) as Record<string, string | undefined>;

const projectId = runtimeEnv.PUBLIC_SANITY_PROJECT_ID || "3do82whm";
const dataset = runtimeEnv.PUBLIC_SANITY_DATASET || "production";
const apiVersion = runtimeEnv.PUBLIC_SANITY_API_VERSION || "2026-01-01";

const previewEnabled = runtimeEnv.PUBLIC_SANITY_ENABLE_PREVIEW === "true";
const token = runtimeEnv.SANITY_API_READ_TOKEN;

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: !previewEnabled,
});

/**
 * Returns whether preview mode is enabled via environment toggle.
 */
export function isPreviewEnabled(): boolean {
	return previewEnabled;
}

/**
 * Executes a GROQ query using published or drafts perspective based on preview mode.
 * Throws when preview is enabled but no read token is configured.
 */
export async function loadQuery<QueryResult>(query: string, params?: QueryParams): Promise<QueryResult> {
	if (!previewEnabled) {
		return client.fetch<QueryResult>(query, params ?? {}, { perspective: "published" });
	}

	if (!token) {
		throw new Error("SANITY_API_READ_TOKEN is required when PUBLIC_SANITY_ENABLE_PREVIEW=true.");
	}

	return client.fetch<QueryResult>(query, params ?? {}, { perspective: "drafts", token });
}