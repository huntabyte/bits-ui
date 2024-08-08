import { tick } from "svelte";
import type { AnyFn } from "./types.js";

/**
 * Calls the provided callback after the current tick.
 */
export function afterTick(cb: AnyFn) {
	tick().then(cb);
}
