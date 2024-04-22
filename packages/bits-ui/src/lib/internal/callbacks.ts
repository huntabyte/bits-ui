import type { AnyFn } from "./types.js";

/**
 * Executes an array of callback functions with the same arguments.
 * @template T The types of the arguments that the callback functions take.
 * @param callbacks array of callback functions to execute.
 * @returns A new function that executes all of the original callback functions with the same arguments.
 */
export function executeCallbacks<T extends Array<AnyFn | undefined | null>>(
	...callbacks: T
): (...args: unknown[]) => void {
	return (...args: unknown[]) => {
		for (const callback of callbacks) {
			if (typeof callback === "function") {
				callback(...args);
			}
		}
	};
}

/**
 * A no operation function (does nothing)
 */
export function noop() {
	//
}
