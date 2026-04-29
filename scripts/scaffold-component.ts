import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	createPromptSession,
	NAME_RE,
	toPascalCase,
	toStudioTitle,
	writeGeneratedFile
} from './scaffold-utils';

export type ComponentCategory = 'atoms' | 'molecules' | 'organisms' | 'blocks';
export type ComponentFieldKey =
	| 'heading'
	| 'subheading'
	| 'body'
	| 'link'
	| 'image'
	| 'links'
	| 'cards';
export type ComponentBodyType = 'string' | 'portable';

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
	'atoms',
	'molecules',
	'organisms',
	'blocks'
];

export const DEFAULT_COMPONENT_FIELDS: ComponentFieldKey[] = [
	'heading',
	'subheading',
	'body',
	'link',
	'image',
	'links',
	'cards'
];

export { toPascalCase };

export function validateComponentName(name: string): void {
	if (!NAME_RE.test(name)) {
		throw new Error(
			'Invalid component name. Use /^[a-z][a-zA-Z0-9]*$/ (example: featureCard).'
		);
	}
}

export function validateComponentCategory(
	category: string
): asserts category is ComponentCategory {
	if (!COMPONENT_CATEGORIES.includes(category as ComponentCategory)) {
		throw new Error(
			`Invalid component category. Use one of: ${COMPONENT_CATEGORIES.join(', ')}.`
		);
	}
}

export function validateComponentFields(
	fields: string[]
): asserts fields is ComponentFieldKey[] {
	if (fields.length === 0) {
		throw new Error('Select at least one component field.');
	}

	for (const field of fields) {
		if (!DEFAULT_COMPONENT_FIELDS.includes(field as ComponentFieldKey)) {
			throw new Error(
				`Unsupported component field "${field}". Allowed values: ${DEFAULT_COMPONENT_FIELDS.join(', ')}.`
			);
		}
	}
}

export function validateComponentBodyType(
	bodyType: string
): asserts bodyType is ComponentBodyType {
	if (bodyType !== 'string' && bodyType !== 'portable') {
		throw new Error('Invalid body type. Use "string" or "portable".');
	}
}

export function generateSanityComponentSchema(
	name: string,
	title: string,
	fields: ComponentFieldKey[],
	bodyType: ComponentBodyType
): string {
	const selected = new Set(fields);
	const includesBody = selected.has('body');
	const fieldArgImports: string[] = [];
	const generatedFields: string[] = [];

	if (selected.has('heading')) {
		fieldArgImports.push('HEADING_FIELD_ARGS');
		generatedFields.push('HEADING_FIELD_ARGS');
	}

	if (selected.has('subheading')) {
		generatedFields.push(`defineField({
			name: 'subheading',
			title: 'Subheading',
			type: 'string'
		})`);
	}

	if (includesBody && bodyType === 'string') {
		fieldArgImports.push('BODY_FIELD_ARGS');
		generatedFields.push('BODY_FIELD_ARGS');
	}

	if (includesBody && bodyType === 'portable') {
		fieldArgImports.push('RICH_TEXT_FIELD_ARGS');
		generatedFields.push('RICH_TEXT_FIELD_ARGS');
	}

	if (selected.has('link')) {
		fieldArgImports.push('LINK_FIELD_ARGS');
		generatedFields.push('LINK_FIELD_ARGS');
	}

	if (selected.has('image')) {
		fieldArgImports.push('IMAGE_FIELD_ARGS');
		generatedFields.push('IMAGE_FIELD_ARGS');
	}

	if (selected.has('links')) {
		fieldArgImports.push('LINKS_FIELD_ARGS');
		generatedFields.push('LINKS_FIELD_ARGS');
	}

	if (selected.has('cards')) {
		generatedFields.push(`defineField({
			name: 'cards',
			title: 'Cards',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({
							name: 'heading',
							title: 'Heading',
							type: 'string'
						}),
						defineField({
							name: 'body',
							title: 'Body',
							type: 'string'
						}),
						defineField({
							name: 'link',
							title: 'Link',
							type: 'object',
							fields: [
								defineField({
									name: 'text',
									title: 'Text',
									type: 'string'
								}),
								defineField({
									name: 'url',
									title: 'URL',
									type: 'url'
								})
							]
						}),
						defineField({
							name: 'image',
							title: 'Image',
							type: 'image',
							options: { hotspot: true },
							fields: [
								defineField({
									name: 'alt',
									title: 'Alt Text',
									type: 'string'
								})
							]
						})
					]
				})
			]
		})`);
	}

	const importLines = [
		"import { defineArrayMember, defineField, defineType } from 'sanity';"
	];

	if (fieldArgImports.length === 1) {
		importLines.push(
			`import { ${fieldArgImports[0]} } from './componentFields';`
		);
	}

	if (fieldArgImports.length > 1) {
		importLines.push(`import {
	${fieldArgImports.join(',\n\t')}
} from './componentFields';`);
	}

	const fieldsSource =
		generatedFields.length === 1
			? `[${generatedFields[0]}]`
			: `[
		${generatedFields.join(',\n\t\t')}
	]`;

	return `${importLines.join('\n')}

export const ${name}Type = defineType({
	name: '${name}',
	title: '${title}',
	type: 'object',
	fields: ${fieldsSource}
});
`;
}

