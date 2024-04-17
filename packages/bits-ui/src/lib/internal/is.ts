export const isBrowser = typeof document !== "undefined";

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}
