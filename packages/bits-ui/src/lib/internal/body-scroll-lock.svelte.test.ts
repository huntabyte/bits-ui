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

	async function withScrollLock(
		testFn: (helpers: { unlock: () => void }) => void | Promise<void>,
		options?: { setup?: () => void }
	) {
		const originalStyle = document.body.getAttribute("style");
		let destroy: (() => void) | undefined;

		try {
			options?.setup?.();

			vi.useFakeTimers();
			const setTimeout = vi.spyOn(window, "setTimeout");

			destroy = $effect.root(() => {
				new BodyScrollLock(true);
			});
			flushSync();
			await tick();

			const unlock = () => {
				if (!destroy) return;

				destroy();
				destroy = undefined;

				const cleanup = setTimeout.mock.calls.find(([, delay]) => delay === 24)?.[0];
				expect(cleanup).toBeTypeOf("function");
				cleanup?.();
			};

			await testFn({ unlock });
		} finally {
			destroy?.();
			vi.clearAllTimers();
			vi.restoreAllMocks();
			vi.useRealTimers();
			if (originalStyle === null) document.body.removeAttribute("style");
			else document.body.setAttribute("style", originalStyle);
		}
	}

	it("preserves unrelated body styles added while the scroll lock is active", async () => {
		await withScrollLock(({ unlock }) => {
			expect(document.body.style.overflow).toBe("hidden");

			// An external component (e.g. toast, theme, modal) mutates body styles while lock is active:
			document.body.style.setProperty("--app-toast-offset", "48px");
			document.body.style.backgroundColor = "blue";

			unlock();

			expect(document.body.style.overflow).toBe("");
			expect(document.body.style.getPropertyValue("--app-toast-offset")).toBe("48px");
			expect(document.body.style.backgroundColor).toBe("blue");
		});
	});

	it("restores body styles without relying on setAttribute('style')", async () => {
		const originalSetAttribute = document.body.setAttribute.bind(document.body);
		vi.spyOn(document.body, "setAttribute").mockImplementation((name, value) => {
			// Simulates environments where style attribute mutation is blocked,
			// such as Chromium with a restrictive style-src-attr CSP.
			if (name === "style") return;
			originalSetAttribute(name, value);
		});

		await withScrollLock(({ unlock }) => {
			expect(document.body.style.overflow).toBe("hidden");

			unlock();

			// If cleanup relies solely on setAttribute("style"), this will fail because setAttribute was blocked
			expect(document.body.style.overflow).toBe("");
			expect(document.body.style.pointerEvents).toBe("");
		});
	});

	it("does not restore lock properties that were not modified by the lock", async () => {
		// Simulate an environment with no scrollbar to compensate (verticalScrollbarWidth === 0)
		vi.spyOn(window, "innerWidth", "get").mockReturnValue(document.documentElement.clientWidth);

		await withScrollLock(({ unlock }) => {
			expect(document.body.style.overflow).toBe("hidden");

			// When scrollbar compensation is not active (e.g. verticalScrollbarWidth === 0),
			// Bits UI does not modify padding-right or margin-right.
			// An external component mutates padding-right while the lock is active:
			document.body.style.paddingRight = "24px";

			unlock();

			// Overflow should be reset:
			expect(document.body.style.overflow).toBe("");
			// But paddingRight was never modified by the lock, so it must not be rolled back:
			expect(document.body.style.paddingRight).toBe("24px");
		});
	});

	it("preserves style priority (!important) when restoring", async () => {
		await withScrollLock(
			({ unlock }) => {
				expect(document.body.style.overflow).toBe("hidden");

				unlock();

				expect(document.body.style.getPropertyValue("overflow")).toBe("auto");
				expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
			},
			{
				setup: () => {
					document.body.style.setProperty("overflow", "auto", "important");
					expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
				},
			}
		);
	});
});
