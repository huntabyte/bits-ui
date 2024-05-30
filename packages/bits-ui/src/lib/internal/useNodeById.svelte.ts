import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { afterTick } from "./afterTick.js";

/**
 * Finds the node with that ID and sets it to the boxed node.
 * Reactive using `$effect.pre` to ensure when the ID changes, an update is triggered and
 * new node is found.
 *
 * @param id The boxed ID of the node to find.
 */
export function useNodeById(
	id: ReadableBox<string> | WritableBox<string>,
	mounted?: ReadableBox<boolean>
) {
	const node = box<HTMLElement | null>(null);

	if (mounted) {
		$effect(() => {
			// eslint-disable-next-line no-unused-expressions
			mounted.value;
			// eslint-disable-next-line no-unused-expressions
			id.value;
			afterTick(() => {
				node.value = document.getElementById(id.value);
			});
		});
	} else {
		$effect(() => {
			// eslint-disable-next-line no-unused-expressions
			id.value;
			node.value = document.getElementById(id.value);
		});
	}

	return node;
}
