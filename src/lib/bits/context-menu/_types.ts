/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type {
	AsChild,
	Expand,
	OmitChecked,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { _ArrowProps } from "$lib/shared/types.js";
import type {
	CreateContextMenuProps,
	CreateContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	CreateContextSubmenuProps,
	CreateContextMenuCheckboxItemProps
} from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<Omit<CreateContextMenuProps, "ids" | "arrowSize">> & {
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

type CheckboxItemProps = Expand<
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

type RadioGroupProps = Expand<
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

type RadioItemProps = Expand<ContextMenuRadioItemProps & AsChild>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & TransitionProps<T, In, Out> &
		AsChild
>;

type GroupProps = AsChild;

type ItemProps = Expand<
	{
		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & AsChild
>;

type CheckboxItemIndicatorProps = AsChild;
type LabelProps = AsChild;
type SeparatorProps = AsChild;

type SubProps = Expand<
	OmitOpen<Omit<CreateContextSubmenuProps, "ids" | "arrowSize">> & {
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

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild>;

type SubTriggerProps = Expand<
	{
		/**
		 * Whether the subtrigger is disabled or not.
		 *
		 * @defaultValue false;
		 */
		disabled?: boolean;
	} & AsChild
>;

type TriggerProps = AsChild;

type ArrowProps = _ArrowProps;

export type {
	Props,
	ArrowProps,
	CheckboxItemProps,
	ContentProps,
	GroupProps,
	ItemProps,
	CheckboxItemIndicatorProps,
	LabelProps,
	RadioGroupProps,
	RadioItemProps,
	SeparatorProps,
	SubProps,
	SubContentProps,
	SubTriggerProps,
	TriggerProps
};
