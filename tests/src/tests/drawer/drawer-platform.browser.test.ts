import { page } from "vitest/browser";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import DrawerKeyboardTest from "./drawer-keyboard-test.svelte";
import DrawerTouchIntentTest from "./drawer-touch-intent-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

describe("Virtual keyboard provider", () => {
	it.each([undefined, false, true])(
		"only opts into viewport handling when enabled=%s",
		async (enabled) => {
			const viewport = window.visualViewport!;
			const height = vi.spyOn(viewport, "height", "get");
			await render(DrawerKeyboardTest, { enabled });
			height.mockReturnValue(window.innerHeight - 300);
			viewport.dispatchEvent(new Event("resize"));
			const node = page.getByTestId("viewport").element() as HTMLElement;
			await expect
				.poll(() => node.style.getPropertyValue("--drawer-keyboard-inset"))
				.toBe(enabled === true ? "300px" : "0px");
			if (enabled) {
				(page.getByTestId("disable-keyboard").element() as HTMLElement).click();
				await expect
					.poll(() => node.style.getPropertyValue("--drawer-keyboard-inset"))
					.toBe("0px");
				viewport.dispatchEvent(new Event("resize"));
				await tick();
				expect(node.style.getPropertyValue("--drawer-keyboard-inset")).toBe("0px");
			}
			height.mockRestore();
		}
	);
});

it("lets only the frontmost Android CloseWatcher close and supports cancellation", async () => {
	vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue("Android");
	class CloseWatcher extends EventTarget {
		static instances: CloseWatcher[] = [];
		destroyed = false;
		constructor() {
			super();
			CloseWatcher.instances.push(this);
		}
		destroy() {
			this.destroyed = true;
		}
	}
	vi.stubGlobal("CloseWatcher", CloseWatcher);
	let cancel = true;
	await render(DrawerTouchIntentTest, {
		nestedOnOpenChange: (open, details) => {
			if (!open && cancel) details.cancel();
		},
	});
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("popup"));
	await page.getByTestId("nested-trigger").click();
	await expectExists(page.getByTestId("nested-popup"));
	expect(CloseWatcher.instances[0]?.destroyed).toBe(true);
	const watcher = CloseWatcher.instances.at(-1)!;
	const event = new Event("cancel", { cancelable: true });
	watcher.dispatchEvent(event);
	expect(event.defaultPrevented).toBe(true);
	await expectExists(page.getByTestId("nested-popup"));
	cancel = false;
	watcher.dispatchEvent(new Event("cancel", { cancelable: true }));
	await expectNotExists(page.getByTestId("nested-popup"));
	await expectExists(page.getByTestId("popup"));
	expect(watcher.destroyed).toBe(true);
	CloseWatcher.instances.at(-1)!.dispatchEvent(new Event("cancel", { cancelable: true }));
	await expectNotExists(page.getByTestId("popup"));
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});
