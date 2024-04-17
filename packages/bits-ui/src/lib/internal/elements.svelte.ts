import type { Box, ReadonlyBox } from "./box.svelte.js";
import { withTick } from "./with-tick.js";

/**
 * Given a boxed ID of a node, finds the node with that ID and sets it to the boxed node.
 * Reactive using `$effect.pre` to ensure when the ID changes, an update is triggered and
 * new node is found.
 *
 * @param id The boxed ID of the node to find.
 * @param node The boxed node to set the found node to.
 */
export function useNodeById(id: ReadonlyBox<string> | Box<string>, node: Box<HTMLElement | null>) {
	$effect.pre(() => {
		// eslint-disable-next-line no-unused-expressions
		id.value;
		withTick(() => {
			node.value = document.getElementById(id.value);
		});
	});
}
