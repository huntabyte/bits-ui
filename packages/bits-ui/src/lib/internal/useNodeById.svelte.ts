import { type Getter, type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { afterTick } from "./afterTick.js";
import type { Box } from "./box.svelte.js";
import { untrack } from "svelte";
import { noop } from "./callbacks.js";

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

type UseRefByIdProps = {
	/**
	 * The ID of the node to find.
	 */
	id: Box<string>;

	/**
	 * The ref to set the node to.
	 */
	ref: WritableBox<HTMLElement | null>;

	/**
	 * A condition that determines whether the ref should be set or not.
	 */
	condition?: Getter<boolean>;

	/**
	 * A callback fired when the ref changes.
	 */
	onRefChange?: (node: HTMLElement | null) => void;
};

/**
 * Finds the node with that ID and sets it to the boxed node.
 * Reactive using `$effect` to ensure when the ID or condition changes,
 * an update is triggered and new node is found.
 *
 * @param id The boxed ID of the node to find.
 */
export function useRefById({
	id,
	ref,
	condition = () => true,
	onRefChange = noop,
}: UseRefByIdProps) {
	$effect(() => {
		// re-run when the ID changes.
		id.value;
		// re-run when the condition changes.
		if (condition()) {
			const node = document.getElementById(id.value);
			if (node !== ref.value) {
				untrack(() => (ref.value = node));
				untrack(() => onRefChange(node));
			}
		}
	});
}
