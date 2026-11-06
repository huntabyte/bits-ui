import { page, userEvent } from "vitest/browser";
import { describe, expect, it, vi } from "vitest";
import { tick } from "svelte";
import { render } from "vitest-browser-svelte";
import DrawerTest, { type DrawerTestProps } from "./drawer-test.svelte";
import DrawerTetherTest from "./drawer-tether-test.svelte";
import DrawerTetherControlledTest from "./drawer-tether-controlled-test.svelte";
import DrawerTouchIntentTest from "./drawer-touch-intent-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { getTestKbd } from "../utils.js";

const kbd = getTestKbd();

function isCaptureEventListenerOption(
	options:
		| Parameters<Document["addEventListener"]>[2]
		| Parameters<Document["removeEventListener"]>[2]
): boolean {
	if (typeof options === "boolean") return options;
	return options?.capture === true;
}

function clickInFlowButtonWhileDrawerOpen(testId: string): void {
	(page.getByTestId(testId).element() as HTMLButtonElement).click();
}

async function setup(props: DrawerTestProps = {}) {
	const t = await render(DrawerTest, { ...props });
	const trigger = page.getByTestId("trigger");

	return {
		...t,
		trigger,
	};
}

async function open(props: DrawerTestProps = {}) {
	const t = await setup(props);
	await expectNotExists(page.getByTestId("popup"));
	await t.trigger.click();
	await expectExists(page.getByTestId("popup"));
	return t;
}

async function openTouchIntentFixture() {
	await render(DrawerTouchIntentTest);
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("popup"));
}

function createTouchPayload(target: EventTarget, point: { clientX: number; clientY: number }) {
	return {
		identifier: 1,
		target,
		...point,
		pageX: point.clientX,
		pageY: point.clientY,
		screenX: point.clientX,
		screenY: point.clientY,
		radiusX: 1,
		radiusY: 1,
		rotationAngle: 0,
		force: 1,
	};
}

function createTouchEvent(
	type: "touchstart" | "touchmove" | "touchend",
	touches: unknown[],
	changedTouches: unknown[]
) {
	const event = new Event(type, { bubbles: true, cancelable: true });
	if (typeof TouchEvent === "function") {
		Object.setPrototypeOf(event, TouchEvent.prototype);
	}
	try {
		Object.defineProperty(event, "touches", {
			value: touches,
			configurable: true,
		});
		Object.defineProperty(event, "changedTouches", {
			value: changedTouches,
			configurable: true,
		});
		Object.defineProperty(event, "targetTouches", {
			value: touches,
			configurable: true,
		});
	} catch {
		// noop
	}
	return event;
}

function dispatchSyntheticTouchSequence(
	target: HTMLElement,
	options: {
		start: { clientX: number; clientY: number };
		move?: { clientX: number; clientY: number };
		end?: { clientX: number; clientY: number };
		emitClick?: boolean;
		observeElement?: HTMLElement;
	}
) {
	const { start, move, end = move ?? start, emitClick = false, observeElement } = options;
	const originalElementFromPoint = document.elementFromPoint;
	let observedAfterMove = false;

	document.elementFromPoint = () => target;

	try {
		const startTouch = createTouchPayload(target, start);
		target.dispatchEvent(createTouchEvent("touchstart", [startTouch], [startTouch]));

		if (move) {
			const moveTouch = createTouchPayload(target, move);
			target.dispatchEvent(createTouchEvent("touchmove", [moveTouch], [moveTouch]));
			observedAfterMove = observeElement?.hasAttribute("data-swiping") ?? false;
		}

		const endTouch = createTouchPayload(target, end);
		target.dispatchEvent(createTouchEvent("touchend", [], [endTouch]));

		if (emitClick) {
			target.dispatchEvent(
				new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					detail: 1,
					clientX: end.clientX,
					clientY: end.clientY,
				})
			);
		}
	} finally {
		document.elementFromPoint = originalElementFromPoint;
	}

	return { observedAfterMove };
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		await open();
		const parts = [
			"trigger",
			"backdrop",
			"viewport",
			"popup",
			"content",
			"title",
			"description",
			"close",
		];
		for (const part of parts) {
			const el = page.getByTestId(part);
			await expect.element(el).toHaveAttribute(`data-drawer-${part}`);
		}
	});

	it("should expose expected state attrs", async () => {
		await open();
		await expect.element(page.getByTestId("popup")).toHaveAttribute("data-state", "open");
		await expect.element(page.getByTestId("backdrop")).toHaveAttribute("data-state", "open");
	});
});