function buildPropsInterface(
	fields: ComponentFieldKey[],
	bodyType: ComponentBodyType
): string {
	const lines: string[] = [];
	const selected = new Set(fields);

	if (selected.has('heading')) {
		lines.push('heading?: string;');
		lines.push('hLevel?: 1 | 2 | 3 | 4 | 5 | 6;');
	}
	if (selected.has('subheading')) lines.push('subheading?: string;');
	if (selected.has('body')) {
		if (bodyType === 'portable') {
			lines.push('body?: Array<Record<string, unknown>>;');
		} else {
			lines.push('body?: string;');
		}
	}
	if (selected.has('link')) lines.push('link?: Link;');
	if (selected.has('image')) lines.push('image?: Image;');
	if (selected.has('links')) lines.push('links?: Link[];');
	if (selected.has('cards')) lines.push('cards?: Card[];');
	if (lines.length === 0) lines.push('noop?: boolean;');

	return `interface Props {\n\t${lines.join('\n\t')}\n}`;
}

function buildCardType(hasCards: boolean): string {
	if (!hasCards) return '';

	return `
interface Card {
	heading?: string;
	body?: string;
	link?: Link;
	image?: Image;
}
`;
}

function buildHeadingImport(category: ComponentCategory): string {
	if (category === 'atoms') {
		return "import Heading from './Heading.astro';";
	}

	return "import Heading from '../atoms/Heading.astro';";
}

export function generateAstroComponent(
	name: string,
	fields: ComponentFieldKey[],
	bodyType: ComponentBodyType,
	category: ComponentCategory = 'atoms'
): string {
	const selected = new Set(fields);
	const isBlockComponent = category === 'blocks';
	const hasCards = selected.has('cards');
	const needsLink = selected.has('link') || selected.has('links') || hasCards;
	const needsImage = selected.has('image') || hasCards;
	const imports: string[] = [];

	if (selected.has('body') && bodyType === 'portable') {
		imports.push("import { PortableText } from 'astro-portabletext';");
	}
	if (selected.has('heading')) {
		imports.push(buildHeadingImport(category));
	}
	if (isBlockComponent) {
		imports.push("import BlockWrapper from '../atoms/BlockWrapper.astro';");
	}
	if (needsLink) imports.push("import type Link from '../../types/link';");
	if (needsImage) imports.push("import type Image from '../../types/image';");

	const destructure = [
		selected.has('heading') ? 'heading' : null,
		selected.has('subheading') ? 'subheading' : null,
		selected.has('body') ? 'body' : null,
		selected.has('link') ? 'link' : null,
		selected.has('image') ? 'image' : null,
		selected.has('links') ? 'links' : null,
		hasCards ? 'cards' : null
	]
		.filter(Boolean)
		.join(', ');

	const sectionLines: string[] = [];
	if (selected.has('heading')) {
		sectionLines.push(
			'{heading ? <Heading hLevel={hLevel}>{heading}</Heading> : null}'
		);
	}
	if (selected.has('subheading')) {
		sectionLines.push('{subheading ? <p>{subheading}</p> : null}');
	}
	if (selected.has('body') && bodyType === 'portable') {
		sectionLines.push(
			'{body?.length ? <PortableText value={body} /> : null}'
		);
	}
	if (selected.has('body') && bodyType === 'string') {
		sectionLines.push('{body ? <p>{body}</p> : null}');
	}
	if (selected.has('image')) {
		sectionLines.push(`{
		image ? (
			<img
				src={image.src}
				alt={image.alt ?? ''}
				width={image.width}
				height={image.height}
			/>
		) : null
	}`);
	}
	if (selected.has('link')) {
		sectionLines.push('{link ? <a href={link.url}>{link.text}</a> : null}');
	}
	if (selected.has('links')) {
		sectionLines.push(`{
		links?.length ? (
			<ul>
				{links.map((item) => (
					<li>
						<a href={item.url}>{item.text}</a>
					</li>
				))}
			</ul>
		) : null
	}`);
	}
	if (hasCards) {
		sectionLines.push(`{
		cards?.length ? (
			<div>
				{cards.map((card) => (
					<article>
						{card.heading ? <h3>{card.heading}</h3> : null}
						{card.body ? <p>{card.body}</p> : null}
						{card.link ? (
							<a href={card.link.url}>{card.link.text}</a>
						) : null}
						{card.image ? (
							<img
								src={card.image.src}
								alt={card.image.alt ?? ''}
								width={card.image.width}
								height={card.image.height}
							/>
						) : null}
					</article>
				))}
			</div>
		) : null
	}`);
	}

	const sectionContent = sectionLines.join('\n\t');
	const pascal = toPascalCase(name);
	const cardType = buildCardType(hasCards).trim();
	const wrapperOpen = isBlockComponent
		? `<BlockWrapper class="${pascal}">`
		: `<div class="${pascal}">`;
	const wrapperClose = isBlockComponent ? '</BlockWrapper>' : '</div>';
	const frontmatterParts: string[] = [];

	if (imports.length > 0) {
		frontmatterParts.push(imports.join('\n'));
	}

	frontmatterParts.push(buildPropsInterface(fields, bodyType));

	if (cardType) {
		frontmatterParts.push(cardType);
	}

	const destructureSource = selected.has('heading')
		? `${destructure}, hLevel = 2`
		: destructure;

	frontmatterParts.push(
		`const { ${destructureSource} } = Astro.props as Props;`
	);

	return `---
${frontmatterParts.join('\n\n')}
---

${wrapperOpen}
	${sectionContent}
${wrapperClose}
`;
}

