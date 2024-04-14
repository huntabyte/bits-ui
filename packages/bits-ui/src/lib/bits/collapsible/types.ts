import type { HTMLButtonAttributes } from "svelte/elements";
import type {
	EventCallback,
	HTMLDivAttributes,
	OnChangeFn,
	WithAsChild,
} from "$lib/internal/index.js";

export type CollapsibleRootPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether the collapsible is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether the collapsible is open.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type CollapsibleRootProps = CollapsibleRootPropsWithoutHTML & HTMLDivAttributes;

export type CollapsibleContentPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether to force mount the content to the DOM.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type CollapsibleContentProps = CollapsibleContentPropsWithoutHTML &
	Omit<HTMLDivAttributes, "id"> & {
		id?: string;
	};

export type CollapsibleTriggerPropsWithoutHTML = WithAsChild<{
	onclick?: EventCallback<MouseEvent>;
}>;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML &
	Omit<HTMLButtonAttributes, "onclick">;
