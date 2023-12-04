import type { PageLoad } from "./$types";
import { getComponentDoc } from "@/utils/docs";

export const load: PageLoad = async (event) => {
	const { component, title, metadata, schemas } = await getComponentDoc(event.params.name);
	return {
		component,
		title,
		metadata,
		schemas
	};
};
