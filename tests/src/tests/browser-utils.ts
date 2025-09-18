import { userEvent, type Locator } from "@vitest/browser/context";
import { expect, onTestFinished, vi } from "vitest";
import { sleep } from "./utils";

export async function expectNotClickableLoc(loc: Locator) {
	await expect(loc.click()).rejects.toThrow();
}

export async function expectNotExists(loc: Locator) {
	await vi.waitFor(() => expect(() => loc.element()).toThrow());
}

export async function expectExists(loc: Locator) {
	await expect.element(loc).toBeInTheDocument();
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

export async function focusAndExpectToHaveFocus(loc: Locator) {
	(loc.element() as HTMLElement).focus();
	await expect.element(loc).toHaveFocus();
}
