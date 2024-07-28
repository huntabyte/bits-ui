import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type CollapsibleRootPropsWithoutHTML = WithChild<{
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

export type CollapsibleRootProps = CollapsibleRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CollapsibleRootPropsWithoutHTML>;

export type CollapsibleContentPropsWithoutHTML = WithChild<{
	/**
	 * Whether to force mount the content to the DOM.
	 *
	 * @defaultValue false
	 */
	forceMount?: boolean;
}>;

export type CollapsibleContentProps = CollapsibleContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CollapsibleContentPropsWithoutHTML>;

export type CollapsibleTriggerPropsWithoutHTML = WithChild;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, CollapsibleTriggerPropsWithoutHTML>;
