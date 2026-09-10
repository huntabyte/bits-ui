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

	it("restores the body through the CSSOM so a CSP without style-src 'unsafe-inline' cannot block it", async () => {
		const originalStyle = document.body.getAttribute("style");
		document.body.style.cssText = "color: red;";
		const initialStyle = document.body.getAttribute("style");
		// Under such a CSP, `setAttribute("style", ...)` is silently ignored (and
		// reported as a violation) while CSSOM writes still apply. Emulate that.
		const setAttribute = vi.spyOn(document.body, "setAttribute").mockImplementation(function (
			this: HTMLElement,
			name: string,
			value: string
		) {
			if (name === "style") return;
			return HTMLElement.prototype.setAttribute.call(this, name, value);
		});
		let destroy: (() => void) | undefined;

		try {
			vi.useFakeTimers();
			destroy = $effect.root(() => {
				new BodyScrollLock(true);
			});
			flushSync();
			await vi.runAllTimersAsync();
			expect(document.body.style.overflow).toBe("hidden");
			expect(document.body.style.pointerEvents).toBe("none");

			destroy();
			destroy = undefined;
			await vi.runAllTimersAsync();

			expect(setAttribute).not.toHaveBeenCalledWith("style", expect.anything());
			expect(document.body.style.overflow).toBe("");
			expect(document.body.style.pointerEvents).toBe("");
			expect(document.body.getAttribute("style")).toBe(initialStyle);
			expect(document.body.style.getPropertyValue("--scrollbar-width")).toBe("");
		} finally {
			destroy?.();
			vi.clearAllTimers();
			vi.restoreAllMocks();
			vi.useRealTimers();
			if (originalStyle === null) document.body.removeAttribute("style");
			else document.body.setAttribute("style", originalStyle);
		}
	});
});
