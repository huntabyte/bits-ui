import { tick } from "svelte";

export function afterTick(cb: () => void) {
	tick().then(cb);
}
