import { getAllContexts } from "svelte";

export function getDataDisabled(disabled: boolean) {
	return disabled ? "" : undefined;
}

export function getAriaDisabled(disabled: boolean) {
	return disabled ? "true" : "false";
}

export function getDataOpenClosed(open: boolean) {
	return open ? "open" : "closed";
}

export function verifyContextDeps(...deps: string[]) {
	const ctx = getAllContexts();
	const missing = deps.filter((dep) => !ctx.has(dep));
	if (missing.length > 0) {
		throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
	}
}
