import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionParams
} from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

import type { CreateDialogProps, DialogComponentEvents } from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<Omit<CreateDialogProps, "role">> & {
		open?: CreateDialogProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateDialogProps["defaultOpen"]>;
	}
>;

type TriggerProps = AsChild & HTMLButtonAttributes;

type CloseProps = TriggerProps;

type ContentProps<T extends Transition = Transition> = HTMLDivAttributes & {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
};

type DescriptionProps = AsChild & HTMLDivAttributes;
type OverlayProps = AsChild & HTMLDivAttributes;
type PortalProps = AsChild & HTMLDivAttributes;
type TitleProps = AsChild & {
	level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & HTMLHeadingAttributes;

type TriggerEvents = DialogComponentEvents["trigger"];
type CloseEvents = DialogComponentEvents["close"];

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
