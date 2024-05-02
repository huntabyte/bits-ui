import type { ReadableBox, WritableBox } from "runed";

export type Box<T> = ReadableBox<T> | WritableBox<T>;

export type WritableBoxedValues<T> = {
	[K in keyof T]: WritableBox<T[K]>;
};

export type ReadableBoxedValues<T> = {
	[K in keyof T]: ReadableBox<T[K]>;
};
