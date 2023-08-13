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

type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type CloseProps = AsChild & HTMLButtonAttributes;

type TriggerEvents = PopoverComponentEvents["trigger"];
type CloseEvents = PopoverComponentEvents["close"];

export type {
	Props,
	CloseProps,
	ContentProps,
	TriggerProps,
	//
	Props as PopoverProps,
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
