import { onDestroyEffect } from "svelte-toolbelt";
import type { AnyFn } from "./types.js";
import { BROWSER } from "esm-env";

type TimeoutFnOptions = {
	/**
	 * Start the timer immediate after calling this function
	 *
	 * @default true
	 */
	immediate?: boolean;
};

const defaultOpts: TimeoutFnOptions = {
	immediate: true,
};

export class TimeoutFn<T extends AnyFn> {
	readonly #opts: TimeoutFnOptions;
	readonly #interval: number;
	readonly #cb: T;
	#timer: number | null = null;

	constructor(cb: T, interval: number, opts: TimeoutFnOptions = {}) {
		this.#cb = cb;
		this.#interval = interval;
		this.#opts = { ...defaultOpts, ...opts };

		this.stop = this.stop.bind(this);
		this.start = this.start.bind(this);

		if (this.#opts.immediate && BROWSER) {
			this.start();
		}

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
		this.#timer = window.setTimeout(() => {
			this.#timer = null;

			this.#cb(...args);
		}, this.#interval);
	}
}
