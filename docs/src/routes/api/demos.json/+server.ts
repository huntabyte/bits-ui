import { json, type RequestHandler } from "@sveltejs/kit";
import demos from "./demos.json" with { type: "json" };

export const GET: RequestHandler = async ({ url }) => {
	const name = url.searchParams.get("name");
	// @ts-expect-error - shh
	if (!name || demos[name] === undefined) {
		return json({ error: "Demo not found" }, { status: 404 });
	}

	// @ts-expect-error - shh
	return json({ code: demos[name] });
};
