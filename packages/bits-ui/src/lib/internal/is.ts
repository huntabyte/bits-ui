export const isBrowser = typeof document !== "undefined";

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}
