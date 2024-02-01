import { getAllContexts } from "svelte";

export function verifyContextDeps(...deps: string[]) {
	const ctx = getAllContexts();
	const missing = deps.filter((dep) => !ctx.has(dep));
	if (missing.length > 0) {
		throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
	}
}
