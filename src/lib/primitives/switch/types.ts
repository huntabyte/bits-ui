import type { CreateSwitchProps, SwitchComponentEvents } from "@melt-ui/svelte";
import type {
	Expand,
	HTMLSpanAttributes,
	KeydownClickEvents,
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
	HTMLButtonAttributes;

type ThumbProps = HTMLSpanAttributes;

type Events = SwitchComponentEvents["root"] & KeydownClickEvents;

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
