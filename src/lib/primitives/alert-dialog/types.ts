import type {
	HTMLDivAttributes,
	OmitOpen,
	Expand,
	HTMLHeadingAttributes,
	OnChangeFn,
	KeydownClickEvents,
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

type TriggerProps = HTMLButtonAttributes & {
	asChild?: boolean;
};

type ActionProps = TriggerProps;
type CancelProps = TriggerProps;
type ContentProps<T extends Transition = Transition> = HTMLDivAttributes & {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
};
type DescriptionProps = HTMLDivAttributes;
type OverlayProps = HTMLDivAttributes;
type PortalProps = HTMLDivAttributes;
type TitleProps = {
	level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & HTMLHeadingAttributes;

type TriggerEvents = DialogComponentEvents["trigger"] & KeydownClickEvents;
type CancelEvents = DialogComponentEvents["close"] & KeydownClickEvents;
type ActionEvents = CancelEvents;

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
