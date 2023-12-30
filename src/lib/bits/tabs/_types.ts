/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { CreateTabsProps, TabsTriggerProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	ObjectVariation,
	OmitValue,
	OnChangeFn
} from "$lib/internal/index.js";

type Props = Expand<
	OmitValue<CreateTabsProps> & {
		/**
		 * The value of the currently active tab.
		 * You can bind this to a string value to programmatically control the active tab.
		 */
		value?: CreateTabsProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateTabsProps["defaultValue"]>;

		/**
		 * The orientation of the tabs, which determines how keyboard navigation works.
		 *
		 * @defaultValue "horizontal"
		 */
		orientation?: CreateTabsProps["orientation"] & {};
	} & DOMElement
>;

type ContentProps = Expand<
	{
		value: string;
	} & DOMElement
>;

type TriggerProps = Expand<ObjectVariation<TabsTriggerProps> & DOMElement<HTMLButtonElement>>;

type ListProps = DOMElement;

export type { Props, ContentProps, TriggerProps, ListProps };
