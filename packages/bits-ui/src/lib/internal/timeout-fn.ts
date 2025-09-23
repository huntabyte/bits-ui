import { onDestroyEffect } from "svelte-toolbelt";
import type { AnyFn } from "./types.js";

export class TimeoutFn<T extends AnyFn> {
	readonly #interval: number;
	readonly #cb: T;
	#timer: number | null = null;

	constructor(cb: T, interval: number) {
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
		console.log("stopping timeout");
		this.#clear();
	}

	start(...args: Parameters<T> | []) {
		console.log("starting timeout");
		this.#clear();
		this.#timer = window.setTimeout(() => {
			this.#timer = null;

			this.#cb(...args);
		}, this.#interval);
	}
}
