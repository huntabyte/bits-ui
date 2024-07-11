import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithChild,
	Without,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/index.js";

type BaseToggleGroupProps = {
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

export type SingleToggleGroupPropsWithoutHTML = WithChild<
	BaseToggleGroupProps & {
		type: "single";
		value?: string;
		onValueChange?: OnChangeFn<string>;
	}
>;

export type SingleToggleGroupRootProps = SingleToggleGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, SingleToggleGroupPropsWithoutHTML>;

export type MultipleToggleGroupPropsWithoutHTML = WithChild<BaseToggleGroupProps> & {
	type: "multiple";
	value?: string[];
	onValueChange?: OnChangeFn<string[]>;
};

export type MultipleToggleGroupRootProps = MultipleToggleGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MultipleToggleGroupPropsWithoutHTML>;

export type ToggleGroupRootPropsWithoutHTML =
	| SingleToggleGroupPropsWithoutHTML
	| MultipleToggleGroupPropsWithoutHTML;

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
