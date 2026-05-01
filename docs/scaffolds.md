# Scaffold Generators

Scaffold commands automate Sanity schemas, Astro components, content loaders, and preview routes for new content types.

---

**Component Scaffold**

```
npm run scaffold:component
```

Prompts: name, category, fields, body type
Outputs:

- sanity/schemaTypes/objects/<name>.ts
- src/components/<category>/<PascalName>.astro
  Wiring: Add printed import to sanity/schemaTypes/index.ts and export `<name>Type`.

---

**Web Block Scaffold**

```
npm run scaffold:web-block
```

Prompts: name, urlPrefix
Outputs:

- sanity/schemaTypes/documents/<name>.ts
- src/lib/content/<name>Collection.ts
- src/lib/content/<name>CollectionLoader.ts
- src/pages/<urlPrefix>/[slug].astro
  Wiring: Add printed import to sanity/schemaTypes/index.ts and register collection in src/content.config.ts.

---

**Web Portable Scaffold**

```
npm run scaffold:web-portable
```

Prompts: name, urlPrefix
Outputs:

- sanity/schemaTypes/documents/<name>.ts
- src/lib/content/<name>Collection.ts
- src/lib/content/<name>CollectionLoader.ts
- src/pages/<urlPrefix>/[slug].astro
  Wiring: Add printed import to sanity/schemaTypes/index.ts and register collection in src/content.config.ts.

---

**Preview Route Scaffold**

```
npm run scaffold:preview-route
```

Prompts: name, urlPrefix, type (block/portable)
Outputs:

- src/pages/preview/<urlPrefix>/[slug].astro
  Wiring: No manual wiring; just ensure collection/loader are registered in src/content.config.ts.

---

---

**Guidance**
All scaffold commands print copy-pasteable import/registration snippets. Always follow printed instructions.

**Testing**
Contract tests for all generators are in `tests/` (see: scaffold-web-block.test.ts, scaffold-web-portable.test.ts, scaffold-component.test.ts, scaffold-preview-route.test.ts, scaffold-utils.test.ts). Tests cover input validation, file output, route-prefix, loader/preview integration, and guidance output.
