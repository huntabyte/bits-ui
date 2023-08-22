import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	OnChangeFn,
	Transition,
	AsChild,
	TransitionProps
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

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerEvents = LinkPreviewComponentEvents["trigger"];
type ContentEvents = LinkPreviewComponentEvents["content"];

export type {
	Props,
	ArrowProps,
	TriggerProps,
	ContentProps,
	//
	Props as LinkPreviewProps,
	ArrowProps as LinkPreviewArrowProps,
	TriggerProps as LinkPreviewTriggerProps,
	ContentProps as LinkPreviewContentProps,
	//
	TriggerEvents,
	ContentEvents,
	//
	TriggerEvents as LinkPreviewTriggerEvents,
	ContentEvents as LinkPreviewContentEvents
};
