import { clsx } from "clsx";
import { type EventCallback, composeHandlers } from "./events.js";
import { styleToString } from "./style.js";
import { cssToStyleObj } from "./cssToStyleObj.js";
import { executeCallbacks } from "./callbacks.js";
import type { StyleProperties } from "$lib/shared/index.js";

type Props = Record<string, unknown>;

type PropsArg = Props | null | undefined;

// Source: https://stackoverflow.com/questions/51603250/typescript-3-parameter-list-intersection-type/51604379#51604379
type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
	? NullToObject<V>
	: never;
type NullToObject<T> = T extends null | undefined ? {} : T;
// eslint-disable-next-line ts/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

/**
 * Given a list of prop objects, merges them into a single object.
 * - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
 * - Chains regular functions with the same name so they are called in order
 * - Merges class strings with `clsx`
 * - Merges style objects and converts them to strings
 * - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
 * - Overrides other values with the last one
 */
export function mergeProps<T extends PropsArg[]>(
	...args: T
): UnionToIntersection<TupleTypes<T>> & {
	style?: string;
} {
	const result: Props = { ...args[0] };

	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		for (const key in props) {
			const a = result[key];
			const b = props[key];

			// compose event handlers
			if (
				typeof a === "function" &&
				typeof b === "function" &&
				key.length > 2 &&
				key[0] === "o" &&
				key[1] === "n" &&
				// we check if the 3rd character is uppercase to avoid merging our own
				// custom callbacks like `onValueChange` and strictly merge native event handlers
				key[2] === key[2]?.toLowerCase()
			) {
				// handle merging of event handlers
				const aHandler = a as EventCallback;
				const bHandler = b as EventCallback;
				result[key] = composeHandlers(aHandler, bHandler);
			} else if (typeof a === "function" && typeof b === "function") {
				// chain non-event handler functions
				result[key] = executeCallbacks(a, b);
			} else if (key === "class" && typeof a === "string" && typeof b === "string") {
				// handle merging class strings
				result[key] = clsx(a, b);
			} else if (key === "style") {
				if (typeof a === "object" && typeof b === "object") {
					result[key] = { ...a, ...b };
				} else if (typeof a === "object" && typeof b === "string") {
					const parsedStyle = cssToStyleObj(b);
					result[key] = { ...a, ...parsedStyle };
				} else if (typeof a === "string" && typeof b === "object") {
					const parsedStyle = cssToStyleObj(a);
					result[key] = { ...parsedStyle, ...b };
				} else if (typeof a === "string" && typeof b === "string") {
					// this should rarely happen, but we need to handle it in case
					// specific components stringify the style before it gets to
					// another component down the tree.
					// this can happen when a component has an optional inherited component
					const parsedStyleA = cssToStyleObj(a);
					const parsedStyleB = cssToStyleObj(b);
					result[key] = { ...parsedStyleA, ...parsedStyleB };
				} else if (typeof a === "object") {
					result[key] = a;
				} else if (typeof b === "object") {
					result[key] = b;
				}
			} else {
				// override other values
				result[key] = b !== undefined ? b : a;
			}
		}
	}

	// convert style object to string
	if ("style" in result && typeof result.style === "object") {
		result.style = styleToString(result.style as StyleProperties);
	}

	// handle weird svelte bug where `hidden` is not removed when set to `false`
	if ("hidden" in result && result.hidden !== true) {
		result.hidden = undefined;
	}

	// handle weird svelte bug where `disabled` is not removed when set to `false`
	if ("disabled" in result && result.disabled !== true) {
		result.disabled = undefined;
	}

	return result as UnionToIntersection<TupleTypes<T>> & { style?: string };
}
