import { userEvent, type Locator } from "@vitest/browser/context";
import { expect, onTestFinished, vi } from "vitest";
import { sleep } from "./utils";

export async function expectNotClickable(node: Element | HTMLElement | Locator) {
	const user = setupBrowserUserEvents();
	await expect(user.click(node, { timeout: 100 })).rejects.toThrow();
}

export async function expectNotExists(loc: Locator) {
	await vi.waitFor(() => expect(() => loc.element()).toThrow());
}

export async function expectExists(loc: Locator) {
	await vi.waitFor(() => expect(loc.element()).toBeInTheDocument());
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

const defaultClickOpts = {
	force: true,
};

export function setupBrowserUserEvents() {
	const user = userEvent.setup();
	onTestFinished(async () => await user.cleanup());

	const originalClick = user.click;
	const originalKeyboard = user.keyboard;

	user.click = async (element, opts) => {
		await originalClick(element, { ...defaultClickOpts, ...opts });
		await sleep(20);
	};

	user.keyboard = async (text) => {
		await originalKeyboard(text);
		await sleep(20);
	};

	return user;
}
