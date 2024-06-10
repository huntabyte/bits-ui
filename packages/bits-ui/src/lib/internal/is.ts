export const isBrowser = typeof document !== "undefined";

export const isIOS = getIsIOS();

function getIsIOS() {
	return (
		isBrowser &&
		window?.navigator?.userAgent &&
		// eslint-disable-next-line regexp/no-unused-capturing-group
		(/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
			// The new iPad Pro Gen3 does not identify itself as iPad, but as Macintosh.
			(window?.navigator?.maxTouchPoints > 2 &&
				/iPad|Macintosh/.test(window?.navigator.userAgent)))
	);
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isElement(element: unknown): element is Element {
	return element instanceof Element;
}

export function isElementOrSVGElement(element: unknown): element is Element | SVGElement {
	return element instanceof Element || element instanceof SVGElement;
}
