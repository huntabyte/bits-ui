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
