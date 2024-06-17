import { type Getter, type WritableBox } from "svelte-toolbelt";
import type { Box } from "./box.svelte.js";
import { untrack } from "svelte";
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
		condition();
		// re-run when the condition changes.
		untrack(() => {
			const node = document.getElementById(id.value);
			ref.value = node;
			onRefChange(ref.value);
		});
	});
}
