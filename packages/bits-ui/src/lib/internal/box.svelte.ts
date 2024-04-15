export type Setter<T> = (value: T) => void;
export type Getter<T> = () => T;

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
	#get: Getter<T> = $state() as Getter<T>;
	#set: Setter<T> = $state() as Setter<T>;

	constructor(get: Getter<T>, set: Setter<T>) {
		this.#get = get;
		this.#set = set;
	}

	get value() {
		return this.#get();
	}

	set value(value: T) {
		this.#set(value);
	}
}

export function box<T>(get: Getter<T>, set: Setter<T>) {
	return new Box(get, set);
}

export function readonlyBox<T>(get: Getter<T>) {
	return new ReadonlyBox(get);
}

export function boxWithState<T>(initialVal: T) {
	let state = $state(initialVal);
	return box(
		() => state,
		(newValue) => (state = newValue)
	);
}

export type BoxedValues<T> = {
	[K in keyof T]: Box<T[K]>;
};

export type ReadonlyBoxedValues<T> = {
	[K in keyof T]: ReadonlyBox<T[K]>;
};
