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

/**
 * `querySelectorAll` as an array. An indexed copy is about twice as fast as
 * `Array.from(nodeList)`, which matters for per-keystroke scans of large lists.
 */
export function queryAll<T extends Element = HTMLElement>(node: ParentNode, selector: string): T[] {
	const list = node.querySelectorAll<T>(selector);
	const arr = new Array<T>(list.length);
	for (let i = 0; i < list.length; i++) arr[i] = list[i]!;
	return arr;
}
