import { componentDocs } from "$content/index.js";
import { getComponentDoc } from "$lib/utils/docs.js";
import type { EntryGenerator } from "./$types.js";

export const prerender = true;

export const entries: EntryGenerator = async () => {
	return componentDocs.map((doc) => ({
		name: doc.slug,
	}));
};

export async function load(event) {
	return await getComponentDoc(`components/${event.params.name}`);
}
