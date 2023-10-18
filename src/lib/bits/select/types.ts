import type { CreateSelectProps, SelectOptionProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitOpen,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitOpen<Omit<CreateSelectProps, "selected" | "defaultSelected" | "onSelectedChange">> & {
		selected?: CreateSelectProps["defaultSelected"] & {};
		onSelectedChange?: OnChangeFn<CreateSelectProps["defaultSelected"]>;
		open?: CreateSelectProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateSelectProps["defaultOpen"]>;
	}
>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type GroupProps = AsChild & HTMLDivAttributes;
type InputProps = AsChild & HTMLInputAttributes;
type LabelProps = AsChild & HTMLDivAttributes;
type ItemProps = Expand<SelectOptionProps & AsChild> & HTMLDivAttributes;
type SeparatorProps = AsChild & HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type ValueProps = Expand<
	{
		placeholder?: string;
	} & AsChild
> &
	HTMLAttributes<HTMLSpanElement>;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
> &
	HTMLDivAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type LabelEvents<T extends Element = HTMLSpanElement> = {
	click: CustomEventHandler<MouseEvent, T>;
};
type ContentEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
};

export type {
	Props,
	ArrowProps,
	ContentProps,
	GroupProps,
	InputProps,
	LabelProps,
	ItemProps,
	SeparatorProps,
	TriggerProps,
	ValueProps,
	//
	Props as SelectProps,
	ArrowProps as SelectArrowProps,
	ContentProps as SelectContentProps,
	GroupProps as SelectGroupProps,
	InputProps as SelectInputProps,
	LabelProps as SelectLabelProps,
	ItemProps as SelectItemProps,
	SeparatorProps as SelectSeparatorProps,
	TriggerProps as SelectTriggerProps,
	ValueProps as SelectValueProps,
	//
	ItemEvents,
	ContentEvents,
	TriggerEvents,
	LabelEvents,
	//
	ItemEvents as SelectItemEvents,
	ContentEvents as SelectContentEvents,
	TriggerEvents as SelectTriggerEvents,
	LabelEvents as SelectLabelEvents
};
