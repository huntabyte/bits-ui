type FocusableTarget = HTMLElement | { focus(): void };

/**
 * Attempts to focus the first element in a list of candidates.
 * Stops when focus has moved.
 */
export function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
	const prevFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== prevFocusedElement) return true;
	}
}

export function isSelectableInput(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	element: any
): element is FocusableTarget & { select: () => void } {
	return element instanceof HTMLInputElement && "select" in element;
}

export function focus(element?: FocusableTarget | null, { select = false } = {}) {
	if (!(element && element.focus)) return;

	// only focus if the element is focusable
	const prevFocusedElement = document.activeElement;
	// NOTE: we prevent scrolling on focus to minimize layout shifts
	element.focus({ preventScroll: true });
	// only select if its not the same element, it supports selection, and we need to select
	if (element !== prevFocusedElement && isSelectableInput(element) && select) {
		element.select();
	}
}

/**
 * Gets the first and last tabbable elements within a container.
 */
export function getTabbableEdges(container: HTMLElement) {
	const candidates = getTabbableCandidates(container);
	const first = findVisible(candidates, container);
	const last = findVisible(candidates.reverse(), container);
	return [first, last] as const;
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
export function getTabbableCandidates(container: HTMLElement) {
	const nodes: HTMLElement[] = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acceptNode: (node: any) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
			if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
			// `.tabIndex` is not the same as `tabindex`. It works on the runtime's understanding
			// of tabbability, so this automatically accounts for any kind of element we could be
			// tabbed to
			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		},
	});
	while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

	// we don't take into account the order of nodes with positive `tabIndex` as it
	// hinders accessibility to have tab order different from the visual order
	return nodes;
}

/**
 * Attempts to focus the first visible element in a list of candidates,
 * stopping at the container level.
 */
export function findVisible(elements: HTMLElement[], container: HTMLElement) {
	for (const element of elements) {
		// stop checking if it's hidden at the container level (exclusive)
		if (!isHidden(element, { upTo: container })) return element;
	}
}

export function isHidden(element: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
	if (getComputedStyle(element).visibility === "hidden") return true;

	while (element) {
		// stop at `upTo` (exclusive)
		if (upTo !== undefined && element === upTo) return false;
		if (getComputedStyle(element).display === "none") return true;
		element = element.parentElement as HTMLElement;
	}
	return false;
}
