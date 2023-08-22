import type { CreateSwitchProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn
} from "$internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { ButtonEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
		checked?: CreateSwitchProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateSwitchProps["defaultChecked"]>;
	} & AsChild
> &
	HTMLButtonAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type InputProps = HTMLInputAttributes;

type Events = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
};

export type {
	Props,
	ThumbProps,
	InputProps,
	//
	Props as SwitchProps,
	ThumbProps as SwitchThumbProps,
	InputProps as SwitchInputProps,
	//
	Events,
	//
	Events as SwitchEvents
};
