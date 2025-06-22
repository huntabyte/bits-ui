import { focusable, isFocusable, isTabbable, tabbable } from "tabbable";
import { getDocument } from "svelte-toolbelt";

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

/**
 * Gets all tabbable elements in the body and finds the next/previous tabbable element
 * from the `currentNode` based on the `direction` provided.
 * @param currentNode - the node we want to get the next/previous tabbable from
 */
export function getTabbableFrom(currentNode: HTMLElement, direction: "next" | "prev") {
	if (!isTabbable(currentNode, getTabbableOptions())) {
		return getTabbableFromFocusable(currentNode, direction);
	}
	const doc = getDocument(currentNode);
	const allTabbable = tabbable(doc.body, getTabbableOptions());
	if (direction === "prev") allTabbable.reverse();
	const activeIndex = allTabbable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;
	const nextTabbableElements = allTabbable.slice(activeIndex + 1);
	return nextTabbableElements[0];
}

export function getTabbableFromFocusable(currentNode: HTMLElement, direction: "next" | "prev") {
	const doc = getDocument(currentNode);
	if (!isFocusable(currentNode, getTabbableOptions())) return doc.body;

	// find all focusable nodes, since some elements may be focusable but not tabbable
	// such as context menu triggers
	const allFocusable = focusable(doc.body, getTabbableOptions());

	// find index of current node among focusable siblings
	if (direction === "prev") allFocusable.reverse();
	const activeIndex = allFocusable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;

	const nextFocusableElements = allFocusable.slice(activeIndex + 1);

	// find the next focusable node that is also tabbable
	return nextFocusableElements.find((node) => isTabbable(node, getTabbableOptions())) ?? doc.body;
}
