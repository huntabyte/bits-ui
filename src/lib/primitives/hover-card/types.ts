import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	OnChangeFn,
	Transition,
	TransitionParams,
	AsChild
} from "$internal/index.js";
import type { CreateHoverCardProps, HoverCardComponentEvents } from "@melt-ui/svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateHoverCardProps> & {
		open?: CreateHoverCardProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreateHoverCardProps["defaultOpen"]>;
	}
>;

type TriggerProps = AsChild & HTMLAnchorAttributes;
type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type TriggerEvents = HoverCardComponentEvents["trigger"];
type ContentEvents = HoverCardComponentEvents["content"];

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
