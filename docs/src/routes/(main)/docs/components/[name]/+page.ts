import { getComponentDoc } from "$lib/utils/docs.js";

export async function load(event) {
	return await getComponentDoc(event.params.name);
}
