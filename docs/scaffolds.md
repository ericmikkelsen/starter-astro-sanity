# Scaffold Commands

## Component Scaffold

Use this command to generate a reusable Sanity object schema and matching Astro component.

```bash
npm run scaffold:component
```

### Prompts

1. Component name (camelCase, example: `featureCard`)
2. Component category (`atoms`, `molecules`, `organisms`, `blocks`)
3. Field include prompts (`y/N`) for:
    - `heading`
    - `subheading`
    - `body`
    - `link`
    - `image`
    - `links`
    - `cards`
4. If `body` is selected: body type (`string` or `portable`)

### Generated Files

- `sanity/schemaTypes/objects/<name>.ts`
- `src/components/<category>/<PascalName>.astro`

### Follow-up Wiring

The command prints the exact import snippet to register the generated schema in:

- `sanity/schemaTypes/index.ts`

Copy the printed import line and add `<name>Type` to the exported `types` array.
