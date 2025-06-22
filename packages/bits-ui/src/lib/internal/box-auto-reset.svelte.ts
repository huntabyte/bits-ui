import { type WritableBox, box } from "svelte-toolbelt";
import { noop } from "./noop.js";

type BoxAutoResetOptions<T> = {
	afterMs?: number;
	onChange?: (value: T) => void;
	getWindow: () => Window & typeof globalThis;
};

const defaultOptions: Partial<BoxAutoResetOptions<unknown>> = {
	afterMs: 10000,
	onChange: noop,
};

/**
 * Creates a box which will be reset to the default value after some time.
 *
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function boxAutoReset<T>(defaultValue: T, options: BoxAutoResetOptions<T>): WritableBox<T> {
	const { afterMs, onChange, getWindow } = { ...defaultOptions, ...options };

	let timeout: number | null = null;
	let value = $state(defaultValue);

	function resetAfter() {
		return getWindow().setTimeout(() => {
			value = defaultValue;
			onChange?.(defaultValue);
		}, afterMs);
	}

	$effect(() => {
		return () => {
			if (timeout) getWindow().clearTimeout(timeout);
		};
	});

	return box.with(
		() => value,
		(v) => {
			value = v;
			onChange?.(v);
			if (timeout) getWindow().clearTimeout(timeout);
			timeout = resetAfter();
		}
	);
}
