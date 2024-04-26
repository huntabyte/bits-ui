export function get<T>(valueOrGetValue: T | (() => T)): T {
	return typeof valueOrGetValue === "function" ? (valueOrGetValue as () => T)() : valueOrGetValue;
}

export function getDPR(element: Element): number {
	if (typeof window === "undefined") {
		return 1;
	}
	const win = element.ownerDocument.defaultView || window;
	return win.devicePixelRatio || 1;
}

export function roundByDPR(element: Element, value: number) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
