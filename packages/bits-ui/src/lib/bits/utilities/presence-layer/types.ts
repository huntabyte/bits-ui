import type { Snippet } from "svelte";
import type { ReadableBox } from "svelte-toolbelt";

export type PresenceLayerProps = {
	/**
	 * Whether to force mount the component.
	 */
	forceMount?: boolean;
};

export type PresenceLayerImplProps = PresenceLayerProps & {
	/**
	 * The open state of the component.
	 */
	open: boolean;

	presence?: Snippet<[{ present: boolean }]>;

	ref: ReadableBox<HTMLElement | null>;
};
