import type { CreateSelectProps, SelectComponentEvents, SelectOptionProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitOpen,
	OmitValue,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$internal/index.js";
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { ButtonEventHandler, DivEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitOpen<OmitValue<Omit<CreateSelectProps, "defaultValueLabel">>> & {
		value?: CreateSelectProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateSelectProps["defaultValue"]>;
		open?: CreateSelectProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateSelectProps["defaultOpen"]>;
		label?: CreateSelectProps["defaultValueLabel"] & {};
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

type ItemEvents = {
	"m-click": DivEventHandler<MouseEvent>;
	"m-keydown": DivEventHandler<KeyboardEvent>;
};

type TriggerEvents = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
};

type LabelEvents = SelectComponentEvents["label"];
type ContentEvents = SelectComponentEvents["menu"];

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
