import { page } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import TouchOutsideStopPropagationTest from "./touch-outside-stop-propagation-test.svelte";
import { expectExists, expectNotExists, waitForDismissibleLayer } from "../browser-utils";

function dispatch(target: Element, type: "pointerdown" | "pointerup" | "click") {
	const EventType = type.startsWith("pointer") ? PointerEvent : MouseEvent;
	const rect = target.getBoundingClientRect();
	target.dispatchEvent(
		new EventType(type, {
			bubbles: true,
			composed: true,
			cancelable: true,
			clientX: rect.left + rect.width / 2,
			clientY: rect.top + rect.height / 2,
			button: 0,
			buttons: type === "pointerdown" ? 1 : 0,
			pointerType: "touch",
		})
	);
}

describe("dismissible layer - touch outside click", () => {
	it("dismisses on a tap whose target stops click propagation", async () => {
		const onInteractOutside = vi.fn();
		render(TouchOutsideStopPropagationTest, { onInteractOutside });
		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));
		await waitForDismissibleLayer(page.getByTestId("content"));
		const target = page.getByTestId("outside-stop").element();

		// a finger lands: the layer arms its one-shot click listener after a short
		// debounce, and nothing is dismissed yet (it may be the start of a scroll)
		dispatch(target, "pointerdown");
		await new Promise((resolve) => setTimeout(resolve, 30));
		expect(onInteractOutside).not.toHaveBeenCalled();
		await expectExists(page.getByTestId("content"));

		// the finger lifts: pointerup, then the click the target swallows
		dispatch(target, "pointerup");
		dispatch(target, "click");

		await expect.poll(() => onInteractOutside.mock.calls.length).toBe(1);
		await expectNotExists(page.getByTestId("content"));
		// the capture-phase backup runs as a task; it must not dismiss a second time
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(onInteractOutside).toHaveBeenCalledTimes(1);
	});
});
