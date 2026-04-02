import { isClickTrulyOutside } from "$lib/internal/dom.js";
import { getOwnerDocument, isOrContainsTarget } from "$lib/internal/elements.js";
import { isElementOrSVGElement } from "$lib/internal/is.js";
import { defaultDismissibleInteractOutsideIsValid } from "$lib/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js";

/**
 * Flex gaps / pointer-events-none popup shell: hit target sits outside the popup subtree while
 * client coords can remain inside getBoundingClientRect. Default dismissible uses bbox only.
 */
function isDrawerPopupInteractOutsidePointerHole(e: PointerEvent, node: HTMLElement): boolean {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;
	if ("button" in e && e.button !== 0) return false;

	const ownerDocument = getOwnerDocument(target);
	if (!ownerDocument.documentElement.contains(target)) return false;
	if (isOrContainsTarget(node, target)) return false;
	if (isClickTrulyOutside(e, node)) return false;

	const top = ownerDocument.elementFromPoint(e.clientX, e.clientY);
	return Boolean(top && !node.contains(top));
}

export function isDrawerPopupInteractOutsideEvent(e: PointerEvent, node: HTMLElement): boolean {
	return (
		isDrawerPopupInteractOutsidePointerHole(e, node) ||
		defaultDismissibleInteractOutsideIsValid(e, node)
	);
}
