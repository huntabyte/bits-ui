import type { CreateSelectProps, SelectComponentEvents, SelectOptionProps } from "@melt-ui/svelte";
import type {
	Expand,
	HTMLDivAttributes,
	KeydownClickEvents,
	OmitOpen,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<OmitValue<Omit<CreateSelectProps, "defaultValueLabel" | "forceVisible">>> & {
		value?: CreateSelectProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateSelectProps["defaultValue"]>;
		open?: CreateSelectProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateSelectProps["defaultOpen"]>;
		label?: CreateSelectProps["defaultValueLabel"] & {};
	}
>;

type ContentProps = HTMLDivAttributes;
type GroupProps = HTMLDivAttributes;
type InputProps = HTMLInputAttributes;
type LabelProps = HTMLDivAttributes;
type ItemProps = Expand<
	SelectOptionProps & {
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;
type SeparatorProps = HTMLDivAttributes;
type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;
type ValueProps = {
	placeholder?: string;
} & HTMLAttributes<HTMLSpanElement>;

type ItemEvents = SelectComponentEvents["option"] & KeydownClickEvents;
type ContentEvents = SelectComponentEvents["menu"] & KeydownClickEvents;
type TriggerEvents = SelectComponentEvents["trigger"] & KeydownClickEvents;
type LabelEvents = SelectComponentEvents["label"];

export type {
	Props,
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
