import { tabbable } from "tabbable";
import { activeElement, getDocument } from "./dom.js";

function getTabbableOptions() {
	return {
		getShadowRoot: true,
		displayCheck:
			// JSDOM does not support the `tabbable` library. To solve this we can
			// check if `ResizeObserver` is a real function (not polyfilled), which
			// determines if the current environment is JSDOM-like.
			typeof ResizeObserver === "function" &&
			ResizeObserver.toString().includes("[native code]")
				? "full"
				: "none",
	} as const;
}

function getTabbableIn(container: HTMLElement, direction: "next" | "prev") {
	const allTabbable = tabbable(container, getTabbableOptions());

	if (direction === "prev") {
		allTabbable.reverse();
	}

	const activeEl = activeElement(getDocument(container)) as HTMLElement;

	const activeIndex = allTabbable.indexOf(activeEl);
	const nextTabbableElements = allTabbable.slice(activeIndex + 1);
	return nextTabbableElements[0];
}

/**
 * Gets all tabbable elements in the body and finds the next/previous tabbable element
 * from the `currentNode` based on the `direction` provided.
 * @param currentNode - the node we want to get the next/previous tabbable from
 */
export function getTabbableFrom(currentNode: HTMLElement, direction: "next" | "prev") {
	const allTabbable = tabbable(getDocument(currentNode).body, getTabbableOptions());
	if (direction === "prev") allTabbable.reverse();
	const activeIndex = allTabbable.indexOf(currentNode);
	if (activeIndex === -1) return document.body;
	const nextTabbableElements = allTabbable.slice(activeIndex + 1);
	return nextTabbableElements[0];
}

export function getNextTabbable() {
	return getTabbableIn(document.body, "next");
}

export function getPreviousTabbable() {
	return getTabbableIn(document.body, "prev");
}
