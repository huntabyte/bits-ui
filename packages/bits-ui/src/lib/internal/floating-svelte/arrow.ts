import type { Derivable, Middleware, Padding } from "@floating-ui/dom";
import { arrow as arrowCore } from "@floating-ui/dom";
import type { MiddlewareState } from "@floating-ui/core";
import { type WritableBox, box } from "svelte-toolbelt";
import { isElement } from "../is.js";

export type ArrowOptions = {
	/**
	 * The arrow element to be positioned.
	 * @default undefined
	 */
	element: WritableBox<Element | null> | Element | null;

	/**
	 * The padding between the arrow element and the floating element edges.
	 * Useful when the floating element has rounded corners.
	 *
	 * @default 0
	 */
	padding?: Padding;
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */

export function arrow(options: ArrowOptions | Derivable<ArrowOptions>): Middleware {
	return {
		name: "arrow",
		options,
		fn(state: MiddlewareState) {
			const { element, padding } = typeof options === "function" ? options(state) : options;

			if (element && box.isBox(element)) {
				if (element.value !== null) {
					return arrowCore({ element: element.value, padding }).fn(state);
				}

				return {};
			}

			if (isElement(element)) {
				return arrowCore({ element, padding }).fn(state);
			}

			return {};
		},
	};
}
