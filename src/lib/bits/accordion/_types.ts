import type {
	ObjectVariation,
	Transition,
	OmitValue,
	OmitForceVisible,
	Expand,
	OnChangeFn,
	TransitionProps,
	DOMElement
} from "$lib/internal/index.js";
import type {
	CreateAccordionProps,
	AccordionItemProps,
	AccordionHeadingProps
} from "@melt-ui/svelte";

type Props<Multiple extends boolean> = Expand<
	OmitValue<OmitForceVisible<CreateAccordionProps<Multiple>>> & {
		/**
		 * The value of the accordion.
		 * You can bind this to a value to programmatically control the open state.
		 */
		value?: CreateAccordionProps<Multiple>["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<CreateAccordionProps<Multiple>["defaultValue"]>;
	} & DOMElement
>;

type ItemProps = Expand<ObjectVariation<AccordionItemProps> & DOMElement>;

type HeaderProps = Expand<
	{
		/**
		 * The heading level of the accordion header.
		 */
		level?: ObjectVariation<AccordionHeadingProps>["level"];
	} & DOMElement
>;

type TriggerProps = DOMElement<HTMLButtonElement>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & DOMElement>;

export type { Props, ItemProps, HeaderProps, TriggerProps, ContentProps };
