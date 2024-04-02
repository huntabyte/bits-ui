import type { HTMLButtonAttributes } from "svelte/elements";
import type {
	CreateTabsProps as MeltTabsProps,
	TabsTriggerProps as MeltTabsTriggerProps,
} from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type TabsPropsWithoutHTML = Expand<
	OmitValue<MeltTabsProps> & {
		/**
		 * The value of the currently active tab.
		 * You can bind this to a string value to programmatically control the active tab.
		 */
		value?: MeltTabsProps["defaultValue"] & {};

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltTabsProps["defaultValue"]>;

		/**
		 * The orientation of the tabs, which determines how keyboard navigation works.
		 *
		 * @defaultValue "horizontal"
		 */
		orientation?: MeltTabsProps["orientation"] & {};
	} & DOMElement
>;

export type TabsContentPropsWithoutHTML = Expand<
	{
		value: string;
	} & DOMElement
>;

export type TabsTriggerPropsWithoutHTML = Expand<
	ObjectVariation<MeltTabsTriggerProps> & DOMElement<HTMLButtonElement>
>;

export type TabsListPropsWithoutHTML = DOMElement;
//

export type TabsProps = TabsPropsWithoutHTML & HTMLDivAttributes;

export type TabsContentProps = TabsContentPropsWithoutHTML & HTMLDivAttributes;

export type TabsTriggerProps = TabsTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type TabsListProps = TabsListPropsWithoutHTML & HTMLDivAttributes;

export type TabsTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
};
