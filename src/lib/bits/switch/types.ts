import type { CreateSwitchProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
		checked?: boolean;
		onCheckedChange?: OnChangeFn<boolean>;
	} & AsChild
> &
	HTMLButtonAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type InputProps = HTMLInputAttributes;

type Events<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
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
