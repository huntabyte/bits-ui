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

/**
 * The element after (`1`) or before (`-1`) `from` in document order, inside `root` and
 * not `root` itself, that passes `accept`. Lets keyboard navigation step to a neighbour
 * without collecting every candidate first.
 */
export function findAdjacentElement(
	root: Element,
	from: Node,
	step: 1 | -1,
	accept: (el: Element) => boolean
): HTMLElement | null {
	const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	walker.currentNode = from;
	let node = step === 1 ? walker.nextNode() : walker.previousNode();
	while (node && (node === root || !accept(node as Element))) {
		node = step === 1 ? walker.nextNode() : walker.previousNode();
	}
	return node as HTMLElement | null;
}
