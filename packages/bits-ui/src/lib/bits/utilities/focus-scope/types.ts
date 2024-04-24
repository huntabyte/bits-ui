import type { Snippet } from "svelte";
import type { FocusScopeContainerProps } from "./use-focus-scope.svelte.js";
import type { EventCallback } from "$lib/internal/events.js";

export type FocusScopeProps = {
	/**
	 * The ID of the focus scope container node.
	 */
	id: string;

	/**
	 * When `true` will loop through the tabbable elements in the focus scope.
	 *
	 * @defaultValue false
	 */
	loop?: boolean;

	/**
	 * Whether focus is trapped within the focus scope.
	 *
	 * @defaultValue false
	 */
	trapped?: boolean;

	/**
	 * Event handler called when auto-focusing onMount.
	 * Can be prevented.
	 */
	onMountAutoFocus?: EventCallback;

	/**
	 * Event handler called when auto-focusing onDestroy.
	 * Can be prevented.
	 */
	onDestroyAutoFocus?: EventCallback;

	focusScope?: Snippet<[{ props: FocusScopeContainerProps }]>;
};
