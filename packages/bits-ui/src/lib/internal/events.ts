import { on } from "svelte/events";

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
