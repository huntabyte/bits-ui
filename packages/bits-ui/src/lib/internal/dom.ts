export function getDocument(element?: Element | null) {
	return element?.ownerDocument ?? document;
}

export function activeElement(doc: Document) {
	let activeElement = doc.activeElement;

	while (activeElement?.shadowRoot?.activeElement != null) {
		activeElement = activeElement.shadowRoot.activeElement;
	}

	return activeElement;
}

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

export function getTarget(event: Event) {
	if ("composedPath" in event) {
		return event.composedPath()[0];
	}

	// TS thinks `event` is of type never as it assumes all browsers support
	// `composedPath()`, but browsers without shadow DOM don't.
	return (event as Event).target;
}
