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

	/**
	 * Whether to force mount the portal content for more
	 * advanced animation control
	 *
	 * @defaultValue false
	 *
	 */
	forceMount?: boolean;

	/**
	 * The id of the portal content
	 */
	id?: string;

	children?: Snippet;
};
