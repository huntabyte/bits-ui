import { onDestroyEffect } from "svelte-toolbelt";
import type { AnyFn } from "./types.js";

export class TimeoutFn<T extends AnyFn> {
	readonly #interval: number | (() => number);
	readonly #cb: T;
	#timer: number | null = null;

	/**
	 * `interval` may be a getter, resolved each time the timeout starts — this
	 * lets callers with a reactive delay create a single instance instead of
	 * recreating one (with its own destroy effect) whenever the delay changes.
	 */
	constructor(cb: T, interval: number | (() => number)) {
		this.#cb = cb;
		this.#interval = interval;

		this.stop = this.stop.bind(this);
		this.start = this.start.bind(this);

		onDestroyEffect(this.stop);
	}

	#clear() {
		if (this.#timer !== null) {
			window.clearTimeout(this.#timer);
			this.#timer = null;
		}
	}

	stop() {
		this.#clear();
	}

	start(...args: Parameters<T> | []) {
		this.#clear();
		const interval =
			typeof this.#interval === "function" ? this.#interval() : this.#interval;
		this.#timer = window.setTimeout(() => {
			this.#timer = null;

			this.#cb(...args);
		}, interval);
	}
}
