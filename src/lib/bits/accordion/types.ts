import type {
	HTMLDivAttributes,
	ObjectVariation,
	Transition,
	OmitValue,
	Expand,
	OnChangeFn,
	AsChild,
	TransitionProps
} from "$internal/index.js";
import type { ButtonEventHandler } from "$lib/index.js";
import type {
	CreateAccordionProps,
	AccordionItemProps as _ItemProps,
	AccordionHeadingProps as _HeadingProps
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

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type TriggerEvents = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
};

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
