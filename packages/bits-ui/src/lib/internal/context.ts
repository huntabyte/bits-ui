import { getAllContexts } from "svelte";

// TODO: should this be a DEV only feature?
export function verifyContextDeps(...deps: symbol[]) {
	const ctx = getAllContexts();
	const missing = deps.filter((dep) => !ctx.has(dep));
	if (missing.length > 0) {
		throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
	}
}
