import type { Snippet } from "svelte";

export type PortalTarget = Element | string;

export type PortalProps = {
	/**
	 * Where to portal the content to.
	 *
	 * @default document.body
	 */
	to?: PortalTarget;

	/**
	 * Disable portalling and render the component inline
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * The children content to render within the portal.
	 */
	children?: Snippet;
};
