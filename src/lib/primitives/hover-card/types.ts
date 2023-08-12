import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	OnChangeFn,
	KeydownClickEvents,
	Transition,
	TransitionParams
} from "$internal/index.js";
import type { CreateHoverCardProps, HoverCardComponentEvents } from "@melt-ui/svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateHoverCardProps> & {
		open?: CreateHoverCardProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreateHoverCardProps["defaultOpen"]>;
	}
>;
type TriggerProps = HTMLAnchorAttributes;
type ContentProps<T extends Transition = Transition> = HTMLDivAttributes & {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
};
type TriggerEvents = HoverCardComponentEvents["trigger"] & KeydownClickEvents;
type ContentEvents = HoverCardComponentEvents["content"] & KeydownClickEvents;

export type {
	Props,
	TriggerProps,
	ContentProps,
	//
	Props as HoverCardProps,
	TriggerProps as HoverCardTriggerProps,
	ContentProps as HoverCardContentProps,
	//
	TriggerEvents,
	ContentEvents,
	//
	TriggerEvents as HoverCardTriggerEvents,
	ContentEvents as HoverCardContentEvents
};
