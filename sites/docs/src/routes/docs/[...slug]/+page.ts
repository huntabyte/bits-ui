import type { PageLoad } from "./$types.js";
import { getDoc } from "$lib/utils/docs.js";

export const load: PageLoad = async (event) => {
	const { component, title, metadata } = await getDoc(event.params.slug);
	return {
		component,
		title,
		metadata,
	};
};
