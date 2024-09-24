import path from "node:path";
import { defineDocumentType, makeSource } from "contentlayer/source-files";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
	},
	slugFull: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	fileName: {
		type: "string",
		resolve: (doc) => path.parse(doc._raw.sourceFilePath.split("/").slice(-1).join("/")).name,
	},
	suffix: {
		type: "string",
		resolve: (doc) => path.parse(doc._raw.sourceFilePath.split("/").slice(-1).join("/")).ext,
	},
};

export const Doc = defineDocumentType(() => ({
	name: "Doc",
	filePathPattern: `./*.md`,
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		navLabel: {
			type: "string",
			required: false,
		},
	},
	computedFields,
}));

export const ComponentDoc = defineDocumentType(() => ({
	name: "ComponentDoc",
	filePathPattern: "components/**/*.md",
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		navLabel: {
			type: "string",
			required: false,
		},
	},
	computedFields,
}));

export const UtilityDoc = defineDocumentType(() => ({
	name: "UtilityDoc",
	filePathPattern: `./utilities/**/*.md`,
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		navLabel: {
			type: "string",
			required: false,
		},
	},
	computedFields,
}));

export const TypeHelperDoc = defineDocumentType(() => ({
	name: "TypeHelperDoc",
	filePathPattern: `./type-helpers/**/*.md`,
	fields: {
		title: {
			type: "string",
			required: true,
		},
		description: {
			type: "string",
			required: true,
		},
		navLabel: {
			type: "string",
			required: false,
		},
	},
	computedFields,
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Doc, ComponentDoc, UtilityDoc, TypeHelperDoc],
	disableImportAliasWarning: true,
});
