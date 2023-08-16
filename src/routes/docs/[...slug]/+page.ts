import type { PageLoad } from "./$types";
import { getDoc } from "@/utils/docs";

export const load: PageLoad = async (event) => {
	const { component, title, metadata } = await getDoc(event.params.slug);
	return {
		component,
		title,
		metadata
	};
};
