import { error, redirect } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { Doc } from "$content/index.js";
import { getAPISchemas, isBit } from "$lib/content/api-reference/index.js";
import { utilityDocs, componentDocs, docs, typeHelperDocs } from "$content/index.js";

const allDocs = [...docs, ...componentDocs, ...utilityDocs, ...typeHelperDocs];

export type FrontMatter = Pick<Doc, "title" | "description">;

export type DocResolver = () => Promise<{ default: Component; metadata: Doc }>;

export function slugFromPath(path: string) {
	return path.replace("/content/", "").replace(".md", "");
}

function getDocMetadata(slug: string) {
	return allDocs.find((doc) => doc.slug === slug);
}

export async function getDoc(slug: string) {
	if (slug === "components") {
		redirect(303, "/docs/components/accordion");
	}

	const modules = import.meta.glob(`/content/**/*.md`);

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();
	const metadata = getDocMetadata(slug);

	if (!doc || !metadata) {
		error(404, "Could not find the document.");
	}

	return {
		component: doc.default,
		metadata: metadata,
	};
}

export async function getComponentDoc(slug: string) {
	if (slug === "components") {
		redirect(303, "/docs/components/accordion");
	}

	if (!isBit(slug)) error(404);

	const modules = import.meta.glob("/content/**/*.md");

	let match: { path?: string; resolver?: DocResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (slugFromPath(path).replace("components/", "") === slug) {
			match = { path, resolver: resolver as unknown as DocResolver };
			break;
		}
	}

	const doc = await match?.resolver?.();
	const metadata = getDocMetadata(slug);
	console.log("metadata", metadata);
	if (!doc || !metadata) {
		error(404, "Could not find the document.");
	}

	return {
		component: doc.default,
		metadata: metadata,
		schemas: getAPISchemas(slug),
	};
}
