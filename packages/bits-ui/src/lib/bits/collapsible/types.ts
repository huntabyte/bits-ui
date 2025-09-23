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
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Whether the collapsible is open.
	 *
	 * @default false
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback function called when the open state changes complete.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;
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
		 * @default false
		 */
		forceMount?: boolean;

		/**
		 * Whether to allow the browser to expand the content when searching for content
		 * within the panel via the browser's built-in search functionality.
		 *
		 * When `true`, this prop will override the `forceMount` prop.
		 *
		 * @default true
		 */
		hiddenUntilFound?: boolean;
	},
	CollapsibleContentSnippetProps
>;

export type CollapsibleContentProps = CollapsibleContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CollapsibleContentPropsWithoutHTML>;

export type CollapsibleTriggerPropsWithoutHTML = WithChild;

export type CollapsibleTriggerProps = CollapsibleTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CollapsibleTriggerPropsWithoutHTML>;
