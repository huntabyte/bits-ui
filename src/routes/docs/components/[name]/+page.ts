import type { PageLoad } from "./$types.js";
import { getComponentDoc } from "@/utils/docs.js";

export const load: PageLoad = async (event) => {
	const { component, title, metadata, schemas } = await getComponentDoc(event.params.name);
	return {
		component,
		title,
		metadata,
		schemas
	};
};
