import { userEvent, type Locator } from "@vitest/browser/context";
import { expect } from "vitest";

export async function expectNotClickable(node: Element | HTMLElement | Locator) {
	await expect(userEvent.click(node, { timeout: 100 })).rejects.toThrow();
}

export async function expectClickIntercepted(node: Element | HTMLElement | Locator) {
	// for elements that are intercepted by pointer events (like overlays),
	// we test that the click action times out due to interception
	await expect(userEvent.click(node, { timeout: 100 })).rejects.toThrow();
}

export async function simulateOutsideClick(node: Element | HTMLElement | Locator) {
	// simulate an outside click by dispatching the event directly
	// this bypasses pointer event interception
	const element = "element" in node ? node.element() : node;

	// dispatch mousedown, mouseup, and click events
	element.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
	element.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
	element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
