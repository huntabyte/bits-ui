import { userEvent } from "@vitest/browser/context";
import { expect } from "vitest";

export async function expectNotClickable(node: Element | HTMLElement) {
	await expect(userEvent.click(node, { timeout: 100 })).rejects.toThrow();
}
