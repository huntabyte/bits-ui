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

export type TransitionAttrSnapshot = {
	starting: boolean;
	ending: boolean;
};

export type TransitionAttrObserver = {
	history: TransitionAttrSnapshot[];
	disconnect: () => void;
};

export function observeTransitionAttrs(node: Element): TransitionAttrObserver {
	const history: TransitionAttrSnapshot[] = [];
	const capture = (): void => {
		history.push({
			starting: node.hasAttribute("data-starting-style"),
			ending: node.hasAttribute("data-ending-style"),
		});
	};

	capture();

	const observer = new MutationObserver((mutations) => {
		if (
			!mutations.some(
				(mutation) =>
					mutation.type === "attributes" &&
					(mutation.attributeName === "data-starting-style" ||
						mutation.attributeName === "data-ending-style")
			)
		) {
			return;
		}

		capture();
	});

	observer.observe(node, {
		attributes: true,
		attributeFilter: ["data-starting-style", "data-ending-style"],
	});

	return {
		history,
		disconnect: (): void => observer.disconnect(),
	};
}
