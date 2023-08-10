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
	AccordionHeadingProps as _HeadingProps
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitValue<CreateAccordionProps> & {
		value?: CreateAccordionProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateAccordionProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type ItemProps = ObjectVariation<_ItemProps> & HTMLDivAttributes;
type HeaderProps = ObjectVariation<_HeadingProps> & HTMLDivAttributes;
type TriggerProps = HTMLButtonAttributes;

type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & HTMLDivAttributes;

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
	ContentProps as AccordionContentProps
};