describe("Open/Close Behavior", () => {
	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the close button is clicked", async () => {
		await open();
		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));
	});

	it("should close when escape is pressed", async () => {
		await open();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("popup"));
	});

	it("should close when the backdrop is clicked", async () => {
		await open();
		await page.getByTestId("backdrop").click({ position: { x: 20, y: 20 } });
		await expectNotExists(page.getByTestId("popup"));
	});

	it.each(["close", "unmount"])(
		"cleans up document touchmove capture listeners on %s",
		async (action) => {
			const trackedTouchmoveListeners = new Set<EventListenerOrEventListenerObject | null>();
			const originalAddEventListener = Document.prototype.addEventListener;
			const originalRemoveEventListener = Document.prototype.removeEventListener;

			const addEventListenerSpy = vi
				.spyOn(Document.prototype, "addEventListener")
				.mockImplementation(function (
					...args: Parameters<Document["addEventListener"]>
				): void {
					const [type, listener, options] = args;
					if (type === "touchmove" && isCaptureEventListenerOption(options)) {
						trackedTouchmoveListeners.add(listener);
					}
					// @ts-expect-error - this is a mock
					originalAddEventListener.call(this, ...args);
				});

			const removeEventListenerSpy = vi
				.spyOn(Document.prototype, "removeEventListener")
				.mockImplementation(function (
					...args: Parameters<Document["removeEventListener"]>
				): void {
					const [type, listener, options] = args;
					if (type === "touchmove" && isCaptureEventListenerOption(options)) {
						trackedTouchmoveListeners.delete(listener);
					}
					// @ts-expect-error - this is a mock
					originalRemoveEventListener.call(this, ...args);
				});

			try {
				const drawer = await open();
				expect(trackedTouchmoveListeners.size).toBeGreaterThan(0);

				if (action === "close") {
					await page.getByTestId("close").click();
				} else {
					await drawer.unmount();
				}
				await expectNotExists(page.getByTestId("popup"));

				expect(trackedTouchmoveListeners.size).toBe(0);
			} finally {
				addEventListenerSpy.mockRestore();
				removeEventListenerSpy.mockRestore();
			}
		}
	);
});

describe("Tether", () => {
	it("should work with detached triggers through tether", async () => {
		await render(DrawerTetherTest);
		const triggerTop = page.getByTestId("trigger-top");
		const triggerBottom = page.getByTestId("trigger-bottom");

		await triggerTop.click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-top");

		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));

		await triggerBottom.click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Bottom");
		await expect
			.element(page.getByTestId("trigger-binding"))
			.toHaveTextContent("trigger-bottom");

		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));
	});

	it("should support imperative tether open/close", async () => {
		await render(DrawerTetherTest);

		await page.getByTestId("tether-open-top").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

		clickInFlowButtonWhileDrawerOpen("tether-open-bottom");
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Bottom");
		await expect
			.element(page.getByTestId("trigger-binding"))
			.toHaveTextContent("trigger-bottom");

		clickInFlowButtonWhileDrawerOpen("tether-close");
		await expectNotExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	});

	it("should no-op when tether.open is called with an unregistered trigger id", async () => {
		await render(DrawerTetherTest);

		await page.getByTestId("tether-open-invalid").click();
		await expectNotExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	});

	it("should open with payload only via tether.openWithPayload", async () => {
		await render(DrawerTetherTest);

		await page.getByTestId("tether-open-with-payload").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Solo");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("null");
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));
	});

	it("should support controlled bind:triggerId with programmatic open", async () => {
		await render(DrawerTetherControlledTest);

		await page.getByTestId("open-trigger-1").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("One");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-1");

		clickInFlowButtonWhileDrawerOpen("open-trigger-2");
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Two");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-2");

		clickInFlowButtonWhileDrawerOpen("set-null-trigger");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("null");

		await page.getByTestId("popup").getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	});
});

describe("Portal Behavior", () => {
	it("should portal to body when using portal element", async () => {
		await open();
		const viewport = page.getByTestId("viewport").element();
		expect(viewport.parentElement).toEqual(document.body);
	});

	it("should not portal to body when portal is disabled", async () => {
		await open({
			portalProps: { disabled: true },
		});
		const popup = page.getByTestId("popup").element();
		expect(popup.parentElement).not.toEqual(document.body);
	});
});

