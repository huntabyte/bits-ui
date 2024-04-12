export type Setter<T> = (value: T) => void;
export type Getter<T> = () => T;

export class Box<T> {
	#set: Setter<T> = $state() as Setter<T>;
	#get: Getter<T> = $state() as Getter<T>;

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

export function box<T>(get: Getter<T>, set: Setter<T>) {
	return new Box(get, set);
}
