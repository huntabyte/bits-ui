import { getAllContexts } from "svelte";
import { DEV } from "esm-env";

export function verifyContextDeps(...deps: string[]) {
	if (DEV) {
		const ctx = getAllContexts();
		const missing = deps.filter((dep) => !ctx.has(dep));
		if (missing.length > 0) {
			// TODO: symbols break our ability to show the name of the missing context. :/
			throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
		}
	}
}
