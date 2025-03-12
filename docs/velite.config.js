import { defineConfig, s } from "velite";

const sharedSchema = s
	.object({
		title: s.string(),
		description: s.string(),
		path: s.path(),
		content: s.markdown(),
		navLabel: s.string().optional(),
		raw: s.raw(),
		toc: s.toc(),
		llms: s.boolean().default(true),
	})
	.transform((data) => {
		return {
			...data,
			slug: data.path.split("/").slice(1).join("/"),
			slugFull: `/${data.path}`,
		};
	});

export default defineConfig({
	collections: {
		docs: {
			name: "Doc",
			pattern: "./*.md",
			schema: sharedSchema.transform((d) => ({
				...d,
				slug: d.path,
			})),
		},
		componentDocs: {
			name: "ComponentDoc",
			pattern: "./components/**/*.md",
			schema: sharedSchema,
		},
		utilityDocs: {
			name: "UtilityDoc",
			pattern: "./utilities/**/*.md",
			schema: sharedSchema,
		},
		typeHelperDocs: {
			name: "TypeHelperDoc",
			pattern: "./type-helpers/**/*.md",
			schema: sharedSchema,
		},
		policyDocs: {
			name: "PolicyDoc",
			pattern: "./policies/**/*.md",
			schema: sharedSchema,
		},
	},
});
