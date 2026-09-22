import { afterEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "@vitest/browser/context";
import TextSelectionLayerTest from "./text-selection-layer-test.svelte";
import PopoverForceMountTest from "../popover/popover-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

function getBodyUserSelect() {
	return document.body.style.userSelect;
}

function getLayerCount() {
	return (
		(globalThis as { bitsTextSelectionLayers?: Map<unknown, unknown> }).bitsTextSelectionLayers
			?.size ?? -1
	);
}

afterEach(() => {
	// don't let a failing assertion strand the lock for the next test in the file
	document.body.style.userSelect = "";
	document.body.style.webkitUserSelect = "";
});

describe("text selection layer", () => {
	it("should lock body text selection for the duration of a press inside the content", async () => {
		render(TextSelectionLayerTest);
		await page.getByTestId("trigger").click();
		const content = page.getByTestId("content");
		await expectExists(content);
		const contentEl = content.element() as HTMLElement;

		contentEl.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
		expect(getBodyUserSelect()).toBe("none");

		contentEl.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, composed: true }));
		expect(getBodyUserSelect()).toBe("");
	});
});

describe("text selection layer, force-mounted content", () => {
	// `forceMount` re-runs the layer's `watch` several times while `enabled` stays `true`, and
	// after that listener churn the document `pointerdown` handler runs twice for a single
	// event. The press re-arms the lock over itself and snapshots the `none` it just wrote, so
	// the release restores `none` and `<body>` stays locked.
	it("should not strand `user-select` after open + close", async () => {
		render(PopoverForceMountTest, { withOpenCheck: true });

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("content"));

		expect(getLayerCount()).toBe(0);
		expect(getBodyUserSelect()).toBe("");
	});

	it("should restore the body lock when a single press arms it twice", async () => {
		render(PopoverForceMountTest, { withOpenCheck: true });

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		const target = page.getByTestId("content-text").element() as HTMLElement;
		target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
		expect(getBodyUserSelect()).toBe("none");

		target.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, composed: true }));
		expect(getBodyUserSelect()).toBe("");
	});
});
