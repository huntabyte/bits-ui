import { type Locator } from "@vitest/browser/context";
import { expect, vi } from "vitest";

export function getSubmenuPlacementSide(
	triggerRect: DOMRect,
	contentRect: DOMRect
): "top" | "bottom" | "left" | "right" {
	const triggerCenterX = triggerRect.left + triggerRect.width / 2;
	const triggerCenterY = triggerRect.top + triggerRect.height / 2;
	const contentCenterX = contentRect.left + contentRect.width / 2;
	const contentCenterY = contentRect.top + contentRect.height / 2;
	const deltaX = contentCenterX - triggerCenterX;
	const deltaY = contentCenterY - triggerCenterY;
	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		return deltaX > 0 ? "right" : "left";
	}
	return deltaY > 0 ? "bottom" : "top";
}

export function getPointerLeaveTowardSubmenuClientCoords(
	triggerRect: DOMRect,
	contentRect: DOMRect
): { x: number; y: number } {
	const side = getSubmenuPlacementSide(triggerRect, contentRect);
	const mx = triggerRect.left + triggerRect.width / 2;
	const my = triggerRect.top + triggerRect.height / 2;
	switch (side) {
		case "right":
			return { x: triggerRect.right - 1, y: my };
		case "left":
			return { x: triggerRect.left + 1, y: my };
		case "bottom":
			return { x: mx, y: triggerRect.bottom - 1 };
		case "top":
			return { x: mx, y: triggerRect.top + 1 };
	}
}

export function getPointerMidpointTowardSubmenuClientCoords(
	triggerRect: DOMRect,
	contentRect: DOMRect
): { x: number; y: number } {
	const side = getSubmenuPlacementSide(triggerRect, contentRect);
	const my = triggerRect.top + triggerRect.height / 2;
	const mx = triggerRect.left + triggerRect.width / 2;
	switch (side) {
		case "right":
			return { x: (triggerRect.right + contentRect.left) / 2, y: my };
		case "left":
			return { x: (triggerRect.left + contentRect.right) / 2, y: my };
		case "bottom":
			return { x: mx, y: (triggerRect.bottom + contentRect.top) / 2 };
		case "top":
			return { x: mx, y: (triggerRect.top + contentRect.bottom) / 2 };
	}
}

export function getPointerAwayFromSubmenuIntentClientCoords(
	triggerRect: DOMRect,
	subContentRect: DOMRect
): { x: number; y: number } {
	const side = getSubmenuPlacementSide(triggerRect, subContentRect);
	const my = triggerRect.top + triggerRect.height / 2;
	const mx = triggerRect.left + triggerRect.width / 2;
	switch (side) {
		case "right":
			return { x: subContentRect.left - 8, y: my };
		case "left":
			return { x: subContentRect.right + 8, y: my };
		case "bottom":
			return { x: mx, y: subContentRect.top - 8 };
		case "top":
			return { x: mx, y: subContentRect.bottom + 8 };
	}
}

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
