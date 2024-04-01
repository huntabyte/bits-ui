import type { StoresValues, Writable } from "svelte/store";

type Options = Record<string, Writable<unknown>>;

export function getOptionUpdater(options: Options) {
	return function <
		K extends keyof typeof options,
		V extends StoresValues<(typeof options)[keyof typeof options]>
	>(key: K, value: V | undefined) {
		if (value === undefined) return;
		const store = options[key];
		if (store) {
			store.set(value as never);
		}
	};
}
