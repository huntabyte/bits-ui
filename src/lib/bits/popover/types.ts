import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	Transition,
	TransitionParams,
	OnChangeFn,
	AsChild
} from "$internal/index.js";
import type { CreatePopoverProps, PopoverComponentEvents } from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreatePopoverProps> & {
		open?: CreatePopoverProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreatePopoverProps["defaultOpen"]>;
	}
>;

type ContentProps<T extends Transition = Transition> = Expand<
	{
		transition?: T;
		transitionConfig?: TransitionParams<T>;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;
type CloseProps = AsChild & HTMLButtonAttributes;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerEvents = PopoverComponentEvents["trigger"];
type CloseEvents = PopoverComponentEvents["close"];

export type {
	Props,
	CloseProps,
	ArrowProps,
	ContentProps,
	TriggerProps,
	//
	Props as PopoverProps,
	ArrowProps as PopoverArrowProps,
	CloseProps as PopoverCloseProps,
	ContentProps as PopoverContentProps,
	TriggerProps as PopoverTriggerProps,
	//
	TriggerEvents,
	CloseEvents,
	//
	TriggerEvents as PopoverTriggerEvents,
	CloseEvents as PopoverCloseEvents
};
