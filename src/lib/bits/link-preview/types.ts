import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	OnChangeFn,
	Transition,
	TransitionParams,
	AsChild
} from "$internal/index.js";
import type { CreateLinkPreviewProps, LinkPreviewComponentEvents } from "@melt-ui/svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateLinkPreviewProps> & {
		open?: CreateLinkPreviewProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreateLinkPreviewProps["defaultOpen"]>;
	}
>;

type TriggerProps = AsChild & HTMLAnchorAttributes;
type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type TriggerEvents = LinkPreviewComponentEvents["trigger"];
type ContentEvents = LinkPreviewComponentEvents["content"];

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
