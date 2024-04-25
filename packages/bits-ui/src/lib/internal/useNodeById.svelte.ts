import { type ReadableBox, type WritableBox, box } from "runed";
import { afterTick } from "./after-tick.js";

/**
 * Finds the node with that ID and sets it to the boxed node.
 * Reactive using `$effect.pre` to ensure when the ID changes, an update is triggered and
 * new node is found.
 *
 * @param id The boxed ID of the node to find.
 */
export function useNodeById(id: ReadableBox<string> | WritableBox<string>) {
	const node = box<HTMLElement | null>(null);

	$effect.pre(() => {
		// eslint-disable-next-line no-unused-expressions
		id.value;
		afterTick(() => {
			node.value = document.getElementById(id.value);
		});
	});

	return node;
}
