import type {
	HTMLDivAttributes,
	OmitOpen,
	Expand,
	HTMLHeadingAttributes,
	OnChangeFn,
	Transition,
	AsChild,
	TransitionProps
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateDialogProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitOpen<Omit<CreateDialogProps, "role">> & {
		open?: boolean & {};
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

type TriggerProps = AsChild & HTMLButtonAttributes;

type ActionProps = TriggerProps;
type CancelProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type DescriptionProps = AsChild & HTMLDivAttributes;

type OverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type PortalProps = AsChild & HTMLDivAttributes;

type TitleProps = Expand<
	{
		level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	} & AsChild
> &
	HTMLHeadingAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type ActionEvents = TriggerEvents;
type CancelEvents = TriggerEvents;

export type {
	Props,
	TriggerProps,
	ActionProps,
	CancelProps,
	ContentProps,
	DescriptionProps,
	OverlayProps,
	PortalProps,
	TitleProps,
	//
	Props as AlertDialogProps,
	TriggerProps as AlertDialogTriggerProps,
	ActionProps as AlertDialogActionProps,
	CancelProps as AlertDialogCancelProps,
	ContentProps as AlertDialogContentProps,
	DescriptionProps as AlertDialogDescriptionProps,
	OverlayProps as AlertDialogOverlayProps,
	PortalProps as AlertDialogPortalProps,
	TitleProps as AlertDialogTitleProps,
	//
	TriggerEvents,
	CancelEvents,
	ActionEvents,
	//
	TriggerEvents as AlertDialogTriggerEvents,
	CancelEvents as AlertDialogCancelEvents,
	ActionEvents as AlertDialogActionEvents
};
