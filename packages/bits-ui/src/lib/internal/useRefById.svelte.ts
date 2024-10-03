import type { Getter, WritableBox } from "svelte-toolbelt";
import { untrack } from "svelte";
import type { Box } from "./box.svelte.js";
import { noop } from "./callbacks.js";

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
	 * A reactive condition that will cause the node to be set.
	 */
	deps?: Getter<unknown>;

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
 */
export function useRefById({ id, ref, deps = () => true, onRefChange = noop }: UseRefByIdProps) {
	$effect(() => {
		// re-run when the ID changes.
		id.current;
		// re-run when the deps change
		deps();
		untrack(() => {
			const node = document.getElementById(id.current);
			ref.current = node;
			onRefChange(ref.current);
		});
	});

	$effect(() => {
		return () => {
			ref.current = null;
			onRefChange(null);
		};
	});
}
