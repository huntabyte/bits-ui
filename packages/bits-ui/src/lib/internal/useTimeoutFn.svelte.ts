import { box } from "svelte-toolbelt";
import { onDestroy } from "svelte";
import type { Box } from "./box.svelte.js";
import type { AnyFn, Fn } from "./types.js";
import { isBrowser } from "./is.js";

export type UseTimeoutFnOptions = {
	/**
	 * Start the timer immediate after calling this function
	 *
	 * @default true
	 */
	immediate?: boolean;
};

export type Stoppable<StartFnArgs extends unknown[] = unknown[]> = {
	/**
	 * A ref indicate whether a stoppable instance is executing
	 */
	isPending: Readonly<Box<boolean>>;

	/**
	 * Stop the effect from executing
	 */
	stop: Fn;

	/**
	 * Start the effects
	 */
	start: (...args: StartFnArgs) => void;
};

export function useTimeoutFn<T extends AnyFn>(
	cb: T,
	interval: number,
	options: UseTimeoutFnOptions = {}
): Stoppable<Parameters<T> | []> {
	const { immediate = true } = options;

	const isPending = box(false);

	let timer: NodeJS.Timeout | null;

	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	function stop() {
		isPending.value = false;
		clear();
	}

	function start(...args: Parameters<T> | []) {
		clear();
		isPending.value = true;
		timer = setTimeout(() => {
			isPending.value = false;
			timer = null;

			cb(...args);
		}, interval);
	}

	if (immediate) {
		isPending.value = true;
		if (isBrowser) start();
	}

	onDestroy(() => {
		stop();
	});

	return {
		isPending: box.readonly(isPending),
		start,
		stop,
	};
}
