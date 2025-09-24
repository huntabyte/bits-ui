import { type Locator } from "@vitest/browser/context";
import { expect, vi } from "vitest";

export async function expectNotClickableLoc(loc: Locator) {
	await expect(loc.click()).rejects.toThrow();
}

export async function expectNotExists(loc: Locator) {
	await vi.waitFor(() => expect(() => loc.element()).toThrow());
}

export async function expectExists(loc: Locator) {
	await expect.element(loc).toBeInTheDocument();
}

export async function focusAndExpectToHaveFocus(loc: Locator) {
	(loc.element() as HTMLElement).focus();
	await expect.element(loc).toHaveFocus();
}
