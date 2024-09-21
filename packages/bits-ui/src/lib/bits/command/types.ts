import type {
	PrimitiveDivAttributes,
	PrimitiveInputAttributes,
	WithChild,
	Without,
} from "$lib/shared/index.js";

export type CommandState = {
	/** The value of the search query */
	search: string;
	/** The value of the selected command menu item */
	value: string;
	/** The filtered items */
	filtered: {
		/** The count of all visible items. */
		count: number;
		/** Map from visible item id to its search store. */
		items: Map<string, number>;
		/** Set of groups with at least one visible item. */
		groups: Set<string>;
	};
};

export type CommandRootPropsWithoutHTML = WithChild<{
	/**
	 * Controlled state store for the command menu.
	 * Initialize state using the `createState` function.
	 */
	state?: CommandState;

	/**
	 * An accessible label for the command menu.
	 * Not visible & only used for screen readers.
	 */
	label?: string;

	/**
	 * Optionally set to `false` to turn off the automatic filtering
	 * and sorting. If `false`, you must conditionally render valid
	 * items yourself.
	 */
	shouldFilter?: boolean;

	/**
	 * A custom filter function for whether each command item should
	 * match the query. It should return a number between `0` and `1`,
	 * with `1` being a perfect match, and `0` being no match, resulting
	 * in the item being hidden entirely.
	 *
	 * By default, it will use the `command-score` package to score.
	 */
	filter?: (value: string, search: string) => number;

	/**
	 * Optionally provide or bind to the selected command menu item.
	 */
	value?: string;

	/**
	 * A function that is called when the selected command menu item
	 * changes. It receives the new value as an argument.
	 */
	onValueChange?: (value: string) => void;

	/**
	 * Optionally set to `true` to enable looping through the items
	 * when the user reaches the end of the list using the keyboard.
	 */
	loop?: boolean;
}>;

export type CommandRootProps = CommandRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandRootPropsWithoutHTML>;

export type CommandEmptyPropsWithoutHTML = WithChild;

export type CommandEmptyProps = CommandEmptyPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandEmptyPropsWithoutHTML>;

export type CommandGroupPropsWithoutHTML = WithChild<{
	/**
	 * A unique value for the group.
	 */
	value: string;

	/**
	 * Whether to force mount the group container regardless of
	 * filtering logic.
	 */
	forceMount?: boolean;
}>;

export type CommandGroupProps = CommandGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandGroupPropsWithoutHTML>;

export type CommandGroupHeadingPropsWithoutHTML = WithChild;

export type CommandGroupHeadingProps = CommandGroupHeadingPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandGroupHeadingPropsWithoutHTML>;

export type CommandGroupItemsPropsWithoutHTML = WithChild;

export type CommandGroupItemsProps = CommandGroupItemsPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandGroupItemsPropsWithoutHTML>;

export type CommandItemPropsWithoutHTML = WithChild<{
	/**
	 * Whether the item is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * A callback that is fired when the item is selected, either via
	 * click or keyboard selection.
	 */
	onSelect?: () => void;

	/**
	 * A unique value for this item that will be used when filtering
	 * and ranking the items. If not provided, an attempt will be made
	 * to use the `textContent` of the item. If the `textContent` is dynamic,
	 * you will need to provide a stable unique value for the item.
	 */
	value?: string;

	/**
	 * Whether to always mount the item regardless of filtering logic.
	 */
	forceMount?: boolean;
}>;

export type CommandItemProps = CommandItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandItemPropsWithoutHTML>;

export type CommandInputPropsWithoutHTML = WithChild;

export type CommandInputProps = CommandInputPropsWithoutHTML &
	Without<PrimitiveInputAttributes, CommandInputPropsWithoutHTML>;

export type CommandListPropsWithoutHTML = WithChild;

export type CommandListProps = CommandListPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandListPropsWithoutHTML>;

export type CommandSeparatorPropsWithoutHTML = WithChild<{
	/**
	 * Whether to force mount the separator container regardless of
	 * filtering logic.
	 */
	forceMount?: boolean;
}>;

export type CommandSeparatorProps = CommandSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandSeparatorPropsWithoutHTML>;

export type CommandLoadingPropsWithoutHTML = WithChild<{
	/**
	 * The current progress of the loading state.
	 * This is a number between `0` and `100`.
	 */
	progress?: number;
}>;

export type CommandLoadingProps = CommandLoadingPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandLoadingPropsWithoutHTML>;

export type CommandListViewportPropsWithoutHTML = WithChild;

export type CommandListViewportProps = CommandListViewportPropsWithoutHTML &
	Without<PrimitiveDivAttributes, CommandListViewportPropsWithoutHTML>;
