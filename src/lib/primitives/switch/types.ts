import type { CreateSwitchProps, SwitchComponentEvents } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn
} from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
		checked?: CreateSwitchProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateSwitchProps["defaultChecked"]>;
	}
> &
	AsChild &
	HTMLButtonAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type Events = SwitchComponentEvents["root"];

export type {
	Props,
	ThumbProps,
	//
	Props as SwitchProps,
	ThumbProps as SwitchThumbProps,
	//
	Events,
	//
	Events as SwitchEvents
};
