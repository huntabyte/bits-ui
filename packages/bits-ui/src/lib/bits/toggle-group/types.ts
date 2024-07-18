import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithChild,
	Without,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/index.js";

export type BaseToggleGroupRootProps = {
	/**
	 * Whether the toggle group is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether to loop through the items when reaching the end
	 * when using the keyboard.
	 *
	 * @defaultValue true
	 */
	loop?: boolean;

	/**
	 * The orientation of the toggle group. Used to handle keyboard
	 * navigation between items.
	 *
	 * @defaultValue 'horizontal'
	 */
	orientation?: Orientation;

	/**
	 * Whether to enable roving focus or not. When enabled, users
	 * navigate between the items using the arrow keys. When disabled,
	 * users navigate between the items using the tab key.
	 */
	rovingFocus?: boolean;
};

export type SingleToggleGroupRootPropsWithoutHTML = WithChild<
	BaseToggleGroupRootProps & {
		type: "single";
		value?: string;
		onValueChange?: OnChangeFn<string>;
	}
>;

export type SingleToggleGroupRootProps = SingleToggleGroupRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SingleToggleGroupRootPropsWithoutHTML>;

export type MultipleToggleGroupRootPropsWithoutHTML = WithChild<BaseToggleGroupRootProps> & {
	type: "multiple";
	value?: string[];
	onValueChange?: OnChangeFn<string[]>;
};

export type MultipleToggleGroupRootProps = MultipleToggleGroupRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MultipleToggleGroupRootPropsWithoutHTML>;

export type ToggleGroupRootPropsWithoutHTML =
	| SingleToggleGroupRootPropsWithoutHTML
	| MultipleToggleGroupRootPropsWithoutHTML;

export type ToggleGroupRootProps = ToggleGroupRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ToggleGroupRootPropsWithoutHTML>;

export type ToggleGroupItemSnippetProps = {
	pressed: boolean;
};

export type ToggleGroupItemPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the toggle item is disabled or not.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * The value of the toggle item.
		 */
		value: string;
	},
	ToggleGroupItemSnippetProps
>;

export type ToggleGroupItemProps = ToggleGroupItemPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, ToggleGroupItemPropsWithoutHTML>;
