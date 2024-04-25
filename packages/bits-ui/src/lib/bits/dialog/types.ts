import type { Snippet } from "svelte";
import type { OnChangeFn, WithAsChild } from "$lib/internal/types.js";

export type DialogRootPropsWithoutHTML = {
	/**
	 * The open state of the dialog.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	children?: Snippet;
};
