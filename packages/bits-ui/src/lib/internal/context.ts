import { getAllContexts } from "svelte";
import { DEV } from "esm-env";

export function verifyContextDeps(...deps: symbol[]) {
	if (DEV) {
		const ctx = getAllContexts();
		const missing = deps.filter((dep) => !ctx.has(dep));
		if (missing.length > 0) {
			throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
		}
	}
}
