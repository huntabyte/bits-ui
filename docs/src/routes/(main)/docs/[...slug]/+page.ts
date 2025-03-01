import { getDoc } from "$lib/utils/docs.js";

export async function load(event) {
	return await getDoc(event.params.slug);
}
