import { tick } from "svelte";
import type { AnyFn } from "./types.js";

/**
 * A utility function that executes a callback after the current tick.
 */
export function afterTick(cb: AnyFn) {
	tick().then(cb);
}
