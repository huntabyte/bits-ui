import {
	isBox,
	isWritableBox,
	simpleBox as toolbeltSimpleBox,
	type ReadableBox,
	type WritableBox,
} from "svelte-toolbelt";

// svelte-toolbelt doesn't export its marker symbols; read them off a box so `isBox` /
// `isWritableBox` (and toolbelt's own `attachRef`) recognise these boxes too.
const markers = Object.getOwnPropertySymbols(toolbeltSimpleBox(null));
const BOX = markers.find((s) => isBox({ [s]: true }));
const WRITABLE = markers.find((s) => s !== BOX);
// fail loudly at import if toolbelt changes how it marks boxes, rather than silently
// producing boxes it doesn't recognise
if (
	markers.length !== 2 ||
	!BOX ||
	!WRITABLE ||
	!isWritableBox({ [BOX]: true, [WRITABLE]: true }) ||
	isWritableBox({ [BOX]: true })
) {
	throw new Error("bits-ui: unrecognised svelte-toolbelt box markers");
}

class ReadonlyGetterBox<T> {
	readonly #getter: () => T;
	constructor(getter: () => T) {
		this.#getter = getter;
	}
	get current() {
		const getter = this.#getter;
		return getter();
	}
}
(ReadonlyGetterBox.prototype as unknown as Record<symbol, boolean>)[BOX] = true;

class WritableGetterBox<T> {
	readonly #getter: () => T;
	readonly #setter: (v: T) => void;
	readonly #derived = $derived.by(() => {
		const getter = this.#getter;
		return getter();
	});
	constructor(getter: () => T, setter: (v: T) => void) {
		this.#getter = getter;
		this.#setter = setter;
	}
	get current() {
		return this.#derived;
	}
	set current(v: T) {
		const setter = this.#setter;
		setter(v);
	}
}
(WritableGetterBox.prototype as unknown as Record<symbol, boolean>)[BOX] = true;
(WritableGetterBox.prototype as unknown as Record<symbol, boolean>)[WRITABLE] = true;

/**
 * Drop-in for svelte-toolbelt's `boxWith` that is much cheaper to create: one class
 * instance instead of an object literal with symbol keys and fresh accessor closures, and
 * no unused `$derived` for read-only boxes. Reads and writes behave the same.
 */
export function boxWith<T>(getter: () => T): ReadableBox<T>;
export function boxWith<T>(getter: () => T, setter: (v: T) => void): WritableBox<T>;
export function boxWith<T>(getter: () => T, setter?: (v: T) => void): ReadableBox<T> {
	// the marker symbols live on the prototypes, which TypeScript can't see
	return (
		setter ? new WritableGetterBox(getter, setter) : new ReadonlyGetterBox(getter)
	) as unknown as ReadableBox<T>;
}

class StateBox<T> {
	current = $state() as T;
	constructor(initialValue: T) {
		this.current = initialValue;
	}
}
(StateBox.prototype as unknown as Record<symbol, boolean>)[BOX] = true;
(StateBox.prototype as unknown as Record<symbol, boolean>)[WRITABLE] = true;

/** Drop-in for svelte-toolbelt's `simpleBox`, cheaper to create for the same reason. */
export function simpleBox<T>(initialValue: T): WritableBox<T> {
	return new StateBox(initialValue) as unknown as WritableBox<T>;
}
