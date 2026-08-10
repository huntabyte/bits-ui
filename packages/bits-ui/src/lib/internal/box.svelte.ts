/** Class-based drop-in for svelte-toolbelt's `boxWith`. */
import { boxWith as toolbeltBoxWith, type ReadableBox, type WritableBox } from "svelte-toolbelt";

const readonlyProbe = toolbeltBoxWith(() => null);
const writableProbe = toolbeltBoxWith(
	() => null,
	() => {}
);
const BoxSymbol = Object.getOwnPropertySymbols(readonlyProbe)[0]!;
const isWritableSymbol = Object.getOwnPropertySymbols(writableProbe).find((s) => s !== BoxSymbol)!;

class ReadBox<T> {
	readonly #getter: () => T;

	constructor(getter: () => T) {
		this.#getter = getter;
	}

	get current(): T {
		return this.#getter();
	}
}
// oxlint-disable-next-line no-explicit-any
(ReadBox.prototype as any)[BoxSymbol] = true;

class WriteBox<T> {
	readonly #getter: () => T;
	readonly #setter: (v: T) => void;
	readonly #value: T = $derived.by(() => this.#getter());

	constructor(getter: () => T, setter: (v: T) => void) {
		this.#getter = getter;
		this.#setter = setter;
	}

	get current(): T {
		return this.#value;
	}

	set current(v: T) {
		this.#setter(v);
	}
}
// oxlint-disable-next-line no-explicit-any
(WriteBox.prototype as any)[BoxSymbol] = true;
// oxlint-disable-next-line no-explicit-any
(WriteBox.prototype as any)[isWritableSymbol] = true;

export function boxWith<T>(getter: () => T): ReadableBox<T>;
export function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
export function boxWith<T>(getter: () => T, setter?: (v: T) => void) {
	return (setter
		? new WriteBox(getter, setter)
		: new ReadBox(getter)) as unknown as WritableBox<T>;
}
