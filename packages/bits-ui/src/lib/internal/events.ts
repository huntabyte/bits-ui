import { createEventDispatcher } from "svelte";

type MeltEvent<T extends Event = Event> = {
	detail: {
		originalEvent: T;
	};
	cancelable: boolean;
	preventDefault: () => void;
};

export type SvelteEvent<T extends Event = Event, U extends EventTarget = EventTarget> = T & {
	currentTarget: EventTarget & U;
};

export function createDispatcher<M extends Element = Element>() {
	const dispatch = createEventDispatcher();
	return (e: MeltEvent) => {
		const { originalEvent } = e.detail;
		const { cancelable } = e;

		const type = originalEvent.type;

		const shouldContinue = dispatch(
			type,
			{ originalEvent, currentTarget: originalEvent.currentTarget as M },
			{ cancelable }
		);
		if (!shouldContinue) {
			e.preventDefault();
		}
	};
}

export type CreateDispatcher = {
	createDispatcher: typeof createDispatcher;
};

export type EventCallback<E extends Event = Event, T extends EventTarget = Element> = (
	event: E & { currentTarget: EventTarget & T }
) => void;

export function composeHandlers<E extends Event = Event, T extends EventTarget = Element>(
	...handlers: Array<EventCallback<E, T> | undefined>
): (e: E & { currentTarget: EventTarget & T }) => void {
	return (e: E & { currentTarget: EventTarget & T }) => {
		for (const handler of handlers) {
			if (handler && !e.defaultPrevented) {
				handler(e);
			}
		}
	};
}

export type GeneralEventListener<E = Event> = (evt: E) => unknown;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Window,
	event: E,
	handler: (this: Window, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Document,
	event: E,
	handler: (this: Document, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: EventTarget,
	event: E,
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
	event: string | string[],
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

export function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
	name: string,
	handler: ((event: E) => void) | undefined,
	detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never)
) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail,
	});
	if (handler) target.addEventListener(name, handler as EventListener, { once: true });

	target.dispatchEvent(event);
}
