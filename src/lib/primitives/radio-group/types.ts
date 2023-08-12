import type {
	Expand,
	HTMLDivAttributes,
	KeydownClickEvents,
	OmitValue,
	OnChangeFn,
	ObjectVariation
} from "$internal/index.js";
import type {
	CreateRadioGroupProps,
	RadioGroupComponentEvents,
	RadioGroupItemProps
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitValue<CreateRadioGroupProps> & {
		value?: CreateRadioGroupProps["defaultValue"];
		onValueChange?: OnChangeFn<CreateRadioGroupProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type InputProps = HTMLInputAttributes;

type ItemProps = Expand<
	ObjectVariation<RadioGroupItemProps> & {
		asChild?: boolean;
	}
> &
	HTMLButtonAttributes;

type ItemEvents = RadioGroupComponentEvents["item"] & KeydownClickEvents;

export type {
	Props,
	InputProps,
	ItemProps,
	//
	Props as RadioGroupProps,
	InputProps as RadioGroupInputProps,
	ItemProps as RadioGroupItemProps,
	//
	ItemEvents,
	//
	ItemEvents as RadioGroupItemEvents
};
