import { fireEvent } from "@testing-library/svelte";
import type { UserEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import { sleep, type CustomUserEvents } from "./utils";

export function mockElementBounds(element: HTMLElement, bounds: Partial<DOMRect> = {}) {
	const defaultBounds = {
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		bottom: 100,
		right: 100,
		width: 100,
		height: 100,
		toJSON: () => ({}),
	};

	element.getBoundingClientRect = vi.fn(() => ({
		...defaultBounds,
		...bounds,
	}));
}

/**
 * Setup elements with proper bounds for outside click testing
 * @param contentElement - The popover/modal content element
 * @param triggerElement - The trigger element (optional)
 * @param outsideElement - The element to click outside (optional)
 */
export function setupOutsideClickTest(
	contentElement: HTMLElement,
	triggerElement?: HTMLElement,
	outsideElement?: HTMLElement
) {
	mockElementBounds(contentElement, {
		top: 100,
		left: 100,
		bottom: 300,
		right: 300,
		width: 200,
		height: 200,
	});

	if (triggerElement) {
		mockElementBounds(triggerElement, {
			top: 50,
			left: 50,
			bottom: 90,
			right: 150,
			width: 100,
			height: 40,
		});
	}

	if (outsideElement) {
		mockElementBounds(outsideElement, {
			top: 400,
			left: 400,
			bottom: 500,
			right: 500,
			width: 100,
			height: 100,
		});
	}
}

/**
 * Simulates an outside click with proper event sequence
 * @param element - The element to click
 * @param user - The userEvent instance
 */
export async function clickOutside(element: HTMLElement, user: UserEvent | CustomUserEvents) {
	// first ensure the element has proper bounds
	if (!element.getBoundingClientRect().width) {
		mockElementBounds(element, {
			top: 400,
			left: 400,
			bottom: 500,
			right: 500,
			width: 100,
			height: 100,
		});
	}

	// simulate the full click sequence
	await user.pointer([
		{ target: element, coords: { x: 450, y: 450 }, keys: "[MouseLeft>]" },
		{ target: element, coords: { x: 450, y: 450 }, keys: "[/MouseLeft]" },
	]);

	// also fire a direct click event as a fallback
	// this helps with some edge cases where pointer events aren't enough
	fireEvent.click(element, {
		bubbles: true,
		cancelable: true,
		clientX: 450,
		clientY: 450,
	});
}

/**
 * Helper to test outside click behavior
 * @param getContent - Function that returns the content element (can be null)
 * @param outsideElement - The element to click outside
 * @param user - The userEvent instance
 * @param onInteractOutside - Optional callback to track if outside click was detected
 */
export async function testOutsideClick(
	getContent: () => HTMLElement | null,
	outsideElement: HTMLElement,
	user: UserEvent | CustomUserEvents,
	onInteractOutside?: typeof vi.fn
) {
	const content = getContent();
	expect(content).not.toBeNull();

	if (content) {
		setupOutsideClickTest(content, undefined, outsideElement);
	}

	await clickOutside(outsideElement, user);

	// wait a bit for any async handlers
	await sleep(100);

	if (onInteractOutside) {
		expect(onInteractOutside).toHaveBeenCalledOnce();
	}

	// content should be closed / null
	expect(getContent()).toBeNull();
}

/**
 * Helper to test that clicking inside content doesn't close it
 * @param content - The content element
 * @param user - The userEvent instance
 * @param onInteractOutside - Optional callback that should NOT be called
 */
export async function testInsideClick(
	content: HTMLElement,
	user: UserEvent | CustomUserEvents,
	onInteractOutside?: typeof vi.fn
) {
	setupOutsideClickTest(content);

	// click inside the content bounds
	await user.pointer([
		{ target: content, coords: { x: 150, y: 150 }, keys: "[MouseLeft>]" },
		{ target: content, coords: { x: 150, y: 150 }, keys: "[/MouseLeft]" },
	]);

	// wait a bit for any async handlers
	await sleep(100);

	if (onInteractOutside) {
		expect(onInteractOutside).not.toHaveBeenCalled();
	}
}

/**
 * Sets up a mock for document.elementFromPoint
 */
export function mockElementFromPoint(contentElement: HTMLElement, outsideElement?: HTMLElement) {
	const originalElementFromPoint = document.elementFromPoint;

	document.elementFromPoint = vi.fn((x: number, y: number) => {
		// if clicking within content bounds, return content or its child
		if (x >= 100 && x <= 300 && y >= 100 && y <= 300) return contentElement;
		// if we have an outside element and clicking in its bounds
		if (outsideElement && x >= 400 && x <= 500 && y >= 400 && y <= 500) return outsideElement;
		// otherwise, return document body
		return document.body;
	});

	return () => {
		document.elementFromPoint = originalElementFromPoint;
	};
}
