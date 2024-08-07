import { hasContext } from "svelte";
import { DEV } from "esm-env";

export function verifyContextDeps(...deps: Array<string | symbol>) {
	if (DEV) {
		const missing: string[] = [];
		for (const dep of deps) {
			if (hasContext(dep)) continue;
			const depLabel = typeof dep === "symbol" ? dep.description : dep;
			missing.push(depLabel!);
		}
		if (missing.length) {
			throw new Error(`Missing context dependencies: ${missing.join(", ")}`);
		}
	}
}
