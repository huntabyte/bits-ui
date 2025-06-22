import type { Snippet } from "svelte";
import type { EventCallback } from "$lib/internal/events.js";
import type { ReadableBox } from "svelte-toolbelt";

export type FocusScopeProps = {
	/**
	 * Event handler called when auto-focusing on open.
	 * Can be prevented.
	 */
	onOpenAutoFocus?: EventCallback;

	/**
	 * Event handler called when auto-focusing on close.
	 * Can be prevented.
	 */
	onCloseAutoFocus?: EventCallback;

	/**
	 * Whether focus is trapped within the focus scope.
	 *
	 * @defaultValue false
	 */
	trapFocus?: boolean;
};

export type FocusScopeImplProps = {
	/**
	 * The snippet to render the focus scope container with its props.
	 */
	focusScope?: Snippet<[{ props: Record<string, unknown> }]>;

	/**
	 * When `true` will loop through the tabbable elements in the focus scope.
	 */
	loop?: boolean;

	/**
	 * Whether the content within the focus trap is being force mounted or not.
	 */
	forceMount?: boolean;

	enabled: boolean;

	ref: ReadableBox<HTMLElement | null>;
} & FocusScopeProps;
