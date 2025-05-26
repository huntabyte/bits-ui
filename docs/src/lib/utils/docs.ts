import { error, redirect } from "@sveltejs/kit";
import type { Component } from "svelte";
import type { Doc, Post } from "$content/index.js";
import { getAPISchemas, isBit } from "$lib/content/api-reference/index.js";
import {
	utilityDocs,
	componentDocs,
	docs,
	typeHelperDocs,
	policyDocs,
	posts,
} from "$content/index.js";
import type { APISchema } from "$lib/types/api.js";

const allDocs = [...docs, ...componentDocs, ...utilityDocs, ...typeHelperDocs, ...policyDocs];
const allBlogPosts = [...posts];

export type PostResolver = () => Promise<{ default: Component; metadata: Post }>;
export type PostMetadata = (typeof allBlogPosts)[number];

export type DocResolver = () => Promise<{ default: Component; metadata: Doc }>;
export type DocMetadata = (typeof allDocs)[number];

export function slugFromPath(path: string): string {
	return path.replace("/content/", "").replace(".md", "");
}

export function blogSlugFromPath(path: string): string {
	return path.replace("/content/blog/", "").replace(".md", "");
}

function getDocMetadata(slug: string): DocMetadata | undefined {
	return allDocs.find((doc) => doc.slugFull === `/${slug}`);
}

function getPostMetadata(slug: string): PostMetadata | undefined {
	return allBlogPosts.find((post) => post.slug === slug);
}

export async function getPost(
	slug: string
): Promise<{ component: Component; metadata: PostMetadata }> {
	const modules = import.meta.glob(`/content/blog/**/*.md`);

	let match: { path?: string; resolver?: PostResolver } = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (blogSlugFromPath(path) === slug) {
			match = { path, resolver: resolver as unknown as PostResolver };
			break;
		}
	}

	console.log("match", match);

	const post = await match?.resolver?.();
	const metadata = getPostMetadata(slug);

	console.log("metadata", metadata);

	if (!post || !metadata) {
		console.log("could not find post");
		error(404, "Could not find the post.");
	}

	return {
		component: post.default,
		metadata: metadata,
	};
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
