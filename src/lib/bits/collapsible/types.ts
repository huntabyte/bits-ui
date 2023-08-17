import type {
	HTMLDivAttributes,
	Transition,
	TransitionParams,
	OmitOpen,
	Expand,
	OnChangeFn,
	AsChild
} from "$internal/index.js";
import type { CollapsibleComponentEvents, CreateCollapsibleProps } from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateCollapsibleProps> & {
		open?: CreateCollapsibleProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateCollapsibleProps["defaultOpen"]> & {};
	}
> &
	AsChild &
	HTMLDivAttributes;

type ContentProps<T extends Transition = Transition> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type TriggerEvents = CollapsibleComponentEvents["trigger"];

export type {
	Props,
	ContentProps,
	TriggerProps,
	//
	Props as CollapsibleProps,
	ContentProps as CollapsibleContentProps,
	TriggerProps as CollapsibleTriggerProps,
	//
	TriggerEvents,
	//
	TriggerEvents as CollapsibleTriggerEvents
};
