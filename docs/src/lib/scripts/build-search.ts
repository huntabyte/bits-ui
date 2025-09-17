import removeMd from "remove-markdown";
import { componentDocs, docs, typeHelperDocs, utilityDocs } from "$content/index.js";

function cleanContent(raw: string): string {
	let content = removeMd(raw, {
		replaceLinksWithURL: true,
		gfm: true,
		useImgAltText: true,
	});

	content = content.replace(/```[\s\S]*?```/g, "");
	content = content.replace(/`[^`]+`/g, "");
	content = content.replace(/\s+/g, " ").trim();
	content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
	content = content.replace(/#{1,6}\s*/g, "");
	content = content.replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1");

	return content;
}

export function buildDocsIndex() {
	const components = componentDocs.map((doc) => {
		const content = cleanContent(doc.raw);

		return {
			title: doc.title,
			content,
			description: doc.description ?? "",
			href: `/docs/components/${doc.slug}`,
		};
	});

	const utilities = utilityDocs.map((doc) => {
		const content = cleanContent(doc.raw);

		return {
			title: doc.title,
			content,
			description: doc.description ?? "",
			href: `/docs/utilities/${doc.slug}`,
		};
	});

	const typeHelpers = typeHelperDocs.map((doc) => {
		const content = cleanContent(doc.raw);

		return {
			title: doc.title,
			content,
			description: doc.description ?? "",
			href: `/docs/type-helpers/${doc.slug}`,
		};
	});

	const mainPages = docs.map((doc) => {
		const content = cleanContent(doc.raw);

		return {
			title: doc.title,
			content,
			description: doc.description ?? "",
			href: `/docs/${doc.slug}`,
		};
	});

	return [...components, ...utilities, ...typeHelpers, ...mainPages];
}
