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
	OmitValue,
	OnChangeFn,
	Transition,
	TransitionProps,
	OmitIds
} from "$lib/internal/index.js";
import type {
	CreateMenubarProps,
	CreateMenubarMenuProps,
	CreateMenuCheckboxItemProps,
	CreateMenuRadioGroupProps,
	MenubarRadioItemProps,
	CreateMenubarSubmenuProps
} from "@melt-ui/svelte";

type Props = Expand<OmitIds<CreateMenubarProps> & AsChild>;

type MenuProps = Expand<
	OmitOpen<OmitIds<Omit<CreateMenubarMenuProps, "arrowSize">>> & {
		/**
		 * The open state of the menu.
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
	OmitChecked<CreateMenuCheckboxItemProps> & {
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

		/**
		 * Whether the checkbox item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & AsChild
>;

type RadioGroupProps = Expand<
	OmitValue<CreateMenuRadioGroupProps> & {
		/**
		 * The value of the radio group.
		 * You can bind this to a value to programmatically control the checked state.
		 *
		 * @defaultValue undefined
		 */
		value?: CreateMenuRadioGroupProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateMenuRadioGroupProps["defaultValue"]>;
	} & AsChild
>;

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
		 * Whether the menu item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & AsChild
>;

type CheckboxIndicatorProps = AsChild;

type LabelProps = AsChild;

type RadioItemProps = Expand<MenubarRadioItemProps & AsChild>;

type SeparatorProps = AsChild;

type SubProps = Expand<
	OmitIds<OmitOpen<Omit<CreateMenubarSubmenuProps, "arrowSize">>> & {
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
		/**
		 * The size of the arrow in pixels.
		 */
		size?: number;
	} & AsChild
>;

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	ArrowProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	CheckboxIndicatorProps
};
