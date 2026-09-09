import { flushSync, tick } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { BodyScrollLock } from "./body-scroll-lock.svelte.js";

describe("BodyScrollLock", () => {
	it.each(["unavailable", "replaced"])(
		"restores the original body when the global document is %s before delayed cleanup",
		async (scenario) => {
			const originalDocument = document;
			const originalStyle = document.body.getAttribute("style");
			const replacementDocument = document.implementation.createHTMLDocument();
			replacementDocument.body.style.color = "blue";
			const replacementStyle = replacementDocument.body.getAttribute("style");
			originalDocument.body.style.cssText = "color: red; overflow: auto;";
			const initialStyle = originalDocument.body.getAttribute("style");
			let destroy: (() => void) | undefined;

			try {
				destroy = $effect.root(() => {
					new BodyScrollLock(true);
				});
				flushSync();
				await tick();
				expect(originalDocument.body.style.overflow).toBe("hidden");

				vi.useFakeTimers();
				const setTimeout = vi.spyOn(window, "setTimeout");
				destroy();
				destroy = undefined;
				const cleanup = setTimeout.mock.calls.find(([, delay]) => delay === 24)?.[0];
				expect(cleanup).toBeTypeOf("function");
				if (typeof cleanup !== "function") throw new Error("Missing delayed cleanup");
				vi.clearAllTimers();
				vi.stubGlobal(
					"document",
					scenario === "unavailable" ? undefined : replacementDocument
				);

				expect(() => cleanup()).not.toThrow();
				expect(originalDocument.body.getAttribute("style")).toBe(initialStyle);
				expect(originalDocument.body.style.getPropertyValue("--scrollbar-width")).toBe("");
				expect(replacementDocument.body.getAttribute("style")).toBe(replacementStyle);
			} finally {
				vi.unstubAllGlobals();
				destroy?.();
				vi.clearAllTimers();
				vi.restoreAllMocks();
				vi.useRealTimers();
				if (originalStyle === null) originalDocument.body.removeAttribute("style");
				else originalDocument.body.setAttribute("style", originalStyle);
			}
		}
	);
});
