import { tick } from "svelte";

export function withTick(cb: () => void) {
	tick().then(cb);
}
