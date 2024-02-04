import type { ElementRef } from "$lib/internal/types.js";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

export type FocusScopeProps = {
	/**
	 * When `true`, tabbing from the last item will focus the first
	 * tabbable item. And vice versa for shift+tabbing from the first item.
	 *
	 * @default false
	 */
	loop?: boolean;

	/**
	 * When `true`, focus cannot escape the focus scope via keyboard, pointer,
	 * or programmatic focus.
	 *
	 * @default false
	 */
	trapped?: boolean;

	/**
	 * Event handler called when auto-focusing on mount. Can be prevented by
	 * calling `event.preventDefault()`.
	 */
	onMountAutoFocus?: (event: Event) => void;

	/**
	 * Event handler called wehn auto-focusing on destroy. Can be prevented by
	 * calling `event.preventDefault()`.
	 */
	onDestroyAutoFocus?: (event: Event) => void;

	FocusScope: Snippet<[FocusScopeSnippetProps]>;
} & HTMLProps;

type FocusScopeSnippetProps = {
	tabindex: number;
	onkeydown: (event: KeyboardEvent) => void;
	el: ElementRef;
};

interface HTMLProps extends HTMLAttributes<HTMLElement> {}
