import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
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

export type SingleToggleGroupProps = BaseToggleGroupProps & {
	type: "single";
	value?: string;
	onValueChange?: OnChangeFn<string>;
};

export type MultipleToggleGroupProps = BaseToggleGroupProps & {
	type: "multiple";
	value?: string[];
	onValueChange?: OnChangeFn<string[]>;
};

export type ToggleGroupRootPropsWithoutHTML =
	| WithAsChild<SingleToggleGroupProps>
	| WithAsChild<MultipleToggleGroupProps>;

export type ToggleGroupRootProps = ToggleGroupRootPropsWithoutHTML & PrimitiveDivAttributes;

export type ToggleGroupItemPropsWithoutHTML = WithAsChild<{
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

	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type ToggleGroupItemProps = ToggleGroupItemPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "disabled" | "onclick" | "onkeydown">;
