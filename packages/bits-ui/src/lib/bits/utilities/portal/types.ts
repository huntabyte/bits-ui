import type { Snippet } from "svelte";

export type PortalProps = {
	/**
	 * Where to portal the content to.
	 *
	 * @defaultValue document.body
	 */
	to?: HTMLElement | string;

	/**
	 * Disable portaling and render the component inline
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	children?: Snippet;
};
