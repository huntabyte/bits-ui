import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "../$types.js";

export const load: PageLoad = async () => {
	throw redirect(303, "/docs/introduction");
};
