export function getFirstNonCommentChild(element: HTMLElement | null) {
	if (!element) return null;
	for (const child of element.childNodes) {
		if (child.nodeType !== Node.COMMENT_NODE) {
			return child;
		}
	}
	return null;
}

/**
 * Determines if the click event truly occurred outside the content node.
 * This was added to handle password managers and other elements that may be injected
 * into the DOM but visually appear inside the content.
 */
export function isClickTrulyOutside(event: PointerEvent, contentNode: HTMLElement): boolean {
	const { clientX, clientY } = event;
	const rect = contentNode.getBoundingClientRect();

	return (
		clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom
	);
}

// From https://github.com/melt-ui/melt-ui/blob/30927923fa51960e82a937f9a1bb12ab6da108b8/src/lib/internal/helpers/rovingFocus.ts#L10
function getFocusableElements() {
	return Array.from(
		document.querySelectorAll(
			'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
		)
	);
}

export function getNextFocusable(currentElement: HTMLElement): HTMLElement | null {
	const focusableElements = getFocusableElements();

	const currentIndex = focusableElements.indexOf(currentElement);
	const nextIndex = currentIndex + 1;
	const nextElement = focusableElements[nextIndex];
	if (nextIndex < focusableElements.length && nextElement instanceof HTMLElement) {
		return nextElement;
	}
	return null;
}

export function getPreviousFocusable(currentElement: HTMLElement): HTMLElement | null {
	const focusableElements = getFocusableElements();
	const currentIndex = focusableElements.indexOf(currentElement);
	const previousIndex = currentIndex - 1;
	const prevElement = focusableElements[previousIndex];
	if (previousIndex >= 0 && prevElement instanceof HTMLElement) {
		return prevElement;
	}
	return null;
}
