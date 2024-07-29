import type { Snippet } from "svelte";
import type { FocusScopeContainerProps } from "./useFocusScope.svelte.js";
import type { EventCallback } from "$lib/internal/events.js";

export type FocusScopeProps = {
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

	/**
	 * When `true` will loop through the tabbable elements in the focus scope.
	 *
	 * @defaultValue false
	 */
	loop?: boolean;
};

export type FocusScopeImplProps = {
	/**
	 * The ID of the focus scope container node.
	 */
	id: string;

	/**
	 * Whether focus is trapped within the focus scope.
	 *
	 * @defaultValue false
	 */
	trapped?: boolean;

	/**
	 * The snippet to render the focus scope container with its props.
	 */
	focusScope?: Snippet<[{ props: FocusScopeContainerProps }]>;
} & FocusScopeProps;
