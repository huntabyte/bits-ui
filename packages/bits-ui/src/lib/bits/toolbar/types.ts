import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type {
	CreateToolbarGroupProps as MeltToolbarGroupProps,
	CreateToolbarProps as MeltToolbarProps,
} from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type ToolbarPropsWithoutHTML = Expand<MeltToolbarProps & DOMElement>;

export type ToolbarButtonPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type ToolbarLinkPropsWithoutHTML = DOMElement<HTMLAnchorElement>;

export type ToolbarGroupPropsWithoutHTML<T extends "single" | "multiple"> = Expand<
	OmitValue<MeltToolbarGroupProps<T>> & {
		/**
		 * The value of the toolbar toggle group, which is a string or an array of strings,
		 * depending on the type of the toolbar toggle group.
		 *
		 * You can bind to this to programmatically control the value.
		 */
		value?: MeltToolbarGroupProps<T>["defaultValue"] | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltToolbarGroupProps<T>["defaultValue"]> | undefined;

		/**
		 * The type of the toolbar toggle group.
		 *
		 * If the type is `"single"`, the toolbar toggle group allows only one item to be selected
		 * at a time. If the type is `"multiple"`, the toolbar toggle group allows multiple items
		 * to be selected at a time.
		 */
		type?: T | undefined;
	} & DOMElement
>;

export type ToolbarGroupItemPropsWithoutHTML = Expand<
	{
		/**
		 * The value of the toolbar toggle group item. When the toolbar toggle group item is selected,
		 * the toolbar toggle group's value will be set to this value if in `"single"` mode,
		 * or this value will be pushed to the toolbar toggle group's array value if in `"multiple"` mode.
		 *
		 * @required
		 */
		value: string;

		/**
		 * Whether the toolbar toggle group item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | undefined;
	} & DOMElement<HTMLButtonElement>
>;

//

export type ToolbarProps = ToolbarPropsWithoutHTML & HTMLDivAttributes;

export type ToolbarButtonProps = ToolbarButtonPropsWithoutHTML & HTMLButtonAttributes;

export type ToolbarLinkProps = ToolbarLinkPropsWithoutHTML & HTMLAnchorAttributes;

export type ToolbarGroupProps<T extends "single" | "multiple"> = ToolbarGroupPropsWithoutHTML<T> &
	HTMLDivAttributes;

export type ToolbarGroupItemProps = ToolbarGroupItemPropsWithoutHTML & HTMLButtonAttributes;

/**
 * Events
 */
type HTMLEventHandler<T extends Event = Event, E extends Element = Element> = T & {
	currentTarget: EventTarget & E;
};

export type ToolbarButtonEvents<T extends Element = HTMLButtonElement> = {
	click: HTMLEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type ToolbarLinkEvents<T extends Element = HTMLAnchorElement> = {
	click: HTMLEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type ToolbarGroupItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
