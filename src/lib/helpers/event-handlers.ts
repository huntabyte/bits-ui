import { createEventDispatcher } from "svelte";

export type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};

export type DivEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLDivElement;
};

export type SpanEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLSpanElement;
};

export type MEventHandler<T extends Event = Event, M extends Element = Element> = T & {
	currentTarget: EventTarget & M;
};

export type CustomEventHandler<T extends Event = Event, M extends Element = Element> = T & {
	currentTarget: EventTarget & M;
	cancelable: boolean;
	originalEvent: T;
};

type MeltEvent<T extends Event = Event> = {
	detail: {
		originalEvent: T;
	};
	cancelable: boolean;
	preventDefault: () => void;
};

export function createCustomEventDispatcher<M extends Element = Element>() {
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
