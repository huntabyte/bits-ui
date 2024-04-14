import { untrack } from "svelte";
import { isFunction } from "./is.js";

export type Setter<T> = (value: T) => void;
export type Getter<T> = () => T;
export type ValueOrGetter<T> = T | Getter<T>;

type WatcherCallback<T> = (
	curr: T,
	prev: T
) => void | Promise<void> | (() => void) | (() => Promise<void>);

type WatchOptions = {
	/**
	 * Whether to eagerly run the watcher before the state is updated.
	 */
	immediate?: boolean;

	/**
	 * Whether to run the watcher only once.
	 */
	once?: boolean;
};

export class Box<T> {
	#set = (() => {}) as Setter<T>;
	#get: ValueOrGetter<T> = $state() as Getter<T>;

	constructor(get: ValueOrGetter<T>, set?: Setter<T>) {
		this.#set = set ?? this.#set;
		this.#get = get;
	}

	get value() {
		return isFunction(this.#get) ? this.#get() : this.#get;
	}

	set value(value: T) {
		isFunction(this.#get) ? this.#set(value) : (this.#get = value);
	}
}

export function watch<T>(box: Box<T>, callback: WatcherCallback<T>, options: WatchOptions = {}) {
	let prev = $state(box.value);
	let ranOnce = false;

	const watchEffect = $effect.root(() => {
		$effect.pre(() => {
			if (prev === box.value || !options.immediate) return;
			if (options.once && ranOnce) return;
			callback(
				box.value,
				untrack(() => prev)
			);
			untrack(() => (prev = box.value));
			ranOnce = true;
		});

		$effect(() => {
			if (prev === box.value || options.immediate) return;
			if (options.once && ranOnce) return;

			callback(
				box.value,
				untrack(() => prev)
			);
			untrack(() => (prev = box.value));
			ranOnce = true;
		});
	});
	return watchEffect;
}

export function box<T>(get: ValueOrGetter<T>, set: Setter<T> = () => {}) {
	return new Box(get, set);
}

export type BoxedValues<T> = {
	[K in keyof T]: Box<T[K]>;
};
