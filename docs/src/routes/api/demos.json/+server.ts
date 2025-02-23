import { json, type RequestHandler } from "@sveltejs/kit";
import demos from "./demos.json" with { type: "json" };
import stackBlitzFiles from "./stackblitz-files.json" with { type: "json" };

const demoNote = `<!--
\tNOTE: Tailwind v4 does not support web container environments, so animations powered by tailwindcss-animate will not work in this environment.
-->\n`;

export const GET: RequestHandler = async ({ url }) => {
	const name = url.searchParams.get("name");
	// @ts-expect-error - shh
	if (!name || demos[name] === undefined) {
		return json({ error: "Demo not found" }, { status: 404 });
	}

	// @ts-expect-error - shh
	return json({ code: demoNote + demos[name], files: stackBlitzFiles });
};
