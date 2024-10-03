import { buildDocsIndex } from "$lib/scripts/build-search.js";

export async function handle({ event, resolve }) {
	const response = await resolve(event);

	response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
	response.headers.set("Cross-Origin-Opener-Policy", "same-origin");

	return response;
}
