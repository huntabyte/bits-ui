import { defaultDismissibleInteractOutsideIsValid } from "$lib/bits/utilities/dismissible-layer/use-dismissable-layer.svelte.js";

/**
 * Drawer dismiss uses the default bbox + subtree check. A prior "pointer hole" branch treated
 * viewport shell hits with coordinates inside the popup rect as outside; that incorrectly closed
 * on taps inside the sheet (touch) and conflicted with rect-aligned swipe hit-testing.
 */
export function isDrawerPopupInteractOutsideEvent(e: PointerEvent, node: HTMLElement): boolean {
	return defaultDismissibleInteractOutsideIsValid(e, node);
}
