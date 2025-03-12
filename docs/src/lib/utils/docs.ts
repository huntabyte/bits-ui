import { error, redirect } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { Doc } from "$content/index.js";
import { getAPISchemas, isBit } from "$lib/content/api-reference/index.js";
import { utilityDocs, componentDocs, docs, typeHelperDocs, policyDocs } from "$content/index.js";
import type { APISchema } from "$lib/types/api.js";

const allDocs = [...docs, ...componentDocs, ...utilityDocs, ...typeHelperDocs, ...policyDocs];

export type DocResolver = () => Promise<{ default: Component; metadata: Doc }>;
export type DocMetadata = (typeof allDocs)[number];

export function slugFromPath(path: string): string {
	return path.replace("/content/", "").replace(".md", "");
}

function getDocMetadata(slug: string): DocMetadata | undefined {
	return allDocs.find((doc) => doc.slugFull === `/${slug}`);
}

export async function getDoc(
	slug: string
): Promise<{ component: Component; metadata: DocMetadata }> {
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

export async function getComponentDoc(
	slug: string
): Promise<{ component: Component; metadata: DocMetadata; schemas: APISchema[] }> {
	if (slug === "components") {
		redirect(303, "/docs/components/accordion");
	}

	const componentName = slug.split("/").pop();

	if (!isBit(componentName!)) error(404);

	const modules = import.meta.glob("/content/**/*.md");

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
		schemas: getAPISchemas(componentName),
	};
}
