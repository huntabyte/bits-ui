import { on } from "svelte/events";
import { isElementOrSVGElement } from "./is.js";

export type EventCallback<E extends Event = Event> = (event: E) => void;

/**
 * Creates a typed event dispatcher and listener pair for custom events
 * @template T - The type of data that will be passed in the event detail
 * @param eventName - The name of the custom event
 * @param options - CustomEvent options (bubbles, cancelable, etc.)
 */
export class CustomEventDispatcher<T = unknown> {
	readonly eventName: string;
	readonly options: Omit<CustomEventInit<T>, "detail">;

	constructor(
		eventName: string,
		options: Omit<CustomEventInit<T>, "detail"> = { bubbles: true, cancelable: true }
	) {
		this.eventName = eventName;
		this.options = options;
	}

	createEvent(detail?: T): CustomEvent<T> {
		return new CustomEvent<T>(this.eventName, {
			...this.options,
			detail,
		});
	}

	dispatch(element: EventTarget, detail?: T): CustomEvent<T> {
		const event = this.createEvent(detail);
		element.dispatchEvent(event);
		return event;
	}

	listen(
		element: EventTarget,
		callback: (event: CustomEvent<T>) => void,
		options?: AddEventListenerOptions
	) {
		const handler = (event: Event) => {
			callback(event as CustomEvent<T>);
		};

		return on(element, this.eventName, handler, options);
	}
}

const capturedEventPaths = new WeakMap<Event, EventTarget[]>();

export function captureEventPath(event: Event, path = event.composedPath()) {
	capturedEventPaths.set(event, path);
}

function getEventPath(event: Event) {
	return capturedEventPaths.get(event) ?? event.composedPath();
}

export function isEventTargetWithin(event: Event, node: Element | null | undefined) {
	if (!node) return false;
	return (
		(isElementOrSVGElement(event.target) && node.contains(event.target)) ||
		getEventPath(event).includes(node)
	);
}

export function getEventTargetClosest(event: Event, selector: string) {
	for (const target of getEventPath(event)) {
		if (isElementOrSVGElement(target) && target.matches(selector)) return target;
	}
	return isElementOrSVGElement(event.target) ? event.target.closest(selector) : null;
}

export function copyEventPath(from: Event, to: Event) {
	captureEventPath(to, getEventPath(from));
}
