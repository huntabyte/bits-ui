import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	Transition,
	OnChangeFn,
	AsChild,
	TransitionProps
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { CreatePopoverProps } from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreatePopoverProps> & {
		open?: boolean;
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;
type CloseProps = AsChild & HTMLButtonAttributes;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type CloseEvents = TriggerEvents;

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
