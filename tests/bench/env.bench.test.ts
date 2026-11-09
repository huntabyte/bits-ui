import { it, expect } from "vitest";
import { DEV } from "../../packages/bits-ui/node_modules/esm-env/index.js";

it("runs bits-ui and svelte in production mode", () => {
	expect(DEV).toBe(false);
});

it("exposes gc + precise memory for heap metrics", () => {
	expect(typeof (window as { gc?: unknown }).gc).toBe("function");
	expect(
		(performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize
	).toBeGreaterThan(0);
});
