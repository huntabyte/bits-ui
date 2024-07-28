import type { ReadableBox } from "svelte-toolbelt";
import type { EventCallback } from "./events.js";

/**
 * Composes event handlers into a single function that can be called with an event.
 * If the previous handler cancels the event using `event.preventDefault()`, the handlers
 * that follow will not be called.
 */
export function composeHandlers<E extends Event = Event, T extends Element = Element>(
	...handlers: Array<EventCallback<E> | ReadableBox<EventCallback<E>> | undefined>
): (e: E) => void {
	return function (this: T, e: E) {
		for (const handler of handlers) {
			if (!handler) continue;
			if (e.defaultPrevented) return;
			if (typeof handler === "function") {
				handler.call(this, e);
			} else {
				handler.current?.call(this, e);
			}
		}
	};
}
