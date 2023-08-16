import type {
	HTMLDivAttributes,
	ObjectVariation,
	Transition,
	TransitionParams,
	OmitValue,
	Expand,
	OnChangeFn
} from "$internal/index.js";
import type {
	CreateAccordionProps,
	AccordionItemProps as _ItemProps,
	AccordionHeadingProps as _HeadingProps,
	AccordionComponentEvents
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitValue<CreateAccordionProps> & {
		value?: CreateAccordionProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateAccordionProps["defaultValue"]>;
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type ItemProps = {
	asChild?: boolean;
} & ObjectVariation<_ItemProps> &
	HTMLDivAttributes;

type HeaderProps = {
	asChild?: boolean;
	level?: ObjectVariation<_HeadingProps>["level"];
} & HTMLDivAttributes;

type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
	asChild?: boolean;
} & HTMLDivAttributes;

type TriggerEvents = AccordionComponentEvents["trigger"];

export type {
	Props,
	ItemProps,
	HeaderProps,
	TriggerProps,
	ContentProps,
	//
	Props as AccordionProps,
	ItemProps as AccordionItemProps,
	HeaderProps as AccordionHeaderProps,
	TriggerProps as AccordionTriggerProps,
	ContentProps as AccordionContentProps,
	//
	TriggerEvents,
	//
	TriggerEvents as AccordionTriggerEvents
};
