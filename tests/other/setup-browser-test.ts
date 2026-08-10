/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
import { afterEach } from "vitest";
import { cleanup } from "vitest-browser-svelte";

afterEach(async () => {
	document.dispatchEvent(
		new KeyboardEvent("keydown", {
			key: "Escape",
			code: "Escape",
			bubbles: true,
			cancelable: true,
		})
	);

	cleanup();

	const style = document.body.style;
	style.removeProperty("pointer-events");
	style.removeProperty("overflow");
	style.removeProperty("padding-right");
	style.removeProperty("margin-right");
	style.removeProperty("--scrollbar-width");

	await new Promise((r) => setTimeout(r, 30));

	for (const [state] of globalThis.bitsDismissableLayers ?? []) {
		const ref = state.opts.ref.current;
		if (!ref?.isConnected) {
			globalThis.bitsDismissableLayers.delete(state);
		}
	}
});
