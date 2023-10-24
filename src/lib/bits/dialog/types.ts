import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateDialogProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitOpen<Omit<CreateDialogProps, "role">> & {
		open?: CreateDialogProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

type TriggerProps = AsChild & HTMLButtonAttributes;

type CloseProps = TriggerProps;

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
type CloseEvents = TriggerEvents;

export type {
	Props,
	CloseProps,
	TitleProps,
	PortalProps,
	ContentProps,
	TriggerProps,
	OverlayProps,
	DescriptionProps,
	//
	Props as DialogProps,
	CloseProps as DialogCloseProps,
	TitleProps as DialogTitleProps,
	PortalProps as DialogPortalProps,
	ContentProps as DialogContentProps,
	TriggerProps as DialogTriggerProps,
	OverlayProps as DialogOverlayProps,
	DescriptionProps as DialogDescriptionProps,
	//
	TriggerEvents,
	CloseEvents,
	//
	TriggerEvents as DialogTriggerEvents,
	CloseEvents as DialogCloseEvents
};
