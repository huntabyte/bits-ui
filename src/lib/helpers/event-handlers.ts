export type CustomEventHandler<T extends Event = Event, M extends Element = Element> = T & {
	currentTarget: EventTarget & M;
	originalEvent: T;
};
