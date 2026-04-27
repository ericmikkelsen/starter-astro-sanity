import { createClient, type QueryParams } from "@sanity/client";

// This module is reused by Astro runtime code and plain Node tests, so it cannot assume
// that `import.meta.env` always exists.
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
	// Published queries can use the CDN safely, but preview must bypass it to read fresh drafts.
	useCdn: !previewEnabled,
});

/**
 * Returns whether preview mode is enabled via environment toggle.
 *
 * @returns True when draft-aware preview querying should be enabled.
 */
export function isPreviewEnabled(): boolean {
	return previewEnabled;
}

/**
 * Executes a GROQ query using published or drafts perspective based on preview mode.
 * Throws when preview is enabled but no read token is configured.
 *
 * @template QueryResult The expected shape of the query result.
 * @param query The GROQ query string to execute.
 * @param params Optional GROQ parameters passed to the Sanity client.
 * @returns The typed query result from Sanity.
 */
export async function loadQuery<QueryResult>(query: string, params?: QueryParams): Promise<QueryResult> {
	if (!previewEnabled) {
		return client.fetch<QueryResult>(query, params ?? {}, { perspective: "published" });
	}

	if (!token) {
		// Preview without a read token is a configuration error because draft perspective
		// requires authenticated access.
		throw new Error("SANITY_API_READ_TOKEN is required when PUBLIC_SANITY_ENABLE_PREVIEW=true.");
	}

	return client.fetch<QueryResult>(query, params ?? {}, { perspective: "drafts", token });
}