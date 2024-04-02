import type { HTMLButtonAttributes } from "svelte/elements";
import type {
	AccordionHeadingProps as MeltAccordionHeadingProps,
	AccordionItemProps as MeltAccordionItemProps,
	CreateAccordionProps as MeltAccordionProps,
} from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitForceVisible,
	OmitValue,
	OnChangeFn,
	Transition,
	TransitionProps,
} from "$lib/internal/index.js";

export type AccordionPropsWithoutHTML<Multiple extends boolean> = Expand<
	OmitValue<OmitForceVisible<MeltAccordionProps<Multiple>>> & {
		/**
		 * The value of the accordion.
		 * You can bind this to a value to programmatically control the open state.
		 */
		value?: MeltAccordionProps<Multiple>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltAccordionProps<Multiple>["defaultValue"]>;
	} & DOMElement
>;

export type AccordionItemPropsWithoutHTML = Expand<
	ObjectVariation<MeltAccordionItemProps> & DOMElement
>;

export type AccordionHeaderPropsWithoutHTML = Expand<
	{
		/**
		 * The heading level of the accordion header.
		 */
		level?: ObjectVariation<MeltAccordionHeadingProps>["level"];
	} & DOMElement
>;

export type AccordionTriggerPropsWithoutHTML = DOMElement<HTMLButtonElement>;

export type AccordionContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type AccordionProps<Multiple extends boolean> = AccordionPropsWithoutHTML<Multiple> &
	Omit<HTMLDivAttributes, "type">;

export type AccordionItemProps = AccordionItemPropsWithoutHTML & HTMLDivAttributes;

export type AccordionHeaderProps = AccordionHeaderPropsWithoutHTML & HTMLDivAttributes;

export type AccordionTriggerProps = AccordionTriggerPropsWithoutHTML & HTMLButtonAttributes;

export type AccordionContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = AccordionContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type AccordionTriggerEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};
