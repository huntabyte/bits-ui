import type {
	Expand,
	HTMLDivAttributes,
	OmitValue,
	OnChangeFn,
	ObjectVariation,
	AsChild
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
	} & AsChild
> &
	HTMLDivAttributes;

type InputProps = AsChild & HTMLInputAttributes;

type ItemProps = Expand<ObjectVariation<RadioGroupItemProps> & AsChild> & HTMLButtonAttributes;

type ItemEvents = RadioGroupComponentEvents["item"];

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
