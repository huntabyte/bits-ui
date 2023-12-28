/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateToggleGroupProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitValue, OnChangeFn } from "$lib/internal/index.js";

type Props<T extends "single" | "multiple"> = Expand<
	OmitValue<CreateToggleGroupProps<T>> & {
		/**
		 * The value of the toggle group, which is a string or an array of strings,
		 * depending on the type of the toggle group.
		 *
		 * You can bind to this to programmatically control the value.
		 */
		value?: CreateToggleGroupProps<T>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateToggleGroupProps<T>["defaultValue"]>;

		/**
		 * The type of the toggle group.
		 *
		 * If the type is `"single"`, the toggle group allows only one item to be selected
		 * at a time. If the type is `"multiple"`, the toggle group allows multiple items
		 * to be selected at a time.
		 */
		type?: T;
	} & DOMElement
>;

type ItemProps = Expand<
	{
		/**
		 * The value of the toggle group item. When the toggle group item is selected,
		 * the toggle group's value will be set to this value if in `"single"` mode,
		 * or this value will be pushed to the toggle group's array value if in `"multiple"` mode.
		 *
		 * @required
		 */
		value: string;

		/**
		 * Whether the toggle group item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	} & DOMElement<HTMLButtonElement>
>;

export type { Props, ItemProps };
