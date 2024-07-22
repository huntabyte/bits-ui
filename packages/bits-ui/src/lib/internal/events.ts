import type { ReadableBox } from "svelte-toolbelt";
import type { Arrayable } from "$lib/internal/index.js";

export type EventCallback<E extends Event = Event> = (event: E) => void;

export function composeHandlers<E extends Event = Event, T extends Element = Element>(
	...handlers: Array<EventCallback<E> | ReadableBox<EventCallback<E>> | undefined>
): (e: E) => void {
	return function (this: T, e: E) {
		for (const handler of handlers) {
			if (!handler || e.defaultPrevented) return;
			if (typeof handler === "function") {
				handler.call(this, e);
			} else {
				handler.current.call(this, e);
			}
		}
	};
}

export type GeneralEventListener<E = Event> = (evt: E) => unknown;

export function addEventListener<E extends keyof WindowEventMap>(
	target: Window,
	event: Arrayable<E>,
	handler: (this: Window, ev: WindowEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof DocumentEventMap>(
	target: Document,
	event: Arrayable<E>,
	handler: (this: Document, ev: DocumentEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: EventTarget,
	event: Arrayable<E>,
	handler: GeneralEventListener<HTMLElementEventMap[E]>,
	options?: boolean | AddEventListenerOptions
): VoidFunction;
/**
 * Adds an event listener to the specified target element(s) for the given event(s), and returns a function to remove it.
 * @param target The target element(s) to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener from the target element(s).
 */
export function addEventListener(
	target: Window | Document | EventTarget,
	event: Arrayable<string>,
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const events = Array.isArray(event) ? event : [event];

	// Add the event listener to each specified event for the target element(s).
	events.forEach((_event) => target.addEventListener(_event, handler, options));

	// Return a function that removes the event listener from the target element(s).
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}
