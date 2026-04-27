import { describe, expect, it } from "vitest";

import { createHomepageLinkAnchor } from "../src/lib/content/pageHelpers";

describe("createHomepageLinkAnchor", () => {
	it("creates an anchor with href, text, and page id", () => {
		const anchor = createHomepageLinkAnchor(document, {
			id: "abc123",
			title: "Home",
			path: "/home/",
		});

		expect(anchor.getAttribute("href")).toBe("/home/");
		expect(anchor.textContent).toBe("Home");
		expect(anchor.getAttribute("data-page-id")).toBe("abc123");
	});
});