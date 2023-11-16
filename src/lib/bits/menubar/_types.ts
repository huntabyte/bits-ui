/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type {
	AsChild,
	Expand,
	OmitChecked,
	OmitValue,
	OnChangeFn,
	OmitIds,
	OmitFloating
} from "$lib/internal/index.js";
import type {
	FloatingArrowProps,
	MenuContentProps,
	MenuSubTriggerProps
} from "$lib/shared/index.js";
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
	OmitFloating<CreateMenubarMenuProps> & {
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
	OmitFloating<CreateMenubarSubmenuProps> & {
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

type TriggerProps = AsChild;

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	FloatingArrowProps as ArrowProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	MenuContentProps as ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	MenuContentProps as SubContentProps,
	MenuSubTriggerProps as SubTriggerProps,
	CheckboxItemProps,
	CheckboxIndicatorProps
};
