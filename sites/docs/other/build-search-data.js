import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import removeMd from "remove-markdown";
import {
	allComponentDocs,
	allDocs,
	allTypeHelperDocs,
	allUtilityDocs,
} from "../.contentlayer/generated/index.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export function buildDocsIndex() {
	const components = allComponentDocs.map((doc) => {
		const content = removeMd(doc.body.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		})
			.replaceAll("\n", " ")
			.replaceAll("\t", " ");

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/components/${doc.slug}`,
		};
	});

	const utilities = allUtilityDocs.map((doc) => {
		const content = removeMd(doc.body.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		})
			.replaceAll("\n", " ")
			.replaceAll("\t", " ");

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/utilities/${doc.slug}`,
		};
	});

	const typeHelpers = allTypeHelperDocs.map((doc) => {
		const content = removeMd(doc.body.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		})
			.replaceAll("\n", " ")
			.replaceAll("\t", " ");

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/type-helpers/${doc.slug}`,
		};
	});

	const mainPages = allDocs.map((doc) => {
		const content = removeMd(doc.body.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		})
			.replaceAll("\n", " ")
			.replaceAll("\t", " ");

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs${doc.slugFull}`,
		};
	});

	return [...components, ...utilities, ...typeHelpers, ...mainPages];
}

const searchData = buildDocsIndex();

writeFileSync(
	resolve(__dirname, "../src/routes/api/search.json/search.json"),
	JSON.stringify(searchData),
	{ flag: "w" }
);