describe("Touch Intent", () => {
	it("lets scrollable content keep a swipe until it reaches the dismissal edge", async () => {
		await open({ scrollable: true });
		const content = page.getByTestId("content").element() as HTMLElement;
		const backdrop = page.getByTestId("backdrop").element() as HTMLElement;
		const { x, y } = content.getBoundingClientRect();
		const swipe = {
			start: { clientX: x + 10, clientY: y + 10 },
			move: { clientX: x + 10, clientY: y + 50 },
			observeElement: backdrop,
		};
		content.scrollTop = 80;
		expect(dispatchSyntheticTouchSequence(content, swipe).observedAfterMove).toBe(false);
		await expectExists(page.getByTestId("popup"));

		content.scrollTop = 0;
		expect(dispatchSyntheticTouchSequence(content, swipe).observedAfterMove).toBe(true);
	});

	it("treats tiny touch movement on buttons as a tap", async () => {
		await openTouchIntentFixture();
		const button = page.getByTestId("generic-button").element() as HTMLElement;
		const backdrop = page.getByTestId("backdrop").element() as HTMLElement;

		const { observedAfterMove } = dispatchSyntheticTouchSequence(button, {
			start: { clientX: 24, clientY: 24 },
			move: { clientX: 26, clientY: 26 },
			emitClick: true,
			observeElement: backdrop,
		});

		expect(observedAfterMove).toBe(false);
		await expect.element(page.getByTestId("backdrop")).not.toHaveAttribute("data-swiping");
	});

	it("starts swipe from buttons when touch movement is meaningful", async () => {
		await openTouchIntentFixture();
		const button = page.getByTestId("generic-button").element() as HTMLElement;
		const backdrop = page.getByTestId("backdrop").element() as HTMLElement;

		const { observedAfterMove } = dispatchSyntheticTouchSequence(button, {
			start: { clientX: 24, clientY: 24 },
			move: { clientX: 24, clientY: 44 },
			observeElement: backdrop,
		});

		expect(observedAfterMove).toBe(true);
	});

	it("allows nested trigger touch taps with tiny movement", async () => {
		await openTouchIntentFixture();
		const nestedTrigger = page.getByTestId("nested-trigger").element() as HTMLElement;
		const backdrop = page.getByTestId("backdrop").element() as HTMLElement;

		const { observedAfterMove } = dispatchSyntheticTouchSequence(nestedTrigger, {
			start: { clientX: 32, clientY: 32 },
			move: { clientX: 34, clientY: 34 },
			emitClick: true,
			observeElement: backdrop,
		});

		expect(observedAfterMove).toBe(false);
		await expectExists(page.getByTestId("nested-popup"));
	});

	it("starts swipe from inputs when touch movement is meaningful", async () => {
		await openTouchIntentFixture();
		const input = page.getByTestId("text-input").element() as HTMLElement;
		const backdrop = page.getByTestId("backdrop").element() as HTMLElement;

		const { observedAfterMove } = dispatchSyntheticTouchSequence(input, {
			start: { clientX: 36, clientY: 36 },
			move: { clientX: 36, clientY: 56 },
			observeElement: backdrop,
		});

		expect(observedAfterMove).toBe(true);
	});
});

