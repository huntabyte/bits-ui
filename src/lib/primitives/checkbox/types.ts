import type {
	Expand,
	HTMLDivAttributes,
	KeydownClickEvents,
	OmitChecked,
	OnChangeFn
} from "$internal/index.js";
import type { CheckboxComponentEvents, CreateCheckboxProps } from "@melt-ui/svelte";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitChecked<CreateCheckboxProps> & {
		checked?: CreateCheckboxProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateCheckboxProps["defaultChecked"]>;
	}
> &
	HTMLButtonAttributes;

type IndicatorProps = HTMLDivAttributes;
type InputProps = HTMLInputAttributes;

type Events = CheckboxComponentEvents["root"] & KeydownClickEvents;

export type {
	Props,
	IndicatorProps,
	InputProps,
	//
	Props as CheckboxProps,
	IndicatorProps as CheckboxIndicatorProps,
	InputProps as CheckboxInputProps,
	//
	Events,
	//
	Events as CheckboxEvents
};
