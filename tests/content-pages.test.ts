import test from "node:test";
import assert from "node:assert/strict";

import { mapSanityPageToAstroPage } from "../src/lib/content/pages";
import { toPagePath } from "../src/lib/content/pageHelpers";

test("toPagePath returns trailing-slash route", () => {
	assert.equal(toPagePath("about"), "/about/");
});

test("mapSanityPageToAstroPage maps valid page records", () => {
	const mapped = mapSanityPageToAstroPage({
		_id: "page-1",
		title: "About",
		slug: "about",
		description: "About page",
		metaImage: {
			asset: {
				_ref: "image-ref",
			},
		},
		metaImageAlt: "Alt text",
	});

	assert.ok(mapped);
	assert.equal(mapped?.id, "page-1");
	assert.equal(mapped?.path, "/about/");
	assert.equal(mapped?.metaImage?.assetRef, "image-ref");
});

test("mapSanityPageToAstroPage skips invalid entries", () => {
	const mapped = mapSanityPageToAstroPage({
		_id: "page-2",
		title: "Missing slug",
	});

	assert.equal(mapped, null);
});