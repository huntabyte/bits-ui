import { error, redirect } from "@sveltejs/kit";

export type FrontMatter = {
	title: string;
	description: string;
};

export type DocFile = {
	default: import("svelte").SvelteComponent;
	metadata: FrontMatter;
};

export type DocResolver = () => Promise<DocFile>;

type Doc = {
	component: DocFile["default"];
	metadata: DocFile["metadata"];
	title: string;
};

export function slugFromPath(path: string) {
	return path.replace("/src/content/", "").replace(".md", "");
}

export async function getDoc(slug: string): Promise<Doc> {
	if (slug === "components") {
		throw redirect(303, "/docs/components/accordion");
	}

	const modules = import.meta.glob("/src/content/**/*.md");

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();
	if (!doc || !doc.metadata) {
		throw error(404);
	}
	return {
		component: doc.default,
		metadata: doc.metadata,
		title: doc.metadata.title
	};
}
