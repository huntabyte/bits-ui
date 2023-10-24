import type { CustomEventHandler } from "$lib/index.js";
import type {
	OmitOpen,
	Expand,
	HTMLDivAttributes,
	OnChangeFn,
	Transition,
	AsChild,
	TransitionProps
} from "$lib/internal/index.js";
import type { CreateLinkPreviewProps } from "@melt-ui/svelte";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateLinkPreviewProps> & {
		open?: boolean;
		onOpenChange?: OnChangeFn<boolean>;
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

type TriggerEvents<T extends Element = HTMLAnchorElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	blur: CustomEventHandler<FocusEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};
type ContentEvents<T extends Element = HTMLDivElement> = {
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
};

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
