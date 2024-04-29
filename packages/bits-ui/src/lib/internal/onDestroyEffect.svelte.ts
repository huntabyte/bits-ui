import type { AnyFn } from "./types.js";

export function onDestroyEffect(cb: AnyFn) {
	$effect(() => {
		return cb;
	});
}
