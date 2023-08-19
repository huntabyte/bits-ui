import type {
	HTMLDivAttributes,
	ObjectVariation,
	Transition,
	TransitionParams,
	OmitValue,
	Expand,
	OnChangeFn,
	AsChild
} from "$internal/index.js";
import type {
	CreateAccordionProps,
	AccordionItemProps as _ItemProps,
	AccordionHeadingProps as _HeadingProps,
	AccordionComponentEvents
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props<Multiple extends boolean> = Expand<
	OmitValue<CreateAccordionProps<Multiple>> & {
		value?: CreateAccordionProps<Multiple>["defaultValue"];
		onValueChange?: OnChangeFn<CreateAccordionProps<Multiple>["defaultValue"]>;
	} & AsChild
> &
	HTMLDivAttributes;

type ItemProps = Expand<ObjectVariation<_ItemProps> & AsChild> & HTMLDivAttributes;

type HeaderProps = Expand<
	{
		level?: ObjectVariation<_HeadingProps>["level"];
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type ContentProps<T extends Transition = Transition> = Expand<
	{
		transition?: T;
		transitionConfig?: TransitionParams<T>;
	} & AsChild
> &
	HTMLDivAttributes;

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
