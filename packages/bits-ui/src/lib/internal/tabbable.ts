import { focusable, isFocusable, isTabbable, tabbable } from "tabbable";
import { getDocument } from "svelte-toolbelt";

const TABBABLE_OPTIONS = {
	getShadowRoot: true,
	displayCheck: "full",
} as const;

/**
 * Gets all tabbable elements in the body and finds the next/previous tabbable element
 * from the `currentNode` based on the `direction` provided.
 * @param currentNode - the node we want to get the next/previous tabbable from
 */
export function getTabbableFrom(currentNode: HTMLElement, direction: "next" | "prev") {
	if (!isTabbable(currentNode, TABBABLE_OPTIONS)) {
		return getTabbableFromFocusable(currentNode, direction);
	}
	const doc = getDocument(currentNode);
	const allTabbable = tabbable(doc.body, TABBABLE_OPTIONS);
	if (direction === "prev") allTabbable.reverse();
	const activeIndex = allTabbable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;
	const nextTabbableElements = allTabbable.slice(activeIndex + 1);
	return nextTabbableElements[0];
}

export function getTabbableFromFocusable(currentNode: HTMLElement, direction: "next" | "prev") {
	const doc = getDocument(currentNode);
	if (!isFocusable(currentNode, TABBABLE_OPTIONS)) return doc.body;

	// find all focusable nodes, since some elements may be focusable but not tabbable
	// such as context menu triggers
	const allFocusable = focusable(doc.body, TABBABLE_OPTIONS);

	// find index of current node among focusable siblings
	if (direction === "prev") allFocusable.reverse();
	const activeIndex = allFocusable.indexOf(currentNode);
	if (activeIndex === -1) return doc.body;

	const nextFocusableElements = allFocusable.slice(activeIndex + 1);

	// find the next focusable node that is also tabbable
	return nextFocusableElements.find((node) => isTabbable(node, TABBABLE_OPTIONS)) ?? doc.body;
}