describe("Focus and modality", () => {
	it("labels the dialog and keeps keyboard focus inside until it closes", async () => {
		const { trigger } = await setup();
		(trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		const popup = page.getByRole("dialog", { name: "title" });
		await expect
			.element(popup)
			.toHaveAttribute("aria-describedby", page.getByTestId("description").element().id);
		await expect.element(popup).toHaveFocus();

		await userEvent.tab();
		await expect.element(page.getByTestId("close")).toHaveFocus();
		await userEvent.tab({ shift: true });
		await expect.element(page.getByTestId("open-focus-override")).toHaveFocus();

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(popup);
		await expect.element(trigger).toHaveFocus();
	});

	it("allows interaction outside a non-modal drawer", async () => {
		const { trigger } = await open({
			popupProps: {
				trapFocus: false,
				preventScroll: false,
				interactOutsideBehavior: "ignore",
			},
		});
		const popup = page.getByRole("dialog", { name: "title" });
		await expect.element(popup).not.toHaveAttribute("aria-modal");
		const outside = page.getByTestId("close-focus-override").element() as HTMLButtonElement;
		outside.focus();
		await expect.element(outside).toHaveFocus();
		await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
	});

	it("dismisses the nested drawer first and clears the parent stack state", async () => {
		await openTouchIntentFixture();
		const popup = page.getByTestId("popup");
		const nestedTrigger = page.getByTestId("nested-trigger");
		(nestedTrigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		await expectExists(page.getByTestId("nested-popup"));
		await expect.element(popup).toHaveAttribute("data-nested-drawer-stacked");

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("nested-popup"));
		await expect.element(popup).not.toHaveAttribute("data-nested-drawer-stacked");
		await expect.element(nestedTrigger).toHaveFocus();
	});
});

describe("Swipe and snap behavior", () => {
	async function drag(target: Element, dx: number, dy: number) {
		const { x, y, width, height } = target.getBoundingClientRect();
		const startX = x + width / 2;
		const startY = y + height / 2;
		let timeStamp = 100;
		function dispatch(type: string, progress: number) {
			const event = new PointerEvent(type, {
				pointerId: 1,
				pointerType: "mouse",
				isPrimary: true,
				bubbles: true,
				cancelable: true,
				buttons: type === "pointerup" ? 0 : 1,
				clientX: startX + dx * progress,
				clientY: startY + dy * progress,
			});
			// Keep the release velocity independent of the browser's scheduling.
			Object.defineProperty(event, "timeStamp", { value: timeStamp });
			timeStamp += 8;
			target.dispatchEvent(event);
		}

		dispatch("pointerdown", 0);
		for (const progress of [0.05, 0.5, 1]) {
			dispatch("pointermove", progress);
			await tick();
		}
		dispatch("pointerup", 1);
	}

	it.each([
		["down", 0, 120],
		["up", 0, -120],
		["left", -120, 0],
		["right", 120, 0],
	] as const)("dismisses in the %s direction", async (swipeDirection, dx, dy) => {
		await open({ swipeDirection, popupProps: { style: "width: 240px; height: 200px;" } });
		const popup = page.getByTestId("popup");
		const surface = page.getByTestId("swipe-surface").element();
		await drag(surface, -dx, -dy);
		await expectExists(popup);
		await drag(surface, dx, dy);
		await expectNotExists(popup);
	});

	it("opens from the bottom swipe area with an upward gesture", async () => {
		await setup();
		await drag(page.getByTestId("swipe-area").element(), 0, -160);
		await expectExists(page.getByTestId("popup"));
	});

	it("settles at the nearest snap point and honors a bound snap point", async () => {
		const onSnapPointChange = vi.fn();
		await open({
			snapPoints: ["80px", "160px", 1],
			snapPoint: "80px",
			snapToSequentialPoints: true,
			onSnapPointChange,
			popupProps: { style: "height: 320px;" },
		});
		const popup = page.getByTestId("popup");
		const snapPoint = page.getByTestId("snap-point");
		await expect.element(snapPoint).toHaveTextContent("80px");
		await drag(page.getByTestId("swipe-surface").element(), 0, -85);
		await expect.element(snapPoint).toHaveTextContent("160px");
		expect(onSnapPointChange).toHaveBeenLastCalledWith("160px");

		await page.getByTestId("expand").click();
		await expect.element(popup).toHaveAttribute("data-expanded");
	});

	it("projects a fast release to a further snap point by default", async () => {
		await open({
			snapPoints: ["80px", "160px", 1],
			snapPoint: "80px",
			popupProps: { style: "height: 320px;" },
		});
		await drag(page.getByTestId("swipe-surface").element(), 0, -85);
		await expect.element(page.getByTestId("snap-point")).toHaveTextContent("1");
	});
});

it("keeps the popup mounted through its exit transition", async () => {
	const onOpenChangeComplete = vi.fn();
	await open({ onOpenChangeComplete, exitTransition: true });
	const popup = page.getByTestId("popup");
	await expect.poll(() => onOpenChangeComplete.mock.lastCall).toEqual([true]);

	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(popup).toHaveAttribute("data-ending-style");
	expect(onOpenChangeComplete).not.toHaveBeenCalledWith(false);
	await expectNotExists(popup);
	expect(onOpenChangeComplete.mock.calls).toEqual([[true], [false]]);
});
