import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import DrawerTest, { type DrawerTestProps } from "./drawer-test.svelte";
import DrawerTetherTest from "./drawer-tether-test.svelte";
import DrawerTetherControlledTest from "./drawer-tether-controlled-test.svelte";
import DrawerTouchIntentTest from "./drawer-touch-intent-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { getTestKbd } from "../utils.js";

const kbd = getTestKbd();

async function setup(props: DrawerTestProps = {}) {
	const t = render(DrawerTest, { ...props });
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
	render(DrawerTouchIntentTest);
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
	} catch {}
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
		(page.getByTestId("backdrop").element() as HTMLDivElement).click();
		await expectNotExists(page.getByTestId("popup"));
	});
});

describe("Tether", () => {
	it("should work with detached triggers through tether", async () => {
		render(DrawerTetherTest);
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
		render(DrawerTetherTest);

		await page.getByTestId("tether-open-top").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

		await page.getByTestId("tether-open-bottom").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Bottom");
		await expect
			.element(page.getByTestId("trigger-binding"))
			.toHaveTextContent("trigger-bottom");

		await page.getByTestId("tether-close").click();
		await expectNotExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	});

	it("should no-op when tether.open is called with an unregistered trigger id", async () => {
		render(DrawerTetherTest);

		await page.getByTestId("tether-open-invalid").click();
		await expectNotExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	});

	it("should open with payload only via tether.openWithPayload", async () => {
		render(DrawerTetherTest);

		await page.getByTestId("tether-open-with-payload").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Solo");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("null");
		await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

		await page.getByTestId("close").click();
		await expectNotExists(page.getByTestId("popup"));
	});

	it("should support controlled bind:triggerId with programmatic open", async () => {
		render(DrawerTetherControlledTest);

		await page.getByTestId("open-trigger-1").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("One");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-1");

		await page.getByTestId("open-trigger-2").click();
		await expectExists(page.getByTestId("popup"));
		await expect.element(page.getByTestId("payload")).toHaveTextContent("Two");
		await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-2");

		await page.getByTestId("set-null-trigger").click();
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
