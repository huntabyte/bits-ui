/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateToolbarProps, CreateToolbarGroupProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitValue, OnChangeFn } from "$lib/internal/index.js";

type Props = Expand<CreateToolbarProps & DOMElement>;

type ButtonProps = DOMElement<HTMLButtonElement>;

type LinkProps = DOMElement<HTMLAnchorElement>;

type GroupProps<T extends "single" | "multiple"> = Expand<
	OmitValue<CreateToolbarGroupProps<T>> & {
		/**
		 * The value of the toolbar toggle group, which is a string or an array of strings,
		 * depending on the type of the toolbar toggle group.
		 *
		 * You can bind to this to programmatically control the value.
		 */
		value?: CreateToolbarGroupProps<T>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateToolbarGroupProps<T>["defaultValue"]>;

		/**
		 * The type of the toolbar toggle group.
		 *
		 * If the type is `"single"`, the toolbar toggle group allows only one item to be selected
		 * at a time. If the type is `"multiple"`, the toolbar toggle group allows multiple items
		 * to be selected at a time.
		 */
		type?: T;
	} & DOMElement
>;

type GroupItemProps = Expand<
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
		disabled?: boolean;
	} & DOMElement<HTMLButtonElement>
>;

export type { Props, ButtonProps, LinkProps, GroupProps, GroupItemProps };
