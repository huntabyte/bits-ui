import {
	allComponentDocs,
	allDocs,
	allTypeHelperDocs,
	allUtilityDocs,
} from "contentlayer/generated/index.mjs";
import removeMd from "remove-markdown";

export function buildDocsIndex() {
	const components = allComponentDocs.map((doc) => {
		const content = removeMd(doc.body.raw, {
			replaceLinksWithURL: true,
			gfm: true,
			useImgAltText: true,
		});

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
		});

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
		});

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
		});

		return {
			title: doc.title,
			content,
			description: doc.description,
			href: `/docs/${doc.slug}`,
		};
	});

	return [...components, ...utilities, ...typeHelpers, ...mainPages];
}