export function writeScaffoldComponentFiles(
	name: string,
	title: string,
	category: ComponentCategory,
	fields: ComponentFieldKey[],
	bodyType: ComponentBodyType
): void {
	const pascal = toPascalCase(name);
	const schemaPath = resolve(`sanity/schemaTypes/objects/${name}.ts`);
	const componentPath = resolve(`src/components/${category}/${pascal}.astro`);

	writeGeneratedFile(
		schemaPath,
		generateSanityComponentSchema(name, title, fields, bodyType)
	);
	writeGeneratedFile(
		componentPath,
		generateAstroComponent(name, fields, bodyType, category)
	);
}

export function printComponentScaffoldGuidance(
	name: string,
	category: ComponentCategory
): void {
	const pascal = toPascalCase(name);
	console.log(
		`Register ${name}Type in sanity/schemaTypes/index.ts via import { ${name}Type } from './objects/${name}'; generated component: src/components/${category}/${pascal}.astro`
	);
}

async function promptForFields(
	session: ReturnType<typeof createPromptSession>
): Promise<ComponentFieldKey[]> {
	const selected: ComponentFieldKey[] = [];

	for (const field of DEFAULT_COMPONENT_FIELDS) {
		const answer = await session.ask(`Include field "${field}"? (y/N): `);
		const normalized = answer.toLowerCase();
		if (normalized === 'y' || normalized === 'yes') {
			selected.push(field);
		}
	}

	return selected;
}

async function main(): Promise<void> {
	const session = createPromptSession();

	try {
		const name = await session.ask('Component name (e.g. featureCard): ');
		validateComponentName(name);

		const categoryInput = await session.ask(
			`Component category (${COMPONENT_CATEGORIES.join('/')}): `
		);
		validateComponentCategory(categoryInput);

		const fields = await promptForFields(session);
		validateComponentFields(fields);

		let bodyType: ComponentBodyType = 'string';
		if (fields.includes('body')) {
			const bodyTypeInput = await session.ask(
				'Body type (string/portable): '
			);
			validateComponentBodyType(bodyTypeInput);
			bodyType = bodyTypeInput;
		}

		const title = toStudioTitle(name);
		writeScaffoldComponentFiles(
			name,
			title,
			categoryInput,
			fields,
			bodyType
		);
		printComponentScaffoldGuidance(name, categoryInput);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Scaffold failed: ${message}`);
		process.exitCode = 1;
	} finally {
		session.close();
	}
}

const isMain =
	process.argv[1] !== undefined &&
	fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isMain) {
	main().catch((error) => {
		const message = error instanceof Error ? error.message : String(error);
		console.error(`Scaffold failed: ${message}`);
		process.exitCode = 1;
	});
}
