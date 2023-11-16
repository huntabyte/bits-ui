/**
 * Shared internal types for the various menu components.
 */
import type {
	AsChild,
	OmitChecked,
	OmitFloating,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type {
	CreateContextMenuCheckboxItemProps,
	CreateContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	CreateContextSubmenuProps,
	CreateContextMenuProps
} from "@melt-ui/svelte";
import type {
	ContentProps as FloatingContentProps,
	ArrowProps as FloatingArrowProps
} from "$lib/bits/floating/_types.js";

export type Props = Expand<
	OmitFloating<CreateContextMenuProps> & {
		/**
		 * The open state of the context menu.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & FloatingContentProps<T, In, Out> &
		AsChild
>;

export type SubTriggerProps = Expand<
	{
		/**
		 * Whether the subtrigger is disabled or not.
		 *
		 * @defaultValue false;
		 */
		disabled?: boolean;
	} & AsChild
>;

export type CheckboxItemProps = Expand<
	OmitChecked<CreateContextMenuCheckboxItemProps> & {
		/**
		 * The checked state of the checkbox item.
		 * You can bind this to a boolean value to programmatically control the checked state.
		 *
		 * @defaultValue false
		 */
		checked?: boolean | "indeterminate";

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	} & AsChild
>;

export type RadioGroupProps = Expand<
	{
		/**
		 * The value of the radio group.
		 *
		 * @defaultValue undefined
		 */
		value?: CreateContextMenuRadioGroupProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateContextMenuRadioGroupProps["defaultValue"]>;
	} & AsChild
>;

export type RadioItemProps = Expand<ContextMenuRadioItemProps & AsChild>;

export type SubProps = Expand<
	OmitFloating<CreateContextSubmenuProps> & {
		/**
		 * The open state of the submenu.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @defaultValue false
		 */
		open?: boolean;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

export type ItemProps = Expand<
	{
		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & AsChild
>;

export type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	TransitionProps<T, In, Out> & {
		sideOffset?: number;
	} & AsChild
>;

export type ArrowProps = FloatingArrowProps;
export type GroupProps = AsChild;
export type CheckboxItemIndicatorProps = AsChild;
export type LabelProps = AsChild;
export type SeparatorProps = AsChild;
export type TriggerProps = AsChild;
