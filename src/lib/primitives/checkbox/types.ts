import type { Expand, HTMLDivAttributes, OmitChecked, OnChangeFn } from "$internal/index.js";
import type { CreateCheckboxProps } from "@melt-ui/svelte";
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

export type {
	Props,
	IndicatorProps,
	InputProps,
	//
	Props as CheckboxProps,
	IndicatorProps as CheckboxIndicatorProps,
	InputProps as CheckboxInputProps
};
