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
	 * The presence status.
	 */
	present: boolean;

	presence?: Snippet<[{ present: { current: boolean } }]>;

	ref: ReadableBox<HTMLElement | null>;
};
