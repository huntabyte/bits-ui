export type CustomEventHandler<T extends Event = Event, M extends Element = Element> = CustomEvent<{
    currentTarget: EventTarget & M;
    originalEvent: T;
}>;
