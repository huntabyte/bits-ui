import { untrack } from "svelte";

export type Setter<T> = (value: T) => void;
export type Getter<T> = () => T;

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

export class ReadonlyBox<T> {
	#get: Getter<T> = $state() as Getter<T>;

	constructor(get: Getter<T>) {
		this.#get = get;
	}

	get value() {
		return this.#get();
	}
}

export class Box<T> {
	#set = $state() as Setter<T>;
	#get = $state() as Getter<T>;

	constructor(get: Getter<T>, set: Setter<T>) {
		this.#set = set;
		this.#get = get;
	}

	get value() {
		return this.#get();
	}

	set value(value: T) {
		this.#set(value);
	}
}

export function watch<T>(
	box: ReadonlyBox<T> | Box<T>,
	callback: WatcherCallback<T>,
	options: WatchOptions = {}
) {
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

export function box<T>(get: Getter<T>, set: Setter<T>) {
	return new Box(get, set);
}

export function readonlyBox<T>(get: Getter<T>) {
	return new ReadonlyBox(get);
}

export function boxedState<T>(initialValue: T) {
	let state = $state(initialValue);
	return box(
		() => state,
		(value) => (state = value)
	);
}

export function readonlyBoxedState<T>(initialValue: T) {
	let state = $state(initialValue);
	return readonlyBox(() => state);
}

export type BoxedValues<T> = {
	[K in keyof T]: Box<T[K]>;
};

export type ReadonlyBoxedValues<T> = {
	[K in keyof T]: ReadonlyBox<T[K]>;
};
