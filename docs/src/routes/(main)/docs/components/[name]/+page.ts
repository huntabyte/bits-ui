import { getComponentDoc } from "$lib/utils/docs.js";

export async function load(event) {
	return await getComponentDoc(`components/${event.params.name}`);
}
