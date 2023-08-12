import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	Transition,
	TransitionParams,
	OnChangeFn,
	KeydownClickEvents
} from "$internal/index.js";
import type { CreatePopoverProps, PopoverComponentEvents } from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreatePopoverProps> & {
		open?: CreatePopoverProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreatePopoverProps["defaultOpen"]>;
	}
>;

type ContentProps<T extends Transition = Transition> = HTMLDivAttributes & {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
};

type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

type CloseProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

type TriggerEvents = PopoverComponentEvents["trigger"] & KeydownClickEvents;
type CloseEvents = PopoverComponentEvents["close"] & KeydownClickEvents;

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
