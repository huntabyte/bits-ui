import { posts } from "$content/index.js";
import { getPost } from "$lib/utils/docs.js";
import type { EntryGenerator } from "./$types.js";

export const prerender = true;

export const entries: EntryGenerator = async () => {
	return [
		...posts.map((doc) => ({
			slug: `blog/${doc.slug}`,
		})),
	];
};

export async function load(event) {
	return await getPost(event.params.slug);
}
