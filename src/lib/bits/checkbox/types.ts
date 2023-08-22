import type {
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OnChangeFn,
	AsChild
} from "$internal/index.js";
import type { ButtonEventHandler } from "$lib/index.js";
import type { CreateCheckboxProps } from "@melt-ui/svelte";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitChecked<CreateCheckboxProps> & {
		checked?: CreateCheckboxProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateCheckboxProps["defaultChecked"]>;
	} & AsChild
> &
	HTMLButtonAttributes;

type IndicatorProps = HTMLDivAttributes;
type InputProps = Omit<HTMLInputAttributes, "value">;

type Events = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
};

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
