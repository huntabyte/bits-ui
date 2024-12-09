import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";

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

	/**
	 * Whether or not the collapsible is controlled or not. If `true`, the collapsible will not
	 * update the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;
}>;

export type CollapsibleRootProps = CollapsibleRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CollapsibleRootPropsWithoutHTML>;

export type CollapsibleContentSnippetProps = {
	open: boolean;
};

export type CollapsibleContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	{
		/**
		 * Whether to force mount the content to the DOM.
		 *
		 * @defaultValue false
		 */
		forceMount?: boolean;
	},
	CollapsibleContentSnippetProps
>;

export type CollapsibleContentProps = CollapsibleContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CollapsibleContentPropsWithoutHTML>;

export type CollapsibleTriggerPropsWithoutHTML = WithChild;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CollapsibleTriggerPropsWithoutHTML>;
