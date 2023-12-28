/**
 * Shared internal types for the various menu components.
 */
import type { DOMElement, OmitChecked, OmitFloating, OnChangeFn } from "$lib/internal/index.js";
import type {
	CreateContextMenuCheckboxItemProps,
	CreateContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	CreateContextSubmenuProps,
	CreateContextMenuProps
} from "@melt-ui/svelte";
import type { ArrowProps as FloatingArrowProps, ContentProps } from "$lib/bits/floating/_types.js";

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

export type SubTriggerProps = Expand<
	{
		/**
		 * Whether the subtrigger is disabled or not.
		 *
		 * @defaultValue false;
		 */
		disabled?: boolean;
	} & DOMElement
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
	} & DOMElement
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
	} & DOMElement
>;

export type RadioItemProps = Expand<ContextMenuRadioItemProps & DOMElement>;

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
	} & DOMElement
>;

export type ArrowProps = FloatingArrowProps;
export type GroupProps = DOMElement;
export type CheckboxIndicatorProps = DOMElement;
export type RadioIndicatorProps = DOMElement;
export type LabelProps = DOMElement;
export type SeparatorProps = DOMElement;
export type TriggerProps = DOMElement<HTMLElement>;

export { ContentProps, ContentProps as SubContentProps };
