import type { OmitOpen, Expand, HTMLDivAttributes, OnChangeFn } from "$internal/index.js";
import type { CreateHoverCardProps } from "@melt-ui/svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateHoverCardProps> & {
		open?: CreateHoverCardProps["defaultOpen"];
		onOpenChange?: OnChangeFn<CreateHoverCardProps["defaultOpen"]>;
	}
>;
type TriggerProps = HTMLAnchorAttributes;
type ContentProps = HTMLDivAttributes;

export type {
	Props,
	TriggerProps,
	ContentProps,
	//
	Props as HoverCardProps,
	TriggerProps as HoverCardTriggerProps,
	ContentProps as HoverCardContentProps
};
