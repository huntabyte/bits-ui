/**
 * These types are shared between the various menu components,
 * such as `DropdownMenu`, `Menubar` & `ContextMenu`.
 */

import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type {
	CreateContextMenuCheckboxItemProps as MeltContextMenuCheckboxItemProps,
	CreateContextMenuProps as MeltContextMenuProps,
	CreateContextMenuRadioGroupProps as MeltContextMenuRadioGroupProps,
	ContextMenuRadioItemProps as MeltContextMenuRadioItemProps,
	CreateContextSubmenuProps as MeltContextSubmenuProps,
} from "@melt-ui/svelte";
import type {
	DOMEl,
	DOMElement,
	HTMLDivAttributes,
	OmitChecked,
	OmitFloating,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { ContentProps as MenuContentProps } from "$lib/bits/floating/types.js";

import type {
	ArrowProps as MenuArrowPropsWithoutHTML,
	ContentProps as MenuContentPropsWithoutHTML,
} from "$lib/bits/floating/_types.js";

export type MenuPropsWithoutHTML = Expand<
	OmitFloating<MeltContextMenuProps> & {
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

export type MenuSubTriggerPropsWithoutHTML = Expand<
	{
		/**
		 * Whether the subtrigger is disabled or not.
		 *
		 * @defaultValue false;
		 */
		disabled?: boolean;
	} & DOMElement
>;

export type MenuCheckboxItemPropsWithoutHTML = Expand<
	OmitChecked<MeltContextMenuCheckboxItemProps> & {
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

export type MenuRadioGroupPropsWithoutHTML = Expand<
	{
		/**
		 * The value of the radio group.
		 *
		 * @defaultValue undefined
		 */
		value?: MeltContextMenuRadioGroupProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltContextMenuRadioGroupProps["defaultValue"]>;
	} & DOMElement
>;

export type MenuRadioItemPropsWithoutHTML = Expand<MeltContextMenuRadioItemProps & DOMElement>;

export type MenuSubPropsWithoutHTML = Expand<
	OmitFloating<MeltContextSubmenuProps> & {
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

export type MenuItemPropsWithoutHTML = Expand<
	{
		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & DOMElement
>;

export type MenuGroupPropsWithoutHTML = DOMElement;
export type MenuCheckboxIndicatorPropsWithoutHTML = DOMElement;
export type MenuRadioIndicatorPropsWithoutHTML = DOMElement;
export type MenuLabelPropsWithoutHTML = DOMElement;
export type MenuSeparatorPropsWithoutHTML = DOMElement;
export type MenuTriggerPropsWithoutHTML = DOMElement<HTMLElement>;

export type {
	MenuContentPropsWithoutHTML,
	MenuContentPropsWithoutHTML as MenuSubContentPropsWithoutHTML,
	MenuArrowPropsWithoutHTML,
};

//

export type MenuProps = MenuPropsWithoutHTML;

export type MenuCheckboxItemProps = MenuCheckboxItemPropsWithoutHTML & HTMLDivAttributes;

export type MenuRadioGroupProps = MenuRadioGroupPropsWithoutHTML & HTMLDivAttributes;

export type MenuRadioItemProps = MenuRadioItemPropsWithoutHTML & HTMLDivAttributes;

export type MenuGroupProps = MenuGroupPropsWithoutHTML & HTMLDivAttributes;

type MenuAnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
} & DOMEl<HTMLAnchorElement>;

type MenuDivElement = HTMLDivAttributes & {
	href?: never;
} & DOMEl;

export type MenuItemProps = Omit<MenuItemPropsWithoutHTML, "el"> &
	(MenuAnchorElement | MenuDivElement);

export type MenuCheckboxIndicatorProps = MenuCheckboxIndicatorPropsWithoutHTML & HTMLDivAttributes;

export type MenuRadioIndicatorProps = MenuRadioIndicatorPropsWithoutHTML & HTMLDivAttributes;

export type MenuLabelProps = MenuLabelPropsWithoutHTML & HTMLDivAttributes;

export type MenuSeparatorProps = MenuSeparatorPropsWithoutHTML & HTMLDivAttributes;

export type MenuSubProps = MenuSubPropsWithoutHTML;

export type MenuSubTriggerProps = MenuSubTriggerPropsWithoutHTML & HTMLDivAttributes;

// Trigger for context menu
export type ContextTriggerProps = Omit<MenuTriggerPropsWithoutHTML, "el"> &
	HTMLDivAttributes &
	DOMEl;

// Trigger for dropdown menu & menubar menu
export type DropdownTriggerProps = Omit<MenuTriggerPropsWithoutHTML, "el"> &
	HTMLButtonAttributes &
	DOMEl<HTMLButtonElement>;

export type MenuArrowProps = MenuArrowPropsWithoutHTML & HTMLDivAttributes;

export type MenuItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
};

export type MenuCheckboxItemEvents = MenuItemEvents;

export type MenuRadioItemEvents = MenuItemEvents;

export type MenuSubTriggerEvents = Omit<MenuItemEvents, "pointerdown">;

// Trigger events used by the context menu
export type ContextTriggerEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	contextmenu: CustomEventHandler<MouseEvent, T>;
};

// Trigger events used by the dropdown
export type DropdownTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

// Trigger events used by the menubar
export type MenubarTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
};

export type MenuSubContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

export type MenuContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type { MenuContentProps, MenuContentProps as MenuSubContentProps };

export type { DropdownTriggerProps as MenubarTriggerProps };
