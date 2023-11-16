/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type {
	TransitionProps,
	AsChild,
	Expand,
	OmitOpen,
	OnChangeFn,
	Transition,
	OmitChecked
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	CreateDropdownMenuProps,
	CreateDropdownMenuRadioGroupProps,
	DropdownMenuRadioItemProps,
	CreateDropdownSubmenuProps,
	CreateDropdownMenuCheckboxItemProps
} from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<Omit<CreateDropdownMenuProps, "ids" | "arrowSize">> & {
		/**
		 * The open state of the dropdown menu.
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
	OmitChecked<CreateDropdownMenuCheckboxItemProps> & {
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
		 * You can bind this to a string value to programmatically control the value.
		 *
		 * @defaultValue undefined
		 */
		value?: CreateDropdownMenuRadioGroupProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateDropdownMenuRadioGroupProps["defaultValue"]>;
	} & AsChild
>;

type RadioItemProps = Expand<DropdownMenuRadioItemProps & AsChild>;

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
	OmitOpen<Omit<CreateDropdownSubmenuProps, "ids" | "arrowSize">> & {
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
> = Expand<
	{
		sideOffset?: number;
	} & TransitionProps<T, In, Out> &
		AsChild
>;

type SubTriggerProps = Expand<
	{
		disabled?: boolean;
	} & AsChild
>;

type TriggerProps = AsChild;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
>;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

export type {
	ArrowProps,
	CheckboxItemIndicatorProps,
	CheckboxItemProps,
	ContentProps,
	GroupProps,
	ItemEvents,
	ItemProps,
	LabelProps,
	Props,
	RadioGroupProps,
	RadioItemProps,
	SeparatorProps,
	SubContentProps,
	SubProps,
	SubTriggerProps,
	TriggerProps
};
