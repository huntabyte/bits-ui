import type { Snippet } from "svelte";

export type PresenceLayerProps = {
	/**
	 * The presence status.
	 */
	present: boolean;

	/**
	 * Whether to force mount the component.
	 */
	forceMount?: boolean;

	presence?: Snippet<[{ present: { value: boolean } }]>;

	id: string;
};
