import { defineDocumentType, makeSource } from "contentlayer/source-files";
import path from "path";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
	slug: {
		type: "string",
		resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
	},
	slugFull: {
		type: "string",
		resolve: (doc) => `/${doc._raw.flattenedPath}`
	},
	fileName: {
		type: "string",
		resolve: (doc) => path.parse(doc._raw.sourceFilePath.split("/").slice(-1).join("/")).name
	},
	suffix: {
		type: "string",
		resolve: (doc) => path.parse(doc._raw.sourceFilePath.split("/").slice(-1).join("/")).ext
	}
};

export const Doc = defineDocumentType(() => ({
	name: "Doc",
	filePathPattern: `**/*.md`,
	fields: {
		title: {
			type: "string",
			required: true
		},
		description: {
			type: "string",
			required: true
		}
	},
	computedFields
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Doc],
	disableImportAliasWarning: true
});
