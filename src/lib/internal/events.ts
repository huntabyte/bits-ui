import { createEventDispatcher } from "svelte";

type MeltEvent<T extends Event = Event> = {
	detail: {
		originalEvent: T;
	};
	cancelable: boolean;
	preventDefault: () => void;
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
