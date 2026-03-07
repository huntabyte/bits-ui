import type { Snippet } from "svelte";
import type { ReadableBox } from "svelte-toolbelt";
import type { TransitionState } from "$lib/internal/attrs.js";

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

	presence?: Snippet<
		[
			{
				present: boolean;
				transitionStatus: TransitionState;
			},
		]
	>;

	ref: ReadableBox<HTMLElement | null>;
};
